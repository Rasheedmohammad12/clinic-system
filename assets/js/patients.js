const tbody = document.getElementById("patientsBody");

function renderPatients(){
  const patients = getPatients();
  tbody.innerHTML = "";

  patients.forEach(p=>{
    const paid = getTotalPaidForPatient(p.id);
    const remaining = Math.max(0,(p.totalAmount||0)-paid);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.name}</td>
      <td>${p.phone}</td>
      <td>
        <input type="number" value="${p.totalAmount||0}"
          onchange="updateTotal(${p.id},this.value)">
      </td>
      <td>${paid}</td>
      <td>${remaining}</td>
      <td class="actions">
        <button class="btn-del" onclick="deletePatient(${p.id})">حذف</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function updateTotal(id,val){
  const db=JSON.parse(localStorage.getItem("clinic_system_db"));
  const p=db.patients.find(x=>x.id===id);
  p.totalAmount=Number(val)||0;
  localStorage.setItem("clinic_system_db",JSON.stringify(db));
  renderPatients();
}

function deletePatient(id){
  if(!confirm("حذف المريض؟"))return;
  const db=JSON.parse(localStorage.getItem("clinic_system_db"));
  db.patients=db.patients.filter(p=>p.id!==id);
  localStorage.setItem("clinic_system_db",JSON.stringify(db));
  renderPatients();
}

document.addEventListener("DOMContentLoaded",renderPatients);
