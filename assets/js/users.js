import { requireAuth, registerUser, getCurrentUser } from "./auth.js";

const USERS_KEY = "clinic_users_v1";

// حماية الصفحة: Admin فقط
requireAuth(["admin"]);

const form = document.getElementById("userForm");
const table = document.getElementById("usersTable");

function loadUsers() {
  const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  table.innerHTML = "";

  users.forEach((u, i) => {
    table.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${u.username}</td>
        <td>${u.role}</td>
        <td>
          ${u.role === "admin" ? "—" :
            `<span class="delete" onclick="deleteUser(${u.id})">🗑️</span>`}
        </td>
      </tr>
    `;
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  try {
    registerUser({
      username: username.value,
      password: password.value,
      role: role.value
    });
    form.reset();
    loadUsers();
  } catch (err) {
    alert(err.message);
  }
});

window.deleteUser = function (id) {
  if (!confirm("هل أنت متأكد من حذف المستخدم؟")) return;

  const current = getCurrentUser();
  const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];

  const filtered = users.filter(u => u.id !== id);

  // منع حذف نفسك
  if (!filtered.find(u => u.id === current.id)) {
    alert("لا يمكنك حذف حسابك الحالي");
    return;
  }

  localStorage.setItem(USERS_KEY, JSON.stringify(filtered));
  loadUsers();
};

document.addEventListener("DOMContentLoaded", loadUsers);
