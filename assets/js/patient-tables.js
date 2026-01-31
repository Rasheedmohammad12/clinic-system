const STORAGE_KEY = "patients";

let patients = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function saveAll(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
}

function render(filter = ""){
  const tbody = document.getElementById("patientsTableBody");
  const searchInput = document.getElementById("searchInput");

  tbody.innerHTML = "";

  patients
    .filter(p => (p.name || "").includes(filter))
    .forEach((p, index) => {

      const paid = Number(p.paidAmount || 0);
      const total = Number(p.totalAmount || 0);
      const remaining = total - paid;

      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td contenteditable data-field="name">${p.name || ""}</td>
        <td contenteditable data-field="sessionType">${p.sessionType || ""}</td>
        <td contenteditable data-field="paidAmount">${paid}</td>
        <td>${remaining}</td>
        <td contenteditable data-field="fileNumber">${p.fileNumber || ""}</td>
        <td contenteditable data-field="sessionsCount">${p.sessionsCount || ""}</td>
        <td contenteditable data-field="paymentMethod">${p.paymentMethod || ""}</td>
        <td contenteditable data-field="note">${p.note || ""}</td>
        <td contenteditable data-field="sessionHandler">${p.sessionHandler || ""}</td>
        <td class="actions">
          <button class="save">💾</button>
          <button class="delete">🗑️</button>
        </td>
      `;

      tr.querySelectorAll("[contenteditable]").forEach(cell => {
        cell.addEventListener("input", () => {
          const field = cell.dataset.field;
          let value = cell.innerText.trim();
          if(field === "paidAmount") value = Number(value) || 0;
          p[field] = value;
        });
      });

      tr.querySelector(".save").onclick = () => {
        saveAll();
        alert("تم الحفظ");
      };

      tr.querySelector(".delete").onclick = () => {
        if(confirm("هل أنت متأكد من الحذف؟")){
          patients.splice(index, 1);
          saveAll();
          render(searchInput.value);
        }
      };

      tbody.appendChild(tr);
    });
}

// ✅ هذه أهم دالة – صارت global
function addRow(){
  patients.push({
    name: "",
    sessionType: "",
    paidAmount: 0,
    totalAmount: 0,
    fileNumber: "",
    sessionsCount: "",
    paymentMethod: "",
    note: "",
    sessionHandler: ""
  });
  saveAll();
  render(document.getElementById("searchInput").value);
}

// 🔍 بحث
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", e => {
    render(e.target.value);
  });
  render();
});

// ⬇️ تنزيل الجدول
function downloadTable(){
  html2canvas(document.getElementById("tableArea")).then(canvas => {
    const link = document.createElement("a");
    link.download = "patients-table.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}
