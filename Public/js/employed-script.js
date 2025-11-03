async function getEmployees() {
  const res = await fetch("/logistics-tracking-site/Database/employeees.json");
  return await res.json();
}

const logout = document.getElementById("logout");
logout.addEventListener("click", () => {
  localStorage.removeItem("empName");
  localStorage.removeItem("empRole");
  localStorage.removeItem("empId");
  window.location.href = "/logistics-tracking-site/Views/sign-in.html";
});

const popup = document.getElementById("popupModal");
const closeModal = document.getElementById("close-btn");

closeModal.addEventListener("click", () => {
  popup.style.display = "none";
});

async function renderEmployeeTable() {
  const employees = await getEmployees();

  const search = document.getElementById("search").value.trim().toLowerCase();

  const searchEmployee = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search) ||
      e.email.toLowerCase().includes(search) ||
      e.phone.toLowerCase().includes(search)
  );

  const employeeElement = document.getElementById("employees");
  employeeElement.innerHTML = searchEmployee
    .map(
      (e) => `
      <tr class="vehicle">
        <td>${e.name}</td>
        <td>${e.role}</td>
        <td>${e.email}</td>
        <td>${e.phone}</td>
        <td class="action-btn">
          <button class="edit-btn" data-id="${e.id}">
            <span class="material-symbols-outlined">
              edit_square
            </span>
          </button>
          <button class="delete-btn" data-id="${e.id}">
            <span class="material-symbols-outlined">
              delete_forever
            </span>
          </button>
        </td>
      </tr>
      `
    )
    .join("");

  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      popup.style.display = "flex";
    });
  });
}

window.addEventListener("DOMContentLoaded", renderEmployeeTable);
document.getElementById("search").addEventListener("input", renderEmployeeTable);