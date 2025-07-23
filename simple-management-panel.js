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
            <div class="floating-toolbar" style="position:fixed;top:50%;right:20px;transform:translateY(-50%);background:#4CAF50;color:white;padding:20px;border-radius:15px;z-index:99999;font-size:14px;min-width:200px;text-align:center;box-shadow:0 12px 35px rgba(0,0,0,0.4);border:3px solid rgba(255,255,255,0.2);">
                <div style="font-weight:bold;margin-bottom:15px;font-size:18px;text-shadow:0 2px 4px rgba(0,0,0,0.3);">🏆管理センター</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:15px;">
                    <button class="toolbar-btn" data-action="compare" style="padding:10px 8px;border:none;border-radius:8px;background:rgba(255,255,255,0.25);color:white;cursor:pointer;font-size:12px;font-weight:bold;border:2px solid rgba(255,255,255,0.4);transition:all 0.3s ease;">比較</button>
                    <button class="toolbar-btn" data-action="bookmark" style="padding:10px 8px;border:none;border-radius:8px;background:rgba(255,255,255,0.25);color:white;cursor:pointer;font-size:12px;font-weight:bold;border:2px solid rgba(255,255,255,0.4);transition:all 0.3s ease;">ブックマーク</button>
                    <button class="toolbar-btn" data-action="history" style="padding:10px 8px;border:none;border-radius:8px;background:rgba(255,255,255,0.25);color:white;cursor:pointer;font-size:12px;font-weight:bold;border:2px solid rgba(255,255,255,0.4);transition:all 0.3s ease;">履歴</button>
                    <button class="toolbar-btn" data-action="manage" style="padding:10px 8px;border:none;border-radius:8px;background:rgba(255,255,255,0.25);color:white;cursor:pointer;font-size:12px;font-weight:bold;border:2px solid rgba(255,255,255,0.4);transition:all 0.3s ease;">管理</button>
                </div>
                <div style="background:rgba(255,255,255,0.15);border-radius:8px;padding:10px;margin-bottom:10px;">
                    <div id="comparison-counter" style="font-size:12px;color:rgba(255,255,255,0.95);margin-bottom:3px;font-weight:600;">比較中: 0/3人</div>
                    <div id="bookmark-counter" style="font-size:12px;color:rgba(255,255,255,0.95);font-weight:600;">ブックマーク(0)</div>
                </div>
                <div style="font-size:10px;color:rgba(255,255,255,0.7);line-height:1.3;">ガイドカードの⭐✓ボタンで選択</div>
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
        
        // 管理センター使い方ガイド
        window.openManagementGuide = function() {
            const content = `
                <div style="max-width:600px;">
                    <h5 class="mb-4 text-center">🏆 管理センター完全ガイド</h5>
                    
                    <div class="alert alert-info mb-4">
                        <h6><i class="bi bi-info-circle me-2"></i>管理センター位置</h6>
                        <p class="mb-0">画面右側中央にある<strong class="text-success">緑色の「🏆管理センター」</strong>パネルをご利用ください。</p>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <div class="card border-primary">
                                <div class="card-header bg-primary text-white">
                                    <strong>1. ガイド選択方法</strong>
                                </div>
                                <div class="card-body">
                                    <p class="small mb-2">ガイドカードの右上にある以下のボタンをクリック：</p>
                                    <div class="d-flex gap-2 mb-2">
                                        <button class="btn btn-sm btn-outline-warning" disabled>⭐</button>
                                        <span class="small">ブックマーク</span>
                                    </div>
                                    <div class="d-flex gap-2">
                                        <button class="btn btn-sm btn-outline-success" disabled>✓</button>
                                        <span class="small">比較リストに追加</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-6 mb-3">
                            <div class="card border-success">
                                <div class="card-header bg-success text-white">
                                    <strong>2. 選択したガイドの確認</strong>
                                </div>
                                <div class="card-body">
                                    <p class="small mb-2">管理センターの各ボタンで確認：</p>
                                    <ul class="small mb-0">
                                        <li><strong>比較</strong> - 比較中のガイド一覧</li>
                                        <li><strong>ブックマーク</strong> - 保存したガイド</li>
                                        <li><strong>履歴</strong> - 閲覧したガイド</li>
                                        <li><strong>管理</strong> - 全データ統計</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card border-warning mb-3">
                        <div class="card-header bg-warning text-dark">
                            <strong>3. 管理センター機能詳細</strong>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-6">
                                    <h6 class="text-success">比較機能</h6>
                                    <ul class="small">
                                        <li>最大3人まで選択可能</li>
                                        <li>料金・評価・特技を比較</li>
                                        <li>個別削除可能</li>
                                    </ul>
                                </div>
                                <div class="col-6">
                                    <h6 class="text-warning">ブックマーク機能</h6>
                                    <ul class="small">
                                        <li>無制限に保存可能</li>
                                        <li>後で簡単にアクセス</li>
                                        <li>個別・一括削除可能</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="text-center">
                        <div class="alert alert-success">
                            <strong>💡 使い方のコツ</strong><br>
                            気になるガイドを⭐でブックマーク → 詳しく比較したいガイドを✓で選択 → 管理センターで比較・管理
                        </div>
                    </div>
                </div>
            `;
            
            showCustomModal('管理センター使い方ガイド', content);
        };
        
        // 削除・操作用の追加関数
        window.removeFromComparison = function(index) {
            const comparisonList = JSON.parse(localStorage.getItem('comparisonList') || '[]');
            if (index >= 0 && index < comparisonList.length) {
                comparisonList.splice(index, 1);
                localStorage.setItem('comparisonList', JSON.stringify(comparisonList));
                
                // カウンター更新
                if (window.updateComparisonCounter) {
                    window.updateComparisonCounter();
                }
                
                // モーダルを閉じて再表示
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
                
                // カウンター更新
                if (window.updateBookmarkCounter) {
                    window.updateBookmarkCounter();
                }
                
                // モーダルを閉じて再表示
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
                
                // カウンター更新
                if (window.updateBookmarkCounter) {
                    window.updateBookmarkCounter();
                }
                
                // モーダルを閉じて再表示
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
                
                // モーダルを閉じて再表示
                const activeModal = document.querySelector('.modal.show');
                if (activeModal) {
                    bootstrap.Modal.getInstance(activeModal).hide();
                    setTimeout(() => showHistoryManager(), 300);
                }
            }
        };
        
        window.clearAllData = function() {
            if (confirm('すべてのデータ（比較・ブックマーク・履歴）を削除しますか？\n\nこの操作は取り消せません。')) {
                localStorage.setItem('comparisonList', '[]');
                localStorage.setItem('bookmarkList', '[]');  
                localStorage.setItem('viewHistory', '[]');
                
                // カウンター更新
                if (window.updateComparisonCounter) {
                    window.updateComparisonCounter();
                }
                if (window.updateBookmarkCounter) {
                    window.updateBookmarkCounter();
                }
                
                alert('すべてのデータが削除されました。');
                
                // モーダルを閉じる
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
            
            // モーダルを閉じて比較結果を表示
            const activeModal = document.querySelector('.modal.show');
            if (activeModal) {
                bootstrap.Modal.getInstance(activeModal).hide();
                setTimeout(() => showCustomModal('ガイド比較', comparisonContent), 300);
            }
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