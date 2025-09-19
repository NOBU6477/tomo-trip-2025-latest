// ガイド管理センター機能
// Admin functionality for bulk guide operations

// 管理者モードの状態
let isAdminMode = false;
let selectedGuides = new Set();

// 管理者モードの切り替え
export function toggleAdminMode() {
    isAdminMode = !isAdminMode;
    selectedGuides.clear();
    
    // AppStateに状態を保存
    saveAdminState();
    
    // ガイドカードを再描画（チェックボックス表示/非表示）
    if (window.AppState && window.AppState.guides && window.renderGuideCards) {
        window.renderGuideCards(window.AppState.guides);
    }
    
    // ツールバーの表示/非表示
    updateAdminToolbar();
    
    console.log(`${isAdminMode ? '✅ 管理者モード有効' : '❌ 管理者モード無効'}`);
    return isAdminMode;
}

// 管理者ツールバーの更新
function updateAdminToolbar() {
    let toolbar = document.getElementById('adminToolbar');
    
    if (isAdminMode) {
        if (!toolbar) {
            toolbar = createAdminToolbar();
            document.body.appendChild(toolbar);
        }
        toolbar.style.display = 'block';
        updateSelectionCounter();
    } else {
        if (toolbar) {
            toolbar.style.display = 'none';
        }
    }
}

// 管理者ツールバーの作成
function createAdminToolbar() {
    const toolbar = document.createElement('div');
    toolbar.id = 'adminToolbar';
    toolbar.className = 'admin-toolbar position-fixed';
    toolbar.style.cssText = `
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 15px 25px;
        border-radius: 50px;
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        z-index: 1000;
        display: none;
        min-width: 400px;
        text-align: center;
    `;
    
    toolbar.innerHTML = `
        <div class="d-flex align-items-center justify-content-between">
            <div class="admin-selection-info">
                <span id="selectionCounter">0個選択中</span>
            </div>
            <div class="admin-actions d-flex gap-2">
                <button class="btn btn-light btn-sm" data-action="select-all">全選択</button>
                <button class="btn btn-outline-light btn-sm" data-action="clear-selection">クリア</button>
                <button class="btn btn-warning btn-sm" data-action="bulk-approve">一括承認</button>
                <button class="btn btn-danger btn-sm" data-action="bulk-reject">一括却下</button>
                <button class="btn btn-outline-light btn-sm" data-action="toggle-admin">終了</button>
            </div>
        </div>
    `;
    
    // CSP準拠のイベントリスナー設定
    toolbar.addEventListener('click', (event) => {
        const button = event.target.closest('button[data-action]');
        if (!button) return;
        
        const action = button.dataset.action;
        
        switch (action) {
            case 'select-all':
                selectAllGuides();
                break;
            case 'clear-selection':
                clearSelection();
                break;
            case 'bulk-approve':
                bulkApprove();
                break;
            case 'bulk-reject':
                bulkReject();
                break;
            case 'toggle-admin':
                window.toggleAdminMode();
                break;
        }
    });
    
    return toolbar;
}

// 選択カウンターの更新
function updateSelectionCounter() {
    const counter = document.getElementById('selectionCounter');
    if (counter) {
        counter.textContent = `${selectedGuides.size}個選択中`;
    }
}

// ガイドの選択/選択解除
export function toggleGuideSelection(guideId) {
    if (selectedGuides.has(guideId)) {
        selectedGuides.delete(guideId);
    } else {
        selectedGuides.add(guideId);
    }
    
    saveAdminState(); // 状態変更を保存
    updateSelectionCounter();
    updateGuideCardSelection(guideId);
    
    console.log(`Guide ${guideId} ${selectedGuides.has(guideId) ? 'selected' : 'deselected'}`);
}

// ガイドカードの選択状態を更新
function updateGuideCardSelection(guideId) {
    const checkbox = document.querySelector(`input[data-guide-id="${guideId}"]`);
    const card = document.querySelector(`[data-guide-id="${guideId}"]`)?.closest('.guide-card');
    
    if (checkbox) {
        checkbox.checked = selectedGuides.has(guideId);
    }
    
    if (card) {
        if (selectedGuides.has(guideId)) {
            card.style.border = '3px solid #007bff';
            card.style.boxShadow = '0 8px 25px rgba(0, 123, 255, 0.3)';
        } else {
            card.style.border = 'none';
            card.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
        }
    }
}

// 全選択
window.selectAllGuides = function() {
    if (!window.AppState || !window.AppState.guides) return;
    
    selectedGuides.clear();
    window.AppState.guides.forEach(guide => {
        selectedGuides.add(guide.id);
    });
    
    updateSelectionCounter();
    
    // すべてのガイドカードの選択状態を更新
    window.AppState.guides.forEach(guide => {
        updateGuideCardSelection(guide.id);
    });
    
    console.log(`✅ ${selectedGuides.size}個のガイドを全選択`);
};

