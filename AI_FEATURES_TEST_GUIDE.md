# KI-Features Test-Anleitung

## Voraussetzungen

### 1. OpenAI API Key eintragen

In der `.env` Datei:
```bash
OPENAI_API_KEY=sk-proj-...  # Ersetze mit deinem echten API Key
```

**API Key besorgen:**
1. Gehe zu https://platform.openai.com/api-keys
2. Erstelle einen neuen API Key
3. Kopiere den Key (beginnt mit `sk-proj-...`)
4. Füge ihn in die `.env` Datei ein
5. Starte den Dev-Server neu: `npm run dev`

### 2. Kosten-Information

Die implementierten Features nutzen **GPT-4o-mini**:
- **Input**: $0.15 pro 1M Tokens (~750k Wörter)
- **Output**: $0.60 pro 1M Tokens
- **24h Caching**: Reduziert Kosten um ~80%
- **Rate Limit**: 10 Requests pro User pro Tag

**Geschätzte Kosten pro Request**: ~$0.001-0.003 (0.1-0.3 Cent)

## Implementierte KI-Features

### 1. Onboarding Wizard
**Komponente**: `components/onboarding/onboarding-wizard.tsx`
**Zweck**: 5-Schritte Personalisierung für neue User

**Fragen:**
1. Lebst du alleine? (Boolean)
2. Hast du Haustiere? (Boolean)
3. Hast du Pflanzen? (Boolean)
4. Spielst du Instrumente? (Boolean)
5. Bevorzugte Tageszeit für Aufgaben? (Choice: Morning/Afternoon/Evening)

**Integration in UI:**
```tsx
// In app/protected/onboarding/page.tsx oder beim ersten Login
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

<OnboardingWizard userId={user.id} onComplete={() => router.push("/protected")} />
```

### 2. AI Task Suggestions
**Komponente**: `components/ai/ai-suggest-card.tsx`
**Zweck**: Personalisierte Task-Vorschläge basierend auf Onboarding

**Features:**
- 24h Cache (reduziert API Calls)
- Rate Limiting (10/day)
- Fallback zu Template-basierten Vorschlägen
- Auswählbare Suggestions
- Refresh-Button

**Integration in Dashboard:**
```tsx
// In app/protected/page.tsx
import { AISuggestCard } from "@/components/ai/ai-suggest-card";

<AISuggestCard userId={user.id} />
```

### 3. AI Usage Statistics
**Komponente**: `components/ai/ai-usage-stats.tsx`
**Zweck**: Zeigt verbleibende Requests, Token-Verwendung, geschätzte Kosten

**Features:**
- Requests Today: X/10
- Requests This Month
- Tokens Used Total
- Estimated Cost in $

**Integration in Settings:**
```tsx
// In app/protected/settings/page.tsx
import { AIUsageStats } from "@/components/ai/ai-usage-stats";

<AIUsageStats userId={user.id} />
```

## Test-Szenarien

### Test 1: Onboarding + AI Suggestions

1. **Erstelle einen neuen Test-User**
   - Registriere dich mit neuer Email
   - Oder lösche Onboarding-Status: `UPDATE profiles SET onboarding_completed = false WHERE id = '...'`

2. **Durchlaufe Onboarding**
   - Beantworte alle 5 Fragen
   - Werte werden in `profiles` Tabelle gespeichert

3. **Öffne Dashboard**
   - Integriere `<AISuggestCard />` temporär zum Testen
   - Klicke "Get Suggestions"
   - Warte ~3-5 Sekunden (OpenAI API Call)

4. **Prüfe Suggestions**
   - Sollte 5 personalisierte Tasks anzeigen
   - Basierend auf deinen Onboarding-Antworten
   - Mit passenden Kategorien

5. **Wähle Tasks aus**
   - Wähle 2-3 Tasks aus der Liste
   - Klicke "Add Selected Tasks"
   - Tasks sollten in deiner Task-Liste erscheinen

### Test 2: Rate Limiting

1. **Klicke 10x auf "Get Suggestions"**
   - Sollte nach 10 Requests blockieren
   - Fehlermeldung: "Daily limit reached (10/10)"

2. **Prüfe Usage Stats**
   - Integriere `<AIUsageStats />` temporär
   - Sollte "0 remaining" zeigen
   - Sollte Token-Count und Kosten anzeigen

### Test 3: Caching

