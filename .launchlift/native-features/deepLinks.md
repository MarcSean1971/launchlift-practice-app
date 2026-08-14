# App links and deep links

## Evidence for this selected feature

- Current code-inspection status: found (100% confidence).
- Evidence found:
  - @capacitor/app dependency present
  - App-link config candidate detected
  - Deep-link route naming appears in repo tree

## What the user gets
Android opens supported web links directly inside the app.

## What LaunchLift can prepare
- Add Capacitor dependency where safe.
- Add starter helper/module and comments for the selected app flow.
- Add acceptance checklist for human/device testing.

## Capacitor / Android wrapper work
- Install/use @capacitor/app listener.
- Add Android intent filters.
- Add route mapping.

## Account or service setup
- No extra third-party account is normally required unless the app already uses a provider for this feature.

## App code work
- Map each URL to the right screen.
- Handle unknown or expired links.
- Keep web fallback working.

## Backend work
- Connect backend storage, permissions, or triggers only when the product flow requires it.

## Play Store and policy notes
- Publish Android assetlinks.json from the verified domain.

## Ready only when this is verified
- Domain verification passes.
- Invite/reset/product links open the correct screen.
- Web fallback still works.

## Feature status meanings
- Planned means LaunchLift has the setup path, but the feature is not live yet.
- Implemented means the app/service/backend pieces are present and ready for testing.
- Needs fix means one or more required pieces are missing or unclear.
- Verified means code evidence, build evidence, policy notes, and Android device testing are all present.

## What LaunchLift should not pretend to do automatically
- Know the exact product behavior without the user's answers.
- Mark the feature live before a real Android device test.

Project: LaunchLift Practice App
Generated: 2026-08-14T02:24:14.809Z
