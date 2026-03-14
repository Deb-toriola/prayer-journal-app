# My Prayer App

A faith-based prayer journal that helps users track prayers, build streaks, record testimonies, and connect with prayer partners. Built with React + Vite for the web, and Capacitor for iOS and Android.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 6 |
| Backend | Supabase (auth, database, real-time, edge functions) |
| Mobile | Capacitor 8 (iOS + Android) |
| PWA | Workbox via vite-plugin-pwa |
| Icons | Lucide React |
| Styling | CSS custom properties + inline styles |

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
├── components/              # UI components (37 files)
│   ├── Onboarding.jsx       # 3-screen intro flow
│   ├── AuthScreen.jsx       # Sign in / sign up modal
│   ├── PrayerCard.jsx       # Prayer display + actions
│   ├── DailyCheckin.jsx     # Streak card with fire animation
│   ├── CommunityPrayer.jsx  # Groups + posts
│   ├── GroupView.jsx        # Group details + membership
│   ├── PrayerPartners.jsx   # Partner invites + management
│   ├── SettingsPanel.jsx    # Theme, font, toggles
│   └── ...
├── hooks/                   # Custom React hooks (16 files)
│   ├── useAuth.js           # Auth session + password recovery
│   ├── usePrayers.js        # Prayer CRUD + logging
│   ├── useGroups.js         # Group management + real-time
│   ├── useStreak.js         # Streak calculation
│   ├── usePrayerTimer.js    # Session timer
│   └── ...
├── utils/
│   ├── constants.js         # Categories, date formatting
│   ├── storage.js           # localStorage helpers
│   ├── streakTheme.js       # Streak-based visual theming
│   ├── migrateGuestData.js  # Guest → authenticated migration
│   └── sendNotification.js  # Cross-user in-app notifications
└── assets/
    ├── gemini-hands.jpg     # Onboarding background
    └── praying-hands.jpg    # Decorative image
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

Three themes controlled via CSS variables:
- **Dark** (default): `--bg-primary: #0F172A`
- **Light**: `html.light-mode`
- **Minimal**: `html.minimal-mode` (warm parchment)

Theme is preloaded in `index.html` via an inline script to prevent flash.

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
- Keystore: `android/app/my-prayer-app.keystore`
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
