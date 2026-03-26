# My Prayer App

A faith-based prayer journal that helps users track prayers, build streaks, record testimonies, and connect with a prayer circle. Built with React + Vite for the web, and Capacitor for iOS and Android.

**Live:** [myprayerapp.uk](https://myprayerapp.uk)
**App Store:** Available on iOS
**Play Store:** Available on Android

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 6 |
| Backend | Supabase (auth, database, real-time, edge functions) |
| Mobile | Capacitor 8 (iOS + Android) |
| PWA | Workbox via vite-plugin-pwa |
| Icons | Lucide React |
| Styling | CSS custom properties (amber theme system) |

## Features

- **Prayer Journal** — Write, categorize, and track prayers with notes, scripture, and updates
- **Prayer Plans** — Guided multi-day prayer schedules (7, 14, 21, or 30 days)
- **Daily Streak** — Track consecutive days of prayer with milestone celebrations (Day 3, 7, 14, 21, 30, 50, 100, 365)
- **Prayer Calendar** — Compact strip on home + full monthly view with retrospective logging (up to 7 days back)
- **Prayer Schedule** — Assign prayer categories to each day of the week
- **Testimonies** — Mark answered prayers and record testimonies
- **Prayer Circle** — Invite up to 2 people into a private prayer circle with mutual accountability, shared requests, and partnership streaks
- **Community Groups** — Create/join prayer groups, share requests, pray together
- **Intercede** — Community prayer requests for anonymous intercession
- **Local Notifications** — Streak reminders (8pm), neglected prayer alerts (10am), custom prayer times
- **Three Themes** — Dark, Light, and Warm mode with consistent amber color palette
- **Export** — Generate PDF of your prayer journal
- **Offline-First** — Works without internet, syncs when connected

## Prerequisites

- Node.js 18+
- npm 9+
- Supabase project with tables configured
- For iOS: Xcode 15+, macOS
- For Android: Android Studio, JDK 17

## Getting Started

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Add your Supabase credentials:
#   VITE_SUPABASE_URL=https://your-project.supabase.co
#   VITE_SUPABASE_ANON_KEY=your-anon-key

# Start dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run cap:build` | Build web + sync to both native platforms |
| `npm run cap:ios` | Build + sync + open Xcode |
| `npm run cap:android` | Build + sync + open Android Studio |

## Project Structure

```
src/
├── App.jsx                  # Root component, hooks orchestration
├── main.jsx                 # React + Capacitor init
├── index.css                # Global styles, themes, CSS variables
├── lib/
│   └── supabase.js          # Supabase client
├── components/              # UI components
│   ├── Onboarding.jsx       # 3-screen intro flow
│   ├── AuthScreen.jsx       # Sign in / sign up modal
│   ├── PrayerCard.jsx       # Prayer display + actions
│   ├── DailyCheckin.jsx     # Streak card with fire animation
│   ├── PrayerCalendar.jsx   # Compact strip + full month calendar
│   ├── CommunityPrayer.jsx  # Circle + Groups + Intercede tabs
│   ├── PartnersTab.jsx      # Prayer Circle management
│   ├── GroupView.jsx        # Group details + membership
│   ├── SettingsPanel.jsx    # Theme, font, notification toggles
│   ├── NotificationSettings.jsx # Prayer reminder time management
│   ├── ExportPDF.jsx        # PDF generation
│   ├── MilestoneModal.jsx   # Streak celebration screens
│   └── ...
├── hooks/                   # Custom React hooks
│   ├── useAuth.js           # Auth session + password recovery + session isolation
│   ├── usePrayers.js        # Prayer CRUD + logging + input validation
│   ├── usePartnership.js    # Prayer Circle partnerships + shared requests
│   ├── useGroups.js         # Group management + real-time
│   ├── useStreak.js         # Streak calculation + neglected detection
│   ├── useNotifications.js  # Local notifications (streak, neglected, reminders)
│   ├── useDailyCheckin.js   # Daily check-in + streak tracking + audit logging
│   ├── usePrayerTimer.js    # Session timer
│   ├── usePrayerSchedule.js # Weekly prayer schedule per day
│   ├── useSettings.js       # App settings + theme management
│   └── ...
├── utils/
│   ├── constants.js         # Categories, date formatting
│   ├── storage.js           # localStorage helpers + session isolation + prayer backup
│   ├── validation.js        # Input sanitisation + character limits
│   ├── auditLog.js          # Streak audit trail logging
│   ├── streakTheme.js       # Streak-based visual theming
│   ├── migrateGuestData.js  # Guest → authenticated migration
│   ├── openAppSettings.js   # Native app settings deep link
│   └── sendNotification.js  # Cross-user in-app notifications
└── assets/
    ├── gemini-hands.jpg     # Onboarding background
    └── praying-hands.jpg    # Home screen image
```

## Architecture

### State Management

No external state library. All state lives in custom hooks called from `App.jsx` and passed down as props.

### Offline-First

All data writes to localStorage first, then syncs to Supabase. If Supabase is unavailable, the app continues working with local data. On auth, guest data migrates automatically via `migrateGuestData()`.

### Real-Time

Supabase channels power live updates for:
- Group posts and membership changes
- In-app notifications
- Partner activity

### Theming

Three themes controlled via CSS custom properties with a unified amber color palette:
- **Dark** (default): Deep navy background, warm amber accents
- **Light**: Clean white background, amber accents
- **Warm**: Parchment-tone background, amber accents (`html.minimal-mode`)

Key theme tokens: `--amber-primary`, `--amber-tint`, `--card-bg`, `--card-border`, `--card-shadow`, `--heading-text`, `--body-text`, `--meta-text`

Theme is preloaded in `index.html` via an inline script to prevent flash.

### Notifications

Local notifications only (no push/Firebase/APNs):
- **Streak reminder**: Daily at 8pm if user hasn't prayed (toggle in Settings)
- **Neglected prayer alerts**: Daily at 10am for prayers not visited in 3+ days
- **Custom prayer reminders**: User-set times with labels
- Uses `@capacitor/local-notifications` on native, Web Notification API on web
- Reserved IDs: 9000 (streak), 9001 (neglected), 1-100 (custom reminders)

### Milestone Celebrations

Animated celebration modal at streak milestones:
- Day 3, 7, 14, 21, 30, 50, 100, 365
- Each has unique icon, title, and warm faith-based message
- Shows instead of regular streak toast when milestone is hit

### Prayer Circle

Private accountability feature (formerly "Partners"):
- Invite up to 2 people into your circle
- See when each person prays daily (yes/no only — no private data)
- Shared prayer requests visible only to circle members
- Partnership streak tracks days both members prayed
- Encouragement notifications ("standing with you in prayer")
- Logged-out state shows blurred preview with sign-in CTA

### Prayer Calendar

Two locations in the app:
- **Home screen**: Compact 21-day strip (14 past + 7 future) with scroll-snap
- **More tab**: Full monthly grid with stats and retrospective logging
- Supports retrospective prayer logging up to 7 days back
- Weekly prayer schedule editor with category assignment per day

## Security

### Row Level Security (RLS)

All 22 Supabase tables have RLS enabled with appropriate policies:
- User-owned tables: users can only CRUD their own rows
- Partnership tables: both partners can read/write shared records
- Group tables: members can see data within their groups
- Intercede: public read for community, owned write

### Data Isolation

- localStorage cleared on logout and account switch via `clearAllUserData()`
- Auth state change listener detects user switches
- Supabase data fetch replaces (not merges) localStorage on login
- Prayer backup namespaced by userId: `prayer_backup_{userId}`

### Dual-Path Data Integrity

Prayer streak data stored in two places:
1. Supabase (primary source of truth)
2. Namespaced localStorage backup

Integrity check on app load compares both sources, re-syncs discrepancies, and always displays the higher count.

### Audit Logging

`streak_audit_log` table records every streak change with old/new values and source for investigating data loss reports.

### Input Validation

Client-side character limits enforced on all user input (titles: 200, content: 2000, shared requests: 500). Supabase parameterised queries prevent SQL injection. React JSX escaping prevents XSS.

## Mobile Builds

### iOS

```bash
npm run cap:ios
# In Xcode: Product → Archive → Distribute App → App Store Connect
```

- Bundle ID: `com.deborahtoriola.prayerjournal`
- Deployment target: iOS 15.0+
- Code signing: Automatic

### Android

```bash
npm run cap:android
# In Android Studio: Build → Generate Signed Bundle (AAB)
```

- App ID: `com.myprayerapp.app`
- Keystore: `~/Documents/my-prayer-app.keystore` (alias: `myprayerapp`)
- Build type: Release with signing config

### Version Sync

Keep iOS and Android versions aligned:

| Platform | Version Name | Build Number |
|----------|-------------|--------------|
| Android | `versionName` in `build.gradle` | `versionCode` in `build.gradle` |
| iOS | `MARKETING_VERSION` in Xcode | `CURRENT_PROJECT_VERSION` in Xcode |

## Web Deployment (Vercel)

Pushing to `main` on GitHub auto-deploys to Vercel. No config file needed — Vite defaults work.

The app is a PWA with:
- Auto-updating service worker
- Offline caching (precache + runtime cache for fonts)
- Web app manifest for installability

## Supabase

### Edge Functions

- `supabase/functions/delete-user/index.ts` — Permanently deletes a user's auth record. Requires `SUPABASE_SERVICE_ROLE_KEY`.

### Tables (22 with RLS)

| Table | Purpose |
|-------|---------|
| `prayers` | Prayer entries with categories, notes, answered status |
| `daily_checkins` | Manual and auto check-in records |
| `prayer_plans` | Structured multi-day plans |
| `categories` | Custom user categories |
| `settings` | User preferences (theme, toggles, Bible translation) |
| `weekly_projects` | Weekly prayer focus |
| `user_stats` | Aggregated user statistics |
| `prayer_groups` | Prayer groups with admin/member roles |
| `group_members` | Membership + pending approvals |
| `group_posts` | Posts within groups |
| `group_prayer_logs` | Prayer time logs in groups |
| `prayer_partnerships` | Circle partnerships (two users) |
| `partner_prayer_log` | Daily prayer log per partnership |
| `shared_prayer_requests` | Requests shared within a circle |
| `partner_encouragements` | Encouragement records between partners |
| `prayer_partner_invites` | Pending circle invitations |
| `in_app_notifications` | Cross-user notification queue |
| `intercede_requests` | Community intercession requests |
| `intercede_prayers` | Prayer counts for intercession |
| `community_members` | Legacy community membership |
| `community_sessions` | Legacy community sessions |
| `streak_audit_log` | Audit trail for all streak changes |

## Key Patterns

### Adding a New Feature

1. Create a hook in `src/hooks/`
2. Import and call it in `App.jsx`
3. Pass data to the relevant component
4. Add Supabase table + RLS if needed
5. Add localStorage fallback for offline support

### Adding a New Theme

1. Add CSS overrides in `src/index.css` under a new class
2. Update the preload script in `index.html`
3. Add the option to `useSettings.js`

### Adding a Native Plugin

1. Install the Capacitor plugin
2. Lazy-import in the relevant hook
3. Gate behind `Capacitor.isNativePlatform()` check
4. Provide a web fallback

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public key |

## Roadmap

- [ ] Answered prayer celebration (confetti/candle animation)
- [ ] Weekly summary notification (Sunday recap)
- [ ] Shareable streak/milestone cards (Instagram/WhatsApp)
- [ ] Prayer Journey Map (interactive plan progress)
- [ ] Seasonal/liturgical prayer plans (Lent, Advent, Easter)
- [ ] OAuth authentication (social login)
