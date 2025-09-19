// Guide rendering module - CSP compliant
// Removed defaultGuideData import to prevent duplicate rendering

// スケーラブルペジネーションのインポートと初期化
let paginationSystem = null;

// 大量データ対応の最適化されたガイドカード描画関数
export function renderGuideCards(guidesToRender = null, usePagination = true, resetPagination = true) {
    const guides = guidesToRender ?? window.AppState?.guides ?? [];
    
    // スケーラブルペジネーションシステムの初期化
    if (usePagination && guides.length > 12) {
        initializePaginationSystem(guides, resetPagination);
        return; // ペジネーション使用時は早期リターン
    }
    
    // 少数のガイドの場合は従来通りの表示
    renderAllGuideCards(guides);
}

// ペジネーションシステムの初期化
async function initializePaginationSystem(guides, resetPagination = true) {
    if (!paginationSystem || resetPagination) {
        // 動的にペジネーションモジュールを読み込み
        const { ScalablePagination } = await import('./scalable-pagination.mjs');
        
        paginationSystem = new ScalablePagination({
            itemsPerPage: window.innerWidth < 768 ? 6 : 12,
            maxVisiblePages: 5,
            container: '#paginationContainer',
            onPageLoad: (pageItems, currentPage, totalPages) => {
                renderAllGuideCards(pageItems);
                console.log(`📄 Page ${currentPage}/${totalPages} loaded with ${pageItems.length} guides`);
            }
        });
        
        // グローバルアクセス用に保存
        window.setPaginationSystem(paginationSystem);
        
        // ペジネーション用のコンテナを追加
        ensurePaginationContainers();
    }
    
    paginationSystem.setData(guides);
    paginationSystem.renderPagination();
    paginationSystem.updatePageInfo();
    
    // 最初のページを表示
    const firstPageItems = paginationSystem.getCurrentPageItems();
    renderAllGuideCards(firstPageItems);
    
    console.log(`✅ Pagination system initialized: ${guides.length} guides, ${paginationSystem.getState().totalPages} pages`);
}

// ペジネーション用コンテナを確保
function ensurePaginationContainers() {
    // ページ情報コンテナ
    let pageInfo = document.getElementById('pageInfo');
    if (!pageInfo) {
        pageInfo = document.createElement('div');
        pageInfo.id = 'pageInfo';
        
        const guidesContainer = document.getElementById('guidesContainer');
        const parentContainer = guidesContainer?.parentElement;
        if (parentContainer) {
            parentContainer.insertBefore(pageInfo, guidesContainer);
        }
    }
    
    // ペジネーションコンテナ
    let paginationContainer = document.getElementById('paginationContainer');
    if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.id = 'paginationContainer';
        paginationContainer.className = 'mt-4';
        
        const guidesContainer = document.getElementById('guidesContainer');
        const parentContainer = guidesContainer?.parentElement;
        if (parentContainer) {
            parentContainer.appendChild(paginationContainer);
        }
    }
}

