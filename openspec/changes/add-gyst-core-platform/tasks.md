# Implementation Tasks: Gyst Core Platform

## Phase 1: Foundation & Database (Weeks 1-2)

### 1.1 Database Setup
- [ ] 1.1.1 Create Supabase migration file from database-schema.sql
- [ ] 1.1.2 Run migration on development environment
- [ ] 1.1.3 Verify all tables, indexes, and RLS policies created
- [ ] 1.1.4 Test RLS policies with sample user accounts
- [ ] 1.1.5 Seed predefined task categories
- [ ] 1.1.6 Generate TypeScript types with `npm run gen-types`

### 1.2 Design System Foundation
- [ ] 1.2.1 Define Mucha color palettes in globals.css @theme blocks
- [ ] 1.2.2 Install and configure Framer Motion for animations
- [ ] 1.2.3 Set up typography (Cormorant Garamond, Inter Variable)
- [ ] 1.2.4 Create base component variants with CVA (Button, Card, Input)
- [ ] 1.2.5 Build theme selector component
- [ ] 1.2.6 Implement dark mode toggle with next-themes
- [ ] 1.2.7 Create ornamental SVG assets (corners, dividers)
- [ ] 1.2.8 Set up Storybook and configure for Art Nouveau themes
- [ ] 1.2.9 Document all design tokens and components in Storybook

### 1.3 Project Configuration
- [ ] 1.3.1 Install new dependencies (zustand, openai, resend, etc.)
- [ ] 1.3.2 Configure environment variables (.env.example)
- [ ] 1.3.3 Set up Vitest configuration
- [ ] 1.3.4 Set up Playwright configuration for E2E tests
- [ ] 1.3.5 Configure i18n with react-i18next (EN/DE)
- [ ] 1.3.6 Create translation files structure

### 1.4 Progressive Web App (PWA) Setup
- [ ] 1.4.1 Install @ducanh2912/next-pwa package
- [ ] 1.4.2 Configure next.config.ts with PWA plugin
- [ ] 1.4.3 Create public/manifest.json with app metadata (name, icons, theme)
- [ ] 1.4.4 Generate app icons (512x512, 192x192, 180x180, 96x96, favicon)
- [ ] 1.4.5 Configure Service Worker with offline caching strategy
- [ ] 1.4.6 Add viewport meta tags for native app feel
- [ ] 1.4.7 Build "Add to Home Screen" prompt component
- [ ] 1.4.8 Add iOS-specific meta tags (apple-mobile-web-app-capable)
- [ ] 1.4.9 Test PWA installation on iOS Safari (16.4+)
- [ ] 1.4.10 Test PWA installation on Android Chrome
- [ ] 1.4.11 Verify offline functionality (cache-first for assets)
- [ ] 1.4.12 Run Lighthouse PWA audit (target score > 90)
- [ ] 1.4.13 Configure splash screen for installed PWA

---

## Phase 2: Core Features - Tasks & Dashboard (Weeks 3-4)

### 2.1 Zustand Store Setup
- [ ] 2.1.1 Create task store (lib/store/task-store.ts)
- [ ] 2.1.2 Create settings store (lib/store/settings-store.ts)
- [ ] 2.1.3 Create streak store (lib/store/streak-store.ts)
- [ ] 2.1.4 Create notification store (lib/store/notification-store.ts)
- [ ] 2.1.5 Write unit tests for all stores

### 2.2 API Layer
- [ ] 2.2.1 Create API client utilities (lib/api/client.ts)
- [ ] 2.2.2 Implement API route: GET /api/tasks
- [ ] 2.2.3 Implement API route: POST /api/tasks
- [ ] 2.2.4 Implement API route: PATCH /api/tasks/:id
- [ ] 2.2.5 Implement API route: DELETE /api/tasks/:id
- [ ] 2.2.6 Implement API route: GET /api/categories
- [ ] 2.2.7 Implement API route: POST /api/categories
- [ ] 2.2.8 Add error handling and validation middleware
- [ ] 2.2.9 Write integration tests for all API routes

