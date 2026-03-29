# اپلیکیشن قرآن کریم

یک اپلیکیشن اندروید آفلاین برای مطالعه قرآن با سه تب.

## ویژگی‌ها

- **کاملا آفلاین**: تمام داده‌ها داخل اپ هستند
- **تب نشان شده**: سوره‌هایی که نشان کرده‌اید
- **تب سوره‌ها**: لیست کامل 114 سوره با ترجمه فارسی
- **تب جزها**: لیست 30 جز قرآن
- **نشان‌گذاری**: امکان bookmark کردن سوره‌ها

## نحوه اجرا

1. پروژه را در Android Studio باز کنید
2. Gradle sync را انجام دهید
3. روی دستگاه یا emulator اجرا کنید

## ساخت APK برای کافه بازار

### روش 1: از طریق Android Studio (توصیه می‌شود)
1. Build > Generate Signed Bundle / APK
2. انتخاب APK
3. ساخت یا انتخاب keystore
4. انتخاب release build
5. فایل APK در `app/release/` ساخته می‌شود

### روش 2: از طریق خط فرمان
```bash
# در Windows
build-apk.bat

# در Linux/Mac
./build-apk.sh
```

## الزامات کافه بازار

- حداقل SDK: 24 (Android 7.0)
- Target SDK: 34
- فایل APK باید sign شده باشد
- حجم APK: کمتر از 100 مگابایت
- دسترسی‌ها: هیچ دسترسی خاصی نیاز نیست (آفلاین)

## منبع داده

داده‌های قرآن از [quran-json](https://github.com/risan/quran-json) با لایسنس CC-BY-SA 4.0

## تکنولوژی‌ها

- Kotlin
- ViewBinding
- ViewModel & LiveData
- Gson (برای خواندن JSON)
- Material Design
- ViewPager2
- Coroutines
