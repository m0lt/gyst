# 🧪 Notification System - Test Guide

## Vorbereitung

### 1. Deine User ID herausfinden

**Option A: Browser Console**
```javascript
// In der Browser Console ausführen (nach Login):
const session = JSON.parse(localStorage.getItem('sb-rfxunxcxchjtgxjwswfe-auth-token'))
console.log('User ID:', session.user.id)
```

**Option B: Supabase Dashboard**
- Gehe zu Supabase Dashboard → Authentication → Users
- Kopiere deine User ID

**Option C: Network Tab**
- Öffne DevTools → Network Tab
- Lade eine geschützte Seite
- Schau in die Request Headers nach `Authorization: Bearer ...`
- Dekodiere das JWT Token auf https://jwt.io

---

## Test 1: Push Notifications aktivieren

### Schritt-für-Schritt

1. **Navigiere zu Settings**
   ```
   http://localhost:3000/protected/settings/notifications
   ```

2. **Klicke auf "Request Notification Permission"**
   - Browser sollte ein Permission-Popup zeigen
   - Klicke auf "Allow" / "Zulassen"

3. **Erwartetes Verhalten:**
   - ✅ Button verschwindet
   - ✅ Grüner Success-Banner erscheint: "Push notifications enabled"
   - ✅ Browser Console zeigt: `✅ Push subscription created: PushSubscription {...}`
   - ✅ Service Worker registriert: `[Service Worker] Push notification handlers registered`

4. **Verifizierung in Supabase:**
   ```sql
   -- Im Supabase SQL Editor:
   SELECT * FROM push_subscriptions
   WHERE user_id = 'DEINE_USER_ID';
   ```

   Sollte einen Eintrag zeigen mit:
   - `endpoint`: FCM/Chrome Push URL
   - `keys`: Object mit `p256dh` und `auth`

---

## Test 2: Notification Preferences einstellen

### Schritt-für-Schritt

1. **Scrolle auf der Settings-Seite nach unten**
   - Formular "Notification Preferences" sollte sichtbar sein

2. **Konfiguriere Einstellungen:**
   - ✅ Toggle "Email Notifications" an/aus
   - ✅ Toggle "Push Notifications" an/aus
   - ✅ Setze "Max notifications per day" (z.B. 5)
   - ✅ Setze "Quiet Hours Start" (z.B. 22:00)
   - ✅ Setze "Quiet Hours End" (z.B. 08:00)
   - ✅ Wähle Tone Progression (z.B. Friendly → Neutral → Urgent)

3. **Klicke "Save Preferences"**

4. **Erwartetes Verhalten:**
   - ✅ Success-Message erscheint
   - ✅ Seite revalidiert automatisch

5. **Verifizierung in Supabase:**
   ```sql
   SELECT * FROM notification_preferences
   WHERE user_id = 'DEINE_USER_ID';
   ```

---

## Test 3: Notification Center ansehen

### Schritt-für-Schritt

1. **Navigiere zum Notification Center**
   ```
   http://localhost:3000/protected/notifications
   ```

2. **Falls leer:**
   - "No Notifications" Card wird angezeigt
   - Das ist OK - wir haben noch keine erstellt!

3. **Um Test-Notifikationen zu erstellen:**

   Führe das Test-Script aus:
   ```bash
   npx tsx scripts/test-notifications.ts DEINE_USER_ID 3
   ```

4. **Reload die Seite**
   - ✅ Notification sollte in der Liste erscheinen
   - ✅ Status-Badge: "Pending" (gelb)
   - ✅ Type: "task_reminder"
   - ✅ Channel Icon: Email oder Push

5. **Filter testen:**
   - Klicke auf "All", "Sent", "Pending", "Failed"
   - Liste sollte entsprechend filtern

6. **Notification löschen:**
   - Klicke auf Trash-Icon
   - Notification verschwindet

---

## Test 4: Push Notification senden

### Schritt-für-Schritt

1. **Stelle sicher Push Permission ist aktiviert** (Test 1)

2. **Sende Test-Push mit Script:**
   ```bash
   npx tsx scripts/test-notifications.ts DEINE_USER_ID 2
   ```

3. **Erwartetes Verhalten:**
   - ✅ Console zeigt: `✅ Push notification sent successfully!`
   - ✅ Browser zeigt native Notification:
     - Titel: "🧪 Test Notification"
     - Body: "This is a test push notification from Gyst!"
   - ✅ Klick auf Notification öffnet `/protected/notifications`

4. **Troubleshooting:**
   - Wenn keine Notification erscheint:
     - Prüfe Browser-Einstellungen: Benachrichtigungen für localhost erlaubt?
     - Prüfe Service Worker Status: DevTools → Application → Service Workers
     - Prüfe Console auf Fehler

---

## Test 5: Email-Funktionalität (Vorbereitung)

### Wichtig: Resend Domain Verification erforderlich!

Aktuell können wir **nur Emails queuen**, aber nicht senden, weil:
- Resend Domain noch nicht verifiziert
- Sender Email noch nicht validiert

### Was du jetzt testen kannst:

1. **Email queuen:**
   ```bash
   npx tsx scripts/test-notifications.ts DEINE_USER_ID 4
   ```

2. **Verifizierung in Supabase:**
   ```sql
   SELECT * FROM notification_queue
   WHERE user_id = 'DEINE_USER_ID'
   AND channel = 'email';
   ```

3. **Email Templates ansehen:**
   - Datei öffnen: `lib/notifications/email-service.ts`
   - Schau dir HTML-Templates an:
     - `generateTaskReminderHTML()`
     - `generateWeeklyDigestHTML()`

### Um Emails wirklich zu senden:

