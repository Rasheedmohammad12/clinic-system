/* ===============================
   SETTINGS SYSTEM (PER USER - FIXED)
================================ */

import { getCurrentUser } from "./auth.js";

/* ====== SAFE USER ====== */
function safeUser() {
  return getCurrentUser() || { id: "guest" };
}

const user = safeUser();

/* ====== STORAGE KEYS ====== */
const SETTINGS_KEY = `clinic_settings_${user.id}`;
const PAYMENTS_PIN_KEY = `payments_pin_${user.id}`;

/* ====== SETTINGS ====== */
export function getSettings() {
  const s = localStorage.getItem(SETTINGS_KEY);
  if (s) return JSON.parse(s);

  const init = {
    lang: "ar",
    theme: "light",
    currency: "JOD"
  };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(init));
  return init;
}

export function saveSettings(s) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

/* ====== PAYMENTS PIN ====== */
export function setPaymentsPIN(pin) {
  localStorage.setItem(PAYMENTS_PIN_KEY, pin);
}

export function getPaymentsPIN() {
  return localStorage.getItem(PAYMENTS_PIN_KEY);
}

export function verifyPaymentsPIN(pin) {
  return pin === getPaymentsPIN();
}

/* ====== LANGUAGE ====== */
const translations = {
  ar: {
    dashboard: "لوحة التحكم",
    patients: "المرضى",
    sessions: "الجلسات",
    payments: "المدفوعات",
    receive: "استلام المبالغ",
    settings: "الإعدادات",
    users: "المستخدمين",
    logout: "تسجيل خروج",
    totalPayments: "إجمالي المدفوعات",
    enterPin: "أدخل الرمز السري للمدفوعات",
    wrongPin: "الرمز غير صحيح"
  },
  en: {
    dashboard: "Dashboard",
    patients: "Patients",
    sessions: "Sessions",
    payments: "Payments",
    receive: "Receive Payment",
    settings: "Settings",
    users: "Users",
    logout: "Logout",
    totalPayments: "Total Payments",
    enterPin: "Enter payments PIN",
    wrongPin: "Wrong PIN"
  }
};

export function t(key) {
  const { lang } = getSettings();
  return translations[lang]?.[key] || key;
}

/* ====== CURRENCY ====== */
export function formatCurrency(v) {
  const { lang, currency } = getSettings();
  return new Intl.NumberFormat(
    lang === "ar" ? "ar-JO" : "en-US",
    { style: "currency", currency }
  ).format(Number(v) || 0);
}

/* ====== THEME + DIRECTION ====== */
export function applySystem() {
  const s = getSettings();
  document.documentElement.lang = s.lang;
  document.documentElement.dir = s.lang === "ar" ? "rtl" : "ltr";
  document.body.className = s.theme;
}

document.addEventListener("DOMContentLoaded", applySystem);

/* ====== PAYMENTS GATE ====== */
export function protectPaymentsPage() {
  const pin = getPaymentsPIN();
  if (!pin) {
    alert("لم يتم تعيين رمز سري للمدفوعات");
    window.location.href = "settings.html";
    return;
  }

  const entered = prompt(t("enterPin"));
  if (entered !== pin) {
    alert(t("wrongPin"));
    window.location.href = "dashboard.html";
  }
}
