const form = document.getElementById("signupForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirm = document.getElementById("confirm");

const emailErr = document.getElementById("emailErr");
const passErr = document.getElementById("passErr");
const confirmErr = document.getElementById("confirmErr");

const meterBar = document.getElementById("meterBar");
const meterLabel = document.getElementById("meterLabel");
const verifyBox = document.getElementById("verifyBox");

function strengthScore(pwd) {
  // Common strength checks: length + upper + lower + number + special [6](https://www.geeksforgeeks.org/javascript/create-a-password-strength-checker-using-html-css-and-javascript/)
  const rules = [
    pwd.length >= 8,
    /[A-Z]/.test(pwd),
    /[a-z]/.test(pwd),
    /\d/.test(pwd),
    /[^A-Za-z0-9]/.test(pwd)
  ];
  return rules.filter(Boolean).length; // 0..5
}

function renderMeter(score) {
  const pct = (score / 5) * 100;
  meterBar.style.width = pct + "%";

  if (score <= 1) { meterBar.style.background = "#c62828"; meterLabel.textContent = "Strength: Very Weak"; }
  else if (score === 2) { meterBar.style.background = "#ef6c00"; meterLabel.textContent = "Strength: Weak"; }
  else if (score === 3) { meterBar.style.background = "#f9a825"; meterLabel.textContent = "Strength: Medium"; }
  else if (score === 4) { meterBar.style.background = "#2e7d32"; meterLabel.textContent = "Strength: Strong"; }
  else { meterBar.style.background = "#1b5e20"; meterLabel.textContent = "Strength: Very Strong"; }
}

password.addEventListener("input", () => renderMeter(strengthScore(password.value)));

function clearErrors() {
  emailErr.textContent = "";
  passErr.textContent = "";
  confirmErr.textContent = "";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearErrors();
  verifyBox.style.display = "none";
  verifyBox.innerHTML = "";

  const em = email.value.trim().toLowerCase();
  const pw = password.value;
  const cpw = confirm.value;

  if (!em || !em.includes("@")) { emailErr.textContent = "Enter a valid email."; return; }

  const score = strengthScore(pw);
  renderMeter(score);
  if (score < 4) { passErr.textContent = "Password must be Strong (add upper/lower/number/symbol)."; return; }

  if (pw !== cpw) { confirmErr.textContent = "Passwords do not match."; return; }

  try {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: em, password: pw })
    });

    const data = await res.json();
    if (!res.ok) {
      passErr.textContent = data.error || "Signup failed.";
      return;
    }

    // Show verification link (demo). In real apps this is emailed. [1](https://www.geeksforgeeks.org/node-js/email-verification/)[2](https://stackoverflow.com/questions/39092822/how-to-confirm-email-address-using-express-node)
    verifyBox.style.display = "block";
    verifyBox.innerHTML = `
      <strong>${data.message}</strong><br/>
      <div style="margin-top:8px;">
        <a class="muted-link" href="${data.verifyUrl}">Click here to verify email</a>
      </div>
    `;
  } catch {
    passErr.textContent = "Network error. Is the server running?";
  }
});
``