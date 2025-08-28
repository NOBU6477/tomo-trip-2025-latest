/**
 * Authentication Flow Management for TomoTrip
 * Handles sponsor login, dashboard access, and registration flow
 */

class AuthFlowManager {
    constructor() {
        this.isLoggedIn = this.checkLoginStatus();
        this.userType = this.getUserType();
        this.initializeAuthFlow();
    }

    /**
     * Check if user is logged in (checking localStorage for auth status)
     */
    checkLoginStatus() {
        const authStatus = localStorage.getItem('tomotrip_auth_status');
        const authExpiry = localStorage.getItem('tomotrip_auth_expiry');
        
        if (authStatus && authExpiry) {
            const now = new Date().getTime();
            const expiry = parseInt(authExpiry);
            
            if (now < expiry) {
                return true;
            } else {
                // Clear expired auth
                this.clearAuthData();
                return false;
            }
        }
        return false;
    }

    /**
     * Get user type from localStorage
     */
    getUserType() {
        return localStorage.getItem('tomotrip_user_type') || null;
    }

    /**
     * Initialize authentication flow handlers
     */
    initializeAuthFlow() {
        this.setupDashboardButton();
        this.setupSponsorLoginFlow();
        this.setupRegistrationFlow();
    }

    /**
     * Setup dashboard button behavior
     */
    setupDashboardButton() {
        const dashboardBtn = document.getElementById('dashboardBtn');
        if (dashboardBtn) {
            dashboardBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleDashboardAccess();
            });

