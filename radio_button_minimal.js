/**
 * 既存のUIを維持しながらラジオボタンだけを追加する最小限のスクリプト
 */
(function() {
  'use strict';
  
  // モバイルデバイスではスキップ
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    console.log('モバイル環境ではラジオボタン追加をスキップ');
    return;
  }
  
  console.log('ラジオボタン追加処理を初期化');
  
  // DOMの準備ができたら実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRadioButtons);
  } else {
    initRadioButtons();
  }
  
  // ラジオボタン追加の初期化
  function initRadioButtons() {
    // モーダルが表示されたとき
    document.addEventListener('shown.bs.modal', function(event) {
      setTimeout(function() {
        addMinimalRadioButtons(event.target);
      }, 300);
    });
    
    // ボタンクリック時（バックアップ）
    document.addEventListener('click', function(event) {
      if (event.target && 
          (event.target.classList.contains('guide-register-btn') || 
           event.target.classList.contains('tourist-register-btn') ||
           (event.target.closest && (
             event.target.closest('.guide-register-btn') || 
             event.target.closest('.tourist-register-btn')
           ))
          )) {
        setTimeout(function() {
          document.querySelectorAll('.modal.show').forEach(function(modal) {
            addMinimalRadioButtons(modal);
          });
        }, 500);
      }
    });
    
    // 定期的にモーダルをチェック（より確実に）
    setInterval(function() {
      document.querySelectorAll('.modal.show').forEach(function(modal) {
        addMinimalRadioButtons(modal);
      });
    }, 2000);
  }
  
  // ラジオボタンを追加する関数（UIを壊さない）
  function addMinimalRadioButtons(modal) {
    if (!modal) return;
    
    try {
      // 証明写真タイプのテキスト要素を検索
      const photoTitle = Array.from(modal.querySelectorAll('h5, div, p')).find(
        el => el.textContent && (
          el.textContent.trim() === 'photo title' || 
          el.textContent.trim() === '証明写真タイプ'
        )
      );
      
      // photoTitleが見つからない場合は、モーダル内のすべてのテキストを検索
      if (!photoTitle) {
        const allText = modal.textContent || '';
        if (!allText.includes('証明写真') && !allText.includes('photo title')) {
          return;
        }
      }
      
      // モーダル内で証明写真に関する要素を探す
      const photoElements = Array.from(modal.querySelectorAll('*')).filter(
        el => el.textContent && (
          el.textContent.trim() === '証明写真（1枚）' || 
          el.textContent.trim() === '証明写真 （1枚）' ||
          el.textContent.trim() === '表裏写真（運転免許証等）' || 
          el.textContent.trim() === '表裏写真 （運転免許証等）'
        )
      );
      
      if (photoElements.length > 0) {
        // 証明写真（1枚）の要素を探す
        const singlePhotoEl = photoElements.find(
          el => el.textContent && (
            el.textContent.trim() === '証明写真（1枚）' || 
            el.textContent.trim() === '証明写真 （1枚）'
          )
        );
        
        // 表裏写真（運転免許証等）の要素を探す
        const dualPhotoEl = photoElements.find(
          el => el.textContent && (
            el.textContent.trim() === '表裏写真（運転免許証等）' || 
            el.textContent.trim() === '表裏写真 （運転免許証等）'
          )
        );
        
        // 既にラジオボタンがあるか確認
        const parentContainer = singlePhotoEl ? singlePhotoEl.parentElement : null;
        if (parentContainer && parentContainer.querySelector('input[type="radio"]')) {
          // 既にラジオボタンがある場合は処理をスキップ
          return;
        }
        
        // ラジオボタンを作成して追加
        if (singlePhotoEl) {
          addRadioButtonBefore(singlePhotoEl, true);
        }
        
        if (dualPhotoEl) {
          addRadioButtonBefore(dualPhotoEl, false);
          
          // 運転免許証選択時にチェックを切り替えるための処理を追加
          const dualRadio = dualPhotoEl.previousSibling;
          if (dualRadio && dualRadio.type === 'radio') {
            dualRadio.id = 'photo-type-dual';
            
            // セレクトボックスの変更を監視
            const selects = modal.querySelectorAll('select');
            selects.forEach(function(select) {
              select.addEventListener('change', function() {
                if (isDriverLicense(this)) {
                  dualRadio.checked = true;
                  
                  // 表裏写真モードの表示切替
                  togglePhotoSections(modal);
                }
              });
              
              // 初期値をチェック
              if (isDriverLicense(select)) {
                dualRadio.checked = true;
                togglePhotoSections(modal);
              }
            });
          }
        }
        
        // ラジオボタンの変更イベントを設定
        const radioButtons = modal.querySelectorAll('input[type="radio"][name="photoType"]');
        radioButtons.forEach(function(radio) {
          radio.addEventListener('change', function() {
            togglePhotoSections(modal);
          });
        });
        
        console.log('ラジオボタンを追加しました');
      }
    } catch (err) {
      console.error('ラジオボタン追加中にエラーが発生しました:', err);
    }
  }
  
  // 要素の前にラジオボタンを追加
  function addRadioButtonBefore(element, checked) {
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'photoType';
    radio.checked = checked;
    radio.className = 'me-2';
    radio.style.marginRight = '8px';
    radio.style.width = '18px';
    radio.style.height = '18px';
    radio.style.verticalAlign = 'middle';
    radio.style.cursor = 'pointer';
    
    // テキスト要素の前にラジオボタンを挿入
    element.parentNode.insertBefore(radio, element);
    
    // テキスト要素のスタイルも調整
    element.style.verticalAlign = 'middle';
    if (checked) {
      element.style.fontWeight = 'bold';
    }
    
    return radio;
  }
  
  // 写真セクションの切り替え
  function togglePhotoSections(modal) {
    // モーダル内の表裏切り替えラジオを確認
    const dualRadio = modal.querySelector('input[type="radio"][name="photoType"][id="photo-type-dual"]');
    const dualChecked = dualRadio && dualRadio.checked;
    
    // 標準の表裏写真セクションを確認
    const singleSection = modal.querySelector('#id-photo-single-section');
    const dualSection = modal.querySelector('#id-photo-dual-section');
    
    if (singleSection && dualSection) {
      if (dualChecked) {
        singleSection.classList.add('d-none');
        dualSection.classList.remove('d-none');
      } else {
        singleSection.classList.remove('d-none');
        dualSection.classList.add('d-none');
      }
    }
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