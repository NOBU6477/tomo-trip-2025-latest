// 動的ガイドカード表示システム
console.log('ガイドカード表示システム初期化');

class GuideCardRenderer {
    constructor() {
        this.container = document.getElementById('guide-cards-container');
        this.currentFilters = {};
    }
    
    // ガイドカードHTML生成
    generateGuideCardHTML(guide) {
        const languageBadges = guide.languages.map(lang => 
            `<span class="badge bg-light text-dark me-1">${lang}</span>`
        ).join('');
        
        return `
            <div class="col-md-4 mb-4" data-guide-id="${guide.id}">
                <div class="card guide-card shadow-sm h-100">
                    <img src="${guide.photo}" class="card-img-top" alt="${guide.name}">
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="card-title mb-0">${guide.name}</h5>
                            <span class="badge bg-primary">${guide.rating.toFixed(1)}★</span>
                        </div>
                        <p class="text-muted mb-2"><i class="bi bi-geo-alt"></i> ${guide.location}</p>
                        <p class="card-text mb-3 flex-grow-1">${guide.description}</p>
                        <div class="mb-3">
                            ${languageBadges}
                        </div>
                        <div class="mb-2">
                            <small class="text-muted">
                                <i class="bi bi-tags"></i> ${guide.keywords.join(', ')}
                            </small>
                        </div>
                        <div class="d-flex justify-content-between align-items-center mt-auto">
                            <span class="fw-bold text-primary">¥${guide.price.toLocaleString()}/session</span>
                            <div class="btn-group">
                                <button class="btn btn-primary btn-sm" onclick="viewGuideDetails(${guide.id})">詳細</button>
                                <button class="btn btn-outline-secondary btn-sm" onclick="editGuide(${guide.id})" title="編集">
                                    <i class="bi bi-pencil"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // 全ガイドカード表示
    renderAllGuides() {
        if (!this.container) {
            console.error('Guide cards container not found');
            return;
        }
        
        const guides = window.guideDB.getActiveGuides();
        console.log('表示するガイド数:', guides.length);
        
        this.container.innerHTML = guides.map(guide => this.generateGuideCardHTML(guide)).join('');
        this.updateGuideCounter(guides.length);
    }
    
    // フィルター適用後のガイド表示
    renderFilteredGuides(filters) {
        if (!this.container) return;
        
        this.currentFilters = filters;
        const filteredGuides = window.guideDB.filterGuides(filters);
        console.log('フィルター後のガイド数:', filteredGuides.length);
        
        this.container.innerHTML = filteredGuides.map(guide => this.generateGuideCardHTML(guide)).join('');
        this.updateGuideCounter(filteredGuides.length);
    }
    
    // ガイド数表示更新
    updateGuideCounter(count) {
        const counterElement = document.getElementById('guide-count-number');
        if (counterElement) {
            counterElement.textContent = count;
        }
        
        // メインカウンター更新
        const mainCounterElements = document.querySelectorAll('.guide-counter, [id*="guide-count"]');
        mainCounterElements.forEach(element => {
            if (element.textContent.includes('人のガイドが見つかりました')) {
                element.innerHTML = `<i class="bi bi-people"></i> ${count}人のガイドが見つかりました`;
            }
        });
    }
    
    // 単一ガイド更新
    updateSingleGuide(guide) {
        const existingCard = document.querySelector(`[data-guide-id="${guide.id}"]`);
        if (existingCard) {
            existingCard.outerHTML = this.generateGuideCardHTML(guide);
        } else {
            // 新しいガイドの場合は再描画
            this.renderAllGuides();
        }
    }
}

// ガイド編集フォーム
class GuideEditor {
    constructor() {
        this.createEditModal();
    }
    
    createEditModal() {
        const modalHTML = `
            <div class="modal fade" id="guideEditModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">ガイド編集</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="guideEditForm">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label class="form-label">名前</label>
                                            <input type="text" class="form-control" id="editName" required>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">地域</label>
                                            <select class="form-control" id="editRegion" required>
                                                <option value="Tokyo">東京都</option>
                                                <option value="Osaka">大阪府</option>
                                                <option value="Kyoto">京都府</option>
                                                <option value="Hokkaido">北海道</option>
                                                <option value="Aichi">愛知県</option>
                                                <option value="Kanagawa">神奈川県</option>
                                                <option value="Hyogo">兵庫県</option>
                                                <option value="Fukuoka">福岡県</option>
                                            </select>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">料金（円/セッション）</label>
                                            <input type="number" class="form-control" id="editPrice" min="6000" required>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label class="form-label">言語</label>
                                            <div id="editLanguages">
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" value="日本語" id="lang-ja">
                                                    <label class="form-check-label" for="lang-ja">日本語</label>
                                                </div>
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" value="英語" id="lang-en">
                                                    <label class="form-check-label" for="lang-en">英語</label>
                                                </div>
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" value="中国語" id="lang-zh">
                                                    <label class="form-check-label" for="lang-zh">中国語</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">写真URL</label>
                                            <input type="url" class="form-control" id="editPhoto">
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">紹介文</label>
                                    <textarea class="form-control" id="editDescription" rows="3" required></textarea>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">キーワード</label>
                                    <div id="editKeywords">
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="checkbox" value="ナイトツアー" id="kw-night">
                                            <label class="form-check-label" for="kw-night">ナイトツアー</label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="checkbox" value="グルメ" id="kw-gourmet">
                                            <label class="form-check-label" for="kw-gourmet">グルメ</label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="checkbox" value="撮影スポット" id="kw-photo">
                                            <label class="form-check-label" for="kw-photo">撮影スポット</label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="checkbox" value="料理" id="kw-cooking">
                                            <label class="form-check-label" for="kw-cooking">料理</label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="checkbox" value="アクティビティ" id="kw-activity">
                                            <label class="form-check-label" for="kw-activity">アクティビティ</label>
                                        </div>
                                    </div>
                                    <input type="text" class="form-control mt-2" id="editCustomKeywords" placeholder="追加キーワード（カンマ区切り）">
                                </div>
                                <input type="hidden" id="editGuideId">
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
                            <button type="button" class="btn btn-danger" id="deleteGuideBtn">削除</button>
                            <button type="button" class="btn btn-primary" id="saveGuideBtn">保存</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.bindEvents();
    }
    
