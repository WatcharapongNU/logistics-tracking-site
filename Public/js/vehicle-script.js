import { vehicleStatusStyle } from "/logistics-tracking-site/Public/js/status.js";

async function getEmployees() {
  const res = await fetch("/logistics-tracking-site/Database/employeees.json");
  return await res.json();
}

async function getVehicles() {
  const res = await fetch("/logistics-tracking-site/Database/vehicles.json");
  return await res.json();
}

const logout = document.getElementById("logout");
logout.addEventListener("click", () => {
  localStorage.removeItem("empName");
  localStorage.removeItem("empRole");
  localStorage.removeItem("empId");
  window.location.href = "/logistics-tracking-site/Views/sign-in.html";
});

const vehicleForm = document.querySelector(".vehicle-form");
const switchBtn = document.getElementById("switch-btn");

switchBtn.addEventListener("click", () => {
  vehicleForm.classList.toggle("active");
  document.getElementById("vehicle-form").reset();
});

async function renderDriverOptions() {
  const results = await getEmployees();

  const drivers = results.filter(r => r.role === "driver")

  const driversElement = document.getElementById("driver");
  driversElement.innerHTML = drivers.map(
    (d) => `<option value="${d.id}">${d.name}</option>`
  );
}

window.addEventListener("DOMContentLoaded", renderDriverOptions);

async function renderVehicleTable() {
  const vehicles = await getVehicles();

  const search = document.getElementById("search").value.trim().toLowerCase();

  const searchVehicle = vehicles.filter(
    (v) =>
      v.driver.name.toLowerCase().includes(search) ||
      v.license_plate.toLowerCase().includes(search)
  );

  const vehicleElement = document.getElementById("vehicles");
  vehicleElement.innerHTML = searchVehicle
    .map(
      (v) => `
      <tr class="vehicle">
        <td>${v.driver.name}</td>
        <td>${vehicleStatusStyle(v.status)}</td>
        <td>${v.capacity}</td>
        <td>${v.license_plate}</td>
        <td class="action-btn">
          <button class="edit-btn" data-id="${v.id}">
            <span class="material-symbols-outlined">
              edit_square
            </span>
          </button>
          <button class="delete-btn" data-id="${v.id}">
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
      vehicleForm.classList.toggle("active");
    });
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
    });
  });
}

window.addEventListener("DOMContentLoaded", renderVehicleTable);
document.getElementById("search").addEventListener("input", renderVehicleTable);
