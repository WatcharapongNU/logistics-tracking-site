async function getCustomers() {
  const res = await fetch("/logistics-tracking-site/Database/customers.json");
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

async function renderCustomerTable() {
  const customers = await getCustomers();

  const search = document.getElementById("search").value.trim().toLowerCase();

  const searchCustomer = customers.filter(
    (e) =>
      e.name.toLowerCase().includes(search) ||
      e.email.toLowerCase().includes(search) ||
      e.phone.toLowerCase().includes(search)
  );

  const customerElement = document.getElementById("customers");
  customerElement.innerHTML = searchCustomer
    .map(
      (c) => `
      <tr class="vehicle">
        <td>${c.name}</td>
        <td>${c.email}</td>
        <td>${c.phone}</td>
        <td class="action-btn">
          <button class="edit-btn" data-id="${c.phone}">
            <span class="material-symbols-outlined">
              edit_square
            </span>
          </button>
          <button class="delete-btn" data-id="${c.id}">
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

window.addEventListener("DOMContentLoaded", renderCustomerTable);
document
  .getElementById("search")
  .addEventListener("input", renderCustomerTable);