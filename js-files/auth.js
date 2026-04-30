/**
 * E-Linangan Auth Utility
 * Shared authentication helper for all pages
 */

const AUTH = {
    // Auto-detect: production (Vercel) uses Render backend, dev uses localhost
    // ⚠️ REPLACE 'YOUR_RENDER_APP_NAME' with your actual Render service name after deploying
    API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000'
        : 'https://e-linangan-v2-2.onrender.com',

    // Token management
    getToken() {
        return localStorage.getItem('elinangan_token');
    },

    setToken(token) {
        localStorage.setItem('elinangan_token', token);
    },

    removeToken() {
        localStorage.removeItem('elinangan_token');
        localStorage.removeItem('elinangan_user');
    },

    // User management
    getUser() {
        const user = localStorage.getItem('elinangan_user');
        return user ? JSON.parse(user) : null;
    },

    setUser(user) {
        localStorage.setItem('elinangan_user', JSON.stringify(user));
    },

    isLoggedIn() {
        const token = this.getToken();
        if (!token) return false;

        try {
            // Decode JWT to check expiration
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 > Date.now();
        } catch {
            return false;
        }
    },

    getUserRole() {
        const user = this.getUser();
        return user ? user.role : null;
    },

    // API call wrapper with auth header
    async apiCall(endpoint, options = {}) {
        const url = `${this.API_BASE_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            const data = await response.json();

            if (response.status === 401) {
                // Token expired or invalid
                this.logout();
                return { error: true, message: data.message || 'Session expired.' };
            }

            if (!response.ok) {
                return { error: true, message: data.message || 'May error sa server.', status: response.status };
            }

            return { error: false, ...data };
        } catch (error) {
            console.error('API call error:', error);
            return { error: true, message: 'Hindi makakonekta sa server. Subukan muli.' };
        }
    },

    // Login
    async login(username, password) {
        const result = await this.apiCall('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });

        if (!result.error && result.token) {
            this.setToken(result.token);
            this.setUser(result.user);
        }

        return result;
    },

    // Register (student)
    async register(data) {
        return await this.apiCall('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    // Logout
    logout() {
        this.removeToken();
        const prefix = this.getPathPrefix();
        window.location.href = prefix + 'login.html';
    },

    // Protect page — redirect if not authorized
    requireAuth(allowedRoles = []) {
        if (!this.isLoggedIn()) {
            window.location.href = this.getPathPrefix() + 'login.html';
            return false;
        }

        if (allowedRoles.length > 0) {
            const role = this.getUserRole();
            if (!allowedRoles.includes(role)) {
                // Redirect based on role
                this.redirectByRole();
                return false;
            }
        }

        return true;
    },

    // Redirect user to their dashboard based on role
    redirectByRole() {
        const role = this.getUserRole();
        const prefix = this.getPathPrefix();
        switch (role) {
            case 'admin':
                window.location.href = prefix + 'admin/dashboard.html';
                break;
            case 'teacher':
                window.location.href = prefix + 'teacher/dashboard.html';
                break;
            case 'student':
                window.location.href = prefix + 'pambungad.html';
                break;
            default:
                window.location.href = prefix + 'login.html';
        }
    },

    // Get relative path prefix based on current page depth
    getPathPrefix() {
        const depth = window.location.pathname.split('/').filter(Boolean).length - 1;
        return depth > 0 ? '../'.repeat(depth) : '';
    },

    // Build nav auth HTML (login/logout indicator)
    buildNavAuth() {
        const user = this.getUser();
        if (!user) return '';

        return `
            <div class="nav-auth">
                <span class="nav-user">👤 ${user.firstName}</span>
                <button class="nav-logout-btn" onclick="AUTH.logout()">Logout</button>
            </div>
        `;
    }
};
