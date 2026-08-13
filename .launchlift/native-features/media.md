# Photo and media picker

## Evidence for this selected feature

- Current code-inspection status: found (100% confidence).
- Evidence found:
  - @capacitor/camera dependency can support media picker
  - Media/upload naming appears in repo tree

## What the user gets
Users can pick phone media for profiles, listings, receipts, posts, or support uploads.

## What LaunchLift can prepare
- Add Capacitor dependency where safe.
- Add starter helper/module and comments for the selected app flow.
- Add acceptance checklist for human/device testing.

## Capacitor / Android wrapper work
- Install @capacitor/camera for gallery/photo picker support.
- Use Android 13+ media permissions only when needed.

## Account or service setup
- No extra third-party account is normally required unless the app already uses a provider for this feature.

## App code work
- Validate file type and size.
- Upload to the right storage path.
- Show progress, failure, preview, and delete states.

## Backend work
- Connect backend storage, permissions, or triggers only when the product flow requires it.

## Play Store and policy notes
- Match data safety answers to uploaded media storage and retention.

## Ready only when this is verified
- Picker opens.
- Invalid files are rejected.
- Media can be deleted by the user.

## Feature status meanings
- Planned means LaunchLift has the setup path, but the feature is not live yet.
- Implemented means the app/service/backend pieces are present and ready for testing.
- Needs fix means one or more required pieces are missing or unclear.
- Verified means code evidence, build evidence, policy notes, and Android device testing are all present.

## What LaunchLift should not pretend to do automatically
- Know the exact product behavior without the user's answers.
- Mark the feature live before a real Android device test.

Project: LaunchLift Practice App
Generated: 2026-08-13T14:08:47.048Z