### 2.3 Task Management UI
- [ ] 2.3.1 Build TaskCard component with Art Nouveau styling
- [ ] 2.3.2 Build TaskForm component (create/edit)
- [ ] 2.3.3 Build SubtaskList component
- [ ] 2.3.4 Build TaskFilters component (category, frequency)
- [ ] 2.3.5 Build TaskSearch component with debounced input
- [ ] 2.3.6 Build TaskBulkActions component
- [ ] 2.3.7 Implement task CRUD operations in UI
- [ ] 2.3.8 Add form validation and error states
- [ ] 2.3.9 Write component tests with React Testing Library

### 2.4 Dashboard
- [ ] 2.4.1 Create dashboard layout (app/dashboard/page.tsx)
- [ ] 2.4.2 Build CategoryGroup component with collapse/expand
- [ ] 2.4.3 Build ProgressRing component (circular streak indicator)
- [ ] 2.4.4 Build QuickActions component (complete, snooze, skip)
- [ ] 2.4.5 Implement task grouping (by category, by due date)
- [ ] 2.4.6 Add dashboard filters and view modes
- [ ] 2.4.7 Build DashboardStats summary component
- [ ] 2.4.8 Implement responsive layouts (mobile/tablet/desktop)
- [ ] 2.4.9 Add loading states and skeleton screens
- [ ] 2.4.10 Optimize dashboard performance (React.memo, useMemo)

### 2.5 Category System
- [ ] 2.5.1 Build CategorySelector component
- [ ] 2.5.2 Build CategoryManager component (create/edit custom categories)
- [ ] 2.5.3 Implement category color picker with theme colors
- [ ] 2.5.4 Implement category icon selector (Lucide icons)
- [ ] 2.5.5 Add category sorting and reordering

---

## Phase 3: Gamification & Intelligence (Weeks 5-6)

### 3.1 Streak Tracking
- [ ] 3.1.1 Implement streak calculation function (calculate_task_streak)
- [ ] 3.1.2 Create StreakDisplay component with flame indicators
- [ ] 3.1.3 Build StreakCalendarHeatmap component
- [ ] 3.1.4 Implement break credits system (earn/use logic)
- [ ] 3.1.5 Build StreakMilestone celebration modal with confetti
- [ ] 3.1.6 Create streak recalculation background job
- [ ] 3.1.7 Build StreakLeaderboard component (personal)
- [ ] 3.1.8 Add streak statistics page
- [ ] 3.1.9 Implement streak notifications (milestone approaching)
- [ ] 3.1.10 Write tests for streak calculations

### 3.2 Task Completion Flow
- [ ] 3.2.1 Build TaskCompletionModal component
- [ ] 3.2.2 Implement photo proof upload (Supabase Storage)
- [ ] 3.2.3 Add image compression before upload (sharp or browser-native)
- [ ] 3.2.4 Build ActualTimeTracker component
- [ ] 3.2.5 Implement subtask completion checklist
- [ ] 3.2.6 Update streak on completion (real-time)
- [ ] 3.2.7 Calculate and update actual_minutes_avg
- [ ] 3.2.8 Show completion celebration animation
- [ ] 3.2.9 Add completion history view

### 3.3 AI Assistant Integration
- [ ] 3.3.1 Set up OpenAI SDK and API key
- [ ] 3.3.2 Create AI service layer (lib/ai/suggestions.ts)
- [ ] 3.3.3 Implement onboarding question flow
- [ ] 3.3.4 Build OnboardingWizard component
- [ ] 3.3.5 Implement task suggestion prompt engineering
- [ ] 3.3.6 Create suggestion caching logic (24h TTL)
- [ ] 3.3.7 Build AISuggest component with "Refresh" button
- [ ] 3.3.8 Implement rate limiting (10 requests/user/day)
- [ ] 3.3.9 Add fallback template-based suggestions
- [ ] 3.3.10 Implement cost monitoring and alerts
- [ ] 3.3.11 Write tests for AI suggestion logic

### 3.4 Statistics & Analytics
- [ ] 3.4.1 Create statistics page (app/statistics/page.tsx)
- [ ] 3.4.2 Implement completion rate chart (recharts)
- [ ] 3.4.3 Build category breakdown pie/donut chart
- [ ] 3.4.4 Build streak history line chart
- [ ] 3.4.5 Implement time-spent analysis
- [ ] 3.4.6 Add date range selector for stats
- [ ] 3.4.7 Create exportable reports (CSV/PDF)
- [ ] 3.4.8 Build personal records / achievements section

