// Guide rendering module - CSP compliant
// Removed defaultGuideData import to prevent duplicate rendering

// Import language utilities for proper localization
import { localizeLanguageArray } from '../utils/language-utils.mjs';

// スケーラブルペジネーションのインポートと初期化
let paginationSystem = null;

// 大量データ対応の最適化されたガイドカード描画関数
export function renderGuideCards(guidesToRender = null, usePagination = true, resetPagination = true) {
    // Use provided guides, or fall back based on filter state
    let guides;
    
    if (guidesToRender !== null) {
        // Explicit guides provided - use them even if empty (for filtered results)
        guides = guidesToRender;
        console.log('🎯 Using provided guides:', guides.length);
    } else {
        // No explicit guides - use filtered guides or all guides
        const appState = window.AppState;
        if (appState?.isFiltered && appState?.filteredGuides != null) {
            guides = appState.filteredGuides;
            console.log('🔍 Using filtered guides from AppState:', guides.length);
        } else {
            guides = appState?.guides ?? [];
            console.log('📦 Using all guides from AppState:', guides.length);
        }
    }
    
    // 🔧 Fix: Only reset currentPage when explicitly requested via resetPagination
    if (window.AppState && resetPagination) {
        window.AppState.currentPage = 1;
        console.log('🔄 Reset currentPage to 1 (resetPagination=true)');
    }
    
    // スケーラブルペジネーションシステムの初期化
    if (usePagination && guides.length > 12) {
        initializePaginationSystem(guides, resetPagination);
        return; // ペジネーション使用時は早期リターン
    }
    
    // 少数のガイドの場合は従来通りの表示
    console.log('📊 Render kickoff:', {count: guides.length, currentPage: window.AppState?.currentPage});
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
    // Try multiple ways to find the container - support both old and new IDs
    let container = document.getElementById('guideCardsContainer') || document.getElementById('guidesContainer');
    
    // Fallback: Try to find by class and create if needed
    if (!container) {
        console.warn('⚠️ guideCardsContainer/guidesContainer not found, searching for alternative...');
        
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
        // 🔧 FIX: フィルター処理中かどうかを確認して適切なメッセージを表示
        const isFilteringInProgress = window.AppState?.isFiltered;
        const message = isFilteringInProgress ? 
            '<div class="text-center p-4"><div class="spinner-border spinner-border-sm me-2" role="status"></div><p class="text-muted mt-2">フィルター処理中...</p></div>' :
            '<div class="text-center p-4"><p class="text-muted">ガイドが見つかりません</p></div>';
        
        // 短い遅延を設けて、フィルター処理の完了を待つ
        if (isFilteringInProgress) {
            setTimeout(() => {
                // フィルター処理が完了しても結果が空の場合のみ「見つかりません」を表示
                if (container && (!Array.isArray(guides) || guides.length === 0)) {
                    container.innerHTML = '<div class="text-center p-4"><p class="text-muted">条件に一致するガイドが見つかりません</p></div>';
                }
            }, 300);
            container.innerHTML = message;
        } else {
            container.innerHTML = message;
        }
        
        updateGuideCounters(0, window.AppState?.guides?.length || 0);
        return;
    }
    
    console.log(`🎨 Rendering ${guides.length} guide cards`, guides.map(g => g.name || g.guideName || 'Unknown'));
    
    // 🔧 Fix: Clamp currentPage to valid range before slicing
    const pageSize = 12; // Standard page size
    const totalPages = Math.max(1, Math.ceil(guides.length / pageSize));
    let currentPage = Math.min(Math.max(1, window.AppState?.currentPage || 1), totalPages);
    
    // Update AppState if currentPage was clamped
    if (window.AppState && window.AppState.currentPage !== currentPage) {
        console.log(`🔧 Clamping currentPage from ${window.AppState.currentPage} to ${currentPage}`);
        window.AppState.currentPage = currentPage;
    }
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    // Slice guides for current page
    const guidesForPage = guides.slice(startIndex, endIndex);
    
    // 🔧 Emergency fix: If guidesForPage is empty but guides exist, reset to page 1
    if (guidesForPage.length === 0 && guides.length > 0) {
        console.warn(`⚠️ Emergency reset: Page ${currentPage} resulted in empty guides, resetting to page 1`);
        currentPage = 1;
        if (window.AppState) window.AppState.currentPage = 1;
        const newStartIndex = (currentPage - 1) * pageSize;
        const newEndIndex = newStartIndex + pageSize;
        guidesForPage.splice(0, 0, ...guides.slice(newStartIndex, newEndIndex));
    }
    
    console.log(`📄 Pagination: page ${currentPage}/${totalPages}, showing ${guidesForPage.length} of ${guides.length} guides (${startIndex + 1}-${Math.min(endIndex, guides.length)})`);
    
    // Performance optimization for large guide lists
    if (guidesForPage.length > 30) {
        console.log('📊 Large guide page detected, using optimized rendering');
        renderGuideCardsOptimized(guidesForPage, container);
    } else {
        // Standard rendering for current page
        const cardsHTML = guidesForPage.map(guide => createGuideCardHTML(guide)).join('');
        container.innerHTML = cardsHTML;
    }
    
    // ✅ 実際のDOM表示数でカウンター更新
    const actualRenderedCount = container.children.length;
    updateGuideCounters(actualRenderedCount, guides.length);
    
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

// Update guide counters for display - 🔧 完全修正版
export function updateGuideCounters(displayedCount, totalCount) {
    // Update main counter displays
    const guideCounterElement = document.getElementById('guideCounter');
    const totalGuideCounterElement = document.getElementById('totalGuideCounter');
    
    console.log('🔢 Updating counters:', { displayedCount, totalCount, guideCounterElement: !!guideCounterElement, totalGuideCounterElement: !!totalGuideCounterElement });
    
    if (guideCounterElement && totalGuideCounterElement) {
        // Language detection for proper counter display
        const isEnglish = window.location.pathname.includes('index-en.html');
        
        // ✅ 簡素化されたカウンター計算: 実際の表示数をそのまま使用
        const actualDisplayed = displayedCount || 0;
        const actualTotal = totalCount || displayedCount || 0;
        
        if (isEnglish) {
            guideCounterElement.textContent = `1-${actualDisplayed} shown (${actualTotal} total)`;
            totalGuideCounterElement.textContent = `Total: ${actualTotal} guides registered`;
        } else {
            if (actualTotal === 0) {
                guideCounterElement.textContent = `0件表示中`;
            } else if (actualDisplayed === actualTotal) {
                guideCounterElement.textContent = `1-${actualDisplayed}件表示中 (${actualTotal}件中)`;
            } else {
                guideCounterElement.textContent = `1-${actualDisplayed}件表示中 (${actualTotal}件中)`;
            }
            totalGuideCounterElement.textContent = `全体: ${actualTotal}名のガイドが登録済み`;
        }
        
        console.log(`✅ Simple counters updated: 1-${actualDisplayed} shown (${actualTotal} total)`);
    } else {
        console.warn('⚠️ Counter elements not found:', {
            guideCounter: !!guideCounterElement,
            totalGuideCounter: !!totalGuideCounterElement
        });
    }
}

// Setup event listeners for view details, bookmark, and compare buttons
export function setupViewDetailsEventListeners() {
    console.log('🔧 Setting up view details, bookmark, and compare event listeners...');
    
    // Setup view details buttons - using the updated class name
    const viewDetailButtons = document.querySelectorAll('.view-detail-btn');
    console.log(`Found ${viewDetailButtons.length} view details buttons`);
    
    viewDetailButtons.forEach((btn, index) => {
        // Remove existing listeners
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        const guideId = newBtn.getAttribute('data-guide-id');
        
        if (guideId) {
            newBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔍 View Details clicked for guide:', guideId);
                
                if (window.showGuideDetailModalById) {
                    window.showGuideDetailModalById(guideId);
                } else if (window.viewGuideDetail) {
                    window.viewGuideDetail(guideId, e);
                } else {
                    console.warn('❌ Guide detail function not available');
                    // Fallback: direct navigation
                    window.open(`guide-detail.html?id=${guideId}`, '_blank');
                }
            });
            console.log(`✅ Setup view detail button ${index + 1} for guide ID: ${guideId}`);
        } else {
            console.warn(`⚠️ View detail button ${index + 1} missing guide ID`);
        }
    });
    
    // Setup bookmark buttons
    const bookmarkButtons = document.querySelectorAll('.bookmark-btn');
    console.log(`Found ${bookmarkButtons.length} bookmark buttons`);
    
    bookmarkButtons.forEach((btn, index) => {
        // Remove existing listeners
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        const guideId = newBtn.getAttribute('data-guide-id');
        
        if (guideId) {
            newBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔖 Bookmark clicked for guide:', guideId);
                
                toggleBookmark(guideId);
                // Re-render guide cards to update button states WITHOUT resetting pagination
                if (window.AppState && window.AppState.guides) {
                    const usePagination = window.AppState.guides.length > 12;
                    renderGuideCards(window.AppState.guides, usePagination, false);
                }
            });
            console.log(`✅ Setup bookmark button ${index + 1} for guide ID: ${guideId}`);
        } else {
            console.warn(`⚠️ Bookmark button ${index + 1} missing guide ID`);
        }
    });
    
    // Setup compare buttons
    const compareButtons = document.querySelectorAll('.compare-btn');
    console.log(`Found ${compareButtons.length} compare buttons`);
    
    compareButtons.forEach((btn, index) => {
        // Remove existing listeners
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        const guideId = newBtn.getAttribute('data-guide-id');
        
        if (guideId) {
            newBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔄 Compare clicked for guide:', guideId);
                
                toggleComparison(guideId);
                // Re-render guide cards to update button states WITHOUT resetting pagination
                if (window.AppState && window.AppState.guides) {
                    const usePagination = window.AppState.guides.length > 12;
                    renderGuideCards(window.AppState.guides, usePagination, false);
                }
            });
            console.log(`✅ Setup compare button ${index + 1} for guide ID: ${guideId}`);
        } else {
            console.warn(`⚠️ Compare button ${index + 1} missing guide ID`);
        }
    });
}

