// حماية الصفحة
if (localStorage.getItem("loggedIn") !== "true") {
  window.location.href = "index.html";
}

/* عناصر الصفحة */
const form = document.getElementById("receiveForm");
const patientSelect = document.getElementById("patientSelect");
const amountInput = document.getElementById("amount");
const noteInput = document.getElementById("note");

/* تحميل المرضى */
function loadPatients() {
  const patients = getPatients(); // من storage.js (global)

  patientSelect.innerHTML = `<option value="">-- اختر مريض --</option>`;

  patients.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = p.name;
    patientSelect.appendChild(opt);
  });
}

/* حفظ استلام المبلغ */
form.addEventListener("submit", e => {
  e.preventDefault();

  const patientId = patientSelect.value;
  const amount = amountInput.value;

  if (!patientId || !amount) {
    alert("يرجى اختيار مريض وإدخال المبلغ");
    return;
  }

  // ✅ الحفظ الفعلي
  addPayment(patientId, Number(amount), noteInput.value);

  alert("✅ تم حفظ المبلغ بنجاح");

  form.reset();
});

/* تشغيل */
document.addEventListener("DOMContentLoaded", loadPatients);
