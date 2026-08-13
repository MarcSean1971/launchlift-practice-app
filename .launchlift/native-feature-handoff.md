# LaunchLift native implementation handoff

App: LaunchLift Practice App
Package: site.chatgpt.seelenbinder.launchliftpracticeapp.android
Version: 1.3.1 (15)
Source URL: https://launchlift-practice-app.seelenbinder.chatgpt.site/
## AI scan evidence attached to this build
- Scan: AI-reviewed with gpt-5.6-luna.
- Readiness score: 86%.
- App type: Marketplace-style web app.
- Website/GitHub match: The selected repository references launchlift-practice-app.seelenbinder.chatgpt.site, which matches the scanned website launchlift-practice-app.seelenbinder.chatgpt.site.
- Repository inspected: MarcSean1971/launchlift-practice-app.
- Frameworks: React, Vite, Next.js, Capacitor.
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
  - Website and repository match: The selected repository references launchlift-practice-app.seelenbinder.chatgpt.site, which matches the scanned website launchlift-practice-app.seelenbinder.chatgpt.site.
  - Scan finding: 
  - Scan finding: 
  - Scan finding: 
  - Scan finding: 

This file is written for a layman and a developer/AI builder. Native Android features are not checkboxes. LaunchLift can prepare code, instructions, and checks, but a feature is only live when app code, service setup, backend behavior, Play policy notes, and real-device tests are complete.

## Selected native work

| Feature | Status | First proof needed |
| --- | --- | --- |
| Push notifications | Guided setup + verification required | Firebase config exists. |
| Camera | Guided setup + verification required | Camera opens on Android. |
| Photo and media picker | Guided setup + verification required | Picker opens. |
| Location | Guided setup + verification required | Android permission prompt appears at the right time. |
| Bluetooth and BLE | Guided setup + verification required | Real hardware pairs. |
| NFC tap | Guided setup + verification required | Valid tag works. |
| Device sensors | Guided setup + verification required | Sensor works on real Android hardware. |
| Biometric lock | Guided setup + verification required | Unlock works. |
| Native share | Guided setup + verification required | Share sheet opens. |
| App links and deep links | Guided setup + verification required | Domain verification passes. |
| Offline storage | Guided setup + verification required | Offline mode shows clearly. |
| Background tasks | Guided setup + verification required | Task runs under Android limits. |
| Microphone and voice | Guided setup + verification required | Permission prompt works. |
| Video calls | Guided setup + verification required | Camera works. |
| Network awareness | Guided setup + verification required | Offline state appears. |
| Open other apps | Guided setup + verification required | Target app opens. |
| In-app browser | Guided setup + verification required | Trusted links open. |
| Copy to clipboard | Guided setup + verification required | Copy succeeds. |
| Files and downloads | Guided setup + verification required | File saves. |
| Touch feedback | Guided setup + verification required | Feedback happens only where expected. |
| Barcode or QR scan | Guided setup + verification required | Valid code works. |
| On-device reminders | Guided setup + verification required | Reminder schedules. |
| Native maps | Guided setup + verification required | Map loads. |
| Keyboard polish | Guided setup + verification required | Keyboard does not cover key controls. |
| Device info | Guided setup + verification required | Device details read correctly. |
| Privacy screen | Guided setup + verification required | Sensitive route is protected. |
| Screen reader support | Guided setup + verification required | Android screen reader can complete key flows. |
| Native toast messages | Guided setup + verification required | Toast appears. |

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
