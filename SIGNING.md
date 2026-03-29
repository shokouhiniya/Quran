# راهنمای Sign کردن APK

## روش ساده: از طریق Android Studio

1. باز کردن منوی Build
   - Build > Generate Signed Bundle / APK

2. انتخاب نوع فایل
   - APK را انتخاب کنید
   - Next

3. ساخت Keystore (اولین بار)
   - Create new کلیک کنید
   - مسیر و نام فایل: `quran-app.jks`
   - Password: یک رمز قوی وارد کنید (حتما یادداشت کنید!)
   - Alias: `quran-key`
   - Validity: 25 سال
   - اطلاعات شخصی را پر کنید
   - OK

4. Build Type
   - release را انتخاب کنید
   - Finish

5. فایل APK آماده است
   - مسیر: `app/release/app-release.apk`

## نکات مهم

⚠️ فایل keystore و رمز آن را حفظ کنید!
- بدون keystore نمی‌توانید اپ را آپدیت کنید
- keystore را در جای امن نگه دارید
- رمز را فراموش نکنید

## تست APK

```bash
# نصب روی دستگاه متصل
adb install app/release/app-release.apk

# یا drag & drop کنید روی emulator
```

## آماده برای کافه بازار

فایل `app-release.apk` آماده آپلود به کافه بازار است.
