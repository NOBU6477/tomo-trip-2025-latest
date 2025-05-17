/**
 * 時間選択ドロップダウンのスタイル修正スクリプト
 * インラインスタイルを直接適用して確実に見えるようにする
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('時間選択修正スクリプトを実行しています...');
  
  // ページが完全に読み込まれた後、少し遅延させて実行
  setTimeout(fixTimeSelectors, 500);
  
  // 短い間隔で複数回実行して確実に適用されるようにする
  for (let i = 1; i <= 5; i++) {
    setTimeout(fixTimeSelectors, i * 1000);
  }
});

/**
 * すべての時間選択セレクトボックスを修正
 */
function fixTimeSelectors() {
  console.log('時間選択セレクトボックスのスタイルを修正中...');
  
  // すべてのセレクトボックスを取得
  const allSelects = document.querySelectorAll('select');
  
  allSelects.forEach(select => {
    // 時間選択用のセレクトボックスか確認
    if (select.id && (
        select.id.includes('time') || 
        select.id.includes('start') || 
        select.id.includes('end') ||
        select.classList.contains('time-picker') ||
        select.parentElement.classList.contains('time-selects') ||
        select.parentElement.classList.contains('time-picker-container')
    )) {
      console.log('時間選択セレクトを修正:', select.id);
      applySelectStyles(select);
    }
  });
  
  // 曜日タブの時間設定も確認
  const weekdaySelects = document.querySelectorAll('.tab-pane select');
  weekdaySelects.forEach(select => {
    console.log('曜日タブ内の選択要素を修正:', select.id);
    applySelectStyles(select);
  });
  
  // 特別な日付の時間設定
  const specialDateSelects = document.querySelectorAll('#special-date-time-container select');
  specialDateSelects.forEach(select => {
    console.log('特別な日付の選択要素を修正:', select.id);
    applySelectStyles(select);
  });
}

/**
 * 選択ボックスにスタイルを適用
 */
function applySelectStyles(select) {
  // セレクト要素自体のスタイル
  Object.assign(select.style, {
    backgroundColor: '#ffffff',
    color: '#000000',
    border: '3px solid #0077cc',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '16px',
    padding: '12px 15px',
    appearance: 'auto',
    webkitAppearance: 'menulist',
    mozAppearance: 'menulist',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    width: '100%'
  });
  
  // 選択肢のスタイルも修正
  // 残念ながらブラウザの制限により実際のオプションスタイルは制限される
  for (let i = 0; i < select.options.length; i++) {
    const option = select.options[i];
    try {
      Object.assign(option.style, {
        backgroundColor: '#ffffff',
        color: '#000000',
        padding: '10px',
        fontWeight: 'normal'
      });
    } catch (e) {
      console.warn('選択肢のスタイル適用エラー:', e);
    }
  }
  
  // 選択されたオプションを強調
  if (select.selectedIndex >= 0) {
    try {
      const selectedOption = select.options[select.selectedIndex];
      Object.assign(selectedOption.style, {
        backgroundColor: '#e6f7ff',
        fontWeight: 'bold'
      });
    } catch (e) {
      console.warn('選択済み選択肢のスタイル適用エラー:', e);
    }
  }
  
  // ラベルも見やすく調整
  const label = select.parentElement.querySelector('label');
  if (label) {
    Object.assign(label.style, {
      color: '#0066cc',
      fontWeight: '600',
      fontSize: '14px',
      marginBottom: '8px',
      display: 'block'
    });
  }
  
  // 親コンテナにも余白を追加して見やすく
  const parent = select.parentElement;
  if (parent) {
    Object.assign(parent.style, {
      marginBottom: '15px'
    });
  }
}