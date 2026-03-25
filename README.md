# My Prayer App

A faith-based prayer journal that helps users track prayers, build streaks, record testimonies, and connect with prayer partners. Built with React + Vite for the web, and Capacitor for iOS and Android.

**Live:** [myprayerapp.uk](https://myprayerapp.uk)
**App Store:** Available on iOS
**Play Store:** Coming soon

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
- **Testimonies** — Mark answered prayers and record testimonies
- **Community Groups** — Create/join prayer groups, share requests, pray together
- **Prayer Partners** — 1-on-1 partner invites and mutual prayer tracking
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
│   ├── CommunityPrayer.jsx  # Groups + posts
│   ├── GroupView.jsx        # Group details + membership
│   ├── PrayerPartners.jsx   # Partner invites + management
│   ├── SettingsPanel.jsx    # Theme, font, notification toggles
│   ├── NotificationSettings.jsx # Prayer reminder time management
│   ├── ExportPDF.jsx        # PDF generation
│   └── ...
├── hooks/                   # Custom React hooks
│   ├── useAuth.js           # Auth session + password recovery
│   ├── usePrayers.js        # Prayer CRUD + logging
│   ├── useGroups.js         # Group management + real-time
│   ├── useStreak.js         # Streak calculation + neglected detection
│   ├── useNotifications.js  # Local notifications (streak, neglected, reminders)
│   ├── useDailyCheckin.js   # Daily check-in + streak tracking
│   ├── usePrayerTimer.js    # Session timer
│   ├── useSettings.js       # App settings + theme management
│   └── ...
├── utils/
│   ├── constants.js         # Categories, date formatting
│   ├── storage.js           # localStorage helpers
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

### Required Tables

The app expects these Supabase tables (with RLS enabled):
- `prayers` — Prayer entries with categories, notes, answered status
- `daily_checkins` — Manual and auto check-in records
- `prayer_plans` — Structured multi-day plans
- `groups` — Prayer groups with admin/member roles
- `group_posts` — Posts within groups
- `group_members` — Membership + pending approvals
- `prayer_partners` — Cross-user partner relationships
- `notifications` — In-app notification queue
- `weekly_projects` — Weekly prayer focus
- `settings` — User preferences (theme, toggles, Bible translation)

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
