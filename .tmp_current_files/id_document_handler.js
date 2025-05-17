// 身分証明書アップロード処理の拡張
document.addEventListener('DOMContentLoaded', function() {
  console.log('身分証明書ハンドラーを初期化します');
  
  // アップロードステータスの状態管理
  let isUploading = false;
  
  // モーダルのIDドキュメントフォームの処理
  function setupIdDocumentFormHandlers() {
    console.log('身分証明書フォームハンドラーを設定中...');
    
    // 証明書タイプのセレクトボックス
    const documentTypeSelect = document.getElementById('document-type');
    if (!documentTypeSelect) {
      console.warn('document-typeが見つかりません');
      return;
    }

    // 各書類タイプのコンテナ
    const passportUploadContainer = document.getElementById('passport-upload');
    const licenseUploadContainer = document.getElementById('license-upload');
    const idcardUploadContainer = document.getElementById('idcard-upload');
    const govIdUploadContainer = document.getElementById('gov-id-upload');
    const nationalIdUploadContainer = document.getElementById('national-id-upload');
    const residentCardUploadContainer = document.getElementById('resident-card-upload');

    if (!passportUploadContainer || !licenseUploadContainer || !idcardUploadContainer) {
      console.warn('ドキュメントコンテナが見つかりません', {
        passport: !!passportUploadContainer,
        license: !!licenseUploadContainer,
        idcard: !!idcardUploadContainer,
        govId: !!govIdUploadContainer,
        nationalId: !!nationalIdUploadContainer,
        residentCard: !!residentCardUploadContainer
      });
    }

    // 証明書タイプが変更されたときの処理
    documentTypeSelect.addEventListener('change', function() {
      const selectedType = this.value;
      console.log('選択された証明書タイプ:', selectedType);
      
      // すべてのコンテナを非表示にする
      if (passportUploadContainer) passportUploadContainer.classList.add('d-none');
      if (licenseUploadContainer) licenseUploadContainer.classList.add('d-none');
      if (idcardUploadContainer) idcardUploadContainer.classList.add('d-none');
      if (govIdUploadContainer) govIdUploadContainer.classList.add('d-none');
      if (nationalIdUploadContainer) nationalIdUploadContainer.classList.add('d-none');
      if (residentCardUploadContainer) residentCardUploadContainer.classList.add('d-none');
      
      // 選択されたタイプのコンテナだけを表示する
      if (selectedType === 'passport' && passportUploadContainer) {
        passportUploadContainer.classList.remove('d-none');
      } 
      else if (selectedType === 'driverLicense' && licenseUploadContainer) {
        licenseUploadContainer.classList.remove('d-none');
      }
      else if (selectedType === 'idCard' && idcardUploadContainer) {
        idcardUploadContainer.classList.remove('d-none');
      }
      else if (selectedType === 'residentCard' && residentCardUploadContainer) {
        residentCardUploadContainer.classList.remove('d-none');
      }
      else if (selectedType === 'nationalId' && nationalIdUploadContainer) {
        nationalIdUploadContainer.classList.remove('d-none');
      }
      else if (selectedType === 'govId' && govIdUploadContainer) {
        govIdUploadContainer.classList.remove('d-none');
      }
      else {
        // デフォルトはその他のドキュメントコンテナを表示
        const otherDocumentContainer = document.getElementById('other-document-container');
        if (otherDocumentContainer) {
          otherDocumentContainer.classList.remove('d-none');
        }
      }
    });

    // パスポートファイルのボタンイベント
    const selectPassportBtn = document.getElementById('select-passport');
    if (selectPassportBtn) {
      selectPassportBtn.addEventListener('click', function() {
        const fileInput = document.getElementById('passport-file');
        if (fileInput) fileInput.click();
      });
    }
    
    // 政府発行IDファイルのボタンイベント
    const selectGovIdBtn = document.getElementById('select-gov-id');
    if (selectGovIdBtn) {
      selectGovIdBtn.addEventListener('click', function() {
        const fileInput = document.getElementById('gov-id-file');
        if (fileInput) fileInput.click();
      });
    }
    
    // 各国ID表面のボタンイベント
    const selectNationalIdFrontBtn = document.getElementById('select-national-id-front');
    if (selectNationalIdFrontBtn) {
      selectNationalIdFrontBtn.addEventListener('click', function() {
        const fileInput = document.getElementById('national-id-front-file');
        if (fileInput) fileInput.click();
      });
    }
    
    // 各国ID裏面のボタンイベント
    const selectNationalIdBackBtn = document.getElementById('select-national-id-back');
    if (selectNationalIdBackBtn) {
      selectNationalIdBackBtn.addEventListener('click', function() {
        const fileInput = document.getElementById('national-id-back-file');
        if (fileInput) fileInput.click();
      });
    }
    
    // 在留カード表面のボタンイベント
    const selectResidentCardFrontBtn = document.getElementById('select-resident-card-front');
    if (selectResidentCardFrontBtn) {
      selectResidentCardFrontBtn.addEventListener('click', function() {
        const fileInput = document.getElementById('resident-card-front-file');
        if (fileInput) fileInput.click();
      });
    }
    
    // 在留カード裏面のボタンイベント
    const selectResidentCardBackBtn = document.getElementById('select-resident-card-back');
    if (selectResidentCardBackBtn) {
      selectResidentCardBackBtn.addEventListener('click', function() {
        const fileInput = document.getElementById('resident-card-back-file');
        if (fileInput) fileInput.click();
      });
    }
    
    // 書類選択ドロップダウンの共通処理のセットアップ
    document.querySelectorAll('.document-type').forEach(function(select) {
      select.addEventListener('change', function() {
        const selectedType = this.value;
        console.log('書類タイプが選択されました:', selectedType);
        
        // 最も近いモーダルまたはフォームを取得
        const container = this.closest('.modal-body') || this.closest('form');
        if (!container) {
          console.warn('書類選択の親コンテナが見つかりません');
          return;
        }
        
        // すべての書類アップロードセクションを非表示
        container.querySelectorAll('.document-upload, .document-upload-section').forEach(section => {
          section.classList.add('d-none');
        });
        
        // 選択された書類タイプのセクションを表示
        if (selectedType === 'passport') {
          const section = container.querySelector('#passport-upload');
          if (section) section.classList.remove('d-none');
        } 
        else if (selectedType === 'driverLicense') {
          const section = container.querySelector('#license-upload');
          if (section) section.classList.remove('d-none');
        }
        else if (selectedType === 'idCard') {
          const section = container.querySelector('#idcard-upload');
          if (section) section.classList.remove('d-none');
        }
        else if (selectedType === 'residenceCard') {
          // 在留カードのセクションID名は2つの形式に対応
          const section = container.querySelector('#resident-card-upload') || 
                          container.querySelector('#residencecard-upload');
          if (section) section.classList.remove('d-none');
        }
      });
    });

    // 運転免許証表面のボタンイベント
    const selectLicenseFrontBtn = document.getElementById('select-license-front');
    if (selectLicenseFrontBtn) {
      selectLicenseFrontBtn.addEventListener('click', function() {
        const fileInput = document.getElementById('license-front-file');
        if (fileInput) fileInput.click();
      });
    }

    // 運転免許証裏面のボタンイベント
    const selectLicenseBackBtn = document.getElementById('select-license-back');
    if (selectLicenseBackBtn) {
      selectLicenseBackBtn.addEventListener('click', function() {
        const fileInput = document.getElementById('license-back-file');
        if (fileInput) fileInput.click();
      });
    }

    // マイナンバーカード表面のボタンイベント
    const selectIdCardFrontBtn = document.getElementById('select-idcard-front');
    if (selectIdCardFrontBtn) {
      selectIdCardFrontBtn.addEventListener('click', function() {
        const fileInput = document.getElementById('idcard-front-file');
        if (fileInput) fileInput.click();
      });
    }

    // マイナンバーカード裏面のボタンイベント
    const selectIdCardBackBtn = document.getElementById('select-idcard-back');
    if (selectIdCardBackBtn) {
      selectIdCardBackBtn.addEventListener('click', function() {
        const fileInput = document.getElementById('idcard-back-file');
        if (fileInput) fileInput.click();
      });
    }

    // パスポートファイル変更時のプレビュー処理
    const passportFile = document.getElementById('passport-file');
    if (passportFile) {
      passportFile.addEventListener('change', function(e) {
        const file = this.files && this.files[0];
        if (file) {
          handleFilePreview(file, 'passport-preview', 'passport-image', 'passport-upload-prompt');
        }
      });
    }
    
    // 政府発行IDファイル変更時のプレビュー処理
    const govIdFile = document.getElementById('gov-id-file');
    if (govIdFile) {
      govIdFile.addEventListener('change', function(e) {
        const file = this.files && this.files[0];
        if (file) {
          handleFilePreview(file, 'gov-id-preview', 'gov-id-image', 'gov-id-upload-prompt');
        }
      });
    }
    
    // 各国ID表面ファイル変更時のプレビュー処理
    const nationalIdFrontFile = document.getElementById('national-id-front-file');
    if (nationalIdFrontFile) {
      nationalIdFrontFile.addEventListener('change', function(e) {
        const file = this.files && this.files[0];
        if (file) {
          handleFilePreview(file, 'national-id-front-preview', 'national-id-front-image', 'national-id-front-upload-prompt');
        }
      });
    }
    
    // 各国ID裏面ファイル変更時のプレビュー処理
    const nationalIdBackFile = document.getElementById('national-id-back-file');
    if (nationalIdBackFile) {
      nationalIdBackFile.addEventListener('change', function(e) {
        const file = this.files && this.files[0];
        if (file) {
          handleFilePreview(file, 'national-id-back-preview', 'national-id-back-image', 'national-id-back-upload-prompt');
        }
      });
    }
    
    // 在留カード表面ファイル変更時のプレビュー処理
    const residentCardFrontFile = document.getElementById('resident-card-front-file');
    if (residentCardFrontFile) {
      residentCardFrontFile.addEventListener('change', function(e) {
        const file = this.files && this.files[0];
        if (file) {
          handleFilePreview(file, 'resident-card-front-preview', 'resident-card-front-image', 'resident-card-front-upload-prompt');
        }
      });
    }
    
    // 在留カード裏面ファイル変更時のプレビュー処理
    const residentCardBackFile = document.getElementById('resident-card-back-file');
    if (residentCardBackFile) {
      residentCardBackFile.addEventListener('change', function(e) {
        const file = this.files && this.files[0];
        if (file) {
          handleFilePreview(file, 'resident-card-back-preview', 'resident-card-back-image', 'resident-card-back-upload-prompt');
        }
      });
    }

    // 運転免許証表面ファイル変更時のプレビュー処理
    const licenseFrontFile = document.getElementById('license-front-file');
    if (licenseFrontFile) {
      licenseFrontFile.addEventListener('change', function(e) {
        const file = this.files && this.files[0];
        if (file) {
          handleFilePreview(file, 'license-front-preview', 'license-front-image', 'license-front-upload-prompt');
        }
      });
    }

    // 運転免許証裏面ファイル変更時のプレビュー処理
    const licenseBackFile = document.getElementById('license-back-file');
    if (licenseBackFile) {
      licenseBackFile.addEventListener('change', function(e) {
        const file = this.files && this.files[0];
        if (file) {
          handleFilePreview(file, 'license-back-preview', 'license-back-image', 'license-back-upload-prompt');
        }
      });
    }

    // マイナンバーカード表面ファイル変更時のプレビュー処理
    const idCardFrontFile = document.getElementById('idcard-front-file');
    if (idCardFrontFile) {
      idCardFrontFile.addEventListener('change', function(e) {
        const file = this.files && this.files[0];
        if (file) {
          handleFilePreview(file, 'idcard-front-preview', 'idcard-front-image', 'idcard-front-upload-prompt');
        }
      });
    }

    // マイナンバーカード裏面ファイル変更時のプレビュー処理
    const idCardBackFile = document.getElementById('idcard-back-file');
    if (idCardBackFile) {
      idCardBackFile.addEventListener('change', function(e) {
        const file = this.files && this.files[0];
        if (file) {
          handleFilePreview(file, 'idcard-back-preview', 'idcard-back-image', 'idcard-back-upload-prompt');
        }
      });
    }

    // パスポートファイル削除ボタンの処理
    const removePassportBtn = document.getElementById('remove-passport');
    if (removePassportBtn) {
      removePassportBtn.addEventListener('click', function() {
        removeFile('passport-file', 'passport-preview', 'passport-upload-prompt');
      });
    }
    
    // 政府発行ID削除ボタンの処理
    const removeGovIdBtn = document.getElementById('remove-gov-id');
    if (removeGovIdBtn) {
      removeGovIdBtn.addEventListener('click', function() {
        removeFile('gov-id-file', 'gov-id-preview', 'gov-id-upload-prompt');
      });
    }
    
    // 各国ID表面削除ボタンの処理
    const removeNationalIdFrontBtn = document.getElementById('remove-national-id-front');
    if (removeNationalIdFrontBtn) {
      removeNationalIdFrontBtn.addEventListener('click', function() {
        removeFile('national-id-front-file', 'national-id-front-preview', 'national-id-front-upload-prompt');
      });
    }
    
    // 各国ID裏面削除ボタンの処理
    const removeNationalIdBackBtn = document.getElementById('remove-national-id-back');
    if (removeNationalIdBackBtn) {
      removeNationalIdBackBtn.addEventListener('click', function() {
        removeFile('national-id-back-file', 'national-id-back-preview', 'national-id-back-upload-prompt');
      });
    }
    
    // 在留カード表面削除ボタンの処理
    const removeResidentCardFrontBtn = document.getElementById('remove-resident-card-front');
    if (removeResidentCardFrontBtn) {
      removeResidentCardFrontBtn.addEventListener('click', function() {
        removeFile('resident-card-front-file', 'resident-card-front-preview', 'resident-card-front-upload-prompt');
      });
    }
    
    // 在留カード裏面削除ボタンの処理
    const removeResidentCardBackBtn = document.getElementById('remove-resident-card-back');
    if (removeResidentCardBackBtn) {
      removeResidentCardBackBtn.addEventListener('click', function() {
        removeFile('resident-card-back-file', 'resident-card-back-preview', 'resident-card-back-upload-prompt');
      });
    }

    // 運転免許証表面ファイル削除ボタンの処理
    const removeLicenseFrontBtn = document.getElementById('remove-license-front');
    if (removeLicenseFrontBtn) {
      removeLicenseFrontBtn.addEventListener('click', function() {
        removeFile('license-front-file', 'license-front-preview', 'license-front-upload-prompt');
      });
    }

    // 運転免許証裏面ファイル削除ボタンの処理
    const removeLicenseBackBtn = document.getElementById('remove-license-back');
    if (removeLicenseBackBtn) {
      removeLicenseBackBtn.addEventListener('click', function() {
        removeFile('license-back-file', 'license-back-preview', 'license-back-upload-prompt');
      });
    }

    // マイナンバーカード表面ファイル削除ボタンの処理
    const removeIdCardFrontBtn = document.getElementById('remove-idcard-front');
    if (removeIdCardFrontBtn) {
      removeIdCardFrontBtn.addEventListener('click', function() {
        removeFile('idcard-front-file', 'idcard-front-preview', 'idcard-front-upload-prompt');
      });
    }

    // マイナンバーカード裏面ファイル削除ボタンの処理
    const removeIdCardBackBtn = document.getElementById('remove-idcard-back');
    if (removeIdCardBackBtn) {
      removeIdCardBackBtn.addEventListener('click', function() {
        removeFile('idcard-back-file', 'idcard-back-preview', 'idcard-back-upload-prompt');
      });
    }
    
    // 初期状態の設定
    // 一度changeイベントを発生させて、現在の選択に合わせた表示を設定
    const event = new Event('change');
    documentTypeSelect.dispatchEvent(event);
  }

  // ファイルプレビュー処理のヘルパー関数
  function handleFilePreview(file, previewContainerId, previewImageId, uploadPromptId) {
    console.log(`プレビュー処理: ${previewContainerId}`);
    if (!file) return;
    
    // ファイルサイズチェック (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showDocumentError('ファイルサイズは5MB以下にしてください');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
      const previewContainer = document.getElementById(previewContainerId);
      const previewImage = document.getElementById(previewImageId);
      const uploadPrompt = document.getElementById(uploadPromptId);
      
      if (previewImage && previewContainer && uploadPrompt) {
        previewImage.src = e.target.result;
        previewContainer.classList.remove('d-none');
        uploadPrompt.classList.add('d-none');
      } else {
        console.warn('プレビュー要素が見つかりません', {
          container: !!previewContainer,
          image: !!previewImage,
          prompt: !!uploadPrompt
        });
      }
    };
    reader.readAsDataURL(file);
  }

  // ファイル削除処理のヘルパー関数
  function removeFile(fileInputId, previewContainerId, uploadPromptId) {
    console.log(`ファイル削除: ${fileInputId}`);
    const fileInput = document.getElementById(fileInputId);
    const previewContainer = document.getElementById(previewContainerId);
    const uploadPrompt = document.getElementById(uploadPromptId);
    
    if (fileInput) fileInput.value = '';
    if (previewContainer) previewContainer.classList.add('d-none');
    if (uploadPrompt) uploadPrompt.classList.remove('d-none');
  }

  // エラーメッセージ表示
  function showDocumentError(message) {
    const errorElement = document.getElementById('document-error');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.remove('d-none');
      // 成功メッセージが表示されている場合は非表示に
      const successElement = document.getElementById('document-success');
      if (successElement) {
        successElement.classList.add('d-none');
      }
    } else {
      console.error('document-errorが見つかりません:', message);
      alert('エラー: ' + message);
    }
  }
  
  // 成功メッセージ表示
  function showDocumentSuccess(message) {
    const successElement = document.getElementById('document-success');
    if (successElement) {
      successElement.textContent = message;
      successElement.classList.remove('d-none');
      // エラーメッセージが表示されている場合は非表示に
      const errorElement = document.getElementById('document-error');
      if (errorElement) {
        errorElement.classList.add('d-none');
      }
      
      // ユーザータイプを取得
      const userTypeField = document.getElementById('id-document-user-type');
      const userType = userTypeField ? userTypeField.value : null;
      
      // 成功メッセージを表示してから処理を続行
      setTimeout(() => {
        // ドキュメント提出完了後の処理を実行
        if (typeof window.onDocumentSubmitComplete === 'function' && userType) {
          console.log(`書類提出完了コールバックを実行します (${userType})`);
          window.onDocumentSubmitComplete(userType);
        }
      }, 1500);
    } else {
      console.warn('document-successが見つかりません:', message);
      alert('成功: ' + message);
    }
  }
  
  // 身分証明書のアップロード処理
  function uploadIdDocument(documentType, file) {
    if (isUploading) return; // 処理中は重複実行を防止
    isUploading = true;
    
    // アップロード中の表示
    const submitButton = document.getElementById('submit-document');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> アップロード中...';
    }
    
    // エラー表示を消去
    const errorElement = document.getElementById('document-error');
    if (errorElement) {
      errorElement.classList.add('d-none');
    }
    
    console.log(`身分証明書アップロードを開始: ${documentType}`);
    
    // FormDataの作成
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', documentType);
    
    // テスト環境では実際のAPIリクエストを送信しない
    // 実際の実装ではここでAPIエンドポイントにリクエストを送信
    try {
      // モック環境でのユーザージャーニー状態更新
      if (window.userPreferenceStore) {
        const journeyState = window.userPreferenceStore.getJourneyState() || {};
        journeyState.documentUploaded = true;
        journeyState.lastUpdated = new Date().toISOString();
        window.userPreferenceStore.updateJourneyState(journeyState);
        console.log('ユーザージャーニー状態を更新しました:', journeyState);
      }
      
      // 成功メッセージ表示
      showDocumentSuccess('身分証明書がアップロードされました。審査が完了するまでお待ちください。');
      
      // ボタンを元に戻す
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = '送信';
      }
      
      // 少し待ってからモーダルを閉じて状態を更新
      setTimeout(() => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('idDocumentModal'));
        if (modal) {
          modal.hide();
          console.log('身分証明書モーダルを閉じました');
        }
        
        // ウェルカムセクションを再描画
        if (window.personalizedUI) {
          window.personalizedUI.renderWelcomeSection('personalized-welcome');
          console.log('ウェルカムセクションを再描画しました');
        }
      }, 1500);
      
    } catch (error) {
      console.error('身分証明書アップロード処理中にエラーが発生しました:', error);
      showDocumentError('処理中にエラーが発生しました。もう一度お試しください。');
      
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = '送信';
      }
    } finally {
      isUploading = false;
    }
  }

  // フォーム送信イベントの処理を修正
  function updateFormSubmitHandler() {
    const form = document.getElementById('document-form');
    if (form) {
      console.log('フォーム送信ハンドラをセットアップします');
      
      // 既存のイベントリスナーを削除するためにクローン
      const newForm = form.cloneNode(true);
      if (form.parentNode) {
        form.parentNode.replaceChild(newForm, form);
      }
      
      // 新しいイベントリスナーを設定
      newForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('フォームが送信されました');
        
        const documentType = document.getElementById('document-type')?.value;
        console.log('証明書タイプ:', documentType);
        
        // 書類の種類に応じた処理
        if (!documentType) {
          showDocumentError('書類の種類を選択してください');
          return;
        }
          
        // 運転免許証の場合は表面と裏面を取得
        if (documentType === 'driverLicense') {
          const frontFileInput = document.getElementById('license-front-file');
          const backFileInput = document.getElementById('license-back-file');
          
          const frontFile = frontFileInput?.files && frontFileInput.files[0];
          const backFile = backFileInput?.files && backFileInput.files[0];
          
          if (!frontFile || !backFile) {
            showDocumentError('表面と裏面の両方のファイルを選択してください');
            return;
          }
          
          console.log('運転免許証をアップロードします（表裏）', {front: frontFile.name, back: backFile.name});
          
          // ここではAPIの実装に合わせてフロントのみをアップロード
          // 将来的には両方のファイルを送信する必要がある
          uploadIdDocument(documentType, frontFile);
        } 
        // パスポートの場合
        else if (documentType === 'passport') {
          const fileInput = document.getElementById('passport-file');
          const file = fileInput?.files && fileInput.files[0];
          
          if (!file) {
            showDocumentError('パスポートのファイルを選択してください');
            return;
          }
          
          console.log('パスポートをアップロードします', {file: file.name});
          uploadIdDocument(documentType, file);
        }
        // マイナンバーカードの場合
        else if (documentType === 'idCard') {
          const frontFileInput = document.getElementById('idcard-front-file');
          const backFileInput = document.getElementById('idcard-back-file');
          
          const frontFile = frontFileInput?.files && frontFileInput.files[0];
          const backFile = backFileInput?.files && backFileInput.files[0];
          
          if (!frontFile || !backFile) {
            showDocumentError('表面と裏面の両方のファイルを選択してください');
            return;
          }
          
          console.log('マイナンバーカードをアップロードします（表裏）', {front: frontFile.name, back: backFile.name});
          uploadIdDocument(documentType, frontFile);
        }
        // 在留カードの場合
        else if (documentType === 'residentCard') {
          const frontFileInput = document.getElementById('resident-card-front-file');
          const backFileInput = document.getElementById('resident-card-back-file');
          
          const frontFile = frontFileInput?.files && frontFileInput.files[0];
          const backFile = backFileInput?.files && backFileInput.files[0];
          
          if (!frontFile || !backFile) {
            showDocumentError('表面と裏面の両方のファイルを選択してください');
            return;
          }
          
          console.log('在留カードをアップロードします（表裏）', {front: frontFile.name, back: backFile.name});
          uploadIdDocument(documentType, frontFile);
        }
        // 各国ID（National ID）の場合
        else if (documentType === 'nationalId') {
          const frontFileInput = document.getElementById('national-id-front-file');
          const backFileInput = document.getElementById('national-id-back-file');
          
          const frontFile = frontFileInput?.files && frontFileInput.files[0];
          const backFile = backFileInput?.files && backFileInput.files[0];
          
          if (!frontFile) {
            showDocumentError('ファイルを選択してください');
            return;
          }
          
          console.log('各国IDをアップロードします', {front: frontFile.name, back: backFile?.name});
          uploadIdDocument(documentType, frontFile);
        }
        // 政府発行IDの場合
        else if (documentType === 'govId') {
          const fileInput = document.getElementById('gov-id-file');
          const file = fileInput?.files && fileInput.files[0];
          
          if (!file) {
            showDocumentError('ファイルを選択してください');
            return;
          }
          
          console.log('政府発行IDをアップロードします', {file: file.name});
          uploadIdDocument(documentType, file);
        }
        // その他の書類タイプの場合
        else {
          const fileInput = document.getElementById('document-file');
          const file = fileInput?.files && fileInput.files[0];
          
          if (!file) {
            showDocumentError('ファイルを選択してください');
            return;
          }
          
          console.log('その他の書類をアップロードします', {file: file.name});
          uploadIdDocument(documentType, file);
        }
      });
    } else {
      console.warn('document-formが見つかりません');
    }
  }

  // モーダルの表示を検出して初期化
  document.addEventListener('shown.bs.modal', function(event) {
    console.log('モーダルが表示されました:', event.target.id);
    if (event.target.id === 'idDocumentModal') {
      console.log('ID証明書モーダルが表示されました - ハンドラをセットアップします');
      setTimeout(() => {
        setupIdDocumentFormHandlers();
        updateFormSubmitHandler();
      }, 100);
    }
  });

  // ガイドプロフィールページでのボタンハンドラー
  const guideUploadIdBtn = document.getElementById('guide-upload-id');
  if (guideUploadIdBtn) {
    console.log('ガイドIDアップロードボタンを設定');
    guideUploadIdBtn.addEventListener('click', function() {
      console.log('身分証明書モーダルを開きます');
    });
  }
});

// Window load完了時にアクティブなモーダルのハンドラーを設定
window.addEventListener('load', function() {
  console.log('ウィンドウロード完了 - アクティブなモーダルを確認します');
  const activeModal = document.querySelector('.modal.show');
  if (activeModal && activeModal.id === 'idDocumentModal') {
    console.log('アクティブなID証明書モーダルを検出 - ハンドラーをセットアップします');
    const event = new Event('shown.bs.modal');
    activeModal.dispatchEvent(event);
  }
});
