/**
 * テキストオーバーライドスクリプト
 * UIテキストの表示を修正するための総合的なソリューション
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM読み込み完了、HTML修正を開始');
  
  // 「証明写真タイプ」を「観光客」に置き換え
  fixTouristTextDisplay();
  
  // 各種ラベルの表示修正
  fixPhotoLabels();
  
  // ナビゲーションテキスト修正
  fixNavigationTexts();
  
  // ボタンテキスト修正
  fixButtonTexts();
  
  // 新しいUI要素が追加された際のオブザーバー設定
  setupMutationObserver();
});

/**
 * 「証明写真タイプ」を「観光客」に置き換え
 */
function fixTouristTextDisplay() {
  // カードタイトル内の「証明写真タイプ」を「観光客」に変更
  const cardTitles = document.querySelectorAll('.card-title');
  cardTitles.forEach(title => {
    if (title.textContent.includes('証明写真タイプ')) {
      title.textContent = '観光客';
    }
  });
  
  // モーダルの中の「証明写真タイプ」を「観光客」に変更
  const modalTitles = document.querySelectorAll('.modal-title');
  modalTitles.forEach(title => {
    if (title.textContent.includes('証明写真タイプ')) {
      title.textContent = '観光客登録';
    }
  });
  
  // その他の要素内の「証明写真タイプ」を「観光客」に変更
  const allElements = document.querySelectorAll('*');
  allElements.forEach(element => {
    if (element.childNodes && element.childNodes.length > 0) {
      for (let i = 0; i < element.childNodes.length; i++) {
        const node = element.childNodes[i];
        if (node.nodeType === Node.TEXT_NODE && node.textContent.includes('証明写真タイプ')) {
          node.textContent = node.textContent.replace('証明写真タイプ', '観光客');
        }
      }
    }
  });
}

/**
 * 写真関連ラベルの修正
 */
function fixPhotoLabels() {
  // 「photo front」を「表面」に変更
  const frontLabels = document.querySelectorAll('label');
  frontLabels.forEach(label => {
    if (label.textContent.includes('photo front')) {
      label.textContent = '表面';
    }
  });
  
  // 「photo back」を「裏面」に変更
  const backLabels = document.querySelectorAll('label');
  backLabels.forEach(label => {
    if (label.textContent.includes('photo back')) {
      label.textContent = '裏面';
    }
  });
  
  // 「PHOTO FRONT SELECT」を「表面を選択」に変更
  const frontButtons = document.querySelectorAll('button');
  frontButtons.forEach(button => {
    if (button.textContent.includes('PHOTO FRONT SELECT')) {
      button.textContent = '表面を選択';
    }
  });
  
  // 「PHOTO BACK SELECT」を「裏面を選択」に変更
  const backButtons = document.querySelectorAll('button');
  backButtons.forEach(button => {
    if (button.textContent.includes('PHOTO BACK SELECT')) {
      button.textContent = '裏面を選択';
    }
  });
  
  // 「photo dual requirements」を「書類の両面が必要です」に変更
  const dualLabels = document.querySelectorAll('label');
  dualLabels.forEach(label => {
    if (label.textContent.includes('photo dual requirements')) {
      label.textContent = '書類の両面が必要です';
    }
  });
}

/**
 * ナビゲーションテキストの修正
 */
function fixNavigationTexts() {
  // 必要に応じてナビゲーションテキストを修正
}

/**
 * ボタンテキストの修正
 */
function fixButtonTexts() {
  // 必要に応じてボタンテキストを修正
}

/**
 * 動的に追加された要素の監視と修正
 */
function setupMutationObserver() {
  // DOM変更を監視するオブザーバー
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes && mutation.addedNodes.length > 0) {
        // 新しく追加されたノードでテキスト修正を実行
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // 追加された要素に対して各種修正を実行
            fixTextInNode(node);
          }
        });
      }
    });
  });
  
  // 監視設定
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

/**
 * 指定されたノード内のテキストを修正
 */
function fixTextInNode(node) {
  // 証明写真タイプの修正
  const cardTitles = node.querySelectorAll ? node.querySelectorAll('.card-title') : [];
  cardTitles.forEach(title => {
    if (title.textContent.includes('証明写真タイプ')) {
      title.textContent = '観光客';
    }
  });
  
  // モーダルタイトルの修正
  const modalTitles = node.querySelectorAll ? node.querySelectorAll('.modal-title') : [];
  modalTitles.forEach(title => {
    if (title.textContent.includes('証明写真タイプ')) {
      title.textContent = '観光客登録';
    }
  });
  
  // ラベルの修正
  const labels = node.querySelectorAll ? node.querySelectorAll('label') : [];
  labels.forEach(label => {
    if (label.textContent.includes('photo front')) {
      label.textContent = '表面';
    }
    if (label.textContent.includes('photo back')) {
      label.textContent = '裏面';
    }
    if (label.textContent.includes('photo dual requirements')) {
      label.textContent = '書類の両面が必要です';
    }
  });
  
  // ボタンの修正
  const buttons = node.querySelectorAll ? node.querySelectorAll('button') : [];
  buttons.forEach(button => {
    if (button.textContent.includes('PHOTO FRONT SELECT')) {
      button.textContent = '表面を選択';
    }
    if (button.textContent.includes('PHOTO BACK SELECT')) {
      button.textContent = '裏面を選択';
    }
  });
  
  // テキストノードの修正（より深い階層）
  if (node.querySelectorAll) {
    const allElements = node.querySelectorAll('*');
    allElements.forEach(element => {
      if (element.childNodes && element.childNodes.length > 0) {
        for (let i = 0; i < element.childNodes.length; i++) {
          const textNode = element.childNodes[i];
          if (textNode.nodeType === Node.TEXT_NODE && textNode.textContent.includes('証明写真タイプ')) {
            textNode.textContent = textNode.textContent.replace('証明写真タイプ', '観光客');
          }
        }
      }
    });
  }
}