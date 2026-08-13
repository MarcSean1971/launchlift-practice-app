# Microphone and voice

## Evidence for this selected feature

- Current code-inspection status: partial (50% confidence).
- Evidence found:
  - Voice/audio naming appears in repo tree
- Still missing:
  - Microphone capture flow
  - start/stop/delete controls
  - audio storage/transmission handling
  - privacy wording

## What the user gets
Users can record, dictate, translate, or call with clear consent and controls.

## What LaunchLift can prepare
- Add Capacitor dependency where safe.
- Add starter helper/module and comments for the selected app flow.
- Add acceptance checklist for human/device testing.

## Capacitor / Android wrapper work
- Add microphone permission and recording/WebRTC/provider setup.
- Add Android permission wording.

## Account or service setup
- No extra third-party account is normally required unless the app already uses a provider for this feature.

## App code work
- Start audio only after clear user action.
- Show stop/delete controls.
- Connect transcription/storage/call provider if used.

## Backend work
- Connect backend storage, permissions, or triggers only when the product flow requires it.

## Play Store and policy notes
- Disclose audio capture, storage, processing, and deletion.

## Ready only when this is verified
- Permission prompt works.
- Recording/call works.
- User can stop and delete audio.

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
