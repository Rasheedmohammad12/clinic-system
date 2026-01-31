import { getCurrentUser } from "./auth.js";

function getDB(){
  const user = getCurrentUser();
  const KEY = `clinic_system_db_${user.id}`;

  const data = localStorage.getItem(KEY);
  if (data) return JSON.parse(data);

  const init = {
    patients: [],
    sessions: [],
    payments: []
  };
  localStorage.setItem(KEY, JSON.stringify(init));
  return init;
}

function saveDB(db){
  const user = getCurrentUser();
  const KEY = `clinic_system_db_${user.id}`;
  localStorage.setItem(KEY, JSON.stringify(db));
}

/* ========= المرضى ========= */
function addPatient(name, phone=""){
  const db = getDB();
  db.patients.push({ id: Date.now(), name, phone });
  saveDB(db);
}

function getPatients(){
  return getDB().patients;
}

/* ========= المدفوعات ========= */
function addPayment(patientId, amount, note=""){
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

function getPayments(){
  return getDB().payments;
}

/* ========= Dashboard ========= */
function getDashboardStats(){
  const db = getDB();
  return {
    patients: db.patients.length,
    sessions: db.sessions.length,
    totalPayments: db.payments.reduce((s,p)=>s+p.amount,0)
  };
}
