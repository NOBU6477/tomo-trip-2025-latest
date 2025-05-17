/**
 * 観光客登録フォームの本人確認書類セクションの重複を削除するスクリプト
 * 複数のセクションが表示されないように削除または統合します
 */
document.addEventListener('DOMContentLoaded', function() {
  // 初期化実行（タイミングをずらして複数回実行）
  setTimeout(cleanupTouristDocumentSections, 100);
  
  // モーダルが表示された時にも実行
  document.addEventListener('shown.bs.modal', function(event) {
    const modal = event.target;
    if (modal.id === 'touristRegisterModal') {
      // 複数回実行して確実に処理
      setTimeout(cleanupTouristDocumentSections, 0);
      setTimeout(cleanupTouristDocumentSections, 100);
      setTimeout(cleanupTouristDocumentSections, 300);
    }
  });
});

// ウィンドウロード時にも実行（確実に実行するため）
window.addEventListener('load', function() {
  // 複数回実行して確実に処理
  cleanupTouristDocumentSections();
  setTimeout(cleanupTouristDocumentSections, 500);
  setTimeout(cleanupTouristDocumentSections, 1000);
});

/**
 * 観光客登録フォームの本人確認書類の重複を削除
 */
function cleanupTouristDocumentSections() {
  const touristModal = document.getElementById('touristRegisterModal');
  if (!touristModal) return;
  
  console.log('観光客本人確認書類重複削除を実行');
  
  // 本人確認書類ラベルを探す - 複数の方法で検出
  const idDocumentLabels = Array.from(touristModal.querySelectorAll('label')).filter(label => 
    label.textContent.includes('本人確認書類') || 
    (label.getAttribute('data-i18n') === 'auth.id_document'));
  
  // 本人確認書類セクションが見つかった場合
  if (idDocumentLabels.length > 0) {
    console.log(`本人確認書類ラベルを ${idDocumentLabels.length} 個検出`);
    
    // 最初のセクションのみを残す（統一UIが適用される先）
    const keepLabel = idDocumentLabels[0];
    const keepParent = keepLabel.closest('.mb-3');
    
    // 2番目以降のすべてのセクションを削除
    for (let i = 1; i < idDocumentLabels.length; i++) {
      const parent = idDocumentLabels[i].closest('.mb-3');
      if (parent && parent.parentNode) {
        console.log(`観光客の重複する本人確認書類セクション(${i+1}個目)を削除`);
        parent.parentNode.removeChild(parent);
      }
    }
    
    // 既存のアップロードボタンを非表示に
    const uploadBtn = touristModal.querySelector('#tourist-upload-id');
    if (uploadBtn) {
      uploadBtn.style.display = 'none';
      console.log('既存のアップロードボタンを非表示に設定');
    }
  } else {
    console.log('本人確認書類ラベルが見つかりませんでした');
  }
  
  // 本人確認書類セクションの処理 - エラー対策のため、もっと安全なアプローチを使う
  try {
    // セクション内の要素を非表示にするだけ（削除ではなく）
    const docSections = touristModal.querySelectorAll('.mb-3');
    docSections.forEach(section => {
      try {
        // テキスト内容をチェック
        if (section.textContent && section.textContent.includes('本人確認書類')) {
          console.log('本人確認書類を含むセクションを非表示に設定');
          section.style.display = 'none';
        }
      } catch (err) {
        console.error('セクション処理中のエラー:', err);
      }
    });
  
    // アップロードボタンも非表示に
    const uploadBtn = touristModal.querySelector('#tourist-upload-id');
    if (uploadBtn) {
      console.log('本人確認書類アップロードボタンを非表示に設定');
      uploadBtn.style.display = 'none';

      // 親要素も確認
      const btnParent = uploadBtn.closest('.mb-3');
      if (btnParent) {
        btnParent.style.display = 'none';
      }
    }
  } catch (err) {
    console.error('書類セクション処理中のエラー:', err);
  }
}

/**
 * 指定されたクラスを持つ親要素を検索
 * @param {Element} element 起点となる要素
 * @param {string} className 検索するクラス名
 * @return {Element|null} 見つかった親要素、または null
 */
function findParentElementWithClass(element, className) {
  let current = element;
  while (current && current !== document.body) {
    if (current.classList && current.classList.contains(className)) {
      return current;
    }
    current = current.parentElement;
  }
  return null;
}