function actionLabel(action) {
  const actions = {
    received: "Received",
    in_transit: "In Transit",
    arrived_warehouse: "Arrived Warehouse",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
    failed: "Failed",
  };

  return actions[action];
}

function revealPanels() {
  document.querySelector(".tracking-status").style.display = "flex";
  document.getElementById("parcel-logs").style.display = "grid";
}

function statusChange(actions) {
  const trackBox1 = document.querySelector(".box1");
  const trackBox2 = document.querySelector(".box2");
  const trackBox3 = document.querySelector(".box3");

  const allActions = Array.isArray(actions) ? actions : [actions];

  [trackBox1, trackBox2, trackBox3].forEach(box => {
    box.style.background = "none";
    box.style.color = "black";
  });

  if (allActions.includes("received")) {
    trackBox1.style.background = "#2a6eb6";
    trackBox1.style.color = "white";
  }

  if (
    allActions.includes("in_transit") ||
    allActions.includes("arrived_warehouse") ||
    allActions.includes("out_for_delivery")
  ) {
    trackBox2.style.background = "#2a6eb6";
    trackBox2.style.color = "white";
  }

  if (allActions.includes("delivered")) {
    trackBox3.style.background = "#2a6eb6";
    trackBox3.style.color = "white";
  }
}


const form = document.getElementById("tracking-form");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const input = document.getElementById("tracking-input");
  const value = input.value;

  if (!value) {
    alert("Not value");
  }

  try {
    const res = await fetch("/logistics-tracking-site/Database/parcel_logs.json");

    const results = await res.json();

    const parcelLogs = results.filter(r => r.parcel_id === value);

    const div = document.getElementById("parcel-logs");
    if (parcelLogs && parcelLogs.length > 0) {
      div.innerHTML = parcelLogs
        .map(
          (pl) => `
            <div class="parcel-logs">
              <span class="material-symbols-outlined" id="log">
                check_circle
              </span>
              <div class="log-info">
                <div class="info">
                  <h1>${actionLabel(pl.action)}</h1>
                  <p>${pl.timestamp || "-"}</p>
                </div>
                <div class="info">
                  <p>${pl.current_location.name || "ไม่พบที่อยู่"}</p>
                  <p>${pl.current_location?.address}</p>
                </div>
              </div>
            </div>
          `
        )
        .join("");
    } else {
      div.innerHTML = `<p style="text-align: center;">ยังไม่มีข้อมูลการเดินทางของพัสดุ</p>`;
    }

    statusChange(parcelLogs.map((pl) => pl.action));
    revealPanels();
  } catch (err) {
    console.log(err);
  }
});