// 全ガイドカードの描画（既存の機能）
function renderAllGuideCards(guides) {
    // Try multiple ways to find the container
    let container = document.getElementById('guidesContainer');
    
    // Fallback: Try to find by class and create if needed
    if (!container) {
        console.warn('⚠️ guidesContainer not found, searching for alternative...');
        
        // Look for any div with class "row" that might be our container
        const rowContainers = document.querySelectorAll('div.row');
        console.log(`🔍 Found ${rowContainers.length} row containers`);
        
        for (let i = 0; i < rowContainers.length; i++) {
            const rowContainer = rowContainers[i];
            const content = rowContainer.innerHTML;
            console.log(`🔍 Row ${i}: id="${rowContainer.id}", content="${content.substring(0, 100)}..."`);
            
            if (content.includes('Guide cards will be populated') || 
                content.includes('<!-- Guide cards will be populated here -->') ||
                (content.trim() === '' && rowContainer.id === '') ||
                rowContainer.previousElementSibling?.textContent?.includes('Guide Cards')) {
                container = rowContainer;
                if (!container.id) {
                    container.id = 'guidesContainer'; // Set the ID for future use
                }
                console.log('✅ Found and assigned guidesContainer to row', i);
                break;
            }
        }
    }
    
    // Last resort: Create the container if it still doesn't exist
    if (!container) {
        console.warn('⚠️ Creating guidesContainer element');
        const mainContent = document.querySelector('.container-fluid, .container, main, #main');
        if (mainContent) {
            container = document.createElement('div');
            container.id = 'guidesContainer';
            container.className = 'row';
            mainContent.appendChild(container);
        } else {
            console.error('❌ Unable to create guidesContainer - no suitable parent found');
            return;
        }
    }
    
    if (!Array.isArray(guides) || guides.length === 0) {
        console.warn('⚠️ No guides to render');
        container.innerHTML = '<div class="text-center p-4"><p class="text-muted">ガイドが見つかりません</p></div>';
        updateGuideCounters(0, 0);
        return;
    }
    
    console.log(`🎨 Rendering ${guides.length} guide cards`, guides.map(g => g.name || g.guideName || 'Unknown'));
    
    // Get pagination settings
    const currentPage = window.AppState?.currentPage || 1;
    const pageSize = 12; // Standard page size
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    // Slice guides for current page
    const guidesForPage = guides.slice(startIndex, endIndex);
    
    console.log(`📄 Pagination: page ${currentPage}, showing ${guidesForPage.length} of ${guides.length} guides (${startIndex + 1}-${Math.min(endIndex, guides.length)})`);
    
    // Performance optimization for large guide lists
    if (guidesForPage.length > 30) {
        console.log('📊 Large guide page detected, using optimized rendering');
        renderGuideCardsOptimized(guidesForPage, container);
    } else {
        // Standard rendering for current page
        const cardsHTML = guidesForPage.map(guide => createGuideCardHTML(guide)).join('');
        container.innerHTML = cardsHTML;
    }
    
    // Update counters with pagination info  
    updateGuideCounters(guidesForPage.length, guides.length);
    
    // Setup view details event listeners
    setupViewDetailsEventListeners();
    
    // Update pagination display
    updatePaginationDisplay(currentPage, guides.length, pageSize);
    
    console.log(`✅ Rendered ${guidesForPage.length} guide cards for page ${currentPage} of ${Math.ceil(guides.length / pageSize)}`);
}

// Update pagination display elements
function updatePaginationDisplay(currentPage, totalGuides, pageSize) {
    const totalPages = Math.ceil(totalGuides / pageSize);
    
    // Update page info
    const pageInfo = document.getElementById('pageInfo');
    if (pageInfo) {
        pageInfo.textContent = `ページ ${currentPage}`;
    }
    
    // Update display range
    const displayRange = document.getElementById('displayRange');
    if (displayRange) {
        const startIndex = (currentPage - 1) * pageSize + 1;
        const endIndex = Math.min(currentPage * pageSize, totalGuides);
        displayRange.textContent = `${startIndex}-${endIndex}`;
    }
    
    // Update pagination buttons
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    
    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
        prevBtn.classList.toggle('disabled', currentPage === 1);
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.classList.toggle('disabled', currentPage === totalPages);
    }
    
    console.log(`📄 Pagination updated: page ${currentPage}/${totalPages}, showing ${totalGuides} total guides`);
}

// Optimized rendering for large guide lists (50+ guides)
function renderGuideCardsOptimized(guides, container) {
    // Use DocumentFragment for better performance
    const fragment = document.createDocumentFragment();
    
    // Batch process in chunks to avoid blocking UI
    const CHUNK_SIZE = 10;
    let index = 0;
    
    function renderChunk() {
        const endIndex = Math.min(index + CHUNK_SIZE, guides.length);
        
        for (let i = index; i < endIndex; i++) {
            const cardHTML = createGuideCardHTML(guides[i]);
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = cardHTML;
            fragment.appendChild(tempDiv.firstElementChild);
        }
        
        index = endIndex;
        
        if (index < guides.length) {
            // Schedule next chunk
            requestAnimationFrame(renderChunk);
        } else {
            // All chunks processed, update container
            container.innerHTML = '';
            container.appendChild(fragment);
            
            // Setup event listeners after all cards are rendered
            setupViewDetailsEventListeners();
        }
    }
    
    renderChunk();
}

// Update guide counters for display
export function updateGuideCounters(displayedCount, totalCount) {
    // Update main counter displays
    const guideCounterElement = document.getElementById('guideCounter');
    const totalGuideCounterElement = document.getElementById('totalGuideCounter');
    
    if (guideCounterElement && totalGuideCounterElement) {
        // Language detection for proper counter display
        const isEnglish = window.location.pathname.includes('index-en.html');
        
        if (isEnglish) {
            guideCounterElement.textContent = `${displayedCount || totalCount} guides shown`;
            totalGuideCounterElement.textContent = `Total: ${totalCount} guides registered`;
        } else {
            guideCounterElement.textContent = `${displayedCount || totalCount}件表示中`;
            totalGuideCounterElement.textContent = `全体: ${totalCount}名のガイドが登録済み`;
        }
    }
}

