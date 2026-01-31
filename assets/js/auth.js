document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("loginForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    // 🔐 جلب المستخدمين المسجلين
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // 🔎 البحث عن المستخدم
    const user = users.find(
      u => u.email === email && u.password === password
    );

    if (!user) {
      alert("بيانات الدخول غير صحيحة");
      return;
    }

    // ✅ تسجيل الدخول
    localStorage.setItem("loggedInUser", user.email);
    localStorage.setItem("loggedIn", "true");

    // تحويل للداشبورد
    window.location.href = "dashboard.html";
  });

});
