const form = document.getElementById("receiveForm");
const patientSelect = document.getElementById("patientSelect");

function loadPatients() {
  const patients = getPatients();
  patientSelect.innerHTML = `<option value="">-- اختر المريض --</option>`;

  patients.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = p.name;
    patientSelect.appendChild(opt);
  });
}

form.addEventListener("submit", e => {
  e.preventDefault();

  const patientId = patientSelect.value;
  const amount = Number(document.getElementById("amount").value);
  const note = document.getElementById("note").value;

  if (!patientId || amount <= 0) {
    alert("❌ أدخل بيانات صحيحة");
    return;
  }

  // إضافة مباشرة إلى المدفوعات
  addPayment({
    patientId,
    amount,
    note
  });

  alert("✅ تم استلام المبلغ وإضافته إلى المدفوعات");

  form.reset();
});

document.addEventListener("DOMContentLoaded", loadPatients);
