/**
 * ガイド登録フォームから証明写真セクションを削除するスクリプト
 * id_document_unified.jsとの連携により、ガイドの証明写真は不要
 */
document.addEventListener('DOMContentLoaded', function() {
  // 初期化実行
  setTimeout(cleanupGuidePhotoSection, 100);
  
  // モーダルが表示された時にも実行
  document.addEventListener('shown.bs.modal', function(event) {
    const modal = event.target;
    if (modal.id === 'guideRegisterModal') {
      setTimeout(cleanupGuidePhotoSection, 100);
    }
  });
});

// ウィンドウロード時にも実行（確実に実行するため）
window.addEventListener('load', function() {
  setTimeout(cleanupGuidePhotoSection, 100);
  
  // 少し遅らせて再度実行（DOM操作のタイミングの問題に対処）
  setTimeout(cleanupGuidePhotoSection, 500);
  setTimeout(cleanupGuidePhotoSection, 1000);
});

/**
 * ガイド登録フォームから証明写真セクションを削除
 */
function cleanupGuidePhotoSection() {
  const guideModal = document.getElementById('guideRegisterModal');
  if (!guideModal) return;
  
  console.log('ガイド証明写真セクションの削除を試行');
  
  // 証明写真ラベルを探す - テキスト内容による検索
  const allLabels = guideModal.querySelectorAll('label');
  allLabels.forEach(label => {
    if (
      label.textContent.includes('証明写真') || 
      label.getAttribute('data-i18n') === 'profile.photo'
    ) {
      const parent = findParentWithClass(label, 'mb-3');
      if (parent) {
        console.log('ガイド証明写真セクションを削除: ラベル内容から検出');
        parent.remove();
      }
    }
  });
  
  // 直接セレクタで削除（バックアップ方法）
  const directPhotoSection = guideModal.querySelector('.profile-photo-upload');
  if (directPhotoSection) {
    const parent = findParentWithClass(directPhotoSection, 'mb-3');
    if (parent) {
      console.log('ガイド証明写真セクションを削除: 直接セレクタで検出');
      parent.remove();
    } else {
      // 親要素が見つからない場合は直接削除
      directPhotoSection.remove();
      console.log('証明写真アップロードを直接削除');
    }
  }
  
  // 写真選択ボタンの検索と削除
  const photoButtons = guideModal.querySelectorAll('#guide-select-photo, #guide-take-photo');
  photoButtons.forEach(button => {
    const parent = findParentWithClass(button, 'mb-3');
    if (parent) {
      console.log('写真選択ボタンコンテナを削除');
      parent.remove();
    }
  });
  
  // 証明写真セクションの処理 - DOMExceptionエラー防止のための安全なアプローチ
  try {
    // 最も安全なアプローチ: 証明写真関連の要素を探して非表示にする
    const photoRelatedElements = guideModal.querySelectorAll('*');
    photoRelatedElements.forEach(element => {
      try {
        // テキスト内容で判断
        const content = element.textContent || '';
        if (
          (content.includes('証明写真') || 
           content.includes('写真をアップロード') ||
           content.includes('カメラで撮影') ||
           content.includes('プロフィール写真')) && 
          element.tagName !== 'FORM'
        ) {
          console.log('証明写真関連要素を非表示に設定: ', element.tagName);
          element.style.display = 'none';
          
          // 親要素も確認して非表示（セクション全体を非表示にするため）
          let parent = element.closest('.mb-3');
          if (parent && !parent.classList.contains('document-verification-section')) {
            parent.style.display = 'none';
          }
        }
      } catch (err) {
        console.error('要素処理中のエラー:', err);
      }
    });
    
    // 写真関連の要素をIDで直接探して非表示にする
    const directPhotoElements = [
      guideModal.querySelector('.profile-photo-upload'),
      guideModal.querySelector('#guide-select-photo'),
      guideModal.querySelector('#guide-take-photo')
    ];
    
    directPhotoElements.forEach(element => {
      if (element) {
        console.log('写真関連要素を直接指定で非表示に設定');
        element.style.display = 'none';
        
        const parent = element.closest('.mb-3');
        if (parent) {
          parent.style.display = 'none';
        }
      }
    });
  } catch (err) {
    console.error('証明写真セクション処理中のエラー:', err);
  }
}

/**
 * 指定されたクラスを持つ親要素を検索
 * @param {Element} element 起点となる要素
 * @param {string} className 検索するクラス名
 * @return {Element|null} 見つかった親要素、または null
 */
function findParentWithClass(element, className) {
  let current = element;
  while (current) {
    if (current.classList && current.classList.contains(className)) {
      return current;
    }
    current = current.parentElement;
  }
  return null;
}