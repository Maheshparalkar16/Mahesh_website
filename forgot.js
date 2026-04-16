document.getElementById("forgotForm").addEventListener("submit", e => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const err = document.getElementById("error");
  const user = JSON.parse(localStorage.getItem("demo_user"));

  if (!user || email !== user.email) {
    err.textContent = "Email not found ❌";
    return;
  }

  alert("Reset link sent (demo). You may now login.");
  window.location.href = "login.html";
});
``