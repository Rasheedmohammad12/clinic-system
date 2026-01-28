// assets/js/patients.js

const form = document.getElementById("patientForm");
const tableBody = document.getElementById("patientsTable");

function renderPatients() {
  const patients = getPatients();
  tableBody.innerHTML = "";

  patients.forEach((p, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${p.name}</td>
      <td>${p.phone}</td>
      <td>
        <button class="delete-btn" onclick="removePatient(${p.id})">حذف</button>
      </td>
    `;

    tableBody.appendChild(tr);
  });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("patientName").value;
  const phone = document.getElementById("patientPhone").value;

  addPatient(name, phone);

  form.reset();
  renderPatients();
});

function removePatient(id) {
  if (!confirm("هل أنت متأكد من حذف المريض؟")) return;

  const db = JSON.parse(localStorage.getItem("clinic_system_db"));
  db.patients = db.patients.filter(p => p.id !== id);
  localStorage.setItem("clinic_system_db", JSON.stringify(db));

  renderPatients();
}

document.addEventListener("DOMContentLoaded", renderPatients);
