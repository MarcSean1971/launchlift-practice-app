# Push notifications

## Evidence for this selected feature

- Current code-inspection status: found (100% confidence).
- Evidence found:
  - @capacitor/push-notifications dependency present
  - Push/token naming appears in repo tree

## What the user gets
Users receive useful Android notifications and land on the right screen when they tap them.

## What LaunchLift can prepare
- Add Capacitor push dependency and starter registration module.
- Add tap-routing placeholders and documented TODOs.
- Add Firebase config location notes and backend token-storage interface.

## Capacitor / Android wrapper work
- Install @capacitor/push-notifications.
- Add Android notification permission handling.
- Add notification tap routing so a tap opens the intended app screen.

## Account or service setup
- Create or connect a Firebase project.
- Enable Firebase Cloud Messaging.
- Download the Android google-services.json file and add it to the Android app project.

## App code work
- Ask for notification permission at the right moment.
- Register the device for push notifications.
- Send the push token to the backend after login or account creation.
- Handle token refresh and notification taps.
- Add user controls to mute or disable notification categories.

## Backend work
- Store push tokens per user and device.
- Send notifications only when the real product event happens.
- Remove invalid tokens and respect unsubscribe/preference choices.

## Play Store and policy notes
- Explain notification usage in the Play Store listing or data safety notes where relevant.
- Do not imply marketing/spam notifications unless the app has clear user consent.

## Ready only when this is verified
- Firebase config exists.
- Push plugin exists.
- Device token registration exists.
- Backend token storage exists.
- At least one real send trigger exists.
- Android phone receives and opens a test notification.

## Feature status meanings
- Planned means LaunchLift has the setup path, but the feature is not live yet.
- Implemented means the app/service/backend pieces are present and ready for testing.
- Needs fix means one or more required pieces are missing or unclear.
- Verified means code evidence, build evidence, policy notes, and Android device testing are all present.

## What LaunchLift should not pretend to do automatically
- Create the user's Firebase account or project without permission.
- Know the real business events without the user's answers.
- Mark push live before a real Android device receives a notification.

Project: LaunchLift Practice App
Generated: 2026-08-13T05:10:33.253Z
