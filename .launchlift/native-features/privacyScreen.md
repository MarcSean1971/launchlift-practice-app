# Privacy screen

## Evidence for this selected feature

- No repository code signal was attached for this feature. Treat this as planned until a new scan finds code, setup, backend, policy, and device-test evidence.

## What the user gets
Sensitive screens are harder to expose through screenshots or app switcher previews where Android allows it.

## What LaunchLift can prepare
- Add Capacitor dependency where safe.
- Add starter helper/module and comments for the selected app flow.
- Add acceptance checklist for human/device testing.

## Capacitor / Android wrapper work
- Choose a privacy-screen plugin or native secure-window bridge.
- Apply protection only to sensitive routes.

## Account or service setup
- No extra third-party account is normally required unless the app already uses a provider for this feature.

## App code work
- List sensitive screens.
- Enable and disable protection as users move between routes.
- Do not break normal sharing or support screenshots where needed.

## Backend work
- Connect backend storage, permissions, or triggers only when the product flow requires it.

## Play Store and policy notes
- Explain privacy protection carefully; do not promise impossible screenshot blocking in every context.

## Ready only when this is verified
- Sensitive route is protected.
- Normal route still behaves normally.
- App switcher/screenshot behavior is tested on Android.

## Feature status meanings
- Planned means LaunchLift has the setup path, but the feature is not live yet.
- Implemented means the app/service/backend pieces are present and ready for testing.
- Needs fix means one or more required pieces are missing or unclear.
- Verified means code evidence, build evidence, policy notes, and Android device testing are all present.

## What LaunchLift should not pretend to do automatically
- Know the exact product behavior without the user's answers.
- Mark the feature live before a real Android device test.

Project: LaunchLift Practice App
Generated: 2026-08-13T04:12:00.483Z
