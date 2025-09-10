// Event handlers - centralized setup with AppState support
import { showSponsorLoginModal, showSponsorRegistrationModal } from '../ui/modal.mjs';

// Define filter functions to be exported
function handleSearchAction() {
    console.log('🔍 handleSearchAction called');
    try {
        const location = document.getElementById('locationFilter')?.value || '';
        const language = document.getElementById('languageFilter')?.value || '';
        const price = document.getElementById('priceFilter')?.value || '';
        const keyword = document.getElementById('keywordInput')?.value?.toLowerCase() || '';
        
        console.log('🔍 Filter values:', { location, language, price, keyword });
        
        // Get all guides
        const allGuides = window.defaultGuides || [];
        
        // Apply filters
        let filtered = allGuides.filter(guide => {
            const locationMatch = !location || guide.location === location;
            const languageMatch = !language || (Array.isArray(guide.languages) ? guide.languages.includes(language) : guide.languages === language);
            const priceMatch = !price || (
                price === 'low' && guide.price <= 8000 ||
                price === 'medium' && guide.price > 8000 && guide.price <= 10000 ||
                price === 'high' && guide.price > 10000
            );
            const keywordMatch = !keyword || 
                guide.name.toLowerCase().includes(keyword) ||
                (guide.specialty && guide.specialty.toLowerCase().includes(keyword)) ||
                (guide.description && guide.description.toLowerCase().includes(keyword));
            
            return locationMatch && languageMatch && priceMatch && keywordMatch;
        });
        
        console.log(`✅ Filtered guides: ${filtered.length} out of ${allGuides.length}`);
        
        // Re-render guide cards
        if (window.renderGuideCards) {
            window.renderGuideCards(filtered);
        }
        
        // Update counters
        if (window.updateGuideCounters) {
            window.updateGuideCounters(filtered.length, allGuides.length);
        }
        
    } catch (error) {
        console.error('❌ Filter error:', error);
        alert('検索中にエラーが発生しました');
    }
}

function handleResetFilters() {
    console.log('🔄 handleResetFilters called');
    try {
        // Clear all filter inputs
        const locationFilter = document.getElementById('locationFilter');
        const languageFilter = document.getElementById('languageFilter');
        const priceFilter = document.getElementById('priceFilter');
        const keywordInput = document.getElementById('keywordInput');
        
        if (locationFilter) locationFilter.value = '';
        if (languageFilter) languageFilter.value = '';
        if (priceFilter) priceFilter.value = '';
        if (keywordInput) keywordInput.value = '';
        
        // Reset to show all guides
        const allGuides = window.defaultGuides || [];
        
        if (window.renderGuideCards) {
            window.renderGuideCards(allGuides);
        }
        
        if (window.updateGuideCounters) {
            window.updateGuideCounters(allGuides.length, allGuides.length);
        }
        
        console.log('✅ Filters reset successfully');
        
    } catch (error) {
        console.error('❌ Reset error:', error);
        location.reload();
    }
}

