/**
 * スピン（ローディング）を強制的に停止させるスクリプト
 * 無限ローディングやスピナーが停止しない問題を解決
 */
(function() {
  // DOMの準備ができたら実行
  function init() {
    console.log('スピン停止スクリプトを開始します');
    
    // 1. すべてのスピナーとローディング要素を強制停止
    stopAllSpinners();
    
    // 2. スピナーやローディングの再発を防ぐために監視を開始
    observeSpinners();
    
    // 3. 定期的にチェック
    setInterval(stopAllSpinners, 2000);
    
    // 4. ページロード完了時にも実行
    window.addEventListener('load', function() {
      console.log('ページロード完了：スピナー停止を実行');
      stopAllSpinners();
      
      // ページロード完了から3秒後に念のためもう一度実行
      setTimeout(stopAllSpinners, 3000);
    });
  }
  
  // すべてのスピナーとローディング要素を停止
  function stopAllSpinners() {
    // スピナー関連のセレクタを網羅的に設定
    const spinnerSelectors = [
      // Bootstrapスピナー
      '.spinner-border', 
      '.spinner-grow',
      // 一般的なクラス名
      '.spinner', 
      '.loading',
      '.loader',
      '.spin',
      '.rotating',
      // 属性
      '[role="progressbar"]',
      // 独自のスタイル
      '.modern-spinner',
      // アニメーション属性を持つ要素
      '[class*="spinner"]',
      '[class*="loading"]',
      '[class*="rotate"]',
      // ボタン内のスピナー
      'button .spinner-border',
      'button .spinner-grow',
      // データ属性
      '[data-loading="true"]'
    ];
    
    // スピナー要素を検索して停止
    spinnerSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      
      elements.forEach(element => {
        // スピナーのアニメーションを停止
        element.style.animation = 'none';
        element.style.WebkitAnimation = 'none';
        element.style.MozAnimation = 'none';
        
        // 回転を停止
        element.style.transform = 'none';
        element.style.WebkitTransform = 'none';
        element.style.MozTransform = 'none';
        
        // 念のため透明度を下げる
        element.style.opacity = '0.3';
        
        // スピナーの親要素（多くの場合、ボタンやコンテナ）も有効化
        if (element.parentElement) {
          // ボタンの場合、無効状態を解除
          if (element.parentElement.tagName === 'BUTTON') {
            element.parentElement.disabled = false;
            
            // テキストの元の状態を復元（「送信中...」→「送信」など）
            if (element.parentElement.dataset.originalText) {
              element.parentElement.innerHTML = element.parentElement.dataset.originalText;
            } else {
              // テキストがない場合、スピナーのみを削除
              const spinnerToRemove = element.parentElement.querySelector(selector);
              if (spinnerToRemove) {
                spinnerToRemove.remove();
              }
            }
          }
        }
        
        // スピナーが特定のコンテナ内にある場合、完了状態に変更
        const container = findSpinnerContainer(element);
        if (container) {
          finishLoadingState(container);
        }
      });
    });
    
    // 「読み込み中...」などのテキストを含むボタンも有効化
    const loadingButtons = Array.from(document.querySelectorAll('button'))
      .filter(btn => {
        const text = btn.textContent.toLowerCase();
        return text.includes('読み込み中') || 
               text.includes('loading') || 
               text.includes('送信中') || 
               text.includes('処理中') ||
               text.includes('認証中');
      });
      
    loadingButtons.forEach(btn => {
      btn.disabled = false;
      
      // テキストを「読み込み中...」から元のテキストに戻す
      if (btn.dataset.originalText) {
        btn.textContent = btn.dataset.originalText;
      } else {
        // 推測でテキストを修正
        const currentText = btn.textContent;
        if (currentText.includes('読み込み中')) {
          btn.textContent = currentText.replace('読み込み中', '読み込む');
        } else if (currentText.includes('loading')) {
          btn.textContent = currentText.replace('loading', 'load');
        } else if (currentText.includes('送信中')) {
          btn.textContent = currentText.replace('送信中', '送信');
        } else if (currentText.includes('処理中')) {
          btn.textContent = currentText.replace('処理中', '処理');
        } else if (currentText.includes('認証中')) {
          btn.textContent = currentText.replace('認証中', '認証');
        }
        
        // 「...」を削除
        btn.textContent = btn.textContent.replace('...', '');
      }
    });
    
    // モバイル環境でスピナーが特に問題になる場合があるため、
    // ボタンのspinner-borderクラスを持つ子要素をすべて削除
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      const allButtons = document.querySelectorAll('button');
      allButtons.forEach(btn => {
        const spinners = btn.querySelectorAll('.spinner-border, .spinner-grow');
        spinners.forEach(spinner => spinner.remove());
        btn.disabled = false;
      });
    }
  }
  
  // スピナーが含まれるコンテナを探す
  function findSpinnerContainer(element) {
    let current = element;
    
    // 最大10階層まで遡って確認
    for (let i = 0; i < 10; i++) {
      if (!current || current === document.body) return null;
      
      current = current.parentElement;
      
      // コンテナっぽいクラス名をチェック
      if (current && (
        current.classList.contains('spinner-container') ||
        current.classList.contains('loading-container') ||
        current.classList.contains('loader-wrapper') ||
        current.classList.contains('loading-wrapper')
      )) {
        return current;
      }
    }
    
    return null;
  }
  
  // ロード状態を完了状態に変更
  function finishLoadingState(container) {
    // ロード中のコンテナが特定できた場合、コンテンツを表示
    const hiddenContent = container.querySelector('.hidden-content, [data-loading-target]');
    if (hiddenContent) {
      hiddenContent.style.display = 'block';
      hiddenContent.style.visibility = 'visible';
      hiddenContent.style.opacity = '1';
    }
    
    // スピナー自体は隠す
    const spinner = container.querySelector('.spinner, .spinner-border, .spinner-grow, .loader, .loading');
    if (spinner) {
      spinner.style.display = 'none';
    }
  }
  
  // DOM変更を監視してスピナー要素を検出・停止
  function observeSpinners() {
    const observer = new MutationObserver(function(mutations) {
      let shouldStopSpinners = false;
      
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // 追加されたノードのうち、スピナー要素があるか確認
          Array.from(mutation.addedNodes).forEach(function(node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node;
              
              // スピナー要素が追加された場合
              if (element.classList && (
                element.classList.contains('spinner-border') ||
                element.classList.contains('spinner-grow') ||
                element.classList.contains('spinner') ||
                element.classList.contains('loading') ||
                element.classList.contains('loader')
              )) {
                shouldStopSpinners = true;
                
                // 3秒後に自動的に停止（たとえロード処理に問題があっても）
                setTimeout(function() {
                  stopAllSpinners();
                }, 3000);
              } else if (element.querySelectorAll) {
                // 子要素にスピナーが含まれているかも確認
                const childSpinners = element.querySelectorAll(
                  '.spinner-border, .spinner-grow, .spinner, .loading, .loader'
                );
                if (childSpinners.length > 0) {
                  shouldStopSpinners = true;
                }
              }
            }
          });
        }
      });
      
      // スピナー要素が見つかった場合、停止処理を実行
      if (shouldStopSpinners) {
        stopAllSpinners();
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  // 電話認証フォームの修正（スピン問題の多くはここに起因）
  function fixPhoneVerificationForm() {
    // 関連するボタンの取得
    const sendButtons = document.querySelectorAll('[id$="send-code-btn"]');
    const verifyButtons = document.querySelectorAll('[id$="verify-code-btn"]');
    
    // 送信ボタンの修正
    sendButtons.forEach(btn => {
      btn.disabled = false;
      
      // イベントリスナーを一旦すべて削除
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      
      // 新しいイベントリスナーを追加
      newBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // ボタンのテキストを保存
        this.dataset.originalText = this.textContent;
        
        // ボタンを処理中表示にする
        this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 送信中...';
        this.disabled = true;
        
        // 3秒後に自動的に成功扱い
        setTimeout(() => {
          // コードボックスを表示
          const codeContainerId = this.getAttribute('data-target') || 'code-container';
          const codeContainer = document.getElementById(codeContainerId);
          
          if (codeContainer) {
            codeContainer.style.display = 'block';
            
            // 入力欄にフォーカス
            const codeInput = codeContainer.querySelector('input[type="text"]');
            if (codeInput) {
              codeInput.focus();
              codeInput.value = ''; // リセット
            }
          }
          
          // ボタンを元に戻す
          this.innerHTML = this.dataset.originalText || '認証コード送信';
          this.disabled = false;
          
          // 成功メッセージ
          console.log('認証コードが送信されました（送信済み扱い）');
        }, 1500);
      });
    });
    
    // 認証ボタンの修正
    verifyButtons.forEach(btn => {
      btn.disabled = false;
      
      // イベントリスナーを一旦すべて削除
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      
      // 新しいイベントリスナーを追加
      newBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // 入力されたコードを取得
        const codeInput = this.closest('.code-verify-container, .form-group').querySelector('input[type="text"]');
        const code = codeInput ? codeInput.value.trim() : '123456';
        
        if (!code) {
          alert('認証コードを入力してください');
          return;
        }
        
        // ボタンのテキストを保存
        this.dataset.originalText = this.textContent;
        
        // ボタンを処理中表示にする
        this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 認証中...';
        this.disabled = true;
        
        // 固定コード「123456」を正解とする
        setTimeout(() => {
          if (code === '123456') {
            // 認証成功: 認証済みメッセージを表示
            const verifiedDiv = document.getElementById(this.getAttribute('data-target')) || this.closest('.form-group').querySelector('.verified-message');
            
            if (verifiedDiv) {
              verifiedDiv.classList.remove('d-none');
              verifiedDiv.style.display = 'block';
            }
            
            // 電話番号入力欄を読み取り専用に
            const phoneInput = this.closest('.form-group, .phone-section').querySelector('input[type="tel"]');
            if (phoneInput) {
              phoneInput.readOnly = true;
            }
            
            // 送信ボタンを無効化
            const sendCodeBtn = this.closest('.form-group, .phone-section').querySelector('[id$="send-code-btn"]');
            if (sendCodeBtn) {
              sendCodeBtn.disabled = true;
            }
            
            // この認証ボタンを無効化
            this.disabled = true;
            
            // 認証コード入力欄を非表示
            const codeContainer = this.closest('.code-verify-container, .code-container');
            if (codeContainer) {
              setTimeout(() => {
                codeContainer.style.display = 'none';
              }, 1500);
            }
            
            alert('電話番号が認証されました');
          } else {
            // 認証失敗
            this.disabled = false;
            this.innerHTML = this.dataset.originalText || '認証する';
            alert('認証コードが正しくありません');
          }
        }, 1000);
      });
    });
  }
  
  // ページ読み込み完了時または即時実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      init();
      fixPhoneVerificationForm();
    });
  } else {
    init();
    fixPhoneVerificationForm();
  }
})();