---

## Phase 4: Integration & Polish (Weeks 7-8)

### 4.1 Calendar Integration
- [ ] 4.1.1 Set up Google Calendar API credentials
- [ ] 4.1.2 Set up Microsoft Graph API credentials
- [ ] 4.1.3 Implement OAuth2 flow for Google Calendar
- [ ] 4.1.4 Implement OAuth2 flow for Microsoft 365
- [ ] 4.1.5 Create calendar sync service (lib/calendar/sync.ts)
- [ ] 4.1.6 Build CalendarConnect component
- [ ] 4.1.7 Implement bidirectional sync (Gyst ↔ External)
- [ ] 4.1.8 Create availability calculation algorithm
- [ ] 4.1.9 Build calendar event display in dashboard
- [ ] 4.1.10 Implement conflict detection and resolution
- [ ] 4.1.11 Add background sync job (every 15 minutes)
- [ ] 4.1.12 Handle token refresh and expiration

### 4.2 Notification System
- [ ] 4.2.1 Set up Resend API key
- [ ] 4.2.2 Create email templates (Handlebars or React Email)
- [ ] 4.2.3 Implement notification queue system
- [ ] 4.2.4 Build notification preferences UI (per category)
- [ ] 4.2.5 Implement progressive tone levels (encouraging → scolding)
- [ ] 4.2.6 Create notification scheduler (cron or background job)
- [ ] 4.2.7 Implement Web Push API setup
- [ ] 4.2.8 Build push subscription component
- [ ] 4.2.9 Add quiet hours logic
- [ ] 4.2.10 Implement notification batching (max per day)
- [ ] 4.2.11 Build notification history view
- [ ] 4.2.12 Add unsubscribe links in emails

### 4.3 Weekly Digest
- [ ] 4.3.1 Create weekly digest email template
- [ ] 4.3.2 Implement digest generation logic (completion summary)
- [ ] 4.3.3 Build digest preview component (in settings)
- [ ] 4.3.4 Schedule weekly digest sending (Sundays at 6pm)
- [ ] 4.3.5 Add digest opt-out option
- [ ] 4.3.6 Include personalized insights in digest

### 4.4 Settings & Preferences
- [ ] 4.4.1 Create settings page (app/settings/page.tsx)
- [ ] 4.4.2 Build ProfileSettings section (name, avatar, timezone)
- [ ] 4.4.3 Build ThemeSettings section (palette, dark mode)
- [ ] 4.4.4 Build NotificationSettings section
- [ ] 4.4.5 Build LanguageSettings section (EN/DE toggle)
- [ ] 4.4.6 Implement avatar upload (Supabase Storage)
- [ ] 4.4.7 Add account deletion option (with confirmation)
- [ ] 4.4.8 Build data export feature (JSON download)

---

## Phase 5: Testing & Quality Assurance (Week 8-9)

### 5.1 Unit & Integration Tests
- [ ] 5.1.1 Write tests for all Zustand stores
- [ ] 5.1.2 Write tests for all API routes
- [ ] 5.1.3 Write tests for AI suggestion logic
- [ ] 5.1.4 Write tests for streak calculations
- [ ] 5.1.5 Write tests for calendar sync logic
- [ ] 5.1.6 Write tests for notification queue
- [ ] 5.1.7 Achieve 90% code coverage
- [ ] 5.1.8 Fix any failing tests

### 5.2 E2E Tests (Playwright)
- [ ] 5.2.1 Test: User registration and onboarding flow
- [ ] 5.2.2 Test: Create and complete task
- [ ] 5.2.3 Test: Streak progression and break usage
- [ ] 5.2.4 Test: Calendar connection and sync
- [ ] 5.2.5 Test: Theme switching (all palettes)
- [ ] 5.2.6 Test: Notification preferences
- [ ] 5.2.7 Test: Mobile responsive interactions
- [ ] 5.2.8 Test: Search and filtering
- [ ] 5.2.9 Test: Bulk actions
- [ ] 5.2.10 Run tests in CI/CD pipeline