    bindEvents() {
        document.getElementById('saveGuideBtn').addEventListener('click', () => this.saveGuide());
        document.getElementById('deleteGuideBtn').addEventListener('click', () => this.deleteGuide());
    }
    
    openEditModal(guideId) {
        const guide = window.guideDB.getAllGuides().find(g => g.id === guideId);
        if (!guide) return;
        
        // フォームに既存データを設定
        document.getElementById('editGuideId').value = guide.id;
        document.getElementById('editName').value = guide.name;
        document.getElementById('editRegion').value = guide.region;
        document.getElementById('editPrice').value = guide.price;
        document.getElementById('editDescription').value = guide.description;
        document.getElementById('editPhoto').value = guide.photo || '';
        
        // 言語チェックボックス設定
        document.querySelectorAll('#editLanguages input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = guide.languages.includes(checkbox.value);
        });
        
        // キーワードチェックボックス設定
        document.querySelectorAll('#editKeywords input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = guide.keywords.includes(checkbox.value);
        });
        
        const modal = new bootstrap.Modal(document.getElementById('guideEditModal'));
        modal.show();
    }
    
    saveGuide() {
        const guideId = parseInt(document.getElementById('editGuideId').value);
        const formData = this.getFormData();
        
        if (guideId) {
            // 既存ガイド更新
            window.guideDB.updateGuide(guideId, formData);
        } else {
            // 新規ガイド追加
            window.guideDB.addGuide(formData);
        }
        
        // 表示更新
        window.guideRenderer.renderAllGuides();
        
        // モーダル閉じる
        const modal = bootstrap.Modal.getInstance(document.getElementById('guideEditModal'));
        modal.hide();
        
        console.log('ガイド保存完了:', formData);
    }
    
    deleteGuide() {
        const guideId = parseInt(document.getElementById('editGuideId').value);
        if (guideId && confirm('このガイドを削除しますか？')) {
            window.guideDB.deleteGuide(guideId);
            window.guideRenderer.renderAllGuides();
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('guideEditModal'));
            modal.hide();
        }
    }
    
    getFormData() {
        const locationMapping = {
            'Tokyo': '東京',
            'Osaka': '大阪',
            'Kyoto': '京都',
            'Hokkaido': '北海道',
            'Aichi': '愛知',
            'Kanagawa': '神奈川',
            'Hyogo': '兵庫',
            'Fukuoka': '福岡'
        };
        
        const region = document.getElementById('editRegion').value;
        const languages = Array.from(document.querySelectorAll('#editLanguages input:checked')).map(cb => cb.value);
        const keywords = Array.from(document.querySelectorAll('#editKeywords input:checked')).map(cb => cb.value);
        const customKeywords = document.getElementById('editCustomKeywords').value
            .split(',')
            .map(k => k.trim())
            .filter(k => k);
        
        return {
            name: document.getElementById('editName').value,
            location: locationMapping[region] || region,
            region: region,
            description: document.getElementById('editDescription').value,
            languages: languages,
            price: parseInt(document.getElementById('editPrice').value),
            keywords: [...keywords, ...customKeywords],
            photo: document.getElementById('editPhoto').value || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=250&fit=crop',
            rating: 4.5 // デフォルト値
        };
    }
}

