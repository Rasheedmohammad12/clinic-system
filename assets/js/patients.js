const form = document.getElementById("patientForm");
const table = document.getElementById("patientsTable");
const search = document.getElementById("searchInput");

let editId = null;

function renderPatients() {
  const patients = getPatients();
  const key = search.value.toLowerCase();
  table.innerHTML = "";

  patients
    .filter(p => p.name.toLowerCase().includes(key))
    .forEach((p, i) => {
      table.innerHTML += `
        <tr>
          <td>${i+1}</td>
          <td>${p.name}</td>
          <td>${p.phone}</td>
          <td><span class="action-btn" onclick="editPatient(${p.id})">✏️</span></td>
          <td><span class="action-btn" onclick="deletePatientUI(${p.id})">🗑️</span></td>
        </tr>`;
    });
}

form.onsubmit = e => {
  e.preventDefault();
  const name = patientName.value;
  const phone = patientPhone.value;

  const db = JSON.parse(localStorage.getItem("clinic_system_db"));

  if (editId) {
    const p = db.patients.find(p => p.id === editId);
    p.name = name;
    p.phone = phone;
    editId = null;
  } else {
    db.patients.push({id:Date.now(),name,phone});
  }

  localStorage.setItem("clinic_system_db",JSON.stringify(db));
  form.reset();
  renderPatients();
};

function editPatient(id){
  const p = getPatients().find(p=>p.id===id);
  patientName.value=p.name;
  patientPhone.value=p.phone;
  editId=id;
}

function deletePatientUI(id){
  if(!confirm("حذف المريض؟"))return;
  const db=JSON.parse(localStorage.getItem("clinic_system_db"));
  db.patients=db.patients.filter(p=>p.id!==id);
  localStorage.setItem("clinic_system_db",JSON.stringify(db));
  renderPatients();
}

search.oninput=renderPatients;
document.addEventListener("DOMContentLoaded",renderPatients);