1. **Erste Suggestion anfragen**
   - Notiere die Zeit (~3-5s)
   - Cached in `ai_suggestions` Tabelle

2. **Zweite Suggestion direkt danach**
   - Sollte sofort laden (<100ms)
   - Nutzt gecachte Daten
   - "Cached" Badge sollte angezeigt werden

3. **Nach 24h**
   - Cache expired automatisch
   - Neue Suggestion mit neuem API Call

### Test 4: Fallback ohne API Key

1. **Entferne OPENAI_API_KEY aus .env**
2. **Starte Server neu**
3. **Klicke "Get Suggestions"**
4. **Sollte Template-basierte Fallback-Suggestions zeigen:**
   - "Morning Meditation (10 min)"
   - "Evening Journaling (15 min)"
   - "Weekly Grocery Shopping"
   - etc.

## Debugging

### Console Logs prüfen

```bash
# Server-Seite (Terminal)
[INFO] OpenAI client initialized
[INFO] Starting AI suggestion generation
[INFO] Using cached suggestions (expires: ...)
[INFO] Rate limit check: X/10 requests today

# Client-Seite (Browser Console)
✅ OpenAI service initialized successfully
✅ AI suggestions loaded (cached)
⚠️ Rate limit reached
```

### Datenbank prüfen

```sql
-- Onboarding-Status prüfen
SELECT lives_alone, has_pets, has_plants, plays_instruments, preferred_task_time, onboarding_completed
FROM profiles
WHERE id = 'user-id';

-- AI Suggestions prüfen
SELECT id, created_at, expires_at, tokens_used, applied
FROM ai_suggestions
WHERE user_id = 'user-id'
ORDER BY created_at DESC;

-- Rate Limit prüfen
SELECT COUNT(*) as requests_today
FROM ai_suggestions
WHERE user_id = 'user-id'
AND created_at >= CURRENT_DATE;
```

### Häufige Fehler

**"OpenAI API key not configured"**
- Lösung: API Key in `.env` eintragen und Server neu starten

**"Daily rate limit exceeded"**
- Lösung: Warte bis Mitternacht oder erhöhe Limit in `ai-suggestions.ts`

**"Failed to generate suggestions"**
- Lösung: Prüfe OpenAI API Status, Prüfe Guthaben, Prüfe Console Logs

## Integration in die Haupt-UI

Um die KI-Features permanent zu integrieren:

### 1. Dashboard Integration (app/protected/page.tsx)

```tsx
import { AISuggestCard } from "@/components/ai/ai-suggest-card";

// Füge hinzu nach den Task-Listen
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2">
    {/* Existing task lists */}
  </div>
  <div className="space-y-6">
    <AISuggestCard userId={user.id} />
    {/* Other sidebar content */}
  </div>
</div>
```

### 2. Settings Integration (app/protected/settings/page.tsx)

```tsx
import { AIUsageStats } from "@/components/ai/ai-usage-stats";

// Neuer Tab oder Sektion "AI Settings"
<AIUsageStats userId={user.id} />
```

### 3. Onboarding Route (app/protected/onboarding/page.tsx)

```tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { checkOnboardingStatus } from "@/app/actions/onboarding";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/sign-in");

  const { completed } = await checkOnboardingStatus(user.id);
  if (completed) return redirect("/protected");

  return (
    <div className="container max-w-2xl mx-auto p-6">
      <OnboardingWizard
        userId={user.id}
        onComplete={() => window.location.href = "/protected"}
      />
    </div>
  );
}
```

## Performance & Kosten Monitoring

### Empfohlene Metriken

1. **Average Response Time**: ~2-4s für neue Suggestions
2. **Cache Hit Rate**: >80% nach 1 Woche Nutzung
3. **Daily API Calls**: Sollte <10 pro User sein
4. **Monthly Cost per User**: ~$0.03-0.10

### Kosten-Alarm einrichten

```typescript
// In ai-suggestions.ts
if (totalCostThisMonth > 10.00) {
  // Send alert email
  console.error("⚠️ Monthly AI cost exceeded $10!");
}
```

## Nächste Schritte

Nach erfolgreichem Test:

1. ✅ API Key verifiziert
2. ✅ Onboarding funktioniert
3. ✅ Suggestions generieren korrekt
4. ✅ Rate Limiting greift
5. ✅ Caching funktioniert
6. → Integriere in Haupt-UI
7. → Teste mit echten Usern
8. → Überwache Kosten
