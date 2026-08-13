# Location

## Evidence for this selected feature

- Current code-inspection status: found (100% confidence).
- Evidence found:
  - @capacitor/geolocation dependency present
  - Location/map naming appears in repo tree

## What the user gets
Users can use nearby, map, route, safety, or local discovery features on Android.

## What LaunchLift can prepare
- Add Capacitor dependency where safe.
- Add starter helper/module and comments for the selected app flow.
- Add acceptance checklist for human/device testing.

## Capacitor / Android wrapper work
- Install @capacitor/geolocation.
- Choose approximate or precise location.
- Add Android location permission wording.

## Account or service setup
- No extra third-party account is normally required unless the app already uses a provider for this feature.

## App code work
- Ask only when the user can see the benefit.
- Handle denied permission.
- Avoid background location unless absolutely necessary.

## Backend work
- Connect backend storage, permissions, or triggers only when the product flow requires it.

## Play Store and policy notes
- Complete Play Store location declarations and privacy wording.

## Ready only when this is verified
- Android permission prompt appears at the right time.
- Denied permission has fallback UI.
- Location feature works on a real device.

## Feature status meanings
- Planned means LaunchLift has the setup path, but the feature is not live yet.
- Implemented means the app/service/backend pieces are present and ready for testing.
- Needs fix means one or more required pieces are missing or unclear.
- Verified means code evidence, build evidence, policy notes, and Android device testing are all present.

## What LaunchLift should not pretend to do automatically
- Know the exact product behavior without the user's answers.
- Mark the feature live before a real Android device test.

Project: LaunchLift Practice App
Generated: 2026-08-13T05:26:29.702Z
