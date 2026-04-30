// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('toggleIcon');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.className = 'ri-eye-line';
    } else {
        passwordInput.type = 'password';
        toggleIcon.className = 'ri-eye-off-line';
    }
}

// Show error message
function showError(message) {
    const errorEl = document.getElementById('errorMessage');
    const successEl = document.getElementById('successMessage');
    successEl.style.display = 'none';
    errorEl.textContent = message;
    errorEl.style.display = 'block';
}

// Show success message
function showSuccess(message) {
    const errorEl = document.getElementById('errorMessage');
    const successEl = document.getElementById('successMessage');
    errorEl.style.display = 'none';
    successEl.textContent = message;
    successEl.style.display = 'block';
}

// Set loading state
function setLoading(loading) {
    const btn = document.getElementById('loginBtn');
    const btnText = btn.querySelector('.btn-text');
    const btnLoader = btn.querySelector('.btn-loader');

    btn.disabled = loading;
    btnText.style.display = loading ? 'none' : 'inline';
    btnLoader.style.display = loading ? 'inline-flex' : 'none';
}

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !password) {
        showError('Kailangan ang username at password.');
        return;
    }

    setLoading(true);

    try {
        const result = await AUTH.login(username, password);

        if (result.error) {
            showError(result.message);
            setLoading(false);
            return;
        }

        showSuccess('Matagumpay na naka-login! Nagre-redirect...');

        // Redirect based on role
        setTimeout(() => {
            AUTH.redirectByRole();
        }, 800);
    } catch (error) {
        showError('Hindi makakonekta sa server. Subukan muli.');
        setLoading(false);
    }
});

// If already logged in, redirect
document.addEventListener('DOMContentLoaded', () => {
    if (AUTH.isLoggedIn()) {
        AUTH.redirectByRole();
    }
});
