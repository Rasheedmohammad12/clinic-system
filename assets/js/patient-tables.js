import { requireAuth, getCurrentUser } from "./auth.js";

// ---------- Auth ----------
requireAuth();
const currentUser = getCurrentUser();
const USER_KEY = currentUser.email;

// ---------- Storage Keys ----------
const DB_KEY = `clinic_system_db_${USER_KEY}`;
const TABLE_KEY = `patient_table_rows_${USER_KEY}`;

// ---------- Load Data ----------
const db = JSON.parse(localStorage.getItem(DB_KEY)) || { patients: [] };
let patients = db.patients || [];
let rows = JSON.parse(localStorage.getItem(TABLE_KEY)) || [];

// ---------- Sync: each patient must have a row ----------
patients.forEach(p => {
  const exists = rows.find(r => r.patientId === p.id);
  if (!exists) {
    rows.push({
      patientId: p.id,
      name: p.name,
      fileNumber: p.fileNumber || "",
      sessionType: "",
      paidAmount: 0,
      totalAmount: 0,
      sessionsCount: "",
      paymentMethod: "",
      note: "",
      sessionHandler: ""
    });
  }
});

saveRows();

// ---------- Save ----------
function saveRows() {
  localStorage.setItem(TABLE_KEY, JSON.stringify(rows));
}

// ---------- Render ----------
function render() {
  const tbody = document.getElementById("patientsTableBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  rows.forEach(r => {
    const remaining = (r.totalAmount || 0) - (r.paidAmount || 0);

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${r.name}</td>
      <td contenteditable data-field="sessionType">${r.sessionType}</td>
      <td contenteditable data-field="paidAmount">${r.paidAmount}</td>
      <td>${remaining}</td>
      <td>${r.fileNumber}</td>
      <td contenteditable data-field="sessionsCount">${r.sessionsCount}</td>
      <td contenteditable data-field="paymentMethod">${r.paymentMethod}</td>
      <td contenteditable data-field="note">${r.note}</td>
      <td contenteditable data-field="sessionHandler">${r.sessionHandler}</td>
    `;

    tr.querySelectorAll("[contenteditable]").forEach(cell => {
      cell.addEventListener("input", () => {
        const field = cell.dataset.field;
        let value = cell.innerText.trim();

        if (field === "paidAmount") value = Number(value) || 0;
        r[field] = value;

        saveRows();
        render();
      });
    });

    tbody.appendChild(tr);
  });
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", render);
