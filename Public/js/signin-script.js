// Sign In Form
const signInForm = document.getElementById("sign-in-form");

const emailElement = document.getElementById("email");
const passwordElement = document.getElementById("password");

signInForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const role = document.getElementById("role").value.trim();

  if (role === "employee") {
    window.location.href = "/logistics-tracking-site/Views/employee/parcel.html";
  }

  if (role === "manager") {
    window.location.href = "/logistics-tracking-site/Views/manager/dashboard.html";
  }

  if (role === "driver") {
    window.location.href = "/logistics-tracking-site/Views/driver/tracking.html";
  }
});
