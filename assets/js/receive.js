/* =====================
   TEMP DEBUG VERSION
   بدون auth.js
===================== */

const userId = localStorage.getItem("currentUserId") || "demo";

/* نفس المفاتيح */
const PATIENTS_KEY = `patients_${userId}`;
const TABLE_KEY    = `patient_table_${userId}`;
const PAYMENTS_KEY = `payments_${userId}`;

const form = document.getElementById("receiveForm");
const patientSelect = document.getElementById("patientSelect");
const amountInput = document.getElementById("amount");
const noteInput = document.getElementById("note");

/* تفريغ القائمة */
patientSelect.innerHTML = `<option value="">-- اختر مريض --</option>`;

/* تحميل المرضى */
const patients = JSON.parse(localStorage.getItem(PATIENTS_KEY)) || [];

console.log("PATIENTS:", patients);

patients.forEach(p => {
  const opt = document.createElement("option");
  opt.value = p.id;
  opt.textContent = p.name;
  patientSelect.appendChild(opt);
});

/* حفظ */
form.addEventListener("submit", e => {
  e.preventDefault();

  const patientId = Number(patientSelect.value);
  const amount = Number(amountInput.value) || 0;

  if (!patientId || amount <= 0) {
    alert("اختيار مريض + مبلغ صحيح");
    return;
  }

  /* حفظ الدفعة */
  const payments = JSON.parse(localStorage.getItem(PAYMENTS_KEY)) || [];
  const patient = patients.find(p => p.id === patientId);

  payments.push({
    patientId,
    patientName: patient?.name || "",
    amount,
    note: noteInput.value.trim(),
    date: new Date().toLocaleDateString("ar-EG")
  });

  localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));

  /* خصم المتبقي */
  const rows = JSON.parse(localStorage.getItem(TABLE_KEY)) || [];
  const row = rows.find(r => r.patientId === patientId);

  if (row) {
    row.remaining = Math.max(0, Number(row.remaining || 0) - amount);
    localStorage.setItem(TABLE_KEY, JSON.stringify(rows));
  }

  alert("تم الحفظ");
  form.reset();
});
