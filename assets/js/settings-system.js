/* ===============================
   SETTINGS SYSTEM (PER USER – FINAL)
================================ */

/* ====== STORAGE KEY HELPERS ====== */
function settingsKey(userId) {
  return `clinic_settings_${userId}`;
}

function pinKey(userId) {
  return `payments_pin_${userId}`;
}

/* ====== SETTINGS ====== */
export function getSettings(userId) {
  const key = settingsKey(userId);
  const s = localStorage.getItem(key);
  if (s) return JSON.parse(s);

  const init = {
    lang: "ar",
    theme: "light",
    currency: "JOD"
  };
  localStorage.setItem(key, JSON.stringify(init));
  return init;
}

export function saveSettings(userId, s) {
  localStorage.setItem(settingsKey(userId), JSON.stringify(s));
}

/* ====== PAYMENTS PIN ====== */
export function setPaymentsPIN(userId, pin) {
  localStorage.setItem(pinKey(userId), pin);
}

export function verifyPaymentsPIN(userId, pin) {
  return localStorage.getItem(pinKey(userId)) === pin;
}

/* ====== TRANSLATIONS ====== */
const translations = {
  ar: {
    enterPin: "أدخل الرمز السري للمدفوعات",
    wrongPin: "الرمز غير صحيح"
  },
  en: {
    enterPin: "Enter payments PIN",
    wrongPin: "Wrong PIN"
  }
};

export function t(lang, key) {
  return translations[lang]?.[key] || key;
}

/* ====== APPLY SYSTEM ====== */
export function applySystem(userId) {
  const s = getSettings(userId);
  document.documentElement.lang = s.lang;
  document.documentElement.dir = s.lang === "ar" ? "rtl" : "ltr";
  document.body.className = s.theme;
}
