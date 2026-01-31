document.addEventListener("DOMContentLoaded", () => {

  const body = document.getElementById("patientsTableBody");

  // نفس التخزين المستخدم في النظام
  const STORAGE_KEY = "patients";

  let patients = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  function save(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
  }

  function render(){
    body.innerHTML = "";

    if(!patients.length){
      body.innerHTML = `
        <tr>
          <td colspan="9">لا يوجد مرضى</td>
        </tr>
      `;
      return;
    }

    patients.forEach((p, index) => {

      const paid = Number(p.paidAmount || 0);
      const total = Number(p.totalAmount || 0);
      const remaining = total - paid;

      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td contenteditable onblur="update(${index}, 'name', this.innerText)">${p.name || ""}</td>
        <td contenteditable onblur="update(${index}, 'sessionType', this.innerText)">${p.sessionType || ""}</td>
        <td contenteditable onblur="update(${index}, 'paidAmount', this.innerText)">${paid}</td>
        <td>${remaining}</td>
        <td contenteditable onblur="update(${index}, 'fileNumber', this.innerText)">${p.fileNumber || ""}</td>
        <td contenteditable onblur="update(${index}, 'sessionsCount', this.innerText)">${p.sessionsCount || ""}</td>
        <td contenteditable onblur="update(${index}, 'paymentMethod', this.innerText)">${p.paymentMethod || ""}</td>
        <td contenteditable onblur="update(${index}, 'note', this.innerText)">${p.note || ""}</td>
        <td contenteditable onblur="update(${index}, 'sessionHandler', this.innerText)">${p.sessionHandler || ""}</td>
      `;

      body.appendChild(tr);
    });
  }

  window.update = function(index, field, value){
    patients[index][field] = value.trim();
    save();
    render();
  };

  render();
});
