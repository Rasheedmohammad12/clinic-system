import { getCurrentUser, requireAuth } from "./auth.js";

requireAuth();
const user = getCurrentUser();

const PATIENTS_KEY = `patients_${user.id}`;
const PAYMENTS_KEY = `payments_${user.id}`;

const form = document.getElementById("receiveForm");
const patientSelect = document.getElementById("patientSelect");
const amountInput = document.getElementById("amount");
const noteInput = document.getElementById("note");

/* تحميل المرضى */
const patients = JSON.parse(localStorage.getItem(PATIENTS_KEY)) || [];
patients.forEach(p => {
  const opt = document.createElement("option");
  opt.value = p.name;
  opt.textContent = p.name;
  patientSelect.appendChild(opt);
});

/* حفظ الدفعة */
form.addEventListener("submit", e => {
  e.preventDefault();

  const payments = JSON.parse(localStorage.getItem(PAYMENTS_KEY)) || [];

  payments.push({
    patient: patientSelect.value,
    amount: Number(amountInput.value),
    note: noteInput.value.trim(),
    date: new Date().toLocaleDateString("ar-EG")
  });

  localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));

  alert("✅ تم حفظ الدفعة");
  form.reset();
});
