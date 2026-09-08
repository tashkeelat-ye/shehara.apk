# تطبيق شهارة لأندرويد — نسخة مستقلة (Capacitor)

هذا مشروع **مستقل تمامًا** عن مستودع شهارة الأصلي على GitHub، ولا يعدّل أو يرفع أي شيء إليه.
الهدف: تحويل موقع https://shehara-ye.vercel.app إلى تطبيق أندرويد حقيقي (APK قابل للتثبيت).

## لماذا هذا الأسلوب بالذات؟

فحصتُ مشروع شهارة المرفوع ووجدت أنه مبني بإطار **TanStack Start** مع تصيير من جهة الخادم
(SSR) ودوال خادم (Server Functions) وواجهة API خاصة (`src/routes/api/chat.ts`) وحماية CSRF.
هذا يعني أن الموقع **ليس** ملفات ثابتة يمكن "تجميدها" داخل التطبيق — فهو يحتاج خادمًا حيًا يعمل
باستمرار (وهو فعليًا يعمل الآن على Vercel).

لذلك، الأسلوب الصحيح والاحترافي هنا هو **Capacitor بوضع Remote URL**: تطبيق أندرويد أصلي حقيقي
(حزمة APK فعلية، أيقونة، شاشة بدء، اتجاه Portrait مثبّت، اسم "شهارة"، Package ID `ye.shehara.app`)
يفتح داخله WebView أصلي يحمّل موقعكم الحي مباشرة. هذا يحافظ 100% على كل الوظائف: تسجيل الدخول،
Supabase، المنتجات، السلة، الطلبات — لأنها ببساطة نفس الموقع الذي يعمل الآن.

## ⚠️ لماذا لم يُبنَ APK فعلي داخل المحادثة نفسها؟

بيئة التنفيذ المتاحة لي هنا (الـ sandbox) **لا تملك اتصالاً بالإنترنت** (npm registry, Google Maven,
Gradle، Android SDK كلها محجوبة)، ولا يوجد Android SDK أو Gradle مثبّتين مسبقًا فيها. بناء APK
حقيقي يتطلب تنزيل: حزم Capacitor، Gradle، Android Gradle Plugin، ومنصّات/أدوات Android SDK —
وكل هذا مستحيل تقنيًا في هذه البيئة بدون شبكة. لذلك **لن أدّعي أن APK جاهز وهو غير موجود فعليًا.**

بدلاً من ذلك جهزت لك مشروعًا كاملاً جاهزًا للبناء الفعلي، بطريقتين — اختر الأسهل لك:

## الطريقة 1 (الأسرع): GitHub Actions — بدون تثبيت أي شيء على جهازك

1. أنشئ مستودع GitHub **جديد وخاص بك** (مثلاً `shehara-android`) — لا تستخدم المستودع الأصلي.
2. ارفع محتويات هذا المجلد إليه (`git init && git add . && git commit -m "init" && git push`).
3. اذهب إلى تبويب **Actions** في مستودعك الجديد، شغّل workflow باسم
   **"Build شهارة Android APK"** يدويًا (Run workflow)، أو ادفع أي commit لفرع `main` وسيعمل تلقائيًا.
4. بعد انتهاء التشغيل (٥-٨ دقائق تقريبًا)، ستجد ملف APK جاهزًا للتنزيل من قسم **Artifacts**
   باسم `shehara-app-debug-apk`.
5. أرسل لي رابط تشغيل الـ Action (أو ارفع الـ APK الناتج هنا) وسأتحقق من الحجم وقيمة SHA-256
   وأؤكد لك اكتمال المهمة رسميًا.

## الطريقة 2: بناء محلي على جهازك (Android Studio)

يتطلب: Node.js 20+، JDK 21، Android Studio (يثبّت Android SDK تلقائيًا).

```bash
npm install
npx cap add android
# اضبط الاتجاه Portrait في:
# android/app/src/main/AndroidManifest.xml → أضف android:screenOrientation="portrait" لعنصر <activity>
npx capacitor-assets generate --android
npx cap sync android
cd android
./gradlew assembleDebug
```

سيكون الملف الناتج في:
`android/app/build/outputs/apk/debug/app-debug.apk`

لحساب SHA-256 والحجم:
```bash
sha256sum android/app/build/outputs/apk/debug/app-debug.apk
ls -lh android/app/build/outputs/apk/debug/app-debug.apk
```

### لإصدار Release APK موقّع (بدل Debug)
احتاج مفتاح توقيع (keystore) خاص بك:
```bash
keytool -genkey -v -keystore shehara-release.keystore -alias shehara -keyalg RSA -keysize 2048 -validity 10000
```
ثم أضف بيانات التوقيع في `android/app/build.gradle` وشغّل `./gradlew assembleRelease`.

## ملخص الإعدادات المستخدمة
- اسم التطبيق: **شهارة**
- Package ID: **ye.shehara.app**
- الاتجاه: **Portrait فقط**
- المصدر: `https://shehara-ye.vercel.app` (عبر `server.url` في `capacitor.config.ts`)
- الأيقونة وشاشة البدء: مأخوذتان من `public/icon-512.png` الأصلية، بلون خلفية `#05465F` (لون هوية شهارة)
