// script.js

document.addEventListener("DOMContentLoaded", () => {
  const title = document.getElementById("title");
  if (title) {
    title.addEventListener("click", () => {
      title.style.color = "#0078d4";
      alert("Welcome! This site is working correctly ✅");
    });
  }

  // Optional: if already logged in, update the link text
  const isLoggedIn = localStorage.getItem("demo_session") === "active";
  const link = document.querySelector('a[href="login.html"]');
  if (link && isLoggedIn) {
    link.textContent = "Go to Dashboard";
    link.setAttribute("href", "dashboard.html");
    link.classList.add("button");
  } else if (link) {
    link.classList.add("button");
  }

  console.log("JavaScript file connected successfully ✅");
});
``