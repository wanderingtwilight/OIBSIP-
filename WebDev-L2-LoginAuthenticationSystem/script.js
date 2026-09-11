async function hashPassword(password) {
  const data = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map(byte => byte.toString(16).padStart(2, "0")).join("");
}

function getUsers() {
  return JSON.parse(localStorage.getItem("demoUsers") || "[]");
}

function setUsers(users) {
  localStorage.setItem("demoUsers", JSON.stringify(users));
}

const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async event => {
    event.preventDefault();
    const username = document.getElementById("registerUsername").value.trim();
    const email = document.getElementById("registerEmail").value.trim().toLowerCase();
    const password = document.getElementById("registerPassword").value;
    const message = document.getElementById("registerMessage");

    if (!username || !email || !password) {
      message.textContent = "Please fill in all fields.";
      return;
    }
    if (password.length < 8 || !/\d/.test(password)) {
      message.textContent = "Password must be at least 8 characters and include a number.";
      return;
    }

    const users = getUsers();
    if (users.some(user => user.email === email || user.username.toLowerCase() === username.toLowerCase())) {
      message.textContent = "That username or email is already registered.";
      return;
    }

    const passwordHash = await hashPassword(password);
    users.push({username, email, passwordHash});
    setUsers(users);
    window.location.href = "index.html";
  });
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async event => {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;
    const message = document.getElementById("loginMessage");

    const users = getUsers();
    const passwordHash = await hashPassword(password);
    const user = users.find(item => item.email === email && item.passwordHash === passwordHash);

    if (!user) {
      message.textContent = "Email or password is incorrect.";
      return;
    }

    sessionStorage.setItem("loggedInUser", JSON.stringify({
      username: user.username,
      email: user.email
    }));
    window.location.href = "dashboard.html";
  });
}

if (document.getElementById("welcome")) {
  const user = JSON.parse(sessionStorage.getItem("loggedInUser") || "null");
  if (!user) {
    window.location.href = "index.html";
  } else {
    document.getElementById("welcome").textContent = `Hi, ${user.username}`;
  }
}

const logoutButton = document.getElementById("logoutButton");
if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    sessionStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
  });
}
