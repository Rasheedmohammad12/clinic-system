document.addEventListener("DOMContentLoaded", () => {

  const body = document.getElementById("patientsTableBody");

  // نفس التخزين المستخدم في النظام
  const patients =
    JSON.parse(localStorage.getItem("patients")) ||
    JSON.parse(localStorage.getItem("clinic_patients")) ||
    [];

  if (!patients.length) {
    body.innerHTML = `
      <tr>
        <td colspan="9" style="text-align:center;">لا يوجد مرضى</td>
      </tr>
    `;
    return;
  }

  patients.forEach(p => {

    const paid = Number(p.paidAmount || 0);
    const total = Number(p.totalAmount || 0);
    const remaining = total - paid;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.name || ""}</td>
      <td>${p.sessionType || ""}</td>
      <td>${paid}</td>
      <td>${remaining}</td>
      <td>${p.fileNumber || ""}</td>
      <td>${p.sessionsCount || ""}</td>
      <td>${p.paymentMethod || ""}</td>
      <td>${p.note || ""}</td>
      <td>${p.sessionHandler || ""}</td>
    `;

    body.appendChild(tr);
  });
});