### 5.3 Accessibility Audit
- [ ] 5.3.1 Run axe accessibility scanner
- [ ] 5.3.2 Test keyboard navigation (all pages)
- [ ] 5.3.3 Test screen reader compatibility (NVDA/VoiceOver)
- [ ] 5.3.4 Verify WCAG 2.2 AA compliance
- [ ] 5.3.5 Test color contrast ratios (all themes)
- [ ] 5.3.6 Verify focus indicators
- [ ] 5.3.7 Test touch targets (44x44px minimum)
- [ ] 5.3.8 Fix all accessibility violations

### 5.4 Performance Optimization
- [ ] 5.4.1 Run Lighthouse audit (aim for >90 score)
- [ ] 5.4.2 Optimize bundle size (analyze with @next/bundle-analyzer)
- [ ] 5.4.3 Implement code splitting for heavy components
- [ ] 5.4.4 Optimize images (use Next/Image, WebP format)
- [ ] 5.4.5 Implement lazy loading for below-fold content
- [ ] 5.4.6 Add caching headers for static assets
- [ ] 5.4.7 Optimize database queries (indexes, N+1 prevention)
- [ ] 5.4.8 Implement SWR for API data caching
- [ ] 5.4.9 Test performance on slow 3G network
- [ ] 5.4.10 Verify < 2s TTI (Time to Interactive)

### 5.5 Security Review
- [ ] 5.5.1 Review all RLS policies
- [ ] 5.5.2 Test authentication flows for vulnerabilities
- [ ] 5.5.3 Implement CSRF protection
- [ ] 5.5.4 Sanitize user inputs (XSS prevention)
- [ ] 5.5.5 Encrypt sensitive data (calendar tokens)
- [ ] 5.5.6 Implement rate limiting on API routes
- [ ] 5.5.7 Review environment variable security
- [ ] 5.5.8 Add Content Security Policy headers
- [ ] 5.5.9 Run security audit (npm audit)

---

## Phase 6: Documentation & Deployment (Week 9-10)

### 6.1 Documentation
- [ ] 6.1.1 Complete all Storybook component documentation
- [ ] 6.1.2 Write README for project setup
- [ ] 6.1.3 Document environment variables
- [ ] 6.1.4 Create user guide (basic usage)
- [ ] 6.1.5 Document database schema and migrations
- [ ] 6.1.6 Create API documentation (Swagger/OpenAPI optional)
- [ ] 6.1.7 Write deployment guide
- [ ] 6.1.8 Document Art Nouveau design principles

### 6.2 Internationalization Completion
- [ ] 6.2.1 Complete German translations for all strings
- [ ] 6.2.2 Test language switching
- [ ] 6.2.3 Verify date/time localization
- [ ] 6.2.4 Test RTL support (if applicable in future)

### 6.3 Deployment Preparation
- [ ] 6.3.1 Set up Vercel project
- [ ] 6.3.2 Configure environment variables in Vercel
- [ ] 6.3.3 Set up Supabase production database
- [ ] 6.3.4 Run production migrations
- [ ] 6.3.5 Configure custom domain (if applicable)
- [ ] 6.3.6 Set up monitoring (Sentry for errors, LogRocket for sessions)
- [ ] 6.3.7 Configure email sending domain (Resend)
- [ ] 6.3.8 Set up Google/Microsoft OAuth production credentials
- [ ] 6.3.9 Test production build locally
- [ ] 6.3.10 Deploy to Vercel production

### 6.4 Post-Deployment
- [ ] 6.4.1 Smoke test all critical flows in production
- [ ] 6.4.2 Monitor error rates and performance
- [ ] 6.4.3 Test email delivery
- [ ] 6.4.4 Verify calendar sync in production
- [ ] 6.4.5 Monitor OpenAI API costs
- [ ] 6.4.6 Set up backup and recovery procedures
- [ ] 6.4.7 Create runbook for common issues
- [ ] 6.4.8 Plan rollback strategy

---

## Phase 7: Expo Native Mobile App (Weeks 11-16) - Optional Post-Launch

