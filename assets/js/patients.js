import { getCurrentUser, requireAuth } from "./auth.js";

requireAuth();
const user = getCurrentUser();

const PATIENTS_KEY = `patients_${user.id}`;
const TABLE_KEY = `patient_table_${user.id}`;

const form = document.getElementById("patientForm");
const table = document.getElementById("patientsTable");

let patients = JSON.parse(localStorage.getItem(PATIENTS_KEY)) || [];
let rows = JSON.parse(localStorage.getItem(TABLE_KEY)) || [];

function saveAll() {
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
  localStorage.setItem(TABLE_KEY, JSON.stringify(rows));
}

function renderPatients() {
  table.innerHTML = "";
  patients.forEach((p, i) => {
    table.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${p.name}</td>
        <td>${p.fileNumber}</td>
      </tr>
    `;
  });
}

form.onsubmit = e => {
  e.preventDefault();

  const name = patientName.value.trim();
  const fileNumber = patientFile.value.trim();
  if (!name) return;

  const patient = {
    id: Date.now(),
    name,
    fileNumber
  };

  patients.push(patient);

  // ➕ صف تلقائي في الجدول
  rows.push({
    patientId: patient.id,
    name: patient.name,
    fileNumber: patient.fileNumber,
    sessionType: "",
    paidAmount: 0,
    totalAmount: 0,
    sessionsCount: "",
    paymentMethod: "",
    note: "",
    sessionHandler: ""
  });

  saveAll();
  form.reset();
  renderPatients();
};

document.addEventListener("DOMContentLoaded", renderPatients);
