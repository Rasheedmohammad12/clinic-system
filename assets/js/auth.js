/* ===============================
   AUTH SYSTEM (LOGIN + REGISTER)
================================ */

// ---------- Helpers ----------
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

export function getCurrentUser() {
  const email = localStorage.getItem("loggedInUser");
  if (!email) return null;

  const users = getUsers();
  return users.find(u => u.email === email) || null;
}

export function requireAuth() {
  if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "index.html";
  }
}

export function logout() {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("loggedIn");
  window.location.href = "index.html";
}

// ---------- LOGIN ----------
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      alert("بيانات الدخول غير صحيحة");
      return;
    }

    localStorage.setItem("loggedInUser", user.email);
    localStorage.setItem("loggedIn", "true");

    window.location.href = "dashboard.html";
  });
}

// ---------- REGISTER ----------
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", e => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!name || !email || !password) {
      alert("يرجى تعبئة جميع الحقول");
      return;
    }

    const users = getUsers();

    if (users.some(u => u.email === email)) {
      alert("هذا البريد مستخدم");
      return;
    }

    const isFirstUser = users.length === 0;

    const newUser = {
      id: Date.now(),
      username: name,
      email,
      password,
      role: isFirstUser ? "admin" : "user"
    };

    users.push(newUser);
    saveUsers(users);

    alert("تم إنشاء الحساب");
    window.location.href = "index.html";
  });
}
