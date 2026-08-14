# On-device reminders

## Evidence for this selected feature

- No repository code signal was attached for this feature. Treat this as planned until a new scan finds code, setup, backend, policy, and device-test evidence.

## What the user gets
Users can create useful reminders that fire on the Android device and open the right screen.

## What LaunchLift can prepare
- Add Capacitor dependency where safe.
- Add starter helper/module and comments for the selected app flow.
- Add acceptance checklist for human/device testing.

## Capacitor / Android wrapper work
- Install @capacitor/local-notifications.
- Add notification permission handling and tap routing.

## Account or service setup
- No extra third-party account is normally required unless the app already uses a provider for this feature.

## App code work
- Create, edit, and cancel reminder moments.
- Respect user settings.
- Avoid reminders the user did not request.

## Backend work
- Connect backend storage, permissions, or triggers only when the product flow requires it.

## Play Store and policy notes
- Explain reminder/notification use where relevant and avoid spammy messaging.

## Ready only when this is verified
- Reminder schedules.
- Reminder can be canceled.
- Tap opens the intended screen.

## Feature status meanings
- Planned means LaunchLift has the setup path, but the feature is not live yet.
- Implemented means the app/service/backend pieces are present and ready for testing.
- Needs fix means one or more required pieces are missing or unclear.
- Verified means code evidence, build evidence, policy notes, and Android device testing are all present.

## What LaunchLift should not pretend to do automatically
- Know the exact product behavior without the user's answers.
- Mark the feature live before a real Android device test.

Project: LaunchLift Practice App
Generated: 2026-08-14T02:24:14.812Z
