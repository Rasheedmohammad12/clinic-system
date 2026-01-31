import { getCurrentUser, requireAuth } from "./auth.js";

requireAuth();
const user = getCurrentUser();

/* 🔑 نفس مفتاح المرضى */
const PATIENTS_KEY = `patients_${user.id}`;

/* عناصر الصفحة */
const form = document.getElementById("receiveForm");
const patientSelect = document.getElementById("patientSelect");
const amountInput = document.getElementById("amount");
const noteInput = document.getElementById("note");

/* تحميل المرضى */
function loadPatients() {
  const patients = JSON.parse(localStorage.getItem(PATIENTS_KEY)) || [];

  patientSelect.innerHTML = `<option value="">-- اختر مريض --</option>`;

  patients.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = p.name;
    patientSelect.appendChild(opt);
  });
}

/* حفظ الدفع */
form.addEventListener("submit", e => {
  e.preventDefault();

  if (!patientSelect.value || !amountInput.value) {
    alert("يرجى اختيار مريض وإدخال مبلغ");
    return;
  }

  addPayment(
    patientSelect.value,
    Number(amountInput.value),
    noteInput.value
  );

  alert("تم حفظ المبلغ بنجاح");
  form.reset();
});

/* تشغيل */
document.addEventListener("DOMContentLoaded", loadPatients);
