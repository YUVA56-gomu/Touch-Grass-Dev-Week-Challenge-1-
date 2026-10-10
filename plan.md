# 🌿 TOUCH GRASS — Your Friend

## Complete Product Blueprint · Hacktoberfest Dev Week Challenge

```text
touch-grass/
├── public/
│   ├── assets/
│   │   ├── mascot/
│   │   ├── backgrounds/
│   │   ├── nature/
│   │   ├── audio/
│   │   └── icons/
│   └── manifest.webmanifest
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   └── navigation.ts
│   ├── components/
│   │   ├── layout/
│   │   ├── pixel-ui/
│   │   ├── mascot/
│   │   ├── audio-player/
│   │   └── feedback/
│   ├── features/
│   │   ├── friend/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── types.ts
│   │   ├── touch-grass/
│   │   ├── running/
│   │   └── nature-calendar/
│   ├── services/
│   │   ├── ai/
│   │   ├── audio/
│   │   ├── location/
│   │   ├── maps/
│   │   ├── notifications/
│   │   ├── storage/
│   │   └── events/
│   ├── hooks/
│   ├── lib/
│   ├── styles/
│   ├── types/
│   └── main.tsx
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   ├── services/
│   │   ├── providers/
│   │   ├── schemas/
│   │   └── config.py
│   └── tests/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/
│   ├── PRODUCT_BLUEPRINT.md
│   ├── ARCHITECTURE.md
│   ├── DESIGN_SYSTEM.md
│   ├── API_CONTRACTS.md
│   └── DEVELOPMENT_ROADMAP.md
├── .env.example
├── README.md
├── package.json
└── tsconfig.json
├── public/
│   ├── assets/
│   │   ├── mascot/
│   │   ├── backgrounds/
│   │   ├── nature/
│   │   ├── audio/
│   │   └── icons/
│   └── manifest.webmanifest
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   └── navigation.ts
│   ├── components/
│   │   ├── layout/
│   │   ├── pixel-ui/
│   │   ├── mascot/
│   │   ├── audio-player/
│   │   └── feedback/
│   ├── features/
│   │   ├── friend/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── types.ts
│   │   ├── touch-grass/
│   │   ├── running/
│   │   └── nature-calendar/
│   ├── services/
│   │   ├── ai/
│   │   ├── audio/
│   │   ├── location/
│   │   ├── maps/
│   │   ├── notifications/
│   │   ├── storage/
│   │   └── events/
│   ├── hooks/
│   ├── lib/
│   ├── styles/
│   ├── types/
│   └── main.tsx
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   ├── services/
│   │   ├── providers/
│   │   ├── schemas/
│   │   └── config.py
│   └── tests/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/
│   ├── PRODUCT_BLUEPRINT.md
│   ├── ARCHITECTURE.md
│   ├── DESIGN_SYSTEM.md
│   ├── API_CONTRACTS.md
│   └── DEVELOPMENT_ROADMAP.md
├── .env.example
├── README.md
├── package.json
└── tsconfig.json
```
,"language","editable","stop","stop_tokens",[413],200002,"https://images.openai.com/static-rsc-4/HJpihU-oDE1Klza62HXSbP6Xt1x8ZwHuY_k7l6qFflvT99pqDzHIIJKsZ_h8AkSeoQuSbwAnilwkjC6fQ3vipymIK2_c01H1UdVpdRFr7VVr9LENsH7Rn0lZ0imPL5AJ9d2EmeRVLAoVSSRUmx4e_mVNv5LD4L8L_b0W2sl5YKI?purpose=inline","https://easy-peasy.ai/ai-image-generator/images/generate-an-image-of-22a70d25-5bc6-4ed9-894e-732e1038650d","https://images.openai.com/static-rsc-4/8VxWYObf0baeUoFPsNEqi6ECqnTqY1who_3QRZjpy0a1FDXzg3SELD2l7554R9CnQu6SRUObe_xWOHgB7IJUM4vlv-ObZfPEPy6xfTfLTn5XmfcrruSn76Vp6LIbUDJpc8Tbx4Tubq19XhpNsaepmQRblCD7oYbkTtcaZZcKs9jf1OBbZRtV_2wmMmbDnAoi?purpose=fullsize","https://images.openai.com/static-rsc-4/TGOBc9pclEpUYySxvXi_E1MlFmqJyigDrAdWmrOiO-eL2HKSns2UxFEGjLCFzAMFQk4s2jXzmAhdCJT6GNG54v13zfsGrwMU7C-27mKjbUIRKpFXsPAwRtlMj08x8dDFxvCZNwrkqaBAJYv2GiwFOxp_LPNF-D_JXzhwFhhiFEg?purpose=inline","https://us.idyllic.app/gen/pixel-art-village-sandstorm-606078","https://images.openai.com/static-rsc-4/u6zht_GJu8E68B_g_eibVMmuSg_HU4K6cViEG8j5HdnG4TVMGeRE5LTXP64hYmc6jeXNPC-0NHY-ME-fwYe5p_k73Iij9Ao7W2nhEA8ODlKEgplyFBQOM6ieVgjYFJtBWWPdG8fps7J1arFn2TjJX-7ykL-GY5CZzU0J_saNyFIODV8-HK9STdMiF94eOtvc?purpose=fullsize","https://images.openai.com/static-rsc-4/qcwfw4x3b6FkncXZ47x00UYbYRI7TGzHLW16bkiu8uxkjnB_QSAW6Nebrerj6WomsodRSauEyxOAv5FTh8lscQKvODpX5gqRd73E46Tu99wzIh1Tpce5ylcetVjJgKvrM5kJ6JsLR4m3QaJu95T7b7jFCZMsBquvZ-ikVCojdrM?purpose=inline","https://www.pinterest.com/pin/440367669816278639/","https://images.openai.com/static-rsc-4/xLKNLGqvEb7b1t45fz55sDszyPpZtCaOoVVlo9XltpIjaOHFrwjbgvPOS-ofMXmadS5RQx7PsAiypu9h4m1ml5FRv6KUmA8VSRbhxLIXsbDaQKAkyyFpfJYkS3Aev5k38IewIePJXD2u2wOGcCak3inxZmwx3qDSBcr_cRk_V-_r-vnepENXADd0L7YfS33O?purpose=fullsize","https://images.openai.com/static-rsc-4/bW6XghU10xm9SGKXUTW6I9KF2PwLMAhJOggyJPWINwpexNATgcTB-KZ9mot1OL231MW0Lomvxt6-_JBRbNS9xXFD5DNqGaKJhq2kpOwGR8M_J4hJU9Dk_BrXoruOM1IJnTBK4ha1yvp_aLfs5F4pZKnfG5x_zO6aj39wjytKK7I?purpose=inline","https://promptbase.com/prompt/pixel-art-texture-2d-backgrounds","https://images.openai.com/static-rsc-4/BgyKX1XOXS-koNomZlJXME_PUN6jGRSr4Mr8a1Zcebq6Vy1RVzybrjRNsddxnNFGklVshBEBTorTtDcdUB7LtgNFv0JeenjjzCx5Cp6XGKO5QwIBLFl3g-bsssy1ybDFtjQbVQht6dG3fFcMNWX59lfONugEJtrsGotJHRERyx5cggNv5AukAyn_ttCO-JSn?purpose=fullsize","https://images.openai.com/static-rsc-4/gqhdT91308N_RWZD3yPwjNiSJDpiozeD6VMNsxZ8IHcZB63cea93WPMm4NCTuYFxeClX-odwXTj116-l99m5jksOhX73tKOnHFVMAW5zJI51xj3ZnzYo6la_haTr--0Mul_oz0Oh17OWWkV17KCemW1qiD0YezfMFB8VAa2Lot0?purpose=inline","code","function __dilSafe(evaluate,failureValue){try{return evaluate()}catch{return failureValue}}