**Option A: Resend Domain verifizieren**
1. Gehe zu https://resend.com/domains
2. Füge deine Domain hinzu
3. Setze DNS-Records (SPF, DKIM)
4. Warte auf Verification

**Option B: Resend Test-Email verwenden**
1. In Resend Dashboard → Settings → Verified Emails
2. Füge deine Email hinzu
3. Bestätige Verification-Email
4. Nutze diese Email als `RESEND_FROM_EMAIL` in `.env`

---

## Test 6: Vollständiger Workflow

### Szenario: Task Reminder Notification

1. **Erstelle eine Task** (in der App)
   ```
   http://localhost:3000/protected/tasks
   ```

2. **Server Action aufrufen** (in Browser Console):
   ```javascript
   // Trigger Task Reminder Queue
   const response = await fetch('/api/actions/notifications', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       action: 'queueTaskReminder',
       userId: 'DEINE_USER_ID',
       taskId: 'TASK_ID',
       scheduledFor: new Date(Date.now() + 5000).toISOString() // in 5 Sekunden
     })
   });
   console.log(await response.json());
   ```

3. **Warte 5 Sekunden**

4. **Check Notification Center:**
   - Sollte neue Notification zeigen
   - Status: "Pending" → dann "Sent" (wenn Cron läuft)

---

## Database Verification Queries

### Alle Tables auf einmal checken:

```sql
-- Push Subscriptions
SELECT
  ps.id,
  ps.user_id,
  LEFT(ps.endpoint, 50) as endpoint_preview,
  ps.created_at
FROM push_subscriptions ps
WHERE user_id = 'DEINE_USER_ID';

-- Notification Preferences
SELECT
  np.email_enabled,
  np.push_enabled,
  np.max_per_day,
  np.quiet_hours_start,
  np.quiet_hours_end,
  np.tone_progression,
  np.current_tone_index
FROM notification_preferences np
WHERE user_id = 'DEINE_USER_ID';

-- Notification Queue (letzte 10)
SELECT
  nq.id,
  nq.type,
  nq.channel,
  nq.subject,
  CASE
    WHEN nq.sent_at IS NOT NULL THEN 'Sent'
    WHEN nq.failed_at IS NOT NULL THEN 'Failed'
    ELSE 'Pending'
  END as status,
  nq.scheduled_for,
  nq.created_at
FROM notification_queue nq
WHERE user_id = 'DEINE_USER_ID'
ORDER BY created_at DESC
LIMIT 10;
```

---

## Test-Script Kommandos

```bash
# Alle Checks durchführen
npx tsx scripts/test-notifications.ts DEINE_USER_ID 5

# Nur Database Tables checken
npx tsx scripts/test-notifications.ts DEINE_USER_ID 1

# Nur Push Notification senden
npx tsx scripts/test-notifications.ts DEINE_USER_ID 2

# Nur Notification queuen
npx tsx scripts/test-notifications.ts DEINE_USER_ID 3

# Nur Email queuen
npx tsx scripts/test-notifications.ts DEINE_USER_ID 4
```

---

## Erwartete Ergebnisse Checklist

### ✅ Erfolgreiche Tests sollten zeigen:

**Push Notifications:**
- [ ] Permission-Dialog funktioniert
- [ ] Subscription wird in DB gespeichert
- [ ] Test-Push erscheint als Browser-Notification
- [ ] Click auf Notification öffnet richtige URL
- [ ] Service Worker ist aktiv

**Notification Preferences:**
- [ ] Formular lädt korrekt
- [ ] Toggles funktionieren
- [ ] Save speichert in DB
- [ ] Einstellungen bleiben nach Reload erhalten

**Notification Center:**
- [ ] Leere State zeigt "No Notifications"
- [ ] Gequeuete Notifications erscheinen
- [ ] Filter funktionieren (All/Sent/Pending/Failed)
- [ ] Delete entfernt Notifications
- [ ] Icons (Email/Push) werden korrekt angezeigt

**Email Service:**
- [ ] Emails werden in Queue eingetragen
- [ ] Template-Daten werden korrekt gespeichert
- [ ] HTML-Templates sind wohlgeformt

---

## Troubleshooting

### Push Notifications funktionieren nicht?

1. **Service Worker Check:**
   ```
   DevTools → Application → Service Workers
   ```
   - Status sollte "activated and running" sein
   - Falls nicht: "Unregister" und Seite neu laden

2. **VAPID Keys Check:**
   ```bash
   # .env prüfen
   echo $NEXT_PUBLIC_VAPID_PUBLIC_KEY
   echo $VAPID_PRIVATE_KEY
   ```

3. **Browser Permissions Check:**
   ```
   Chrome: chrome://settings/content/notifications
   Firefox: about:preferences#privacy → Notifications
   ```

### Database Fehler?

1. **RLS Policies checken:**
   ```sql
   -- In Supabase SQL Editor
   SELECT * FROM pg_policies
   WHERE tablename IN (
     'push_subscriptions',
     'notification_preferences',
     'notification_queue'
   );
   ```

2. **Migrations anwenden:**
   ```bash
   # Falls Tables fehlen
   supabase db push
   ```

### TypeScript Fehler?

```bash
# tsx installieren falls nicht vorhanden
npm install -D tsx

# Types neu generieren
npm run types
```

---

## Next Steps

Nach erfolgreichen Tests:

1. **Resend Domain verifizieren** für echte Emails
2. **Cron Job einrichten** für automatisches Senden
3. **Task Integration** für echte Reminder
4. **Icons generieren** für PWA manifest
5. **E2E Tests schreiben** mit Playwright

---

## Support

Bei Problemen:
1. Check Browser Console für Errors
2. Check Next.js Dev Server Terminal
3. Check Supabase Logs
4. Run: `npx tsx scripts/test-notifications.ts YOUR_ID 1` für DB status