// Export the functions
export { handleSearchAction, handleResetFilters };

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
                // Open registration in centered window
                const width = 800;
                const height = 900;
                const left = (screen.width - width) / 2;
                const top = (screen.height - height) / 2;
                
                window.open(
                    '/tourist-registration-simple.html',
                    'touristRegistration',
                    `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
                );
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
    console.log('🔄 Guide registration selected');
    
    // Get the form container and original form
    const formContainer = document.getElementById('registrationFormContainer');
    const originalForm = document.getElementById('detailedGuideRegistrationForm');
    
    console.log('📋 Form elements check:', {
        formContainer: !!formContainer,
        originalForm: !!originalForm
    });
    
    if (formContainer && originalForm) {
        // Clear choice content and show registration form
        formContainer.innerHTML = '';
        formContainer.appendChild(originalForm);
        formContainer.style.display = 'block';
        originalForm.style.display = 'block';
        
        console.log('✅ Form displayed, initializing handlers...');
        
        // Initialize form handlers immediately instead of timeout
        try {
            initializeRegistrationFormHandlers();
            handleGuideRegistrationSubmit();
            console.log('✅ All handlers initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing handlers:', error);
        }
        
        // Scroll to the form smoothly
        setTimeout(() => {
            formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
    } else {
        console.warn('⚠️ Registration container or form not found');
        alert('登録フォームが見つかりません。');
    }
}

// Add phone verification and file upload handlers
function initializeRegistrationFormHandlers() {
    console.log('🔄 Initializing registration form handlers...');
    
    // Get elements directly - no timeout, no complex selectors
    const sendCodeBtn = document.getElementById('sendVerificationCode');
    const verifyCodeBtn = document.getElementById('verifyPhoneCode');
    const phoneInput = document.getElementById('detailedGuidePhone');
    const codeInput = document.getElementById('verificationCode');
    const statusSpan = document.getElementById('phoneVerificationStatus');
    
    console.log('🔍 Elements check:', {
        sendCodeBtn: !!sendCodeBtn,
        verifyCodeBtn: !!verifyCodeBtn,
        phoneInput: !!phoneInput,
        codeInput: !!codeInput,
        statusSpan: !!statusSpan
    });

    // Setup phone verification - AGGRESSIVE EVENT HANDLING
    if (sendCodeBtn && phoneInput) {
        console.log('📞 Setting up send code button with AGGRESSIVE event methods');
        
        // Test button state in detail
        console.log('🔍 DETAILED button analysis:', {
            id: sendCodeBtn.id,
            tagName: sendCodeBtn.tagName,
            type: sendCodeBtn.type,
            disabled: sendCodeBtn.disabled,
            className: sendCodeBtn.className,
            innerHTML: sendCodeBtn.innerHTML,
            computedStyle: window.getComputedStyle(sendCodeBtn).pointerEvents,
            offsetParent: !!sendCodeBtn.offsetParent,
            clientRect: sendCodeBtn.getBoundingClientRect()
        });
        
        // AGGRESSIVE click handler
        const sendCodeHandler = function(e) {
            console.log('🚨🎯 SEND CODE BUTTON DEFINITELY CLICKED! 🎯🚨');
            alert('電話認証ボタンがクリックされました！'); // Visual confirmation
            e.preventDefault();
            e.stopPropagation();
            
            const phone = phoneInput.value.trim();
            if (!phone) {
                alert('電話番号を入力してください');
                return;
            }
            
            // Send verification code simulation
            sendCodeBtn.disabled = true;
            sendCodeBtn.innerHTML = '<i class="bi bi-hourglass-split me-1"></i>送信中...';
            
            setTimeout(() => {
                sendCodeBtn.innerHTML = '<i class="bi bi-check me-1"></i>送信完了';
                if (statusSpan) {
                    statusSpan.textContent = '認証コードを送信しました';
                    statusSpan.className = 'text-success ms-3';
                }
                if (codeInput) codeInput.disabled = false;
                if (verifyCodeBtn) verifyCodeBtn.disabled = false;
                console.log('✅ Code sent successfully');
            }, 2000);
        };
        
        // Remove ALL existing event listeners first
        sendCodeBtn.removeAttribute('onclick');
        
        // Set up MULTIPLE aggressive event listeners
        sendCodeBtn.onclick = sendCodeHandler;
        sendCodeBtn.addEventListener('click', sendCodeHandler, true); // Use capture phase
        sendCodeBtn.addEventListener('mousedown', sendCodeHandler);
        sendCodeBtn.addEventListener('touchstart', sendCodeHandler);
        sendCodeBtn.addEventListener('pointerdown', sendCodeHandler);
        
        // Add debugging listeners
        sendCodeBtn.addEventListener('mouseenter', () => console.log('🖱️ Mouse ENTERED send code button'));
        sendCodeBtn.addEventListener('mouseover', () => console.log('🖱️ Mouse OVER send code button'));
        sendCodeBtn.addEventListener('mousedown', () => console.log('🖱️ Mouse DOWN on send code button'));
        
        // Force style to ensure clickability
        sendCodeBtn.style.pointerEvents = 'auto';
        sendCodeBtn.style.cursor = 'pointer';
        
        console.log('✅ AGGRESSIVE send code handler attached');
    }

    if (verifyCodeBtn && codeInput) {
        console.log('🔐 Setting up verify button with multiple event methods');
        
        // Test button accessibility
        console.log('🔍 Testing verify button accessibility:', {
            id: verifyCodeBtn.id,
            disabled: verifyCodeBtn.disabled,
            offsetParent: !!verifyCodeBtn.offsetParent
        });
        
        const verifyHandler = function(e) {
            console.log('🎯 VERIFY BUTTON ACTUALLY CLICKED!');
            e.preventDefault();
            e.stopPropagation();
            
            const code = codeInput.value.trim();
            if (!code || code.length !== 6) {
                alert('6桁の認証コードを入力してください');
                return;
            }
            
            // Verification simulation
            verifyCodeBtn.disabled = true;
            verifyCodeBtn.innerHTML = '<i class="bi bi-hourglass-split me-1"></i>認証中...';
            
            setTimeout(() => {
                verifyCodeBtn.innerHTML = '<i class="bi bi-check-circle me-1"></i>認証完了';
                verifyCodeBtn.className = 'btn btn-success';
                
                if (statusSpan) {
                    statusSpan.textContent = '電話番号の認証が完了しました';
                    statusSpan.className = 'text-success ms-3';
                }
                if (phoneInput) {
                    phoneInput.style.backgroundColor = '#d4edda';
                    phoneInput.setAttribute('data-verified', 'true');
                }
                if (codeInput) codeInput.style.backgroundColor = '#d4edda';
                
                console.log('✅ Phone verification completed');
            }, 1500);
        };
        
        // Multiple event methods
        verifyCodeBtn.onclick = verifyHandler;
        verifyCodeBtn.addEventListener('click', verifyHandler);
        verifyCodeBtn.addEventListener('touchstart', verifyHandler);
        
        console.log('✅ Verify handler attached with multiple methods');
    }

    // Setup cancel buttons - AGGRESSIVE EVENT HANDLING
    const cancelButtons = document.querySelectorAll('button');
    cancelButtons.forEach(btn => {
        if (btn.textContent && btn.textContent.includes('キャンセル')) {
            console.log('🛑 Found cancel button:', btn.textContent.trim());
            
            // Detailed button analysis
            console.log('🔍 DETAILED cancel button analysis:', {
                text: btn.textContent.trim(),
                tagName: btn.tagName,
                type: btn.type,
                disabled: btn.disabled,
                className: btn.className,
                computedStyle: window.getComputedStyle(btn).pointerEvents,
                offsetParent: !!btn.offsetParent,
                clientRect: btn.getBoundingClientRect()
            });
            
            const cancelHandler = function(e) {
                console.log('🚨🎯 CANCEL BUTTON DEFINITELY CLICKED! 🎯🚨');
                alert('キャンセルボタンがクリックされました！'); // Visual confirmation
                e.preventDefault();
                e.stopPropagation();
                hideRegistrationForm();
            };
            
            // Remove existing event listeners
            btn.removeAttribute('onclick');
            
            // AGGRESSIVE event setup
            btn.onclick = cancelHandler;
            btn.addEventListener('click', cancelHandler, true); // Use capture phase
            btn.addEventListener('mousedown', cancelHandler);
            btn.addEventListener('touchstart', cancelHandler);
            btn.addEventListener('pointerdown', cancelHandler);
            
            // Debug listeners
            btn.addEventListener('mouseenter', () => console.log('🖱️ Mouse ENTERED cancel button'));
            btn.addEventListener('mouseover', () => console.log('🖱️ Mouse OVER cancel button'));
            btn.addEventListener('mousedown', () => console.log('🖱️ Mouse DOWN on cancel button'));
            
            // Force clickability
            btn.style.pointerEvents = 'auto';
            btn.style.cursor = 'pointer';
            
            console.log('✅ AGGRESSIVE cancel handler attached');
        }
    });

    // File uploads
    setupFileUploads();
    
    // EMERGENCY DOCUMENT-LEVEL EVENT DELEGATION
    console.log('🚨 Setting up DOCUMENT-LEVEL event delegation as fallback');
    
    // Remove any existing document listeners first
    document.removeEventListener('click', globalClickHandler);
    
    // Add global click handler
    document.addEventListener('click', globalClickHandler, true);
    
    console.log('✅ Document-level emergency handlers attached');
}

// Global click handler for ALL clicks
function globalClickHandler(e) {
    const target = e.target;
    const targetInfo = {
        tagName: target.tagName,
        id: target.id,
        className: target.className,
        textContent: target.textContent?.trim() || '',
        type: target.type
    };
    
    console.log('🌍 GLOBAL CLICK DETECTED:', targetInfo);
    
    // Check for send verification code button
    if (target.id === 'sendVerificationCode' || 
        (target.textContent && target.textContent.includes('認証コード送信'))) {
        console.log('🚨🎯 EMERGENCY: Send verification code button clicked via GLOBAL handler!');
        alert('🚨 緊急検出: 電話認証ボタンがクリックされました！');
        
        const phoneInput = document.getElementById('detailedGuidePhone');
        if (phoneInput && phoneInput.value.trim()) {
            target.disabled = true;
            target.innerHTML = '<i class="bi bi-hourglass-split me-1"></i>送信中...';
            
            setTimeout(() => {
                target.innerHTML = '<i class="bi bi-check me-1"></i>送信完了';
                const statusSpan = document.getElementById('phoneVerificationStatus');
                if (statusSpan) {
                    statusSpan.textContent = '認証コードを送信しました';
                    statusSpan.className = 'text-success ms-3';
                }
                const codeInput = document.getElementById('verificationCode');
                const verifyBtn = document.getElementById('verifyPhoneCode');
                if (codeInput) codeInput.disabled = false;
                if (verifyBtn) verifyBtn.disabled = false;
            }, 2000);
        } else {
            alert('電話番号を入力してください');
        }
        
        e.preventDefault();
        e.stopPropagation();
        return;
    }
    
    // Check for verify button
    if (target.id === 'verifyPhoneCode' || 
        (target.textContent && target.textContent.includes('電話番号を認証'))) {
        console.log('🚨🎯 EMERGENCY: Verify button clicked via GLOBAL handler!');
        alert('🚨 緊急検出: 認証確認ボタンがクリックされました！');
        
        const codeInput = document.getElementById('verificationCode');
        if (codeInput && codeInput.value.trim().length === 6) {
            target.disabled = true;
            target.innerHTML = '<i class="bi bi-hourglass-split me-1"></i>認証中...';
            
            setTimeout(() => {
                target.innerHTML = '<i class="bi bi-check-circle me-1"></i>認証完了';
                target.className = 'btn btn-success';
                
                const statusSpan = document.getElementById('phoneVerificationStatus');
                const phoneInput = document.getElementById('detailedGuidePhone');
                
                if (statusSpan) {
                    statusSpan.textContent = '電話番号の認証が完了しました';
                    statusSpan.className = 'text-success ms-3';
                }
                if (phoneInput) {
                    phoneInput.style.backgroundColor = '#d4edda';
                    phoneInput.setAttribute('data-verified', 'true');
                }
                if (codeInput) codeInput.style.backgroundColor = '#d4edda';
            }, 1500);
        } else {
            alert('6桁の認証コードを入力してください');
        }
        
        e.preventDefault();
        e.stopPropagation();
        return;
    }
    
    // Check for cancel button
    if (target.textContent && target.textContent.includes('キャンセル')) {
        console.log('🚨🎯 EMERGENCY: Cancel button clicked via GLOBAL handler!');
        alert('🚨 緊急検出: キャンセルボタンがクリックされました！');
        hideRegistrationForm();
        
        e.preventDefault();
        e.stopPropagation();
        return;
    }
}

// Setup cancel button handlers (OLD FUNCTION - KEPT FOR COMPATIBILITY)
function setupCancelButtons(cancelButtons) {
    cancelButtons.forEach((cancelBtn, index) => {
        if (!cancelBtn) return;
        
        console.log(`🔄 Setting up cancel button ${index + 1}: "${cancelBtn.textContent.trim()}"`);
        
        // Remove all existing event attributes
        cancelBtn.removeAttribute('onclick');
        cancelBtn.removeAttribute('data-dismiss');
        
        // Clone to remove all event listeners
        const newCancelBtn = cancelBtn.cloneNode(true);
        if (cancelBtn.parentNode) {
            cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
        }
        
        // Add new event listener
        newCancelBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log(`❌ Cancel button ${index + 1} clicked`);
            hideRegistrationForm();
        });
        
        console.log(`✅ Cancel button ${index + 1} event listener attached`);
    });
}

// Setup phone verification handlers
function setupPhoneVerification(sendCodeBtn, verifyCodeBtn, phoneInput, codeInput, statusSpan) {

    if (sendCodeBtn && phoneInput) {
        console.log('🔄 Setting up send verification code button');
        
        // Clone button to remove all existing listeners
        const newSendCodeBtn = sendCodeBtn.cloneNode(true);
        if (sendCodeBtn.parentNode) {
            sendCodeBtn.parentNode.replaceChild(newSendCodeBtn, sendCodeBtn);
        }
        
        newSendCodeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('📞 Send verification code button clicked');
            
            const phone = phoneInput.value.trim();
            if (!phone) {
                alert('電話番号を入力してください');
                return;
            }
            
            // Simulate sending verification code
            newSendCodeBtn.disabled = true;
            newSendCodeBtn.innerHTML = '<i class="bi bi-hourglass-split me-1"></i>送信中...';
            
            setTimeout(() => {
                newSendCodeBtn.innerHTML = '<i class="bi bi-check me-1"></i>送信完了';
                if (statusSpan) {
                    statusSpan.textContent = '認証コードを送信しました';
                    statusSpan.className = 'text-success ms-3';
                }
                
                // Enable verification input and button
                if (codeInput) codeInput.disabled = false;
                if (verifyCodeBtn) verifyCodeBtn.disabled = false;
                
                console.log('✅ Verification code sent successfully');
            }, 2000);
        });
        
        console.log('✅ Send code button event listener attached');
    } else {
        console.warn('⚠️ Send code button or phone input not found');
    }
    
    if (verifyCodeBtn && codeInput) {
        console.log('🔄 Setting up verify code button');
        // Remove existing event listeners by cloning the node
        const newVerifyCodeBtn = verifyCodeBtn.cloneNode(true);
        verifyCodeBtn.parentNode.replaceChild(newVerifyCodeBtn, verifyCodeBtn);
        
        newVerifyCodeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔐 Verify code button clicked');
            const code = codeInput.value.trim();
            if (!code || code.length !== 6) {
                alert('6桁の認証コードを入力してください');
                return;
            }
            
            // Simulate verification
            newVerifyCodeBtn.disabled = true;
            newVerifyCodeBtn.innerHTML = '<i class="bi bi-hourglass-split me-1"></i>認証中...';
            
            setTimeout(() => {
                newVerifyCodeBtn.innerHTML = '<i class="bi bi-check-circle me-1"></i>認証完了';
                newVerifyCodeBtn.className = 'btn btn-success';
                
                // Re-find elements after DOM manipulation
                const currentStatusSpan = document.getElementById('phoneVerificationStatus');
                const currentPhoneInput = document.getElementById('detailedGuidePhone');
                const currentCodeInput = document.getElementById('verificationCode');
                
                if (currentStatusSpan) {
                    currentStatusSpan.textContent = '電話番号の認証が完了しました';
                    currentStatusSpan.className = 'text-success ms-3';
                }
                
                if (currentPhoneInput) {
                    currentPhoneInput.style.backgroundColor = '#d4edda';
                    currentPhoneInput.setAttribute('data-verified', 'true');
                }
                if (currentCodeInput) currentCodeInput.style.backgroundColor = '#d4edda';
                
                console.log('✅ Phone verification completed successfully');
            }, 1500);
        });
        console.log('✅ Verify code button event listener attached');
    } else {
        console.warn('⚠️ Verify code button or code input not found');
    }
}

// Setup file upload handlers
function setupFileUploads() {
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
    console.log('🛑 Hiding registration form...');
    
    const formContainer = document.getElementById('registrationFormContainer');
    const guideCardPreviewArea = document.getElementById('guideCardPreviewArea');
    const profilePhotoPreviewCard = document.getElementById('profilePhotoPreviewCard');
    const originalForm = document.getElementById('detailedGuideRegistrationForm');
    
    // Reset form if it exists and is actually a form element
    if (originalForm) {
        console.log('🔍 originalForm element found:', {
            tagName: originalForm.tagName,
            hasResetMethod: typeof originalForm.reset === 'function'
        });
        
        if (typeof originalForm.reset === 'function') {
            originalForm.reset();
            console.log('🔄 Form reset using .reset()');
        } else {
            // Manual reset for non-form elements
            const inputs = originalForm.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                if (input.type === 'checkbox' || input.type === 'radio') {
                    input.checked = false;
                } else {
                    input.value = '';
                }
            });
            console.log('🔄 Form reset manually');
        }
        
        // IMPORTANT: Move form back to its original location instead of deleting it
        originalForm.style.display = 'none';
        
        // Find the original parent and move the form back
        const originalParent = document.body; // Move to body as a safe location
        if (originalForm.parentNode !== originalParent) {
            originalParent.appendChild(originalForm);
            console.log('🔄 Form moved back to original location');
        }
    }
    
    // Hide form container but don't clear innerHTML to preserve the form element
    if (formContainer) {
        formContainer.style.display = 'none';
        // Instead of innerHTML = '', just hide it
        console.log('✅ Registration form container hidden');
    }
    
    // Hide guide card preview area
    if (guideCardPreviewArea) {
        guideCardPreviewArea.style.display = 'none';
        console.log('✅ Guide card preview area hidden');
    }
    
    // Hide profile photo preview
    if (profilePhotoPreviewCard) {
        profilePhotoPreviewCard.style.display = 'none';
    }
    
    // Clear any form data and reset preview states
    const profilePhotoPreview = document.getElementById('profilePhotoPreview');
    if (profilePhotoPreview) {
        profilePhotoPreview.src = '';
    }
    
    console.log('✅ hideRegistrationForm completed - form preserved for reuse');
}

// Generate unique guide ID
function generateGuideId() {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 7);
    return `GD-${timestamp}-${randomStr}`.toUpperCase();
}

// Handle guide registration form submission
function handleGuideRegistrationSubmit() {
    const form = document.getElementById('detailedGuideRegistrationForm');
    if (!form) return;
    
    // Remove existing event listeners to prevent duplicates
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    newForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate phone verification
        const phoneInput = document.getElementById('detailedGuidePhone');
        if (!phoneInput.getAttribute('data-verified')) {
            alert('電話認証を完了してください');
            return;
        }
        
        // Validate document uploads
        const documentUploads = document.querySelectorAll('.document-upload');
        for (let upload of documentUploads) {
            if (!upload.files || !upload.files[0]) {
                alert('すべての身分証明書をアップロードしてください');
                return;
            }
        }
        
        // Generate unique guide ID and show registration success
        const guideId = generateGuideId();
        const guideName = document.getElementById('detailedGuideName').value;
        
        // Show registration success modal with ID
        showRegistrationSuccessModal(guideId, guideName);
        
        // Save guide data (basic implementation)
        saveGuideRegistrationData(guideId);
        
        // Clear form
        newForm.reset();
        hideRegistrationForm();
    });
}

// Show registration success modal with ID
function showRegistrationSuccessModal(guideId, guideName) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.registration-success-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal fade registration-success-modal';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content" style="border-radius: 20px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);">
                <div class="modal-header border-0" style="background: linear-gradient(135deg, #28a745, #20c997); color: white; border-radius: 20px 20px 0 0;">
                    <h5 class="modal-title fw-bold">
                        <i class="bi bi-check-circle me-2"></i>ガイド登録申請完了
                    </h5>
                </div>
                <div class="modal-body p-4 text-center">
                    <div class="mb-4">
                        <i class="bi bi-person-badge text-success" style="font-size: 4rem;"></i>
                    </div>
                    <h4 class="text-success mb-3">おめでとうございます！</h4>
                    <p class="mb-4">${guideName}さんのガイド登録申請が正常に受理されました。</p>
                    
                    <div class="alert alert-info" style="border-radius: 15px;">
                        <h6 class="fw-bold mb-3">あなたのガイドID</h6>
                        <div class="input-group mb-3">
                            <input type="text" class="form-control fs-5 fw-bold text-center" value="${guideId}" readonly>
                            <button class="btn btn-outline-secondary" onclick="copyToClipboard('${guideId}')">
                                <i class="bi bi-copy"></i> コピー
                            </button>
                        </div>
                        <small class="text-muted">このIDを安全に保管してください。ログイン時に必要です。</small>
                    </div>
                    
                    <div class="mb-4">
                        <h6 class="fw-bold mb-3">パスワードを設定してください</h6>
                        <div class="row g-3">
                            <div class="col-12">
                                <input type="password" class="form-control" id="newGuidePassword" placeholder="パスワード（8文字以上）" minlength="8">
                            </div>
                            <div class="col-12">
                                <input type="password" class="form-control" id="confirmGuidePassword" placeholder="パスワード（確認）">
                            </div>
                        </div>
                    </div>
                    
                    <div class="d-grid gap-2">
                        <button type="button" class="btn btn-success btn-lg" onclick="completeRegistration('${guideId}')">
                            <i class="bi bi-check-circle me-2"></i>パスワード設定完了
                        </button>
                    </div>
                    
                    <hr class="my-4">
                    
                    <div class="mb-4">
                        <h6 class="fw-bold mb-3 text-center">あなたのガイドカードプレビュー</h6>
                        <div class="border rounded-3 p-2" style="background-color: #f8f9fa;">
                            <div id="modalGuideCardPreview" class="card shadow-sm border-0" style="border-radius: 10px; overflow: hidden; max-height: 300px; overflow-y: auto;">
                                <!-- Guide card will be inserted here -->
                            </div>
                        </div>
                        <div class="text-center mt-2">
                            <small class="text-muted">
                                <i class="bi bi-info-circle me-1"></i>
                                これが観光客に表示されるあなたのガイドカードです
                            </small>
                        </div>
                    </div>
                    
                    <div class="text-start">
                        <h6 class="fw-bold mb-2">次のステップ：</h6>
                        <ol class="small text-muted">
                            <li>審査結果をお待ちください（通常1-2営業日）</li>
                            <li>承認後、ログインボタンからプロフィール編集が可能になります</li>
                            <li>魅力的なプロフィールを作成してガイド活動を開始しましょう</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
    
    // Generate guide card for the modal after modal is shown
    setTimeout(() => {
        generateModalGuideCard();
    }, 500);
    
    // Clean up when modal is hidden
    modal.addEventListener('hidden.bs.modal', function() {
        modal.remove();
    });
}

// Complete guide registration with password
function completeRegistration(guideId) {
    const password = document.getElementById('newGuidePassword').value;
    const confirmPassword = document.getElementById('confirmGuidePassword').value;
    
    if (!password || password.length < 8) {
        alert('パスワードは8文字以上で設定してください');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('パスワードが一致しません');
        return;
    }
    
    // Save password (basic implementation)
    saveGuidePassword(guideId, password);
    
    alert('ガイド登録が完了しました！IDとパスワードを大切に保管してください。');
    
    // Close modal
    const modal = document.querySelector('.registration-success-modal');
    if (modal) {
        const bootstrapModal = bootstrap.Modal.getInstance(modal);
        bootstrapModal.hide();
    }
}

// Copy guide ID to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('ガイドIDをクリップボードにコピーしました');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('ガイドIDをクリップボードにコピーしました');
    });
}

// Save guide registration data (basic localStorage implementation)
function saveGuideRegistrationData(guideId) {
    const guideData = {
        id: guideId,
        name: document.getElementById('detailedGuideName').value,
        email: document.getElementById('detailedGuideEmail').value,
        phone: document.getElementById('detailedGuidePhone').value,
        gender: document.getElementById('detailedGuideGender').value,
        age: document.getElementById('detailedGuideAge').value,
        experience: document.getElementById('detailedGuideExperience').value,
        languages: Array.from(document.getElementById('detailedGuideLanguages').selectedOptions).map(option => option.value),
        introduction: document.getElementById('detailedGuideIntroduction').value,
        specialties: document.getElementById('detailedGuideSpecialties').value,
        sessionRate: document.getElementById('detailedGuideSessionRate').value,
        availability: document.getElementById('detailedGuideAvailability').value,
        documentType: document.getElementById('documentType').value,
        status: 'pending_review',
        registrationDate: new Date().toISOString()
    };
    
    // Save to localStorage (in real app, this would be sent to backend)
    const guides = JSON.parse(localStorage.getItem('registeredGuides') || '[]');
    guides.push(guideData);
    localStorage.setItem('registeredGuides', JSON.stringify(guides));
}

// Save guide password (basic localStorage implementation)
function saveGuidePassword(guideId, password) {
    const guideCredentials = JSON.parse(localStorage.getItem('guideCredentials') || '{}');
    guideCredentials[guideId] = password;
    localStorage.setItem('guideCredentials', JSON.stringify(guideCredentials));
}

// Profile photo preview functionality
function previewProfilePhoto(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewCard = document.getElementById('profilePhotoPreviewCard');
            const preview = document.getElementById('profilePhotoPreview');
            
            if (preview && previewCard) {
                preview.src = e.target.result;
                previewCard.style.display = 'block';
                
                // Update guide card preview if it's visible
                if (document.getElementById('guideCardPreviewArea').style.display !== 'none') {
                    updateGuideCardPreview();
                }
            }
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Show guide card preview
function showGuideCardPreview() {
    const previewArea = document.getElementById('guideCardPreviewArea');
    if (previewArea) {
        previewArea.style.display = 'block';
        updateGuideCardPreview();
        
        // Scroll to preview
        setTimeout(() => {
            previewArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
    }
}

// Update guide card preview with current form data
function updateGuideCardPreview() {
    const cardPreview = document.getElementById('guideCardPreview');
    if (!cardPreview) return;
    
    // Get form data
    const name = document.getElementById('detailedGuideName')?.value || '山田太郎';
    const introduction = document.getElementById('detailedGuideIntroduction')?.value || 'こんにちは！地元を愛するガイドです。';
    const specialties = document.getElementById('detailedGuideSpecialties')?.value || '観光案内、文化体験';
    const sessionRate = document.getElementById('detailedGuideSessionRate')?.value || '8000';
    const availability = document.getElementById('detailedGuideAvailability')?.value || 'both';
    
    // Get languages
    const languageSelect = document.getElementById('detailedGuideLanguages');
    const selectedLanguages = languageSelect ? Array.from(languageSelect.selectedOptions).map(option => option.text) : ['日本語', '英語'];
    const languageText = selectedLanguages.length > 0 ? selectedLanguages.join('、') : '日本語、英語';
    
    // Get profile photo
    const profilePhotoPreview = document.getElementById('profilePhotoPreview');
    const profilePhotoSrc = profilePhotoPreview?.src || 'https://via.placeholder.com/300x200/20c997/white?text=プロフィール写真';
    
    // Generate availability text
    const availabilityText = {
        'weekdays': '平日のみ',
        'weekends': '週末のみ',
        'both': '平日・週末対応可能'
    }[availability] || '要相談';
    
    // Create guide card HTML
    cardPreview.innerHTML = `
        <div class="position-relative">
            <img src="${profilePhotoSrc}" class="card-img-top" style="height: 200px; object-fit: cover;" alt="${name}のプロフィール写真">
            <div class="position-absolute top-0 end-0 m-2">
                <span class="badge bg-success fs-6">¥${parseInt(sessionRate).toLocaleString()}/セッション</span>
            </div>
        </div>
        <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                    <h5 class="card-title mb-1 fw-bold">${name}</h5>
                    <div class="text-muted small mb-2">
                        <i class="bi bi-geo-alt me-1"></i>東京都内
                        <span class="ms-3"><i class="bi bi-clock me-1"></i>${availabilityText}</span>
                    </div>
                </div>
                <div class="text-end">
                    <div class="d-flex align-items-center">
                        <span class="text-warning me-1">★★★★★</span>
                        <span class="small text-muted">(4.8)</span>
                    </div>
                    <small class="text-muted">12件のレビュー</small>
                </div>
            </div>
            
            <div class="mb-3">
                <h6 class="fw-bold text-primary mb-2">
                    <i class="bi bi-chat-dots me-2"></i>自己紹介
                </h6>
                <p class="text-muted small mb-0" style="line-height: 1.5;">${introduction}</p>
            </div>
            
            <div class="mb-3">
                <h6 class="fw-bold text-success mb-2">
                    <i class="bi bi-star me-2"></i>得意分野
                </h6>
                <p class="text-muted small mb-0">${specialties}</p>
            </div>
            
            <div class="mb-3">
                <h6 class="fw-bold text-info mb-2">
                    <i class="bi bi-translate me-2"></i>対応言語
                </h6>
                <div class="d-flex flex-wrap gap-1">
                    ${selectedLanguages.map(lang => `<span class="badge bg-light text-dark border">${lang}</span>`).join('')}
                </div>
            </div>
            
            <div class="d-grid gap-2 mt-4">
                <button class="btn btn-primary">
                    <i class="bi bi-calendar-check me-2"></i>予約する
                </button>
                <div class="row g-2">
                    <div class="col-6">
                        <button class="btn btn-outline-danger btn-sm w-100">
                            <i class="bi bi-heart me-1"></i>お気に入り
                        </button>
                    </div>
                    <div class="col-6">
                        <button class="btn btn-outline-info btn-sm w-100">
                            <i class="bi bi-graph-up me-1"></i>比較
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Generate guide card for success modal
function generateModalGuideCard() {
    const modalCardPreview = document.getElementById('modalGuideCardPreview');
    if (!modalCardPreview) return;
    
    // Get form data
    const name = document.getElementById('detailedGuideName')?.value || '山田太郎';
    const introduction = document.getElementById('detailedGuideIntroduction')?.value || 'こんにちは！地元を愛するガイドです。';
    const specialties = document.getElementById('detailedGuideSpecialties')?.value || '観光案内、文化体験';
    const sessionRate = document.getElementById('detailedGuideSessionRate')?.value || '8000';
    const availability = document.getElementById('detailedGuideAvailability')?.value || 'both';
    
    // Get languages
    const languageSelect = document.getElementById('detailedGuideLanguages');
    const selectedLanguages = languageSelect ? Array.from(languageSelect.selectedOptions).map(option => option.text) : ['日本語', '英語'];
    
    // Get profile photo
    const profilePhotoPreview = document.getElementById('profilePhotoPreview');
    const profilePhotoSrc = profilePhotoPreview?.src || 'https://via.placeholder.com/300x150/20c997/white?text=プロフィール写真';
    
    // Generate availability text
    const availabilityText = {
        'weekdays': '平日のみ',
        'weekends': '週末のみ',
        'both': '平日・週末対応可能'
    }[availability] || '要相談';
    
    // Create compact guide card HTML for modal
    modalCardPreview.innerHTML = `
        <div class="position-relative">
            <img src="${profilePhotoSrc}" class="card-img-top" style="height: 120px; object-fit: cover;" alt="${name}のプロフィール写真">
            <div class="position-absolute top-0 end-0 m-2">
                <span class="badge bg-success">¥${parseInt(sessionRate).toLocaleString()}/セッション</span>
            </div>
        </div>
        <div class="card-body p-3">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                    <h6 class="card-title mb-1 fw-bold">${name}</h6>
                    <div class="text-muted small">
                        <i class="bi bi-geo-alt me-1"></i>東京都内
                        <span class="ms-2"><i class="bi bi-clock me-1"></i>${availabilityText}</span>
                    </div>
                </div>
                <div class="text-end">
                    <div class="d-flex align-items-center">
                        <span class="text-warning me-1">★★★★★</span>
                        <span class="small text-muted">(4.8)</span>
                    </div>
                </div>
            </div>
            
            <div class="mb-2">
                <h6 class="fw-bold text-primary mb-1 small">
                    <i class="bi bi-chat-dots me-1"></i>自己紹介
                </h6>
                <p class="text-muted small mb-0" style="line-height: 1.4;">${introduction}</p>
            </div>
            
            <div class="mb-2">
                <h6 class="fw-bold text-success mb-1 small">
                    <i class="bi bi-star me-1"></i>得意分野
                </h6>
                <p class="text-muted small mb-0">${specialties}</p>
            </div>
            
            <div class="mb-3">
                <h6 class="fw-bold text-info mb-1 small">
                    <i class="bi bi-translate me-1"></i>対応言語
                </h6>
                <div class="d-flex flex-wrap gap-1">
                    ${selectedLanguages.map(lang => `<span class="badge bg-light text-dark border small">${lang}</span>`).join('')}
                </div>
            </div>
            
            <div class="d-grid">
                <button class="btn btn-primary btn-sm">
                    <i class="bi bi-calendar-check me-1"></i>予約する
                </button>
            </div>
        </div>
    `;
}

// Login System Functions
function setupLoginDropdown() {
    const loginDropdown = document.getElementById('loginDropdown');
    const customLoginDropdown = document.getElementById('customLoginDropdown');
    
    if (loginDropdown && customLoginDropdown) {
        // Toggle dropdown visibility
        loginDropdown.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isVisible = customLoginDropdown.style.display === 'block';
            customLoginDropdown.style.display = isVisible ? 'none' : 'block';
        });
        
        // Hide dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!loginDropdown.contains(e.target) && !customLoginDropdown.contains(e.target)) {
                customLoginDropdown.style.display = 'none';
            }
        });
        
        console.log('✅ Login dropdown setup complete');
    }
}

