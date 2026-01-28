const form = document.getElementById("receiveForm");
const patientSelect = document.getElementById("patientSelect");

function loadPatients() {
  const patients = getPatients();
  patientSelect.innerHTML = `<option value="">--</option>`;
  patients.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = p.name;
    patientSelect.appendChild(opt);
  });
}

form.onsubmit = e => {
  e.preventDefault();
  addPayment(
    patientSelect.value,
    Number(amount.value),
    note.value
  );
  alert("Saved");
  form.reset();
};

document.addEventListener("DOMContentLoaded", loadPatients);
