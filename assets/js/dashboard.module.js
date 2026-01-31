import { requireAuth, logout, getCurrentUser } from "./auth.js";
import {
  getSettings,
  saveSettings,
  t,
  formatCurrency
} from "./settings-system.js";

// ---------- Auth Guard ----------
requireAuth();

// ---------- Current User ----------
const currentUser = getCurrentUser();

// ---------- Helpers ----------
function safeNumber(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : 0;
}

function monthKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function lastNMonths(n = 6) {
  const arr = [];
  const d = new Date();
  d.setDate(1);
  for (let i = 0; i < n; i++) {
    const copy = new Date(d);
    copy.setMonth(d.getMonth() - (n - 1 - i));
    arr.push(copy);
  }
  return arr;
}

function monthLabel(date, lang) {
  const loc = lang === "ar" ? "ar-JO" : "en-US";
  return date.toLocaleString(loc, { month: "short", year: "numeric" });
}

// ---------- UI Text (LANG FIX) ----------
function applyDashboardTexts() {
  const s = getSettings();

  document.getElementById("uiTitle").textContent =
    s.lang === "ar" ? "نظام العيادة" : "Clinic System";

  document.getElementById("uiSub").textContent = t("dashboard");
  document.getElementById("uiOverview").textContent =
    s.lang === "ar" ? "نظرة عامة" : "Overview";

  document.getElementById("uiQuick").textContent =
    s.lang === "ar" ? "إجراءات سريعة" : "Quick Actions";

  document.getElementById("uiSecure").textContent =
    s.lang === "ar" ? "محمي" : "Secure";

  document.getElementById("uiPatients").textContent = t("patients");
  document.getElementById("uiSessions").textContent = t("sessions");
  document.getElementById("uiPayments").textContent = t("payments");

  document.getElementById("uiPatientsSub").textContent =
    s.lang === "ar" ? "إجمالي المسجلين" : "Total registered";

  document.getElementById("uiSessionsSub").textContent =
    s.lang === "ar" ? "كل الجلسات" : "All sessions";

  document.getElementById("uiPaymentsSub").textContent =
    s.lang === "ar" ? "إجمالي المقبوضات" : "Total collected";

  document.getElementById("uiChartTitle").textContent =
    s.lang === "ar"
      ? "المدفوعات (آخر 6 أشهر)"
      : "Payments (Last 6 months)";

  document.getElementById("uiCurrencyPill").textContent =
    s.currency || "JOD";

  // NAV
  document.getElementById("navPatients").textContent = t("patients");
  document.getElementById("navSessions").textContent = t("sessions");
  document.getElementById("navPayments").textContent = t("payments");
  document.getElementById("navReceive").textContent = t("receive");
  document.getElementById("navSettings").textContent = t("settings");
  document.getElementById("navUsers").textContent = t("users");
  document.getElementById("uiLogout").textContent = t("logout");
}

// ---------- Stats ----------
function renderStats() {
  const stats = getDashboardStats(currentUser);
  const patients = safeNumber(stats.patients ?? getPatients(currentUser).length);
  const sessions = safeNumber(stats.sessions ?? getSessions(currentUser).length);
  const totalPayments = safeNumber(stats.totalPayments ?? 0);

  document.getElementById("patientsCount").textContent = patients;
  document.getElementById("sessionsCount").textContent = sessions;
  document.getElementById("paymentsTotal").textContent =
    formatCurrency(totalPayments);

  document.getElementById("miniPatients").textContent = patients;
  document.getElementById("miniSessions").textContent = sessions;
  document.getElementById("miniTotal").textContent =
    formatCurrency(totalPayments);
}

// ---------- Chart ----------
let chartInstance = null;

function renderChart() {
  const s = getSettings();
  const payments = (getPayments(currentUser) || []).map(p => ({
    amount: safeNumber(p.amount),
    date: p.date ? new Date(p.date) : new Date(p.id || Date.now())
  }));

  const buckets = new Map();
  payments.forEach(p => {
    const k = monthKey(p.date);
    buckets.set(k, (buckets.get(k) || 0) + p.amount);
  });

  const months = lastNMonths(6);
  const labels = months.map(m => monthLabel(m, s.lang));
  const data = months.map(m => safeNumber(buckets.get(monthKey(m)) || 0));

  const ctx = document.getElementById("paymentsChart");
  if (!ctx || !window.Chart) return;

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: t("payments"),
        data
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { beginAtZero: true } }
    }
  });
}

// ---------- Payments PIN ----------
function setupPaymentsGate() {
  const link = document.getElementById("navPaymentsLink");
  if (!link) return;

  const PIN_KEY = `payments_pin_${currentUser.id}`;

  link.addEventListener("click", e => {
    e.preventDefault();

    const savedPin = localStorage.getItem(PIN_KEY);
    if (!savedPin) {
      alert(t("payments") + ": PIN not set");
      window.location.href = "settings.html";
      return;
    }

    const entered = prompt(t("enterPin"));
    if (entered === savedPin) {
      sessionStorage.setItem("payments_access", "true");
      window.location.href = "payments.html";
    } else {
      alert(t("wrongPin"));
    }
  });
}

// ---------- Topbar ----------
function setupTopbar() {
  document.getElementById("uiUser").textContent =
    `${currentUser.username} • ${currentUser.role}`;

  document.getElementById("btnLang").addEventListener("click", () => {
    const s = getSettings();
    s.lang = s.lang === "ar" ? "en" : "ar";
    saveSettings(s);
    location.reload();
  });

  document.getElementById("btnTheme").addEventListener("click", () => {
    const s = getSettings();
    s.theme = s.theme === "dark" ? "light" : "dark";
    saveSettings(s);
    location.reload();
  });

  document.getElementById("btnLogout").addEventListener("click", () => {
    sessionStorage.removeItem("payments_access");
    logout();
  });
}

// ---------- Boot ----------
document.addEventListener("DOMContentLoaded", () => {
  applyDashboardTexts();
  setupTopbar();
  setupPaymentsGate();
  renderStats();
  renderChart();
});
