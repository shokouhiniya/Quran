# راهنمای انتشار در کافه بازار

## مراحل آماده‌سازی APK

### 1. ساخت Keystore (فقط بار اول)
```bash
keytool -genkey -v -keystore quran-app.jks -keyalg RSA -keysize 2048 -validity 10000 -alias quran-key
```

### 2. ساخت APK از Android Studio
1. Build > Generate Signed Bundle / APK
2. انتخاب APK
3. انتخاب یا ساخت keystore
4. وارد کردن اطلاعات keystore
5. انتخاب release build variant
6. Finish

### 3. تست APK
```bash
adb install app/release/app-release.apk
```

## الزامات کافه بازار

✓ حداقل SDK: 24 (Android 7.0)
✓ Target SDK: 34
✓ APK باید sign شده باشد
✓ حجم مناسب (کمتر از 100MB)
✓ بدون دسترسی‌های غیرضروری
✓ آیکون مناسب
✓ نام فارسی: قرآن کریم

## اطلاعات مورد نیاز برای ثبت

- نام اپلیکیشن: قرآن کریم
- دسته‌بندی: کتاب و مرجع
- توضیحات: اپلیکیشن آفلاین قرآن کریم با امکان نشان‌گذاری سوره‌ها و مشاهده جزها
- اسکرین‌شات‌ها: حداقل 2 عدد
- آیکون: 512x512 پیکسل

## نکات مهم

- keystore را حفظ کنید (برای آپدیت‌های بعدی لازم است)
- ورژن کد را در هر آپدیت افزایش دهید
- تست کامل قبل از انتشار
