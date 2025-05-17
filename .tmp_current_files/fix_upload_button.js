// 書類アップロードボタンの修正スクリプト
document.addEventListener('DOMContentLoaded', function() {
  console.log('アップロードボタン修正スクリプト実行');
  
  // グローバル関数定義（モックバージョン）
  if (typeof window.uploadIdDocument !== 'function') {
    window.uploadIdDocument = function(documentType, file) {
      console.log(`書類アップロード実行: タイプ=${documentType}, ファイル=${file.name}`);
      alert(`アップロードをシミュレート: ${documentType}\nファイル: ${file.name}`);
      
      // 成功したと仮定してモーダルを閉じる
      const modal = document.getElementById('idDocumentModal');
      if (modal) {
        const bsModal = bootstrap.Modal.getInstance(modal);
        if (bsModal) bsModal.hide();
      }
      
      return Promise.resolve({ success: true });
    };
  }
  
  // モーダル表示時のイベントハンドラー
  function setupModalEvents() {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('shown.bs.modal', function() {
        if (this.id === 'idDocumentModal') {
          setupIdDocumentForm();
        }
      });
    });
  }
  
  // ID書類フォームの設定
  function setupIdDocumentForm() {
    console.log('ID書類フォームをセットアップします');
    
    const form = document.getElementById('id-document-form');
    if (!form) {
      console.warn('ID書類フォームが見つかりません');
      return;
    }
    
    // ドキュメントタイプの選択肢を設定
    const documentTypeSelect = form.querySelector('#document-type');
    if (documentTypeSelect) {
      console.log('ドキュメントタイプの選択肢を設定します');
      
      // 必要なオプションを定義
      const requiredOptions = [
        { value: '', text: '書類の種類を選択', i18n: 'verification.select_document' },
        { value: 'passport', text: 'パスポート', i18n: 'verification.passport' },
        { value: 'driverLicense', text: '運転免許証', i18n: 'verification.drivers_license' },
        { value: 'idCard', text: 'マイナンバーカード', i18n: 'verification.id_card' },
        { value: 'residentCard', text: '在留カード', i18n: 'verification.resident_card' },
        { value: 'nationalId', text: '各国ID（National ID）', i18n: 'verification.national_id' },
        { value: 'govId', text: '政府発行ID', i18n: 'verification.gov_id' }
      ];
      
      // 現在のオプションを取得
      const existingOptions = Array.from(documentTypeSelect.options).map(opt => opt.value);
      
      // 不足しているオプションを追加
      requiredOptions.forEach(opt => {
        if (!existingOptions.includes(opt.value)) {
          const option = document.createElement('option');
          option.value = opt.value;
          option.textContent = opt.text;
          if (opt.i18n) {
            option.setAttribute('data-i18n', opt.i18n);
          }
          documentTypeSelect.appendChild(option);
        }
      });
      
      console.log('ドキュメントタイプの選択肢を更新しました');
    }
    
    // 既存のイベントリスナーをクリア
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    // 送信ボタンを直接処理
    const submitBtn = newForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      console.log('送信ボタンを設定します:', submitBtn);
      
      submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        console.log('アップロードボタンがクリックされました');
        processFormSubmission();
      });
    } else {
      console.warn('送信ボタンが見つかりません');
      
      // フォームの送信イベントもバックアップとして設定
      newForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('フォームが送信されました');
        processFormSubmission();
      });
    }
  }
  
  // フォーム送信処理
  function processFormSubmission() {
    console.log('書類送信処理を開始します');
    
    const documentType = document.getElementById('document-type')?.value;
    console.log('選択された書類タイプ:', documentType);
    
    if (!documentType) {
      showError('書類の種類を選択してください');
      return;
    }
    
    // 同意チェック
    const consentCheckbox = document.getElementById('document-consent');
    if (consentCheckbox && !consentCheckbox.checked) {
      showError('同意にチェックを入れてください');
      return;
    }
    
    // 運転免許証の場合
    if (documentType === 'driverLicense') {
      const frontFileInput = document.getElementById('document-file-front');
      const backFileInput = document.getElementById('document-file-back');
      
      const frontFile = frontFileInput?.files?.[0];
      const backFile = backFileInput?.files?.[0];
      
      if (!frontFile || !backFile) {
        showError('表面と裏面の両方のファイルを選択してください');
        return;
      }
      
      // APIは両方のファイルをサポートしていないため、表面のみ送信
      try {
        window.uploadIdDocument(documentType, frontFile);
      } catch (err) {
        console.error('アップロード中にエラーが発生しました:', err);
        showError('アップロード中にエラーが発生しました');
      }
    } 
    // その他の書類タイプ
    else {
      const fileInput = document.getElementById('document-file');
      const file = fileInput?.files?.[0];
      
      if (!file) {
        showError('ファイルを選択してください');
        return;
      }
      
      try {
        window.uploadIdDocument(documentType, file);
      } catch (err) {
        console.error('アップロード中にエラーが発生しました:', err);
        showError('アップロード中にエラーが発生しました');
      }
    }
  }
  
  // エラー表示
  function showError(message) {
    console.error('エラー:', message);
    
    const errorElement = document.getElementById('document-error');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.remove('d-none');
    } else {
      alert('エラー: ' + message);
    }
  }
  
  // 初期化
  setupModalEvents();
  
  // 現在表示中のモーダルを処理
  const idDocumentModal = document.getElementById('idDocumentModal');
  if (idDocumentModal && idDocumentModal.classList.contains('show')) {
    console.log('表示中のID書類モーダルを検出');
    setupIdDocumentForm();
  }
  
  // 直接ボタンにイベントを追加（緊急対応）
  setTimeout(function() {
    const uploadButton = document.querySelector('#id-document-form button[type="submit"]');
    if (uploadButton) {
      console.log('アップロードボタンを緊急対応で設定します');
      
      uploadButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('アップロードボタンが緊急処理でクリックされました');
        processFormSubmission();
        return false;
      });
    }
  }, 500);
});

