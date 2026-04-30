let selectedRole = 'student';

// Select role (student or teacher)
function selectRole(role) {
    selectedRole = role;
    document.getElementById('role').value = role;

    // Update active button
    document.querySelectorAll('.role-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.role === role);
    });

    // Show/hide grade level field (only for students)
    const gradeLevelGroup = document.getElementById('gradeLevelGroup');
    const gradeLevelSelect = document.getElementById('gradeLevel');

    if (role === 'teacher') {
        gradeLevelGroup.classList.add('hidden');
        gradeLevelSelect.removeAttribute('required');
    } else {
        gradeLevelGroup.classList.remove('hidden');
        gradeLevelSelect.setAttribute('required', '');
    }

    // Clear messages
    hideMessages();
}

// Toggle password visibility
function togglePassword(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);

    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'ri-eye-line';
    } else {
        input.type = 'password';
        icon.className = 'ri-eye-off-line';
    }
}

// Messages
function showError(msg) {
    const el = document.getElementById('errorMessage');
    document.getElementById('successMessage').style.display = 'none';
    el.textContent = msg;
    el.style.display = 'block';
}

function showSuccess(msg) {
    const el = document.getElementById('successMessage');
    document.getElementById('errorMessage').style.display = 'none';
    el.textContent = msg;
    el.style.display = 'block';
}

function hideMessages() {
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('successMessage').style.display = 'none';
}

// Loading state
function setLoading(loading) {
    const btn = document.getElementById('registerBtn');
    btn.disabled = loading;
    btn.querySelector('.btn-text').style.display = loading ? 'none' : 'inline';
    btn.querySelector('.btn-loader').style.display = loading ? 'inline-flex' : 'none';
}

// Load schools from API
async function loadSchools() {
    const select = document.getElementById('schoolId');
    select.innerHTML = '<option value="">Naglo-load...</option>';

    const result = await AUTH.apiCall('/api/auth/schools');

    if (result.error) {
        select.innerHTML = '<option value="">Hindi ma-load ang mga paaralan</option>';
        return;
    }

    if (result.schools.length === 0) {
        select.innerHTML = '<option value="">Walang paaralan na naidagdag pa</option>';
        return;
    }

    select.innerHTML = '<option value="">Pumili ng paaralan</option>';
    result.schools.forEach(school => {
        const option = document.createElement('option');
        option.value = school._id;
        option.textContent = `${school.name} (${school.schoolId})`;
        select.appendChild(option);
    });
}

// Handle form submission
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const schoolId = document.getElementById('schoolId').value;
    const gradeLevel = document.getElementById('gradeLevel').value;

    // Validation
    if (!firstName || !lastName || !username || !password || !schoolId) {
        showError('Kailangan ang lahat ng field.');
        return;
    }

    if (selectedRole === 'student' && !gradeLevel) {
        showError('Kailangan pumili ng grade level.');
        return;
    }

    if (password.length < 6) {
        showError('Ang password ay dapat hindi bababa sa 6 na karakter.');
        return;
    }

    if (password !== confirmPassword) {
        showError('Hindi magkatugma ang mga password.');
        return;
    }

    if (username.length < 3) {
        showError('Ang username ay dapat hindi bababa sa 3 na karakter.');
        return;
    }

    setLoading(true);

    try {
        const data = {
            firstName,
            lastName,
            username,
            password,
            schoolId,
            role: selectedRole
        };

        if (selectedRole === 'student') {
            data.gradeLevel = gradeLevel;
        }

        const result = await AUTH.register(data);

        if (result.error) {
            showError(result.message);
            setLoading(false);
            return;
        }

        showSuccess(result.message);

        // Disable form after successful registration
        document.getElementById('registerForm').querySelectorAll('input, select, button').forEach(el => {
            el.disabled = true;
        });

        // Redirect to login after 3 seconds with status banner
        setTimeout(() => {
            window.location.href = `login.html?status=pending&role=${selectedRole}`;
        }, 3000);
    } catch (error) {
        showError('Hindi makakonekta sa server. Subukan muli.');
        setLoading(false);
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // If already logged in, redirect
    if (AUTH.isLoggedIn()) {
        AUTH.redirectByRole();
        return;
    }

    loadSchools();
});
