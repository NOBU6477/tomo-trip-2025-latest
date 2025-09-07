// Event handlers - centralized setup with AppState support
import { showSponsorLoginModal, showSponsorRegistrationModal } from '../ui/modal.mjs';

export function setupEventListeners(state) {
    console.log('%cSetting up event listeners...', 'color: #007bff;');
    
    // Setup data-action based event handlers (CSP compliant)
    setupDataActionHandlers();
    
    // Setup sponsor button events (CSP compliant)
    setupSponsorButtonEvents();
    
    // Setup registration button events
    setupRegistrationButtonEvents();
    
    // Setup language switch buttons
    setupLanguageSwitchEvents();
    
    // Pass state to sub-functions
    setupGuideCardEvents();
    setupModalEvents();
    setupFilterEvents();
    setupPaginationEvents(state);
    
    console.log('%cEvent listeners setup complete', 'color: #28a745;');
}

// CSP compliant data-action event delegation system
function setupDataActionHandlers() {
    // Prevent double initialization
    if (window.__dataActionHandlersSetup) return;
    window.__dataActionHandlersSetup = true;
    
    // Unified event delegation for all data-action attributes
    document.addEventListener('click', (e) => {
        const action = e.target.closest('[data-action]')?.getAttribute('data-action');
        if (!action) return;
        
        e.preventDefault();
        
        const element = e.target.closest('[data-action]');
        const guideId = element?.getAttribute('data-guide-id');
        const bookingId = element?.getAttribute('data-booking-id');
        const target = element?.getAttribute('data-target');
        const email = element?.getAttribute('data-email');
        
        // Handle all data-action events
        switch(action) {
            // Filter & Search Actions
            case 'search':
                handleSearchAction();
                break;
            case 'reset':
                handleResetFilters();
                break;
            
            // Pagination Actions 
            case 'next-page':
                handleNextPage();
                break;
            case 'prev-page':
                handlePrevPage();
                break;
            case 'goto-page':
                const page = parseInt(element?.getAttribute('data-page'));
                if (page && !isNaN(page)) handleGotoPage(page);
                break;
                
            // Sponsor Actions
            case 'open-sponsor-registration':
                handleSponsorRegistration();
                break;
            case 'open-sponsor-login':
                handleSponsorLogin();
                break;
            case 'open-management':
                handleManagementCenter();
                break;
                
            // Authentication & Registration
            case 'toggle-login-dropdown':
                toggleLoginDropdown();
                break;
            case 'open-tourist-registration':
                openTouristRegistration();
                break;
            case 'open-guide-registration':
                openGuideRegistration();
                break;
            case 'process-sponsor-login':
                processSponsorLogin();
                break;
            case 'redirect-sponsor-dashboard':
                redirectToSponsorDashboard();
                break;
                
            // Guide Actions
            case 'book-guide':
                if (guideId) bookGuide(guideId);
                break;
            case 'contact-guide':
                if (guideId) contactGuide(guideId);
                break;
            case 'show-guide-detail':
            case 'view-details':
                if (guideId) showGuideDetailModalById(guideId);
                break;
                
            // Bookmark & Comparison
            case 'remove-bookmark':
                if (guideId) removeBookmark(guideId);
                break;
            case 'remove-from-comparison':
                if (guideId) removeFromComparison(guideId);
                break;
            case 'view-booking-details':
                if (bookingId) viewBookingDetails(bookingId);
                break;
                
            // Utility Actions
            case 'trigger-photo-upload':
                document.getElementById('guideProfilePhoto')?.click();
                break;
            case 'open-chat':
                if (target) window.open(target, '_blank');
                break;
            case 'send-email':
                if (email) window.location.href = `mailto:${email}`;
                break;
                
            // Footer & Information Modals
            case 'show-faq':
                showFAQ();
                break;
            case 'show-cancellation':
                showCancellation();
                break;
            case 'show-safety':
                showSafety();
                break;
            case 'show-payment-help':
                alert('Payment help coming soon');
                break;
            case 'show-guide-registration-help':
                alert('Guide registration help coming soon');
                break;
            case 'show-profile-optimization':
                alert('Profile optimization tips coming soon');
                break;
            case 'show-earnings-dashboard':
                alert('Earnings dashboard coming soon');
                break;
            case 'show-guide-resources':
                alert('Guide resources coming soon');
                break;
            case 'show-cookie-settings':
                alert('Cookie settings panel under development');
                break;
            case 'clear-all-cookies':
                alert('Cookie deletion feature under development');
                break;
            case 'scroll-to-guides':
                scrollToGuides();
                break;
            case 'show-guide-registration-modal':
                showGuideRegistrationModal();
                break;
            case 'show-tourist-registration-modal':
                showTouristRegistrationModal();
                break;
            case 'show-management-center':
                showManagementCenter();
                break;
            case 'show-help':
                showHelp();
                break;
            case 'show-about':
                showAbout();
                break;
            case 'show-terms':
                showTerms();
                break;
            case 'show-privacy':
                showPrivacy();
                break;
            case 'show-cookies':
                showCookies();
                break;
            case 'show-compliance':
                showCompliance();
                break;
                
            default:
                console.log('Unknown data-action:', action);
        }
    });
    
    // Change delegation for filter elements
    document.addEventListener('change', (e) => {
        const element = e.target.closest('[data-action="filter-change"]');
        if (!element) return;
        handleFilterChange();
    });
}

