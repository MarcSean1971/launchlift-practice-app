# Copy to clipboard

## Evidence for this selected feature

- Current code-inspection status: missing (0% confidence).
- Still missing:
  - Clipboard plugin
  - copy action
  - copied confirmation
  - sensitive-data review

## What the user gets
Users can copy codes, links, addresses, or support details with clear feedback.

## What LaunchLift can prepare
- Add Capacitor dependency where safe.
- Add starter helper/module and comments for the selected app flow.
- Add acceptance checklist for human/device testing.

## Capacitor / Android wrapper work
- Install @capacitor/clipboard.
- Wrap copy actions in a small helper with success and failure states.

## Account or service setup
- No extra third-party account is normally required unless the app already uses a provider for this feature.

## App code work
- Define exactly what can be copied.
- Show copied feedback.
- Avoid copying secrets or private data without warning.

## Backend work
- Connect backend storage, permissions, or triggers only when the product flow requires it.

## Play Store and policy notes
- Review sensitive fields so clipboard use does not leak private information by surprise.

## Ready only when this is verified
- Copy succeeds.
- Failure is handled.
- Sensitive values are protected or clearly intentional.

## Feature status meanings
- Planned means LaunchLift has the setup path, but the feature is not live yet.
- Implemented means the app/service/backend pieces are present and ready for testing.
- Needs fix means one or more required pieces are missing or unclear.
- Verified means code evidence, build evidence, policy notes, and Android device testing are all present.

## What LaunchLift should not pretend to do automatically
- Know the exact product behavior without the user's answers.
- Mark the feature live before a real Android device test.

Project: LaunchLift Practice App
Generated: 2026-08-02T06:41:55.474Z