            // Update button appearance based on auth status
            this.updateDashboardButtonState();
        }
    }

    /**
     * Handle dashboard access based on login status
     */
    handleDashboardAccess() {
        if (this.isLoggedIn && this.userType === 'sponsor') {
            // Redirect to dashboard
            window.location.href = 'sponsor-dashboard.html';
        } else {
            // Show login prompt modal
            this.showLoginPromptModal();
        }
    }

    /**
     * Update dashboard button visual state
     */
    updateDashboardButtonState() {
        const dashboardBtn = document.getElementById('dashboardBtn');
        if (dashboardBtn) {
            if (this.isLoggedIn && this.userType === 'sponsor') {
                dashboardBtn.style.opacity = '1';
                dashboardBtn.style.cursor = 'pointer';
                dashboardBtn.title = dashboardBtn.title.replace('ログインが必要です', '').replace('Login Required', '');
            } else {
                dashboardBtn.style.opacity = '0.6';
                dashboardBtn.style.cursor = 'not-allowed';
                const isJapanese = document.documentElement.lang === 'ja' || 
                                  document.querySelector('html[lang="ja"]') || 
                                  window.location.pathname.includes('index.html') || 
                                  !window.location.pathname.includes('index-en.html');
                dashboardBtn.title += isJapanese ? ' (協賛店ログインが必要です)' : ' (Sponsor Login Required)';
            }
        }
    }

    /**
     * Setup sponsor login flow from dropdown
     */
    setupSponsorLoginFlow() {
        const sponsorLoginBtn = document.getElementById('sponsorLoginBtn');
        if (sponsorLoginBtn) {
            sponsorLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSponsorLoginModal();
            });
        }
    }

    /**
     * Setup registration flow - Registration disabled
     */
    setupRegistrationFlow() {
        const registerBtn = document.getElementById('registerBtn');
        if (registerBtn) {
            registerBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // Registration is disabled - redirect to contact
                this.showContactInfo();
            });
        }
    }

    /**
     * Show login prompt modal for dashboard access
     */
    showLoginPromptModal() {
        const isJapanese = document.documentElement.lang === 'ja' || 
                          document.querySelector('html[lang="ja"]') || 
                          window.location.pathname.includes('index.html') || 
                          !window.location.pathname.includes('index-en.html');

        const modalHTML = `
            <div class="modal fade" id="loginPromptModal" tabindex="-1" aria-hidden="true" style="z-index: 9999;">
                <div class="modal-dialog modal-dialog-centered" style="max-width: 450px;">
                    <div class="modal-content" style="border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
                        <div class="modal-header border-0 pb-0">
                            <h5 class="modal-title fw-bold text-primary">
                                ${isJapanese ? 'ダッシュボードアクセス' : 'Dashboard Access'}
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body text-center pt-2">
                            <div class="mb-4">
                                <i class="bi bi-shield-lock" style="font-size: 3rem; color: #007bff;"></i>
                            </div>
                            <h6 class="mb-3">
                                ${isJapanese ? 
                                  'ダッシュボードにアクセスするには協賛店としてログインする必要があります。' : 
                                  'You need to login as a sponsor to access the dashboard.'}
                            </h6>
                            <p class="text-muted mb-4 small">
                                ${isJapanese ? 
                                  'ダッシュボードにアクセスするには、協賛店アカウントでログインしてください。' : 
                                  'Please login with your sponsor account to access the dashboard.'}
                            </p>
                            <div class="d-grid">
                                <button class="btn btn-primary" style="padding: 12px; border-radius: 8px;" onclick="authFlowManager.showSponsorLoginModal(); bootstrap.Modal.getInstance(document.getElementById('loginPromptModal')).hide();">
                                    <i class="bi bi-person-check me-2"></i>${isJapanese ? '協賛店ログイン' : 'Sponsor Login'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if any
        const existingModal = document.getElementById('loginPromptModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add modal to DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Show modal with proper configuration
        const modal = new bootstrap.Modal(document.getElementById('loginPromptModal'), {
            backdrop: 'static',  // Prevent backdrop click close
            keyboard: true,      // Allow ESC key close
            focus: true
        });
        modal.show();
        
        // Ensure proper z-index layering
        setTimeout(() => {
            const modalElement = document.getElementById('loginPromptModal');
            const backdrop = document.querySelector('.modal-backdrop');
            if (modalElement) {
                modalElement.style.zIndex = '9999';
            }
            if (backdrop) {
                backdrop.style.zIndex = '9998';
            }
        }, 100);
    }

    /**
     * Show sponsor login modal
     */
    showSponsorLoginModal() {
        const isJapanese = document.documentElement.lang === 'ja' || 
                          document.querySelector('html[lang="ja"]') || 
                          window.location.pathname.includes('index.html') || 
                          !window.location.pathname.includes('index-en.html');

        const modalHTML = `
            <div class="modal fade" id="sponsorLoginModal" tabindex="-1" aria-hidden="true" style="z-index: 9999;">
                <div class="modal-dialog modal-dialog-centered" style="max-width: 450px;">
                    <div class="modal-content" style="border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="bi bi-shop"></i> ${isJapanese ? '協賛店ログイン' : 'Sponsor Login'}
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="sponsorLoginForm">
                                <div class="mb-3">
                                    <label for="sponsorEmail" class="form-label">
                                        ${isJapanese ? 'メールアドレス' : 'Email Address'}
                                    </label>
                                    <input type="email" class="form-control" id="sponsorEmail" required>
                                </div>
                                <div class="mb-3">
                                    <label for="sponsorPassword" class="form-label">
                                        ${isJapanese ? 'パスワード' : 'Password'}
                                    </label>
                                    <input type="password" class="form-control" id="sponsorPassword" required>
                                </div>
                                <div class="mb-3 form-check">
                                    <input type="checkbox" class="form-check-input" id="rememberMe">
                                    <label class="form-check-label" for="rememberMe">
                                        ${isJapanese ? 'ログイン状態を保持' : 'Remember me'}
                                    </label>
                                </div>
                                <div class="d-grid">
                                    <button type="submit" class="btn btn-primary">
                                        ${isJapanese ? 'ログイン' : 'Login'}
                                    </button>
                                </div>
                            </form>
                            <div class="text-center mt-3">
                                <small class="text-muted">
                                    ${isJapanese ? 
                                      'アカウント作成についてはお問い合わせください' : 
                                      'Please contact us for account creation'}
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if any
        const existingModal = document.getElementById('sponsorLoginModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add modal to DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Setup form handler
        document.getElementById('sponsorLoginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSponsorLogin();
        });

        // Show modal with proper configuration
        const modal = new bootstrap.Modal(document.getElementById('sponsorLoginModal'), {
            backdrop: 'static',
            keyboard: true,
            focus: true
        });
        modal.show();
        
        // Ensure proper z-index layering
        setTimeout(() => {
            const modalElement = document.getElementById('sponsorLoginModal');
            const backdrop = document.querySelector('.modal-backdrop');
            if (modalElement) {
                modalElement.style.zIndex = '9999';
            }
            if (backdrop) {
                backdrop.style.zIndex = '9998';
            }
        }, 100);
    }

    /**
     * Show contact information for account creation
     */
    showContactInfo() {
        const isJapanese = document.documentElement.lang === 'ja' || 
                          document.querySelector('html[lang="ja"]') || 
                          window.location.pathname.includes('index.html') || 
                          !window.location.pathname.includes('index-en.html');

        alert(isJapanese ? 
            'アカウント作成についてはお問い合わせください。\nメール: info@tomotrip.com' : 
            'Please contact us for account creation.\nEmail: info@tomotrip.com');
    }

    /**
     * Handle sponsor login form submission
     */
    async handleSponsorLogin() {
        const email = document.getElementById('sponsorEmail').value;
        const password = document.getElementById('sponsorPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        try {
            // Show loading state
            const submitBtn = document.querySelector('#sponsorLoginForm button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = document.documentElement.lang === 'ja' ? 'ログイン中...' : 'Logging in...';

            // Simulate login API call (replace with actual API)
            await this.simulateApiCall();

            // Set auth status
            this.setAuthData('sponsor', rememberMe);

            // Update UI
            this.updateDashboardButtonState();

            // Close modal and redirect
            bootstrap.Modal.getInstance(document.getElementById('sponsorLoginModal')).hide();
            
            // Show success message
            this.showToast(
                document.documentElement.lang === 'ja' ? 'ログインしました' : 'Logged in successfully',
                'success'
            );

            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'sponsor-dashboard.html';
            }, 1000);

        } catch (error) {
            console.error('Login error:', error);
            this.showToast(
                document.documentElement.lang === 'ja' ? 'ログインに失敗しました' : 'Login failed',
                'error'
            );
        }
    }

    /**
     * Registration disabled - Contact for account creation
     */
    async handleSponsorRegistration() {
        // Registration disabled - redirect to contact
        this.showContactInfo();
    }

    /**
     * Set authentication data in localStorage
     */
    setAuthData(userType, rememberMe) {
        const expiry = rememberMe ? 
            new Date().getTime() + (30 * 24 * 60 * 60 * 1000) : // 30 days
            new Date().getTime() + (24 * 60 * 60 * 1000); // 1 day

        localStorage.setItem('tomotrip_auth_status', 'true');
        localStorage.setItem('tomotrip_user_type', userType);
        localStorage.setItem('tomotrip_auth_expiry', expiry.toString());

        this.isLoggedIn = true;
        this.userType = userType;
    }

    /**
     * Clear authentication data
     */
    clearAuthData() {
        localStorage.removeItem('tomotrip_auth_status');
        localStorage.removeItem('tomotrip_user_type');
        localStorage.removeItem('tomotrip_auth_expiry');

        this.isLoggedIn = false;
        this.userType = null;
    }

    /**
     * Simulate API call
     */
    async simulateApiCall() {
        return new Promise(resolve => {
            setTimeout(resolve, 1500);
        });
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'info') {
        // Create toast if it doesn't exist
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
            toastContainer.style.zIndex = '9999';
            document.body.appendChild(toastContainer);
        }

        const toastId = 'toast-' + Date.now();
        const bgClass = type === 'success' ? 'bg-success' : type === 'error' ? 'bg-danger' : 'bg-info';

        const toastHTML = `
            <div id="${toastId}" class="toast ${bgClass} text-white" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        `;

        toastContainer.insertAdjacentHTML('beforeend', toastHTML);
        const toast = new bootstrap.Toast(document.getElementById(toastId));
        toast.show();

        // Remove toast after it's hidden
        document.getElementById(toastId).addEventListener('hidden.bs.toast', function () {
            this.remove();
        });
    }
}

// Initialize auth flow manager
let authFlowManager;
document.addEventListener('DOMContentLoaded', () => {
    authFlowManager = new AuthFlowManager();
});

export { AuthFlowManager };