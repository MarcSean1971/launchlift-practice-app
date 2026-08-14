# Open other apps

## Evidence for this selected feature

- Current code-inspection status: found (100% confidence).
- Evidence found:
  - @capacitor/app-launcher dependency present
  - Open-other-app naming appears in repo tree

## What the user gets
Users can open maps, email, calls, or another installed app from an intentional tap.

## What LaunchLift can prepare
- Add Capacitor dependency where safe.
- Add starter helper/module and comments for the selected app flow.
- Add acceptance checklist for human/device testing.

## Capacitor / Android wrapper work
- Install @capacitor/app-launcher.
- Check whether the target app or URL can be opened before launching.

## Account or service setup
- No extra third-party account is normally required unless the app already uses a provider for this feature.

## App code work
- Define each outside-app action.
- Add a fallback when the target app is missing.
- Avoid hidden launches without a user action.

## Backend work
- Connect backend storage, permissions, or triggers only when the product flow requires it.

## Play Store and policy notes
- Keep external-app behavior clear in support or policy copy when it affects user data.

## Ready only when this is verified
- Target app opens.
- Missing target app has a fallback.
- Each action starts from a visible user choice.

## Feature status meanings
- Planned means LaunchLift has the setup path, but the feature is not live yet.
- Implemented means the app/service/backend pieces are present and ready for testing.
- Needs fix means one or more required pieces are missing or unclear.
- Verified means code evidence, build evidence, policy notes, and Android device testing are all present.

## What LaunchLift should not pretend to do automatically
- Know the exact product behavior without the user's answers.
- Mark the feature live before a real Android device test.

Project: LaunchLift Practice App
Generated: 2026-08-14T02:24:14.810Z
