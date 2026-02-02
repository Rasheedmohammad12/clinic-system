import { getCurrentUser, requireAuth } from "./auth.js";

requireAuth();
const user = getCurrentUser();

const PAYMENTS_KEY = `payments_${user.id}`;
const tbody = document.getElementById("paymentsBody");

const payments = JSON.parse(localStorage.getItem(PAYMENTS_KEY)) || [];

tbody.innerHTML = "";

payments.forEach(p => {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${p.patient}</td>
    <td>${p.amount}</td>
    <td>${p.note || "-"}</td>
    <td>${p.date}</td>
  `;

  tbody.appendChild(tr);
});