### 7.1 Monorepo & Project Setup
- [ ] 7.1.1 Install Turborepo: `npx create-turbo@latest`
- [ ] 7.1.2 Restructure project as monorepo (apps/web, apps/mobile, packages/shared)
- [ ] 7.1.3 Create Expo app: `npx create-expo-app@latest mobile --template tabs`
- [ ] 7.1.4 Configure Turborepo pipeline (build, dev, test)
- [ ] 7.1.5 Set up EAS (Expo Application Services): `npm install -g eas-cli && eas init`
- [ ] 7.1.6 Configure eas.json for iOS and Android builds
- [ ] 7.1.7 Create shared packages structure (api, store, types, utils)
- [ ] 7.1.8 Extract Supabase client to packages/shared/api
- [ ] 7.1.9 Extract Zustand stores to packages/shared/store
- [ ] 7.1.10 Extract database types to packages/shared/types

### 7.2 Mobile Design System (Art Nouveau on Native)
- [ ] 7.2.1 Install NativeWind: `npx expo install nativewind tailwindcss`
- [ ] 7.2.2 Configure tailwind.config.js for React Native
- [ ] 7.2.3 Port Mucha color themes to NativeWind
- [ ] 7.2.4 Install custom fonts (Cormorant, Inter) via expo-font
- [ ] 7.2.5 Create Art Nouveau component library (Button, Card, Input)
- [ ] 7.2.6 Build ornamental SVG components with react-native-svg
- [ ] 7.2.7 Set up Reanimated for organic animations
- [ ] 7.2.8 Create circular progress rings (StreakRing component)
- [ ] 7.2.9 Build theme selector for mobile
- [ ] 7.2.10 Test dark mode on iOS and Android

### 7.3 Navigation & Core Screens
- [ ] 7.3.1 Configure Expo Router (file-based routing)
- [ ] 7.3.2 Create tab navigation layout (Dashboard, Statistics, Settings)
- [ ] 7.3.3 Build Dashboard screen with task list
- [ ] 7.3.4 Build Task detail screen (app/tasks/[id].tsx)
- [ ] 7.3.5 Build Create/Edit task screen (app/tasks/new.tsx)
- [ ] 7.3.6 Build Statistics screen with charts (Victory Native or Recharts)
- [ ] 7.3.7 Build Settings screen
- [ ] 7.3.8 Add native transitions and gestures
- [ ] 7.3.9 Implement pull-to-refresh on lists
- [ ] 7.3.10 Add haptic feedback for interactions

### 7.4 Task Management Features
- [ ] 7.4.1 Implement task CRUD using shared API client
- [ ] 7.4.2 Build swipe gestures for quick actions (complete, delete)
- [ ] 7.4.3 Implement category filtering
- [ ] 7.4.4 Build search functionality
- [ ] 7.4.5 Add bulk actions (multi-select mode)
- [ ] 7.4.6 Implement task sorting and grouping
- [ ] 7.4.7 Build subtask checklist component
- [ ] 7.4.8 Add time estimation input

### 7.5 Streak Tracking & Gamification
- [ ] 7.5.1 Build animated streak display with Reanimated
- [ ] 7.5.2 Create calendar heatmap view (completion history)
- [ ] 7.5.3 Implement milestone celebrations with Lottie animations
- [ ] 7.5.4 Build break credits UI
- [ ] 7.5.5 Add confetti animation for achievements
- [ ] 7.5.6 Create streak statistics screen
- [ ] 7.5.7 Implement streak notifications

### 7.6 Native Features
- [ ] 7.6.1 Photo proof: Install expo-camera and expo-image-picker
- [ ] 7.6.2 Build camera screen for task completion proof
- [ ] 7.6.3 Implement image compression before upload
- [ ] 7.6.4 Upload photos to Supabase Storage
- [ ] 7.6.5 Push Notifications: Install expo-notifications
- [ ] 7.6.6 Request notification permissions
- [ ] 7.6.7 Register device for push tokens
- [ ] 7.6.8 Handle push notification taps
- [ ] 7.6.9 Calendar Integration: Install expo-calendar
- [ ] 7.6.10 Request calendar permissions
- [ ] 7.6.11 Sync with device calendar
- [ ] 7.6.12 Biometric Auth: Install expo-local-authentication
- [ ] 7.6.13 Implement Face ID / Touch ID unlock

