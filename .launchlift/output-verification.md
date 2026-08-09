# Practice conversion output verification

This source fixture deliberately keeps the conversion choices in LaunchLiftAI.
It does not pretend that selecting an output here has already created it.

## Outputs the fixture supports

| Output | Source evidence | Build verification |
| --- | --- | --- |
| Web/PWA | `public/manifest.webmanifest`, `public/sw.js`, and branded 192/512px icons | `npm run build` produces `dist/`; the test suite server-renders the bundle. |
| Android debug APK | Capacitor Android project plus all 24 installed Android bridge plugins | CI builds `app-debug.apk`; local build requires an installed Android SDK. |
| Android release AAB | Same generated Android project and versioned Gradle release target | CI runs `bundleRelease` and retains an **unsigned** `app-release.aab` for compile verification only. A protected runner can opt into the complete `LAUNCHLIFT_UPLOAD_*` configuration and run `bundleRelease verifyReleaseSigning` for a signed upload-key AAB. Play App Signing remains owner-controlled. |
| Source | Git repository and immutable `launchlift-practice.json` contract | `npm test` validates the 28-capability catalogue and 28 native-harness actions. |

## Intentionally not manufactured by this fixture

- A Chrome extension: extensions are a LaunchLiftAI-selected conversion output, not part of this unchanged source fixture. Creating one here would be a misleading duplicate output.
- Store uploads, Firebase/FCM configuration, credentials, payments, signing, or rollout: these require owner-controlled accounts and service configuration.

## Verification boundaries

All 28 native actions are present in the installed Android harness and have source-level contract coverage. A passing contract or build proves wiring, not every real-world device permission, provider configuration, background-execution condition, accessibility configuration, or store-policy outcome. Those need evidence from a real device and the appropriate owner-controlled provider account.
