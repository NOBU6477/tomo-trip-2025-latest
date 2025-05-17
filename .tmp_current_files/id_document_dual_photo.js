/**
 * 運転免許証選択時に自動的に表裏写真モードに切り替えるスクリプト
 * UIを崩さずに最小限の変更で実装
 */
(function() {
  'use strict';
  
  // DOMが読み込まれた時に実行
  document.addEventListener('DOMContentLoaded', function() {
    console.log('運転免許証表裏写真監視を開始しました');
    
    // モーダル表示時の処理
    document.addEventListener('shown.bs.modal', function(event) {
      setTimeout(function() {
        setupDocumentTypeListener(event.target);
      }, 300);
    });
    
    // セレクトボックスの変更イベントをグローバルに監視
    document.addEventListener('change', function(event) {
      // セレクトボックス要素かどうか確認
      if (event.target && event.target.tagName === 'SELECT') {
        // 書類タイプのセレクトボックスを特定
        if (event.target.id.includes('document-type') || 
            event.target.name.includes('document-type') ||
            event.target.className.includes('document-type')) {
          handleDocumentTypeChange(event.target);
        }
      }
    });
  });
  
  /**
   * 書類タイプの選択リスナーを設定
   */
  function setupDocumentTypeListener(modal) {
    if (!modal) return;
    
    try {
      // モーダル内の書類タイプセレクトボックスを探す
      const documentTypeSelects = modal.querySelectorAll('select');
      
      documentTypeSelects.forEach(function(select) {
        // 既に初期化済みかチェック
        if (select.dataset.dualPhotoInitialized) return;
        
        // 初期化済みとしてマーク
        select.dataset.dualPhotoInitialized = 'true';
        
        // 既存の選択状態をチェック
        handleDocumentTypeChange(select);
        
        // 変更イベントリスナーを設定
        select.addEventListener('change', function() {
          handleDocumentTypeChange(this);
        });
      });
    } catch (err) {
      console.error('書類タイプリスナー設定エラー:', err);
    }
  }
  
  /**
   * 書類タイプの変更を処理
   */
  function handleDocumentTypeChange(select) {
    if (!select) return;
    
    try {
      const selectedValue = select.value.toLowerCase();
      const selectedText = select.options[select.selectedIndex]?.text.toLowerCase() || '';
      
      // 運転免許証が選択されたかどうかを確認
      const isDriverLicense = 
        selectedValue.includes('driver') || 
        selectedValue.includes('license') || 
        selectedText.includes('運転') || 
        selectedText.includes('免許');
      
      console.log('書類タイプ変更:', selectedText, isDriverLicense ? '(運転免許証)' : '');
      
      if (isDriverLicense) {
        // 運転免許証が選択された場合、表裏写真モードを有効化
        enableDualPhotoForDriverLicense(select);
      } else {
        // その他の書類タイプが選択された場合、通常モードに戻す
        disableDualPhotoMode(select);
      }
    } catch (err) {
      console.error('書類タイプ変更処理エラー:', err);
    }
  }
  
  /**
   * 運転免許証用に表裏写真モードを有効化
   */
  function enableDualPhotoForDriverLicense(select) {
    // モーダルを特定
    const modal = findParentModal(select);
    if (!modal) return;
    
    // 写真タイプラジオボタンを探す
    const photoRadios = modal.querySelectorAll('input[type="radio"][name="photoType"]');
    if (photoRadios.length < 2) return;
    
    // 表裏写真ラジオボタンを探して選択
    for (let i = 0; i < photoRadios.length; i++) {
      const radio = photoRadios[i];
      const label = radio.nextSibling;
      const labelText = label ? label.textContent || '' : '';
      
      if (labelText.includes('表裏') || labelText.includes('運転免許証')) {
        // 表裏写真ラジオボタンを選択
        radio.checked = true;
        
        // 変更イベントを発火
        const event = new Event('change', { bubbles: true });
        radio.dispatchEvent(event);
        
        console.log('運転免許証選択により表裏写真モードを有効化しました');
        
        // ガイダンスメッセージを表示
        showDriverLicenseGuidance(modal);
        break;
      }
    }
  }
  
  /**
   * 通常モードに戻す
   */
  function disableDualPhotoMode(select) {
    // モーダルを特定
    const modal = findParentModal(select);
    if (!modal) return;
    
    // 写真タイプラジオボタンを探す
    const photoRadios = modal.querySelectorAll('input[type="radio"][name="photoType"]');
    if (photoRadios.length < 2) return;
    
    // 証明写真（単一）ラジオボタンを探して選択
    for (let i = 0; i < photoRadios.length; i++) {
      const radio = photoRadios[i];
      const label = radio.nextSibling;
      const labelText = label ? label.textContent || '' : '';
      
      if (labelText.includes('証明写真') && labelText.includes('1枚')) {
        // 証明写真ラジオボタンを選択
        radio.checked = true;
        
        // 変更イベントを発火
        const event = new Event('change', { bubbles: true });
        radio.dispatchEvent(event);
        
        console.log('通常の証明写真モードに戻しました');
        
        // ガイダンスメッセージを非表示
        hideDriverLicenseGuidance(modal);
        break;
      }
    }
  }
  
  /**
   * 親モーダルを見つける
   */
  function findParentModal(element) {
    if (!element) return null;
    
    // モーダル要素自体かどうか確認
    if (element.classList.contains('modal')) {
      return element;
    }
    
    // 親をたどってモーダルを探す
    let parent = element.parentElement;
    while (parent) {
      if (parent.classList.contains('modal')) {
        return parent;
      }
      parent = parent.parentElement;
    }
    
    return null;
  }
  
  /**
   * 運転免許証ガイダンスメッセージを表示
   */
  function showDriverLicenseGuidance(modal) {
    // ガイダンスがすでに存在するか確認
    let guidance = modal.querySelector('.license-guidance');
    if (guidance) {
      guidance.style.display = 'block';
      return;
    }
    
    // 写真セクションを探す
    const photoSection = findPhotoSection(modal);
    if (!photoSection) return;
    
    // ガイダンスメッセージを作成
    guidance = document.createElement('div');
    guidance.className = 'license-guidance alert alert-info mt-2';
    guidance.style.fontSize = '0.9rem';
    guidance.style.padding = '0.5rem';
    guidance.innerHTML = '<strong>ご注意:</strong> 運転免許証は <u>表面と裏面の両方</u> の写真が必要です。';
    
    // 適切な位置に挿入
    const photoContainer = photoSection.querySelector('.photo-container') || photoSection;
    photoContainer.appendChild(guidance);
  }
  
  /**
   * 運転免許証ガイダンスメッセージを非表示
   */
  function hideDriverLicenseGuidance(modal) {
    const guidance = modal.querySelector('.license-guidance');
    if (guidance) {
      guidance.style.display = 'none';
    }
  }
  
  /**
   * 写真セクションを探す
   */
  function findPhotoSection(modal) {
    // 写真関連の要素を探す様々な方法を試行
    const photoContainers = [
      modal.querySelector('.photo-container'),
      modal.querySelector('.photo-preview')?.parentElement,
      modal.querySelector('div:has(img[alt="写真プレビュー"])'),
      modal.querySelector('div:has(.photo-preview)'),
      modal.querySelector('img[alt="写真プレビュー"]')?.parentElement?.parentElement
    ];
    
    // 最初に見つかった有効な要素を返す
    for (const container of photoContainers) {
      if (container) return container;
    }
    
    // 写真タイトルから探す
    const photoTitle = Array.from(modal.querySelectorAll('h5, div, label')).find(
      el => el.textContent.trim() === 'photo title' || 
           el.textContent.trim() === '証明写真タイプ'
    );
    
    return photoTitle?.parentElement;
  }
})();