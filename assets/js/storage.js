/* ===============================
   Clinic System - Local Storage
   =============================== */

const DB_KEY = "clinic_system_db";

/* ---------- قاعدة البيانات ---------- */
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

/* ===============================
   المرضى
   =============================== */
function addPatient(name, phone) {
  const db = getDB();
  db.patients.push({
    id: Date.now(),
    name,
    phone
  });
  saveDB(db);
}

function getPatients() {
  return getDB().patients;
}

function deletePatient(id) {
  const db = getDB();
  db.patients = db.patients.filter(p => p.id !== id);
  db.sessions = db.sessions.filter(s => s.patientId !== id);
  db.payments = db.payments.filter(p => p.patientId !== id);
  saveDB(db);
}

/* ===============================
   الجلسات
   =============================== */
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

function deleteSession(id) {
  const db = getDB();
  db.sessions = db.sessions.filter(s => s.id !== id);
  saveDB(db);
}

/* ===============================
   المدفوعات (تشمل استلام المبالغ)
   =============================== */
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

function deletePayment(id) {
  const db = getDB();
  db.payments = db.payments.filter(p => p.id !== id);
  saveDB(db);
}

/* ===============================
   الإحصائيات (Dashboard)
   =============================== */
function getDashboardStats() {
  const db = getDB();

  const totalPatients = db.patients.length;
  const totalSessions = db.sessions.length;

  const totalPayments = db.payments.reduce(
    (sum, p) => sum + Number(p.amount),
    0
  );

  return {
    totalPatients,
    totalSessions,
    totalPayments
  };
}

/* ===============================
   كشف حساب مريض
   =============================== */
function getPatientReport(patientId) {
  const db = getDB();

  const sessions = db.sessions.filter(s => s.patientId == patientId);
  const payments = db.payments.filter(p => p.patientId == patientId);

  const totalSessionsCost = sessions.reduce(
    (sum, s) => sum + Number(s.cost),
    0
  );

  const totalPaid = payments.reduce(
    (sum, p) => sum + Number(p.amount),
    0
  );

  const remaining = totalSessionsCost - totalPaid;

  return {
    sessions,
    payments,
    totalSessionsCost,
    totalPaid,
    remaining
  };
}