// グローバル関数
window.viewGuideDetails = function(guideId) {
    const guide = window.guideDB.getAllGuides().find(g => g.id === guideId);
    if (guide) {
        alert(`ガイド詳細\n\n名前: ${guide.name}\n地域: ${guide.location}\n料金: ¥${guide.price.toLocaleString()}\n言語: ${guide.languages.join(', ')}\nキーワード: ${guide.keywords.join(', ')}\n\n${guide.description}`);
    }
};

window.editGuide = function(guideId) {
    window.guideEditor.openEditModal(guideId);
};

window.addNewGuide = function() {
    // 新規ガイド追加モーダルを開く
    if (window.guideEditor) {
        // フォームをリセット
        document.getElementById('editGuideId').value = '';
        document.getElementById('editName').value = '';
        document.getElementById('editRegion').value = 'Tokyo';
        document.getElementById('editPrice').value = '6000';
        document.getElementById('editDescription').value = '';
        document.getElementById('editPhoto').value = '';
        document.getElementById('editCustomKeywords').value = '';
        
        // チェックボックスをリセット
        document.querySelectorAll('#editLanguages input[type="checkbox"]').forEach(cb => cb.checked = false);
        document.querySelectorAll('#editKeywords input[type="checkbox"]').forEach(cb => cb.checked = false);
        
        // デフォルト設定
        document.getElementById('lang-ja').checked = true; // 日本語をデフォルト選択
        
        // モーダルを表示
        const modal = new bootstrap.Modal(document.getElementById('guideEditModal'));
        modal.show();
        
        // モーダルタイトル変更
        document.querySelector('#guideEditModal .modal-title').textContent = '新規ガイド追加';
        document.getElementById('deleteGuideBtn').style.display = 'none'; // 削除ボタンを隠す
    }
};

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    window.guideRenderer = new GuideCardRenderer();
    window.guideEditor = new GuideEditor();
    
    // 初期表示
    setTimeout(() => {
        window.guideRenderer.renderAllGuides();
    }, 500);
});

console.log('ガイドカード表示システム初期化完了');