### 7.7 Offline Support & Performance
- [ ] 7.7.1 Implement AsyncStorage for offline caching
- [ ] 7.7.2 Build offline queue for task actions
- [ ] 7.7.3 Sync queue when connection restored
- [ ] 7.7.4 Add offline indicator in UI
- [ ] 7.7.5 Optimize images with expo-image
- [ ] 7.7.6 Implement lazy loading for lists
- [ ] 7.7.7 Add performance monitoring with Sentry

### 7.8 Testing & QA
- [ ] 7.8.1 Set up Jest for React Native
- [ ] 7.8.2 Write component tests
- [ ] 7.8.3 Write integration tests for screens
- [ ] 7.8.4 Test on iOS Simulator
- [ ] 7.8.5 Test on Android Emulator
- [ ] 7.8.6 Test on physical iOS device
- [ ] 7.8.7 Test on physical Android device
- [ ] 7.8.8 Run accessibility audit (react-native-a11y)
- [ ] 7.8.9 Performance testing with Flashlight

### 7.9 Build & Deployment
- [ ] 7.9.1 Configure app.json (name, bundle ID, version)
- [ ] 7.9.2 Generate app icons and splash screens
- [ ] 7.9.3 Build iOS app: `eas build --platform ios`
- [ ] 7.9.4 Build Android app: `eas build --platform android`
- [ ] 7.9.5 Test iOS build via TestFlight
- [ ] 7.9.6 Test Android build via Internal Testing
- [ ] 7.9.7 Set up OTA updates: `eas update`
- [ ] 7.9.8 Create App Store listing (screenshots, description)
- [ ] 7.9.9 Create Google Play listing
- [ ] 7.9.10 Submit to Apple App Store: `eas submit --platform ios`
- [ ] 7.9.11 Submit to Google Play: `eas submit --platform android`
- [ ] 7.9.12 Monitor app review status
- [ ] 7.9.13 Launch apps publicly

---

## Optional Enhancements (Post-MVP & Expo)

### Enhancement 1: Advanced Features
- [ ] Social sharing for achievements
- [ ] Friend invites and group challenges
- [ ] Task templates marketplace
- [ ] More calendar providers (Apple iCloud via CalDAV)
- [ ] Voice input for task creation (Expo Speech)
- [ ] Widgets for iOS and Android home screens
- [ ] Watch app (Apple Watch, Wear OS)

### Enhancement 2: Premium Features
- [ ] Stripe integration for payments (expo-stripe)
- [ ] Premium plan benefits (unlimited AI, priority support)
- [ ] Advanced analytics dashboard
- [ ] Custom theme builder
- [ ] Family sharing (collaborative mode)

### Enhancement 3: Platform Expansion
- [ ] Desktop app (Tauri or Electron)
- [ ] Browser extension (Chrome, Firefox)
- [ ] Smart home integrations (Alexa, Google Home)

---

## Notes

**Dependencies between phases:**
- Phase 2 depends on Phase 1 (database must be ready)
- Phase 3 can start concurrently with Phase 2 (different focus areas)
- Phase 4 depends on Phase 2 & 3 being mostly complete
- Phase 5 should overlap with Phase 4 (test as you build)
- **Phase 7 depends on Phase 1-6 being complete (Web-App launch)**

**Estimated Timeline:**
- **Phases 1-6**: 10 weeks (Web App with PWA)
- **Phase 7** (Optional): +6 weeks (Expo Native App)
- **Total with Expo**: 16 weeks

**Team Size Assumption:**
- 1-2 developers working full-time
- If solo: extend timeline by 30-40%
- Phase 7 can be done by same team or dedicated mobile dev

**Risk Buffer:**
- Add 20% buffer time for unexpected issues
- Prioritize critical path items first
- Phase 7 is optional - can be deferred if needed

**Mobile Strategy:**
- Week 1-10: Build Web-App with PWA (mobile-ready)
- Week 10: Launch & gather user feedback
- Week 11-16: Build Expo app based on learnings
- Week 16: Launch native apps in App Stores
