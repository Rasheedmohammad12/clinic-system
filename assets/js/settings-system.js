const SETTINGS_KEY = "clinic_settings";

function getSettings(){
  const s = localStorage.getItem(SETTINGS_KEY);
  if(s) return JSON.parse(s);

  const init = {
    lang: "ar",
    theme: "light",      // light | dark
    currency: "JOD"      // JOD | USD | ILS
  };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(init));
  return init;
}

function saveSettings(s){
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

/* ===== اللغة ===== */
const translations = {
  ar:{
    dashboard:"لوحة التحكم",
    patients:"المرضى",
    sessions:"الجلسات",
    payments:"المدفوعات",
    receive:"استلام المبالغ",
    settings:"الإعدادات",
    users:"المستخدمين",
    logout:"تسجيل خروج",
    totalPayments:"إجمالي المدفوعات"
  },
  en:{
    dashboard:"Dashboard",
    patients:"Patients",
    sessions:"Sessions",
    payments:"Payments",
    receive:"Receive Payment",
    settings:"Settings",
    users:"Users",
    logout:"Logout",
    totalPayments:"Total Payments"
  }
};

function t(key){
  const {lang}=getSettings();
  return translations[lang][key]||key;
}

/* ===== العملة ===== */
function formatCurrency(v){
  const {lang,currency}=getSettings();
  return new Intl.NumberFormat(
    lang==="ar"?"ar-JO":"en-US",
    {style:"currency",currency}
  ).format(Number(v));
}

/* ===== الاتجاه + الثيم ===== */
function applySystem(){
  const s=getSettings();
  document.documentElement.lang=s.lang;
  document.documentElement.dir=s.lang==="ar"?"rtl":"ltr";
  document.body.className=s.theme;
}
document.addEventListener("DOMContentLoaded",applySystem);
