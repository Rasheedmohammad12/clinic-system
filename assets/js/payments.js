import { requireAuth, getCurrentUser } from "./auth.js";
import { formatCurrency, t } from "./settings-system.js";

requireAuth();
const user = getCurrentUser();

/* ===== حماية الصفحة ===== */
const PIN_KEY = `payments_pin_${user.id}`;

if (sessionStorage.getItem("payments_access") !== "true") {
  const savedPin = localStorage.getItem(PIN_KEY);

  if (!savedPin) {
    alert("يرجى تعيين رمز سري للمدفوعات من الإعدادات");
    window.location.href = "settings.html";
  }

  const entered = prompt(t("enterPin"));
  if (entered !== savedPin) {
    alert(t("wrongPin"));
    window.location.href = "dashboard.html";
  } else {
    sessionStorage.setItem("payments_access", "true");
  }
}

/* ===== عرض المدفوعات ===== */
const tbody = document.getElementById("paymentsBody");
const totalBox = document.getElementById("totalPayments");

function renderPayments() {
  const payments = getPayments();
  const patients = getPatients();

  tbody.innerHTML = "";
  let total = 0;

  payments.forEach(p => {
    const patient = patients.find(x => x.id == p.patientId);
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${patient ? patient.name : "-"}</td>
      <td class="amount">${formatCurrency(p.amount)}</td>
      <td>${p.note || "-"}</td>
      <td>${new Date(p.date).toLocaleDateString()}</td>
    `;

    total += p.amount;
    tbody.appendChild(tr);
  });

  totalBox.textContent =
    (t("totalPayments") || "الإجمالي") + ": " + formatCurrency(total);
}

document.addEventListener("DOMContentLoaded", renderPayments);
