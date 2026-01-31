// حماية الصفحة
if (localStorage.getItem("loggedIn") !== "true") {
  window.location.href = "index.html";
}

const tbody = document.getElementById("paymentsBody");

function renderPayments() {
  const payments = getPayments();   // من storage.js
  const patients = getPatients();   // من storage.js

  tbody.innerHTML = "";

  payments.forEach(p => {
    const patient = patients.find(x => x.id == p.patientId);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${patient ? patient.name : "—"}</td>
      <td>${formatCurrency(p.amount)}</td>
      <td>${p.note || ""}</td>
      <td>${new Date(p.date).toLocaleDateString()}</td>
    `;

    tbody.appendChild(tr);
  });
}

document.addEventListener("DOMContentLoaded", renderPayments);
