document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const email = document.getElementById("email");
  const password = document.getElementById("password");

  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");

  function setErr(el, msg) { el.textContent = msg; }
  function clearErr() { emailError.textContent=""; passwordError.textContent=""; }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErr();

    const em = email.value.trim().toLowerCase();
    const pw = password.value;

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: em, password: pw })
      });

      const data = await res.json();
      if (!res.ok) {
        // e.g. "Email not verified. Please verify first."
        setErr(passwordError, data.error || "Login failed");
        return;
      }

      // NOTE: For production, prefer HttpOnly cookies over localStorage to reduce script exposure. [4](https://www.digitalocean.com/community/tutorials/nodejs-jwt-expressjs)
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("email", data.email);

      window.location.href = "dashboard.html";
    } catch {
      setErr(passwordError, "Network error. Is the server running?");
    }
  });
});