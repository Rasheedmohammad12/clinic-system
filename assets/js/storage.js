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

// Patients
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

// Sessions
function addSession(patientId, cost) {
  const db = getDB();
  db.sessions.push({
    id: Date.now(),
    patientId,
    cost: Number(cost)
  });
  saveDB(db);
}

function getSessions() {
  return getDB().sessions;
}

// Payments
function addPayment(amount) {
  const db = getDB();
  db.payments.push({
    id: Date.now(),
    amount: Number(amount)
  });
  saveDB(db);
}

function getPayments() {
  return getDB().payments;
}
