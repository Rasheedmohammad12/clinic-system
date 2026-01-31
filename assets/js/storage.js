/* ===============================
   STORAGE SYSTEM (STABLE)
================================ */

function getUserId() {
  return localStorage.getItem("loggedInUser");
}

/* ====== PATIENTS ====== */
function getPatients() {
  const uid = getUserId();
  return JSON.parse(localStorage.getItem(`patients_${uid}`)) || [];
}

function savePatients(patients) {
  const uid = getUserId();
  localStorage.setItem(`patients_${uid}`, JSON.stringify(patients));
}

function addPatient(name, fileNumber = "") {
  const patients = getPatients();
  patients.push({
    id: Date.now(),
    name,
    fileNumber
  });
  savePatients(patients);
}

/* ====== PAYMENTS ====== */
function getPayments() {
  const uid = getUserId();
  return JSON.parse(localStorage.getItem(`payments_${uid}`)) || [];
}

function savePayments(payments) {
  const uid = getUserId();
  localStorage.setItem(`payments_${uid}`, JSON.stringify(payments));
}

function addPayment(patientId, amount, note = "") {
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
function getDashboardStats() {
  const patients = getPatients();
  const payments = getPayments();
  return {
    patients: patients.length,
    totalPayments: payments.reduce((s, p) => s + p.amount, 0)
  };
}
