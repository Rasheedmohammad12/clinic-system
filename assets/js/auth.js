// assets/js/auth.js
const USERS_KEY = "clinic_users_v1";
const SESSION_KEY = "clinic_session_v1";

// ----- helpers -----
function loadUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  if (raw) return JSON.parse(raw);

  // أول مرة: اعمل Admin افتراضي
  const seed = [
    { id: Date.now(), username: "admin", password: "admin123", role: "admin", createdAt: new Date().toISOString() }
  ];
  localStorage.setItem(USERS_KEY, JSON.stringify(seed));
  return seed;
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
  window.location.href = "index.html";
}

// ----- register / login -----
export function registerUser({ username, password, role }) {
  username = (username || "").trim();
  password = (password || "").trim();
  role = (role || "reception").trim();

  if (username.length < 3) throw new Error("اسم المستخدم لازم يكون 3 أحرف أو أكثر");
  if (password.length < 4) throw new Error("كلمة السر لازم تكون 4 أحرف أو أكثر");

  const users = loadUsers();
  const exists = users.some(u => u.username.toLowerCase() === username.toLowerCase());
  if (exists) throw new Error("اسم المستخدم موجود بالفعل");

  const user = {
    id: Date.now(),
    username,
    password,
    role, // admin | doctor | reception
    createdAt: new Date().toISOString()
  };

  users.push(user);
  saveUsers(users);
  return user;
}

export function loginUser({ username, password }) {
  username = (username || "").trim();
  password = (password || "").trim();

  const users = loadUsers();
  const user = users.find(u =>
    u.username.toLowerCase() === username.toLowerCase() && u.password === password
  );

  if (!user) throw new Error("بيانات الدخول غير صحيحة");

  // session
  const session = { id: user.id, username: user.username, role: user.role, loginAt: new Date().toISOString() };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

/**
 * حماية صفحة:
 * - إذا مش عامل Login -> يرجع لـ index.html
 * - وإذا الصفحة تحتاج role معين -> يمنع الدخول
 * allowedRoles: array مثل ["admin"] أو ["admin","reception"]
 */
export function requireAuth(allowedRoles = null) {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      alert("ليس لديك صلاحية للوصول لهذه الصفحة");
      window.location.href = "dashboard.html";
      return;
    }
  }
}