// Handle tourist login button click
function handleTouristLogin() {
    console.log('🔄 Tourist login clicked');
    
    // Hide dropdown
    const customLoginDropdown = document.getElementById('customLoginDropdown');
    if (customLoginDropdown) {
        customLoginDropdown.style.display = 'none';
    }
    
    // Show tourist login modal
    const touristModal = new bootstrap.Modal(document.getElementById('touristLoginModal'));
    touristModal.show();
}

// Handle guide login button click
function handleGuideLogin() {
    console.log('🔄 Guide login clicked');
    
    // Hide dropdown
    const customLoginDropdown = document.getElementById('customLoginDropdown');
    if (customLoginDropdown) {
        customLoginDropdown.style.display = 'none';
    }
    
    // Show guide login modal
    const guideModal = new bootstrap.Modal(document.getElementById('guideLoginModal'));
    guideModal.show();
}

// Setup login form handlers
function setupLoginForms() {
    // Tourist login form
    const touristLoginForm = document.getElementById('touristLoginForm');
    if (touristLoginForm) {
        touristLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('touristEmail').value.trim();
            const password = document.getElementById('touristPassword').value.trim();
            
            if (!email || !password) {
                alert('メールアドレスとパスワードを入力してください');
                return;
            }
            
            // Simulate login process
            console.log('🔐 Tourist login attempt:', { email });
            
            // Store login state
            localStorage.setItem('tomotrip_user_type', 'tourist');
            localStorage.setItem('tomotrip_user_email', email);
            localStorage.setItem('tomotrip_login_time', Date.now().toString());
            
            // Show success and check for pending guide view
            const pendingGuideId = sessionStorage.getItem('pending_guide_view');
            
            if (pendingGuideId) {
                alert(`ログインに成功しました！\n\n${pendingGuideId}さんの詳細を表示します。`);
                
                // Clear pending guide
                sessionStorage.removeItem('pending_guide_view');
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('touristLoginModal'));
                modal.hide();
                
                // Show the guide details after a brief delay
                setTimeout(() => {
                    showGuideDetailsModal(pendingGuideId);
                }, 500);
            } else {
                alert('ログインに成功しました！\n\n全てのガイドカード詳細が閲覧可能になりました。');
                
                // Close modal and reload
                const modal = bootstrap.Modal.getInstance(document.getElementById('touristLoginModal'));
                modal.hide();
                
                setTimeout(() => {
                    location.reload();
                }, 500);
            }
        });
    }
    
    // Guide login form
    const guideLoginForm = document.getElementById('guideLoginForm');
    if (guideLoginForm) {
        guideLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const guideId = document.getElementById('guideId').value.trim().toUpperCase();
            const password = document.getElementById('guidePassword').value.trim();
            
            if (!guideId || !password) {
                alert('ガイドIDとパスワードを入力してください');
                return;
            }
            
            // Validate guide ID format
            if (!guideId.match(/^GD-[A-Z0-9]+-[A-Z0-9]+$/)) {
                alert('ガイドIDの形式が正しくありません\n正しい形式: GD-XXXXXXXXXX-XXXXX');
                return;
            }
            
            // Simulate login process
            console.log('🔐 Guide login attempt:', { guideId });
            
            // Store login state
            localStorage.setItem('tomotrip_user_type', 'guide');
            localStorage.setItem('tomotrip_guide_id', guideId);
            localStorage.setItem('tomotrip_login_time', Date.now().toString());
            
            // Show success and redirect to guide dashboard
            alert(`ガイドログインに成功しました！\n\nガイドID: ${guideId}\n\nガイド管理画面に移動します。`);
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('guideLoginModal'));
            modal.hide();
            
            setTimeout(() => {
                // In future, redirect to guide dashboard
                // For now, just reload
                location.reload();
            }, 500);
        });
    }
    
    // Registration redirect buttons
    const showTouristRegistration = document.getElementById('showTouristRegistration');
    if (showTouristRegistration) {
        showTouristRegistration.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close login modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('touristLoginModal'));
            modal.hide();
            
            // Show registration choice
            setTimeout(() => {
                const registerBtn = document.getElementById('registerBtn');
                if (registerBtn) {
                    registerBtn.click();
                }
            }, 300);
        });
    }
    
    const showGuideRegistration = document.getElementById('showGuideRegistration');
    if (showGuideRegistration) {
        showGuideRegistration.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close login modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('guideLoginModal'));
            modal.hide();
            
            // Show registration choice and select guide registration
            setTimeout(() => {
                const registerBtn = document.getElementById('registerBtn');
                if (registerBtn) {
                    registerBtn.click();
                    
                    // Wait for registration choice modal to show, then click guide registration
                    setTimeout(() => {
                        const guideRegChoice = document.querySelector('.choice-card[onclick*="openGuideRegistration"]');
                        if (guideRegChoice) {
                            guideRegChoice.click();
                        }
                    }, 500);
                }
            }, 300);
        });
    }
    
    console.log('✅ Login forms setup complete');
}

