# Native toast messages

## Evidence for this selected feature

- No repository code signal was attached for this feature. Treat this as planned until a new scan finds code, setup, backend, policy, and device-test evidence.

## What the user gets
Short confirmations feel native on Android without replacing important error handling.

## What LaunchLift can prepare
- Add Capacitor dependency where safe.
- Add starter helper/module and comments for the selected app flow.
- Add acceptance checklist for human/device testing.

## Capacitor / Android wrapper work
- Install @capacitor/toast.
- Use toast only for short, low-risk confirmations.

## Account or service setup
- No extra third-party account is normally required unless the app already uses a provider for this feature.

## App code work
- Choose exact messages.
- Keep errors and decisions in visible UI, not only toast.
- Avoid stacking repeated messages.

## Backend work
- Connect backend storage, permissions, or triggers only when the product flow requires it.

## Play Store and policy notes
- No special Play policy work is normally needed for simple confirmations.

## Ready only when this is verified
- Toast appears.
- Message is short.
- Important errors remain visible and actionable.

## Feature status meanings
- Planned means LaunchLift has the setup path, but the feature is not live yet.
- Implemented means the app/service/backend pieces are present and ready for testing.
- Needs fix means one or more required pieces are missing or unclear.
- Verified means code evidence, build evidence, policy notes, and Android device testing are all present.

## What LaunchLift should not pretend to do automatically
- Know the exact product behavior without the user's answers.
- Mark the feature live before a real Android device test.

Project: LaunchLift Practice App
Generated: 2026-08-14T03:16:59.193Z