// 即時実行関数でページ読み込み状態に関わらず実行
(function() {
  // uploadIdDocumentグローバル関数の確認と定義
  if (typeof window.uploadIdDocument !== 'function') {
    window.uploadIdDocument = function(documentType, file) {
      console.log(`緊急書類アップロード実行: タイプ=${documentType}, ファイル=${file.name}`);
      alert(`アップロードをシミュレート: ${documentType}\nファイル: ${file.name}`);
      
      // 成功したと仮定してモーダルを閉じる
      const modal = document.getElementById('idDocumentModal');
      if (modal) {
        const bsModal = bootstrap.Modal.getInstance(modal);
        if (bsModal) bsModal.hide();
      }
      
      return Promise.resolve({ success: true });
    };
  }
  
  // 即時実行でもアップロードボタンを修正
  setTimeout(function() {
    console.log('即時実行: アップロードボタンを探索');
    
    const uploadButton = document.querySelector('#id-document-form button[type="submit"]');
    if (uploadButton) {
      console.log('即時実行: アップロードボタンを検出');
      
      // イベントハンドラーを上書き
      uploadButton.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('即時実行: アップロードボタンがクリックされました');
        
        const documentTypeSelect = document.getElementById('document-type');
        const documentType = documentTypeSelect ? documentTypeSelect.value : '';
        
        if (!documentType) {
          alert('書類の種類を選択してください');
          return false;
        }
        
        const consentCheckbox = document.getElementById('document-consent');
        if (consentCheckbox && !consentCheckbox.checked) {
          alert('同意にチェックを入れてください');
          return false;
        }
        
        let file;
        
        if (documentType === 'driverLicense') {
          const frontFileInput = document.getElementById('document-file-front');
          const backFileInput = document.getElementById('document-file-back');
          
          if (!frontFileInput?.files?.[0] || !backFileInput?.files?.[0]) {
            alert('表面と裏面の両方のファイルを選択してください');
            return false;
          }
          
          file = frontFileInput.files[0];
        } else {
          const fileInput = document.getElementById('document-file');
          if (!fileInput?.files?.[0]) {
            alert('ファイルを選択してください');
            return false;
          }
          
          file = fileInput.files[0];
        }
        
        if (file) {
          window.uploadIdDocument(documentType, file);
        }
        
        return false;
      };
    }
  }, 1000);
})();
