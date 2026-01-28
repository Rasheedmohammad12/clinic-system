// assets/js/patient-report.js

const patientSelect = document.getElementById("patientSelect");
const totalCostEl = document.getElementById("totalCost");
const totalPaidEl = document.getElementById("totalPaid");
const remainingEl = document.getElementById("remaining");
const tableBody = document.getElementById("reportTable");

function loadPatients() {
  const patients = getPatients();
  patientSelect.innerHTML = `<option value="">-- اختر المريض --</option>`;

  patients.forEach(p => {
    const option = document.createElement("option");
    option.value = p.id;
    option.textContent = p.name;
    patientSelect.appendChild(option);
  });
}

function renderReport(patientId) {
  if (!patientId) return;

  const sessions = getSessions().filter(s => s.patientId == patientId);
  const payments = getPayments().filter(p => p.patientId == patientId);

  const totalCost = sessions.reduce((sum, s) => sum + s.cost, 0);
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const remaining = totalCost - totalPaid;

  totalCostEl.textContent = totalCost + " ₪";
  totalPaidEl.textContent = totalPaid + " ₪";
  remainingEl.textContent = remaining + " ₪";

  tableBody.innerHTML = "";

  sessions.forEach(s => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>جلسة</td>
      <td>${new Date(s.id).toLocaleDateString()}</td>
      <td>${s.cost} ₪</td>
    `;
    tableBody.appendChild(tr);
  });

  payments.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>دفعة</td>
      <td>${new Date(p.id).toLocaleDateString()}</td>
      <td>- ${p.amount} ₪</td>
    `;
    tableBody.appendChild(tr);
  });
}

patientSelect.addEventListener("change", function () {
  renderReport(this.value);
});

document.addEventListener("DOMContentLoaded", loadPatients);
