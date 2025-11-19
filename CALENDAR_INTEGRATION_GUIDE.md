# 📅 Calendar Integration Guide - Phase 4.1

## Status: Grundstruktur vorhanden, OAuth-Implementation erforderlich

Die Calendar Integration Grundstruktur ist fertig, aber für die vollständige Funktionalität werden **OAuth-Credentials von Google und Microsoft** benötigt.

---

## ✅ Was bereits implementiert ist:

### 1. **Typen & Interfaces** (`lib/calendar/types.ts`)
- `CalendarProvider` types (google, microsoft, apple)
- `CalendarConnection` interface
- `CalendarEvent` interface
- `CalendarSyncStatus` interface

### 2. **UI Component** (`components/settings/calendar-settings.tsx`)
- CalendarSettings component mit:
  - Provider-Auswahl (Google, Microsoft, Apple)
  - Connect/Disconnect Buttons
  - Sync Status Anzeige
  - OAuth-Hinweis für Developer

### 3. **Environment Variables** (`.env.example`)
- Google OAuth (CLIENT_ID, CLIENT_SECRET)
- Microsoft OAuth (CLIENT_ID, CLIENT_SECRET, TENANT_ID)
- OAuth Redirect URI

---

## ⏳ Was noch fehlt (für vollständige Integration):

### Phase 4.1.3: Google Calendar OAuth Flow
```typescript
// Benötigt: app/api/auth/google/route.ts
export async function GET(request: NextRequest) {
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID!);
  authUrl.searchParams.set('redirect_uri', process.env.OAUTH_REDIRECT_URI!);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'https://www.googleapis.com/auth/calendar');
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'consent');

  return NextResponse.redirect(authUrl.toString());
}
```

### Phase 4.1.4: Microsoft 365 OAuth Flow
```typescript
// Benötigt: app/api/auth/microsoft/route.ts
export async function GET(request: NextRequest) {
  const tenantId = process.env.MICROSOFT_TENANT_ID || 'common';
  const authUrl = new URL(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`);
  authUrl.searchParams.set('client_id', process.env.MICROSOFT_CLIENT_ID!);
  authUrl.searchParams.set('redirect_uri', process.env.OAUTH_REDIRECT_URI!);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'Calendars.ReadWrite offline_access');

  return NextResponse.redirect(authUrl.toString());
}
```

### Phase 4.1.5: OAuth Callback Handler
```typescript
// Benötigt: app/api/auth/callback/route.ts
export async function GET(request: NextRequest) {
  const code = searchParams.get('code');
  const provider = searchParams.get('state'); // google or microsoft

  // Exchange code for access token
  const tokenResponse = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  });

  const tokens = await tokenResponse.json();

  // Save to database: calendar_connections table
  await supabase.from('calendar_connections').insert({
    user_id,
    provider,
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at: new Date(Date.now() + tokens.expires_in * 1000),
  });

  return NextResponse.redirect('/protected/settings');
}
```

### Phase 4.1.6-4.1.7: Calendar Sync Service
```typescript
// Benötigt: lib/calendar/sync-service.ts

export async function syncGoogleCalendar(connection: CalendarConnection) {
  const calendar = google.calendar({ version: 'v3', auth: getOAuth2Client(connection) });

  const response = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    maxResults: 100,
    singleEvents: true,
    orderBy: 'startTime',
  });

  // Save events to database
  for (const event of response.data.items || []) {
    await supabase.from('calendar_events').upsert({
      calendar_connection_id: connection.id,
      external_id: event.id,
      title: event.summary,
      description: event.description,
      start_time: event.start.dateTime || event.start.date,
      end_time: event.end.dateTime || event.end.date,
      all_day: !event.start.dateTime,
    });
  }
}

export async function syncMicrosoftCalendar(connection: CalendarConnection) {
  const client = getMicrosoftGraphClient(connection);

  const events = await client
    .api('/me/calendar/events')
    .filter(`start/dateTime ge '${new Date().toISOString()}'`)
    .top(100)
    .get();

  // Similar upsert logic as Google
}
```

### Phase 4.1.8-4.1.9: Availability Calculation
```typescript
// Benötigt: lib/calendar/availability.ts

export async function calculateAvailability(userId: string, date: Date) {
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);

  // Get all calendar events for the day
  const { data: events } = await supabase
    .from('calendar_events')
    .select('start_time, end_time')
    .eq('user_id', userId)
    .gte('start_time', dayStart.toISOString())
    .lte('end_time', dayEnd.toISOString());

  // Calculate free slots
  const busySlots = events.map(e => ({
    start: new Date(e.start_time),
    end: new Date(e.end_time),
  }));

  return calculateFreeSlots(dayStart, dayEnd, busySlots);
}
```

### Phase 4.1.10-4.1.12: Background Sync
```typescript
// Benötigt: app/api/cron/calendar-sync/route.ts

