import { getCurrentUser, requireAuth } from "./auth.js";

/* =====================
   AUTH
===================== */
requireAuth();
const user = getCurrentUser();
if (!user) {
  alert("يجب تسجيل الدخول");
  window.location.href = "index.html";
}

/* =====================
   STORAGE
===================== */
const TABLE_KEY = `patient_table_${user.id}`;
let rows = JSON.parse(localStorage.getItem(TABLE_KEY)) || [];

function saveRows() {
  localStorage.setItem(TABLE_KEY, JSON.stringify(rows));
}

/* =====================
   RENDER TABLE
===================== */
function renderTable() {
  const tbody = document.getElementById("patientsTableBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  rows.forEach((r, index) => {
    const remaining =
      (Number(r.totalAmount) || 0) - (Number(r.paidAmount) || 0);

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${r.name || ""}</td>
      <td contenteditable data-field="sessionType">${r.sessionType || ""}</td>
      <td contenteditable data-field="paidAmount">${r.paidAmount || 0}</td>
      <td>${remaining}</td>
      <td>${r.fileNumber || ""}</td>
      <td contenteditable data-field="sessionsCount">${r.sessionsCount || ""}</td>
      <td contenteditable data-field="paymentMethod">${r.paymentMethod || ""}</td>
      <td contenteditable data-field="note">${r.note || ""}</td>
      <td contenteditable data-field="sessionHandler">${r.sessionHandler || ""}</td>
    `;

    // ✏️ تعديل مباشر
    tr.querySelectorAll("[contenteditable]").forEach(cell => {
      cell.addEventListener("input", () => {
        const field = cell.dataset.field;
        let value = cell.innerText.trim();

        if (field === "paidAmount" || field === "totalAmount") {
          value = Number(value) || 0;
        }

        r[field] = value;
        saveRows();
        renderTable(); // لتحديث المبلغ المتبقي
      });
    });

    tbody.appendChild(tr);
  });
}

/* =====================
   LISTEN FOR NEW ROWS
===================== */
// 🔁 لما ينضاف مريض من ملف patients.js
window.addEventListener("storage", () => {
  rows = JSON.parse(localStorage.getItem(TABLE_KEY)) || [];
  renderTable();
});

/* =====================
   INIT
===================== */
document.addEventListener("DOMContentLoaded", renderTable);
