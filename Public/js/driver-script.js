const logout = document.getElementById("logout");
logout.addEventListener("click", () => {
  localStorage.removeItem("empName");
  localStorage.removeItem("empRole");
  localStorage.removeItem("empId");
  window.location.href = "/logistics-tracking-site/Views/sign-in.html";
});

async function getParcelRoutes() {
  const res = await fetch("/logistics-tracking-site/Database/parcel_routes.json");
  return await res.json();
}

async function renderParcelTable() {
  const parcels = await getParcelRoutes();
  console.log(parcels);
  const filterParcels = parcels.filter((p) => p.route.status !== "completed");

  const search = document.getElementById("search-parcel");
  const searchParcel = filterParcels.filter((p) =>
    p.parcel_id.toLowerCase().includes(search.value.toLowerCase())
  );

  const tbody = document.getElementById("tracking-info");
  tbody.innerHTML = searchParcel
    .map(
      (p) => `
            <div class="parcel">
                <h1>Parcel ID: ${p.parcel_id}</h1>
                <span>From: ${
                  p.route.origin.name + " | " + p.route.origin.address
                }</span>
                <span>To: ${
                  p.route.destination.name + " | " + p.route.destination.address
                }</span>
                <div class="action-btn">
                  <button 
                    class="cancel-btn" 
                    data-id="${p.parcel_id}"
                    data-route="${p.route_id}"
                    data-location="${p.route.destination_id}"
                    data-status="failed"
                  >
                    Cancel
                  </button>
                  <button 
                    class="complete-btn" 
                    data-id="${p.parcel_id}" 
                    data-route="${p.route_id}"
                    data-location="${p.route.destination_id}"
                  >
                      Delivered
                  
                  </button>
                </div>
            </div>
        `
    )
    .join("");
}

window.addEventListener("DOMContentLoaded", renderParcelTable);
document
  .getElementById("search-parcel")
  .addEventListener("input", renderParcelTable);
