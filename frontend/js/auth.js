/* =========================================================
   auth.js — Registration, login, logout, and shared nav
   auth-state rendering used across every page.
   ========================================================= */

/** Returns true if a user is currently logged in */
function isLoggedIn() {
  return !!localStorage.getItem('token');
}

/** Returns the logged-in user's saved name, or null */
function getCurrentUserName() {
  return localStorage.getItem('userName');
}

/** Clears auth data and redirects to the home page */
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  window.location.href = 'index.html';
}

/**
 * Updates the navbar's auth-related links depending on login state.
 * Every page includes an element with id="navAuthLinks" for this to target.
 */
function renderNavAuthState() {
  const navAuthLinks = document.getElementById('navAuthLinks');
  if (!navAuthLinks) return;

  if (isLoggedIn()) {
    const name = getCurrentUserName() || 'Account';
    navAuthLinks.innerHTML = `
      <a href="orders.html">${name.split(' ')[0]}'s Orders</a>
      <button id="logoutBtn" type="button">Logout</button>
    `;
    document.getElementById('logoutBtn').addEventListener('click', logout);
  } else {
    navAuthLinks.innerHTML = `
      <a href="login.html">Login</a>
      <a href="register.html">Register</a>
    `;
  }
}

/** Shows a message box inside a form (expects an element with id="formMessage") */
function showFormMessage(text, type = 'error') {
  const box = document.getElementById('formMessage');
  if (!box) return;
  box.textContent = text;
  box.className = `form-message ${type}`;
}

/* ---------- Register form handling ---------- */
function initRegisterForm() {
  const form = document.getElementById('registerForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
      showFormMessage('Passwords do not match.');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account...';

    try {
      const data = await AuthAPI.register({ name, email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', data.name);
      localStorage.setItem('userEmail', data.email);
      showFormMessage('Account created! Redirecting...', 'success');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 800);
    } catch (error) {
      showFormMessage(error.message);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Create Account';
    }
  });
}

/* ---------- Login form handling ---------- */
function initLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';

    try {
      const data = await AuthAPI.login({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', data.name);
      localStorage.setItem('userEmail', data.email);
      showFormMessage('Login successful! Redirecting...', 'success');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 600);
    } catch (error) {
      showFormMessage(error.message);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Login';
    }
  });
}

/** Redirects to login.html if the user is not authenticated */
function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderNavAuthState();
  initRegisterForm();
  initLoginForm();
});
