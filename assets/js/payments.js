const tableBody = document.getElementById("paymentsTable");

function renderPayments() {
  const payments = getPayments();
  const patients = getPatients();

  tableBody.innerHTML = "";

  if (payments.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5">—</td></tr>`;
    return;
  }

  payments.forEach((p, i) => {
    const patient = patients.find(pt => pt.id == p.patientId);
    tableBody.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${patient ? patient.name : "-"}</td>
        <td>${formatCurrency(p.amount)}</td>
        <td>${p.note || "-"}</td>
        <td>${new Date(p.date).toLocaleDateString()}</td>
      </tr>`;
  });
}

document.addEventListener("DOMContentLoaded", renderPayments);
