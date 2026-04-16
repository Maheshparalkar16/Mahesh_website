(async function () {
  const msg = document.getElementById("msg");
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const email = params.get("email");

  if (!token || !email) {
    msg.textContent = "Missing token/email.";
    return;
  }

  const res = await fetch(`/api/verify?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`);
  const data = await res.json();

  msg.textContent = res.ok ? data.message : (data.error || "Verification failed.");
})();
``