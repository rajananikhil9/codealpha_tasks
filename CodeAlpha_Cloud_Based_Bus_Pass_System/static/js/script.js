// ===============================
// APPLY PASS FORM
// ===============================

const passForm = document.getElementById("passForm");

if (passForm) {
  passForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    try {
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const mobile = document.getElementById("mobile").value;
      const route = document.getElementById("route").value;
      const validity = document.getElementById("validity").value;
      const serviceType = document.getElementById("serviceType").value;

      const totalFare = document
        .getElementById("totalFare")
        .innerText.replace("₹", "");

      const response = await fetch(
        "https://ekuzo8kbn5.execute-api.ap-south-1.amazonaws.com/create-pass",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            mobile,
            route,
            validity,
            serviceType,
            price: totalFare,
          }),
        },
      );

      const data = await response.json();

      document.getElementById("result").innerHTML = `
      <div class="pass-card">

        <h2>🚌 Cloud Bus Pass</h2>

        <p><b>Pass ID:</b> ${data.pass_id}</p>

        <p><b>Name:</b> ${data.name}</p>

        <p><b>Route:</b> ${data.route}</p>

        <p><b>Service Type:</b> ${serviceType}</p>

        <p><b>Validity:</b> ${validity}</p>

        <p><b>Price:</b> ₹${data.price}</p>

        <p><b>Status:</b> ${data.status}</p>

        <img
          src="${data.qr_url}"
          width="220"
        >

      </div>
      `;
    } catch (error) {
      console.error(error);
      alert("Failed to submit application.");
    }
  });
}

// ===============================
// LOAD ROUTES
// ===============================

let routesData = [];

async function loadRoutes() {
  const routeSelect = document.getElementById("route");

  if (!routeSelect) return;

  routeSelect.innerHTML = "<option>Loading Routes...</option>";

  try {
    const response = await fetch(
      "https://ekuzo8kbn5.execute-api.ap-south-1.amazonaws.com/routes",
    );

    routesData = await response.json();

    console.log("Status:", response.status);
    console.log("Routes Data:", routesData);

    routeSelect.innerHTML = '<option value="">Select Route</option>';

    routesData.forEach((route) => {
      routeSelect.innerHTML += `
                <option value="${route.route_name}">
                    ${route.route_name}
                </option>
            `;
    });

    calculateFare();
  } catch (err) {
    console.error(err);

    routeSelect.innerHTML = "<option>Error Loading Routes</option>";
  }
}

document.addEventListener("DOMContentLoaded", loadRoutes);
// ===============================
// PHOTO PREVIEW
// ===============================

function previewPhoto(event) {
  const file = event.target.files[0];

  if (file) {
    const preview = document.getElementById("preview");

    if (preview) {
      preview.src = URL.createObjectURL(file);
    }
  }
}

// ===============================
// FARE CALCULATION
// ===============================

function calculateFare() {
  const routeName = document.getElementById("route").value;

  const validity = document.getElementById("validity").value;

  const serviceType = document.getElementById("serviceType").value;

  const route = routesData.find((r) => r.route_name === routeName);

  if (!route) {
    document.getElementById("baseFare").innerText = "₹0";
    document.getElementById("totalFare").innerText = "₹20";
    return;
  }

  let baseFare = 0;

  switch (validity) {
    case "Daily":
      baseFare = Number(route.daily_fare);
      break;

    case "Weekly":
      baseFare = Number(route.weekly_fare);
      break;

    case "Monthly":
      baseFare = Number(route.monthly_fare);
      break;

    case "Quarterly":
      baseFare = Number(route.monthly_fare) * 3;
      break;

    case "Half Yearly":
      baseFare = Number(route.monthly_fare) * 6;
      break;

    case "Yearly":
      baseFare = Number(route.monthly_fare) * 12;
      break;
  }

  if (serviceType === "Express") {
    baseFare *= 1.25;
  } else if (serviceType === "Deluxe") {
    baseFare *= 1.5;
  }

  baseFare = Math.round(baseFare);

  const serviceFee = 20;

  const totalFare = baseFare + serviceFee;

  document.getElementById("baseFare").innerText = `₹${baseFare}`;

  document.getElementById("totalFare").innerText = `₹${totalFare}`;
}

// ===============================
// EVENT LISTENERS
// ===============================

document.addEventListener("DOMContentLoaded", function () {
  const routeElement = document.getElementById("route");

  const validityElement = document.getElementById("validity");

  const serviceTypeElement = document.getElementById("serviceType");

  if (routeElement) {
    routeElement.addEventListener("change", calculateFare);
  }

  if (validityElement) {
    validityElement.addEventListener("change", calculateFare);
  }

  if (serviceTypeElement) {
    serviceTypeElement.addEventListener("change", calculateFare);
  }

  calculateFare();
});

// ===============================
// TRACK PASS
// ===============================

async function trackPass() {
  const input = document.getElementById("trackInput");

  if (!input) return;

  const passId = input.value.trim();

  const result = document.getElementById("trackResult");

  if (!passId) {
    alert("Enter Pass ID");
    return;
  }

  try {
    const response = await fetch(
      `https://ekuzo8kbn5.execute-api.ap-south-1.amazonaws.com/track/${passId}`,
    );

    const data = await response.json();

    result.innerHTML = `
    <div class="tracking-result">

      <h2>🚌 Cloud Bus Pass</h2>

      <p><b>Pass ID:</b> ${data.pass_id}</p>

      <p><b>Name:</b> ${data.name}</p>

      <p><b>Email:</b> ${data.email}</p>

      <p><b>Mobile:</b> ${data.mobile}</p>

      <p><b>Route:</b> ${data.route}</p>

      <p><b>Validity:</b> ${data.validity}</p>

       <p><b>Service Type:</b> ${data.serviceType || "Ordinary"}</p>

      <p><b>Price:</b> ₹${data.price}</p>

      <p><b>Status:</b> ${data.status}</p>

      <img src="${data.qr_url}" alt="QR Code">

    </div>
    `;
  } catch (error) {
    console.error(error);

    result.innerHTML = "<p>Unable to track pass.</p>";
  }
}

// ===============================
// VERIFY PASS
// ===============================

async function verifyPass() {
  const input = document.getElementById("verifyInput");

  if (!input) return;

  const passId = input.value.trim();

  const result = document.getElementById("verifyResult");

  if (!passId) {
    alert("Enter Pass ID");
    return;
  }

  result.innerHTML = `
  <div class="verify-success">

    <h2>✅ Valid & Active Pass</h2>

    <p>Pass ID: ${passId}</p>

  </div>
  `;
}
