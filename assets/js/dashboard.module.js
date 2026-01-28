import { requireAuth, logout, getCurrentUser } from "./auth.js";

// ---------- Auth Guard ----------
requireAuth();

// ---------- Helpers ----------
function safeNumber(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : 0;
}

function monthKey(date) {
  // YYYY-MM
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
  // short month names
  const loc = lang === "ar" ? "ar-JO" : "en-US";
  return date.toLocaleString(loc, { month: "short", year: "numeric" });
}

// ---------- UI Text (minimal, safe) ----------
function applyDashboardTexts() {
  const s = getSettings();
  const isAr = s.lang === "ar";

  // Top
  document.getElementById("uiTitle").textContent = isAr ? "نظام العيادة" : "Clinic System";
  document.getElementById("uiSub").textContent = isAr ? "لوحة التحكم" : "Dashboard";

  document.getElementById("uiOverview").textContent = isAr ? "نظرة عامة" : "Overview";
  document.getElementById("uiQuick").textContent = isAr ? "إجراءات سريعة" : "Quick Actions";
  document.getElementById("uiSecure").textContent = isAr ? "محمي" : "Secure";

  document.getElementById("uiPatients").textContent = isAr ? "المرضى" : "Patients";
  document.getElementById("uiSessions").textContent = isAr ? "الجلسات" : "Sessions";
  document.getElementById("uiPayments").textContent = isAr ? "المدفوعات" : "Payments";

  document.getElementById("uiPatientsSub").textContent = isAr ? "إجمالي المسجلين" : "Total registered";
  document.getElementById("uiSessionsSub").textContent = isAr ? "كل الجلسات" : "All sessions";
  document.getElementById("uiPaymentsSub").textContent = isAr ? "إجمالي المقبوضات" : "Total collected";

  document.getElementById("uiChartTitle").textContent = isAr ? "المدفوعات (آخر 6 أشهر)" : "Payments (Last 6 months)";
  document.getElementById("uiChartHint").textContent = isAr ? "تلقائي" : "Auto";

  document.getElementById("uiHint").textContent = isAr
    ? "ملاحظة: استخدم “استلام المبالغ” لإضافة قبض سريع. المدفوعات تظهر تلقائيًا في التقارير والرسم."
    : "Tip: Use “Receive Payment” to quickly add receipts. Payments are shown in reports and charts automatically.";

  // Nav labels
  document.getElementById("navPatients").textContent = isAr ? "المرضى" : "Patients";
  document.getElementById("navPatientsSub").textContent = isAr ? "إضافة / بحث" : "Add / search";

  document.getElementById("navSessions").textContent = isAr ? "الجلسات" : "Sessions";
  document.getElementById("navSessionsSub").textContent = isAr ? "جدولة" : "Schedule";

  document.getElementById("navPayments").textContent = isAr ? "المدفوعات" : "Payments";
  document.getElementById("navPaymentsSub").textContent = isAr ? "برمز سري" : "PIN protected";

  document.getElementById("navReceive").textContent = isAr ? "استلام" : "Receive";
  document.getElementById("navReceiveSub").textContent = isAr ? "إضافة قبض" : "Add receipt";

  document.getElementById("navReport").textContent = isAr ? "كشف حساب" : "Report";
  document.getElementById("navReportSub").textContent = isAr ? "كشف مريض" : "Patient statement";

  document.getElementById("navSettings").textContent = isAr ? "الإعدادات" : "Settings";
  document.getElementById("navSettingsSub").textContent = isAr ? "لغة / ثيم" : "Language / theme";

  document.getElementById("navUsers").textContent = isAr ? "المستخدمين" : "Users";
  document.getElementById("navUsersSub").textContent = isAr ? "أدمن" : "Admin";

  // Mini labels
  document.getElementById("uiMiniPatients").textContent = isAr ? "المرضى" : "Patients";
  document.getElementById("uiMiniSessions").textContent = isAr ? "الجلسات" : "Sessions";
  document.getElementById("uiMiniTotal").textContent = isAr ? "الإجمالي" : "Total";

  // Buttons
  document.getElementById("uiLogout").textContent = isAr ? "خروج" : "Logout";
  document.getElementById("uiLang").textContent = isAr ? "AR" : "EN";
  document.getElementById("uiTheme").textContent = (getSettings().theme === "dark")
    ? (isAr ? "داكن" : "Dark")
    : (isAr ? "فاتح" : "Light");

  // Currency pill
  document.getElementById("uiCurrencyPill").textContent = getSettings().currency || "JOD";
}

