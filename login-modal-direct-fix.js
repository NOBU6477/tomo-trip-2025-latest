/**
 * ログインモーダルのユーザータイプ選択問題を直接DOMで修正する
 * より強力な手法で観光客オプションを強制的に表示する
 */

(function() {
  console.log('ログインモーダル直接修正スクリプトを実行します...');
  
  // 即時実行
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    checkAndFixLoginModal();
  } else {
    document.addEventListener('DOMContentLoaded', checkAndFixLoginModal);
  }
  
  // クリックイベントをキャプチャして修正を実行
  document.addEventListener('click', function(event) {
    // ログインボタンまたは関連要素がクリックされたら確認
    setTimeout(checkAndFixLoginModal, 100);
    setTimeout(checkAndFixLoginModal, 500);
    setTimeout(checkAndFixLoginModal, 1000);
  }, true);
  
  // モーダルのshow/shownイベントをキャプチャ
  document.body.addEventListener('shown.bs.modal', function(event) {
    console.log('モーダルが表示されました:', event.target.id);
    if (event.target.id === 'loginModal') {
      setTimeout(checkAndFixLoginModal, 10);
    }
  });
  
  // 定期チェック
  setInterval(checkAndFixLoginModal, 1000);
  
  // チェックと修正のメイン関数
  function checkAndFixLoginModal() {
    // ログインモーダルを探す
    const loginModal = document.getElementById('loginModal');
    if (!loginModal) return;
    
    console.log('ログインモーダルを発見、修正を適用します');
    
    try {
      // 1. ユーザータイプセレクターを探す
      const userTypeSelector = loginModal.querySelector('.user-type-selector');
      if (!userTypeSelector) {
        console.log('ユーザータイプセレクターが見つかりません');
        return;
      }
      
      console.log('ユーザータイプセレクターを発見:', userTypeSelector);
      
      // 2. モーダル内の観光客用のラジオボタンを探す
      const touristRadio = loginModal.querySelector('#login-user-tourist');
      const touristLabel = loginModal.querySelector('label[for="login-user-tourist"]');
      
      // 3. ガイド用のラジオボタンを探す
      const guideRadio = loginModal.querySelector('#login-user-guide');
      const guideLabel = loginModal.querySelector('label[for="login-user-guide"]');
      
      console.log('ラジオボタン:', {
        touristRadio: touristRadio ? '存在します' : '存在しません',
        touristLabel: touristLabel ? '存在します' : '存在しません',
        guideRadio: guideRadio ? '存在します' : '存在しません',
        guideLabel: guideLabel ? '存在します' : '存在しません'
      });
      
      // 4. ユーザータイプが見つからない場合は作成
      if (!touristRadio || !touristLabel) {
        createTouristOption(userTypeSelector);
      } else {
        // 存在する場合は表示を強制
        fixExistingTouristOption(touristRadio, touristLabel);
      }
      
      // 5. ボタングループのレイアウトを修正
      const btnGroup = userTypeSelector.querySelector('.btn-group');
      if (btnGroup) {
        console.log('ボタングループを修正します');
        btnGroup.style.display = 'flex';
        btnGroup.style.flexDirection = 'row';
        btnGroup.style.width = '100%';
        btnGroup.style.visibility = 'visible';
        btnGroup.style.opacity = '1';
        
        // すべてのラベルを修正
        const allLabels = btnGroup.querySelectorAll('label.btn');
        allLabels.forEach(label => {
          label.style.display = 'inline-flex';
          label.style.visibility = 'visible';
          label.style.opacity = '1';
          label.style.width = '50%';
          label.style.position = 'relative';
          label.style.zIndex = '2';
        });
      }
      
      // スマホ環境のみの修正を適用
      if (isMobileDevice()) {
        console.log('スマホ環境を検出しました - スマホ専用修正を適用します');
        
        // スマホでは選択状態のスタイルを強化
        if (touristRadio && touristRadio.checked) {
          console.log('観光客が選択されています - スマホ用スタイルを適用');
          if (touristLabel) {
            touristLabel.classList.add('active-mobile');
            touristLabel.style.backgroundColor = '#0d6efd';
            touristLabel.style.color = 'white';
            touristLabel.style.fontWeight = '600';
          }
        }
        
        if (guideRadio && guideRadio.checked) {
          console.log('ガイドが選択されています - スマホ用スタイルを適用');
          if (guideLabel) {
            guideLabel.classList.add('active-mobile');
            guideLabel.style.backgroundColor = '#0d6efd';
            guideLabel.style.color = 'white';
            guideLabel.style.fontWeight = '600';
          }
        }
        
        // スマホ専用のイベントリスナーを追加
        if (touristRadio && !touristRadio._hasMobileEvent) {
          touristRadio.addEventListener('change', function() {
            if (this.checked) {
              // 観光客選択時
              if (touristLabel) {
                touristLabel.classList.add('active-mobile');
                touristLabel.style.backgroundColor = '#0d6efd';
                touristLabel.style.color = 'white';
              }
              // ガイド選択解除
              if (guideLabel) {
                guideLabel.classList.remove('active-mobile');
                guideLabel.style.backgroundColor = '';
                guideLabel.style.color = '';
              }
            }
          });
          touristRadio._hasMobileEvent = true;
        }
        
        if (guideRadio && !guideRadio._hasMobileEvent) {
          guideRadio.addEventListener('change', function() {
            if (this.checked) {
              // ガイド選択時
              if (guideLabel) {
                guideLabel.classList.add('active-mobile');
                guideLabel.style.backgroundColor = '#0d6efd';
                guideLabel.style.color = 'white';
              }
              // 観光客選択解除
              if (touristLabel) {
                touristLabel.classList.remove('active-mobile');
                touristLabel.style.backgroundColor = '';
                touristLabel.style.color = '';
              }
            }
          });
          guideRadio._hasMobileEvent = true;
        }
      }
      
      // 6. 説明文の更新
      updateDescriptionText(loginModal);
      
      console.log('ログインモーダルの修正が完了しました');
    } catch (error) {
      console.error('ログインモーダル修正中にエラーが発生しました:', error);
    }
  }
  
  // スマホかどうかを判定する関数
  function isMobileDevice() {
    return (window.innerWidth <= 576) || 
           (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  }
  
  // 観光客オプションを作成
  function createTouristOption(userTypeSelector) {
    console.log('観光客オプションを新規作成します');
    try {
      const btnGroup = userTypeSelector.querySelector('.btn-group');
      if (!btnGroup) return;
      
      // ラジオボタンの作成
      const touristRadio = document.createElement('input');
      touristRadio.type = 'radio';
      touristRadio.className = 'btn-check';
      touristRadio.name = 'login-user-type';
      touristRadio.id = 'login-user-tourist';
      touristRadio.value = 'tourist';
      touristRadio.autocomplete = 'off';
      touristRadio.checked = true;
      
      // ラベルの作成
      const touristLabel = document.createElement('label');
      touristLabel.className = 'btn btn-outline-primary';
      touristLabel.setAttribute('for', 'login-user-tourist');
      touristLabel.innerHTML = '<i class="bi bi-person me-1"></i> 観光客';
      
      // btnGroupに追加（最初の子要素として）
      btnGroup.insertBefore(touristRadio, btnGroup.firstChild);
      btnGroup.insertBefore(touristLabel, btnGroup.childNodes[1]);
      
      console.log('観光客オプションが正常に作成されました');
    } catch (error) {
      console.error('観光客オプション作成中にエラーが発生しました:', error);
    }
  }
  
  // 既存の観光客オプションを修正
  function fixExistingTouristOption(radio, label) {
    console.log('既存の観光客オプションを修正します');
    
    // ラジオボタンの修正
    radio.style.cssText = `
      display: inline-block !important;
      visibility: visible !important;
      opacity: 1 !important;
      position: absolute !important;
      z-index: 10 !important;
      pointer-events: auto !important;
      user-select: auto !important;
      -webkit-user-select: auto !important;
    `;
    
    // ラベルの修正
    label.style.cssText = `
      display: inline-flex !important;
      visibility: visible !important;
      opacity: 1 !important;
      width: 50% !important;
      position: relative !important;
      z-index: 10 !important;
      pointer-events: auto !important;
      user-select: auto !important;
      -webkit-user-select: auto !important;
      background-color: white;
      border: 1px solid #0d6efd;
      color: #0d6efd;
      justify-content: center;
      align-items: center;
      padding: 0.8rem 1rem;
      font-weight: 500;
    `;
    
    console.log('観光客オプションが修正されました');
  }
  
  // 説明テキストの更新
  function updateDescriptionText(modal) {
    const descriptionEl = modal.querySelector('#user-type-description');
    const touristRadio = modal.querySelector('#login-user-tourist');
    const guideRadio = modal.querySelector('#login-user-guide');
    
    if (!descriptionEl) return;
    
    if (touristRadio && touristRadio.checked) {
      descriptionEl.textContent = '観光客としてログインすると、ガイドを探したり予約できます';
    } else if (guideRadio && guideRadio.checked) {
      descriptionEl.textContent = 'ガイドとしてログインすると、プロフィールの編集や予約の管理ができます';
    }
    
    // ラジオボタンのイベントリスナーを設定
    if (touristRadio && !touristRadio._hasListener) {
      touristRadio.addEventListener('change', function() {
        updateDescriptionText(modal);
      });
      touristRadio._hasListener = true;
    }
    
    if (guideRadio && !guideRadio._hasListener) {
      guideRadio.addEventListener('change', function() {
        updateDescriptionText(modal);
      });
      guideRadio._hasListener = true;
    }
  }
})();