// Show registration choice inline (below navigation)
function showRegistrationChoice() {
    console.log('🎯 showRegistrationChoice function called');
    try {
        // Get the form container (below navigation)
        const formContainer = document.getElementById('registrationFormContainer');
        if (!formContainer) {
            console.error('registrationFormContainer not found');
            alert('登録コンテナが見つかりません');
            return;
        }
        
        // Clear any existing content
        formContainer.innerHTML = '';
        
        // Create inline choice selection
        const choiceContent = document.createElement('div');
        choiceContent.className = 'registration-choice-content';
        choiceContent.id = 'registrationChoiceContent';
        choiceContent.innerHTML = `
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="choice-container" style="background: white; border-radius: 20px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15); margin: 2rem 0;">
                        <div class="choice-header" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 2rem; border-radius: 20px 20px 0 0; text-align: center;">
                            <h1><i class="bi bi-person-plus me-2"></i>登録タイプを選択</h1>
                            <p class="mb-0">あなたに最適な登録方法を選んでください</p>
                        </div>
                        
                        <div class="p-4">
                            <div class="row g-4">
                                <div class="col-md-6">
                                    <div class="card h-100 border-primary choice-card" style="cursor: pointer; border-radius: 15px; border-width: 2px; transition: transform 0.2s;" onclick="openTouristRegistration()">
                                        <div class="card-body text-center p-4">
                                            <i class="bi bi-camera-fill text-primary mb-3" style="font-size: 3rem;"></i>
                                            <h6 class="fw-bold text-primary mb-2">観光客登録</h6>
                                            <p class="text-muted small mb-3">観光客として登録し、ガイドを閲覧・予約できます</p>
                                            <div class="mt-3">
                                                <span class="badge bg-primary">簡単登録</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card h-100 border-success choice-card" style="cursor: pointer; border-radius: 15px; border-width: 2px; transition: transform 0.2s;" onclick="openGuideRegistration()">
                                        <div class="card-body text-center p-4">
                                            <i class="bi bi-person-badge-fill text-success mb-3" style="font-size: 3rem;"></i>
                                            <h6 class="fw-bold text-success mb-2">ガイド登録</h6>
                                            <p class="text-muted small mb-3">観光ガイドとして登録し、お客様にサービスを提供できます</p>
                                            <div class="mt-3">
                                                <span class="badge bg-success">プロフェッショナル</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="text-center mt-4">
                                <small class="text-muted">
                                    <i class="bi bi-info-circle me-1"></i>
                                    希望する登録タイプを選択してください。後で変更することも可能です。
                                </small>
                            </div>
                            <div class="text-center mt-3">
                                <button type="button" class="btn btn-outline-secondary" onclick="hideRegistrationChoice()">
                                    <i class="bi bi-x-circle me-2"></i>キャンセル
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
        
        // Add hover effects style
        const style = document.createElement('style');
        style.textContent = `
            .choice-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            }
        `;
        document.head.appendChild(style);
        
        // Show the choice content
        formContainer.appendChild(choiceContent);
        formContainer.style.display = 'block';
        
        // Scroll to the choice section smoothly
        setTimeout(() => {
            formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        
        console.log('✅ Registration choice shown inline below navigation');
        
    } catch (error) {
        console.error('❌ Error in showRegistrationChoice:', error);
        alert('Registration choice failed to show: ' + error.message);
    }
}

// Hide registration choice content
function hideRegistrationChoice() {
    console.log('🛑 Hiding registration choice content');
    const formContainer = document.getElementById('registrationFormContainer');
    if (formContainer) {
        formContainer.style.display = 'none';
        formContainer.innerHTML = '';
        console.log('✅ Registration choice content hidden');
    } else {
        console.warn('⚠️ Registration form container not found');
    }
}

// Open tourist registration
function openTouristRegistration() {
    // Hide choice content
    hideRegistrationChoice();
    
    // Open tourist registration modal
    setTimeout(() => {
        const registrationModal = new bootstrap.Modal(document.getElementById('registrationModal'));
        registrationModal.show();
    }, 100);
}

// Open guide registration
function openGuideRegistration() {
    console.log('Guide registration selected');
    
    // Get the form container and original form
    const formContainer = document.getElementById('registrationFormContainer');
    const originalForm = document.getElementById('detailedGuideRegistrationForm');
    
    if (formContainer && originalForm) {
        // Clear choice content and show registration form
        formContainer.innerHTML = '';
        formContainer.appendChild(originalForm);
        formContainer.style.display = 'block';
        originalForm.style.display = 'block';
        
        // Initialize form handlers after form is shown
        setTimeout(() => {
            initializeRegistrationFormHandlers();
        }, 100);
        
        // Scroll to the form smoothly
        setTimeout(() => {
            formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
    } else {
        console.warn('Registration container or form not found');
        alert('登録フォームが見つかりません。');
    }
}

// Add phone verification and file upload handlers
function initializeRegistrationFormHandlers() {
    // Phone verification handlers
    const sendCodeBtn = document.getElementById('sendVerificationCode');
    const verifyCodeBtn = document.getElementById('verifyPhoneCode');
    const phoneInput = document.getElementById('detailedGuidePhone');
    const codeInput = document.getElementById('verificationCode');
    const statusSpan = document.getElementById('phoneVerificationStatus');
    
    if (sendCodeBtn && phoneInput) {
        sendCodeBtn.addEventListener('click', function() {
            const phone = phoneInput.value.trim();
            if (!phone) {
                alert('電話番号を入力してください');
                return;
            }
            
            // Simulate sending verification code
            sendCodeBtn.disabled = true;
            sendCodeBtn.innerHTML = '<i class="bi bi-hourglass-split me-1"></i>送信中...';
            
            setTimeout(() => {
                sendCodeBtn.innerHTML = '<i class="bi bi-check me-1"></i>送信完了';
                statusSpan.textContent = '認証コードを送信しました';
                statusSpan.className = 'text-success ms-3';
                
                if (codeInput) codeInput.disabled = false;
                if (verifyCodeBtn) verifyCodeBtn.disabled = false;
            }, 2000);
        });
    }
    
    if (verifyCodeBtn && codeInput) {
        verifyCodeBtn.addEventListener('click', function() {
            const code = codeInput.value.trim();
            if (!code || code.length !== 6) {
                alert('6桁の認証コードを入力してください');
                return;
            }
            
            // Simulate verification
            verifyCodeBtn.disabled = true;
            verifyCodeBtn.innerHTML = '<i class="bi bi-hourglass-split me-1"></i>認証中...';
            
            setTimeout(() => {
                verifyCodeBtn.innerHTML = '<i class="bi bi-check-circle me-1"></i>認証完了';
                verifyCodeBtn.className = 'btn btn-success';
                statusSpan.textContent = '電話番号の認証が完了しました';
                statusSpan.className = 'text-success ms-3';
                
                phoneInput.style.backgroundColor = '#d4edda';
                codeInput.style.backgroundColor = '#d4edda';
            }, 1500);
        });
    }
    
    // File upload preview handlers
    const identityUpload = document.getElementById('identityDocument');
    const profileUpload = document.getElementById('profilePhoto');
    const previewArea = document.getElementById('imagePreviewArea');
    
    if (identityUpload) {
        identityUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById('identityPreview');
                    if (preview) {
                        preview.src = e.target.result;
                        if (previewArea) previewArea.style.display = 'block';
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    if (profileUpload) {
        profileUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById('profilePreview');
                    if (preview) {
                        preview.src = e.target.result;
                        if (previewArea) previewArea.style.display = 'block';
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// Dynamic document upload functionality
function updateDocumentUpload() {
    const documentType = document.getElementById('documentType').value;
    const uploadArea = document.getElementById('documentUploadArea');
    const uploadCards = document.getElementById('documentUploadCards');
    const instructions = document.getElementById('documentInstructions');
    
    if (!documentType) {
        uploadArea.style.display = 'none';
        return;
    }
    
    uploadArea.style.display = 'block';
    uploadCards.innerHTML = '';
    
    const documentConfig = {
        'drivers_license': {
            count: 2,
            names: ['表面', '裏面'],
            instruction: '運転免許証の表面と裏面、両方の写真をアップロードしてください。文字が鮮明に読める状態で撮影してください。'
        },
        'passport': {
            count: 1,
            names: ['写真ページ'],
            instruction: 'パスポートの写真とパーソナルデータが記載されているページの写真をアップロードしてください。'
        },
        'residence_card': {
            count: 1,
            names: ['住民票'],
            instruction: '住民票の写真をアップロードしてください。発行から3ヶ月以内のものを使用してください。'
        },
        'insurance_card': {
            count: 2,
            names: ['表面', '裏面'],
            instruction: '健康保険証の表面と裏面、両方の写真をアップロードしてください。'
        },
        'mynumber_card': {
            count: 1,
            names: ['表面のみ'],
            instruction: 'マイナンバーカードの表面（写真面）のみをアップロードしてください。裏面（マイナンバー記載面）は不要です。'
        }
    };
    
    const config = documentConfig[documentType];
    instructions.innerHTML = `<i class="bi bi-info-circle me-2"></i>${config.instruction}`;
    
    for (let i = 0; i < config.count; i++) {
        const colClass = config.count === 1 ? 'col-md-6' : 'col-md-6';
        uploadCards.innerHTML += `
            <div class="${colClass}">
                <div class="card border-2 border-dashed border-success" style="min-height: 150px;">
                    <div class="card-body text-center">
                        <i class="bi bi-cloud-upload fs-1 text-success mb-2"></i>
                        <p class="text-muted">${config.names[i]}</p>
                        <input type="file" class="form-control document-upload" id="document_${i}" accept="image/*,.pdf" required onchange="previewDocument(this, ${i})">
                        <small class="text-muted">JPG、PNG、PDF対応</small>
                    </div>
                </div>
            </div>
        `;
    }
}

// Document preview functionality
function previewDocument(input, index) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewArea = document.getElementById('imagePreviewArea');
            const previewCards = document.getElementById('documentPreviewCards');
            
            // Show preview area
            previewArea.style.display = 'block';
            
            // Add or update preview card
            let existingPreview = document.getElementById(`documentPreview_${index}`);
            if (existingPreview) {
                existingPreview.remove();
            }
            
            const previewCard = document.createElement('div');
            previewCard.className = 'col-md-6';
            previewCard.id = `documentPreview_${index}`;
            previewCard.innerHTML = `
                <div class="card">
                    <div class="card-body text-center">
                        <h6 class="card-title">証明書プレビュー ${index + 1}</h6>
                        <img src="${e.target.result}" class="img-fluid" style="max-height: 200px; border-radius: 10px;">
                    </div>
                </div>
            `;
            
            previewCards.appendChild(previewCard);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Hide registration form functionality
function hideRegistrationForm() {
    const formContainer = document.getElementById('registrationFormContainer');
    if (formContainer) {
        formContainer.style.display = 'none';
        formContainer.innerHTML = '';
        console.log('✅ Registration form hidden');
    }
}

// Make functions globally available
window.showRegistrationChoice = showRegistrationChoice;
window.hideRegistrationChoice = hideRegistrationChoice;
window.openTouristRegistration = openTouristRegistration;
window.openGuideRegistration = openGuideRegistration;
window.updateDocumentUpload = updateDocumentUpload;
window.previewDocument = previewDocument;
window.hideRegistrationForm = hideRegistrationForm;

// Setup registration button events
function setupRegistrationButtonEvents() {
    const regBtn = document.getElementById('registerBtn');
    if (regBtn) {
        regBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Registration button clicked!');
            
            // Always show choice modal first
            showRegistrationChoice();
        });
        console.log('✅ Registration button event listener added');
    } else {
        console.warn('Registration button not found');
    }
    
    console.log('%cData-action handlers setup complete', 'color: #28a745;');
}

// CSP compliant sponsor button event setup
function setupSponsorButtonEvents() {
    const regBtn = document.getElementById('sponsorRegBtn');
    const loginBtn = document.getElementById('sponsorLoginBtn');
    const regBtnMobile = document.getElementById('sponsorRegBtnMobile');
    const loginBtnMobile = document.getElementById('sponsorLoginBtnMobile');
    
    // Desktop buttons
    if (regBtn) {
        regBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Sponsor registration clicked - redirecting to registration page');
            window.location.href = 'sponsor-registration.html?v=' + Date.now();
        });
    }
    
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Sponsor login clicked - showing modal');
            showSponsorLoginModal();
        });
    }
    
    // Mobile buttons
    if (regBtnMobile) {
        regBtnMobile.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Mobile sponsor registration clicked - redirecting to registration page');
            window.location.href = 'sponsor-registration.html?v=' + Date.now();
        });
    }
    
    if (loginBtnMobile) {
        loginBtnMobile.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Mobile sponsor login clicked - showing modal');
            showSponsorLoginModal();
        });
    }
    
    console.log('%cSponsor button events setup complete', 'color: #28a745;');
}

// Language switch button events - delegated to emergency-buttons.mjs to prevent conflicts
function setupLanguageSwitchEvents() {
    // Language switch is now handled by emergency-buttons.mjs to prevent duplicate declarations
    // This avoids CSP violations and function redefinition errors
    console.log('%cLanguage switch events delegated to emergency handlers', 'color: #6c757d;');
}

// Utility function for AppState-based guide loading
export function loadAllGuides(guides) {
    const state = window.AppState;
    const safeGuides = Array.isArray(guides) ? guides : (state ? state.guides : []);
    
    console.log('%cGuides loaded:', 'color: #28a745;', safeGuides.length, 'guides');
    return safeGuides;
}

// Initialize pagination with AppState
export function initializeGuidePagination(state) {
    if (!state) {
        console.warn('initializeGuidePagination: No state provided');
        return;
    }
    
    // Ensure currentPage is valid
    state.currentPage = Math.max(1, Math.min(state.currentPage, state.totalPages));
    
    console.log('%cPagination initialized:', 'color: #28a745;', {
        currentPage: state.currentPage,
        totalPages: state.totalPages,
        guides: state.guides.length
    });
    
    // Display initial page
    displayGuides(state.currentPage, state);
}

// Display guides for current page using AppState
export function displayGuides(page, state) {
    const currentState = state || window.AppState;
    if (!currentState) return;
    
    const container = document.getElementById('guideCardsContainer');
    if (!container) return;
    
    // Force pageSize to 12 for consistency across all environments
    currentState.pageSize = 12;
    
    const startIndex = (page - 1) * currentState.pageSize;
    const endIndex = startIndex + currentState.pageSize;
    const guidesForPage = currentState.guides.slice(startIndex, endIndex);
    
    container.innerHTML = '';
    
    guidesForPage.forEach(guide => {
        const guideCard = createGuideCard(guide);
        container.appendChild(guideCard);
    });
    
    // Update guide count displays with actual rendered card count
    if (window.updateGuideCounters) {
        window.updateGuideCounters(guidesForPage.length, currentState.guides.length);
    }
    
    // Environment debug log table
    console.table({
        build: window.BUILD_ID || 'TomoTrip-v2025.08.09-UNIFIED-BUILD',
        total: currentState.guides.length,
        filtered: currentState.guides.length, // Currently no filtering applied
        page: page,
        pageSize: currentState.pageSize,
        rendered: guidesForPage.length,
        origin: location.origin,
        timestamp: new Date().toISOString()
    });
    
    updatePaginationInfo(page, currentState);
}

// Create guide card element
function createGuideCard(guide) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4 mb-4';
    
    col.innerHTML = `
        <div class="card guide-card h-100 shadow-sm">
            <img src="${guide.image || 'assets/images/default-guide.jpg'}" class="card-img-top" alt="${guide.name}" style="height: 200px; object-fit: cover;">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${guide.name}</h5>
                <p class="card-text text-muted small">${window.locationNames ? (window.locationNames[guide.location] || guide.location) : guide.location}</p>
                <div class="mb-2">
                    <span class="badge bg-primary me-1">¥${Number(guide?.price || 0).toLocaleString()}</span>
                    <span class="badge bg-warning text-dark">★${guide.rating}</span>
                </div>
                <div class="mt-auto">
                    <button class="btn btn-outline-primary btn-sm" onclick="viewGuideDetails('${guide.id}')">詳細を見る</button>
                </div>
            </div>
        </div>
    `;
    
    return col;
}

// Counter displays handled by guide-renderer.mjs to avoid duplication

// Update pagination info with AppState
function updatePaginationInfo(page, state) {
    const currentState = state || window.AppState;
    if (!currentState) return;
    
    const totalPages = currentState.totalPages;
    const startIndex = (page - 1) * currentState.pageSize + 1;
    const endIndex = Math.min(page * currentState.pageSize, currentState.guides.length);
    
    const pageInfo = document.getElementById('pageInfo');
    const displayRange = document.getElementById('displayRange');
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    
    if (pageInfo) pageInfo.textContent = `ページ ${page}`;
    if (displayRange) displayRange.textContent = `${startIndex}-${endIndex}`;
    
    if (prevBtn) {
        prevBtn.disabled = page === 1;
        prevBtn.onclick = () => {
            if (page > 1) {
                currentState.currentPage = page - 1;
                displayGuides(currentState.currentPage, currentState);
            }
        };
    }
    
    if (nextBtn) {
        nextBtn.disabled = page === totalPages;
        nextBtn.onclick = () => {
            if (page < totalPages) {
                currentState.currentPage = page + 1;
                displayGuides(currentState.currentPage, currentState);
            }
        };
    }
}

function setupGuideCardEvents() {
    // Guide card click handlers will be set up when cards are rendered
    document.addEventListener('click', function(e) {
        const guideCard = e.target.closest('.guide-card, .card[data-guide-id]');
        if (guideCard) {
            const guideId = guideCard.dataset.guideId;
            if (guideId) {
                console.log('Guide card clicked:', guideId);
                // Guide detail logic would go here
            }
        }
    });
}

function setupModalEvents() {
    // Modal close handlers
    document.addEventListener('click', function(e) {
        if (e.target.matches('[data-bs-dismiss="modal"]')) {
            console.log('Modal dismiss clicked');
        }
    });
}

function setupFilterEvents() {
    // Filter button handlers
    const filterButtons = document.querySelectorAll('.filter-btn, .btn-filter');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('Filter clicked:', this.textContent);
        });
    });
}

function setupPaginationEvents(state) {
    // Pagination handlers will be set up by updatePaginationInfo
    console.log('Pagination events ready for AppState');
}

// Sponsor button event handlers - CSP compliant
export function wireSponsorButtons() {
    const regBtn = document.getElementById('sponsorRegBtn');
    const loginBtn = document.getElementById('sponsorLoginBtn');
    
    if (regBtn) {
        regBtn.addEventListener('click', handleSponsorRegistration);
    }
    
    if (loginBtn) {
        loginBtn.addEventListener('click', handleSponsorLogin);
    }
}

// Sponsor handler functions
function handleSponsorRegistration() {
    console.log('Sponsor registration clicked');
    console.log('🚀 DIRECT ACTION: Redirecting to sponsor-registration.html with cache busting');
    try {
        window.location.href = 'sponsor-registration.html?v=' + Date.now();
    } catch (error) {
        console.error('Redirect failed:', error);
        alert('リダイレクトに失敗しました');
    }
}

function handleSponsorLogin() {
    console.log('Sponsor login clicked');
    console.log('🔐 DIRECT ACTION: Showing sponsor login modal');
    try {
        showSponsorLoginModal();
    } catch (error) {
        console.error('Modal failed:', error);
        alert('モーダル表示に失敗しました');
    }
}

// Language switcher handlers - CSP compliant
export function wireLanguageSwitcher() {
    const jpBtn = document.getElementById('jpBtn');
    const enBtn = document.getElementById('enBtn');
    
    if (jpBtn) {
        jpBtn.addEventListener('click', switchToJapanese);
    }
    
    if (enBtn) {
        enBtn.addEventListener('click', switchToEnglish);
    }
}

function switchToJapanese() {
    console.log('Switching to Japanese');
    window.location.href = 'index.html';
}

function switchToEnglish() {
    console.log('Switching to English');
    window.location.href = 'index-en.html';
}

// CSP-compliant filter and search handlers
function handleSearchAction() {
    console.log('🔍 Search action triggered');
    applyCurrentFilters();
}

function handleResetFilters() {
    console.log('🔄 Reset filters triggered');
    
    // Reset all filter selects
    const locationFilter = document.getElementById('locationFilter');
    const languageFilter = document.getElementById('languageFilter');  
    const priceFilter = document.getElementById('priceFilter');
    
    if (locationFilter) locationFilter.value = '';
    if (languageFilter) languageFilter.value = '';
    if (priceFilter) priceFilter.value = '';
    
    // Trigger filter application
    applyCurrentFilters();
}

function handleFilterChange() {
    console.log('📊 Filter changed');
    applyCurrentFilters();
}

function applyCurrentFilters() {
    // Get current filter values
    const locationValue = document.getElementById('locationFilter')?.value || '';
    const languageValue = document.getElementById('languageFilter')?.value || '';
    const priceValue = document.getElementById('priceFilter')?.value || '';
    
    console.log('🎯 Applying filters:', { locationValue, languageValue, priceValue });
    
    // Get current guides from AppState
    if (window.AppState && window.AppState.guides) {
        let filteredGuides = [...window.AppState.guides];
        
        // Apply location filter
        if (locationValue) {
            filteredGuides = filteredGuides.filter(guide => 
                guide.location === locationValue || guide.prefecture === locationValue
            );
        }
        
        // Apply language filter
        if (languageValue) {
            filteredGuides = filteredGuides.filter(guide => 
                guide.languages && guide.languages.includes(languageValue)
            );
        }
        
        // Apply price filter
        if (priceValue) {
            filteredGuides = filteredGuides.filter(guide => {
                const price = guide.price;
                switch(priceValue) {
                    case 'budget': return price >= 6000 && price <= 10000;
                    case 'premium': return price >= 10001 && price <= 20000;
                    case 'luxury': return price >= 20001;
                    default: return true;
                }
            });
        }
        
        console.log(`✅ Filtered: ${filteredGuides.length}/${window.AppState.guides.length} guides`);
        
        // Re-render guide cards with filtered results
        if (window.renderGuideCards) {
            window.renderGuideCards(filteredGuides);
        }
        
        // Update counters using guide-renderer function
        if (window.updateGuideCounters) {
            window.updateGuideCounters(filteredGuides.length, window.AppState.guides.length);
        }
    }
}

// Management center handler
function handleManagementCenter() {
    console.log('🏆 Management center clicked');
    if (window.showManagementCenter) {
        window.showManagementCenter();
    } else {
        alert('管理センターは開発中です');
    }
}