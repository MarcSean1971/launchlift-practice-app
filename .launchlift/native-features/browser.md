# In-app browser

## Evidence for this selected feature

- Current code-inspection status: partial (50% confidence).
- Evidence found:
  - Browser dependency present
- Still missing:
  - Browser plugin
  - trusted-domain rules
  - return-to-app behavior

## What the user gets
Trusted help, policy, checkout, or external pages open without losing the Android app context.

## What LaunchLift can prepare
- Add Capacitor dependency where safe.
- Add starter helper/module and comments for the selected app flow.
- Add acceptance checklist for human/device testing.

## Capacitor / Android wrapper work
- Install @capacitor/browser or use @capacitor/inappbrowser when the app needs embedded browser controls.
- Define trusted domains and return behavior.

## Account or service setup
- No extra third-party account is normally required unless the app already uses a provider for this feature.

## App code work
- Choose which links open in-app.
- Keep untrusted links in the system browser.
- Show a clear close/back path.

## Backend work
- Connect backend storage, permissions, or triggers only when the product flow requires it.

## Play Store and policy notes
- Do not hide third-party checkout, policy, or account ownership from the user.

## Ready only when this is verified
- Trusted links open.
- Users can return to the app.
- Untrusted links do not get privileged treatment.

## Feature status meanings
- Planned means LaunchLift has the setup path, but the feature is not live yet.
- Implemented means the app/service/backend pieces are present and ready for testing.
- Needs fix means one or more required pieces are missing or unclear.
- Verified means code evidence, build evidence, policy notes, and Android device testing are all present.

## What LaunchLift should not pretend to do automatically
- Know the exact product behavior without the user's answers.
- Mark the feature live before a real Android device test.

Project: LaunchLift Practice App
Generated: 2026-08-14T01:26:24.359Z
