const SETTINGS_KEY = "clinic_settings";

function getSettings() {
  const s = localStorage.getItem(SETTINGS_KEY);
  if (s) return JSON.parse(s);

  const init = {
    lang: "ar",   // ar | en
    currency: "JOD"
  };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(init));
  return init;
}

function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

/* ========= الترجمة ========= */
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
    amount: "المبلغ",
    patient: "المريض",
    date: "التاريخ",
    note: "ملاحظة"
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
    amount: "Amount",
    patient: "Patient",
    date: "Date",
    note: "Note"
  }
};

function t(key) {
  const { lang } = getSettings();
  return translations[lang][key] || key;
}

/* ========= العملة ========= */
function formatCurrency(value) {
  const { lang } = getSettings();
  return new Intl.NumberFormat(
    lang === "ar" ? "ar-JO" : "en-JO",
    { style: "currency", currency: "JOD" }
  ).format(Number(value));
}

/* ========= اتجاه الصفحة ========= */
function applyDirection() {
  const { lang } = getSettings();
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
}

document.addEventListener("DOMContentLoaded", applyDirection);
