// 管理センター トリガーボタンシステム

(function() {
    'use strict';
    
    console.log('管理センタートリガーシステム開始');
    
    let isManagementPanelVisible = false;
    
    function createManagementTriggerSystem() {
        // 既存の管理パネルを削除
        const existingPanel = document.getElementById('management-center-panel');
        const existingTrigger = document.getElementById('management-trigger-btn');
        if (existingPanel) existingPanel.remove();
        if (existingTrigger) existingTrigger.remove();
        
        // トリガーボタンを作成（常時表示）
        const triggerBtn = document.createElement('div');
        triggerBtn.id = 'management-trigger-btn';
        triggerBtn.innerHTML = `
            <button onclick="toggleManagementPanel()" style="
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 70px;
                height: 70px;
                border-radius: 50%;
                background: linear-gradient(135deg, #4CAF50, #45a049);
                border: none;
                color: white;
                font-size: 28px;
                cursor: pointer;
                box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
                z-index: 99998;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 3px solid rgba(255, 255, 255, 0.2);
            " onmouseover="this.style.transform='scale(1.1)'; this.style.boxShadow='0 12px 35px rgba(76, 175, 80, 0.6)';" 
               onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 8px 25px rgba(76, 175, 80, 0.4)';"
               title="管理センターを開く">
                🏆
            </button>
        `;
        
        // 管理センターパネル（初期は非表示）
        const panel = document.createElement('div');
        panel.id = 'management-center-panel';
        panel.dataset.newSystem = 'true'; // 新システムマーカー
        panel.style.display = 'none';
        panel.innerHTML = `
            <div class="floating-toolbar" style="
                position: fixed;
                bottom: 120px;
                right: 20px;
                background: linear-gradient(135deg, #4CAF50, #45a049);
                color: white;
                padding: 22px;
                border-radius: 20px;
                z-index: 99999;
                font-size: 14px;
                min-width: 300px;
                text-align: center;
                box-shadow: 0 20px 50px rgba(0,0,0,0.3);
                border: 3px solid rgba(255,255,255,0.25);
                backdrop-filter: blur(12px);
                animation: slideUp 0.3s ease-out;
            ">
                <style>
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                </style>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">
                    <div style="font-weight:bold;font-size:19px;text-shadow:0 2px 4px rgba(0,0,0,0.3);">🏆 管理センター</div>
                    <button onclick="toggleManagementPanel()" style="
                        background: rgba(255,255,255,0.2);
                        border: none;
                        color: white;
                        font-size: 18px;
                        cursor: pointer;
                        padding: 8px;
                        border-radius: 50%;
                        width: 32px;
                        height: 32px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.2s ease;
                    " onmouseover="this.style.background='rgba(255,255,255,0.3)';" 
                       onmouseout="this.style.background='rgba(255,255,255,0.2)';"
                       title="閉じる">×</button>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px;">
                    <button class="toolbar-btn" data-action="compare" style="
                        padding: 14px 12px;
                        border: none;
                        border-radius: 12px;
                        background: rgba(255,255,255,0.25);
                        color: white;
                        cursor: pointer;
                        font-size: 13px;
                        font-weight: bold;
                        border: 2px solid rgba(255,255,255,0.4);
                        transition: all 0.3s ease;
                    ">比較</button>
                    <button class="toolbar-btn" data-action="bookmark" style="
                        padding: 14px 12px;
                        border: none;
                        border-radius: 12px;
                        background: rgba(255,255,255,0.25);
                        color: white;
                        cursor: pointer;
                        font-size: 13px;
                        font-weight: bold;
                        border: 2px solid rgba(255,255,255,0.4);
                        transition: all 0.3s ease;
                    ">ブックマーク</button>
                    <button class="toolbar-btn" data-action="history" style="
                        padding: 14px 12px;
                        border: none;
                        border-radius: 12px;
                        background: rgba(255,255,255,0.25);
                        color: white;
                        cursor: pointer;
                        font-size: 13px;
                        font-weight: bold;
                        border: 2px solid rgba(255,255,255,0.4);
                        transition: all 0.3s ease;
                    ">履歴</button>
                    <button class="toolbar-btn" data-action="manage" style="
                        padding: 14px 12px;
                        border: none;
                        border-radius: 12px;
                        background: rgba(255,255,255,0.25);
                        color: white;
                        cursor: pointer;
                        font-size: 13px;
                        font-weight: bold;
                        border: 2px solid rgba(255,255,255,0.4);
                        transition: all 0.3s ease;
                    ">管理</button>
                </div>
                <div style="background:rgba(255,255,255,0.18);border-radius:12px;padding:14px;margin-bottom:14px;">
                    <div id="comparison-counter" style="font-size:14px;color:rgba(255,255,255,0.95);margin-bottom:5px;font-weight:600;">比較中: 0/3人</div>
                    <div id="bookmark-counter" style="font-size:14px;color:rgba(255,255,255,0.95);font-weight:600;">ブックマーク(0)</div>
                </div>
                <div style="font-size:12px;color:rgba(255,255,255,0.8);line-height:1.4;">ガイドカードの ⭐ ✓ ボタンで選択</div>
            </div>
        `;
        
        // DOM に追加
        document.body.appendChild(triggerBtn);
        document.body.appendChild(panel);
        
        // ボタンイベント設定
        setupButtonEvents();
        
        // カウンター更新
        updateCounters();
    }
    
    function setupButtonEvents() {
        const buttons = document.querySelectorAll('.toolbar-btn');
        buttons.forEach(btn => {
            const action = btn.getAttribute('data-action');
            
            btn.addEventListener('click', function() {
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
                        showDataManager();
                        break;
                }
            });
            
            // ホバーエフェクト
            btn.onmouseover = function() {
                this.style.background = 'rgba(255,255,255,0.45)';
                this.style.transform = 'scale(1.05)';
                this.style.boxShadow = '0 4px 12px rgba(255,255,255,0.3)';
            };
            btn.onmouseout = function() {
                this.style.background = 'rgba(255,255,255,0.25)';
                this.style.transform = 'scale(1)';
                this.style.boxShadow = 'none';
            };
        });
    }
    
    // パネル表示切り替え
    window.toggleManagementPanel = function() {
        const panel = document.getElementById('management-center-panel');
        if (!panel) return;
        
        if (isManagementPanelVisible) {
            panel.style.display = 'none';
            isManagementPanelVisible = false;
        } else {
            panel.style.display = 'block';
            isManagementPanelVisible = true;
            updateCounters();
        }
    };
    
    // カウンター更新関数
    function updateCounters() {
        const comparisonList = JSON.parse(localStorage.getItem('comparisonList') || '[]');
        const bookmarkList = JSON.parse(localStorage.getItem('bookmarkList') || '[]');
        
        const comparisonCounter = document.getElementById('comparison-counter');
        const bookmarkCounter = document.getElementById('bookmark-counter');
        
        if (comparisonCounter) {
            comparisonCounter.textContent = `比較中: ${comparisonList.length}/3人`;
        }
        
        if (bookmarkCounter) {
            bookmarkCounter.textContent = `ブックマーク(${bookmarkList.length})`;
        }
        
        // トリガーボタンに通知バッジを追加
        const triggerBtn = document.querySelector('#management-trigger-btn button');
        if (triggerBtn) {
            const totalItems = comparisonList.length + bookmarkList.length;
            if (totalItems > 0) {
                triggerBtn.style.position = 'relative';
                if (!triggerBtn.querySelector('.notification-badge')) {
                    const badge = document.createElement('div');
                    badge.className = 'notification-badge';
                    badge.style.cssText = `
                        position: absolute;
                        top: -5px;
                        right: -5px;
                        background: #ff4757;
                        color: white;
                        border-radius: 50%;
                        width: 24px;
                        height: 24px;
                        font-size: 12px;
                        font-weight: bold;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 0 2px 8px rgba(255, 71, 87, 0.4);
                    `;
                    badge.textContent = totalItems > 9 ? '9+' : totalItems;
                    triggerBtn.appendChild(badge);
                }
            } else {
                const badge = triggerBtn.querySelector('.notification-badge');
                if (badge) badge.remove();
            }
        }
    }
    
    // グローバル関数として公開
    window.updateComparisonCounter = updateCounters;
    window.updateBookmarkCounter = updateCounters;
    
    // 操作用関数をグローバルに定義
    window.removeFromComparison = function(index) {
        const comparisonList = JSON.parse(localStorage.getItem('comparisonList') || '[]');
        if (index >= 0 && index < comparisonList.length) {
            comparisonList.splice(index, 1);
            localStorage.setItem('comparisonList', JSON.stringify(comparisonList));
            updateCounters();
            
            const activeModal = document.querySelector('.modal.show');
            if (activeModal) {
                bootstrap.Modal.getInstance(activeModal).hide();
                setTimeout(() => showComparisonManager(), 300);
            }
        }
    };
    
    window.removeFromBookmarks = function(index) {
        const bookmarkList = JSON.parse(localStorage.getItem('bookmarkList') || '[]');
        if (index >= 0 && index < bookmarkList.length) {
            bookmarkList.splice(index, 1);
            localStorage.setItem('bookmarkList', JSON.stringify(bookmarkList));
            updateCounters();
            
            const activeModal = document.querySelector('.modal.show');
            if (activeModal) {
                bootstrap.Modal.getInstance(activeModal).hide();
                setTimeout(() => showBookmarkManager(), 300);
            }
        }
    };
    
    window.clearAllBookmarks = function() {
        if (confirm('すべてのブックマークを削除しますか？')) {
            localStorage.setItem('bookmarkList', '[]');
            updateCounters();
            
            const activeModal = document.querySelector('.modal.show');
            if (activeModal) {
                bootstrap.Modal.getInstance(activeModal).hide();
                setTimeout(() => showBookmarkManager(), 300);
            }
        }
    };
    
    window.clearHistory = function() {
        if (confirm('閲覧履歴を削除しますか？')) {
            localStorage.setItem('viewHistory', '[]');
            
            const activeModal = document.querySelector('.modal.show');
            if (activeModal) {
                bootstrap.Modal.getInstance(activeModal).hide();
                setTimeout(() => showHistoryManager(), 300);
            }
        }
    };
    
    window.clearAllData = function() {
        if (confirm('すべてのデータ（比較・ブックマーク・履歴）を削除しますか？\\n\\nこの操作は取り消せません。')) {
            localStorage.setItem('comparisonList', '[]');
            localStorage.setItem('bookmarkList', '[]');
            localStorage.setItem('viewHistory', '[]');
            updateCounters();
            
            alert('すべてのデータが削除されました。');
            
            const activeModal = document.querySelector('.modal.show');
            if (activeModal) {
                bootstrap.Modal.getInstance(activeModal).hide();
            }
        }
    };
    
    window.exportData = function() {
        const data = {
            comparisonList: JSON.parse(localStorage.getItem('comparisonList') || '[]'),
            bookmarkList: JSON.parse(localStorage.getItem('bookmarkList') || '[]'),
            viewHistory: JSON.parse(localStorage.getItem('viewHistory') || '[]'),
            exportedAt: new Date().toLocaleString('ja-JP')
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tomotrip_data_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('データのエクスポートが完了しました。');
    };
    
    window.startComparison = function() {
        const comparisonList = JSON.parse(localStorage.getItem('comparisonList') || '[]');
        if (comparisonList.length < 2) {
            alert('比較するには最低2人のガイドが必要です。');
            return;
        }
        
        let comparisonContent = `
            <div style="max-width:700px;">
                <h5 class="mb-4 text-center">ガイド比較結果</h5>
                <div class="table-responsive">
                    <table class="table table-bordered">
                        <thead class="table-success">
                            <tr>
                                <th>項目</th>
                                ${comparisonList.map(guide => `<th>${guide.name}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>場所</strong></td>
                                ${comparisonList.map(guide => `<td>${guide.location}</td>`).join('')}
                            </tr>
                            <tr>
                                <td><strong>料金</strong></td>
                                ${comparisonList.map(guide => `<td class="text-primary fw-bold">¥${guide.price}</td>`).join('')}
                            </tr>
                            <tr>
                                <td><strong>追加日時</strong></td>
                                ${comparisonList.map(guide => `<td class="small text-muted">${guide.comparedAt || '不明'}</td>`).join('')}
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="text-center mt-3">
                    <button class="btn btn-success" onclick="alert('詳細な比較機能は今後のアップデートで追加予定です。')">詳細比較</button>
                </div>
            </div>
        `;
        
        const activeModal = document.querySelector('.modal.show');
        if (activeModal) {
            bootstrap.Modal.getInstance(activeModal).hide();
            setTimeout(() => {
                if (window.showCustomModal) {
                    window.showCustomModal('ガイド比較', comparisonContent);
                }
            }, 300);
        }
    };
    
    // 管理機能（simple-management-panel.jsから移植）
    function showComparisonManager() {
        const comparisonList = JSON.parse(localStorage.getItem('comparisonList') || '[]');
        
        let content = `
            <div style="max-width:600px;">
                <h5 class="mb-4 text-center">比較リスト管理 (${comparisonList.length}/3人)</h5>
        `;
        
        if (comparisonList.length === 0) {
            content += `
                <div class="alert alert-info text-center">
                    <p class="mb-0">比較するガイドが選択されていません。<br>ガイドカードの ✓ ボタンでガイドを選択してください。</p>
                </div>
            `;
        } else {
            content += `<div class="row">`;
            comparisonList.forEach((guide, index) => {
                content += `
                    <div class="col-md-6 mb-3">
                        <div class="card border-success">
                            <div class="card-body">
                                <h6 class="card-title">${guide.name}</h6>
                                <p class="card-text text-muted small">${guide.location}</p>
                                <p class="card-text text-primary fw-bold">¥${guide.price}</p>
                                <button class="btn btn-sm btn-outline-danger" onclick="removeFromComparison(${index})">削除</button>
                            </div>
                        </div>
                    </div>
                `;
            });
            content += `</div>`;
            
            if (comparisonList.length >= 2) {
                content += `
                    <div class="text-center mt-3">
                        <button class="btn btn-success btn-lg" onclick="startComparison()">比較開始</button>
                    </div>
                `;
            }
        }
        
        content += `</div>`;
        
        if (window.showCustomModal) {
            window.showCustomModal('比較リスト', content);
        }
    }
    
    function showBookmarkManager() {
        const bookmarkList = JSON.parse(localStorage.getItem('bookmarkList') || '[]');
        
        let content = `
            <div style="max-width:600px;">
                <h5 class="mb-4 text-center">ブックマーク管理 (${bookmarkList.length}件)</h5>
        `;
        
        if (bookmarkList.length === 0) {
            content += `
                <div class="alert alert-info text-center">
                    <p class="mb-0">ブックマークされたガイドがありません。<br>ガイドカードの ⭐ ボタンでガイドを保存してください。</p>
                </div>
            `;
        } else {
            content += `
                <div class="mb-3 text-end">
                    <button class="btn btn-outline-danger btn-sm" onclick="clearAllBookmarks()">全削除</button>
                </div>
                <div class="row">
            `;
            bookmarkList.forEach((guide, index) => {
                content += `
                    <div class="col-md-6 mb-3">
                        <div class="card border-warning">
                            <div class="card-body">
                                <h6 class="card-title">${guide.name}</h6>
                                <p class="card-text text-muted small">${guide.location}</p>
                                <p class="card-text text-primary fw-bold">¥${guide.price}</p>
                                <p class="card-text text-muted small">保存: ${guide.bookmarkedAt || '不明'}</p>
                                <button class="btn btn-sm btn-outline-danger" onclick="removeFromBookmarks(${index})">削除</button>
                            </div>
                        </div>
                    </div>
                `;
            });
            content += `</div>`;
        }
        
        content += `</div>`;
        
        if (window.showCustomModal) {
            window.showCustomModal('ブックマーク', content);
        }
    }
    
    function showHistoryManager() {
        const viewHistory = JSON.parse(localStorage.getItem('viewHistory') || '[]');
        
        let content = `
            <div style="max-width:600px;">
                <h5 class="mb-4 text-center">閲覧履歴 (${viewHistory.length}件)</h5>
        `;
        
        if (viewHistory.length === 0) {
            content += `
                <div class="alert alert-info text-center">
                    <p class="mb-0">閲覧履歴がありません。</p>
                </div>
            `;
        } else {
            content += `
                <div class="mb-3 text-end">
                    <button class="btn btn-outline-danger btn-sm" onclick="clearHistory()">履歴削除</button>
                </div>
                <div class="list-group">
            `;
            viewHistory.slice(0, 10).forEach((item) => {
                content += `
                    <div class="list-group-item">
                        <div class="d-flex justify-content-between">
                            <h6 class="mb-1">${item.name || '不明'}</h6>
                            <small>${item.viewedAt || '不明'}</small>
                        </div>
                        <p class="mb-1 text-muted">${item.location || '場所不明'}</p>
                    </div>
                `;
            });
            content += `</div>`;
        }
        
        content += `</div>`;
        
        if (window.showCustomModal) {
            window.showCustomModal('閲覧履歴', content);
        }
    }
    
    function showDataManager() {
        const comparisonList = JSON.parse(localStorage.getItem('comparisonList') || '[]');
        const bookmarkList = JSON.parse(localStorage.getItem('bookmarkList') || '[]');
        const viewHistory = JSON.parse(localStorage.getItem('viewHistory') || '[]');
        
        const content = `
            <div style="max-width:500px;">
                <h5 class="mb-4 text-center">データ管理センター</h5>
                
                <div class="row text-center mb-4">
                    <div class="col-4">
                        <div class="card border-success">
                            <div class="card-body">
                                <h2 class="text-success">${comparisonList.length}</h2>
                                <p class="mb-0">比較中</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="card border-warning">
                            <div class="card-body">
                                <h2 class="text-warning">${bookmarkList.length}</h2>
                                <p class="mb-0">ブックマーク</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="card border-info">
                            <div class="card-body">
                                <h2 class="text-info">${viewHistory.length}</h2>
                                <p class="mb-0">履歴</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="d-grid gap-2">
                    <button class="btn btn-outline-primary" onclick="exportData()">データエクスポート</button>
                    <button class="btn btn-outline-danger" onclick="clearAllData()">全データ削除</button>
                </div>
            </div>
        `;
        
        if (window.showCustomModal) {
            window.showCustomModal('データ管理', content);
        }
    }
    
    // レスポンシブ対応
    function adjustForMobile() {
        if (window.innerWidth <= 768) {
            const triggerBtn = document.querySelector('#management-trigger-btn button');
            const panel = document.querySelector('#management-center-panel .floating-toolbar');
            
            if (triggerBtn) {
                triggerBtn.style.bottom = '20px';
                triggerBtn.style.right = '20px';
                triggerBtn.style.width = '60px';
                triggerBtn.style.height = '60px';
                triggerBtn.style.fontSize = '24px';
            }
            
            if (panel) {
                panel.style.bottom = '90px';
                panel.style.right = '10px';
                panel.style.left = '10px';
                panel.style.minWidth = 'auto';
            }
        }
    }
    
    // 初期化
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(createManagementTriggerSystem, 1000);
        setTimeout(adjustForMobile, 1200);
    });
    
    // リサイズ対応
    window.addEventListener('resize', adjustForMobile);
    
    // 即座に実行
    setTimeout(createManagementTriggerSystem, 500);
    
    console.log('管理センタートリガーシステム完成');
    
})();