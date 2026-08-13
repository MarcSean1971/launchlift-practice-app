# Device sensors

## Evidence for this selected feature

- No repository code signal was attached for this feature. Treat this as planned until a new scan finds code, setup, backend, policy, and device-test evidence.

## What the user gets
The app uses motion, orientation, health, or environmental sensor signals responsibly.

## What LaunchLift can prepare
- Add Capacitor dependency where safe.
- Add starter helper/module and comments for the selected app flow.
- Add acceptance checklist for human/device testing.

## Capacitor / Android wrapper work
- Choose browser sensor APIs, a Capacitor plugin, or a native bridge depending on the sensor.
- Add sensor-specific permission only when required.

## Account or service setup
- No extra third-party account is normally required unless the app already uses a provider for this feature.

## App code work
- Define the exact sensor.
- Choose battery-safe sampling.
- Handle missing or unavailable sensors.

## Backend work
- Connect backend storage, permissions, or triggers only when the product flow requires it.

## Play Store and policy notes
- Disclose health/sensor data if collected or stored.

## Ready only when this is verified
- Sensor works on real Android hardware.
- Battery and missing-sensor states are acceptable.
- User can understand or disable the feature.

## Feature status meanings
- Planned means LaunchLift has the setup path, but the feature is not live yet.
- Implemented means the app/service/backend pieces are present and ready for testing.
- Needs fix means one or more required pieces are missing or unclear.
- Verified means code evidence, build evidence, policy notes, and Android device testing are all present.

## What LaunchLift should not pretend to do automatically
- Know the exact product behavior without the user's answers.
- Mark the feature live before a real Android device test.

Project: LaunchLift Practice App
Generated: 2026-08-13T03:33:30.559Z
