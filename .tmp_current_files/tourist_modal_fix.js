/**
 * 観光客登録モーダルの修正と機能拡張を行うスクリプト
 * 既存のHTMLを動的に新しい構造に置き換えます
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('観光客登録モーダル修正スクリプトが読み込まれました');
  fixTouristRegistrationModal();
  
  // Bootstrap が完全に読み込まれたことを確認
  if (typeof bootstrap === 'undefined') {
    console.log('Bootstrapが見つかりません。ポリフィルを作成します');
    // Bootstrapが利用できない場合の簡易的なポリフィル
    window.bootstrap = {
      Modal: function(element) {
        this.element = element;
        this.show = function() {
          element.style.display = 'block';
          element.classList.add('show');
          element.setAttribute('aria-modal', 'true');
          element.setAttribute('role', 'dialog');
          document.body.classList.add('modal-open');
          
          // 簡易的なバックドロップ
          const backdrop = document.createElement('div');
          backdrop.className = 'modal-backdrop fade show';
          document.body.appendChild(backdrop);
        };
        this.hide = function() {
          element.style.display = 'none';
          element.classList.remove('show');
          element.removeAttribute('aria-modal');
          element.removeAttribute('role');
          document.body.classList.remove('modal-open');
          
          // バックドロップを削除
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) {
            backdrop.remove();
          }
        };
      }
    };
  }
  
  // 遅延実行でボタンイベントを確実に設定
  setTimeout(function() {
    setupCustomEventListeners();
  }, 1000);
});

/**
 * イベントリスナーを手動で設定
 */
function setupCustomEventListeners() {
  console.log('カスタムイベントリスナーを設定します');
  
  // フォーム送信時のバリデーション
  const touristForm = document.getElementById('register-tourist-form');
  if (touristForm) {
    touristForm.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log('観光客登録フォーム送信');
      
      // 電話番号認証チェック
      if (window.isPhoneVerified && typeof window.isPhoneVerified === 'function') {
        if (!window.isPhoneVerified('tourist')) {
          // 電話番号認証セクションまでスクロール
          const phoneSection = document.querySelector('#registerTouristModal .border-bottom:nth-child(3)');
          if (phoneSection) {
            phoneSection.scrollIntoView({ behavior: 'smooth' });
          }
          
          // エラーメッセージ表示
          const errorElement = document.createElement('div');
          errorElement.className = 'alert alert-danger mt-2';
          errorElement.textContent = '電話番号認証を完了してください';
          
          // 既存のエラー要素を削除
          const existingError = document.querySelector('#registerTouristModal .alert-danger');
          if (existingError) {
            existingError.remove();
          }
          
          if (phoneSection) {
            phoneSection.appendChild(errorElement);
            
            // 5秒後にエラーメッセージを削除
            setTimeout(function() {
              errorElement.remove();
            }, 5000);
          }
          
          return;
        }
      }
      
      // ここに他のバリデーションロジックを追加
      
      // フォーム送信処理（この部分はAPIとの連携によって拡張される）
      alert('登録が完了しました！');
      
      // モーダルを閉じる
      const modal = document.getElementById('registerTouristModal');
      if (modal) {
        const bsModal = bootstrap.Modal.getInstance(modal);
        if (bsModal) {
          bsModal.hide();
        }
      }
    });
  }
}

/**
 * 観光客登録モーダルを修正します
 */
