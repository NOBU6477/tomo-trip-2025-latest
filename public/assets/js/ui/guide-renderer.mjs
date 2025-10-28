// Guide rendering module - CSP compliant
// Removed defaultGuideData import to prevent duplicate rendering

// Import language utilities for proper localization
import { localizeLanguageArray, isEnglishPage, getText } from '../utils/language-utils.mjs';

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
                
                // ✅ 正確なカウンター更新: ページアイテム数と全体データ数
                const totalCount = guides.length; // 現在処理中の全データ数
                updateGuideCounters(pageItems.length, totalCount);
                
                console.log(`📄 Page ${currentPage}/${totalPages} loaded with ${pageItems.length}/${totalCount} guides`);
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
    let container = document.getElementById('guide-list') || document.getElementById('guideCardsContainer') || document.getElementById('guidesContainer');
    
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
        const filteringMsg = getText('フィルター処理中...', 'Filtering...');
        const noGuidesMsg = getText('ガイドが見つかりません', 'No guides found');
        const message = isFilteringInProgress ? 
            `<div class="text-center p-4"><div class="spinner-border spinner-border-sm me-2" role="status"></div><p class="text-muted mt-2">${filteringMsg}</p></div>` :
            `<div class="text-center p-4"><p class="text-muted">${noGuidesMsg}</p></div>`;
        
        // 短い遅延を設けて、フィルター処理の完了を待つ
        if (isFilteringInProgress) {
            setTimeout(() => {
                // フィルター処理が完了しても結果が空の場合のみ「見つかりません」を表示
                if (container && (!Array.isArray(guides) || guides.length === 0)) {
                    const noMatchMsg = getText('条件に一致するガイドが見つかりません', 'No guides match your criteria');
                    container.innerHTML = `<div class="text-center p-4"><p class="text-muted">${noMatchMsg}</p></div>`;
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
        const pageText = getText(`ページ ${currentPage}`, `Page ${currentPage}`);
        pageInfo.textContent = pageText;
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
                    // Fallback: direct navigation with language detection
                    const isEnglish = window.location.pathname.includes('-en.html');
                    const detailPage = isEnglish ? 'guide-detail-en.html' : 'guide-detail.html';
                    window.open(`${detailPage}?id=${guideId}`, '_blank');
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
    
    // Setup compare buttons - Use delegation via button-setup.js
    // ✅ 比較ボタンはbutton-setup.jsの委譲ハンドラーで処理されるため、ここでは設定しない
    // これにより、ボタンの視覚的フィードバック（色変更）が正しく動作する
    const compareButtons = document.querySelectorAll('.compare-btn');
    console.log(`Found ${compareButtons.length} compare buttons (handled by button-setup.js delegation)`);
}

// Toggle bookmark functionality
function toggleBookmark(guideId) {
    const bookmarkedGuides = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
    // ✅ UUID対応 + 正規化: すべてを文字列として比較・保存
    const id = String(guideId);
    
    // ✅ 正規化: 既存のIDを文字列に変換して重複チェック
    const normalizedList = bookmarkedGuides.map(b => String(b));
    const exists = normalizedList.includes(id);
    
    let updatedBookmarks;
    if (exists) {
        // Remove from bookmarks (正規化済みリストから削除)
        updatedBookmarks = bookmarkedGuides.filter(b => String(b) !== id);
        console.log('❌ Guide removed from bookmarks:', guideId);
        
        if (typeof safeShowToast === 'function') {
            const removeMsg = getText('ブックマークから削除しました', 'Removed from bookmarks');
            safeShowToast(removeMsg, 'info');
        }
    } else {
        // Add to bookmarks and de-duplicate
        updatedBookmarks = [...new Set([...normalizedList, id])];
        console.log('✅ Guide added to bookmarks:', guideId);
        
        if (typeof safeShowToast === 'function') {
            const addMsg = getText('ブックマークに追加しました', 'Added to bookmarks');
            safeShowToast(addMsg, 'warning');
        }
    }
    
    localStorage.setItem('bookmarkedGuides', JSON.stringify(updatedBookmarks));
    
    // ✅ カスタムイベントを発火して管理センターを更新
    window.dispatchEvent(new Event('bookmarkChanged'));
}

// ⚠️ DEPRECATED: Toggle comparison functionality (moved to button-setup.js)
// This function is kept for backward compatibility but is no longer used
// All comparison logic is now handled by button-setup.js > handleCompareClick()
function toggleComparison(guideId) {
    console.warn('⚠️ toggleComparison called from deprecated location. Use handleCompareClick in button-setup.js instead.');
    // No-op to prevent duplicate toast messages
    // The actual functionality is in button-setup.js > handleCompareClick()
}

// HTMLを1枚のガイドカードとして組み立てる（重複タイトルや画像404を解消）
export function createGuideCardHTML(guide) {
  // 表示用の名前（日本語ページなら guide.name 優先、英語ページなら guide.guideName 優先）
  const defaultNameJa = 'ガイド';
  const defaultNameEn = 'Guide';
  const isEn = typeof isEnglishPage === 'function' ? isEnglishPage() : false;

  const nameToShow = isEn
    ? (guide.guideName || guide.name || defaultNameEn)
    : (guide.name || guide.guideName || defaultNameJa);

  // 画像（profileImageUrl優先、フォールバックとしてprofilePhoto、最後にデフォルト）
  const photoSrc = guide.profileImageUrl
    ? guide.profileImageUrl
    : (guide.profilePhoto?.profileImageUrl
      ? guide.profilePhoto.profileImageUrl
      : (guide.profilePhoto
        ? `/uploads/${guide.profilePhoto}`
        : `assets/img/guides/default-1.svg`));

  // 価格表記
  const priceNum = Number(guide.sessionRate || guide.guideSessionRate || guide.price || 0);
  const priceText = !isNaN(priceNum) && priceNum > 0
    ? `¥${priceNum.toLocaleString('ja-JP')}`
    : '¥0';

  // 地域名
  const locationNames = window.locationNames || {};
  const locationText = locationNames[guide.location] || guide.location || '';

  // 言語・専門分野（配列でない可能性にも対応）
  let langs = Array.isArray(guide.languages)
    ? guide.languages
    : (guide.languages ? String(guide.languages).split(',') : []);
  
  // 言語をローカライズ（日本語版では日本語表示、英語版では英語表示）
  if (typeof localizeLanguageArray === 'function') {
    const currentLocale = isEn ? 'en' : 'ja';
    langs = localizeLanguageArray(langs, currentLocale);
  }
  
  const specialties = Array.isArray(guide.specialties)
    ? guide.specialties
    : (guide.specialties ? String(guide.specialties).split(',') : []);

  // ボタン文言
  const viewDetailsText = typeof getText === 'function'
    ? getText('詳細を見る', 'View Details')
    : (isEn ? 'View Details' : '詳細を見る');

  return `
    <div class="col-md-6 col-lg-4 mb-4">
      <div class="card h-100 guide-card" data-guide-id="${guide.id}"
           style="border-radius:15px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,.08);">
        <img src="${photoSrc}" class="card-img-top"
             style="height:200px; object-fit:cover;"
             alt="${nameToShow}"
             onerror="this.src='assets/img/guides/default-1.svg';">

        <div class="card-body d-flex flex-column">
          <!-- タイトルは1つだけ（重複表示を解消） -->
          <h5 class="card-title mb-1">${nameToShow}</h5>

          <div class="mb-2">
            ${locationText ? `<span class="badge bg-primary me-1">${locationText}</span>` : ''}
          </div>

          <div class="mb-1">
            ${langs.map(l => `<span class="badge bg-success me-1" style="font-size:.75rem">${l}</span>`).join('')}
          </div>

          <div class="mb-1">
            ${specialties.map(s => `<span class="badge bg-secondary me-1" style="font-size:.75rem">${s}</span>`).join('')}
          </div>

          <p class="card-text text-muted small mb-2">${guide.introduction || ''}</p>

          <div class="d-flex justify-content-between align-items-center mt-auto">
            <span class="fw-bold">${priceText}</span>
            <button type="button"
                    class="btn btn-outline-primary btn-sm view-detail-btn"
                    data-guide-id="${guide.id}">
              ${viewDetailsText}
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

// Tourist/Guide authentication check and redirect system
function checkTouristAuthAndRedirect(guideId) {
    console.log('🔐 Checking authentication for guide:', guideId);
    
    // Check if tourist is logged in (check sessionStorage first, then localStorage)
    const touristAuth = sessionStorage.getItem('touristAuth') || localStorage.getItem('touristAuth');
    const touristData = sessionStorage.getItem('touristData') || sessionStorage.getItem('touristRegistrationData') || localStorage.getItem('touristRegistrationData');
    
    // Check if guide is logged in
    const guideAuth = sessionStorage.getItem('guideAuth');
    const guideData = sessionStorage.getItem('guideData');
    
    // Debug: Log all storage values
    console.log('🔍 Auth check details:', {
        sessionAuth: sessionStorage.getItem('touristAuth'),
        localAuth: localStorage.getItem('touristAuth'),
        sessionData: sessionStorage.getItem('touristData'),
        sessionRegData: sessionStorage.getItem('touristRegistrationData'),
        localRegData: localStorage.getItem('touristRegistrationData'),
        guideAuth: guideAuth,
        guideData: guideData ? 'present' : 'null',
        finalTouristAuth: touristAuth,
        finalTouristData: touristData
    });
    
    // Allow access if user is logged in as either tourist or guide
    if (touristAuth || touristData || guideAuth || guideData) {
        if (touristAuth || touristData) {
            console.log('✅ Tourist is authenticated, redirecting to guide detail');
        } else {
            console.log('✅ Guide is authenticated, redirecting to guide detail');
        }
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
    
    // Detect current page language and redirect to appropriate detail page
    const isEnglish = window.location.pathname.includes('-en.html');
    const detailPage = isEnglish ? '/guide-detail-en.html' : '/guide-detail.html';
    
    console.log(`🌐 Detected language: ${isEnglish ? 'English' : 'Japanese'}, redirecting to ${detailPage}`);
    window.location.href = `${detailPage}?id=${guideId}`;
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
    
    // Store guide ID for return after login
    sessionStorage.setItem('returnToGuideId', guideId);
    
    // Close the auth modal first
    const authModal = bootstrap.Modal.getInstance(document.getElementById('touristAuthModal'));
    if (authModal) {
        authModal.hide();
    }
    
    // Show the existing global tourist login modal instead of creating a new one
    const existingLoginModal = document.getElementById('touristLoginModal');
    if (existingLoginModal) {
        const modal = new bootstrap.Modal(existingLoginModal);
        modal.show();
        console.log('✅ Opened existing tourist login modal');
    } else {
        console.error('❌ Tourist login modal not found in page');
        // Fallback: redirect to home page where login modal exists
        alert('ログインするにはホームページに戻ります');
        window.location.href = '/';
    }
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