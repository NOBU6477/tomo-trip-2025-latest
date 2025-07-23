// 強化された管理パネル - 確実動作版
(function() {
    'use strict';
    
    console.log('管理パネル初期化開始');
    
    // 遅延実行で確実に動作
    function initializePanel() {
        // 既存パネル削除
        const existing = document.querySelectorAll('[id*="management"], [id*="center"], [style*="position: fixed"]');
        existing.forEach(el => {
            if (el.textContent && (el.textContent.includes('管理') || el.textContent.includes('比較') || el.textContent.includes('お気に入り'))) {
                el.remove();
            }
        });
        
        // 強化されたパネル作成
        const panel = document.createElement('div');
        panel.id = 'management-center-panel';
        panel.innerHTML = `
            <div class="floating-toolbar" style="position:fixed;bottom:20px;right:20px;background:#4CAF50;color:white;padding:15px;border-radius:12px;z-index:99999;font-size:14px;min-width:180px;text-align:center;box-shadow:0 8px 25px rgba(0,0,0,0.3);">
                <div style="font-weight:bold;margin-bottom:10px;font-size:16px;">🏆管理センター</div>
                <div style="display:flex;gap:8px;justify-content:center;margin-bottom:8px;">
                    <button class="toolbar-btn" data-action="compare" style="padding:8px 12px;border:none;border-radius:6px;background:rgba(255,255,255,0.2);color:white;cursor:pointer;font-size:11px;font-weight:bold;border:1px solid rgba(255,255,255,0.3);">比較</button>
                    <button class="toolbar-btn" data-action="bookmark" style="padding:8px 12px;border:none;border-radius:6px;background:rgba(255,255,255,0.2);color:white;cursor:pointer;font-size:11px;font-weight:bold;border:1px solid rgba(255,255,255,0.3);">ブックマーク</button>
                    <button class="toolbar-btn" data-action="history" style="padding:8px 12px;border:none;border-radius:6px;background:rgba(255,255,255,0.2);color:white;cursor:pointer;font-size:11px;font-weight:bold;border:1px solid rgba(255,255,255,0.3);">履歴</button>
                    <button class="toolbar-btn" data-action="manage" style="padding:8px 12px;border:none;border-radius:6px;background:rgba(255,255,255,0.2);color:white;cursor:pointer;font-size:11px;font-weight:bold;border:1px solid rgba(255,255,255,0.3);">管理</button>
                </div>
                <div id="comparison-counter" style="font-size:11px;color:rgba(255,255,255,0.9);margin-bottom:5px;">比較中: 0/3人</div>
                <div id="bookmark-counter" style="font-size:11px;color:rgba(255,255,255,0.9);">ブックマーク(0)</div>
            </div>
        `;
        
        document.body.appendChild(panel);
        console.log('管理パネル作成完了');
        
        // ボタンイベントハンドラを確実に設定
        setTimeout(() => {
            const toolbarBtns = document.querySelectorAll('.toolbar-btn');
            
            toolbarBtns.forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const action = this.getAttribute('data-action');
                    
                    switch(action) {
                        case 'compare':
                            showComparisonManager();
                            break;
                        case 'bookmark':
                            showBookmarkManager();
                            break;
                        case 'history':
                            showHistoryManager();
                            break;
                        case 'manage':
                            showGeneralManager();
                            break;
                    }
                });
                
                // ホバーエフェクト
                btn.onmouseover = function() {
                    this.style.background = 'rgba(255,255,255,0.4)';
                    this.style.transform = 'translateY(-2px)';
                };
                btn.onmouseout = function() {
                    this.style.background = 'rgba(255,255,255,0.2)';
                    this.style.transform = 'translateY(0)';
                };
            });
            
            // カウンター更新関数を定義
            window.updateComparisonCounter = function() {
                const comparisonList = JSON.parse(localStorage.getItem('comparisonList') || '[]');
                const counter = document.getElementById('comparison-counter');
                if (counter) {
                    counter.textContent = `比較中: ${comparisonList.length}/3人`;
                }
            };
            
            window.updateBookmarkCounter = function() {
                const bookmarkList = JSON.parse(localStorage.getItem('bookmarkList') || '[]');
                const counter = document.getElementById('bookmark-counter');
                if (counter) {
                    counter.textContent = `ブックマーク(${bookmarkList.length})`;
                }
            };
            
            // 初期カウンター更新
            window.updateComparisonCounter();
            window.updateBookmarkCounter();
            
            console.log('管理パネルイベントハンドラ設定完了');
        }, 500);
        
        // 管理機能関数を追加
        window.showComparisonManager = function() {
            const comparisonList = JSON.parse(localStorage.getItem('comparisonList') || '[]');
            let content = `<div style="max-width:500px;">
                <h6 class="mb-3">比較リスト管理 (${comparisonList.length}/3人)</h6>`;
            
            if (comparisonList.length === 0) {
                content += '<p class="text-muted">比較リストは空です。ガイドカードの✓ボタンをクリックして追加してください。</p>';
            } else {
                content += '<div class="list-group mb-3">';
                comparisonList.forEach((guide, index) => {
                    content += `<div class="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>${guide.name}</strong><br>
                            <small class="text-muted">${guide.location} - ¥${guide.price}</small>
                        </div>
                        <button class="btn btn-sm btn-outline-danger" onclick="removeFromComparison(${index})">削除</button>
                    </div>`;
                });
                content += '</div>';
                
                if (comparisonList.length >= 2) {
                    content += '<button class="btn btn-success w-100" onclick="startComparison()">比較を開始</button>';
                }
            }
            
            content += '</div>';
            showCustomModal('比較リスト', content);
        };
        
        window.showBookmarkManager = function() {
            const bookmarkList = JSON.parse(localStorage.getItem('bookmarkList') || '[]');
            let content = `<div style="max-width:500px;">
                <h6 class="mb-3">ブックマーク管理 (${bookmarkList.length}人)</h6>`;
            
            if (bookmarkList.length === 0) {
                content += '<p class="text-muted">ブックマークは空です。ガイドカードの⭐ボタンをクリックして追加してください。</p>';
            } else {
                content += '<div class="list-group mb-3">';
                bookmarkList.forEach((guide, index) => {
                    content += `<div class="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>${guide.name}</strong><br>
                            <small class="text-muted">${guide.location} - ¥${guide.price}</small>
                        </div>
                        <button class="btn btn-sm btn-outline-danger" onclick="removeFromBookmarks(${index})">削除</button>
                    </div>`;
                });
                content += '</div>';
                content += '<button class="btn btn-warning w-100" onclick="clearAllBookmarks()">全て削除</button>';
            }
            
            content += '</div>';
            showCustomModal('ブックマーク', content);
        };
        
        window.showHistoryManager = function() {
            const viewHistory = JSON.parse(localStorage.getItem('viewHistory') || '[]');
            let content = `<div style="max-width:500px;">
                <h6 class="mb-3">閲覧履歴 (${viewHistory.length}件)</h6>`;
            
            if (viewHistory.length === 0) {
                content += '<p class="text-muted">閲覧履歴はありません。</p>';
            } else {
                content += '<div class="list-group mb-3" style="max-height:300px;overflow-y:auto;">';
                viewHistory.slice(-10).reverse().forEach((guide, index) => {
                    content += `<div class="list-group-item">
                        <div class="d-flex w-100 justify-content-between">
                            <strong>${guide.name}</strong>
                            <small class="text-muted">${guide.viewedAt || '最近'}</small>
                        </div>
                        <p class="mb-1 small">${guide.location} - ¥${guide.price}</p>
                    </div>`;
                });
                content += '</div>';
                content += '<button class="btn btn-info w-100" onclick="clearHistory()">履歴を削除</button>';
            }
            
            content += '</div>';
            showCustomModal('閲覧履歴', content);
        };
        
        window.showGeneralManager = function() {
            const comparisonCount = JSON.parse(localStorage.getItem('comparisonList') || '[]').length;
            const bookmarkCount = JSON.parse(localStorage.getItem('bookmarkList') || '[]').length;
            const historyCount = JSON.parse(localStorage.getItem('viewHistory') || '[]').length;
            
            let content = `<div style="max-width:400px;">
                <h6 class="mb-3">データ管理センター</h6>
                <div class="row text-center mb-3">
                    <div class="col-4">
                        <div class="border rounded p-2">
                            <div class="fs-4 text-success">${comparisonCount}</div>
                            <small>比較中</small>
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="border rounded p-2">
                            <div class="fs-4 text-warning">${bookmarkCount}</div>
                            <small>ブックマーク</small>
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="border rounded p-2">
                            <div class="fs-4 text-info">${historyCount}</div>
                            <small>履歴</small>
                        </div>
                    </div>
                </div>
                <div class="d-grid gap-2">
                    <button class="btn btn-outline-danger" onclick="clearAllData()">全データを削除</button>
                    <button class="btn btn-outline-info" onclick="exportData()">データをエクスポート</button>
                </div>
            </div>`;
            
            showCustomModal('管理センター', content);
        };
        
        // カスタムモーダル表示関数
        window.showCustomModal = function(title, content) {
            const modalId = 'customModal_' + Date.now();
            const modalHtml = `
                <div class="modal fade" id="${modalId}" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">${title}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                ${content}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            const modal = new bootstrap.Modal(document.getElementById(modalId));
            modal.show();
            
            modal._element.addEventListener('hidden.bs.modal', function() {
                document.getElementById(modalId).remove();
            });
        };
    }
    
    // DOM読み込み後に実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializePanel);
    } else {
        initializePanel();
    }
    
    // フォールバック：2秒後に再実行
    setTimeout(initializePanel, 2000);
})();