function fixTouristRegistrationModal() {
  console.log('観光客登録モーダルの修正を開始します');
  
  // 既存のモーダル要素を取得
  const existingModal = document.getElementById('registerTouristModal');
  if (!existingModal) {
    console.error('観光客登録モーダルが見つかりません');
    return;
  }
  
  // 既存のモーダルの属性を保持
  const modalAttrs = {
    id: existingModal.id,
    tabindex: existingModal.getAttribute('tabindex'),
    ariaLabelledby: existingModal.getAttribute('aria-labelledby'),
    ariaHidden: existingModal.getAttribute('aria-hidden')
  };

  // 新しいモーダルHTML
  const newModalHTML = `
    <div class="modal fade" id="${modalAttrs.id}" tabindex="${modalAttrs.tabindex}" aria-labelledby="${modalAttrs.ariaLabelledby}" aria-hidden="${modalAttrs.ariaHidden}">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="registerTouristModalLabel" data-i18n="register.tourist_title">観光客アカウント登録</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="register-tourist-form">
              <!-- 基本情報セクション -->
              <div class="border-bottom mb-4 pb-2">
                <h5 class="mb-3">基本情報</h5>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="tourist-fullname" class="form-label">氏名（公開されます）</label>
                    <input type="text" class="form-control" id="tourist-fullname" required>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="tourist-username" class="form-label" data-i18n="register.username">ユーザー名（ID）</label>
                    <input type="text" class="form-control" id="tourist-username" required>
                  </div>
                </div>
                <div class="mb-3">
                  <label for="tourist-email" class="form-label" data-i18n="register.email">メールアドレス</label>
                  <input type="email" class="form-control" id="tourist-email" required>
                </div>
                
                <!-- プロフィール情報セクション -->
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="tourist-birthdate" class="form-label">生年月日</label>
                    <input type="date" class="form-control" id="tourist-birthdate">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="tourist-gender" class="form-label">性別</label>
                    <select class="form-select" id="tourist-gender">
                      <option value="" selected>選択してください</option>
                      <option value="male">男性</option>
                      <option value="female">女性</option>
                      <option value="other">その他</option>
                      <option value="no_answer">回答しない</option>
                    </select>
                  </div>
                </div>
                <div class="mb-3">
                  <label for="tourist-nationality" class="form-label">国籍</label>
                  <select class="form-select" id="tourist-nationality">
                    <option value="" selected>選択してください</option>
                    <option value="japan">日本</option>
                    <option value="us">アメリカ</option>
                    <option value="china">中国</option>
                    <option value="korea">韓国</option>
                    <option value="taiwan">台湾</option>
                    <option value="australia">オーストラリア</option>
                    <option value="uk">イギリス</option>
                    <option value="canada">カナダ</option>
                    <option value="other">その他</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="tourist-languages" class="form-label">使用言語（複数選択可）</label>
                  <div class="row">
                    <div class="col-md-4">
                      <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" value="japanese" id="lang-japanese">
                        <label class="form-check-label" for="lang-japanese">日本語</label>
                      </div>
                      <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" value="english" id="lang-english">
                        <label class="form-check-label" for="lang-english">英語</label>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" value="chinese" id="lang-chinese">
                        <label class="form-check-label" for="lang-chinese">中国語</label>
                      </div>
                      <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" value="korean" id="lang-korean">
                        <label class="form-check-label" for="lang-korean">韓国語</label>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" value="spanish" id="lang-spanish">
                        <label class="form-check-label" for="lang-spanish">スペイン語</label>
                      </div>
                      <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" value="other" id="lang-other">
                        <label class="form-check-label" for="lang-other">その他</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 身分証明書アップロード -->
              <div class="border-bottom mb-4 pb-2">
                <h5 class="mb-3" data-i18n="document.id_verification">身分証明書の確認</h5>
                <div class="card p-3">
                  <div class="mb-3">
                    <label for="tourist-country-selector" class="form-label">国籍</label>
                    <select class="form-select country-selector" id="tourist-country-selector" required>
                      <option value="" selected>国籍を選択してください</option>
                      <option value="japan">日本</option>
                      <option value="international">海外</option>
                    </select>
                  </div>
                  <div class="mb-3">
                    <label for="tourist-document-type" class="form-label" data-i18n="document.type">書類の種類</label>
                    <select class="form-select document-type" id="tourist-document-type" required>
                      <option value="" selected disabled data-i18n="document.selectType">書類の種類を選択してください</option>
                      <option value="passport" data-i18n="document.passport" class="japan-doc intl-doc">パスポート</option>
                      <option value="driverLicense" data-i18n="document.driverLicense" class="japan-doc">運転免許証</option>
                      <option value="idCard" data-i18n="document.idCard" class="japan-doc">マイナンバーカード</option>
                      <option value="residenceCard" data-i18n="document.residenceCard" class="intl-doc">在留カード</option>
                    </select>
                  </div>

                  <!-- パスポートアップロード -->
                  <div id="tourist-passport-upload" class="document-upload-section d-none">
                    <div class="card shadow-sm mb-4">
                      <div class="card-header bg-primary text-white">
                        <h6 class="mb-0"><i class="bi bi-passport me-2"></i>パスポート</h6>
                      </div>
                      <div class="card-body p-4">
                        <div class="row align-items-center">
                          <div class="col-md-4 mb-3 mb-md-0">
                            <div id="tourist-passport-preview" class="preview-container d-none">
                              <img id="tourist-passport-image" src="#" alt="パスポートプレビュー" class="img-fluid rounded shadow-sm">
                              <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 mt-1 me-1 rounded-circle p-1" onclick="removeDocumentFile('tourist-passport')">
                                <i class="bi bi-x"></i>
                              </button>
                            </div>
                            <div id="tourist-passport-prompt" class="upload-prompt">
                              <div class="d-flex flex-column align-items-center justify-content-center border rounded p-3 text-center bg-light hover-shadow">
                                <i class="bi bi-passport text-primary fs-1 mb-2"></i>
                                <span class="fw-bold" data-i18n="document.upload_passport">パスポートをアップロード</span>
                                <small class="text-muted">顔写真と情報が見えるように撮影してください</small>
                              </div>
                            </div>
                          </div>
                          <div class="col-md-8">
                            <label class="form-label mb-2">写真ページをアップロード</label>
                            <div class="input-group">
                              <input type="file" class="form-control" id="tourist-passport-input" accept="image/jpeg, image/png, image/jpg, application/pdf">
                              <button type="button" class="btn btn-primary document-camera">
                                <i class="bi bi-camera me-1"></i> 撮影
                              </button>
                            </div>
                            <small class="text-muted d-block mt-2">
                              <i class="bi bi-info-circle me-1"></i>JPG、PNG形式（最大5MB）
                            </small>
                          </div>
                        </div>
                        <div class="mt-3 bg-light p-3 rounded passport-upload-instructions">
                          <p class="mb-2"><strong>パスポートアップロードのご注意：</strong></p>
                          <ul class="small text-muted mb-0 ps-3">
                            <li>顔写真と情報がある見開きページを撮影してください</li>
                            <li>すべての情報が明確に読み取れるようにしてください</li>
                            <li>画像は鮮明で、反射や影がないようにしてください</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 運転免許証アップロード -->
                  <div id="tourist-driverLicense-upload" class="document-upload-section d-none">
                    <div class="card shadow-sm mb-4">
                      <div class="card-header bg-primary text-white">
                        <h6 class="mb-0"><i class="bi bi-card-heading me-2"></i>運転免許証</h6>
                      </div>
                      <div class="card-body p-4">
                        <!-- 表面 -->
                        <div class="mb-4">
                          <div class="row align-items-center">
                            <div class="col-md-4 mb-3 mb-md-0">
                              <div id="tourist-license-front-preview" class="preview-container d-none">
                                <img id="tourist-license-front-image" src="#" alt="免許証表面" class="img-fluid rounded shadow-sm">
                                <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 mt-1 me-1 rounded-circle p-1" onclick="removeDocumentFile('tourist-license-front')">
                                  <i class="bi bi-x"></i>
                                </button>
                              </div>
                              <div id="tourist-license-front-prompt" class="upload-prompt">
                                <div class="d-flex flex-column align-items-center justify-content-center border rounded p-3 text-center bg-light hover-shadow">
                                  <i class="bi bi-credit-card-front text-primary fs-1 mb-2"></i>
                                  <span class="fw-bold">運転免許証（表面）</span>
                                  <small class="text-muted">顔写真と氏名が見えるように撮影してください</small>
                                </div>
                              </div>
                            </div>
                            <div class="col-md-8">
                              <label class="form-label mb-2">表面をアップロード</label>
                              <div class="input-group">
                                <input type="file" class="form-control" id="tourist-license-front-input" accept="image/jpeg, image/png, image/jpg, application/pdf">
                                <button type="button" class="btn btn-primary document-camera">
                                  <i class="bi bi-camera me-1"></i> 撮影
                                </button>
                              </div>
                              <small class="text-muted d-block mt-2">
                                <i class="bi bi-info-circle me-1"></i>JPG、PNG形式（最大5MB）
                              </small>
                            </div>
                          </div>
                        </div>
                        
                        <!-- 裏面 -->
                        <div>
                          <div class="row align-items-center">
                            <div class="col-md-4 mb-3 mb-md-0">
                              <div id="tourist-license-back-preview" class="preview-container d-none">
                                <img id="tourist-license-back-image" src="#" alt="免許証裏面" class="img-fluid rounded shadow-sm">
                                <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 mt-1 me-1 rounded-circle p-1" onclick="removeDocumentFile('tourist-license-back')">
                                  <i class="bi bi-x"></i>
                                </button>
                              </div>
                              <div id="tourist-license-back-prompt" class="upload-prompt">
                                <div class="d-flex flex-column align-items-center justify-content-center border rounded p-3 text-center bg-light hover-shadow">
                                  <i class="bi bi-credit-card-back text-primary fs-1 mb-2"></i>
                                  <span class="fw-bold">運転免許証（裏面）</span>
                                  <small class="text-muted">有効期限が見えるように撮影してください</small>
                                </div>
                              </div>
                            </div>
                            <div class="col-md-8">
                              <label class="form-label mb-2">裏面をアップロード</label>
                              <div class="input-group">
                                <input type="file" class="form-control" id="tourist-license-back-input" accept="image/jpeg, image/png, image/jpg, application/pdf">
                                <button type="button" class="btn btn-primary document-camera">
                                  <i class="bi bi-camera me-1"></i> 撮影
                                </button>
                              </div>
                              <small class="text-muted d-block mt-2">
                                <i class="bi bi-info-circle me-1"></i>JPG、PNG形式（最大5MB）
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- マイナンバーカードアップロード -->
                  <div id="tourist-idCard-upload" class="document-upload-section d-none">
                    <div class="card shadow-sm mb-4">
                      <div class="card-header bg-primary text-white">
                        <h6 class="mb-0"><i class="bi bi-person-vcard me-2"></i>マイナンバーカード</h6>
                      </div>
                      <div class="card-body p-4">
                        <!-- 表面 -->
                        <div class="row align-items-center">
                          <div class="col-md-4 mb-3 mb-md-0">
                            <div id="tourist-idcard-front-preview" class="preview-container d-none">
                              <img id="tourist-idcard-front-image" src="#" alt="マイナンバーカード表面" class="img-fluid rounded shadow-sm">
                              <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 mt-1 me-1 rounded-circle p-1" onclick="removeDocumentFile('tourist-idcard-front')">
                                <i class="bi bi-x"></i>
                              </button>
                            </div>
                            <div id="tourist-idcard-front-prompt" class="upload-prompt">
                              <div class="d-flex flex-column align-items-center justify-content-center border rounded p-3 text-center bg-light hover-shadow">
                                <i class="bi bi-person-vcard-fill text-primary fs-1 mb-2"></i>
                                <span class="fw-bold">マイナンバーカード（表面）</span>
                                <small class="text-muted">顔写真と氏名が見えるように撮影</small>
                              </div>
                            </div>
                          </div>
                          <div class="col-md-8">
                            <label class="form-label mb-2">表面をアップロード（裏面は不要）</label>
                            <div class="input-group">
                              <input type="file" class="form-control" id="tourist-idcard-front-input" accept="image/jpeg, image/png, image/jpg, application/pdf">
                              <button type="button" class="btn btn-primary document-camera">
                                <i class="bi bi-camera me-1"></i> 撮影
                              </button>
                            </div>
                            <small class="text-muted d-block mt-2">
                              <i class="bi bi-info-circle me-1"></i>JPG、PNG形式（最大5MB）
                            </small>
                            <div class="alert alert-info mt-3 p-2">
                              <small><i class="bi bi-info-circle-fill me-1"></i>裏面（マイナンバー）は不要です。表面のみをアップロードしてください。</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 在留カードアップロード -->
                  <div id="tourist-residenceCard-upload" class="document-upload-section d-none">
                    <div class="card shadow-sm mb-4">
                      <div class="card-header bg-primary text-white">
                        <h6 class="mb-0"><i class="bi bi-card-text me-2"></i>在留カード</h6>
                      </div>
                      <div class="card-body p-4">
                        <!-- 表面 -->
                        <div class="mb-4">
                          <div class="row align-items-center">
                            <div class="col-md-4 mb-3 mb-md-0">
                              <div id="tourist-residence-front-preview" class="preview-container d-none">
                                <img id="tourist-residence-front-image" src="#" alt="在留カード表面" class="img-fluid rounded shadow-sm">
                                <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 mt-1 me-1 rounded-circle p-1" onclick="removeDocumentFile('tourist-residence-front')">
                                  <i class="bi bi-x"></i>
                                </button>
                              </div>
                              <div id="tourist-residence-front-prompt" class="upload-prompt">
                                <div class="d-flex flex-column align-items-center justify-content-center border rounded p-3 text-center bg-light hover-shadow">
                                  <i class="bi bi-card-list text-primary fs-1 mb-2"></i>
                                  <span class="fw-bold">在留カード（表面）</span>
                                  <small class="text-muted">顔写真と在留資格が見えるように撮影</small>
                                </div>
                              </div>
                            </div>
                            <div class="col-md-8">
                              <label class="form-label mb-2">表面をアップロード</label>
                              <div class="input-group">
                                <input type="file" class="form-control" id="tourist-residence-front-input" accept="image/jpeg, image/png, image/jpg, application/pdf">
                                <button type="button" class="btn btn-primary document-camera">
                                  <i class="bi bi-camera me-1"></i> 撮影
                                </button>
                              </div>
                              <small class="text-muted d-block mt-2">
                                <i class="bi bi-info-circle me-1"></i>JPG、PNG形式（最大5MB）
                              </small>
                            </div>
                          </div>
                        </div>
                        
                        <!-- 裏面 -->
                        <div>
                          <div class="row align-items-center">
                            <div class="col-md-4 mb-3 mb-md-0">
                              <div id="tourist-residence-back-preview" class="preview-container d-none">
                                <img id="tourist-residence-back-image" src="#" alt="在留カード裏面" class="img-fluid rounded shadow-sm">
                                <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 mt-1 me-1 rounded-circle p-1" onclick="removeDocumentFile('tourist-residence-back')">
                                  <i class="bi bi-x"></i>
                                </button>
                              </div>
                              <div id="tourist-residence-back-prompt" class="upload-prompt">
                                <div class="d-flex flex-column align-items-center justify-content-center border rounded p-3 text-center bg-light hover-shadow">
                                  <i class="bi bi-card-checklist text-primary fs-1 mb-2"></i>
                                  <span class="fw-bold">在留カード（裏面）</span>
                                  <small class="text-muted">記載事項が読み取れるように撮影</small>
                                </div>
                              </div>
                            </div>
                            <div class="col-md-8">
                              <label class="form-label mb-2">裏面をアップロード</label>
                              <div class="input-group">
                                <input type="file" class="form-control" id="tourist-residence-back-input" accept="image/jpeg, image/png, image/jpg, application/pdf">
                                <button type="button" class="btn btn-primary document-camera">
                                  <i class="bi bi-camera me-1"></i> 撮影
                                </button>
                              </div>
                              <small class="text-muted d-block mt-2">
                                <i class="bi bi-info-circle me-1"></i>JPG、PNG形式（最大5MB）
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 電話番号認証セクション -->
              <div class="border-bottom mb-4 pb-2">
                <h5 class="mb-3">電話番号認証</h5>
                <div class="text-center mb-3">
                  <div class="phone-verification-icon">
                    <i class="fas fa-mobile-alt"></i>
                  </div>
                  <p class="phone-verification-subtitle" data-i18n="phone.explanation">電話番号認証を完了してください。これはセキュリティを高め、不正利用を防止するために必要です。</p>
                </div>
                
                <div class="mb-4">
                  <label for="tourist-phone-number" class="form-label" data-i18n="phone.numberLabel">電話番号</label>
                  <div class="input-group mb-3">
                    <span class="input-group-text">+81</span>
                    <input type="tel" class="form-control" id="tourist-phone-number" placeholder="90-1234-5678">
                    <button class="btn btn-primary" type="button" id="tourist-send-code-btn" data-i18n="phone.sendCode">認証コード送信</button>
                  </div>
                  <div class="form-text" data-i18n="phone.numberHelper">ハイフンなしの電話番号を入力してください</div>
                </div>
                
                <!-- reCAPTCHAが表示されるエリア -->
                <div id="tourist-recaptcha-container" class="mb-3"></div>
                
                <div class="mb-4">
                  <label for="tourist-verification-code" class="form-label" data-i18n="phone.codeLabel">認証コード</label>
                  <input type="text" class="form-control" id="tourist-verification-code" placeholder="• • • • • •">
                  <div class="verification-info" data-i18n="phone.codeHelper">SMSで送信された6桁のコードを入力してください</div>
                </div>
                
                <div id="tourist-phone-verified" class="alert alert-success d-none">
                  <i class="bi bi-check-circle-fill me-2"></i>
                  <span data-i18n="phone.verified">電話番号が確認されました</span>
                </div>
              </div>
              
              <!-- パスワード設定セクション (最下部に配置) -->
              <div class="border-bottom mb-4 pb-2">
                <h5 class="mb-3">パスワード設定</h5>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="tourist-password" class="form-label" data-i18n="register.password">パスワード</label>
                    <div class="input-group">
                      <input type="password" class="form-control" id="tourist-password" required>
                      <button class="btn btn-outline-secondary toggle-password" type="button" data-target="tourist-password">
                        <i class="bi bi-eye"></i>
                      </button>
                    </div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="tourist-confirm-password" class="form-label" data-i18n="register.confirm_password">パスワード（確認）</label>
                    <div class="input-group">
                      <input type="password" class="form-control" id="tourist-confirm-password" required>
                      <button class="btn btn-outline-secondary toggle-password" type="button" data-target="tourist-confirm-password">
                        <i class="bi bi-eye"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 利用規約と送信ボタン -->
              <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="tourist-terms" required>
                <label class="form-check-label" for="tourist-terms">
                  <span data-i18n="register.terms">利用規約</span>と<span data-i18n="register.privacy">プライバシーポリシー</span>に同意します
                </label>
              </div>
              
              <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary" data-i18n="register.submit">登録する</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;

  // 既存のモーダルの親要素を取得
  const parentElement = existingModal.parentElement;
  
  // 既存のモーダルを削除
  existingModal.remove();
  
  // 新しいモーダルを追加
  parentElement.insertAdjacentHTML('beforeend', newModalHTML);
  
  console.log('観光客登録モーダルの修正が完了しました');
  
  // 国際化適用
  if (typeof applyTranslations === 'function') {
    applyTranslations();
  }
  
  // パスワード表示切替ボタンのイベント設定
  setupPasswordToggle();
}

/**
 * パスワード表示切替ボタンのイベント設定
 */
function setupPasswordToggle() {
  const toggleButtons = document.querySelectorAll('.toggle-password');
  if (toggleButtons) {
    toggleButtons.forEach(button => {
      button.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const inputField = document.getElementById(targetId);
        
        if (inputField) {
          // パスワードの表示/非表示を切り替え
          if (inputField.type === 'password') {
            inputField.type = 'text';
            this.innerHTML = '<i class="bi bi-eye-slash"></i>';
          } else {
            inputField.type = 'password';
            this.innerHTML = '<i class="bi bi-eye"></i>';
          }
        }
      });
    });
  }
}