import { getCurrentUser, requireAuth } from "./auth.js";

requireAuth();
const user = getCurrentUser();

const TABLE_KEY = `patient_table_${user.id}`;
let rows = JSON.parse(localStorage.getItem(TABLE_KEY)) || [];

function saveRows() {
  localStorage.setItem(TABLE_KEY, JSON.stringify(rows));
}

function renderTable() {
  const tbody = document.getElementById("patientsTableBody");
  tbody.innerHTML = "";

  rows.forEach((r, index) => {
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
        if (field.includes("Amount")) value = Number(value) || 0;
        r[field] = value;
        saveRows();
      });
    });

    tbody.appendChild(tr);
  });
}

document.addEventListener("DOMContentLoaded", renderTable);
