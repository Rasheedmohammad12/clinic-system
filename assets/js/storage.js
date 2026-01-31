import { getCurrentUser } from "./auth.js";

/* ===============================
   STORAGE (PER USER)
================================ */

function getUser() {
  const u = getCurrentUser();
  if (!u) throw new Error("User not logged in");
  return u;
}

/* ====== PATIENTS ====== */
export function getPatients() {
  const user = getUser();
  return JSON.parse(localStorage.getItem(`patients_${user.id}`)) || [];
}

export function savePatients(patients) {
  const user = getUser();
  localStorage.setItem(`patients_${user.id}`, JSON.stringify(patients));
}

export function addPatient(name, fileNumber = "") {
  const patients = getPatients();
  patients.push({
    id: Date.now(),
    name,
    fileNumber
  });
  savePatients(patients);
}

/* ====== PAYMENTS ====== */
export function getPayments() {
  const user = getUser();
  return JSON.parse(localStorage.getItem(`payments_${user.id}`)) || [];
}

export function savePayments(payments) {
  const user = getUser();
  localStorage.setItem(`payments_${user.id}`, JSON.stringify(payments));
}

export function addPayment(patientId, amount, note = "") {
  const payments = getPayments();

  payments.push({
    id: Date.now(),
    patientId,
    amount: Number(amount),
    note,
    date: new Date().toISOString()
  });

  savePayments(payments);
}

/* ====== DASHBOARD ====== */
export function getDashboardStats() {
  const patients = getPatients();
  const payments = getPayments();

  return {
    patients: patients.length,
    totalPayments: payments.reduce((s, p) => s + p.amount, 0)
  };
}
