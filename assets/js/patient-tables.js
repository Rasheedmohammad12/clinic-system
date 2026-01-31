document.addEventListener("DOMContentLoaded", () => {

  const tbody = document.getElementById("patientsTableBody");
  const STORAGE_KEY = "patients";

  let patients = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
  }

  function render() {
    tbody.innerHTML = "";

    patients.forEach((p, index) => {

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
      `;

      // حفظ التعديل عند الخروج من الخلية
      tr.querySelectorAll("[contenteditable]").forEach(cell => {
        cell.addEventListener("blur", () => {
          const field = cell.dataset.field;
          let value = cell.innerText.trim();

          if (field === "paidAmount") {
            value = Number(value) || 0;
          }

          patients[index][field] = value;
          save();
          render();
        });
      });

      tbody.appendChild(tr);
    });
  }

  render();
});