// Toggle bookmark functionality
function toggleBookmark(guideId) {
    const bookmarkedGuides = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
    const id = parseInt(guideId);
    
    if (bookmarkedGuides.includes(id) || bookmarkedGuides.includes(guideId)) {
        // Remove from bookmarks
        const updatedBookmarks = bookmarkedGuides.filter(bookmarkId => 
            bookmarkId !== id && bookmarkId !== guideId
        );
        localStorage.setItem('bookmarkedGuides', JSON.stringify(updatedBookmarks));
        console.log('❌ Guide removed from bookmarks:', guideId);
        
        if (typeof safeShowToast === 'function') {
            safeShowToast('ブックマークから削除しました', 'info');
        }
    } else {
        // Add to bookmarks
        bookmarkedGuides.push(id);
        localStorage.setItem('bookmarkedGuides', JSON.stringify(bookmarkedGuides));
        console.log('✅ Guide added to bookmarks:', guideId);
        
        if (typeof safeShowToast === 'function') {
            safeShowToast('ブックマークに追加しました', 'warning');
        }
    }
}

// Toggle comparison functionality
function toggleComparison(guideId) {
    const comparisonGuides = JSON.parse(localStorage.getItem('comparisonGuides') || '[]');
    const id = parseInt(guideId);
    
    if (comparisonGuides.includes(id) || comparisonGuides.includes(guideId)) {
        // Remove from comparison
        const updatedComparison = comparisonGuides.filter(compareId => 
            compareId !== id && compareId !== guideId
        );
        localStorage.setItem('comparisonGuides', JSON.stringify(updatedComparison));
        console.log('❌ Guide removed from comparison:', guideId);
        
        if (typeof safeShowToast === 'function') {
            safeShowToast('比較から削除しました', 'info');
        }
    } else {
        // Check comparison limit (max 3)
        if (comparisonGuides.length >= 3) {
            if (typeof safeShowToast === 'function') {
                safeShowToast('比較できるガイドは最大3人までです', 'warning');
            }
            return;
        }
        
        // Add to comparison
        comparisonGuides.push(id);
        localStorage.setItem('comparisonGuides', JSON.stringify(comparisonGuides));
        console.log('✅ Guide added to comparison:', guideId);
        
        if (typeof safeShowToast === 'function') {
            safeShowToast('比較に追加しました', 'success');
        }
    }
}