// 選択クリア
window.clearSelection = function() {
    const previousCount = selectedGuides.size;
    selectedGuides.clear();
    updateSelectionCounter();
    
    // すべてのガイドカードの選択状態をクリア
    if (window.AppState && window.AppState.guides) {
        window.AppState.guides.forEach(guide => {
            updateGuideCardSelection(guide.id);
        });
    }
    
    console.log(`❌ ${previousCount}個のガイド選択をクリア`);
};

// 一括承認
window.bulkApprove = async function() {
    if (selectedGuides.size === 0) {
        alert('ガイドを選択してください。');
        return;
    }
    
    const confirmation = confirm(`選択した${selectedGuides.size}個のガイドを承認しますか？`);
    if (!confirmation) return;
    
    try {
        const selectedIds = Array.from(selectedGuides);
        
        // API経由で一括承認（仮実装 - 実際のAPIエンドポイントに応じて調整）
        const response = await fetch('/api/guides/bulk-approve', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ guideIds: selectedIds })
        });
        
        if (response.ok) {
            alert(`${selectedIds.length}個のガイドを承認しました。`);
            selectedGuides.clear();
            updateSelectionCounter();
            
            // ガイドデータを再読み込み
            if (window.refreshGuideData) {
                await window.refreshGuideData();
            }
        } else {
            alert('一括承認に失敗しました。');
        }
    } catch (error) {
        console.error('一括承認エラー:', error);
        alert('一括承認中にエラーが発生しました。');
    }
};

// 一括却下
window.bulkReject = async function() {
    if (selectedGuides.size === 0) {
        alert('ガイドを選択してください。');
        return;
    }
    
    const confirmation = confirm(`選択した${selectedGuides.size}個のガイドを却下しますか？`);
    if (!confirmation) return;
    
    try {
        const selectedIds = Array.from(selectedGuides);
        
        // API経由で一括却下（仮実装 - 実際のAPIエンドポイントに応じて調整）
        const response = await fetch('/api/guides/bulk-reject', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ guideIds: selectedIds })
        });
        
        if (response.ok) {
            alert(`${selectedIds.length}個のガイドを却下しました。`);
            selectedGuides.clear();
            updateSelectionCounter();
            
            // ガイドデータを再読み込み
            if (window.refreshGuideData) {
                await window.refreshGuideData();
            }
        } else {
            alert('一括却下に失敗しました。');
        }
    } catch (error) {
        console.error('一括却下エラー:', error);
        alert('一括却下中にエラーが発生しました。');
    }
};

// 管理者モード状態の取得
export function getAdminModeState() {
    return {
        isAdminMode,
        selectedCount: selectedGuides.size,
        selectedGuides: Array.from(selectedGuides)
    };
}

// 管理者モードの状態をAppStateに保存
function saveAdminState() {
    if (window.AppState) {
        window.AppState.adminMode = {
            isAdminMode,
            selectedGuides: Array.from(selectedGuides)
        };
    }
    console.log('💾 Admin state saved to AppState:', { isAdminMode, selectedCount: selectedGuides.size });
}

// AppStateから管理者モード状態を読み込み
function loadAdminState() {
    if (window.AppState && window.AppState.adminMode) {
        isAdminMode = window.AppState.adminMode.isAdminMode || false;
        selectedGuides = new Set(window.AppState.adminMode.selectedGuides || []);
        console.log('📂 Admin state loaded from AppState:', { isAdminMode, selectedCount: selectedGuides.size });
    }
}

// 管理者モードの初期化（グローバル関数として公開）
window.toggleAdminMode = toggleAdminMode;
window.toggleGuideSelection = toggleGuideSelection;

// 管理者モード状態をグローバルアクセス可能に  
window.getAdminModeState = function() {
    return {
        isAdminMode,
        selectedCount: selectedGuides.size,
        selectedGuides: Array.from(selectedGuides)
    };
};

// 実際にグローバル関数を割り当て
window.selectAllGuides = selectAllGuides;
window.clearSelection = clearSelection;
window.bulkApprove = bulkApprove;
window.bulkReject = bulkReject;

// アプリケーション初期化時に状態を復元
document.addEventListener('DOMContentLoaded', loadAdminState);

// 管理者モード用スタイルの追加
const adminStyles = document.createElement('style');
adminStyles.innerHTML = `
    .admin-checkbox {
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 10;
        transform: scale(1.5);
    }
    
    .guide-card.admin-mode {
        position: relative;
        cursor: pointer;
    }
    
    .admin-toolbar {
        backdrop-filter: blur(10px);
    }
    
    @media (max-width: 768px) {
        .admin-toolbar {
            min-width: 350px;
            padding: 12px 20px;
        }
        
        .admin-actions {
            flex-wrap: wrap;
            gap: 8px;
        }
        
        .admin-actions .btn {
            font-size: 12px;
            padding: 4px 8px;
        }
    }
`;
document.head.appendChild(adminStyles);

console.log('✅ Guide management module loaded');