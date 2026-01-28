// assets/js/sessions.js

const form = document.getElementById("sessionForm");
const patientSelect = document.getElementById("patientSelect");
const tableBody = document.getElementById("sessionsTable");

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

function renderSessions() {
  const sessions = getSessions();
  const patients = getPatients();

  tableBody.innerHTML = "";

  sessions.forEach((s, index) => {
    const patient = patients.find(p => p.id == s.patientId);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${patient ? patient.name : "—"}</td>
      <td>${new Date(s.date || s.id).toLocaleString()}</td>
      <td>${s.cost} ₪</td>
      <td>
        <button class="delete-btn" onclick="removeSession(${s.id})">حذف</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const patientId = patientSelect.value;
  const date = document.getElementById("sessionDate").value;
  const cost = document.getElementById("sessionCost").value;

  addSession(patientId, cost);

  form.reset();
  renderSessions();
});

function removeSession(id) {
  if (!confirm("هل أنت متأكد من حذف الجلسة؟")) return;

  const db = JSON.parse(localStorage.getItem("clinic_system_db"));
  db.sessions = db.sessions.filter(s => s.id !== id);
  localStorage.setItem("clinic_system_db", JSON.stringify(db));

  renderSessions();
}

document.addEventListener("DOMContentLoaded", () => {
  loadPatients();
  renderSessions();
});
