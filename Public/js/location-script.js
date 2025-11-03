import { locationTypeStyle } from "/logistics-tracking-site/Public/js/type.js";

async function getLocations() {
  const res = await fetch("/logistics-tracking-site/Database/locations.json");
  return await res.json();
}

const logout = document.getElementById("logout");
logout.addEventListener("click", () => {
  localStorage.removeItem("empName");
  localStorage.removeItem("empRole");
  localStorage.removeItem("empId");
  window.location.href = "/logistics-tracking-site/Views/sign-in.html";
});

const locationForm = document.querySelector(".location-form");
const switchBtn = document.getElementById("switch-btn");

switchBtn.addEventListener("click", () => {
  locationForm.classList.toggle("active");
  document.getElementById("location-form").reset();
});

async function renderLocationTable() {
  const locations = await getLocations();

  const search = document.getElementById("search").value.trim().toLowerCase();

  const searchLocation = locations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(search) ||
      loc.address.toLowerCase().includes(search)
  );

  const locationElement = document.getElementById("locations");
  locationElement.innerHTML = searchLocation
    .map(
      (loc) => `
      <tr class="location">
        <td>${loc.name}</td>
        <td>${loc.address}</td>
        <td>${loc.contact}</td>
        <td>${locationTypeStyle(loc.type)}</td>
        <td class="action-btn">
          <button class="edit-btn" data-id="${loc.id}">
            <span class="material-symbols-outlined">
              edit_square
            </span>
          </button>
          <button class="delete-btn" data-id="${loc.id}">
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
      locationForm.classList.toggle("active");
    });
  });
}

window.addEventListener("DOMContentLoaded", renderLocationTable);
document
  .getElementById("search")
  .addEventListener("input", renderLocationTable);
