#!/bin/bash

echo "ساخت APK برای کافه بازار..."

# Clean و build
./gradlew clean
./gradlew assembleRelease

echo ""
echo "✓ APK آماده شد!"
echo "مسیر فایل: app/build/outputs/apk/release/app-release-unsigned.apk"
echo ""
echo "برای sign کردن APK:"
echo "1. یک keystore بساز: keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias"
echo "2. APK رو sign کن: jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore my-release-key.jks app-release-unsigned.apk my-key-alias"
echo "3. APK رو optimize کن: zipalign -v 4 app-release-unsigned.apk app-release.apk"