export async function GET(request: NextRequest) {
  // Verify cron secret
  if (request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: connections } = await supabase
    .from('calendar_connections')
    .select('*')
    .eq('is_active', true);

  for (const connection of connections) {
    try {
      if (connection.provider === 'google') {
        await syncGoogleCalendar(connection);
      } else if (connection.provider === 'microsoft') {
        await syncMicrosoftCalendar(connection);
      }

      await supabase
        .from('calendar_connections')
        .update({ last_sync_at: new Date().toISOString() })
        .eq('id', connection.id);
    } catch (error) {
      console.error(`Sync failed for ${connection.id}:`, error);
    }
  }

  return NextResponse.json({ success: true });
}

// Add to vercel.json:
{
  "crons": [
    {
      "path": "/api/cron/weekly-digest",
      "schedule": "0 18 * * 0"
    },
    {
      "path": "/api/cron/calendar-sync",
      "schedule": "*/15 * * * *"  // Every 15 minutes
    }
  ]
}
```

---

## 🗄️ Database Migrations benötigt:

```sql
-- Calendar Connections Table
CREATE TABLE calendar_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider VARCHAR(20) NOT NULL, -- 'google', 'microsoft', 'apple'
  email VARCHAR(255) NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, provider, email)
);

-- Calendar Events Table
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  calendar_connection_id UUID NOT NULL REFERENCES calendar_connections(id) ON DELETE CASCADE,
  external_id VARCHAR(255), -- ID from Google/Microsoft
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  all_day BOOLEAN DEFAULT FALSE,
  location VARCHAR(255),
  attendees TEXT[], -- Array of email addresses
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(calendar_connection_id, external_id)
);

-- Indexes
CREATE INDEX idx_calendar_events_time ON calendar_events(start_time, end_time);
CREATE INDEX idx_calendar_events_connection ON calendar_events(calendar_connection_id);
CREATE INDEX idx_calendar_connections_user ON calendar_connections(user_id);
```

---

## 📦 npm Packages benötigt:

```bash
npm install googleapis @microsoft/microsoft-graph-client @azure/msal-node
```

---

## 🔐 OAuth App Setup:

### Google Calendar:
1. Gehe zu: https://console.cloud.google.com/
2. Erstelle neues Projekt oder wähle existierendes
3. Aktiviere "Google Calendar API"
4. Gehe zu "Credentials" → "Create Credentials" → "OAuth client ID"
5. Application type: "Web application"
6. Authorized redirect URIs: `http://localhost:3000/api/auth/callback` (+ production URL)
7. Kopiere Client ID und Client Secret in `.env`

### Microsoft 365:
1. Gehe zu: https://portal.azure.com/
2. Azure Active Directory → App registrations → New registration
3. Name: "Gyst Calendar Integration"
4. Supported account types: "Accounts in any organizational directory and personal Microsoft accounts"
5. Redirect URI: `http://localhost:3000/api/auth/callback` (+ production URL)
6. API permissions → Add permission → Microsoft Graph → Delegated → Calendars.ReadWrite, offline_access
7. Certificates & secrets → New client secret
8. Kopiere Application (client) ID und Client Secret in `.env`

---

## 🎯 Priorität & Empfehlung:

**Empfehlung**: Calendar Integration ist **optional** und kann später implementiert werden.

**Warum?**
- Komplex (OAuth Flows, Token Management, Sync Logic)
- Erfordert externe Developer Accounts
- Kein Blocker für andere Features
- PWA funktioniert auch ohne Calendar Integration

**Stattdessen zuerst:**
1. ✅ Phase 4 abschließen (fast fertig!)
2. ✅ Testing & QA (Phase 5)
3. ✅ Production deployment
4. 📆 Calendar Integration später hinzufügen

---

## 📝 Wenn du Calendar Integration jetzt machen willst:

1. **Setup OAuth Apps** (Google + Microsoft)
2. **Add Credentials** to `.env`
3. **Run migrations** (create tables)
4. **Install packages** (`googleapis`, `@microsoft/microsoft-graph-client`)
5. **Implement OAuth routes** (auth flow)
6. **Build sync service** (fetch & store events)
7. **Add cron job** (background sync)
8. **Test integration** end-to-end

Geschätzter Aufwand: **4-6 Stunden** für vollständige Implementation.

---

## ✅ Alternative: Minimale Calendar View

Wenn du nur eine **interne Kalenderansicht** willst (ohne externe Sync):

```typescript
// Simple internal calendar (already working with tasks)
- Task due dates → Calendar view
- Task completion history → Heatmap
- No external sync needed
```

Dies ist bereits durch die existierenden Task Features möglich!
