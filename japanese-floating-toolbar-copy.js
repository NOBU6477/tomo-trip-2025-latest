// 日本語版フローティングツールバーの完全コピー
console.log('🇯🇵 日本語版フローティングツールバーコピー開始');

// 日本語版のフローティングツールバーHTMLを取得してコピー
function copyJapaneseFloatingToolbar() {
    // 日本語版のツールバー構造を完全に再現
    const japaneseToolbarHTML = `
    <div class="floating-toolbar position-fixed d-flex align-items-center gap-3 px-4 py-2" style="
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 25px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        z-index: 1030;
        border: 1px solid rgba(255, 255, 255, 0.2);
    ">
        <div class="d-flex align-items-center">
            <span class="text-muted me-2" style="font-size: 14px;">Comparing:</span>
            <span id="english-comparison-count" class="fw-bold text-primary">0</span>
            <span class="text-muted">/3 people</span>
        </div>
        
        <button id="englishShowComparison" class="btn btn-primary btn-sm" style="border-radius: 20px;">
            <i class="bi bi-list-check me-1"></i>Compare
        </button>
        
        <button id="englishShowBookmarks" class="btn btn-outline-primary btn-sm" style="border-radius: 20px;">
            <i class="bi bi-bookmark-star me-1"></i>Bookmarks(<span id="english-bookmark-count">0</span>)
        </button>
        
        <button class="btn btn-outline-secondary btn-sm" onclick="showEnglishHistory()" style="border-radius: 20px;">
            <i class="bi bi-clock-history me-1"></i>History
        </button>
        
        <select class="form-select form-select-sm" id="english-page-jump" style="width: auto; border-radius: 20px;" onchange="englishQuickJump(this.value)">
            <option value="">Page Jump</option>
            <option value="1">Page 1</option>
            <option value="2">Page 2</option>
            <option value="3">Page 3</option>
        </select>
    </div>`;
    
    return japaneseToolbarHTML;
}

// 英語版専用ツールバー機能
function showEnglishHistory() {
    alert('History feature will be implemented in the future.\n\nThis will show your browsing history and recently viewed guides.');
}

function englishQuickJump(page) {
    if (page) {
        alert(`Page jump to ${page} will be implemented in the future.\n\nThis will allow quick navigation between guide pages.`);
    }
}

// 英語サイトでのみ実行
if (window.location.pathname.includes('index-en') || document.title.includes('English')) {
    console.log('🇺🇸 English site detected - Creating Japanese-style toolbar');
    
    // 既存のツールバーを削除
    document.addEventListener('DOMContentLoaded', () => {
        const existingToolbar = document.getElementById('floating-toolbar');
        if (existingToolbar) {
            existingToolbar.remove();
            console.log('🗑️ Removed existing toolbar');
        }
        
        // 新しいツールバーを追加
        const toolbarHTML = copyJapaneseFloatingToolbar();
        document.body.insertAdjacentHTML('beforeend', toolbarHTML);
        console.log('✅ Added Japanese-style floating toolbar');
    });
    
    // 即座に実行も試行
    setTimeout(() => {
        const existingToolbar = document.getElementById('floating-toolbar');
        if (existingToolbar) {
            existingToolbar.remove();
        }
        
        const toolbarHTML = copyJapaneseFloatingToolbar();
        document.body.insertAdjacentHTML('beforeend', toolbarHTML);
    }, 1000);
    
} else {
    console.log('🇯🇵 Japanese site detected - Skipping English toolbar');
}

console.log('📱 Japanese Floating Toolbar Copy System Loaded');