DIL.render(__dil.jsx(()=\u003e{const __dilConstants=DIL.useConstants();const __dilModelDataBindings=DIL.useAppData((appData)=\u003eappData.opGenui?.modelDataBindings??{});const checks = __dilSafe(()=\u003e([{section:\"Foundation\",items:[\"Four sections navigate correctly\",\"Pixel-art theme is consistent\",\"Desktop and mobile layouts work\",\"Empty, loading and error states are present\"]},{section:\"AI Friend\",items:[\"Friend name persists\",\"Chat handles provider errors\",\"Voice controls work or explain browser limitations\",\"Guided story can pause and stop\",\"Ambient audio respects volume and mute settings\",\"User can inspect and clear saved memory\"]},{section:\"Touch Grass\",items:[\"Outdoor visits persist after refresh\",\"Photos are optional\",\"Distinct outdoor days are counted correctly\",\"Streaks handle date boundaries\",\"Visits can be edited or deleted\"]},{section:\"Running\",items:[\"Location permission is requested appropriately\",\"Distance calculations pass tests\",\"GPS loss is handled\",\"Routes are never fabricated\",\"Rural fallback is available\",\"Run history persists\"]},{section:\"Nature Calendar\",items:[\"All event categories are represented\",\"Timezone conversion is tested\",\"Event sources or calculation methods are recorded\",\"Visibility is location-aware when supported\",\"Reminders respect user preferences\"]},{section:\"Release\",items:[\"Production build succeeds\",\"No secrets are exposed in frontend code\",\"README setup instructions work\",\"Primary user journeys pass end-to-end testing\"]}]),undefined)
\"+s.items.map(i=\u003e(completed.includes(i)?\"[x] \":\"[ ] \")+i).join(\
\")).join(\

## Complete Product Blueprint · Hacktoberfest Dev Week Challenge
image_group

**The mission\\:** Help people reconnect with nature through a kind AI companion, immersive nature experiences, outdoor habits, running adventures and a calendar of natural events.

This blueprint will be our single source of truth while building the project with Antigravity and other development tools. It covers the product vision, UI, features, architecture, technology, data models, AI behavior, implementation milestones, testing and final demonstration.

This is a completely independent project. We will build TOUCH GRASS from scratch, without mixing in architecture or code from your other projects.

## 1\\. Product vision and principles

# The virtual world is the invitation. The real world is the destination.

TOUCH GRASS is not merely a chatbot, fitness tracker or meditation app. It uses a personal AI friend and a cozy pixel-art world to make spending time outdoors feel inviting and rewarding.

---

**Kindness over guilt**

Never shame users for staying indoors or missing a run.

**Nature for everyone**

Support people in cities, small towns and villages, including those without stadiums or nearby parks.

**Privacy and safety**

Ask permission for location, microphone and notifications. Never invent safe routes or guarantee natural events will be visible.

**Progress without pressure**

Celebrate small outdoor moments, not just distance, speed or streaks.

### Target users

- People who spend too much time indoors or scrolling.
- Students and remote workers who need gentle breaks.
- People who feel lazy, unmotivated or disconnected from nature.
- Runners who want simple routes and encouragement.
- Rural users who might have fields, village roads or familiar open grounds rather than formal running facilities.
- Curious people who don't want to miss meteor showers, blooms, wildlife activity, sunsets and other natural events.

## 2\\. The four-section app

image_group

## 01 — Home: Your AI Friend

The emotional center of the app

- Floating, animated mascot.
- Text and voice conversations.
- Listening and speaking states.
- Memory of activities recorded inside the app.
- Personalized encouragement.
- Guided imagination stories with nature audio.
- Suggestions for a walk, a run or a short outdoor break.

## 02 — Touch Grass Tracker

Turn real outdoor visits into memories

- Log an outdoor visit.
- Attach photos and optional notes.
- Track distinct days outdoors, visits and time spent.
- Celebrate milestones and streaks.
- View a personal nature journal.
- Learn about the benefits of outdoor time.

## 03 — Running Companion

Make running accessible anywhere

- Schedule a run and receive reminders.
- Generate route suggestions using available map data.
- Choose a preferred distance.
- Track GPS distance and duration.
- Review past runs and personal milestones.
- Offer sensible alternatives when maps are incomplete.

## 04 — Nature Calendar

Discover what's happening in nature

- Eclipses, meteor showers, moon phases and planetary events.
- Sunrise, sunset, moonrise and moonset.
- Seasonal blooms, foliage and changing landscapes.
- Wildlife observation and bird migration opportunities.
- Weather-dependent natural phenomena.
- Environmental occasions and local outdoor events.
- Personalized advance reminders.

## 3\\. The design system

The supplied images establish our visual direction: a cute green pixel-art mascot and a richly illustrated forest. We should retain that identity throughout the app.

## Visual identity

**Mascot rules**

- One recognizable green friend across all screens.
- Pixel-art expressions for happy, listening, thinking, speaking and resting.
- Smooth transitions between sprites; preserve crisp pixel edges.
- Keep the character friendly rather than overly robotic.

## UI rules

- Use crisp 16-bit pixel-art illustrations and a consistent outline style.
- Keep buttons, navigation, progress bars and cards consistent.
- Use pixel typography for headings and readable body text for longer content.
- Preserve contrast and accessible control sizes.
- Avoid cluttered HUDs, excessive neon, unrelated stock imagery and corporate-looking dashboards.
- Make the nature scenes atmospheric, but never sacrifice interface readability.

The home screen can use a warm sunset or forest clearing, Touch Grass can feel like an immersive meadow, Running can use brighter morning scenery, and the calendar can change to night skies or seasonal landscapes. Different scenes, one world.

## 4\\. Technology stack

For the first release, I recommend a responsive web app. That lets us build and demonstrate the experience quickly, then expand toward mobile capabilities when needed.

**Frontend**

### React + Vite + TypeScript

Responsive UI, reusable components, fast development and a straightforward build process.

**UI and animation**

### CSS + pixel-art assets

CSS for movement, transitions and interface states; Canvas only if the scene needs more complex rendering.

**AI service**

### Provider-independent AI gateway

A server-side interface that can support a hosted LLM or a local model without rewriting the friend UI.

**Voice**

### Browser speech APIs + audio playback

Speech recognition where supported, text-to-speech for responses, and prerecorded or generated nature audio.

**Maps and routes**

### Leaflet + OpenStreetMap data

A map interface plus a pedestrian-capable routing provider or routing engine. Map rendering and route generation are separate responsibilities.

**Storage**

### IndexedDB initially

Save activities, settings and locally stored records. Add a backend database and cloud sync only when needed.

### Backend recommendation

Use a small **FastAPI** backend if the MVP needs server-side AI calls, protected API credentials, calendar integrations or photo synchronization.

For the first version\\:

- Keep UI state and simple preferences in the browser.
- Keep AI-provider secrets on the server.
- Use deterministic code for distance calculations, timers, streaks and calendar calculations.
- Use AI for conversation, storytelling, encouragement and personalized explanations.
- Make location, voice and notification features degrade gracefully when the browser does not support them.

We do not need a complex microservices architecture. A modular frontend and one small API service are sufficient for this project.

## 5\\. Complete application architecture

This is the proposed architecture for the first web release.

## TOUCH GRASS Web App

React · Vite · TypeScript · Pixel-art UI

AI Friend

Chat, voice, stories

Touch Grass

Visits, photos, streaks

Running

Routes, GPS, history

Nature Calendar

Events, visibility, alerts

**Shared application services**

Activity log · Preferences · Audio · Notifications · Location permissions

**API / integrations**

AI provider · Maps and routing · Nature event sources · Optional persistence

### Architecture rules

1. Each of the four sections owns its own feature logic.
2. Shared UI components and services should be reused rather than duplicated.
3. The AI must not be responsible for calculating authoritative GPS distances or verifying astronomical times.
4. Every external service should be behind a small adapter so providers can be replaced.
5. The application should remain useful even if the AI provider or network becomes unavailable.
6. API keys and sensitive credentials must never be embedded in frontend code.

## 6\\. Detailed feature specifications

### 6.1 AI Friend

**Conversation flow**

- User types or speaks.
- The app captures the input and displays the conversation.
- The AI generates a response.
- The app speaks the response when voice mode is enabled.
- The conversation and relevant activity summaries are saved according to the user's settings.

**Required interface states**

**Guided imagination mode**

The user taps a button such as \"Take me somewhere peaceful.\

1. The friend introduces a short session.
2. The scene transitions to a forest, meadow or riverside.
3. Nature ambience fades in.
4. The friend narrates a gentle story.
5. The user can pause, skip, stop or adjust volume.
6. At the end, the friend optionally invites them outdoors.

Example story themes include sitting under a tree with family, walking through a sunlit meadow, watching the rain from a safe shelter, or listening to birds at dawn.

The stories should be original and varied. Never force users to close their eyes, and provide a text alternative to spoken guidance.

**Activity awareness**

The friend may reference information such as\\:

- Outdoor visits logged this week.
- The user's preferred run time.
- Completed guided sessions.
- Saved nature events.
- User-selected goals and preferences.

The app should not claim to see everything the user does on their device. Its memory should be limited to information the user provides or activities the app records, with controls to inspect and clear it.

### 6.2 Touch Grass Tracker

## An outdoor memory journal

# 12

Example outdoor days

# 8

Example visits

# 35m

Example time today

Illustrative sample values, not actual user data.

**Logging an outdoor visit**

The user selects \"I went outside,\" adds a photo if desired, and optionally records the location, duration, mood or a note.

The tracker should distinguish between\\:

- **Visits\\:** individual recorded outings.
- **Outdoor days\\:** distinct local calendar dates with at least one qualifying visit.
- **Streaks\\:** consecutive qualifying dates according to the app's rules.
- **Duration\\:** recorded or timed time spent outdoors.

Photos should not be mandatory. A user may want to enjoy nature without taking out their phone. We should also avoid claiming that a photo proves a visit occurred; photo-based logging is a personal journal feature, not identity or location verification.

**Rewards**

Use gentle achievements such as \"First Outdoor Memory,\" \"Three Days Outside This Week,\" and \"Sunset Explorer.\" Avoid punishing missed days or turning outdoor time into a stressful leaderboard.

### 6.3 Running Companion

**Setup\\:** preferred distance, preferred time, optional reminder, and route preferences.

**During the run\\:** elapsed time, distance, pause/resume and finish controls.

**After the run\\:** route when available, duration, approximate pace, distance and a positive message from the friend.

#### Route-generation logic

**User chooses a distance**

For example, 1 km, 3 km or 5 km

**Obtain permission and inspect map coverage**

**Evaluate candidate routes**

Distance, route continuity, road type and available safety information

**Present a route or an honest fallback**

Never fabricate map coverage or guarantee road safety

**Rural fallback rules**

- Warn when a candidate uses a busy road or highway; avoid recommending high-speed roads for running.
- If reliable routes cannot be found, suggest a familiar open ground or a safe local area the user chooses.
- Offer a timed session or repeated laps where suitable.
- GPS tracking can work independently of map coverage, subject to device permissions and signal quality.

Browser-based tracking may be unreliable when the device locks or the app goes into the background. Reliable background GPS should be treated as a later native-mobile capability, not promised in the first web release.

### 6.4 Nature Calendar

The calendar needs two separate systems: an **event catalogue** and an **event visibility/reminder engine**\\.

| Category | Data and functionality |
|--------|--------|
| Astronomy | Eclipses, meteor showers, moon phases and planetary events |
| Daily sky | Sunrise, sunset, moonrise and moonset |
| Seasons | Regional flowering, foliage and seasonal nature experiences |
| Wildlife | Migration seasons, birdwatching and observation opportunities |
| Weather phenomena | Rainbows, fog, cloud formations and other condition-dependent experiences |
| Nature occasions | Environmental awareness days and conservation activities |
| Local events | Public nature walks, stargazing sessions and other verified outdoor events |

**Event records should include\\:** title, category, description, start and end time, timezone, geographic scope, source, source URL, confidence/status, visibility conditions and reminder preferences.

**Event status must be clear\\:**

- Calculated or scheduled: for predictable astronomical events.
- Forecast: for weather-dependent conditions.
- Seasonal estimate: for blooms and wildlife activity.
- Verified listing: for a confirmed local event.

The app should not invent precise local wildlife dates or promise a rainbow, meteor shower visibility or a flower bloom.

**Reminder behavior**

Users can select which categories they care about and how far in advance they want to be reminded. Avoid notification overload. Browser notifications require permission and may not fire reliably when the browser is closed; reliable scheduled delivery may require a backend scheduler or native push notifications later.

## 7\\. Data model and storage blueprint

We should define the main entities before implementing the features so that all four sections share consistent data.

| Entity | Important fields |
|--------|--------|
| User settings | `friend_name`, `theme`, `voice_enabled`, `location_preferences`, `units` |
| Conversation | `id`, `created_at`, `title` |
| Message | `conversation_id`, `role`, `content`, `timestamp` |
| Friend memory | `type`, `summary`, `source_activity_id`, `updated_at` |
| Outdoor visit | `id`, `date`, `duration`, `photo_refs`, `notes`, `optional_location` |
| Run | `id`, `start_time`, `duration`, `distance_m`, `route_points`, `tracking_status` |
| Run reminder | `id`, `scheduled_time`, `recurrence`, `enabled` |
| Nature event | `id`, `title`, `category`, `start_at`, `end_at`, `source`, `visibility_status` |
| Event reminder | `event_id`, `reminder_time`, `enabled` |
| Achievement | `id`, `type`, `earned_at`, `related_activity_id` |

### Storage strategy

For the initial web app\\:

- Use IndexedDB for structured local records.
- Store settings and small preferences in a simple local settings layer.
- Store photo references and files locally where feasible, with appropriate size limits.
- Keep secrets out of local storage and frontend bundles.
- Add optional accounts, cloud synchronization and remote photo storage only when there is a clear need.

A browser database is not an absolute guarantee of permanent storage. Users can clear site data, and browsers can evict data. The application should explain this and eventually offer export or backup functionality.

### Privacy rules

- Request location only when a feature needs it.
- Explain why the microphone is needed before starting voice input.
- Let users delete conversations, activity history and saved memories.
- Keep sensitive route histories private by default.
- Use explicit permission for notifications and photo access.
- Never upload photos or location histories without a clear user-facing reason and consent.

## 8\\. Recommended repository structure

Keep the frontend feature-oriented. This is the structure I recommend giving Antigravity as the initial project target.

```text

```text
touch-grass/
├── public/
│   ├── assets/
│   │   ├── mascot/
│   │   ├── backgrounds/
│   │   ├── nature/
│   │   ├── audio/
│   │   └── icons/
│   └── manifest.webmanifest
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   └── navigation.ts
│   ├── components/
│   │   ├── layout/
│   │   ├── pixel-ui/
│   │   ├── mascot/
│   │   ├── audio-player/
│   │   └── feedback/
│   ├── features/
│   │   ├── friend/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── types.ts
│   │   ├── touch-grass/
│   │   ├── running/
│   │   └── nature-calendar/
│   ├── services/
│   │   ├── ai/
│   │   ├── audio/
│   │   ├── location/
│   │   ├── maps/
│   │   ├── notifications/
│   │   ├── storage/
│   │   └── events/
│   ├── hooks/
│   ├── lib/
│   ├── styles/
│   ├── types/
│   └── main.tsx
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   ├── services/
│   │   ├── providers/
│   │   ├── schemas/
│   │   └── config.py
│   └── tests/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/
│   ├── PRODUCT_BLUEPRINT.md
│   ├── ARCHITECTURE.md
│   ├── DESIGN_SYSTEM.md
│   ├── API_CONTRACTS.md
│   └── DEVELOPMENT_ROADMAP.md
├── .env.example
├── README.md
├── package.json
└── tsconfig.json
```
```

This is a target structure, not a requirement to create every file immediately. We should introduce directories as their features are implemented. The backend can remain small until an actual server-side capability is required.

## 9\\. How we will use Antigravity and other tools

Antigravity should act as our development environment and coding agent. We should give it bounded implementation tasks, review its changes and test each milestone rather than asking it to generate the entire app in one giant prompt.

**Antigravity — implementation**

Create components, implement features, run tests, diagnose bugs and update documentation. Ask it to inspect the repository before changing existing files.

**Image generation — art assets**

Create consistent mascot expressions, pixel-art backgrounds, scene variations and asset sheets. Keep the mascot silhouette, palette and pixel density consistent.

**Git and GitHub — version control**

Commit each working milestone, maintain a clear README, document setup and ensure changes can be reviewed and rolled back.

**Browser testing — verification**

Check responsive layouts, accessibility, permission-denied states, network failures, audio playback and the main user journeys.

### Rules for coding agents

Add these instructions to the project's `AGENTS.md` or equivalent agent instruction file\\:

- Read `PRODUCT_BLUEPRINT.md` and `ARCHITECTURE.md` before implementing features.
- Preserve the four-section product scope.
- Do not mix in unrelated projects or reuse their code without explicit approval.
- Maintain the green 16-bit pixel-art design system.
- Do not replace supplied artwork with unrelated generic stock images.
- Never hardcode API secrets or fabricate API responses as if they were live data.
- Use interfaces and adapters for replaceable AI, maps, audio and event providers.
- Use deterministic logic for calculations and tracking.
- Test every milestone and report files changed, tests run, known limitations and manual verification steps.
- Do not claim that an integration works until it has been run and verified.

## 10\\. Step-by-step implementation roadmap

Build in this order. Each phase should leave us with a working, testable application.

## 01

**Foundation and visual system**

(First milestone)

Set up React, Vite and TypeScript; establish routing, pixel-art styling, reusable controls, responsive layout and placeholder assets.

**Acceptance\\:** All four sections can be opened, the design is consistent, and the app runs locally.

## 02

**AI Friend and guided nature**

Build mascot animations, chat, friend naming, voice controls, ambient audio and guided imagination sessions.

**Acceptance\\:** A user can have a conversation, start a guided session, pause it, stop it and control the sound.

## 03

**Touch Grass Tracker**

Add activity logging, photo attachments, visit history, distinct-day counting, streaks and achievements.

**Acceptance\\:** Entries survive page refreshes and the dashboard updates correctly.

## 04

**Running Companion**

Add distance selection, map integration, candidate route generation, GPS tracking, history and scheduled reminders.

**Acceptance\\:** Route failures are handled honestly, tracking can be paused and resumed, and distance calculations are tested.

## 05

**Nature Calendar**

Add event categories, astronomical calculations or trusted event feeds, local visibility, filters, saved events and reminders.

**Acceptance\\:** Each event has a source or calculation method, timezone-aware dates and a truthful status.

## 06

**Integration and quality**

Connect the AI provider, polish mobile layouts, test permissions and offline behavior, improve loading states and prepare the public demo.

**Acceptance\\:** The primary journeys work end-to-end, the README is complete and known limitations are documented.

The exact schedule should be based on the time remaining for your challenge and the complexity of the chosen integrations. We should get the core experience working before spending too much time on advanced routing or a complete global nature-event catalogue.

## 11\\. Copy-ready Antigravity prompts

Use these sequentially. Don't ask the coding agent to execute all phases at once.

## Prompt 1 — Create the foundation

[Copy]

Goal: create a working UI shell and reusable components.

## Prompt 2 — Build the AI Friend

Goal: deliver the emotional centerpiece of the product.

## Prompt 3 — Build the tracker

Goal: make outdoor progress useful and reliable.

## Prompt 4 — Build running

Goal: implement real outdoor functionality without unsafe assumptions.

## Prompt 5 — Build the calendar

Goal: create a trustworthy nature-discovery calendar.

## Prompt 6 — Final verification

Goal: produce a tested, demonstrable project rather than a UI-only prototype.

## 12\\. Testing checklist

Use this checklist to track actual implementation progress. A feature is complete only after it has been implemented and verified.

## Project verification

## /

[Copy checklist] [Reset]

This is a manual progress checklist; checking an item does not run or verify a test.

## 13\\. What the final hackathon demo should show

The strongest demonstration is one complete user story, not a tour of disconnected features.

**Scene 1 — Meet your friend**

The user chooses a name, speaks to the companion and sees the mascot react.

**Scene 2 — Experience nature**

The friend guides a short immersive story while the forest scene and natural audio play.

**Scene 3 — Go outside**

The user records an outdoor visit, adds a photo and sees their progress update.

**Scene 4 — Discover something**

The user sees an upcoming nature event, saves it and sets a reminder.

Running should also be demonstrated with a real or clearly labelled test route, including the fallback for areas with insufficient map data.

## 14\\. Scope boundaries: what belongs in the first release?

| Build first | Defer until the core works |
|--------|--------|
| All four section screens | Advanced social networking |
| Pixel-art mascot and consistent UI | Multiplayer or shared virtual worlds |
| AI chat and guided nature sessions | Highly complex autonomous AI behavior |
| Outdoor logging, photos and streaks | Competitive global leaderboards |
| Basic running routes and GPS | Guaranteed safe-route detection |
| Nature event catalogue and reminders | Comprehensive worldwide wildlife forecasting |
| Local persistence | Mandatory accounts and complex cloud synchronization |

We should keep the architecture extensible without building every possible capability before the challenge demo.

## 15\\. Our working documentation

The blueprint should live in the repository, not only in this conversation. Create these documents before implementation expands\\:

- `docs/PRODUCT_BLUEPRINT.md` — this complete product vision and feature specification.
- `docs/ARCHITECTURE.md` — modules, data flow, service boundaries and external integrations.
- `docs/DESIGN_SYSTEM.md` — palette, mascot rules, pixel-art assets, typography and shared components.
- `docs/API_CONTRACTS.md` — AI, routing and nature-event interfaces.
- `docs/DEVELOPMENT_ROADMAP.md` — milestones and acceptance criteria.
- `AGENTS.md` — permanent instructions for Antigravity and other coding agents.
- `README.md` — setup, environment variables, development commands, testing and demo instructions.

**My recommendation for the very first coding session\\:** establish the visual foundation and get all four screens navigable before integrating AI, maps or calendar feeds. This will let us judge whether the application truly feels like one cohesive pixel-art world.

The standard we should aim for is simple: when a user opens TOUCH GRASS, it should feel like meeting a friendly little companion who makes the world outside their screen seem worth exploring. 🌱

If you want, I can:

- Add example AI friend conversation
- Outline implementation milestones
## Complete Product Blueprint · Hacktoberfest Dev Week Challenge

\u003cAsyncImageGroup query={[\"cute lime green smiling teardrop pixel art nature spirit rosy cheeks 16 bit game mascot\",\"lush emerald teal pixel art enchanted forest sunlight rays grass flowers 16 bit retro game background\"]} aspectRatio=\"5:4\" layout=\"bento\" size=\"lg\"/\u003e

**The mission:** Help people reconnect with nature through a kind AI companion, immersive nature experiences, outdoor habits, running adventures and a calendar of natural events.

## 1. Product vision and principles

\u003cbox border radius=\"xl\" padding={4} gap={3}\u003e
\u003ctitle size=\"xl\"\u003eThe virtual world is the invitation. The real world is the destination.\u003c/title\u003e
TOUCH GRASS is not merely a chatbot, fitness tracker or meditation app. It uses a personal AI friend and a cozy pixel-art world to make spending time outdoors feel inviting and rewarding.

\u003cdivider color=\"subtle\"/\u003e

\u003crow align=start gap={2}\u003e
\u003cicon name=\"heart\" color=\"#438B53\" size=\"xl\"/\u003e
\u003cbox flex=\"1\" gap={1}\u003e
**Kindness over guilt**

Never shame users for staying indoors or missing a run.
\u003c/box\u003e
\u003c/row\u003e
\u003crow align=start gap={2}\u003e
\u003cicon name=\"trees\" color=\"#438B53\" size=\"xl\"/\u003e
\u003cbox flex=\"1\" gap={1}\u003e
**Nature for everyone**

Support people in cities, small towns and villages, including those without stadiums or nearby parks.
\u003c/box\u003e
\u003c/row\u003e
\u003crow align=start gap={2}\u003e
\u003cicon name=\"shield-check\" color=\"#438B53\" size=\"xl\"/\u003e
\u003cbox flex=\"1\" gap={1}\u003e
**Privacy and safety**

Ask permission for location, microphone and notifications. Never invent safe routes or guarantee natural events will be visible.
\u003c/box\u003e
\u003c/row\u003e
\u003crow align=start gap={2}\u003e
\u003cicon name=\"sprout\" color=\"#438B53\" size=\"xl\"/\u003e
\u003cbox flex=\"1\" gap={1}\u003e
**Progress without pressure**

Celebrate small outdoor moments, not just distance, speed or streaks.
\u003c/box\u003e
\u003c/row\u003e
\u003c/box\u003e

## 2. The four-section app

\u003cbox gap={3}\u003e
\u003crow align=start gap={3}\u003e
\u003cAsyncImage query=\"cute friendly lime green pixel art teardrop forest spirit mascot smiling in lush forest 16 bit game\" aspectRatio=\"3:4\" maxWidth=\"112px\"/\u003e
\u003cbox flex=\"1\" gap={1}\u003e
\u003ctitle size=\"lg\"\u003e01 — Home: Your AI Friend\u003c/title\u003e
\u003ctext color=\"secondary\" size=\"sm\"\u003eThe emotional center of the app\u003c/text\u003e

- Floating, animated mascot.
- Text and voice conversations.
- Listening and speaking states.
- Memory of activities recorded inside the app.
- Personalized encouragement.
- Guided imagination stories with nature audio.
- Suggestions for a walk, a run or a short outdoor break.
\u003c/box\u003e
\u003c/row\u003e
\u003cdivider color=\"subtle\"/\u003e
\u003crow align=start gap={3}\u003e
\u003cAsyncImage query=\"vibrant green pixel art meadow forest floor flowers sunlight 16 bit cozy retro game landscape\" aspectRatio=\"3:4\" maxWidth=\"112px\"/\u003e
\u003cbox flex=\"1\" gap={1}\u003e
\u003ctitle size=\"lg\"\u003e02 — Touch Grass Tracker\u003c/title\u003e
\u003ctext color=\"secondary\" size=\"sm\"\u003eTurn real outdoor visits into memories\u003c/text\u003e

- Log an outdoor visit.
- Attach photos and optional notes.
- Track distinct days outdoors, visits and time spent.
- Celebrate milestones and streaks.
- View a personal nature journal.
- Learn about the benefits of outdoor time.
\u003c/box\u003e
\u003c/row\u003e
\u003cdivider color=\"subtle\"/\u003e
\u003crow align=start gap={3}\u003e
\u003cbox flex=\"1\" gap={1}\u003e
\u003ctitle size=\"lg\"\u003e03 — Running Companion\u003c/title\u003e
\u003ctext color=\"secondary\" size=\"sm\"\u003eMake running accessible anywhere\u003c/text\u003e

- Schedule a run and receive reminders.
- Generate route suggestions using available map data.
- Choose a preferred distance.
- Track GPS distance and duration.
- Review past runs and personal milestones.
- Offer sensible alternatives when maps are incomplete.
\u003c/box\u003e
\u003c/row\u003e
\u003cdivider color=\"subtle\"/\u003e
\u003crow align=start gap={3}\u003e
\u003cAsyncImage query=\"pixel art night sky stars crescent moon above forest canopy emerald green teal 16 bit retro game illustration\" aspectRatio=\"3:4\" maxWidth=\"112px\"/\u003e
\u003cbox flex=\"1\" gap={1}\u003e
\u003ctitle size=\"lg\"\u003e04 — Nature Calendar\u003c/title\u003e
\u003ctext color=\"secondary\" size=\"sm\"\u003eDiscover what's happening in nature\u003c/text\u003e

- Eclipses, meteor showers, moon phases and planetary events.
- Sunrise, sunset, moonrise and moonset.
- Seasonal blooms, foliage and changing landscapes.
- Wildlife observation and bird migration opportunities.
- Weather-dependent natural phenomena.
- Environmental occasions and local outdoor events.
- Personalized advance reminders.
\u003c/box\u003e
\u003c/row\u003e
\u003c/box\u003e

## 3. The design system

\u003cbox border radius=\"xl\" padding={3} gap={3}\u003e
\u003ctitle size=\"lg\"\u003eVisual identity\u003c/title\u003e
\u003cgrid columns={5} gap={2}\u003e
{#each [{name:\"Forest\",hex:\"#174B35\"},{name:\"Emerald\",hex:\"#23834F\"},{name:\"Leaf\",hex:\"#76CF45\"},{name:\"Lime\",hex:\"#C8F36A\"},{name:\"Sunlight\",hex:\"#F5D66C\"}] as c}
\u003cgrid-item\u003e
\u003cbox gap={1}\u003e
\u003cbox background={c.hex} radius=\"md\" height=\"42px\"/\u003e
\u003ctext weight=\"medium\" size=\"xs\"\u003e{c.name}\u003c/text\u003e
\u003ctext color=\"secondary\" size=\"2xs\"\u003e{c.hex}\u003c/text\u003e
\u003c/box\u003e
\u003c/grid-item\u003e
{/each}
\u003c/grid\u003e
\u003cdivider color=\"subtle\"/\u003e
\u003crow align=start gap={3}\u003e
\u003cAsyncImage query=\"cute green pixel art teardrop mascot smiling rosy cheeks black pixel outline retro handheld game sprite\" aspectRatio=\"1:1\" maxWidth=\"96px\"/\u003e
\u003cbox flex=\"1\" gap={1}\u003e
**Mascot rules**

- One recognizable green friend across all screens.
- Pixel-art expressions for happy, listening, thinking, speaking and resting.
- Smooth transitions between sprites; preserve crisp pixel edges.
- Keep the character friendly rather than overly robotic.
\u003c/box\u003e
\u003c/row\u003e
\u003cdivider color=\"subtle\"/\u003e
\u003ctitle\u003eUI rules\u003c/title\u003e
- Use crisp 16-bit pixel-art illustrations and a consistent outline style.
- Keep buttons, navigation, progress bars and cards consistent.
- Use pixel typography for headings and readable body text for longer content.
- Preserve contrast and accessible control sizes.
- Avoid cluttered HUDs, excessive neon, unrelated stock imagery and corporate-looking dashboards.
- Make the nature scenes atmospheric, but never sacrifice interface readability.
\u003c/box\u003e

## 4. Technology stack

\u003cbox border radius=\"xl\" padding={3} gap={3}\u003e
\u003crow align=center gap={3}\u003e
\u003cbox background=\"surface-secondary\" radius=\"lg\" padding={2}\u003e
\u003cicon name=\"layout\" size=\"xl\"/\u003e
\u003c/box\u003e
\u003cbox flex=\"1\" gap={1}\u003e
**Frontend**
\u003ctitle size=\"md\"\u003eReact + Vite + TypeScript\u003c/title\u003e
\u003ctext color=\"secondary\" size=\"sm\"\u003eResponsive UI, reusable components, fast development and a straightforward build process.\u003c/text\u003e
\u003c/box\u003e
\u003c/row\u003e
\u003cdivider color=\"subtle\"/\u003e
\u003crow align=center gap={3}\u003e
\u003cbox background=\"surface-secondary\" radius=\"lg\" padding={2}\u003e
\u003cicon name=\"palette\" size=\"xl\"/\u003e
\u003c/box\u003e
\u003cbox flex=\"1\" gap={1}\u003e
**UI and animation**
\u003ctitle size=\"md\"\u003eCSS + pixel-art assets\u003c/title\u003e
\u003ctext color=\"secondary\" size=\"sm\"\u003eCSS for movement, transitions and interface states; Canvas only if the scene needs more complex rendering.\u003c/text\u003e
\u003c/box\u003e
\u003c/row\u003e
\u003cdivider color=\"subtle\"/\u003e
\u003crow align=center gap={3}\u003e
\u003cbox background=\"surface-secondary\" radius=\"lg\" padding={2}\u003e
\u003cicon name=\"brain-circuit\" size=\"xl\"/\u003e
\u003c/box\u003e
\u003cbox flex=\"1\" gap={1}\u003e
**AI service**
\u003ctitle size=\"md\"\u003eProvider-independent AI gateway\u003c/title\u003e
\u003ctext color=\"secondary\" size=\"sm\"\u003eA server-side interface that can support a hosted LLM or a local model without rewriting the friend UI.\u003c/text\u003e
\u003c/box\u003e
\u003c/row\u003e
\u003cdivider color=\"subtle\"/\u003e
\u003crow align=center gap={3}\u003e
\u003cbox background=\"surface-secondary\" radius=\"lg\" padding={2}\u003e
\u003cicon name=\"mic\" size=\"xl\"/\u003e
\u003c/box\u003e
\u003cbox flex=\"1\" gap={1}\u003e
**Voice**
\u003ctitle size=\"md\"\u003eBrowser speech APIs + audio playback\u003c/title\u003e
\u003ctext color=\"secondary\" size=\"sm\"\u003eSpeech recognition where supported, text-to-speech for responses, and prerecorded or generated nature audio.\u003c/text\u003e
\u003c/box\u003e
\u003c/row\u003e
\u003cdivider color=\"subtle\"/\u003e
\u003crow align=center gap={3}\u003e
\u003cbox background=\"surface-secondary\" radius=\"lg\" padding={2}\u003e
\u003cicon name=\"map\" size=\"xl\"/\u003e
\u003c/box\u003e
\u003cbox flex=\"1\" gap={1}\u003e
**Maps and routes**
\u003ctitle size=\"md\"\u003eLeaflet + OpenStreetMap data\u003c/title\u003e
\u003ctext color=\"secondary\" size=\"sm\"\u003eA map interface plus a pedestrian-capable routing provider or routing engine. Map rendering and route generation are separate responsibilities.\u003c/text\u003e
\u003c/box\u003e
\u003c/row\u003e
\u003cdivider color=\"subtle\"/\u003e
\u003crow align=center gap={3}\u003e
\u003cbox background=\"surface-secondary\" radius=\"lg\" padding={2}\u003e
\u003cicon name=\"database\" size=\"xl\"/\u003e
\u003c/box\u003e
\u003cbox flex=\"1\" gap={1}\u003e
**Storage**
\u003ctitle size=\"md\"\u003eIndexedDB initially\u003c/title\u003e
\u003ctext color=\"secondary\" size=\"sm\"\u003eSave activities, settings and locally stored records. Add a backend database and cloud sync only when needed.\u003c/text\u003e
\u003c/box\u003e
\u003c/row\u003e
\u003c/box\u003e

For the first version:

## 5. Complete application architecture

\u003cbox border radius=\"xl\" padding={3} gap={2} align=center\u003e
\u003cbox background=\"#E3F1DF\" theme=\"light\" radius=\"lg\" padding={3} width=\"100%\" align=center gap={1}\u003e
\u003ctitle color=\"#285B37\" size=\"lg\"\u003eTOUCH GRASS Web App\u003c/title\u003e
\u003ctext color=\"#285B37\" size=\"sm\"\u003eReact · Vite · TypeScript · Pixel-art UI\u003c/text\u003e
\u003c/box\u003e
\u003cgrid columns={2} gap={2}\u003e
\u003cgrid-item\u003e
\u003cbox border radius=\"lg\" padding={2} align=center gap={1}\u003e
\u003cicon name=\"message-circle\" size=\"lg\"/\u003e
\u003ctext weight=\"medium\" textAlign=\"center\"\u003eAI Friend\u003c/text\u003e
\u003ctext color=\"secondary\" size=\"xs\" textAlign=\"center\"\u003eChat, voice, stories\u003c/text\u003e
\u003c/box\u003e
\u003c/grid-item\u003e
\u003cgrid-item\u003e
\u003cbox border radius=\"lg\" padding={2} align=center gap={1}\u003e
\u003cicon name=\"sprout\" size=\"lg\"/\u003e
\u003ctext weight=\"medium\" textAlign=\"center\"\u003eTouch Grass\u003c/text\u003e
\u003ctext color=\"secondary\" size=\"xs\" textAlign=\"center\"\u003eVisits, photos, streaks\u003c/text\u003e
\u003c/box\u003e
\u003c/grid-item\u003e
\u003cgrid-item\u003e
\u003cbox border radius=\"lg\" padding={2} align=center gap={1}\u003e
\u003cicon name=\"footprints\" size=\"lg\"/\u003e
\u003ctext weight=\"medium\" textAlign=\"center\"\u003eRunning\u003c/text\u003e
\u003ctext color=\"secondary\" size=\"xs\" textAlign=\"center\"\u003eRoutes, GPS, history\u003c/text\u003e
\u003c/box\u003e
\u003c/grid-item\u003e
\u003cgrid-item\u003e
\u003cbox border radius=\"lg\" padding={2} align=center gap={1}\u003e
\u003cicon name=\"calendar-days\" size=\"lg\"/\u003e
\u003ctext weight=\"medium\" textAlign=\"center\"\u003eNature Calendar\u003c/text\u003e
\u003ctext color=\"secondary\" size=\"xs\" textAlign=\"center\"\u003eEvents, visibility, alerts\u003c/text\u003e
\u003c/box\u003e
\u003c/grid-item\u003e
\u003c/grid\u003e
\u003cicon name=\"arrow-down\" size=\"lg\" color=\"secondary\"/\u003e
\u003cbox border radius=\"lg\" padding={3} width=\"100%\" align=center gap={1}\u003e
**Shared application services**
\u003ctext color=\"secondary\" size=\"sm\" textAlign=\"center\"\u003eActivity log · Preferences · Audio · Notifications · Location permissions\u003c/text\u003e
\u003c/box\u003e
\u003cicon name=\"arrow-down\" size=\"lg\" color=\"secondary\"/\u003e
\u003cbox background=\"surface-secondary\" radius=\"lg\" padding={3} width=\"100%\" align=center gap={1}\u003e
**API / integrations**
\u003ctext color=\"secondary\" size=\"sm\" textAlign=\"center\"\u003eAI provider · Maps and routing · Nature event sources · Optional persistence\u003c/text\u003e
\u003c/box\u003e

## 6. Detailed feature specifications

\u003cbox gap={2}\u003e
{#each [{title:\"Idle\",desc:\"The mascot breathes or gently floats.\"},{title:\"Listening\",desc:\"Subtle visual response while microphone input is active.\"},{title:\"Thinking\",desc:\"A small animation while waiting for the AI.\"},{title:\"Speaking\",desc:\"Mouth or expression animation synchronized approximately with playback.\"},{title:\"Resting\",desc:\"The friend offers a quiet, non-intrusive presence.\"}] as s}
\u003crow align=start gap={3}\u003e
\u003cicon name=\"circle-dot\" color=\"#438B53\" size=\"lg\"/\u003e
\u003cbox flex=\"1\" gap={1}\u003e
**{s.title}**
\u003ctext color=\"secondary\" size=\"sm\"\u003e{s.desc}\u003c/text\u003e
\u003c/box\u003e
\u003c/row\u003e
{/each}
\u003c/box\u003e

The friend may reference information such as:

\u003cbox border radius=\"xl\" padding={3} gap={3}\u003e
\u003ctitle size=\"lg\"\u003eAn outdoor memory journal\u003c/title\u003e
\u003cgrid columns={3} gap={2}\u003e
\u003cgrid-item\u003e
\u003cbox background=\"surface-secondary\" radius=\"lg\" padding={2} align=center gap={1}\u003e
\u003ctitle size=\"xl\"\u003e12\u003c/title\u003e
\u003ctext color=\"secondary\" size=\"xs\" textAlign=\"center\"\u003eExample outdoor days\u003c/text\u003e
\u003c/box\u003e
\u003c/grid-item\u003e
\u003cgrid-item\u003e
\u003cbox background=\"surface-secondary\" radius=\"lg\" padding={2} align=center gap={1}\u003e
\u003ctitle size=\"xl\"\u003e8\u003c/title\u003e
\u003ctext color=\"secondary\" size=\"xs\" textAlign=\"center\"\u003eExample visits\u003c/text\u003e
\u003c/box\u003e
\u003c/grid-item\u003e
\u003cgrid-item\u003e
\u003cbox background=\"surface-secondary\" radius=\"lg\" padding={2} align=center gap={1}\u003e
\u003ctitle size=\"xl\"\u003e35m\u003c/title\u003e
\u003ctext color=\"secondary\" size=\"xs\" textAlign=\"center\"\u003eExample time today\u003c/text\u003e
\u003c/box\u003e
\u003c/grid-item\u003e
\u003c/grid\u003e
\u003ctext color=\"secondary\" size=\"xs\"\u003eIllustrative sample values, not actual user data.\u003c/text\u003e
\u003c/box\u003e

The tracker should distinguish between:

- **Visits:** individual recorded outings.
- **Outdoor days:** distinct local calendar dates with at least one qualifying visit.
- **Streaks:** consecutive qualifying dates according to the app's rules.
- **Duration:** recorded or timed time spent outdoors.

**Setup:** preferred distance, preferred time, optional reminder, and route preferences.

**During the run:** elapsed time, distance, pause/resume and finish controls.

**After the run:** route when available, duration, approximate pace, distance and a positive message from the friend.

\u003cbox border radius=\"xl\" padding={3} gap={2} align=center\u003e
\u003cbox border radius=\"lg\" padding={3} width=\"100%\" align=center\u003e
**User chooses a distance**
\u003ctext color=\"secondary\" size=\"sm\"\u003eFor example, 1 km, 3 km or 5 km\u003c/text\u003e
\u003c/box\u003e
\u003cicon name=\"arrow-down\" color=\"secondary\" size=\"lg\"/\u003e
\u003cbox border radius=\"lg\" padding={3} width=\"100%\" align=center\u003e
**Obtain permission and inspect map coverage**
\u003c/box\u003e
\u003cicon name=\"arrow-down\" color=\"secondary\" size=\"lg\"/\u003e
\u003cbox border radius=\"lg\" padding={3} width=\"100%\" align=center\u003e
**Evaluate candidate routes**
\u003ctext color=\"secondary\" size=\"sm\"\u003eDistance, route continuity, road type and available safety information\u003c/text\u003e
\u003c/box\u003e
\u003cicon name=\"arrow-down\" color=\"secondary\" size=\"lg\"/\u003e
\u003cbox border radius=\"lg\" padding={3} width=\"100%\" align=center\u003e
**Present a route or an honest fallback**
\u003ctext color=\"secondary\" size=\"sm\"\u003eNever fabricate map coverage or guarantee road safety\u003c/text\u003e
\u003c/box\u003e

The calendar needs two separate systems: an **event catalogue** and an **event visibility/reminder engine**.

| Category | Data and functionality |
|---|---|
| Astronomy | Eclipses, meteor showers, moon phases and planetary events |
| Daily sky | Sunrise, sunset, moonrise and moonset |
| Seasons | Regional flowering, foliage and seasonal nature experiences |
| Wildlife | Migration seasons, birdwatching and observation opportunities |
| Weather phenomena | Rainbows, fog, cloud formations and other condition-dependent experiences |
| Nature occasions | Environmental awareness days and conservation activities |
| Local events | Public nature walks, stargazing sessions and other verified outdoor events |

**Event records should include:** title, category, description, start and end time, timezone, geographic scope, source, source URL, confidence/status, visibility conditions and reminder preferences.

**Event status must be clear:**

## 7. Data model and storage blueprint

| Entity | Important fields |
|---|---|
| User settings | `friend_name`, `theme`, `voice_enabled`, `location_preferences`, `units` |
| Conversation | `id`, `created_at`, `title` |
| Message | `conversation_id`, `role`, `content`, `timestamp` |
| Friend memory | `type`, `summary`, `source_activity_id`, `updated_at` |
| Outdoor visit | `id`, `date`, `duration`, `photo_refs`, `notes`, `optional_location` |
| Run | `id`, `start_time`, `duration`, `distance_m`, `route_points`, `tracking_status` |
| Run reminder | `id`, `scheduled_time`, `recurrence`, `enabled` |
| Nature event | `id`, `title`, `category`, `start_at`, `end_at`, `source`, `visibility_status` |
| Event reminder | `event_id`, `reminder_time`, `enabled` |
| Achievement | `id`, `type`, `earned_at`, `related_activity_id` |

For the initial web app:

## 8. Recommended repository structure

\u003cCodeBlock language=\"text\" editable\u003e
\u003c/CodeBlock\u003e

## 9. How we will use Antigravity and other tools

\u003cbox gap={3}\u003e
\u003crow align=start gap={3}\u003e
\u003cbox background=\"surface-secondary\" radius=\"lg\" padding={2}\u003e
\u003cicon name=\"code\" size=\"xl\"/\u003e
\u003c/box\u003e
\u003cbox flex=\"1\" gap={1}\u003e
**Antigravity — implementation**

Create components, implement features, run tests, diagnose bugs and update documentation. Ask it to inspect the repository before changing existing files.
\u003c/box\u003e
\u003c/row\u003e
\u003crow align=start gap={3}\u003e
\u003cbox background=\"surface-secondary\" radius=\"lg\" padding={2}\u003e
\u003cicon name=\"image\" size=\"xl\"/\u003e
\u003c/box\u003e
\u003cbox flex=\"1\" gap={1}\u003e
**Image generation — art assets**

Create consistent mascot expressions, pixel-art backgrounds, scene variations and asset sheets. Keep the mascot silhouette, palette and pixel density consistent.
\u003c/box\u003e
\u003c/row\u003e
\u003crow align=start gap={3}\u003e
\u003cbox background=\"surface-secondary\" radius=\"lg\" padding={2}\u003e
\u003cicon name=\"git-branch\" size=\"xl\"/\u003e
\u003c/box\u003e
\u003cbox flex=\"1\" gap={1}\u003e
**Git and GitHub — version control**

Commit each working milestone, maintain a clear README, document setup and ensure changes can be reviewed and rolled back.
\u003c/box\u003e
\u003c/row\u003e
\u003crow align=start gap={3}\u003e
\u003cbox background=\"surface-secondary\" radius=\"lg\" padding={2}\u003e
\u003cicon name=\"test-tube\" size=\"xl\"/\u003e
\u003c/box\u003e
\u003cbox flex=\"1\" gap={1}\u003e
**Browser testing — verification**

Check responsive layouts, accessibility, permission-denied states, network failures, audio playback and the main user journeys.
\u003c/box\u003e
\u003c/row\u003e
\u003c/box\u003e

Add these instructions to the project's `AGENTS.md` or equivalent agent instruction file:

## 10. Step-by-step implementation roadmap

\u003cbox gap={3}\u003e
\u003crow align=start gap={3}\u003e
\u003cbox background=\"surface-secondary\" radius=\"lg\" padding={2} size=\"44px\" align=center justify=center\u003e
\u003ctitle size=\"lg\"\u003e01\u003c/title\u003e
\u003c/box\u003e
\u003cbox flex=\"1\" gap={1}\u003e
**Foundation and visual system**

\u003cbadge color=\"success\"\u003eFirst milestone\u003c/badge\u003e

**Acceptance:** All four sections can be opened, the design is consistent, and the app runs locally.
\u003c/box\u003e
\u003c/row\u003e
\u003cdivider color=\"subtle\"/\u003e
\u003crow align=start gap={3}\u003e
\u003cbox background=\"surface-secondary\" radius=\"lg\" padding={2} size=\"44px\" align=center justify=center\u003e
\u003ctitle size=\"lg\"\u003e02\u003c/title\u003e
\u003c/box\u003e
\u003cbox flex=\"1\" gap={1}\u003e
**AI Friend and guided nature**

**Acceptance:** A user can have a conversation, start a guided session, pause it, stop it and control the sound.
\u003c/box\u003e
\u003c/row\u003e
\u003cdivider color=\"subtle\"/\u003e
\u003crow align=start gap={3}\u003e
\u003cbox background=\"surface-secondary\" radius=\"lg\" padding={2} size=\"44px\" align=center justify=center\u003e
\u003ctitle size=\"lg\"\u003e03\u003c/title\u003e
\u003c/box\u003e
\u003cbox flex=\"1\" gap={1}\u003e
**Touch Grass Tracker**

**Acceptance:** Entries survive page refreshes and the dashboard updates correctly.
\u003c/box\u003e
\u003c/row\u003e
\u003cdivider color=\"subtle\"/\u003e
\u003crow align=start gap={3}\u003e
\u003cbox background=\"surface-secondary\" radius=\"lg\" padding={2} size=\"44px\" align=center justify=center\u003e
\u003ctitle size=\"lg\"\u003e04\u003c/title\u003e
\u003c/box\u003e
\u003cbox flex=\"1\" gap={1}\u003e
**Running Companion**

**Acceptance:** Route failures are handled honestly, tracking can be paused and resumed, and distance calculations are tested.
\u003c/box\u003e
\u003c/row\u003e
\u003cdivider color=\"subtle\"/\u003e
\u003crow align=start gap={3}\u003e
\u003cbox background=\"surface-secondary\" radius=\"lg\" padding={2} size=\"44px\" align=center justify=center\u003e
\u003ctitle size=\"lg\"\u003e05\u003c/title\u003e
\u003c/box\u003e
\u003cbox flex=\"1\" gap={1}\u003e
**Nature Calendar**

**Acceptance:** Each event has a source or calculation method, timezone-aware dates and a truthful status.
\u003c/box\u003e
\u003c/row\u003e
\u003cdivider color=\"subtle\"/\u003e
\u003crow align=start gap={3}\u003e
\u003cbox background=\"surface-secondary\" radius=\"lg\" padding={2} size=\"44px\" align=center justify=center\u003e
\u003ctitle size=\"lg\"\u003e06\u003c/title\u003e
\u003c/box\u003e
\u003cbox flex=\"1\" gap={1}\u003e
**Integration and quality**

**Acceptance:** The primary journeys work end-to-end, the README is complete and known limitations are documented.
\u003c/box\u003e
\u003c/row\u003e
\u003c/box\u003e

## 11. Copy-ready Antigravity prompts

\u003cbox border radius=\"xl\" padding={3} gap={2}\u003e
\u003crow align=center\u003e
\u003ctitle size=\"lg\"\u003ePrompt 1 — Create the foundation\u003c/title\u003e
\u003cspacer/\u003e
\u003cbutton variant=\"outline\" color=\"secondary\" onClick={() =\u003e GenUI.copy(\"Build the initial TOUCH GRASS — Your Friend web application from scratch using React, Vite, and TypeScript. First inspect the repository. Read the product blueprint and preserve its four sections: Home / AI Friend, Touch Grass Tracker, Running Companion, and Nature Calendar. Establish a responsive pixel-art design system inspired by the supplied green mascot and emerald forest references. Implement shared navigation, reusable pixel-style buttons/cards, layout, loading/empty/error states, and placeholder pages for all four sections. Use green, emerald, teal, lime, and warm sunlight tones. Do not implement fake live AI, map, or calendar integrations. Add accessible controls, setup instructions, and tests. Run the build and report changed files, results, and known limitations.\")}\u003e\u003cicon name=\"copy\" size=\"xs\" inline/\u003e Copy\u003c/button\u003e
\u003c/row\u003e
\u003ctext color=\"secondary\" size=\"sm\"\u003eGoal: create a working UI shell and reusable components.\u003c/text\u003e
\u003cdivider color=\"subtle\"/\u003e
\u003crow align=center\u003e
\u003ctitle size=\"lg\"\u003ePrompt 2 — Build the AI Friend\u003c/title\u003e
\u003cspacer/\u003e
\u003cbutton variant=\"outline\" color=\"secondary\" onClick={() =\u003e GenUI.copy(\"Implement the TOUCH GRASS AI Friend feature according to PRODUCT_BLUEPRINT.md. Add the named friend, friendly chat UI, explicit listening/thinking/speaking/idle states, configurable voice playback, and a guided imagination mode with ambient nature audio, pause/stop controls, volume and text fallback. Create a provider interface for the AI so providers can be swapped later. Keep credentials out of the frontend. Store only user-approved conversation and activity memory. Handle unsupported browser speech APIs and network errors gracefully. Use mock providers only in clearly labelled development/test mode. Add unit and integration tests and run them.\")}\u003e\u003cicon name=\"copy\" size=\"xs\" inline/\u003e Copy\u003c/button\u003e
\u003c/row\u003e
\u003ctext color=\"secondary\" size=\"sm\"\u003eGoal: deliver the emotional centerpiece of the product.\u003c/text\u003e
\u003cdivider color=\"subtle\"/\u003e
\u003crow align=center\u003e
\u003ctitle size=\"lg\"\u003ePrompt 3 — Build the tracker\u003c/title\u003e
\u003cspacer/\u003e
\u003cbutton variant=\"outline\" color=\"secondary\" onClick={() =\u003e GenUI.copy(\"Implement the TOUCH GRASS Tracker feature according to PRODUCT_BLUEPRINT.md. Support outdoor visit logging, optional photo attachments, notes, optional duration and location, visit history, distinct outdoor-day counting, streaks and achievements. Persist records using IndexedDB and recover gracefully from storage errors. Do not require photos or claim they verify a visit. Define timezone and streak rules explicitly. Add tests for duplicate visits on one day, date boundaries, missing photos, deletion and persistence. Match the established green pixel-art design system.\")}\u003e\u003cicon name=\"copy\" size=\"xs\" inline/\u003e Copy\u003c/button\u003e
\u003c/row\u003e
\u003ctext color=\"secondary\" size=\"sm\"\u003eGoal: make outdoor progress useful and reliable.\u003c/text\u003e
\u003cdivider color=\"subtle\"/\u003e
\u003crow align=center\u003e
\u003ctitle size=\"lg\"\u003ePrompt 4 — Build running\u003c/title\u003e
\u003cspacer/\u003e
\u003cbutton variant=\"outline\" color=\"secondary\" onClick={() =\u003e GenUI.copy(\"Implement the TOUCH GRASS Running Companion according to PRODUCT_BLUEPRINT.md. Separate location, map rendering, pedestrian routing, GPS tracking and reminder services. Let users choose distance, view candidate routes when available, track duration and GPS distance, pause/resume, and save runs. Handle denied permissions, poor GPS, network failures and unavailable map coverage. Never invent routes or label a route safe without sufficient evidence. Warn about busy roads and provide a manual familiar-ground/timed-run fallback. Clearly document browser background-tracking limitations. Add unit tests for distance calculations, invalid GPS points, session transitions and route failure handling.\")}\u003e\u003cicon name=\"copy\" size=\"xs\" inline/\u003e Copy\u003c/button\u003e
\u003c/row\u003e
\u003ctext color=\"secondary\" size=\"sm\"\u003eGoal: implement real outdoor functionality without unsafe assumptions.\u003c/text\u003e
\u003cdivider color=\"subtle\"/\u003e
\u003crow align=center\u003e
\u003ctitle size=\"lg\"\u003ePrompt 5 — Build the calendar\u003c/title\u003e
\u003cspacer/\u003e
\u003cbutton variant=\"outline\" color=\"secondary\" onClick={() =\u003e GenUI.copy(\"Implement the TOUCH GRASS Nature Calendar according to PRODUCT_BLUEPRINT.md. Support astronomy, daily sky times, seasons, wildlife opportunities, weather-dependent phenomena, nature occasions and verified local outdoor events. Define a normalized event schema, timezone handling, source attribution, geographic scope and status labels for calculated, forecast, seasonal-estimate and verified events. Implement category filters, saved events and configurable reminders. Do not fabricate live events or visibility data. Isolate external providers behind adapters and clearly label unavailable data. Add tests for timezones, event visibility logic, duplicate events and reminder scheduling.\")}\u003e\u003cicon name=\"copy\" size=\"xs\" inline/\u003e Copy\u003c/button\u003e
\u003c/row\u003e
\u003ctext color=\"secondary\" size=\"sm\"\u003eGoal: create a trustworthy nature-discovery calendar.\u003c/text\u003e
\u003cdivider color=\"subtle\"/\u003e
\u003crow align=center\u003e
\u003ctitle size=\"lg\"\u003ePrompt 6 — Final verification\u003c/title\u003e
\u003cspacer/\u003e
\u003cbutton variant=\"outline\" color=\"secondary\" onClick={() =\u003e GenUI.copy(\"Audit TOUCH GRASS against PRODUCT_BLUEPRINT.md and the acceptance criteria for all four sections. Run the available unit, integration and end-to-end tests, type checking, linting and production build. Fix reproducible defects without redesigning unrelated features. Verify mobile and desktop layouts, keyboard accessibility, permission-denied flows, offline behavior, empty states, API failures, photo handling, AI error states, running-session calculations and calendar timezones. Check for leaked secrets, misleading mocked data and unhandled errors. Update README and architecture documentation with exact setup steps, environment variables, integration status, test results and remaining limitations. Report only verified results.\")}\u003e\u003cicon name=\"copy\" size=\"xs\" inline/\u003e Copy\u003c/button\u003e
\u003c/row\u003e
\u003ctext color=\"secondary\" size=\"sm\"\u003eGoal: produce a tested, demonstrable project rather than a UI-only prototype.\u003c/text\u003e
\u003c/box\u003e

## 12. Testing checklist

{@body const checks = [{section:\"Foundation\",items:[\"Four sections navigate correctly\",\"Pixel-art theme is consistent\",\"Desktop and mobile layouts work\",\"Empty, loading and error states are present\"]},{section:\"AI Friend\",items:[\"Friend name persists\",\"Chat handles provider errors\",\"Voice controls work or explain browser limitations\",\"Guided story can pause and stop\",\"Ambient audio respects volume and mute settings\",\"User can inspect and clear saved memory\"]},{section:\"Touch Grass\",items:[\"Outdoor visits persist after refresh\",\"Photos are optional\",\"Distinct outdoor days are counted correctly\",\"Streaks handle date boundaries\",\"Visits can be edited or deleted\"]},{section:\"Running\",items:[\"Location permission is requested appropriately\",\"Distance calculations pass tests\",\"GPS loss is handled\",\"Routes are never fabricated\",\"Rural fallback is available\",\"Run history persists\"]},{section:\"Nature Calendar\",items:[\"All event categories are represented\",\"Timezone conversion is tested\",\"Event sources or calculation methods are recorded\",\"Visibility is location-aware when supported\",\"Reminders respect user preferences\"]},{section:\"Release\",items:[\"Production build succeeds\",\"No secrets are exposed in frontend code\",\"README setup instructions work\",\"Primary user journeys pass end-to-end testing\"]}]}
{@body const [completed,setCompleted] = DIL.useState([])}
\u003cbox border radius=\"xl\" padding={3} gap={3}\u003e
\u003crow align=center\u003e
\u003ctitle size=\"lg\"\u003eProject verification\u003c/title\u003e
\u003cspacer/\u003e
\u003ctitle size=\"lg\" color=\"success\"\u003e{completed.length}/{checks.reduce((n,s)=\u003en+s.items.length,0)}\u003c/title\u003e
\u003c/row\u003e
\u003cbox background=\"surface-tertiary\" height=\"6px\" radius=\"full\" clip\u003e
\u003cbox background=\"#438B53\" height=\"6px\" radius=\"full\" width={`${completed.length/checks.reduce((n,s)=\u003en+s.items.length,0)*100}%`}/\u003e
\u003c/box\u003e
{#each checks as section}
\u003cbox gap={2}\u003e
\u003ctext weight=\"medium\"\u003e{section.section}\u003c/text\u003e
{#each section.items as item}
\u003ccheckbox key={item} checked={completed.includes(item)} onChange={v=\u003esetCompleted(prev=\u003ev?[...prev,item]:prev.filter(x=\u003ex!==item))}\u003e{item}\u003c/checkbox\u003e
{/each}
\u003c/box\u003e
\u003cdivider color=\"subtle\"/\u003e
{/each}
\u003crow\u003e
\u003cbutton variant=\"outline\" color=\"secondary\" onClick={()=\u003eGenUI.copy(checks.map(s=\u003es.section+\
\"+s.items.map(i=\u003e(completed.includes(i)?\"[x] \":\"[ ] \")+i).join(\
\")).join(\

\"))}\u003e\u003cicon name=\"copy\" size=\"xs\" inline/\u003e Copy checklist\u003c/button\u003e
\u003cbutton variant=\"ghost\" color=\"secondary\" onClick={()=\u003esetCompleted([])}\u003eReset\u003c/button\u003e
\u003c/row\u003e
\u003ctext color=\"secondary\" size=\"xs\"\u003eThis is a manual progress checklist; checking an item does not run or verify a test.\u003c/text\u003e
\u003c/box\u003e

## 13. What the final hackathon demo should show

\u003cbox gap={2}\u003e
\u003crow align=start gap={3}\u003e
\u003cAsyncImage query=\"cute green pixel art forest spirit mascot on cozy forest clearing retro 16 bit game\" aspectRatio=\"1:1\" maxWidth=\"88px\"/\u003e
\u003cbox flex=\"1\" gap={1}\u003e
**Scene 1 — Meet your friend**

The user chooses a name, speaks to the companion and sees the mascot react.
\u003c/box\u003e
\u003c/row\u003e
\u003crow align=start gap={3}\u003e
\u003cAsyncImage query=\"emerald green pixel art forest with golden sun rays birds grass tranquil 16 bit game background\" aspectRatio=\"1:1\" maxWidth=\"88px\"/\u003e
\u003cbox flex=\"1\" gap={1}\u003e
**Scene 2 — Experience nature**

The friend guides a short immersive story while the forest scene and natural audio play.
\u003c/box\u003e
\u003c/row\u003e
\u003crow align=start gap={3}\u003e
\u003cbox flex=\"1\" gap={1}\u003e
**Scene 3 — Go outside**

The user records an outdoor visit, adds a photo and sees their progress update.
\u003c/box\u003e
\u003c/row\u003e
\u003crow align=start gap={3}\u003e
\u003cAsyncImage query=\"pixel art starry night sky crescent moon above emerald forest 16 bit retro illustration\" aspectRatio=\"1:1\" maxWidth=\"88px\"/\u003e
\u003cbox flex=\"1\" gap={1}\u003e
**Scene 4 — Discover something**

The user sees an upcoming nature event, saves it and sets a reminder.
\u003c/box\u003e
\u003c/row\u003e
\u003c/box\u003e

## 14. Scope boundaries: what belongs in the first release?

| Build first | Defer until the core works |
|---|---|
| All four section screens | Advanced social networking |
| Pixel-art mascot and consistent UI | Multiplayer or shared virtual worlds |
| AI chat and guided nature sessions | Highly complex autonomous AI behavior |
| Outdoor logging, photos and streaks | Competitive global leaderboards |
| Basic running routes and GPS | Guaranteed safe-route detection |
| Nature event catalogue and reminders | Comprehensive worldwide wildlife forecasting |
| Local persistence | Mandatory accounts and complex cloud synchronization |

## 15. Our working documentation

The blueprint should live in the repository, not only in this conversation. Create these documents before implementation expands:

**My recommendation for the very first coding session:** establish the visual foundation and get all four screens navigable before integrating AI, maps or calendar feeds. This will let us judge whether the application truly feels like one cohesive pixel-art world.

- Add example AI friend conversation
- Outline implementation milestones
- Define data model schema","assistant","name",{},"dd",{"_1678":1679,"_1680":1681},"disablePrefetch","shouldPrefetchAccount","shouldPrefetchUser","shouldPrefetchSystemHints","manageRootRouteStylesheet","mobileWebHandoffEnabled","promoteCss","disableSSR","stripModulepreloadImports","paidCampaignAppRedirect","statsigGateEvaluationsPromise",["P",1677],"traceId","16776556077891881327","traceTime",1791610397730]
);</script><!--$?--><template id="B:1"></template><!--/$--></div><script nonce="7e563a7d-3f3f-44b0-9785-85b689ddf9e6">$RB=[];$RV=function(a){$RT=performance.now();for(var b=0;b<a.length;b+=2){var c=a[b],e=a[b+1];null!==e.parentNode&&e.parentNode.removeChild(e);var f=c.parentNode;if(f){var g=c.previousSibling,h=0;do{if(c&&8===c.nodeType){var d=c.data;if("/$"===d||"/&"===d)if(0===h)break;else h--;else"$"!==d&&"$?"!==d&&"$~"!==d&&"$!"!==d&&"&"!==d||h++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;e.firstChild;)f.insertBefore(e.firstChild,c);g.data="$";g._reactRetry&&requestAnimationFrame(g._reactRetry)}}a.length=0};