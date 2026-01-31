// REGISTER
document.getElementById("registerForm")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const user = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  };

  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("loggedIn", "true");

  window.location.href = "dashboard.html";
});

// LOGIN
document.getElementById("loginForm")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const savedUser = JSON.parse(localStorage.getItem("user"));
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (savedUser && email === savedUser.email && password === savedUser.password) {
    localStorage.setItem("loggedIn", "true");
    window.location.href = "dashboard.html";
  } else {
    alert("بيانات الدخول غير صحيحة");
  }
});

// LOGOUT (اختياري)
function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "index.html";
}
