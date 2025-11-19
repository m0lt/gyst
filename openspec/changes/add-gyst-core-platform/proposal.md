# Change: Add Gyst Core Platform

## Why

Gyst (Get Your Shit Together) is a comprehensive life organizer web-app designed to help users manage recurring tasks, routines, and goals across all life categories. Users struggle with maintaining consistency in their daily routines, tracking progress, and staying motivated. This platform addresses these pain points through:

- **Smart scheduling**: AI-assisted task recommendations based on user preferences and calendar
- **Visual progress tracking**: Streak tracking with "don't break the chain" visualization
- **Motivation system**: Gamified elements, photo proofs, and adaptive notifications
- **Holistic organization**: Categories covering all life areas (household, health, fitness, learning, etc.)

The project transforms the existing Supabase starter kit into a fully-featured productivity platform with a distinctive Art Nouveau-inspired design aesthetic.

## What Changes

This change introduces the complete Gyst platform with the following capabilities:

### Core Functionality
- **Enhanced User Authentication** - Extend Supabase auth with user preferences and onboarding
- **Task Management System** - Full CRUD for tasks with frequency, subtasks, reminders, and recurrence
- **Category System** - Predefined and customizable task categories
- **Dashboard** - Central hub showing all active routines and quick actions
- **Streak Tracking** - Visual "don't break the chain" system with break credits
- **Task Completion** - Photo proof uploads, time tracking, and completion history

### Intelligence & Integration
- **AI Assistant** - OpenAI-powered onboarding and task recommendations
- **Calendar Integration** - Internal calendar + external sync (Google, Microsoft)
- **Smart Notifications** - Configurable email/push with progressive intensity levels
- **Statistics & Analytics** - Charts, completion rates, category breakdowns
- **Weekly Digest** - Automated progress summary emails

### User Experience
- **Design System** - Art Nouveau/Jugendstil-inspired component library
- **Theme Selector** - Multiple Mucha-inspired color palettes
- **Settings & Preferences** - Multi-language (EN/DE), notification preferences
- **Accessibility** - WCAG 2.2 AA compliance

### Technical Infrastructure
- **Database Schema** - Comprehensive Supabase PostgreSQL schema
- **State Management** - Zustand for client-side state
- **API Layer** - RESTful endpoints for all operations
- **Testing Suite** - Vitest (unit/integration) + Playwright (E2E)
- **Storybook** - Component documentation and visual testing
- **Internationalization** - i18n support for EN/DE

## Impact

### Affected Specs
- `user-auth` - MODIFIED (extend existing Supabase auth)
- `task-management` - ADDED
- `task-categories` - ADDED
- `dashboard` - ADDED
- `streak-tracking` - ADDED
- `task-completion` - ADDED
- `ai-assistant` - ADDED
- `calendar-integration` - ADDED
- `notifications` - ADDED
- `statistics` - ADDED
- `settings` - ADDED
- `weekly-digest` - ADDED
- `design-system` - ADDED
- `theme-selector` - ADDED

### Affected Code
- **New Directories**:
  - `app/dashboard/` - Dashboard pages
  - `app/tasks/` - Task management pages
  - `app/statistics/` - Analytics pages
  - `app/settings/` - User settings
  - `components/task/` - Task-related components
  - `components/ui/` - Design system components (extended)
  - `lib/api/` - API client functions
  - `lib/ai/` - OpenAI integration
  - `lib/calendar/` - Calendar integration
  - `lib/notifications/` - Notification system
  - `lib/store/` - Zustand stores
  - `lib/i18n/` - Internationalization

- **Database**:
  - Multiple new Supabase tables (see database schema)
  - Row Level Security policies
  - Database functions and triggers

- **External Services**:
  - OpenAI API integration
  - Resend for transactional emails
  - Google Calendar API
  - Microsoft Graph API
  - Web Push API

### Breaking Changes
- None (new platform, no existing functionality to break)

### Migration Notes
- Initial database setup via Supabase migrations
- Environment variables required (OpenAI key, Resend key, Calendar API credentials)
- First-time users go through AI-powered onboarding flow

## Implementation Phases