// Create HTML for individual guide card - RESTORED FROM BACKUP
export function createGuideCardHTML(guide) {
    // Use API response field names
    const price = Number(guide.sessionRate || guide.guideSessionRate || guide.price || 0);
    const formattedPrice = isNaN(price) || price === 0 ? `¥${price.toLocaleString()}` : `¥${price.toLocaleString()}`;
    
    // Location names mapping for Japanese display
    const locationNames = window.locationNames || {};
    
    // Check bookmark and comparison status with enhanced debugging
    const bookmarkedGuides = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
    const comparisonGuides = JSON.parse(localStorage.getItem('comparisonGuides') || '[]');
    const guideIdInt = parseInt(guide.id);
    const guideIdStr = String(guide.id);
    
    const isBookmarked = bookmarkedGuides.includes(guide.id) || bookmarkedGuides.includes(guideIdInt) || bookmarkedGuides.includes(guideIdStr);
    const isInComparison = comparisonGuides.includes(guide.id) || comparisonGuides.includes(guideIdInt) || comparisonGuides.includes(guideIdStr);
    
    console.log('🔍 Guide card button states:', {
        guideId: guide.id,
        guideIdInt,
        guideIdStr,
        bookmarkedGuides,
        comparisonGuides,
        isBookmarked,
        isInComparison
    });
    
    // Dynamic button states
    const bookmarkBtnClass = isBookmarked ? 'btn btn-warning btn-sm' : 'btn btn-outline-warning btn-sm';
    const compareBtnClass = isInComparison ? 'btn btn-success btn-sm' : 'btn btn-outline-success btn-sm';
    const bookmarkIcon = isBookmarked ? '<i class="bi bi-bookmark-fill"></i>' : '<i class="bi bi-bookmark"></i>';
    const compareIcon = isInComparison ? '<i class="bi bi-check2-square-fill"></i>' : '<i class="bi bi-check2-square"></i>';
    
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
            <div class="card h-100 guide-card ${adminModeEnabled ? 'admin-mode' : ''}" 
                 data-guide-id="${guide.id}"
                 style="border-radius: 15px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
                ${adminCheckbox}
                <img src="${guide.profilePhoto ? `/uploads/${guide.profilePhoto}` : '/assets/img/guides/default-1.svg'}" 
                     class="card-img-top" 
                     style="height: 200px; object-fit: cover;" 
                     alt="${guide.name || guide.guideName || 'ガイド'}"
                     onerror="this.src='/assets/img/guides/default-1.svg';">
                <div class="card-body d-flex flex-column">
                    <div class="mb-2">
                        <h5 class="card-title mb-1">${guide.name || guide.guideName || 'ガイド'}</h5>
                    </div>
                    <div class="mb-2">
                        <div class="mb-1">
                            <span class="badge bg-primary me-1">${locationNames[guide.location] || guide.location || guide.city || '東京'}</span>
                        </div>
                        <div class="mb-1">
                            <span class="badge bg-secondary me-1">${guide.specialties || guide.guideSpecialties || guide.specialty || '観光案内'}</span>
                        </div>
                        <div class="mb-1">
                            ${(() => {
                                // 統一APIを使用した日本語言語バッジ表示
                                const localizedLanguages = localizeLanguageArray(guide.languages, 'ja');
                                return localizedLanguages.map(lang => 
                                    `<span class="badge bg-success me-1" style="font-size: 0.75em;">${lang}</span>`
                                ).join('');
                            })()}
                        </div>
                    </div>
                    <p class="card-text text-muted small mb-2">${guide.introduction || guide.guideIntroduction || guide.description || '地域の魅力をご案内します'}</p>
                    <div class="d-flex justify-content-between align-items-center mt-auto">
                        <div>
                            <span class="text-warning">★</span>
                            <span class="fw-bold">${guide.rating || guide.averageRating || '4.8'}</span>
                        </div>
                        <div class="text-end">
                            <div class="fw-bold text-primary">${formattedPrice}</div>
                            <small class="text-muted">1日ガイド</small>
                        </div>
                    </div>
                    <div class="mt-3">
                        <button class="btn btn-primary w-100 view-detail-btn" data-guide-id="${guide.id}" style="border-radius: 25px; margin-bottom: 10px;">
                            詳細を見る
                        </button>
                        <div class="d-flex gap-2 mt-2">
                            <button class="${bookmarkBtnClass} bookmark-btn flex-fill" data-guide-id="${guide.id}" data-action="toggle-bookmark" title="ブックマーク" style="border-radius: 20px; padding: 8px 12px; font-size: 0.9rem;">
                                ${bookmarkIcon} <span class="ms-1">ブックマーク</span>
                            </button>
                            <button class="${compareBtnClass} compare-btn flex-fill" data-guide-id="${guide.id}" data-action="toggle-comparison" title="比較リストに追加" style="border-radius: 20px; padding: 8px 12px; font-size: 0.9rem;">
                                ${compareIcon} <span class="ms-1">比較</span>
                            </button>
                        </div>
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