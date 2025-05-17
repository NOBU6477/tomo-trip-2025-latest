/**
 * 身分証明書セクション修正スクリプト
 * 身分証明書の選択機能を追加する
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('身分証明書セクション修正スクリプトが読み込まれました');
  
  // 観光客登録モーダルでは身分証明書セクションを表示しないよう変更
  document.body.addEventListener('shown.bs.modal', function(event) {
    const modal = event.target;
    if (modal.id === 'registerGuideModal') {  // ガイド登録モーダルのみ対象に変更
      setTimeout(fixIdDocumentSection, 300);
    }
  });
  
  // ページロード時に既にモーダルが表示されていた場合
  setTimeout(function() {
    const modal = document.getElementById('registerGuideModal');  // ガイド登録モーダルのみ対象に変更
    if (modal && modal.classList.contains('show')) {
      fixIdDocumentSection();
    }
  }, 500);
  
  function fixIdDocumentSection() {
    const modal = document.getElementById('registerGuideModal');
    if (!modal) return;
    
    // 既に身分証明書セクションがあるか確認
    const existingSection = modal.querySelector('[id="id-document-section"], [id*="document-section"], .id-document-section');
    if (existingSection && existingSection.getAttribute('data-fixed') === 'true') {
      console.log('身分証明書セクションは既に修正済みです');
      return;
    }
    
    // メールアドレスセクションを見つける
    const emailSection = modal.querySelector('input[type="email"]');
    if (!emailSection) {
      console.log('メールアドレスセクションが見つかりません');
      return;
    }
    
    // メールアドレスセクションの親要素を見つける
    let parentSection = emailSection.closest('.form-group, .mb-3, .py-3, .border-bottom');
    if (!parentSection) {
      parentSection = emailSection.parentElement;
    }
    
    // 親要素の後に身分証明書セクションを挿入
    const idDocumentSection = document.createElement('div');
    idDocumentSection.id = 'id-document-section';
    idDocumentSection.className = 'py-3 border-bottom';
    idDocumentSection.setAttribute('data-fixed', 'true');
    
    idDocumentSection.innerHTML = `
      <h5 class="mb-3">身分証明書の確認</h5>
      <div class="mb-4">
        <div class="form-group mb-3">
          <label for="id-document-type" class="form-label">書類の種類</label>
          <select class="form-select" id="id-document-type" required>
            <option value="" selected disabled>書類の種類を選択してください</option>
            <option value="driver_license">運転免許証</option>
            <option value="passport">パスポート</option>
            <option value="residence_card">在留カード</option>
            <option value="my_number_card">マイナンバーカード</option>
            <option value="health_insurance_card">健康保険証</option>
            <option value="other">その他</option>
          </select>
          <div class="mt-2 small text-muted">一覧の中の項目を選択してください。</div>
        </div>
        
        <!-- 身分証明書アップロードコンテナ -->
        <div id="id-document-upload-container" class="mt-3 d-none">
          <!-- 書類タイプ別のフォームは選択時に動的に表示される -->
        </div>
        
        <div class="small text-muted mt-2">
          身分証明書は運営によって厳重に管理され、確認後に削除されます。
          個人情報は当サービスのプライバシーポリシーに基づいて保護されます。
        </div>
      </div>
    `;
    
    // 証明写真セクションの前にIDセクションを挿入
    const photoSection = modal.querySelector('.border-bottom:nth-child(2), [id*="photo"], .profile-photo-section');
    if (photoSection) {
      photoSection.parentNode.insertBefore(idDocumentSection, photoSection);
    } else {
      // 証明写真セクションが見つからない場合はメールアドレスセクションの後に挿入
      parentSection.parentNode.insertBefore(idDocumentSection, parentSection.nextSibling);
    }
    
    // 書類タイプの選択イベント
    const docTypeSelect = document.getElementById('id-document-type');
    if (docTypeSelect) {
      docTypeSelect.addEventListener('change', function() {
        showIdDocumentForm(this.value);
      });
    }
  }
  
  // 書類タイプに応じたフォームを表示
  function showIdDocumentForm(type) {
    const container = document.getElementById('id-document-upload-container');
    if (!container) return;
    
    container.classList.remove('d-none');
    
    let formHtml = '';
    
    // 書類タイプに応じたフォームを生成
    switch (type) {
      case 'driver_license':
        formHtml = `
          <div id="driver-license-form" class="document-form">
            <div class="row mb-3">
              <div class="col-md-6">
                <div class="id-document-preview mb-2 d-none">
                  <img id="driver-license-front-preview" class="img-fluid rounded" alt="免許証表面">
                  <div class="mt-1 text-center text-success">
                    <small><i class="bi bi-check-circle"></i> 表面がアップロードされました</small>
                  </div>
                </div>
                <div class="id-document-placeholder bg-light rounded p-2 text-center" style="height: 200px;">
                  <i class="bi bi-credit-card fs-3 text-secondary" style="margin-top: 50px;"></i>
                  <div><small>表面</small></div>
                </div>
                <div class="d-grid gap-2 mt-2">
                  <button type="button" class="btn btn-sm btn-outline-primary select-document-btn" data-target="driver-license-front">
                    <i class="bi bi-file-earmark-image me-2"></i> 表面をアップロード
                  </button>
                  <button type="button" class="btn btn-sm btn-outline-secondary document-camera-btn" data-target="driver-license-front">
                    <i class="bi bi-camera me-2"></i> カメラで撮影
                  </button>
                </div>
                <input type="file" id="driver-license-front-input" class="d-none document-input" accept="image/jpeg, image/png, image/jpg">
              </div>
              <div class="col-md-6">
                <div class="id-document-preview mb-2 d-none">
                  <img id="driver-license-back-preview" class="img-fluid rounded" alt="免許証裏面">
                  <div class="mt-1 text-center text-success">
                    <small><i class="bi bi-check-circle"></i> 裏面がアップロードされました</small>
                  </div>
                </div>
                <div class="id-document-placeholder bg-light rounded p-2 text-center" style="height: 200px;">
                  <i class="bi bi-credit-card fs-3 text-secondary" style="margin-top: 50px;"></i>
                  <div><small>裏面</small></div>
                </div>
                <div class="d-grid gap-2 mt-2">
                  <button type="button" class="btn btn-sm btn-outline-primary select-document-btn" data-target="driver-license-back">
                    <i class="bi bi-file-earmark-image me-2"></i> 裏面をアップロード
                  </button>
                  <button type="button" class="btn btn-sm btn-outline-secondary document-camera-btn" data-target="driver-license-back">
                    <i class="bi bi-camera me-2"></i> カメラで撮影
                  </button>
                </div>
                <input type="file" id="driver-license-back-input" class="d-none document-input" accept="image/jpeg, image/png, image/jpg">
              </div>
            </div>
          </div>
        `;
        break;
        
      case 'passport':
        formHtml = `
          <div id="passport-form" class="document-form">
            <div class="row mb-3">
              <div class="col-md-6">
                <div class="id-document-preview mb-2 d-none">
                  <img id="passport-preview" class="img-fluid rounded" alt="パスポート">
                  <div class="mt-1 text-center text-success">
                    <small><i class="bi bi-check-circle"></i> アップロードされました</small>
                  </div>
                </div>
                <div class="id-document-placeholder bg-light rounded p-2 text-center" style="height: 200px;">
                  <i class="bi bi-book fs-3 text-secondary" style="margin-top: 50px;"></i>
                  <div><small>パスポート（顔写真ページ）</small></div>
                </div>
                <div class="d-grid gap-2 mt-2">
                  <button type="button" class="btn btn-sm btn-outline-primary select-document-btn" data-target="passport">
                    <i class="bi bi-file-earmark-image me-2"></i> アップロード
                  </button>
                  <button type="button" class="btn btn-sm btn-outline-secondary document-camera-btn" data-target="passport">
                    <i class="bi bi-camera me-2"></i> カメラで撮影
                  </button>
                </div>
                <input type="file" id="passport-input" class="d-none document-input" accept="image/jpeg, image/png, image/jpg">
              </div>
            </div>
          </div>
        `;
        break;
        
      case 'residence_card':
        formHtml = `
          <div id="residence-card-form" class="document-form">
            <div class="row mb-3">
              <div class="col-md-6">
                <div class="id-document-preview mb-2 d-none">
                  <img id="residence-card-front-preview" class="img-fluid rounded" alt="在留カード表面">
                  <div class="mt-1 text-center text-success">
                    <small><i class="bi bi-check-circle"></i> 表面がアップロードされました</small>
                  </div>
                </div>
                <div class="id-document-placeholder bg-light rounded p-2 text-center" style="height: 200px;">
                  <i class="bi bi-credit-card fs-3 text-secondary" style="margin-top: 50px;"></i>
                  <div><small>表面</small></div>
                </div>
                <div class="d-grid gap-2 mt-2">
                  <button type="button" class="btn btn-sm btn-outline-primary select-document-btn" data-target="residence-card-front">
                    <i class="bi bi-file-earmark-image me-2"></i> 表面をアップロード
                  </button>
                  <button type="button" class="btn btn-sm btn-outline-secondary document-camera-btn" data-target="residence-card-front">
                    <i class="bi bi-camera me-2"></i> カメラで撮影
                  </button>
                </div>
                <input type="file" id="residence-card-front-input" class="d-none document-input" accept="image/jpeg, image/png, image/jpg">
              </div>
              <div class="col-md-6">
                <div class="id-document-preview mb-2 d-none">
                  <img id="residence-card-back-preview" class="img-fluid rounded" alt="在留カード裏面">
                  <div class="mt-1 text-center text-success">
                    <small><i class="bi bi-check-circle"></i> 裏面がアップロードされました</small>
                  </div>
                </div>
                <div class="id-document-placeholder bg-light rounded p-2 text-center" style="height: 200px;">
                  <i class="bi bi-credit-card fs-3 text-secondary" style="margin-top: 50px;"></i>
                  <div><small>裏面</small></div>
                </div>
                <div class="d-grid gap-2 mt-2">
                  <button type="button" class="btn btn-sm btn-outline-primary select-document-btn" data-target="residence-card-back">
                    <i class="bi bi-file-earmark-image me-2"></i> 裏面をアップロード
                  </button>
                  <button type="button" class="btn btn-sm btn-outline-secondary document-camera-btn" data-target="residence-card-back">
                    <i class="bi bi-camera me-2"></i> カメラで撮影
                  </button>
                </div>
                <input type="file" id="residence-card-back-input" class="d-none document-input" accept="image/jpeg, image/png, image/jpg">
              </div>
            </div>
          </div>
        `;
        break;
        
      case 'my_number_card':
        formHtml = `
          <div id="my-number-card-form" class="document-form">
            <div class="row mb-3">
              <div class="col-md-6">
                <div class="id-document-preview mb-2 d-none">
                  <img id="my-number-card-front-preview" class="img-fluid rounded" alt="マイナンバーカード表面">
                  <div class="mt-1 text-center text-success">
                    <small><i class="bi bi-check-circle"></i> 表面がアップロードされました</small>
                  </div>
                </div>
                <div class="id-document-placeholder bg-light rounded p-2 text-center" style="height: 200px;">
                  <i class="bi bi-credit-card fs-3 text-secondary" style="margin-top: 50px;"></i>
                  <div><small>表面（顔写真面）</small></div>
                </div>
                <div class="d-grid gap-2 mt-2">
                  <button type="button" class="btn btn-sm btn-outline-primary select-document-btn" data-target="my-number-card-front">
                    <i class="bi bi-file-earmark-image me-2"></i> 表面をアップロード
                  </button>
                  <button type="button" class="btn btn-sm btn-outline-secondary document-camera-btn" data-target="my-number-card-front">
                    <i class="bi bi-camera me-2"></i> カメラで撮影
                  </button>
                </div>
                <input type="file" id="my-number-card-front-input" class="d-none document-input" accept="image/jpeg, image/png, image/jpg">
              </div>
            </div>
          </div>
        `;
        break;
        
      case 'health_insurance_card':
        formHtml = `
          <div id="health-insurance-card-form" class="document-form">
            <div class="row mb-3">
              <div class="col-md-6">
                <div class="id-document-preview mb-2 d-none">
                  <img id="health-insurance-card-preview" class="img-fluid rounded" alt="健康保険証">
                  <div class="mt-1 text-center text-success">
                    <small><i class="bi bi-check-circle"></i> アップロードされました</small>
                  </div>
                </div>
                <div class="id-document-placeholder bg-light rounded p-2 text-center" style="height: 200px;">
                  <i class="bi bi-file-medical fs-3 text-secondary" style="margin-top: 50px;"></i>
                  <div><small>健康保険証</small></div>
                </div>
                <div class="d-grid gap-2 mt-2">
                  <button type="button" class="btn btn-sm btn-outline-primary select-document-btn" data-target="health-insurance-card">
                    <i class="bi bi-file-earmark-image me-2"></i> アップロード
                  </button>
                  <button type="button" class="btn btn-sm btn-outline-secondary document-camera-btn" data-target="health-insurance-card">
                    <i class="bi bi-camera me-2"></i> カメラで撮影
                  </button>
                </div>
                <input type="file" id="health-insurance-card-input" class="d-none document-input" accept="image/jpeg, image/png, image/jpg">
              </div>
            </div>
          </div>
        `;
        break;
        
      case 'other':
        formHtml = `
          <div id="other-form" class="document-form">
            <div class="row mb-3">
              <div class="col-md-6">
                <div class="id-document-preview mb-2 d-none">
                  <img id="other-preview" class="img-fluid rounded" alt="その他の身分証明書">
                  <div class="mt-1 text-center text-success">
                    <small><i class="bi bi-check-circle"></i> アップロードされました</small>
                  </div>
                </div>
                <div class="id-document-placeholder bg-light rounded p-2 text-center" style="height: 200px;">
                  <i class="bi bi-file-earmark fs-3 text-secondary" style="margin-top: 50px;"></i>
                  <div><small>身分証明書</small></div>
                </div>
                <div class="d-grid gap-2 mt-2">
                  <button type="button" class="btn btn-sm btn-outline-primary select-document-btn" data-target="other">
                    <i class="bi bi-file-earmark-image me-2"></i> アップロード
                  </button>
                  <button type="button" class="btn btn-sm btn-outline-secondary document-camera-btn" data-target="other">
                    <i class="bi bi-camera me-2"></i> カメラで撮影
                  </button>
                </div>
                <input type="file" id="other-input" class="d-none document-input" accept="image/jpeg, image/png, image/jpg">
              </div>
            </div>
          </div>
        `;
        break;
        
      default:
        container.classList.add('d-none');
        return;
    }
    
    container.innerHTML = formHtml;
    
    // ファイル選択ボタンのイベントリスナー
    const selectBtns = container.querySelectorAll('.select-document-btn');
    selectBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        document.getElementById(`${targetId}-input`).click();
      });
    });
    
    // カメラボタンのイベントリスナー
    const cameraBtns = container.querySelectorAll('.document-camera-btn');
    cameraBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        if (typeof window.openDocumentCamera === 'function') {
          window.openDocumentCamera(targetId);
        } else if (typeof window.documentCameraHandler === 'function') {
          window.documentCameraHandler(targetId);
        } else {
          console.log('カメラ機能が見つかりません');
        }
      });
    });
    
    // ファイル入力のイベントリスナー
    const fileInputs = container.querySelectorAll('.document-input');
    fileInputs.forEach(input => {
      input.addEventListener('change', function(e) {
        if (this.files && this.files[0]) {
          const file = this.files[0];
          const targetId = this.id.replace('-input', '');
          
          // ファイルのプレビュー表示
          const reader = new FileReader();
          reader.onload = function(e) {
            const preview = document.getElementById(`${targetId}-preview`);
            if (preview) preview.src = e.target.result;
            
            const previewContainer = preview.closest('.id-document-preview');
            if (previewContainer) previewContainer.classList.remove('d-none');
            
            const placeholder = preview.closest('.col-md-6').querySelector('.id-document-placeholder');
            if (placeholder) placeholder.style.display = 'none';
          };
          reader.readAsDataURL(file);
        }
      });
    });
  }
  
  // グローバルに関数を公開
  window.showIdDocumentForm = showIdDocumentForm;
});