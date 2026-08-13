# Network awareness

## Evidence for this selected feature

- Current code-inspection status: found (100% confidence).
- Evidence found:
  - @capacitor/network dependency present
  - Network/retry naming appears in repo tree
  - Service worker/offline file detected

## What the user gets
Users see helpful offline/retry states instead of broken screens.

## What LaunchLift can prepare
- Add Capacitor dependency where safe.
- Add starter helper/module and comments for the selected app flow.
- Add acceptance checklist for human/device testing.

## Capacitor / Android wrapper work
- Install @capacitor/network.
- Listen for connection changes.

## Account or service setup
- No extra third-party account is normally required unless the app already uses a provider for this feature.

## App code work
- Show offline messages.
- Pause or retry affected actions.
- Preserve unsaved user work.

## Backend work
- Connect backend storage, permissions, or triggers only when the product flow requires it.

## Play Store and policy notes
- No special Play policy work unless network status is combined with sensitive data.

## Ready only when this is verified
- Offline state appears.
- Reconnect retry works.
- No user work is lost.

## Feature status meanings
- Planned means LaunchLift has the setup path, but the feature is not live yet.
- Implemented means the app/service/backend pieces are present and ready for testing.
- Needs fix means one or more required pieces are missing or unclear.
- Verified means code evidence, build evidence, policy notes, and Android device testing are all present.

## What LaunchLift should not pretend to do automatically
- Know the exact product behavior without the user's answers.
- Mark the feature live before a real Android device test.

Project: LaunchLift Practice App
Generated: 2026-08-13T05:26:29.704Z
