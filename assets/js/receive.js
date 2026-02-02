import { getCurrentUser, requireAuth } from "./auth.js";

requireAuth();
const user = getCurrentUser();

const PATIENTS_KEY = `patients_${user.id}`;
const TABLE_KEY    = `patient_table_${user.id}`;
const PAYMENTS_KEY = `payments_${user.id}`;

const form = document.getElementById("receiveForm");
const patientSelect = document.getElementById("patientSelect");
const amountInput = document.getElementById("amount");
const noteInput = document.getElementById("note");

/* =====================
   تحميل المرضى
===================== */
const patients = JSON.parse(localStorage.getItem(PATIENTS_KEY)) || [];

patients.forEach(p => {
  const opt = document.createElement("option");
  opt.value = p.id;            // نستخدم ID
  opt.textContent = p.name;
  patientSelect.appendChild(opt);
});

/* =====================
   حفظ الدفعة + خصم المتبقي
===================== */
form.addEventListener("submit", e => {
  e.preventDefault();

  const patientId = Number(patientSelect.value);
  const amount = Number(amountInput.value) || 0;
  const note = noteInput.value.trim();

  if (!patientId || amount <= 0) {
    alert("يرجى اختيار مريض وإدخال مبلغ صحيح");
    return;
  }

  /* ===== حفظ الدفعة ===== */
  const payments = JSON.parse(localStorage.getItem(PAYMENTS_KEY)) || [];

  payments.push({
    patientId,
    patientName: patients.find(p => p.id === patientId)?.name || "",
    amount,
    note,
    date: new Date().toLocaleDateString("ar-EG")
  });

  localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));

  /* ===== خصم المتبقي ===== */
  const rows = JSON.parse(localStorage.getItem(TABLE_KEY)) || [];

  const row = rows.find(r => r.patientId === patientId);
  if (row) {
    row.remaining = Math.max(0, Number(row.remaining || 0) - amount);
    localStorage.setItem(TABLE_KEY, JSON.stringify(rows));
  }

  alert("✅ تم حفظ الدفعة وتحديث المتبقي");
  form.reset();
});
