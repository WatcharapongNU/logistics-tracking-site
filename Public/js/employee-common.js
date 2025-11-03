export function setupEmployeeHeader() {
  const empName = localStorage.getItem("empName") || "Employee";
  const nameElem = document.getElementById("emp-name");
  if (nameElem) nameElem.textContent = `Welcome, ${empName}`;

  const logout = document.getElementById("logout");
  if (logout) {
    logout.addEventListener("click", () => {
      localStorage.removeItem("empName");
      localStorage.removeItem("empRole");
      localStorage.removeItem("empId");
      window.location.href = "/logistics-tracking-site/Views/sign-in.html";
    });
  }
}
