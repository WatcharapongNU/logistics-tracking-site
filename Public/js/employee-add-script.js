import { setupEmployeeHeader } from "/logistics-tracking-site/Public/js/employee-common.js";

setupEmployeeHeader();

function setupSearch(buttonClass, prefix) {
  const button = document.querySelector(buttonClass);
  if (!button) return;

  button.addEventListener("click", async () => {
    const input = document.getElementById(`${prefix}-input`);
    if (!input) return;

    const phone = input.value.trim();
    if (!phone) {
      alert(`กรุณากรอกเบอร์โทร ${prefix} ก่อนค้นหา`);
      return;
    }

    const customer = await getCustomerByPhone(phone);
    if (customer) {
      document.getElementById(`${prefix}-name`).value = customer.name || "";
      document.getElementById(`${prefix}-email`).value = customer.email || "";
      document.getElementById(`${prefix}-phone`).value = customer.phone || "";
      await renderLocList(customer.phone, prefix);
    } else {
      alert(`ไม่พบข้อมูลลูกค้า ${prefix}`);
    }
  });
}

async function renderLocList(phone, prefix) {
  const locations = await getLocationByContact(phone);
  const div = document.getElementById(`${prefix}-loc-list`);
  if (!div) return;

  if (!locations || locations.length === 0) {
    div.innerHTML = `<p>ไม่พบที่อยู่ของลูกค้า ${prefix}</p>`;
    return;
  }

  div.innerHTML = locations
    .map(
      (loc) => `
      <tr>
        <td>
          <input type="radio" name="${prefix}-location"
                 data-name="${loc.name}" data-address="${loc.address}" data-type="${loc.type}">
        </td>
        <td>${loc.name}</td>
        <td>${loc.address}</td>
        <td>${loc.contact}</td>
        <td>${loc.type}</td>
      </tr>
    `
    )
    .join("");

  div.querySelectorAll(`input[name="${prefix}-location"]`).forEach((radio) => {
    radio.addEventListener("change", () => {
      document.getElementById(`${prefix}-address-name`).value =
        radio.dataset.name;
      document.getElementById(`${prefix}-address`).value =
        radio.dataset.address;
      document.getElementById(`${prefix}-address-type`).value =
        radio.dataset.type;
    });
  });
}

setupSearch(".search-sender", "sender");
setupSearch(".search-receiver", "receiver");

document
  .getElementById("submit-parcel")
  ?.addEventListener("click", async (event) => {
    event.preventDefault();

    const payload = {
      parcel_input: {
        type: document.getElementById("parcel-type").value,
        weight: document.getElementById("parcel-weight").value,
        status: "pending",
      },
      customer_input: [
        {
          name: document.getElementById("sender-name").value,
          email: document.getElementById("sender-email").value,
          phone: document.getElementById("sender-phone").value,
        },
        {
          name: document.getElementById("receiver-name").value,
          email: document.getElementById("receiver-email").value,
          phone: document.getElementById("receiver-phone").value,
        },
      ],
      location_input: [
        {
          name: document.getElementById("sender-address-name").value,
          contact: document.getElementById("sender-phone").value,
          address: document.getElementById("sender-address").value,
          type: document.getElementById("sender-address-type").value,
        },
        {
          name: document.getElementById("receiver-address-name").value,
          contact: document.getElementById("receiver-phone").value,
          address: document.getElementById("receiver-address").value,
          type: document.getElementById("receiver-address-type").value,
        },
      ],
      employee: { id: localStorage.getItem("empId") },
    };

    const data = await insertParcel(payload);
    alert(data.message);
    document.getElementById("form-panel").reset();
    window.location.href = "/logistics-tracking-site/Views/employee/parcel.html";
  });
