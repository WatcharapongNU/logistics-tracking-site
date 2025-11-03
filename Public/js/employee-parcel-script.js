import { statusStyle } from "/logistics-tracking-site/Public/js/status.js";
import { setupEmployeeHeader } from "/logistics-tracking-site/Public/js/employee-common.js";

setupEmployeeHeader();

async function getParcels() {
  const res = await fetch("/logistics-tracking-site/Database/parcels.json");
  return await res.json();
}

async function renderParcelTable() {
  const tbody = document.getElementById("parcels");
  const search = document.getElementById("search-parcel");
  if (!tbody || !search) return;

  const parcels = await getParcels();
  const searchValue = search.value?.toLowerCase() || "";

  const filtered = parcels.filter(
    (p) =>
      p.id.toLowerCase().includes(searchValue) ||
      p.sender.phone.includes(searchValue) ||
      p.receiver.phone.includes(searchValue)
  );

  tbody.innerHTML =
    filtered.length > 0
      ? filtered
          .map(
            (p) => `
        <tr class="parcel">
          <td>${p.id}</td>
          <td>${p.type}</td>
          <td>${p.weight}</td>
          <td>${statusStyle(p.status)}</td>
          <td>${p.sender.name}</td>
          <td>${p.receiver.name}</td>
        </tr>
      `
          )
          .join("")
      : `<tr><td colspan="6" style="text-align:center;">ไม่พบพัสดุ</td></tr>`;
}

window.addEventListener("DOMContentLoaded", () => {
  renderParcelTable();

  const search = document.getElementById("search-parcel");
  if (search) {
    search.addEventListener("input", renderParcelTable);
  }
});
