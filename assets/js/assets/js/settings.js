const form = document.getElementById("settingsForm");
const input = document.getElementById("paymentPin");

form.addEventListener("submit", e => {
  e.preventDefault();

  if (input.value.length < 4) {
    alert("الرمز لازم يكون 4 أرقام على الأقل");
    return;
  }

  localStorage.setItem("payments_pin", input.value);
  alert("تم حفظ الرمز السري بنجاح ✅");
  input.value = "";
});
