@echo off
echo ساخت APK برای کافه بازار...

gradlew.bat clean
gradlew.bat assembleRelease

echo.
echo APK آماده شد!
echo مسیر فایل: app\build\outputs\apk\release\app-release-unsigned.apk
echo.
echo برای sign کردن APK:
echo 1. یک keystore بساز
echo 2. از Android Studio استفاده کن: Build ^> Generate Signed Bundle / APK
