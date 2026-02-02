const PATIENTS_KEY = "patients";
const TABLE_KEY    = "patient_table";
const PAYMENTS_KEY = "payments";

const form = document.getElementById("receiveForm");
const patientSelect = document.getElementById("patientSelect");
const amountInput = document.getElementById("amount");
const noteInput = document.getElementById("note");

/* تعبئة المرضى */
patientSelect.innerHTML = `<option value="">-- اختر مريض --</option>`;

const patients = JSON.parse(localStorage.getItem(PATIENTS_KEY)) || [];

patients.forEach(p=>{
  const opt = document.createElement("option");
  opt.value = p.id;
  opt.textContent = `${p.name} (${p.fileNumber || "-"})`;
  patientSelect.appendChild(opt);
});

/* حفظ المبلغ */
form.addEventListener("submit", e=>{
  e.preventDefault();

  const patientId = Number(patientSelect.value);
  const amount = Number(amountInput.value) || 0;
  const note = noteInput.value.trim();

  if(!patientId || amount<=0){
    alert("اختر مريض وأدخل مبلغ صحيح");
    return;
  }

  /* حفظ في المدفوعات */
  const payments = JSON.parse(localStorage.getItem(PAYMENTS_KEY)) || [];
  const patient = patients.find(p=>p.id===patientId);

  payments.push({
    patientId,
    patientName: patient.name,
    amount,
    note,
    date: new Date().toLocaleDateString("ar-EG")
  });

  localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));

  /* خصم المتبقي */
  const rows = JSON.parse(localStorage.getItem(TABLE_KEY)) || [];
  const row = rows.find(r=>r.patientId===patientId);

  if(row){
    row.remaining = Math.max(0, Number(row.remaining||0) - amount);
    localStorage.setItem(TABLE_KEY, JSON.stringify(rows));
  }

  alert("✅ تم حفظ المبلغ");
  form.reset();
});