// Setup event listeners for view details buttons
export function setupViewDetailsEventListeners() {
    console.log('🔧 Setting up view details event listeners...');
    
    const viewDetailButtons = document.querySelectorAll('.view-detail-btn, [data-action="view-details"]');
    console.log(`Found ${viewDetailButtons.length} view details buttons`);
    
    viewDetailButtons.forEach((btn, index) => {
        // Remove existing listeners
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        const guideId = newBtn.getAttribute('data-guide-id') || 
                       newBtn.getAttribute('data-id') || 
                       newBtn.closest('[data-guide-id]')?.getAttribute('data-guide-id');
        
        if (guideId) {
            newBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔍 View Details clicked for guide:', guideId);
                
                if (window.showGuideDetailModalById) {
                    window.showGuideDetailModalById(guideId);
                } else {
                    console.warn('❌ showGuideDetailModalById not available');
                    // Fallback: direct navigation
                    window.open(`guide-detail.html?id=${guideId}`, '_blank');
                }
            });
            console.log(`✅ Setup button ${index + 1} for guide ID: ${guideId}`);
        } else {
            console.warn(`⚠️ Button ${index + 1} missing guide ID`);
        }
    });
}

// Create HTML for individual guide card  
export function createGuideCardHTML(guide) {
    // Use API response field names
    const price = Number(guide.sessionRate || guide.guideSessionRate || guide.price || 0);
    const formattedPrice = isNaN(price) || price === 0 ? '料金応相談' : `¥${price.toLocaleString()}/時間`;
    
    // Language mapping for Japanese display (International Standard)
    const languageMap = {
        'japanese': '日本語', 'english': '英語', 'chinese': '中国語', 'korean': '韓国語',
        'spanish': 'スペイン語', 'french': 'フランス語', 'german': 'ドイツ語', 'italian': 'イタリア語',
        'portuguese': 'ポルトガル語', 'russian': 'ロシア語', 'arabic': 'アラビア語', 'thai': 'タイ語'
    };
    
    let languages = '日本語'; // Default
    // API returns languages field (already mapped from guideLanguages)
    if (Array.isArray(guide.languages) && guide.languages.length > 0) {
        languages = guide.languages.map(lang => languageMap[lang.toLowerCase()] || lang).join(', ');
    } else if (Array.isArray(guide.guideLanguages) && guide.guideLanguages.length > 0) {
        languages = guide.guideLanguages.map(lang => languageMap[lang.toLowerCase()] || lang).join(', ');
    } else if (guide.languages && typeof guide.languages === 'string') {
        languages = languageMap[guide.languages.toLowerCase()] || guide.languages;
    }
    
    // Handle specialties from API response
    const specialties = guide.specialties || guide.guideSpecialties || '';
    const tags = typeof specialties === 'string' ? 
        specialties.split(/[,・・]/).map(s => s.trim()).filter(s => s).slice(0, 3).join(', ') :
        Array.isArray(specialties) ? specialties.slice(0, 3).join(', ') : '';
    
    // 管理者モード用チェックボックスの表示判定
    let adminModeEnabled = false;
    
    // まずgetAdminModeStateから取得を試行
    if (window.getAdminModeState) {
        adminModeEnabled = window.getAdminModeState().isAdminMode;
    } 
    // フォールバックとしてAppStateから取得
    else if (window.AppState && window.AppState.adminMode) {
        adminModeEnabled = window.AppState.adminMode.isAdminMode;
    }
    const adminCheckbox = adminModeEnabled ? `
        <input type="checkbox" class="form-check-input admin-checkbox" 
               data-guide-id="${guide.id}" 
               data-action="toggle-selection"
               style="position: absolute; top: 10px; left: 10px; z-index: 10; transform: scale(1.5);">
    ` : '';

    return `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="guide-card h-100 ${adminModeEnabled ? 'admin-mode' : ''}" 
                 data-guide-id="${guide.id}"
                 style="border: none; border-radius: 15px; overflow: hidden; box-shadow: 0 8px 25px rgba(0,0,0,0.1); transition: all 0.3s ease; background: white; position: relative;">
                ${adminCheckbox}
                <div class="position-relative">
                    <img src="${guide.profilePhoto || '/assets/img/guides/default-1.svg'}" 
                         class="card-img-top" 
                         alt="${guide.name || guide.guideName || 'ガイド'}" 
                         style="height: 250px; object-fit: cover;"
                         onerror="this.src='/assets/img/guides/default-1.svg';">
                    ${guide.profilePhoto ? '' : '<div class="position-absolute top-0 start-0 bg-warning text-dark small px-2 py-1 rounded-end">Default Photo</div>'}
                    <div class="position-absolute top-0 end-0 m-2">
                        <span class="badge" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; font-size: 12px; padding: 5px 10px; border-radius: 15px;">
                            評価 ${guide.rating || '4.8'} ⭐
                        </span>
                    </div>
                </div>
                <div class="card-body p-4">
                    <h5 class="card-title fw-bold mb-2" style="color: #2c3e50;">${guide.name}</h5>
                    <p class="text-muted mb-2">
                        <i class="bi bi-geo-alt"></i> ${guide.location || guide.city || '東京'}
                    </p>
                    <p class="card-text text-muted mb-3" style="font-size: 14px; line-height: 1.4;">
                        ${guide.introduction || guide.guideIntroduction || guide.description || '地域の魅力をご案内します'}
                    </p>
                    
                    <div class="mb-3">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <small class="text-muted">対応言語</small>
                            <small class="fw-semibold">${languages}</small>
                        </div>
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <small class="text-muted">料金</small>
                            <small class="fw-bold text-primary">${formattedPrice}</small>
                        </div>
                        ${tags ? `
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">特徴</small>
                            <small class="text-info">${tags}</small>
                        </div>
                        ` : ''}
                    </div>
                    
                    <div class="d-grid gap-2">
                        <button class="btn btn-primary view-details-btn" 
                                data-action="view-details" 
                                data-guide-id="${guide.id}"
                                style="background: linear-gradient(135deg, #667eea, #764ba2); border: none; border-radius: 10px; padding: 10px;">
                            詳しく見る
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Duplicate function removed - using the one at line 168

// Function removed - using the exported version at line 188

// Handle view details button click with authentication check
function handleViewDetailsClick(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const guideId = event.currentTarget.getAttribute('data-guide-id');
    
    if (!guideId) {
        console.error('❌ No guide ID found on clicked button');
        return;
    }
    
    console.log('🔍 View details clicked for guide:', guideId);
    
    // Check tourist authentication status
    checkTouristAuthAndRedirect(guideId);
}

// Tourist authentication check and redirect system
function checkTouristAuthAndRedirect(guideId) {
    console.log('🔐 Checking tourist authentication for guide:', guideId);
    
    // Check if tourist is logged in (check localStorage/sessionStorage)
    const touristAuth = localStorage.getItem('touristAuth') || sessionStorage.getItem('touristAuth');
    const touristData = localStorage.getItem('touristData') || sessionStorage.getItem('touristData');
    
    if (touristAuth && touristData) {
        console.log('✅ Tourist is authenticated, redirecting to guide detail');
        // User is authenticated, proceed to guide detail page
        redirectToGuideDetail(guideId);
    } else {
        console.log('⚠️ Tourist not authenticated, showing registration prompt');
        // User is not authenticated, show registration modal
        showTouristRegistrationPrompt(guideId);
    }
}

// Show tourist registration prompt modal
function showTouristRegistrationPrompt(guideId) {
    // Create modal for tourist registration prompt
    const modalHTML = `
        <div class="modal fade" id="touristAuthModal" tabindex="-1" aria-labelledby="touristAuthModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content" style="border-radius: 20px; border: none;">
                    <div class="modal-header" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; border-radius: 20px 20px 0 0;">
                        <h5 class="modal-title" id="touristAuthModalLabel">
                            <i class="bi bi-person-check me-2"></i>観光客登録が必要です
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-4">
                        <div class="text-center mb-4">
                            <i class="bi bi-info-circle text-primary" style="font-size: 3rem;"></i>
                        </div>
                        
                        <p class="text-center mb-4">
                            ガイドの詳細情報を閲覧するには観光客登録が必要です。<br>
                            簡単な登録でガイドとの連絡やお気に入り機能をご利用いただけます。
                        </p>
                        
                        <div class="d-grid gap-2">
                            <button class="btn btn-primary btn-lg" onclick="openTouristRegistrationWithReturn('${guideId}')" style="background: linear-gradient(135deg, #667eea, #764ba2); border: none; border-radius: 15px;">
                                <i class="bi bi-person-plus me-2"></i>観光客登録を行う
                            </button>
                            <button class="btn btn-outline-secondary" data-bs-dismiss="modal" style="border-radius: 15px;">
                                キャンセル
                            </button>
                        </div>
                        
                        <div class="text-center mt-3">
                            <small class="text-muted">
                                既に登録済みの場合は<br>
                                <a href="#" onclick="showTouristLoginModal('${guideId}')" class="text-primary">こちらからログイン</a>
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if present
    const existingModal = document.getElementById('touristAuthModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('touristAuthModal'));
    modal.show();
}

// Redirect to guide detail page
function redirectToGuideDetail(guideId) {
    console.log('🔗 Redirecting to guide detail page for guide:', guideId);
    window.location.href = `/guide-detail.html?id=${guideId}`;
}

// Global functions for tourist registration with return capability
window.openTouristRegistrationWithReturn = function(guideId) {
    console.log('🔗 Opening tourist registration with return to guide:', guideId);
    
    // Store the guide ID for return after registration
    sessionStorage.setItem('returnToGuideId', guideId);
    
    // Close the auth modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('touristAuthModal'));
    if (modal) {
        modal.hide();
    }
    
    // Open tourist registration page
    window.location.href = 'tourist-registration-simple.html';
};

window.showTouristLoginModal = function(guideId) {
    console.log('🔐 Showing tourist login modal for guide:', guideId);
    
    // Close the auth modal first
    const modal = bootstrap.Modal.getInstance(document.getElementById('touristAuthModal'));
    if (modal) {
        modal.hide();
    }
    
    // Create simple login modal
    const loginModalHTML = `
        <div class="modal fade" id="touristLoginModal" tabindex="-1" aria-labelledby="touristLoginModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content" style="border-radius: 20px; border: none;">
                    <div class="modal-header" style="background: linear-gradient(135deg, #28a745, #20c997); color: white; border-radius: 20px 20px 0 0;">
                        <h5 class="modal-title" id="touristLoginModalLabel">
                            <i class="bi bi-box-arrow-in-right me-2"></i>観光客ログイン
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-4">
                        <form id="touristLoginForm">
                            <div class="mb-3">
                                <label for="touristEmail" class="form-label">メールアドレス</label>
                                <input type="email" class="form-control" id="touristEmail" required style="border-radius: 10px;">
                            </div>
                            <div class="mb-3">
                                <label for="touristPassword" class="form-label">パスワード</label>
                                <input type="password" class="form-control" id="touristPassword" required style="border-radius: 10px;">
                            </div>
                            <div class="d-grid gap-2">
                                <button type="submit" class="btn btn-success btn-lg" style="background: linear-gradient(135deg, #28a745, #20c997); border: none; border-radius: 15px;">
                                    <i class="bi bi-box-arrow-in-right me-2"></i>ログイン
                                </button>
                            </div>
                        </form>
                        
                        <div class="text-center mt-3">
                            <small class="text-muted">
                                アカウントをお持ちでない方は<br>
                                <a href="#" onclick="openTouristRegistrationWithReturn('${guideId}')" class="text-primary">新規登録</a>
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if present
    const existingModal = document.getElementById('touristLoginModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to DOM
    document.body.insertAdjacentHTML('beforeend', loginModalHTML);
    
    // Setup form submission
    document.getElementById('touristLoginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('touristEmail').value;
        const password = document.getElementById('touristPassword').value;
        
        // Simple demo authentication (replace with actual API call)
        if (email && password) {
            // Store authentication data
            sessionStorage.setItem('touristAuth', 'true');
            sessionStorage.setItem('touristData', JSON.stringify({ email: email }));
            
            // Close modal
            const loginModal = bootstrap.Modal.getInstance(document.getElementById('touristLoginModal'));
            loginModal.hide();
            
            // Redirect to guide detail
            redirectToGuideDetail(guideId);
        }
    });
    
    // Show modal
    const loginModal = new bootstrap.Modal(document.getElementById('touristLoginModal'));
    loginModal.show();
};

// Make functions globally available for filter system
if (typeof window !== 'undefined') {
    window.renderGuideCards = renderGuideCards;
    window.updateGuideCounters = updateGuideCounters;
    window.setupViewDetailsEventListeners = setupViewDetailsEventListeners;
    window.createGuideCardHTML = createGuideCardHTML;  // Export for consistency
    window.checkTouristAuthAndRedirect = checkTouristAuthAndRedirect;
    window.redirectToGuideDetail = redirectToGuideDetail;
}