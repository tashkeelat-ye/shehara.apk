import type { CapacitorConfig } from "@capacitor/cli";

// إعداد Capacitor لتطبيق "شهارة" على أندرويد.
// النمط المستخدم: server.url (Remote URL Wrapper) — التطبيق يفتح الموقع الحي
// https://shehara-ye.vercel.app داخل WebView أصلي كامل الميزات، بدل تجميد نسخة
// ثابتة من الموقع محليًا. هذا ضروري لأن المشروع مبني بـ TanStack Start (SSR) مع
// دوال خادم (Server Functions) وواجهة API (src/routes/api/chat.ts) ومصادقة CSRF،
// وهذه لا تعمل إن تم تجميدها كملفات ثابتة داخل التطبيق. بهذه الطريقة تبقى كل
// الوظائف كما هي 100%: تسجيل الدخول، Supabase، المنتجات، السلة، الطلبات.
const config: CapacitorConfig = {
  appId: "ye.shehara.app",
  appName: "شهارة",
  webDir: "www",
  server: {
    url: "https://shehara-ye.vercel.app",
    cleartext: false,
    androidScheme: "https",
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      backgroundColor: "#05465F",
      androidSplashResourceName: "splash",
      showSpinner: false,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#05465F",
    },
  },
};

export default config;
