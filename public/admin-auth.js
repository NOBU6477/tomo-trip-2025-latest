// Admin Authentication System
// Simple but secure authentication for sponsor management

class AdminAuth {
    constructor() {
        this.apiUrl = '/api/admin';
        this.tokenKey = 'admin_auth_token';
        this.sessionKey = 'admin_session';
    }

    // Generate JWT-like token (simplified for demo)
    generateToken(adminData) {
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload = btoa(JSON.stringify({
            id: adminData.id,
            email: adminData.email,
            role: 'admin',
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
        }));
        const signature = btoa(`tomotrip_admin_${adminData.id}_${Date.now()}`);
        
        return `${header}.${payload}.${signature}`;
    }

    // Authenticate admin user
    async login(email, password) {
        try {
            // Predefined admin credentials (in production, use database)
            const adminCredentials = {
                'admin@tomotrip.com': 'TomoTrip2025!Admin',
                'owner@tomotrip.com': 'Owner2025!TomoTrip',
                'manager@tomotrip.com': 'Manager2025!Access'
            };

            if (!adminCredentials[email] || adminCredentials[email] !== password) {
                throw new Error('Invalid credentials');
            }

            // Generate token and session
            const adminData = { id: 'admin_' + Date.now(), email, role: 'admin' };
            const token = this.generateToken(adminData);
            const sessionId = 'session_' + Math.random().toString(36).substr(2, 9);

            // Store authentication data
            localStorage.setItem(this.tokenKey, token);
            sessionStorage.setItem(this.sessionKey, sessionId);

            console.log('✅ Admin login successful');
            return { success: true, token, adminData };

        } catch (error) {
            console.error('❌ Admin login failed:', error);
            return { success: false, error: error.message };
        }
    }

    // Check if admin is authenticated
    isAuthenticated() {
        const token = localStorage.getItem(this.tokenKey);
        const session = sessionStorage.getItem(this.sessionKey);

        if (!token || !session) {
            return false;
        }

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Math.floor(Date.now() / 1000);

            if (payload.exp < currentTime) {
                this.logout();
                return false;
            }

            return true;
        } catch (error) {
            this.logout();
            return false;
        }
    }

    // Logout admin
    logout() {
        localStorage.removeItem(this.tokenKey);
        sessionStorage.removeItem(this.sessionKey);
        console.log('🚪 Admin logged out');
    }

    // Get admin data from token
    getAdminData() {
        const token = localStorage.getItem(this.tokenKey);
        if (!token) return null;

        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (error) {
            return null;
        }
    }
}

// Global admin auth instance
window.AdminAuth = new AdminAuth();

// Admin login function for modal
async function submitAdminLogin() {
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    const loginButton = document.getElementById('adminLoginBtn');
    const errorDiv = document.getElementById('adminLoginError');

    if (!email || !password) {
        showAdminError('メールアドレスとパスワードを入力してください');
        return;
    }

    // Show loading state
    loginButton.disabled = true;
    loginButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>認証中...';
    errorDiv.style.display = 'none';

    try {
        const result = await window.AdminAuth.login(email, password);

        if (result.success) {
            // Close modal and reload page
            const modal = bootstrap.Modal.getInstance(document.getElementById('adminLoginModal'));
            modal.hide();
            
            // Show success and reload
            document.body.classList.add('admin-authenticated');
            location.reload();
        } else {
            showAdminError(result.error || '認証に失敗しました');
        }
    } catch (error) {
        showAdminError('認証エラーが発生しました');
    }

    // Reset button state
    loginButton.disabled = false;
    loginButton.innerHTML = '<i class="bi bi-shield-lock me-2"></i>ログイン';
}

function showAdminError(message) {
    const errorDiv = document.getElementById('adminLoginError');
    errorDiv.innerHTML = `<i class="bi bi-exclamation-triangle me-2"></i>${message}`;
    errorDiv.style.display = 'block';
}

// Auto-logout on tab close
window.addEventListener('beforeunload', function() {
    if (sessionStorage.getItem('admin_session')) {
        // Keep session for same-tab navigation
        sessionStorage.setItem('admin_tab_active', 'true');
    }
});

// Credential hints for development
console.log('🔑 Demo Admin Credentials:');
console.log('Email: admin@tomotrip.com | Password: TomoTrip2025!Admin');
console.log('Email: owner@tomotrip.com | Password: Owner2025!TomoTrip');
console.log('Email: manager@tomotrip.com | Password: Manager2025!Access');