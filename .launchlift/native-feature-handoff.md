# LaunchLift native implementation handoff

App: LaunchLift Practice App
Package: site.chatgpt.seelenbinder.launchliftpracticeapp.android
Version: 1.0.0 (1)
Source URL: https://launchlift-practice-app.seelenbinder.chatgpt.site/
## AI scan evidence attached to this build
- Scan: deterministic or fallback review.
- Readiness score: 85%.
- App type: Marketplace-style web app.
- Website/GitHub match: LaunchLift can inspect the repository, but it does not expose a public homepage URL to prove it powers the scanned website. Confirm the repository before requesting a paid Android build.
- Repository inspected: MarcSean1971/launchlift-practice-app.
- Frameworks: React, Vite, Next.js.
- Website features: login, payments, uploads, marketplace, notifications, ai, location, dating, chat, bluetooth.
- AI recommended native options: deepLinks, network, offline, push, camera, media, files, location, maps, biometrics.
- Evidence summary:
  - Website fetched: https://launchlift-practice-app.seelenbinder.chatgpt.site/ (200)
  - Website routes found: /, /assets/index-DySQWFLW.css, /assets/layout-segment-context-BRqKDGBf.js, /assets/rolldown-runtime-S-ySWqyJ.js, /assets/index-BSHuM6iv.js
  - Website feature hints: login, payments, uploads, marketplace, notifications, ai, location, dating
  - Website text sampled: LaunchLift Practice App · LaunchLift Practice App L LaunchLift Practice App Reusable launch sandbox Original always pres
  - GitHub repo inspected: MarcSean1971/launchlift-practice-app
  - Repo file samples read: package.json, app/PracticeApp.tsx, app/chatgpt-auth.ts, app/layout.tsx, app/page.tsx
- Findings to preserve:
  - Repository match needs confirmation: LaunchLift can inspect the repository, but it does not expose a public homepage URL to prove it powers the scanned website. Confirm the repository before requesting a paid Android build.
  - Push notification flow required: Add FCM token registration, notification preferences, Android channels, and tap routing.
  - Native Android shell recommended: Package the app with Capacitor and keep browser/PWA behavior behind platform-safe checks.
  - Play Store policy pack needed: Prepare data safety, permissions wording, privacy policy, and release notes before submission.
  - Visual capture ready: Desktop and mobile screenshots can be used for store screenshot guidance and brand consistency checks.

This file is written for a layman and a developer/AI builder. Native Android features are not checkboxes. LaunchLift can prepare code, instructions, and checks, but a feature is only live when app code, service setup, backend behavior, Play policy notes, and real-device tests are complete.

## Selected native work

| Feature | Status | First proof needed |
| --- | --- | --- |
| Camera | Guided setup + verification required | Camera opens on Android. |
| Location | Guided setup + verification required | Android permission prompt appears at the right time. |
| Native share | Guided setup + verification required | Share sheet opens. |
| Offline storage | Guided setup + verification required | Offline mode shows clearly. |
| Network awareness | Guided setup + verification required | Offline state appears. |
| Copy to clipboard | Guided setup + verification required | Copy succeeds. |
| Files and downloads | Guided setup + verification required | File saves. |
| Touch feedback | Guided setup + verification required | Feedback happens only where expected. |
| On-device reminders | Guided setup + verification required | Reminder schedules. |

## How to use this pack

1. Read the feature file in `.launchlift/native-features/`.
2. Complete the user/account setup first, such as Firebase for push.
3. Apply the GitHub/Codex code changes or paste the builder instructions into your no-code/AI builder.
4. Rebuild the Android package.
5. Test on a real Android device.
6. Rescan or ask LaunchLift support to verify the evidence before calling the feature ready.

## Status model

- Not requested: the user did not select this native phone feature.
- Planned: LaunchLift captured the goal and generated setup instructions.
- Implemented: app code, service setup, backend behavior, and policy notes were added or linked.
- Needs fix: LaunchLift found missing answers, missing code evidence, missing build artifacts, or failed device evidence.
- Verified: repository/build evidence and a real Android device test show the feature works.
