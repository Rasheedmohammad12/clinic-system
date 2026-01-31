import { requireAuth, getCurrentUser } from "./auth.js";

// ---------- Auth Guard ----------
requireAuth();
const currentUser = getCurrentUser();
const DB_KEY = `clinic_system_db_${currentUser.email}`;

// ---------- Elements ----------
const form = document.getElementById("patientForm");
const table = document.getElementById("patientsTable");
const search = document.getElementById("searchInput");

let editId = null;

// ---------- Helpers ----------
function getDB() {
  let db = JSON.parse(localStorage.getItem(DB_KEY));
  if (!db) {
    db = { patients: [] };
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  }
  return db;
}

function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function getPatients() {
  return getDB().patients;
}

// ---------- Render ----------
function renderPatients() {
  const patients = getPatients();
  const key = search.value.toLowerCase();
  table.innerHTML = "";

  patients
    .filter(p => p.name.toLowerCase().includes(key))
    .forEach((p, i) => {
      table.innerHTML += `
        <tr>
          <td>${i + 1}</td>
          <td>${p.name}</td>
          <td>${p.phone}</td>
          <td>
            <span class="action-btn" onclick="editPatient(${p.id})">✏️</span>
          </td>
          <td>
            <span class="action-btn" onclick="deletePatientUI(${p.id})">🗑️</span>
          </td>
        </tr>
      `;
    });
}

// ---------- Form Submit ----------
form.onsubmit = e => {
  e.preventDefault();

  const name = patientName.value.trim();
  const phone = patientPhone.value.trim();
  if (!name || !phone) return;

  const db = getDB();

  if (editId) {
    const p = db.patients.find(p => p.id === editId);
    if (p) {
      p.name = name;
      p.phone = phone;
    }
    editId = null;
  } else {
    db.patients.push({
      id: Date.now(),
      name,
      phone
    });
  }

  saveDB(db);
  form.reset();
  renderPatients();
};

// ---------- Edit ----------
window.editPatient = function (id) {
  const p = getPatients().find(p => p.id === id);
  if (!p) return;

  patientName.value = p.name;
  patientPhone.value = p.phone;
  editId = id;
};

// ---------- Delete ----------
window.deletePatientUI = function (id) {
  if (!confirm("حذف المريض؟")) return;

  const db = getDB();
  db.patients = db.patients.filter(p => p.id !== id);
  saveDB(db);
  renderPatients();
};

// ---------- Events ----------
search.oninput = renderPatients;
document.addEventListener("DOMContentLoaded", renderPatients);
