const DB_KEY = "clinic_system_db";

function getDB() {
  const data = localStorage.getItem(DB_KEY);
  if (data) return JSON.parse(data);

  const init = {
    patients: [],
    sessions: [],
    payments: []
  };
  localStorage.setItem(DB_KEY, JSON.stringify(init));
  return init;
}

function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

/* ========= المرضى ========= */
function addPatient(name, phone) {
  const db = getDB();
  db.patients.push({ id: Date.now(), name, phone });
  saveDB(db);
}

function getPatients() {
  return getDB().patients;
}

/* ========= الجلسات ========= */
function addSession(patientId, date, cost, status = "محجوز") {
  const db = getDB();
  db.sessions.push({
    id: Date.now(),
    patientId,
    date,
    cost: Number(cost),
    status
  });
  saveDB(db);
}

function getSessions() {
  return getDB().sessions;
}

/* ========= المدفوعات (تشمل استلام المبالغ) ========= */
function addPayment(patientId, amount, note = "") {
  const db = getDB();
  db.payments.push({
    id: Date.now(),
    patientId,
    amount: Number(amount),
    note,
    date: new Date().toISOString()
  });
  saveDB(db);
}

function getPayments() {
  return getDB().payments;
}

/* ========= Dashboard ========= */
function getDashboardStats() {
  const db = getDB();
  return {
    patients: db.patients.length,
    sessions: db.sessions.length,
    totalPayments: db.payments.reduce((s, p) => s + p.amount, 0)
  };
}

/* ========= كشف حساب ========= */
function getPatientReport(patientId) {
  const db = getDB();

  const sessions = db.sessions.filter(s => s.patientId == patientId);
  const payments = db.payments.filter(p => p.patientId == patientId);

  const totalSessionsCost = sessions.reduce((s, x) => s + x.cost, 0);
  const totalPaid = payments.reduce((s, x) => s + x.amount, 0);

  return {
    sessions,
    payments,
    totalSessionsCost,
    totalPaid,
    remaining: totalSessionsCost - totalPaid
  };
}
