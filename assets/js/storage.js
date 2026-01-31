/* ===============================
   STORAGE SYSTEM (MODULE)
================================ */

function getUserId() {
  return localStorage.getItem("loggedInUser");
}

/* ====== PATIENTS ====== */
export function getPatients() {
  const uid = getUserId();
  return JSON.parse(localStorage.getItem(`patients_${uid}`)) || [];
}

export function savePatients(patients) {
  const uid = getUserId();
  localStorage.setItem(`patients_${uid}`, JSON.stringify(patients));
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
  const uid = getUserId();
  return JSON.parse(localStorage.getItem(`payments_${uid}`)) || [];
}

export function savePayments(payments) {
  const uid = getUserId();
  localStorage.setItem(`payments_${uid}`, JSON.stringify(payments));
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
