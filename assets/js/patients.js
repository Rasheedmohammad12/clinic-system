import { getCurrentUser, requireAuth } from "./auth.js";

requireAuth();
const user = getCurrentUser();

const PATIENTS_KEY = `patients_${user.id}`;
const TABLE_KEY = `patient_table_${user.id}`;

const form = document.getElementById("patientForm");
const nameInput = document.getElementById("patientName");
const fileInput = document.getElementById("patientFile");

let patients = JSON.parse(localStorage.getItem(PATIENTS_KEY)) || [];
let rows = JSON.parse(localStorage.getItem(TABLE_KEY)) || [];

function saveAll() {
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
  localStorage.setItem(TABLE_KEY, JSON.stringify(rows));
}

form.addEventListener("submit", e => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const fileNumber = fileInput.value.trim();

  if (!name) {
    alert("اسم المريض مطلوب");
    return;
  }

  const patient = {
    id: Date.now(),
    name,
    fileNumber
  };

  patients.push(patient);

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

  // تحديث الجدول فورًا
  window.dispatchEvent(new Event("storage"));
});
