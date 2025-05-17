/**
 * 運転免許証選択時に自動的に表裏写真切り替えを行うスクリプト
 * 既存のUI要素を使って自然に動作するよう設計
 */
(function() {
  // モバイルデバイスではスキップ
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    console.log('モバイル環境では実行しません');
    return;
  }
  
  console.log('表裏写真セクション切り替え機能を初期化');
  
  // DOM読み込み完了時に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initToggle);
  } else {
    initToggle();
  }
  
  // 表裏写真切り替え機能の初期化
  function initToggle() {
    // モーダル表示イベントを監視
    document.addEventListener('shown.bs.modal', function(event) {
      const modal = event.target;
      setupModal(modal);
    });
    
    // すでに表示されているモーダルをチェック
    document.querySelectorAll('.modal.show').forEach(function(modal) {
      setupModal(modal);
    });
    
    // すべてのセレクト要素の変更を監視（遅延ロード対策）
    setInterval(function() {
      const visibleModals = document.querySelectorAll('.modal.show');
      visibleModals.forEach(function(modal) {
        const selects = modal.querySelectorAll('select');
        selects.forEach(function(select) {
          if (!select.hasAttribute('data-monitored')) {
            select.setAttribute('data-monitored', 'true');
            select.addEventListener('change', function() {
              handleSelectChange(this);
            });
            
            // 初期値のチェック
            if (isDriverLicense(select)) {
              selectDualPhotoMode(modal);
            }
          }
        });
      });
    }, 1000);
  }
  
  // モーダルの設定
  function setupModal(modal) {
    if (!modal) return;
    
    // セレクト要素の変更イベントを設定
    const selects = modal.querySelectorAll('select');
    selects.forEach(function(select) {
      if (!select.hasAttribute('data-monitored')) {
        select.setAttribute('data-monitored', 'true');
        select.addEventListener('change', function() {
          handleSelectChange(this);
        });
        
        // 初期値のチェック
        if (isDriverLicense(select)) {
          selectDualPhotoMode(modal);
        }
      }
    });
    
    // 表裏写真ラジオボタンのイベントを設定
    const photoTypeInputs = modal.querySelectorAll('input[name="id-photo-type"]');
    photoTypeInputs.forEach(function(input) {
      if (!input.hasAttribute('data-handled')) {
        input.setAttribute('data-handled', 'true');
        input.addEventListener('change', function() {
          togglePhotoSections(modal);
        });
      }
    });
    
    // 初期状態で適切なセクションを表示
    togglePhotoSections(modal);
  }
  
  // セレクト変更時の処理
  function handleSelectChange(select) {
    const modal = findParentModal(select);
    if (!modal) return;
    
    if (isDriverLicense(select)) {
      selectDualPhotoMode(modal);
    }
  }
  
  // 表裏写真モードを選択
  function selectDualPhotoMode(modal) {
    const dualRadio = modal.querySelector('#id-photo-type-dual');
    if (dualRadio && !dualRadio.checked) {
      dualRadio.checked = true;
      
      // 変更イベントを発火
      try {
        const event = new Event('change', { bubbles: true });
        dualRadio.dispatchEvent(event);
      } catch (e) {
        console.error('ラジオボタンのイベント発火に失敗:', e);
        // 手動でセクション切り替え
        togglePhotoSections(modal);
      }
    }
  }
  
  // 写真セクションの切り替え
  function togglePhotoSections(modal) {
    const singleSection = modal.querySelector('#id-photo-single-section');
    const dualSection = modal.querySelector('#id-photo-dual-section');
    const dualRadio = modal.querySelector('#id-photo-type-dual');
    
    if (!singleSection || !dualSection) return;
    
    if (dualRadio && dualRadio.checked) {
      singleSection.classList.add('d-none');
      dualSection.classList.remove('d-none');
      console.log('表裏写真セクションを表示');
    } else {
      singleSection.classList.remove('d-none');
      dualSection.classList.add('d-none');
      console.log('通常写真セクションを表示');
    }
  }
  
  // 親モーダルを検索
  function findParentModal(element) {
    let parent = element.parentElement;
    while (parent) {
      if (parent.classList.contains('modal')) {
        return parent;
      }
      parent = parent.parentElement;
    }
    return null;
  }
  
  // 運転免許証かどうかを判定
  function isDriverLicense(select) {
    if (!select || !select.options || select.selectedIndex < 0) return false;
    
    const selectedOption = select.options[select.selectedIndex];
    const selectedText = selectedOption.textContent || '';
    
    return selectedText.includes('運転免許証') || 
           (selectedText.toLowerCase().includes('driver') && 
            selectedText.toLowerCase().includes('license'));
  }
})();