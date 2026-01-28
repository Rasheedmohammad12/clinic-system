// assets/js/payments.js

const form = document.getElementById("paymentForm");
const patientSelect = document.getElementById("paymentPatient");
const tableBody = document.getElementById("paymentsTable");

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

function renderPayments() {
  const payments = getPayments();
  const patients = getPatients();

  tableBody.innerHTML = "";

  payments.forEach((p, index) => {
    const patient = patients.find(pt => pt.id == p.patientId);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${patient ? patient.name : "—"}</td>
      <td>${p.amount} ₪</td>
      <td>
        <button class="delete-btn" onclick="removePayment(${p.id})">حذف</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const patientId = patientSelect.value;
  const amount = document.getElementById("paymentAmount").value;

  addPayment(patientId, amount);

  form.reset();
  renderPayments();
});

function removePayment(id) {
  if (!confirm("هل أنت متأكد من حذف الدفعة؟")) return;

  const db = JSON.parse(localStorage.getItem("clinic_system_db"));
  db.payments = db.payments.filter(p => p.id !== id);
  localStorage.setItem("clinic_system_db", JSON.stringify(db));

  renderPayments();
}

document.addEventListener("DOMContentLoaded", () => {
  loadPatients();
  renderPayments();
});