// Check if user is logged in and update UI accordingly
function updateLoginStatus() {
    const userType = localStorage.getItem('tomotrip_user_type');
    const loginTime = localStorage.getItem('tomotrip_login_time');
    
    if (userType && loginTime) {
        // Check if login is still valid (24 hours)
        const loginAge = Date.now() - parseInt(loginTime);
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        if (loginAge > maxAge) {
            // Login expired, clear storage
            localStorage.removeItem('tomotrip_user_type');
            localStorage.removeItem('tomotrip_user_email');
            localStorage.removeItem('tomotrip_guide_id');
            localStorage.removeItem('tomotrip_login_time');
            return;
        }
        
        // Update header to show logged in state
        const loginDropdown = document.getElementById('loginDropdown');
        if (loginDropdown) {
            if (userType === 'tourist') {
                const email = localStorage.getItem('tomotrip_user_email');
                loginDropdown.innerHTML = `<i class="bi bi-person-check me-1"></i>観光客 (${email?.substring(0, 10)}...)`;
                loginDropdown.className = 'btn btn-success dropdown-toggle';
            } else if (userType === 'guide') {
                const guideId = localStorage.getItem('tomotrip_guide_id');
                loginDropdown.innerHTML = `<i class="bi bi-person-badge me-1"></i>ガイド (${guideId?.substring(0, 10)}...)`;
                loginDropdown.className = 'btn btn-warning dropdown-toggle';
            }
        }
        
        console.log('✅ User logged in as:', userType);
    }
}

