// ==================================
// Login Authentication Demo
// ==================================

const loginTab = document.getElementById("login-tab");
const registerTab = document.getElementById("register-tab");

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

const showRegisterButton = document.getElementById("show-register");
const showLoginButton = document.getElementById("show-login");

const message = document.getElementById("message");
const dashboard = document.getElementById("dashboard");
const userWelcome = document.getElementById("user-welcome");
const logoutButton = document.getElementById("logout-btn");

// Show messages
function showMessage(text, type) {
    message.textContent = text;
    message.className = type;
}

// Clear messages
function clearMessage() {
    message.textContent = "";
    message.className = "";
}

// Switch between Login and Register
function showLoginForm() {
    loginForm.hidden = false;
    registerForm.hidden = true;
    dashboard.hidden = true;

    loginTab.classList.add("active");
    registerTab.classList.remove("active");

    clearMessage();
}

function showRegisterForm() {
    loginForm.hidden = true;
    registerForm.hidden = false;
    dashboard.hidden = true;

    loginTab.classList.remove("active");
    registerTab.classList.add("active");

    clearMessage();
}

loginTab.addEventListener("click", showLoginForm);
registerTab.addEventListener("click", showRegisterForm);
showRegisterButton.addEventListener("click", showRegisterForm);
showLoginButton.addEventListener("click", showLoginForm);

// Read demo accounts from local storage
function getAccounts() {
    try {
        const accounts = JSON.parse(
            localStorage.getItem("demoAccounts") || "[]"
        );

        return Array.isArray(accounts) ? accounts : [];
    } catch (error) {
        return [];
    }
}

// Register a new account
registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("register-name").value.trim();
    const email = document.getElementById("register-email").value
        .trim()
        .toLowerCase();

    const password = document.getElementById("register-password").value;
    const confirmPassword =
        document.getElementById("confirm-password").value;

    if (!name || !email || !password || !confirmPassword) {
        showMessage("Please fill in all fields.", "error");
        return;
    }

    if (password.length < 8) {
        showMessage(
            "Password must contain at least 8 characters.",
            "error"
        );
        return;
    }

    if (password !== confirmPassword) {
        showMessage("Passwords do not match!", "error");
        return;
    }

    const accounts = getAccounts();

    if (accounts.some(account => account.email === email)) {
        showMessage(
            "An account with this email already exists.",
            "error"
        );
        return;
    }

    // Demo only: never store real passwords this way.
    // A real application must hash passwords on a secure backend.
    const demoAccount = { name, email, password };

    accounts.push(demoAccount);
    localStorage.setItem("demoAccounts", JSON.stringify(accounts));

    registerForm.reset();

    showLoginForm();
    document.getElementById("login-email").value = email;

    showMessage(
        "Account created! Please log in with your details.",
        "success"
    );
});

// Log in with a registered demo account
loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("login-email").value
        .trim()
        .toLowerCase();

    const password = document.getElementById("login-password").value;

    const accounts = getAccounts();

    const account = accounts.find(function (item) {
        return item.email === email && item.password === password;
    });

    if (!account) {
        showMessage(
            "Invalid email or password. Please try again.",
            "error"
        );
        return;
    }

    // Store only the demo session details, not the password.
    sessionStorage.setItem(
        "demoSession",
        JSON.stringify({
            name: account.name,
            email: account.email
        })
    );

    displayDashboard(account.name, account.email);
});

// Display the dashboard
function displayDashboard(name, email) {
    loginForm.hidden = true;
    registerForm.hidden = true;
    dashboard.hidden = false;

    loginTab.classList.remove("active");
    registerTab.classList.remove("active");

    clearMessage();

    userWelcome.textContent = `Welcome, ${name}! You are logged in as ${email}.`;
}

// Logout
logoutButton.addEventListener("click", function () {
    sessionStorage.removeItem("demoSession");

    loginForm.reset();
    registerForm.reset();

    showLoginForm();
    showMessage("You have logged out successfully.", "success");
});

// Start on the Login screen
showLoginForm();