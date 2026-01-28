const form=document.getElementById("sessionForm");
const select=document.getElementById("patientSelect");
const table=document.getElementById("sessionsTable");

function loadPatients(){
  select.innerHTML="";
  getPatients().forEach(p=>{
    select.innerHTML+=`<option value="${p.id}">${p.name}</option>`;
  });
}

function renderSessions(){
  const db=JSON.parse(localStorage.getItem("clinic_system_db"));
  table.innerHTML="";
  db.sessions.forEach((s,i)=>{
    const patient=db.patients.find(p=>p.id==s.patientId);
    table.innerHTML+=`
    <tr>
      <td>${i+1}</td>
      <td>${patient?.name||""}</td>
      <td>${s.date}</td>
      <td>${s.cost}</td>
      <td style="color:${s.status==='تم'?'green':s.status==='ملغي'?'red':'orange'}">
        ${s.status}
      </td>
      <td><button onclick="deleteSession(${s.id})">🗑️</button></td>
    </tr>`;
  });
}

form.onsubmit=e=>{
  e.preventDefault();
  const db=JSON.parse(localStorage.getItem("clinic_system_db"));
  db.sessions.push({
    id:Date.now(),
    patientId:patientSelect.value,
    date:sessionDate.value,
    cost:Number(sessionCost.value),
    status:sessionStatus.value
  });
  localStorage.setItem("clinic_system_db",JSON.stringify(db));
  form.reset();
  renderSessions();
};

function deleteSession(id){
  const db=JSON.parse(localStorage.getItem("clinic_system_db"));
  db.sessions=db.sessions.filter(s=>s.id!==id);
  localStorage.setItem("clinic_system_db",JSON.stringify(db));
  renderSessions();
}

document.addEventListener("DOMContentLoaded",()=>{
  loadPatients();
  renderSessions();
});