// Check authentication status
function checkAuthenticationStatus() {
    const userType = localStorage.getItem('tomotrip_user_type');
    const loginTime = localStorage.getItem('tomotrip_login_time');
    
    if (!userType || !loginTime) {
        return { authenticated: false, reason: 'not_logged_in' };
    }
    
    // Check if login is still valid (24 hours)
    const loginAge = Date.now() - parseInt(loginTime);
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    if (loginAge > maxAge) {
        // Login expired, clear storage
        localStorage.removeItem('tomotrip_user_type');
        localStorage.removeItem('tomotrip_user_email');
        localStorage.removeItem('tomotrip_guide_id');
        localStorage.removeItem('tomotrip_login_time');
        return { authenticated: false, reason: 'expired' };
    }
    
    return { authenticated: true, userType: userType };
}

// Handle guide details view with authentication check
function viewGuideDetails(guideId) {
    console.log('🔍 Viewing guide details for:', guideId);
    
    const authStatus = checkAuthenticationStatus();
    
    if (!authStatus.authenticated) {
        console.log('🚫 Authentication required for guide details');
        showAuthRequiredModal(guideId);
        return;
    }
    
    // User is authenticated, show guide details
    showGuideDetailsModal(guideId);
}

// Show authentication required modal
function showAuthRequiredModal(guideId) {
    // Remove existing modal if present
    const existingModal = document.getElementById('authRequiredModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modalHTML = `
        <div class="modal fade" id="authRequiredModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content" style="border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
                    <div class="modal-header border-0" style="background: linear-gradient(135deg, #ff6b6b, #ee5a24); color: white; border-radius: 15px 15px 0 0;">
                        <h5 class="modal-title fw-bold">
                            <i class="bi bi-lock-fill me-2"></i>ログインが必要です
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-4 text-center">
                        <div class="mb-4">
                            <i class="bi bi-person-x" style="font-size: 48px; color: #ff6b6b;"></i>
                        </div>
                        <h6 class="fw-bold mb-3">ガイドの詳細情報を見るには、観光客としてログインが必要です</h6>
                        <p class="text-muted mb-4">
                            ガイドの詳細プロフィール、連絡先、予約可能日程などの情報をご覧いただくには、
                            観光客としてアカウント登録またはログインしてください。
                        </p>
                        
                        <div class="d-grid gap-2">
                            <button type="button" class="btn btn-primary" 
                                    onclick="showTouristLoginFromAuth('${guideId}')" 
                                    style="background: linear-gradient(135deg, #667eea, #764ba2); border: none; padding: 12px; border-radius: 10px; font-weight: 600;">
                                <i class="bi bi-box-arrow-in-right me-2"></i>観光客ログイン
                            </button>
                            <button type="button" class="btn btn-outline-primary" 
                                    onclick="showTouristRegistrationFromAuth('${guideId}')" 
                                    style="border: 2px solid #667eea; color: #667eea; padding: 12px; border-radius: 10px; font-weight: 600;">
                                <i class="bi bi-person-plus me-2"></i>新規登録（無料）
                            </button>
                        </div>
                        
                        <div class="mt-3 text-center">
                            <small class="text-muted">
                                登録は無料です。ログイン後、全てのガイドの詳細情報がご覧いただけます。
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('authRequiredModal'));
    modal.show();
    
    console.log('🔐 Authentication required modal shown');
}

// Show tourist login from auth modal
function showTouristLoginFromAuth(guideId) {
    // Close auth required modal
    const authModal = bootstrap.Modal.getInstance(document.getElementById('authRequiredModal'));
    if (authModal) {
        authModal.hide();
    }
    
    // Store the guide ID for after login
    sessionStorage.setItem('pending_guide_view', guideId);
    
    // Show tourist login modal
    setTimeout(() => {
        const touristModal = new bootstrap.Modal(document.getElementById('touristLoginModal'));
        touristModal.show();
    }, 300);
}

// Show tourist registration from auth modal
function showTouristRegistrationFromAuth(guideId) {
    // Close auth required modal
    const authModal = bootstrap.Modal.getInstance(document.getElementById('authRequiredModal'));
    if (authModal) {
        authModal.hide();
    }
    
    // Store the guide ID for after registration
    sessionStorage.setItem('pending_guide_view', guideId);
    
    // Show registration choice
    setTimeout(() => {
        const registerBtn = document.getElementById('registerBtn');
        if (registerBtn) {
            registerBtn.click();
            
            // Auto-select tourist registration
            setTimeout(() => {
                const touristRegChoice = document.querySelector('.choice-card[onclick*="openTouristRegistration"]');
                if (touristRegChoice) {
                    touristRegChoice.click();
                }
            }, 500);
        }
    }, 300);
}

