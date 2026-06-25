# Flutter Setup — Futsudoro

## Installed locally

- Flutter: 3.41.9 stable
- Dart: 3.11.5
- Flutter SDK path: `/opt/homebrew/share/flutter`
- Xcode: 26.4.1 at `/Applications/Xcode.app/Contents/Developer`
- CocoaPods: 1.16.2
- Android Studio: installed at `/Applications/Android Studio.app`
- Android SDK: `/Users/andres/Library/Android/sdk`
- Android command-line tools: installed via Homebrew and symlinked into the Android SDK
- Android licenses: accepted
- Analytics: disabled with `flutter --disable-analytics`

## Flutter project

Created at:

```text
projects/Futsudoro/flutter/
```

Created with:

```bash
flutter create --org app.futsudoro --project-name futsudoro --platforms=android,ios,macos,web,windows flutter
```

## Verified on 2026-05-11

From `projects/Futsudoro/flutter/`:

```bash
flutter doctor -v
flutter analyze
flutter test
flutter build web --release
flutter build macos --debug
flutter build apk --debug
```

Result:

- `flutter doctor -v`: no issues found
- Analyze: no issues found
- Tests: all passed
- Web release build: `flutter/build/web/`
- macOS debug app: `flutter/build/macos/Build/Products/Debug/futsudoro.app`
- Android debug APK: `flutter/build/app/outputs/flutter-apk/app-debug.apk`

## Notes

- Homebrew `openjdk` was installed as a fallback after the Temurin cask requested interactive sudo. Flutter is currently using the JDK bundled with Android Studio, which is fine.
- The first Android debug build installed missing SDK components automatically: NDK 28.2, Build Tools 35, Platform 36, CMake 3.22.1.
- The Flutter app is now a native MVP, not the default counter scaffold: train line selector, timer, route progress, station status, stats, trip configuration, and Kairos mode toggle.
