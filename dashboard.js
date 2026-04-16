document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const info = document.getElementById("info");
  const adminBox = document.getElementById("adminBox");
  const logout = document.getElementById("logout");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch("/api/me", {
      headers: { "Authorization": "Bearer " + token }
    });
    const data = await res.json();

    if (!res.ok) {
      localStorage.clear();
      window.location.href = "login.html";
      return;
    }

    info.textContent = `Logged in as ${data.me.email} | Role: ${data.me.role}`;

    if (data.me.role === "admin") {
      adminBox.style.display = "block";
      adminBox.innerHTML = `
        <strong>Admin Panel</strong><br/>
        <button class="button" id="secretBtn" style="margin-top:10px;">Get Admin Secret</button>
        <div id="secretOut" style="margin-top:10px;"></div>
      `;

      document.getElementById("secretBtn").addEventListener("click", async () => {
        const r = await fetch("/api/admin/secret", {
          headers: { "Authorization": "Bearer " + token }
        });
        const d = await r.json();
        document.getElementById("secretOut").textContent = r.ok ? d.secret : (d.error || "Failed");
      });
    }
  } catch {
    info.textContent = "Network error. Is the server running?";
  }

  logout.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
  });
});