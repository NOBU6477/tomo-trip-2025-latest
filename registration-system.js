// 登録システム統合（ガイド・観光客）
console.log('登録システム統合開始');

// ガイド登録機能
window.registerAsGuide = function() {
    console.log('ガイド登録モーダル開始');
    
    // 既存のガイド編集システムを活用
    if (window.guideEditor) {
        // 新規ガイド追加モーダルと同じ動作
        window.addNewGuide();
        
        // モーダルタイトルを変更
        setTimeout(() => {
            const modalTitle = document.querySelector('#guideEditModal .modal-title');
            if (modalTitle) {
                modalTitle.textContent = 'ガイドとして新規登録';
            }
            
            // 削除ボタンを隠す
            const deleteBtn = document.getElementById('deleteGuideBtn');
            if (deleteBtn) {
                deleteBtn.style.display = 'none';
            }
            
            // 保存ボタンのテキストを変更
            const saveBtn = document.getElementById('saveGuideBtn');
            if (saveBtn) {
                saveBtn.textContent = '登録する';
            }
        }, 100);
    } else {
        // フォールバック：従来の登録モーダル
        const registerModal = document.getElementById('registerModal');
        if (registerModal) {
            const modal = new bootstrap.Modal(registerModal);
            modal.show();
        } else {
            alert('ガイド登録フォームを準備中です。しばらくお待ちください。');
        }
    }
};

// 観光客登録機能
window.registerAsTourist = function() {
    console.log('観光客登録開始');
    
    // 観光客登録モーダルを作成・表示
    createTouristRegistrationModal();
};

// 観光客登録モーダル作成
function createTouristRegistrationModal() {
    // 既存モーダルがあれば削除
    const existingModal = document.getElementById('touristRegisterModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modalHTML = `
        <div class="modal fade" id="touristRegisterModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">観光客として新規登録</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="touristRegisterForm">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label class="form-label">お名前</label>
                                        <input type="text" class="form-control" id="touristName" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">メールアドレス</label>
                                        <input type="email" class="form-control" id="touristEmail" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">電話番号</label>
                                        <input type="tel" class="form-control" id="touristPhone" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label class="form-label">国籍</label>
                                        <select class="form-control" id="touristCountry" required>
                                            <option value="">選択してください</option>
                                            <option value="Japan">日本</option>
                                            <option value="USA">アメリカ</option>
                                            <option value="UK">イギリス</option>
                                            <option value="China">中国</option>
                                            <option value="Korea">韓国</option>
                                            <option value="Other">その他</option>
                                        </select>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">希望言語</label>
                                        <div>
                                            <div class="form-check form-check-inline">
                                                <input class="form-check-input" type="checkbox" value="日本語" id="tourist-lang-ja">
                                                <label class="form-check-label" for="tourist-lang-ja">日本語</label>
                                            </div>
                                            <div class="form-check form-check-inline">
                                                <input class="form-check-input" type="checkbox" value="英語" id="tourist-lang-en">
                                                <label class="form-check-label" for="tourist-lang-en">英語</label>
                                            </div>
                                            <div class="form-check form-check-inline">
                                                <input class="form-check-input" type="checkbox" value="中国語" id="tourist-lang-zh">
                                                <label class="form-check-label" for="tourist-lang-zh">中国語</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">旅行予定地</label>
                                        <select class="form-control" id="touristDestination">
                                            <option value="">選択してください</option>
                                            <option value="Tokyo">東京都</option>
                                            <option value="Osaka">大阪府</option>
                                            <option value="Kyoto">京都府</option>
                                            <option value="Hokkaido">北海道</option>
                                            <option value="Other">その他</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">興味のあるアクティビティ</label>
                                <div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="checkbox" value="グルメ" id="tourist-interest-gourmet">
                                        <label class="form-check-label" for="tourist-interest-gourmet">グルメ</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="checkbox" value="撮影スポット" id="tourist-interest-photo">
                                        <label class="form-check-label" for="tourist-interest-photo">撮影スポット</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="checkbox" value="文化体験" id="tourist-interest-culture">
                                        <label class="form-check-label" for="tourist-interest-culture">文化体験</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="checkbox" value="自然・アウトドア" id="tourist-interest-nature">
                                        <label class="form-check-label" for="tourist-interest-nature">自然・アウトドア</label>
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">その他ご要望</label>
                                <textarea class="form-control" id="touristNotes" rows="3" placeholder="特別なリクエストやご質問がございましたらご記入ください"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
                        <button type="button" class="btn btn-primary" onclick="submitTouristRegistration()">登録する</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // モーダル表示
    const modal = new bootstrap.Modal(document.getElementById('touristRegisterModal'));
    modal.show();
}

// 観光客登録データ送信
window.submitTouristRegistration = function() {
    console.log('観光客登録データ送信');
    
    // フォームデータ取得
    const formData = {
        name: document.getElementById('touristName').value,
        email: document.getElementById('touristEmail').value,
        phone: document.getElementById('touristPhone').value,
        country: document.getElementById('touristCountry').value,
        languages: Array.from(document.querySelectorAll('#touristRegisterModal input[id*="tourist-lang"]:checked')).map(cb => cb.value),
        destination: document.getElementById('touristDestination').value,
        interests: Array.from(document.querySelectorAll('#touristRegisterModal input[id*="tourist-interest"]:checked')).map(cb => cb.value),
        notes: document.getElementById('touristNotes').value,
        registeredAt: new Date().toISOString(),
        type: 'tourist'
    };
    
    // バリデーション
    if (!formData.name || !formData.email || !formData.phone) {
        alert('必須項目を入力してください。');
        return;
    }
    
    // LocalStorageに保存（観光客データ）
    const tourists = JSON.parse(localStorage.getItem('tomoTrip_tourists') || '[]');
    tourists.push(formData);
    localStorage.setItem('tomoTrip_tourists', JSON.stringify(tourists));
    
    console.log('観光客登録完了:', formData);
    
    // 成功メッセージ
    alert('観光客として登録が完了しました！\n\nお近くのガイドから連絡をお待ちください。');
    
    // モーダルを閉じる
    const modal = bootstrap.Modal.getInstance(document.getElementById('touristRegisterModal'));
    modal.hide();
};

console.log('登録システム統合完了');