### Phase 1: Foundation (Weeks 1-2)
- Database schema and migrations
- Design system and theme selector
- **Progressive Web App (PWA) setup**
- Basic task CRUD
- Dashboard skeleton
- Settings page

### Phase 2: Core Features (Weeks 3-4)
- Category system
- Task completion with time tracking
- Streak tracking visualization
- Basic notifications

### Phase 3: Intelligence (Weeks 5-6)
- AI assistant integration
- Smart task suggestions
- Onboarding flow
- Statistics and analytics
- Full calendar view implementation

### Phase 4: Integration & Polish (Weeks 7-8)
- Calendar integration (Google, Microsoft)
- Photo proof uploads
- Weekly digest emails
- Comprehensive testing
- Storybook documentation
- i18n implementation

### Phase 5: Testing & QA (Week 9)
- Unit & integration tests (Vitest)
- E2E tests (Playwright)
- Accessibility audit (WCAG 2.2 AA)
- Performance optimization
- Security review

### Phase 6: Documentation & Deployment (Week 10)
- Complete documentation
- Internationalization (EN/DE)
- Deployment to Vercel
- Production monitoring setup
- **Launch Web-App with PWA**

### Phase 7: Native Mobile App (Weeks 11-16) - Optional Post-Launch
- Monorepo setup with Turborepo
- Expo app with NativeWind
- Art Nouveau mobile components
- Native features (Camera, Push, Biometric)
- App Store & Google Play submission

## Success Criteria

- ✅ All task CRUD operations functional
- ✅ Streak tracking accurately reflects completion history
- ✅ AI assistant provides relevant task suggestions
- ✅ Calendar sync works bidirectionally
- ✅ Design system matches Art Nouveau aesthetic
- ✅ WCAG 2.2 AA compliance verified
- ✅ 90%+ test coverage (unit + integration)
- ✅ All critical E2E flows covered by Playwright
- ✅ Performance: Dashboard loads < 2s, interactions < 200ms
- ✅ Multi-language support fully functional

## Dependencies

### External Services
- **OpenAI API** - GPT-4 for task recommendations
- **Resend** - Transactional email delivery
- **Google Calendar API** - Calendar sync
- **Microsoft Graph API** - Outlook/365 calendar sync
- **Supabase Storage** - Photo proof uploads

### New npm Packages
- `zustand` - State management
- `openai` - OpenAI SDK
- `resend` - Email service
- `@react-spring/web` or `framer-motion` - Animations
- `react-i18next` - Internationalization
- `date-fns` - Date manipulation
- `recharts` - Statistics charts
- `@googleapis/calendar` - Google Calendar
- `@microsoft/microsoft-graph-client` - Microsoft Graph
- `vitest` - Testing framework
- `@playwright/test` - E2E testing
- `@storybook/react` - Component documentation

## Risk Assessment

### High Risk
- **Calendar API complexity** - Multiple providers with different auth flows
  - *Mitigation*: Start with Google only, add Microsoft in Phase 4
- **AI cost management** - OpenAI API calls can be expensive
  - *Mitigation*: Implement caching, rate limiting, batch processing

### Medium Risk
- **Push notification reliability** - Browser support varies
  - *Mitigation*: Graceful degradation, email fallback
- **Photo storage costs** - User uploads can grow large
  - *Mitigation*: Image compression, storage limits, cleanup policies

### Low Risk
- **Streak calculation accuracy** - Timezone handling
  - *Mitigation*: Store all dates in UTC, convert on display
- **Multi-language support** - Translation maintenance
  - *Mitigation*: Use professional translation service, community contributions

## Design Decisions (Resolved)

All open questions have been resolved:

- [x] **Calendar View**: Full calendar grid (week/month view) using react-big-calendar
- [x] **Photo Storage**: Supabase Storage with image compression
- [x] **Notification Limits**: Configurable per user (default 3/day, max 10/day)
- [x] **AI Refresh**: On-demand only (user-triggered with 24h cache)
- [x] **Theme Customization**: Predefined Mucha palettes only (Classic, Emerald, Ruby)
- [x] **Mobile Strategy**: PWA in Phase 1, Expo native app in Phase 7 (optional)

See `design.md` for detailed rationale on each decision.
