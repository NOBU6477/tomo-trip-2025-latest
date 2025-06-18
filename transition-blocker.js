/**
 * 不要なページ遷移を防止するスクリプト
 * ガイドカードボタンやその他の不要な遷移をブロック
 */

(function() {
  'use strict';

  /**
   * 不要な遷移を防止
   */
  function blockUnwantedTransitions() {
    // ガイドカード関連のボタンクリックを無効化
    document.addEventListener('click', function(e) {
      const target = e.target;
      const text = target.textContent || '';
      
      // ガイドカード表示ボタンの遷移を防止
      if (text.includes('ガイドカード') || text.includes('見よう') || 
          text.includes('表示') && text.includes('カード')) {
        console.log('ガイドカード表示ボタンのクリックを無効化:', text);
        e.preventDefault();
        e.stopPropagation();
        
        // 代わりにモーダルでメッセージを表示
        showInfoModal('プロフィール編集中', 'プロフィール情報を保存した後にガイドカードをご確認いただけます。');
        return false;
      }
      
      // 特定のURLパターンへの遷移を防止
      const href = target.href || target.closest('a')?.href || '';
      if (href.includes('mode=registration') || href.includes('step=') || 
          href.includes('guide-card') || href.includes('view-card')) {
        console.log('不要な遷移をブロック:', href);
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }, true);

    // フォーム送信時の不要なリダイレクトを防止
    document.addEventListener('submit', function(e) {
      const form = e.target;
      if (form.action && (form.action.includes('step=') || form.action.includes('mode='))) {
        console.log('不要なフォーム送信をブロック:', form.action);
        e.preventDefault();
        
        // フォームデータを手動で処理
        handleFormSubmissionLocally(form);
        return false;
      }
    });
  }

  /**
   * フォーム送信をローカルで処理
   */
  function handleFormSubmissionLocally(form) {
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }
    
    console.log('フォームデータをローカル保存:', data);
    
    // セッションストレージに保存
    try {
      const existing = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
      const updated = { ...existing, ...data };
      sessionStorage.setItem('currentUser', JSON.stringify(updated));
      
      showSuccessModal('保存完了', 'プロフィール情報を保存しました。');
    } catch (error) {
      console.error('保存エラー:', error);
      showErrorModal('保存失敗', '情報の保存中にエラーが発生しました。');
    }
  }

  /**
   * 情報モーダルを表示
   */
  function showInfoModal(title, message) {
    showModal(title, message, 'info');
  }

  /**
   * 成功モーダルを表示
   */
  function showSuccessModal(title, message) {
    showModal(title, message, 'success');
  }

  /**
   * エラーモーダルを表示
   */
  function showErrorModal(title, message) {
    showModal(title, message, 'error');
  }

  /**
   * モーダル表示の共通関数
   */
  function showModal(title, message, type = 'info') {
    // 既存のモーダルを削除
    const existingModal = document.getElementById('transition-blocker-modal');
    if (existingModal) {
      existingModal.remove();
    }

    // モーダルHTML作成
    const modalHtml = `
      <div class="modal fade" id="transition-blocker-modal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${title}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="text-center">
                ${getModalIcon(type)}
                <p class="mt-3">${message}</p>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">閉じる</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // モーダルをDOMに追加
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // モーダルを表示
    const modal = document.getElementById('transition-blocker-modal');
    if (window.bootstrap && window.bootstrap.Modal) {
      const bsModal = new bootstrap.Modal(modal);
      bsModal.show();
      
      // 自動で閉じる（3秒後）
      setTimeout(() => {
        bsModal.hide();
        setTimeout(() => modal.remove(), 500);
      }, 3000);
    } else {
      // Bootstrapが利用できない場合の簡易表示
      modal.style.display = 'block';
      modal.classList.add('show');
      
      setTimeout(() => {
        modal.style.display = 'none';
        modal.remove();
      }, 3000);
    }
  }

  /**
   * モーダルのアイコンを取得
   */
  function getModalIcon(type) {
    const icons = {
      info: '<i class="bi bi-info-circle text-primary" style="font-size: 2rem;"></i>',
      success: '<i class="bi bi-check-circle text-success" style="font-size: 2rem;"></i>',
      error: '<i class="bi bi-x-circle text-danger" style="font-size: 2rem;"></i>'
    };
    return icons[type] || icons.info;
  }

  /**
   * ページ内のリンクをチェックして問題があるものを修正
   */
  function sanitizePageLinks() {
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.href;
      
      // 問題のあるリンクを無効化
      if (href.includes('mode=registration') || href.includes('step=') || 
          href.includes('guide-card') || href.includes('view-card')) {
        console.log('問題のあるリンクを無効化:', href);
        link.removeAttribute('href');
        link.style.cursor = 'default';
        link.style.textDecoration = 'none';
        
        // クリック時の処理を追加
        link.addEventListener('click', function(e) {
          e.preventDefault();
          showInfoModal('機能制限中', 'この機能は現在利用できません。プロフィール編集を完了してください。');
        });
      }
    });
  }

  /**
   * URL変更を監視して不要なナビゲーションを防止
   */
  function preventUnwantedNavigation() {
    // pushStateとreplaceStateをオーバーライド
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(state, title, url) {
      if (url && (url.includes('mode=registration') || url.includes('step='))) {
        console.log('不要なURL変更をブロック:', url);
        return;
      }
      return originalPushState.call(history, state, title, url);
    };

    history.replaceState = function(state, title, url) {
      if (url && (url.includes('mode=registration') || url.includes('step='))) {
        console.log('不要なURL変更をブロック:', url);
        return;
      }
      return originalReplaceState.call(history, state, title, url);
    };

    // popstateイベントを監視
    window.addEventListener('popstate', function(e) {
      const url = location.href;
      if (url.includes('mode=registration') || url.includes('step=')) {
        console.log('不要な戻るナビゲーションをブロック:', url);
        e.preventDefault();
        e.stopPropagation();
        history.forward();
      }
    });
  }

  /**
   * 初期化
   */
  function initialize() {
    console.log('遷移ブロッカーを初期化');
    
    blockUnwantedTransitions();
    preventUnwantedNavigation();
    
    // DOM変更を監視してリンクをサニタイズ
    const observer = new MutationObserver(function(mutations) {
      let shouldSanitize = false;
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length > 0) {
          shouldSanitize = true;
        }
      });
      
      if (shouldSanitize) {
        setTimeout(sanitizePageLinks, 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // 初期リンクサニタイズ
    sanitizePageLinks();
  }

  // DOM準備後に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

})();