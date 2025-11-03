import { routeStatusStyle, statusStyle } from "/logistics-tracking-site/Public/js/status.js";


async function getVehicles() {
  const res = await fetch("/logistics-tracking-site/Database/vehicles.json");
  return await res.json();
}

async function getLocations() {
  const res = await fetch("/logistics-tracking-site/Database/locations.json");
  return await res.json();
}

async function getRoutes() {
  const res = await fetch("/logistics-tracking-site/Database/routes.json");
  return await res.json();
}

async function getParcels() {
  const res = await fetch("/logistics-tracking-site/Database/parcels.json");
  return await res.json();
}

const logout = document.getElementById("logout");
logout.addEventListener("click", () => {
  localStorage.removeItem("empName");
  localStorage.removeItem("empRole");
  localStorage.removeItem("empId");
  window.location.href = "/logistics-tracking-site/Views/sign-in.html";
});

const routeForm = document.querySelector(".route-form");
const switchBtn = document.getElementById("switch-btn");

switchBtn.addEventListener("click", () => {
  routeForm.classList.toggle("active");
  document.getElementById("route-form").reset();
});

async function renderVehicleOptions() {
  const vehicles = await getVehicles();

  const vehiclesElement = document.getElementById("vehicle");
  vehiclesElement.innerHTML = vehicles.map(
    (v) => `<option value="${v.id}">${v.license_plate}</option>`
  );
}
window.addEventListener("DOMContentLoaded", renderVehicleOptions);

async function renderLocationOptions() {
  const locations = await getLocations();

  const originElement = document.getElementById("origin");
  const destinationElement = document.getElementById("destination");

  originElement.innerHTML = locations.map(
    (l) => `<option value="${l.id}">${l.name + " - " + l.address}</option>`
  );

  destinationElement.innerHTML = locations.map(
    (l) => `<option value="${l.id}">${l.name + " - " + l.address}</option>`
  );
}
window.addEventListener("DOMContentLoaded", renderLocationOptions);

const popup = document.getElementById("popupModal");
const closeModal = document.getElementById("close-btn");

closeModal.addEventListener("click", () => {
  popup.style.display = "none";
});

function formatEstimatedTime(minutes) {
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);

  if (hrs > 0 && mins > 0) {
    return `${hrs}hr ${mins}min`;
  } else if (hrs > 0) {
    return `${hrs}hr`;
  } else {
    return `${mins}min`;
  }
}

async function renderRouteTable() {
  const routes = await getRoutes();

  const search = document
    .getElementById("route-search")
    .value.trim()
    .toLowerCase();

  const searchRoute = routes.filter(
    (r) =>
      r.vehicle.license_plate.toLowerCase().includes(search) ||
      r.origin.address.toLowerCase().includes(search) ||
      r.destination.address.toLowerCase().includes(search)
  );

  const routeElement = document.getElementById("routes");
  routeElement.innerHTML = searchRoute
    .map(
      (r) => `
      <tr class="route">
        <td>${r.vehicle.license_plate}</td>
        <td>${r.vehicle.capacity}</td>
        <td>${r.distance / 1000 + "km"}</td>
        <td>${formatEstimatedTime(r.estimated_time)}</td>
        <td>${routeStatusStyle(r.status)}</td>
        <td>${r.origin.address}</td>
        <td>${r.destination.address}</td>
        <td class="action-btn">
          <button class="edit-btn" data-id="${r.id}">
            <span class="material-symbols-outlined">
              edit_square
            </span>
          </button>
          <button class="delete-btn" data-id="${r.id}">
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
      const id = e.currentTarget.dataset.id;
      handleEditRoute(id);
      routeForm.classList.toggle("active");
    });
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id;
      handleDeleteRoute(id);
    });
  });
}

window.addEventListener("DOMContentLoaded", renderRouteTable);
document
  .getElementById("route-search")
  .addEventListener("input", renderRouteTable);

// Parcel Route Assignment
async function renderParcelTable() {
  const parcels = await getParcels();

  const search = document
    .getElementById("parcel-search")
    .value.trim()
    .toLowerCase();

  const searchParcel = parcels.filter(
    (p) =>
      p.id.toLowerCase().includes(search) ||
      p.sender.name.toLowerCase().includes(search) ||
      p.receiver.name.toLowerCase().includes(search)
  );

  const tbody = document.getElementById("parcels");
  tbody.innerHTML = searchParcel
    .map(
      (p) => `
            <tr class="parcel">
                <td>${p.id}</td>
                <td>${statusStyle(p.status)}</td>
                <td>${p.origin.name}</td>
                <td>${p.destination.name}</td>
                <td class="action-btn">
                  <button class="detail-btn" data-id="${p.id}">
                    <span class="material-symbols-outlined">
                      assignment
                    </span>
                  </button>
                </td>
            </tr>
        `
    )
    .join("");

  document.querySelectorAll(".detail-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      popup.style.display = "flex";
    });
  });
}

window.addEventListener("DOMContentLoaded", renderParcelTable);
document
  .getElementById("parcel-search")
  .addEventListener("input", renderParcelTable);

// Route list
async function renderRouteOptions() {
  const routes = await getRoutes();

  const routeElement = document.getElementById("route-options");
  routeElement.innerHTML = routes
    .map(
      (r) => `
        <option value="${r.id}">${r.vehicle.license_plate} - ${r.origin.name + " | " + r.origin.address} to -> ${r.destination.name + " | " +  r.destination.address}</option>
    `
    )
    .join("");
}
window.addEventListener("DOMContentLoaded", renderRouteOptions);