// Show guide details modal (when authenticated)
function showGuideDetailsModal(guideId) {
    // Find guide data
    const guides = window.AppState?.guides || defaultGuideData;
    const guide = guides.find(g => g.id === guideId);
    
    if (!guide) {
        alert('ガイド情報が見つかりませんでした');
        return;
    }
    
    // Remove existing modal if present
    const existingModal = document.getElementById('guideDetailsModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const formattedPrice = Number(guide.price) ? `¥${Number(guide.price).toLocaleString()}` : '料金応相談';
    const languages = guide.languages?.join(', ') || '日本語';
    const tags = guide.tags?.join(', ') || '';
    
    const modalHTML = `
        <div class="modal fade" id="guideDetailsModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content" style="border-radius: 15px;">
                    <div class="modal-header border-0" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; border-radius: 15px 15px 0 0;">
                        <h5 class="modal-title fw-bold">
                            <i class="bi bi-person-badge me-2"></i>${guide.name}さんのプロフィール
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-4">
                        <div class="row">
                            <div class="col-md-4 text-center mb-4">
                                <img src="${guide.photo || '/assets/img/guides/default-1.svg'}" 
                                     class="img-fluid rounded-circle shadow" 
                                     alt="${guide.name}" 
                                     style="width: 200px; height: 200px; object-fit: cover;">
                                <div class="mt-3">
                                    <div class="badge bg-warning text-dark fs-6 p-2">
                                        <i class="bi bi-star-fill me-1"></i>評価 ${guide.rating || '4.8'}
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-8">
                                <h4 class="fw-bold mb-3">${guide.name}</h4>
                                
                                <div class="mb-3">
                                    <h6 class="text-muted mb-2">📍 活動エリア</h6>
                                    <p class="mb-0">${guide.city || guide.location}</p>
                                </div>
                                
                                <div class="mb-3">
                                    <h6 class="text-muted mb-2">💰 料金</h6>
                                    <p class="mb-0 text-primary fw-bold fs-5">${formattedPrice}</p>
                                </div>
                                
                                <div class="mb-3">
                                    <h6 class="text-muted mb-2">🗣️ 対応言語</h6>
                                    <p class="mb-0">${languages}</p>
                                </div>
                                
                                ${tags ? `
                                <div class="mb-3">
                                    <h6 class="text-muted mb-2">🏷️ 特徴・専門分野</h6>
                                    <p class="mb-0">${tags}</p>
                                </div>
                                ` : ''}
                            </div>
                        </div>
                        
                        <hr class="my-4">
                        
                        <div class="mb-4">
                            <h6 class="text-muted mb-3">📝 自己紹介・サービス内容</h6>
                            <p class="text-dark" style="line-height: 1.6;">
                                ${guide.description || 'こんにちは！地域の魅力をたっぷりとご案内させていただきます。観光スポットから地元の人しか知らない隠れた名所まで、あなたの興味に合わせてカスタマイズしたツアーをご提供します。'}
                                <br><br>
                                一緒に素晴らしい思い出を作りましょう！ご質問やご要望がございましたら、お気軽にお声かけください。
                            </p>
                        </div>
                        
                        <div class="alert alert-info">
                            <h6 class="fw-bold mb-2">
                                <i class="bi bi-info-circle me-2"></i>予約・お問い合わせについて
                            </h6>
                            <p class="mb-2 small">
                                • ガイドへの直接連絡が可能です<br>
                                • 日程調整や詳細な相談ができます<br>
                                • お支払いは現地またはオンライン決済対応
                            </p>
                        </div>
                    </div>
                    <div class="modal-footer border-0 p-4">
                        <div class="d-grid gap-2 w-100">
                            <button type="button" class="btn btn-success" 
                                    onclick="contactGuide('${guide.id}')" 
                                    style="background: linear-gradient(135deg, #28a745, #20c997); border: none; padding: 12px; border-radius: 10px; font-weight: 600;">
                                <i class="bi bi-chat-dots me-2"></i>ガイドにお問い合わせ
                            </button>
                            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal" 
                                    style="border-radius: 10px; padding: 12px;">
                                閉じる
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('guideDetailsModal'));
    modal.show();
    
    console.log('✅ Guide details modal shown for:', guide.name);
}

// Contact guide function (placeholder)
function contactGuide(guideId) {
    alert(`${guideId}さんへのお問い合わせ機能は準備中です。\n\n実際の運用時は、ガイドとの連絡機能が利用できます。`);
}

// Setup guide card click handlers  
function setupGuideCardClickHandlers() {
    // Add event delegation for dynamic guide cards
    const guideContainer = document.getElementById('guideCardsContainer');
    
    if (guideContainer) {
        guideContainer.addEventListener('click', function(e) {
            // Check if clicked element or its parent is a guide details button
            const button = e.target.closest('[data-action="view-details"]');
            
            if (button) {
                e.preventDefault();
                e.stopPropagation();
                
                const guideId = button.getAttribute('data-guide-id');
                if (guideId) {
                    console.log('🎯 Guide card clicked:', guideId);
                    viewGuideDetails(guideId);
                }
            }
        });
        
        console.log('✅ Guide card click handlers setup with event delegation');
    }
    
    // Also handle any existing onclick handlers
    const existingButtons = document.querySelectorAll('[onclick*="viewGuideDetails"]');
    existingButtons.forEach(button => {
        const onclickValue = button.getAttribute('onclick');
        if (onclickValue) {
            const match = onclickValue.match(/viewGuideDetails\('([^']+)'\)/);
            if (match) {
                const guideId = match[1];
                
                // Remove onclick and add event listener
                button.removeAttribute('onclick');
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    viewGuideDetails(guideId);
                });
            }
        }
    });
}

// Tourist Registration Multi-Step System
let currentTouristStep = 1;
const maxTouristSteps = 3;

// Initialize tourist registration system
function setupTouristRegistration() {
    const nextStepBtn = document.getElementById('nextStepBtn');
    const sendSmsBtn = document.getElementById('sendSmsBtn');
    const verifySmsBtn = document.getElementById('verifySmsBtn');
    const documentUpload = document.getElementById('touristDocumentUpload');
    const phoneInput = document.getElementById('touristPhone');
    const verificationPhoneInput = document.getElementById('verificationPhone');
    
    if (nextStepBtn) {
        nextStepBtn.addEventListener('click', handleNextStep);
    }
    
    if (sendSmsBtn) {
        sendSmsBtn.addEventListener('click', handleSendSms);
    }
    
    if (verifySmsBtn) {
        verifySmsBtn.addEventListener('click', handleVerifySms);
    }
    
    if (documentUpload) {
        documentUpload.addEventListener('change', handleDocumentUpload);
    }
    
    // Sync phone numbers
    if (phoneInput && verificationPhoneInput) {
        phoneInput.addEventListener('input', function() {
            verificationPhoneInput.value = this.value;
        });
    }
    
    // Initialize first step
    showTouristStep(1);
    
    console.log('✅ Tourist registration system initialized');
}

// Handle next step in tourist registration
function handleNextStep() {
    const nextStepBtn = document.getElementById('nextStepBtn');
    
    if (currentTouristStep === 1) {
        // Validate step 1 - basic information
        if (validateTouristStep1()) {
            showTouristStep(2);
            nextStepBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>登録完了';
        }
    } else if (currentTouristStep === 2) {
        // Validate step 2 - verification
        if (validateTouristStep2()) {
            completeTouristRegistration();
        }
    }
}

// Show specific tourist registration step
function showTouristStep(stepNumber) {
    currentTouristStep = stepNumber;
    
    // Hide all step contents
    for (let i = 1; i <= maxTouristSteps; i++) {
        const stepContent = document.getElementById(`step${i}Content`);
        const stepIndicator = document.getElementById(`step${i}Indicator`);
        
        if (stepContent) {
            stepContent.style.display = i === stepNumber ? 'block' : 'none';
            stepContent.classList.toggle('active', i === stepNumber);
        }
        
        if (stepIndicator) {
            stepIndicator.classList.toggle('active', i === stepNumber);
        }
    }
    
    // Update next button text
    const nextStepBtn = document.getElementById('nextStepBtn');
    if (nextStepBtn) {
        if (stepNumber === 1) {
            nextStepBtn.innerHTML = '<i class="bi bi-arrow-right me-2"></i>次へ';
        } else if (stepNumber === 2) {
            nextStepBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>登録完了';
        } else {
            nextStepBtn.style.display = 'none';
        }
    }
    
    // Show/hide terms section based on step
    const termsSection = document.getElementById('termsSection');
    if (termsSection) {
        termsSection.style.display = stepNumber === 1 ? 'block' : 'none';
    }
    
    console.log(`🔄 Showing tourist registration step ${stepNumber}`);
}

// Validate tourist registration step 1
function validateTouristStep1() {
    const requiredFields = [
        'touristFirstName',
        'touristLastName', 
        'touristEmail',
        'touristCountry',
        'touristPhone'
    ];
    
    const termsCheckbox = document.getElementById('touristAgreeTerms');
    
    let isValid = true;
    const errors = [];
    
    // Check required fields
    for (const fieldId of requiredFields) {
        const field = document.getElementById(fieldId);
        if (field && !field.value.trim()) {
            field.style.borderColor = '#dc3545';
            isValid = false;
            errors.push(`${field.labels?.[0]?.textContent || fieldId}は必須項目です`);
        } else if (field) {
            field.style.borderColor = '#e9ecef';
        }
    }
    
    // Check email format
    const emailField = document.getElementById('touristEmail');
    if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            emailField.style.borderColor = '#dc3545';
            isValid = false;
            errors.push('正しいメールアドレスを入力してください');
        }
    }
    
    // Check terms agreement
    if (!termsCheckbox || !termsCheckbox.checked) {
        isValid = false;
        errors.push('利用規約への同意が必要です');
    }
    
    if (!isValid) {
        alert('入力内容を確認してください：\n\n' + errors.join('\n'));
    }
    
    return isValid;
}

// Validate tourist registration step 2
function validateTouristStep2() {
    const phoneVerified = localStorage.getItem('tourist_phone_verified') === 'true';
    const documentsUploaded = document.getElementById('uploadedDocuments').children.length > 0;
    
    if (!phoneVerified) {
        alert('電話番号認証を完了してください');
        return false;
    }
    
    if (!documentsUploaded) {
        alert('身分証明書のアップロードが必要です');
        return false;
    }
    
    return true;
}

// Handle SMS sending for phone verification
function handleSendSms() {
    const phoneInput = document.getElementById('touristPhone');
    const sendSmsBtn = document.getElementById('sendSmsBtn');
    const smsVerificationArea = document.getElementById('smsVerificationArea');
    
    if (!phoneInput || !phoneInput.value.trim()) {
        alert('電話番号を入力してください');
        return;
    }
    
    // Simulate SMS sending
    console.log('📱 Sending SMS to:', phoneInput.value);
    
    // Disable send button and show verification area
    sendSmsBtn.disabled = true;
    sendSmsBtn.innerHTML = '<i class="bi bi-clock me-2"></i>送信中...';
    
    setTimeout(() => {
        sendSmsBtn.innerHTML = '<i class="bi bi-arrow-repeat me-2"></i>再送信';
        sendSmsBtn.disabled = false;
        smsVerificationArea.style.display = 'block';
        
        // Start countdown timer
        startSmsTimer();
        
        alert('認証コードを送信しました。\n（デモ用コード: 123456）');
        
    }, 2000);
}

// Handle SMS verification
function handleVerifySms() {
    const smsCodeInput = document.getElementById('smsCode');
    const verifySmsBtn = document.getElementById('verifySmsBtn');
    const phoneVerificationStatus = document.getElementById('phoneVerificationStatus');
    
    if (!smsCodeInput || !smsCodeInput.value.trim()) {
        alert('認証コードを入力してください');
        return;
    }
    
    // Demo verification (accept 123456)
    if (smsCodeInput.value.trim() === '123456') {
        verifySmsBtn.disabled = true;
        verifySmsBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>認証中...';
        
        setTimeout(() => {
            localStorage.setItem('tourist_phone_verified', 'true');
            phoneVerificationStatus.innerHTML = '<div class="verification-success"><i class="bi bi-check-circle-fill me-2"></i>電話番号認証が完了しました</div>';
            verifySmsBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>認証完了';
            smsCodeInput.disabled = true;
            
            console.log('✅ Phone verification completed');
        }, 1500);
    } else {
        alert('認証コードが正しくありません。\n（デモ用コード: 123456）');
        smsCodeInput.select();
    }
}

// Start SMS verification timer
function startSmsTimer() {
    const smsTimer = document.getElementById('smsTimer');
    let timeLeft = 300; // 5 minutes
    
    const timer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        if (smsTimer) {
            smsTimer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        
        timeLeft--;
        
        if (timeLeft < 0) {
            clearInterval(timer);
            if (smsTimer) {
                smsTimer.textContent = '期限切れ';
                smsTimer.style.color = '#dc3545';
            }
        }
    }, 1000);
}

// Handle document upload
function handleDocumentUpload(event) {
    const files = event.target.files;
    const uploadedDocuments = document.getElementById('uploadedDocuments');
    
    if (!files || !uploadedDocuments) return;
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file
        if (!validateDocumentFile(file)) continue;
        
        // Create preview
        const documentPreview = createDocumentPreview(file);
        uploadedDocuments.appendChild(documentPreview);
    }
    
    console.log(`📎 Uploaded ${files.length} documents`);
}

// Validate document file
function validateDocumentFile(file) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    
    if (!allowedTypes.includes(file.type)) {
        alert(`「${file.name}」はサポートされていないファイル形式です。\nJPG、PNG、PDFファイルをアップロードしてください。`);
        return false;
    }
    
    if (file.size > maxSize) {
        alert(`「${file.name}」はファイルサイズが大きすぎます。\n5MB以下のファイルをアップロードしてください。`);
        return false;
    }
    
    return true;
}

// Create document preview element
function createDocumentPreview(file) {
    const preview = document.createElement('div');
    preview.className = 'document-preview';
    
    const isImage = file.type.startsWith('image/');
    const icon = file.type.includes('pdf') ? 'bi-file-earmark-pdf' : 'bi-file-earmark-image';
    const fileSize = (file.size / 1024).toFixed(1);
    
    // Create image preview if it's an image file
    if (isImage) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imagePreview = preview.querySelector('.image-preview');
            if (imagePreview) {
                imagePreview.style.backgroundImage = `url(${e.target.result})`;
            }
        };
        reader.readAsDataURL(file);
        
        preview.innerHTML = `
            <div class="image-preview me-3" 
                 style="width: 60px; height: 60px; background: #f8f9fa; border-radius: 8px; 
                        background-size: cover; background-position: center; border: 2px solid #dee2e6;"></div>
            <div class="flex-grow-1">
                <div class="fw-semibold">${file.name}</div>
                <small class="text-muted">${fileSize} KB</small>
            </div>
            <button type="button" class="btn btn-outline-danger btn-sm" onclick="this.parentElement.remove()">
                <i class="bi bi-trash"></i>
            </button>
        `;
    } else {
        preview.innerHTML = `
            <i class="bi ${icon} text-primary me-3" style="font-size: 1.5rem;"></i>
            <div class="flex-grow-1">
                <div class="fw-semibold">${file.name}</div>
                <small class="text-muted">${fileSize} KB</small>
            </div>
            <button type="button" class="btn btn-outline-danger btn-sm" onclick="this.parentElement.remove()">
                <i class="bi bi-trash"></i>
            </button>
        `;
    }
    
    return preview;
}

// Complete tourist registration
function completeTouristRegistration() {
    console.log('🎉 Completing tourist registration...');
    
    // Collect form data
    const formData = {
        firstName: document.getElementById('touristFirstName')?.value,
        lastName: document.getElementById('touristLastName')?.value,
        email: document.getElementById('touristEmail')?.value,
        country: document.getElementById('touristCountry')?.value,
        phone: document.getElementById('touristPhone')?.value,
        visitPurpose: document.getElementById('touristVisitPurpose')?.value,
        visitDuration: document.getElementById('touristVisitDuration')?.value,
        preferredLanguage: document.getElementById('touristPreferredLanguage')?.value,
        interests: document.getElementById('touristInterests')?.value,
        receiveUpdates: document.getElementById('touristReceiveUpdates')?.checked,
        phoneVerified: localStorage.getItem('tourist_phone_verified') === 'true',
        documentsUploaded: document.getElementById('uploadedDocuments').children.length > 0
    };
    
    console.log('📋 Tourist registration data:', formData);
    
    // Show completion step
    showTouristStep(3);
    
    // Store registration data (simulate)
    localStorage.setItem('tourist_registration_data', JSON.stringify(formData));
    localStorage.setItem('tourist_registration_complete', 'true');
    
    // Auto-login the user
    setTimeout(() => {
        // Store login state
        localStorage.setItem('tomotrip_user_type', 'tourist');
        localStorage.setItem('tomotrip_user_email', formData.email);
        localStorage.setItem('tomotrip_login_time', Date.now().toString());
        
        // Check for pending guide view
        const pendingGuideId = sessionStorage.getItem('pending_guide_view');
        
        if (pendingGuideId) {
            // Close modal and show guide details
            const modal = bootstrap.Modal.getInstance(document.getElementById('registrationModal'));
            if (modal) {
                modal.hide();
            }
            
            sessionStorage.removeItem('pending_guide_view');
            
            setTimeout(() => {
                showGuideDetailsModal(pendingGuideId);
            }, 500);
        } else {
            // Just close modal and reload
            setTimeout(() => {
                const modal = bootstrap.Modal.getInstance(document.getElementById('registrationModal'));
                if (modal) {
                    modal.hide();
                }
                
                setTimeout(() => {
                    location.reload();
                }, 500);
            }, 3000); // Give user time to see completion message
        }
    }, 2000);
}

// Make functions globally available
window.showRegistrationChoice = showRegistrationChoice;
window.hideRegistrationChoice = hideRegistrationChoice;
window.openTouristRegistration = openTouristRegistration;
window.openGuideRegistration = openGuideRegistration;
window.updateDocumentUpload = updateDocumentUpload;
window.previewDocument = previewDocument;
window.hideRegistrationForm = hideRegistrationForm;
window.completeRegistration = completeRegistration;
window.copyToClipboard = copyToClipboard;
window.previewProfilePhoto = previewProfilePhoto;
window.showGuideCardPreview = showGuideCardPreview;
window.updateGuideCardPreview = updateGuideCardPreview;
window.generateModalGuideCard = generateModalGuideCard;
window.setupLoginDropdown = setupLoginDropdown;
window.handleTouristLogin = handleTouristLogin;
window.handleGuideLogin = handleGuideLogin;
window.setupLoginForms = setupLoginForms;
window.updateLoginStatus = updateLoginStatus;
window.viewGuideDetails = viewGuideDetails;
window.checkAuthenticationStatus = checkAuthenticationStatus;
window.showAuthRequiredModal = showAuthRequiredModal;
window.setupGuideCardClickHandlers = setupGuideCardClickHandlers;
window.showTouristLoginFromAuth = showTouristLoginFromAuth;
window.showTouristRegistrationFromAuth = showTouristRegistrationFromAuth;
window.contactGuide = contactGuide;
window.setupTouristRegistration = setupTouristRegistration;
window.showTouristStep = showTouristStep;
window.handleNextStep = handleNextStep;
window.handleSendSms = handleSendSms;
window.handleVerifySms = handleVerifySms;
window.handleDocumentUpload = handleDocumentUpload;
window.showGuideDetailsModal = showGuideDetailsModal;
window.viewGuideDetailsUpdated = viewGuideDetailsUpdated;

// Show guide details modal with comprehensive information
function showGuideDetailsModal(guideId) {
    console.log('🎯 Showing guide details for:', guideId);
    
    // Get guide data from default guides
    const guide = window.defaultGuides?.find(g => g.id == guideId);
    
    if (!guide) {
        alert('申し訳ございませんが、該当するガイドの情報が見つかりませんでした。');
        return;
    }
    
    // Create modal if it doesn't exist
    let modal = document.getElementById('guideDetailsModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'guideDetailsModal';
        modal.setAttribute('tabindex', '-1');
        modal.setAttribute('aria-labelledby', 'guideDetailsModalLabel');
        modal.setAttribute('aria-hidden', 'true');
        
        modal.innerHTML = `
            <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content" style="border-radius: 20px; border: none; box-shadow: 0 20px 60px rgba(0,0,0,0.25);">
                    <div class="modal-header border-0 position-relative" 
                         style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                color: white; border-radius: 20px 20px 0 0; padding: 20px 30px;">
                        <h5 class="modal-title fw-bold d-flex align-items-center" id="guideDetailsModalLabel">
                            <div class="me-3" style="width: 40px; height: 40px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                <i class="bi bi-person-circle" style="font-size: 20px;"></i>
                            </div>
                            <div id="guideModalTitle">ガイド詳細</div>
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="閉じる" 
                                style="font-size: 1.1rem; padding: 8px;"></button>
                    </div>
                    
                    <div class="modal-body p-0" style="max-height: 70vh; overflow-y: auto;">
                        <div id="guideDetailsContent">
                            <!-- Dynamic content will be inserted here -->
                        </div>
                    </div>
                    
                    <div class="modal-footer border-0 p-4 bg-light" style="border-radius: 0 0 20px 20px;">
                        <div class="w-100">
                            <div class="row g-2">
                                <div class="col-6">
                                    <button type="button" class="btn btn-outline-secondary w-100" data-bs-dismiss="modal" 
                                            style="border-radius: 15px; padding: 12px; font-weight: 600;">
                                        <i class="bi bi-x-circle me-2"></i>閉じる
                                    </button>
                                </div>
                                <div class="col-6">
                                    <button type="button" class="btn btn-primary w-100" id="contactGuideBtn"
                                            style="border-radius: 15px; padding: 12px; 
                                                   background: linear-gradient(135deg, #667eea, #764ba2); 
                                                   border: none; font-weight: 600;">
                                        <i class="bi bi-chat-dots me-2"></i>お問い合わせ
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    const titleElement = document.getElementById('guideModalTitle');
    const contentElement = document.getElementById('guideDetailsContent');
    const contactBtn = document.getElementById('contactGuideBtn');
    
    // Update modal title
    if (titleElement) {
        titleElement.textContent = `${guide.displayName || guide.name}さんの詳細`;
    }
    
    // Create detailed content
    const languages = Array.isArray(guide.languages) ? guide.languages.join('、') : guide.languages;
    const specialties = Array.isArray(guide.specialties) ? guide.specialties.join('、') : guide.specialties;
    
    if (contentElement) {
        contentElement.innerHTML = `
            <div class="guide-profile-header p-4 text-center" 
                 style="background: linear-gradient(135deg, #f8f9fa, #e9ecef); border-bottom: 1px solid #dee2e6;">
                <div class="guide-avatar mx-auto mb-3" 
                     style="width: 100px; height: 100px; border-radius: 50%; overflow: hidden; border: 4px solid #fff; box-shadow: 0 4px 15px rgba(0,0,0,0.15);">
                    <img src="${guide.profileImage || 'attached_assets/image_1754398586272.png'}" 
                         alt="${guide.name}" class="w-100 h-100" style="object-fit: cover;">
                </div>
                <h4 class="fw-bold text-dark mb-2">${guide.displayName || guide.name}</h4>
                <div class="d-flex justify-content-center align-items-center gap-3 mb-3">
                    <span class="badge bg-primary px-3 py-2 rounded-pill">
                        <i class="bi bi-geo-alt me-2"></i>${window.locationNames?.[guide.location] || guide.location}
                    </span>
                    <span class="badge bg-success px-3 py-2 rounded-pill">
                        <i class="bi bi-star-fill me-2"></i>${guide.rating || '5.0'}
                    </span>
                </div>
                <div class="guide-price text-center">
                    <h5 class="text-primary fw-bold mb-0">￥${Number(guide.price || 8000).toLocaleString()}</h5>
                    <small class="text-muted">1セッション（2〜3時間）</small>
                </div>
            </div>
            
            <div class="guide-details p-4">
                <div class="row g-4">
                    <div class="col-md-6">
                        <div class="info-card h-100 p-3" style="background: #f8f9fa; border-radius: 12px; border: 1px solid #e9ecef;">
                            <h6 class="fw-bold text-primary mb-3">
                                <i class="bi bi-translate me-2"></i>対応言語
                            </h6>
                            <p class="mb-0">${languages || '日本語、英語'}</p>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="info-card h-100 p-3" style="background: #f8f9fa; border-radius: 12px; border: 1px solid #e9ecef;">
                            <h6 class="fw-bold text-primary mb-3">
                                <i class="bi bi-heart me-2"></i>専門分野
                            </h6>
                            <p class="mb-0">${specialties || '文化体験、グルメツアー'}</p>
                        </div>
                    </div>
                </div>
                
                <div class="mt-4">
                    <h6 class="fw-bold text-primary mb-3">
                        <i class="bi bi-person-circle me-2"></i>自己紹介
                    </h6>
                    <div class="bg-light p-3 rounded-3">
                        <p class="mb-0" style="line-height: 1.6;">
                            ${guide.description || `こんにちは！${guide.displayName || guide.name}です。${window.locationNames?.[guide.location] || guide.location}の魅力を皆様にお伝えするのが私の使命です。地元ならではの隠れた名所や美味しいグルメスポットをご案内いたします。観光だけでなく、日本の文化や習慣についても丁寧にご説明します。一緒に素晴らしい思い出を作りましょう！`}
                        </p>
                    </div>
                </div>
                
                <div class="mt-4">
                    <h6 class="fw-bold text-primary mb-3">
                        <i class="bi bi-clock me-2"></i>サービス詳細
                    </h6>
                    <div class="row g-3">
                        <div class="col-sm-6">
                            <div class="service-item d-flex align-items-center p-2">
                                <i class="bi bi-check-circle-fill text-success me-3"></i>
                                <span>観光地案内</span>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="service-item d-flex align-items-center p-2">
                                <i class="bi bi-check-circle-fill text-success me-3"></i>
                                <span>グルメツアー</span>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="service-item d-flex align-items-center p-2">
                                <i class="bi bi-check-circle-fill text-success me-3"></i>
                                <span>文化体験サポート</span>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="service-item d-flex align-items-center p-2">
                                <i class="bi bi-check-circle-fill text-success me-3"></i>
                                <span>言語サポート</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="mt-4">
                    <h6 class="fw-bold text-primary mb-3">
                        <i class="bi bi-star me-2"></i>お客様の声
                    </h6>
                    <div class="testimonial bg-light p-3 rounded-3 mb-3">
                        <div class="d-flex align-items-center mb-2">
                            <div class="stars text-warning me-2">
                                <i class="bi bi-star-fill"></i>
                                <i class="bi bi-star-fill"></i>
                                <i class="bi bi-star-fill"></i>
                                <i class="bi bi-star-fill"></i>
                                <i class="bi bi-star-fill"></i>
                            </div>
                            <strong>田中様（アメリカ）</strong>
                        </div>
                        <p class="mb-0 small" style="line-height: 1.5;">
                            「${guide.displayName || guide.name}さんのガイドのおかげで、想像以上に素晴らしい旅になりました。地元の人だからこそ知っている穴場スポットを教えてくれて、本当に感謝しています！」
                        </p>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Setup contact button
    if (contactBtn) {
        contactBtn.onclick = () => contactGuide(guideId);
    }
    
    // Show modal
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
    
    console.log('✅ Guide details modal displayed');
}

// Update the existing viewGuideDetails function to use the new modal
function viewGuideDetailsUpdated(guideId) {
    console.log('🔍 Attempting to view guide details:', guideId);
    
    // Check authentication first
    if (!checkAuthenticationStatus()) {
        // Store guide ID for after login/registration
        sessionStorage.setItem('pending_guide_view', guideId);
        showAuthRequiredModal();
        return;
    }
    
    // Show the detailed modal
    showGuideDetailsModal(guideId);
}

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
    
    // Note: Initial guides are rendered by renderGuideCards in app-init.mjs
    // No need to call displayGuides here to avoid conflicts
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

// Create guide card element - CONSISTENT WITH guide-renderer.mjs
function createGuideCard(guide) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4 mb-4';
    
    col.innerHTML = `
        <div class="guide-card h-100" style="border: none; border-radius: 15px; overflow: hidden; box-shadow: 0 8px 25px rgba(0,0,0,0.1); transition: all 0.3s ease; background: white;">
            <div class="position-relative">
                <img src="${guide.photo || guide.image || '/assets/img/guides/default-1.svg'}" 
                     class="card-img-top" 
                     alt="${guide.name}" 
                     style="height: 250px; object-fit: cover;">
                <div class="position-absolute top-0 end-0 m-2">
                    <span class="badge" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; font-size: 12px; padding: 5px 10px; border-radius: 15px;">
                        評価 ${guide.rating || '4.8'} ⭐
                    </span>
                </div>
            </div>
            <div class="card-body p-4">
                <h5 class="card-title fw-bold mb-2" style="color: #2c3e50;">${guide.name}</h5>
                <p class="text-muted mb-2">
                    <i class="bi bi-geo-alt"></i> ${window.locationNames ? (window.locationNames[guide.location] || guide.location) : guide.location}
                </p>
                <p class="card-text text-muted mb-3" style="font-size: 14px; line-height: 1.4;">
                    ${guide.description || '地域の魅力をご案内します'}
                </p>
                
                <div class="mb-3">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <small class="text-muted">対応言語</small>
                        <small class="fw-semibold">${Array.isArray(guide.languages) ? guide.languages.join(', ') : guide.languages || '日本語'}</small>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <small class="text-muted">料金</small>
                        <small class="fw-bold text-primary">¥${Number(guide.price || 8000).toLocaleString()}</small>
                    </div>
                </div>
                
                <div class="d-grid gap-2">
                    <button class="btn btn-primary" 
                            data-action="view-details" 
                            data-guide-id="${guide.id}"
                            style="background: linear-gradient(135deg, #667eea, #764ba2); border: none; border-radius: 10px; padding: 10px;">
                        詳しく見る
                    </button>
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