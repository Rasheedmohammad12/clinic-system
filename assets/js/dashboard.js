// assets/js/dashboard.js

function loadDashboard() {
  const patients = getPatients();
  const sessions = getSessions();
  const payments = getPayments();

  const patientsEl = document.getElementById("patientsCount");
  const sessionsEl = document.getElementById("sessionsCount");
  const paymentsEl = document.getElementById("paymentsTotal");

  if (patientsEl) patientsEl.textContent = patients.length;
  if (sessionsEl) sessionsEl.textContent = sessions.length;

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  if (paymentsEl) paymentsEl.textContent = totalPaid + " ₪";
}

document.addEventListener("DOMContentLoaded", loadDashboard);
