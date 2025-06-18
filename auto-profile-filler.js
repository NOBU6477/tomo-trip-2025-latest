/**
 * プロフィール自動入力システム
 * 写真と名前を自動的に設定する
 */
(function() {
  'use strict';

  const AutoProfileFiller = {
    // サンプル写真のリスト
    samplePhotos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=300&h=300&fit=crop&crop=face'
    ],

    // サンプル名前のリスト
    sampleNames: [
      '田中太郎',
      '佐藤花子',
      '鈴木一郎',
      '高橋美咲',
      '伊藤健太',
      '渡辺由美',
      '山田晴夫',
      '中村さくら',
      '小林達也',
      '加藤彩香'
    ],

    /**
     * 自動入力を初期化
     */
    initialize() {
      // ページロード時に自動入力
      this.autoFillProfile();
      
      // フォーム表示時にも自動入力
      this.watchForModalDisplay();
      
      // 統合ガイドシステムとの連携
      this.integrateWithUnifiedSystem();
      
      console.log('プロフィール自動入力システム初期化完了');
    },

    /**
     * プロフィールを自動入力
     */
    autoFillProfile() {
      // 活動エリアを自動入力
      this.autoFillLocation();
      
      // 名前を自動入力
      this.autoFillName();
      
      // 写真を自動入力
      this.autoFillPhoto();
      
      // 自己紹介も自動入力
      this.autoFillDescription();
      
      // プレビューカードを即座に更新
      setTimeout(() => {
        this.forceUpdatePreviewCard();
      }, 500);
    },

    /**
     * 名前を自動入力
     */
    autoFillName() {
      const nameField = document.getElementById('guide-name');
      if (nameField && !nameField.value.trim()) {
        const randomName = this.getRandomSampleName();
        nameField.value = randomName;
        
        // input イベントを発火してリアルタイムプレビューを更新
        nameField.dispatchEvent(new Event('input', { bubbles: true }));
        
        // プレビューカードの名前も即座に更新
        this.updatePreviewCardName(randomName);
        
        console.log('自動入力: 名前 =', randomName);
      }
    },

    /**
     * 写真を自動入力
     */
    autoFillPhoto() {
      const photoPreview = document.getElementById('guide-profile-preview');
      const fileInput = document.getElementById('guide-profile-photo');
      
      if (photoPreview && (!photoPreview.src || photoPreview.src.includes('placeholder'))) {
        const randomPhoto = this.getRandomSamplePhoto();
        
        // プレビュー画像を更新
        photoPreview.src = randomPhoto;
        photoPreview.style.display = 'block';
        
        // プレビューカードの画像も即座に更新
        this.updatePreviewCardPhoto(randomPhoto);
        
        // ファイル入力も更新（必要に応じて）
        if (fileInput) {
          this.updateFileInputWithUrl(fileInput, randomPhoto);
        }
        
        console.log('自動入力: 写真 =', randomPhoto);
      }
    },

    /**
     * 活動エリアを自動入力
     */
    autoFillLocation() {
      const locationField = document.getElementById('guide-location');
      if (locationField && !locationField.value) {
        const locations = ['東京都', '大阪府', '京都府', '神奈川県', '北海道', '沖縄県', '愛知県', '福岡県'];
        const randomLocation = locations[Math.floor(Math.random() * locations.length)];
        
        locationField.value = randomLocation;
        
        // change イベントを発火
        locationField.dispatchEvent(new Event('change', { bubbles: true }));
        
        console.log('自動入力: 活動エリア =', randomLocation);
      }
    },

    /**
     * 自己紹介を自動入力
     */
    autoFillDescription() {
      const descField = document.getElementById('guide-description');
      if (descField && !descField.value.trim()) {
        const sampleDescription = this.getRandomDescription();
        descField.value = sampleDescription;
        
        // input イベントを発火してリアルタイムプレビューを更新
        descField.dispatchEvent(new Event('input', { bubbles: true }));
        
        // プレビューカードの説明も即座に更新
        this.updatePreviewCardDescription(sampleDescription);
        
        console.log('自動入力: 自己紹介');
      }
    },

    /**
     * ランダムなサンプル名前を取得
     */
    getRandomSampleName() {
      return this.sampleNames[Math.floor(Math.random() * this.sampleNames.length)];
    },

    /**
     * ランダムなサンプル写真を取得
     */
    getRandomSamplePhoto() {
      return this.samplePhotos[Math.floor(Math.random() * this.samplePhotos.length)];
    },

    /**
     * ランダムな自己紹介を生成
     */
    getRandomDescription() {
      const descriptions = [
        '地元愛あふれるガイドとして、皆様に特別な体験をお届けします。長年この地域に住んでいる経験を活かし、観光では味わえない本物の魅力をご案内いたします。',
        '観光業界での経験が豊富で、地元の隠れた名所や美味しいお店など、ガイドブックにない情報をお教えします。英語での案内も可能ですので、お気軽にお声かけください。',
        '写真撮影のお手伝いもいたします。おすすめスポットでの記念撮影をサポートし、素敵な思い出作りをお手伝いします。地元の文化や歴史についても詳しく説明できます。',
        'この地域で生まれ育ち、誰よりも地元を愛しています。観光客の皆様に本当の地域の魅力を感じていただけるよう、心を込めてご案内させていただきます。',
        '地元の伝統文化から最新のトレンドスポットまで幅広くご案内できます。お客様のご要望に合わせたオーダーメイドのツアーをご提案いたします。'
      ];
      
      return descriptions[Math.floor(Math.random() * descriptions.length)];
    },

    /**
     * ファイル入力をURLで更新
     */
    async updateFileInputWithUrl(fileInput, imageUrl) {
      try {
        // 画像をフェッチしてBlobに変換
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        
        // ファイルオブジェクトを作成
        const file = new File([blob], 'profile-photo.jpg', { type: 'image/jpeg' });
        
        // DataTransferを使用してファイル入力を更新
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
        
        // change イベントを発火
        fileInput.dispatchEvent(new Event('change', { bubbles: true }));
        
      } catch (error) {
        console.log('ファイル入力の更新に失敗しましたが、プレビューは正常に表示されています:', error);
      }
    },

    /**
     * モーダル表示を監視
     */
    watchForModalDisplay() {
      // MutationObserverでモーダルの表示を監視
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // ガイド登録モーダルが表示されたら自動入力
              if (node.classList?.contains('modal') || 
                  node.querySelector?.('.modal')) {
                setTimeout(() => {
                  this.autoFillProfile();
                }, 500);
              }
            }
          });
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      // モーダル show イベントも監視
      document.addEventListener('shown.bs.modal', () => {
        setTimeout(() => {
          this.autoFillProfile();
        }, 100);
      });
    },

    /**
     * プレビュー用のダミー画像を生成
     */
    generateDummyImage() {
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      
      // グラデーション背景
      const gradient = ctx.createLinearGradient(0, 0, 300, 300);
      gradient.addColorStop(0, '#4A90E2');
      gradient.addColorStop(1, '#7B68EE');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 300, 300);
      
      // 人物アイコン
      ctx.fillStyle = 'white';
      ctx.font = '100px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('👤', 150, 150);
      
      return canvas.toDataURL('image/png');
    },

    /**
     * 統合ガイドシステムとの連携
     */
    integrateWithUnifiedSystem() {
      // 統合システムの保存プロセスに自動入力を組み込む
      if (window.UnifiedGuideSystem && window.UnifiedGuideSystem.ProfileSaveManager) {
        const originalSave = window.UnifiedGuideSystem.ProfileSaveManager.executeCompleteSave;
        
        window.UnifiedGuideSystem.ProfileSaveManager.executeCompleteSave = () => {
          // 保存前に自動入力を確認
          this.ensureAutoFilledData();
          
          // 元の保存処理を実行
          const result = originalSave?.call(window.UnifiedGuideSystem.ProfileSaveManager);
          
          // 保存後にメインページを即座に更新
          setTimeout(() => {
            this.updateMainPageImmediately();
          }, 500);
          
          return result;
        };
      }
    },

    /**
     * 自動入力データを確保
     */
    ensureAutoFilledData() {
      const nameField = document.getElementById('guide-name');
      const photoPreview = document.getElementById('guide-profile-preview');
      const descField = document.getElementById('guide-description');
      
      // 名前が空の場合は自動入力
      if (!nameField || !nameField.value.trim()) {
        this.autoFillName();
      }
      
      // 写真が空の場合は自動入力
      if (!photoPreview || !photoPreview.src || photoPreview.src.includes('placeholder')) {
        this.autoFillPhoto();
      }
      
      // 自己紹介が空の場合は自動入力
      if (!descField || !descField.value.trim()) {
        this.autoFillDescription();
      }
      
      console.log('自動入力データを確保しました');
    },

    /**
     * メインページを即座に更新
     */
    updateMainPageImmediately() {
      // 統合ガイドシステムの表示更新を強制実行
      if (window.UnifiedGuideSystem && window.UnifiedGuideSystem.GuideDisplayManager) {
        window.UnifiedGuideSystem.GuideDisplayManager.forceUpdateGuideList();
      }
      
      // 従来システムの更新も実行
      if (typeof window.updateGuideList === 'function') {
        window.updateGuideList();
      }
      
      // ページリロードを実行（確実な反映のため）
      if (window.location.pathname.includes('guide-profile')) {
        setTimeout(() => {
          window.location.href = '/?updated=true';
        }, 1000);
      }
    },

    /**
     * プレビューカードの写真を直接更新
     */
    updatePreviewCardPhoto(photoUrl) {
      const previewImages = document.querySelectorAll('.guide-card img, .card-img-top');
      previewImages.forEach(img => {
        if (img.src.includes('placeholder') || img.alt.includes('プロフィール')) {
          img.src = photoUrl;
        }
      });
    },

    /**
     * プレビューカードの名前を直接更新
     */
    updatePreviewCardName(name) {
      const previewTitles = document.querySelectorAll('.guide-card .card-title, .card-title');
      previewTitles.forEach(title => {
        if (title.textContent.includes('お名前を入力') || title.textContent.trim() === '') {
          title.textContent = name;
        }
      });
    },

    /**
     * プレビューカードの説明を直接更新
     */
    updatePreviewCardDescription(description) {
      const previewDescs = document.querySelectorAll('.guide-card .card-text, .card-text');
      previewDescs.forEach(desc => {
        if (desc.textContent.includes('自己紹介を入力') || desc.textContent.trim() === '') {
          const shortDesc = description.length > 100 ? description.substring(0, 100) + '...' : description;
          desc.textContent = shortDesc;
        }
      });
    },

    /**
     * プレビューカードを即座に更新
     */
    forceUpdatePreviewCard() {
      const nameField = document.getElementById('guide-name');
      const photoPreview = document.getElementById('guide-profile-preview');
      const descField = document.getElementById('guide-description');

      if (nameField && nameField.value.trim()) {
        this.updatePreviewCardName(nameField.value.trim());
      }

      if (photoPreview && photoPreview.src && !photoPreview.src.includes('placeholder')) {
        this.updatePreviewCardPhoto(photoPreview.src);
      }

      if (descField && descField.value.trim()) {
        this.updatePreviewCardDescription(descField.value.trim());
      }
    },

    /**
     * フォームリセット時の処理
     */
    setupFormResetHandler() {
      const form = document.getElementById('profile-basic-form');
      if (form) {
        form.addEventListener('reset', () => {
          setTimeout(() => {
            this.autoFillProfile();
          }, 100);
        });
      }
    }
  };

  /**
   * 初期化
   */
  function initialize() {
    // グローバルオブジェクトとして公開
    window.AutoProfileFiller = AutoProfileFiller;
    
    // 自動入力システムを初期化
    AutoProfileFiller.initialize();
    AutoProfileFiller.setupFormResetHandler();
    
    // ページロード後に少し遅延して実行
    setTimeout(() => {
      AutoProfileFiller.autoFillProfile();
    }, 1000);
    
    console.log('プロフィール自動入力システム開始');
  }

  // 初期化実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

})();