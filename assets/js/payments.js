const PAYMENTS_KEY = "payments";
const tbody = document.getElementById("paymentsBody");

const payments = JSON.parse(localStorage.getItem(PAYMENTS_KEY)) || [];
tbody.innerHTML = "";

payments.forEach(p=>{
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${p.patientName}</td>
    <td>${p.amount}</td>
    <td>${p.note || "-"}</td>
    <td>${p.date}</td>
  `;
  tbody.appendChild(tr);
});
