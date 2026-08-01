# Camera

## Evidence for this selected feature

- Current code-inspection status: missing (0% confidence).
- Still missing:
  - Camera plugin
  - capture UI
  - permission denied fallback
  - upload/storage path

## What the user gets
Users can take a photo in the Android app where the product genuinely needs it.

## What LaunchLift can prepare
- Add Capacitor dependency where safe.
- Add starter helper/module and comments for the selected app flow.
- Add acceptance checklist for human/device testing.

## Capacitor / Android wrapper work
- Install @capacitor/camera.
- Add camera permission wording.
- Add a capture helper that returns a file or data URL.

## Account or service setup
- No extra third-party account is normally required unless the app already uses a provider for this feature.

## App code work
- Place the camera action on the correct screen.
- Handle denied permission.
- Upload or save the captured image safely.
- Show remove/delete controls.

## Backend work
- Connect backend storage, permissions, or triggers only when the product flow requires it.

## Play Store and policy notes
- Explain camera usage in permission copy and Play Store declarations.

## Ready only when this is verified
- Camera opens on Android.
- Denied permission has a clear fallback.
- Captured images save and can be removed.

## Feature status meanings
- Planned means LaunchLift has the setup path, but the feature is not live yet.
- Implemented means the app/service/backend pieces are present and ready for testing.
- Needs fix means one or more required pieces are missing or unclear.
- Verified means code evidence, build evidence, policy notes, and Android device testing are all present.

## What LaunchLift should not pretend to do automatically
- Know the exact product behavior without the user's answers.
- Mark the feature live before a real Android device test.

Project: LaunchLift Practice App
Generated: 2026-08-01T21:02:59.710Z