// ---------- Stats ----------
function renderStats() {
  const stats = getDashboardStats();
  const patients = safeNumber(stats.patients ?? stats.totalPatients ?? getPatients().length);
  const sessions = safeNumber(stats.sessions ?? stats.totalSessions ?? getSessions().length);
  const totalPayments = safeNumber(stats.totalPayments ?? 0);

  document.getElementById("patientsCount").textContent = patients;
  document.getElementById("sessionsCount").textContent = sessions;
  document.getElementById("paymentsTotal").textContent = formatCurrency(totalPayments);

  document.getElementById("miniPatients").textContent = patients;
  document.getElementById("miniSessions").textContent = sessions;
  document.getElementById("miniTotal").textContent = formatCurrency(totalPayments);
}

// ---------- Chart (Last 6 months) ----------
let chartInstance = null;

function renderChart() {
  const s = getSettings();
  const payments = (getPayments() || []).map(p => ({
    amount: safeNumber(p.amount),
    date: p.date ? new Date(p.date) : new Date(p.id || Date.now())
  }));

  // bucket sums by YYYY-MM
  const buckets = new Map();
  for (const p of payments) {
    const k = monthKey(p.date);
    buckets.set(k, (buckets.get(k) || 0) + p.amount);
  }

  const months = lastNMonths(6);
  const labels = months.map(m => monthLabel(m, s.lang));
  const data = months.map(m => safeNumber(buckets.get(monthKey(m)) || 0));

  const ctx = document.getElementById("paymentsChart");
  if (!ctx || !window.Chart) return;

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: s.lang === "ar" ? "المدفوعات" : "Payments",
        data
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// ---------- Payments PIN gate ----------
function setupPaymentsGate() {
  const link = document.getElementById("navPaymentsLink");
  if (!link) return;

  link.addEventListener("click", (e) => {
    e.preventDefault();

    const savedPin = localStorage.getItem("payments_pin");
    if (!savedPin) {
      alert(getSettings().lang === "ar"
        ? "لم يتم تعيين رمز سري للمدفوعات بعد"
        : "Payments PIN is not set yet");
      window.location.href = "settings.html";
      return;
    }

    const entered = prompt(getSettings().lang === "ar"
      ? "أدخل الرمز السري للمدفوعات:"
      : "Enter Payments PIN:");

    if (entered === savedPin) {
      sessionStorage.setItem("payments_access", "true");
      window.location.href = "payments.html";
    } else {
      alert(getSettings().lang === "ar" ? "الرمز غير صحيح" : "Wrong PIN");
    }
  });
}

// ---------- Topbar actions ----------
function setupTopbar() {
  // user chip
  const u = getCurrentUser();
  document.getElementById("uiUser").textContent = u
    ? `${u.username} • ${u.role}`
    : "—";

  // language toggle
  document.getElementById("btnLang").addEventListener("click", () => {
    const s = getSettings();
    s.lang = s.lang === "ar" ? "en" : "ar";
    saveSettings(s);
    location.reload();
  });

  // theme toggle
  document.getElementById("btnTheme").addEventListener("click", () => {
    const s = getSettings();
    s.theme = s.theme === "dark" ? "light" : "dark";
    saveSettings(s);
    location.reload();
  });

  // logout
  document.getElementById("btnLogout").addEventListener("click", () => {
    sessionStorage.removeItem("payments_access");
    logout();
  });
}

// ---------- Boot ----------
document.addEventListener("DOMContentLoaded", () => {
  // apply direction + theme from settings-system.js (already does applySystem on DOMContentLoaded)
  // but we also update button labels, etc.
  applyDashboardTexts();
  setupTopbar();
  setupPaymentsGate();
  renderStats();
  renderChart();
});
