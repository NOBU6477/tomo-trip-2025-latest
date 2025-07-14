/**
 * 料金表示の修正スクリプト
 * セッション料金の表示を修正し、料金タイプ選択タブを表示する
 */

// グローバル変数で現在の料金タイプを保持（プレビュー機能との連携用）
window.currentFeeType = 'session'; // デフォルトはセッション料金

document.addEventListener('DOMContentLoaded', function() {
  console.log('料金表示修正スクリプトを実行しています...');
  
  // ページが完全に読み込まれた後、少し遅延させて実行
  setTimeout(fixFeeDisplay, 500);
  
  // 短い間隔で複数回実行して確実に適用されるようにする
  for (let i = 1; i <= 5; i++) {
    setTimeout(fixFeeDisplay, i * 1000);
  }
});

// スタイルを強制的に適用するためのCSSを追加
document.head.insertAdjacentHTML('beforeend', `
  <style>
    /* モダンな料金タイプタブのスタイル */
    .fee-type-container {
      display: flex;
      margin-bottom: 20px;
      border-radius: 12px;
      overflow: visible;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      background: #fff;
      position: relative;
      transition: all 0.3s ease;
    }
    
    .fee-tab {
      flex: 1;
      padding: 16px 20px;
      text-align: center;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
      user-select: none;
      position: relative;
      z-index: 1;
      border: none;
      font-size: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .fee-tab.fee-tab-active {
      color: #ffffff !important;
      background-color: transparent !important;
    }
    
    .fee-tab:not(.fee-tab-active) {
      color: #495057 !important;
      background-color: transparent !important;
    }
    
    .fee-tab:not(.fee-tab-active):hover {
      color: #0077cc !important;
    }
    
    .fee-tab-indicator {
      position: absolute;
      height: 100%;
      width: 50%;
      background: linear-gradient(135deg, #0077cc, #00a8ff);
      top: 0;
      left: 0;
      z-index: 0;
      border-radius: 12px;
      transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      box-shadow: 0 4px 10px rgba(0, 119, 204, 0.3);
    }
    
    /* モダンな料金入力欄 */
    .modern-fee-input {
      background-color: #ffffff !important;
      color: #000000 !important;
      border: 2px solid #eaeaea !important;
      border-radius: 10px !important;
      padding: 14px !important;
      font-size: 16px !important;
      font-weight: 600 !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
      transition: all 0.3s ease !important;
      width: 100% !important;
      min-height: 50px !important;
    }
    
    .modern-fee-input:focus {
      border-color: #0077cc !important;
      box-shadow: 0 0 0 4px rgba(0, 119, 204, 0.15) !important;
      outline: none !important;
    }
    
    .modern-fee-label {
      font-size: 16px !important;
      font-weight: 600 !important;
      color: #2c3e50 !important;
      margin-bottom: 12px !important;
      display: block !important;
    }
    
    .modern-fee-description {
      background-color: #f8fafc !important;
      border-left: 4px solid #0077cc !important;
      border-radius: 6px !important;
      padding: 12px 16px !important;
      margin-top: 12px !important;
      font-size: 14px !important;
      color: #485563 !important;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03) !important;
    }
    
    .modern-currency {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 14px !important;
      font-size: 18px !important;
      font-weight: 700 !important;
      color: #0077cc !important;
      background-color: #f0f7ff !important;
      border: 2px solid #eaeaea !important;
      border-right: none !important;
      border-radius: 10px 0 0 10px !important;
      height: 50px !important;
    }
    
    .fee-info-card {
      background: linear-gradient(to right, #f8fafc, #fff);
      border-radius: 10px;
      padding: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      margin-top: 20px;
      border-left: 4px solid #0077cc;
    }
    
    .fee-info-title {
      color: #0077cc;
      font-weight: 700;
      margin-bottom: 12px;
      font-size: 15px;
    }
    
    .fee-info-list {
      padding-left: 20px;
      margin-bottom: 0;
    }
    
    .fee-info-list li {
      margin-bottom: 10px;
      position: relative;
      padding-left: 5px;
      line-height: 1.5;
    }
    
    .fee-info-list li:last-child {
      margin-bottom: 0;
    }
    
    .fee-info-list li strong {
      color: #2c3e50;
    }
    
    /* 入力欄のプレースホルダーを常に見やすくする */
    .visible-placeholder::placeholder {
      color: #6c757d !important;
      opacity: 1 !important;
    }
    
    input[type="text"], input[type="email"], input[type="number"], textarea {
      color: #000000 !important;
      background-color: #ffffff !important;
    }
  </style>
`);

/**
 * 料金表示を修正
 */
function fixFeeDisplay() {
  console.log('料金表示を修正中...');
  
  // 料金入力欄のコンテナを取得
  const feeInput = document.getElementById('guide-session-fee');
  if (!feeInput) {
    console.warn('料金入力欄が見つかりません');
    return;
  }
  
  // 必ず値を表示するように設定
  if (!feeInput.value) {
    feeInput.value = '6000';
  }
  
  // モダンな入力欄スタイルを適用
  feeInput.classList.add('modern-fee-input');
  
  // 親要素のdivを取得（通常はform-groupクラスを持つdiv）
  const feeContainer = feeInput.closest('.mb-3') || feeInput.closest('.form-group');
  if (!feeContainer) {
    console.warn('料金入力欄の親コンテナが見つかりません');
    return;
  }
  
  // 料金ラベルをより明確に
  const feeLabel = feeContainer.querySelector('label[for="guide-session-fee"]');
  if (feeLabel) {
    feeLabel.classList.add('modern-fee-label');
    
    // デフォルトでセッション料金を表示
    feeLabel.textContent = 'セッション料金（1回あたり）';
  }
  
  // 通貨記号部分もモダンに
  const inputGroup = feeInput.closest('.input-group');
  if (inputGroup) {
    const currencySymbol = inputGroup.querySelector('.input-group-text');
    if (currencySymbol) {
      currencySymbol.classList.add('modern-currency');
    }
  }
  
  // 料金説明テキストをより鮮明に
  const feeDescription = feeContainer.querySelector('.form-text');
  if (feeDescription) {
    feeDescription.classList.add('modern-fee-description');
    
    // デフォルトの説明テキスト
    feeDescription.innerHTML = '最低料金は¥6,000/回です。ガイド内容に応じて自由に設定できます。';
  }
  
  // 料金タイプ選択タブがない場合は作成
  let feeTypeContainer = document.getElementById('fee-type-tabs');
  if (!feeTypeContainer) {
    // 料金タイプ選択タブを作成
    feeTypeContainer = document.createElement('div');
    feeTypeContainer.id = 'fee-type-tabs';
    feeTypeContainer.className = 'fee-type-container mb-4';
    
    // タブインジケーター（アクティブタブの背景として動くもの）
    const tabIndicator = document.createElement('div');
    tabIndicator.className = 'fee-tab-indicator';
    feeTypeContainer.appendChild(tabIndicator);
    
    // セッション料金タブ
    const sessionTab = document.createElement('div');
    sessionTab.className = 'fee-tab fee-tab-active';
    sessionTab.dataset.type = 'session';
    sessionTab.dataset.position = '0';
    sessionTab.innerHTML = '<span>セッション料金</span>';
    
    // 時間料金タブ
    const hourlyTab = document.createElement('div');
    hourlyTab.className = 'fee-tab';
    hourlyTab.dataset.type = 'hourly';
    hourlyTab.dataset.position = '1';
    hourlyTab.innerHTML = '<span>時間料金</span>';
    
    // タブをコンテナに追加
    feeTypeContainer.appendChild(sessionTab);
    feeTypeContainer.appendChild(hourlyTab);
    
    // 料金入力欄の前に挿入
    if (feeLabel) {
      feeLabel.parentElement.insertBefore(feeTypeContainer, feeLabel);
    } else {
      const inputGroup = feeInput.closest('.input-group');
      if (inputGroup) {
        inputGroup.parentElement.insertBefore(feeTypeContainer, inputGroup);
      }
    }
    
    // タブクリックイベント
    sessionTab.addEventListener('click', function() {
      console.log('セッション料金タブがクリックされました');
      activateTab(this);
      setFeeType('session');
    });
    
    hourlyTab.addEventListener('click', function() {
      console.log('時間料金タブがクリックされました');
      activateTab(this);
      setFeeType('hourly');
    });
    
    // 初期状態ではセッション料金をアクティブに
    activateTab(sessionTab);
    setFeeType('session');
  }
  
  // 料金説明カードをより明確に
  addFeeTypeDescription(feeContainer);
}

/**
 * 料金タブを活性化
 */
function activateTab(tab) {
  console.log(`タブ "${tab.textContent}" をアクティブ化します`);
  
  // すべてのタブを非アクティブに
  const tabs = document.querySelectorAll('.fee-tab');
  tabs.forEach(t => {
    t.classList.remove('fee-tab-active');
  });
  
  // クリックされたタブをアクティブに
  tab.classList.add('fee-tab-active');
  
  // インジケーターの位置を移動
  const indicator = document.querySelector('.fee-tab-indicator');
  if (indicator) {
    const position = parseInt(tab.dataset.position);
    indicator.style.left = `${position * 50}%`;
  }
  
  console.log(`タブをアクティブ化しました: ${tab.textContent}`);
}

/**
 * 料金タイプを設定
 */
function setFeeType(type) {
  console.log(`料金タイプを設定: ${type}`);
  
  const feeInput = document.getElementById('guide-session-fee');
  if (!feeInput) return;
  
  const feeLabel = document.querySelector('label[for="guide-session-fee"]');
  let feeDescription = document.querySelector('.form-text');
  
  // フォームグループから説明文を探す（より確実な方法）
  if (!feeDescription) {
    const formGroup = feeInput.closest('.mb-3') || feeInput.closest('.form-group');
    if (formGroup) {
      feeDescription = formGroup.querySelector('.form-text');
    }
  }
  
  // 現在の値を保持
  const currentValue = parseInt(feeInput.value) || 0;
  
  // 料金タイプに応じて値とラベルを変更
  if (type === 'session') {
    console.log('セッション料金に変更します');
    
    if (feeLabel) {
      feeLabel.textContent = 'セッション料金（1回あたり）';
    }
    
    // 最低金額より小さい場合、最低金額を設定
    if (currentValue < 6000) {
      feeInput.value = '6000';
    }
    
    if (feeDescription) {
      feeDescription.innerHTML = '最低料金は¥6,000/回です。ガイド内容に応じて自由に設定できます。';
      feeDescription.style.display = 'block';
    }
  } else {
    console.log('時間料金に変更します');
    
    if (feeLabel) {
      feeLabel.textContent = '時間料金（1時間あたり）';
    }
    
    // 時間料金は1時間あたり3000円固定
    feeInput.value = '3000';
    
    if (feeDescription) {
      feeDescription.innerHTML = '時間料金は¥3,000/時間に設定されています。<br>長時間のツアーに適しています（最低料金¥6,000〜）。';
      feeDescription.style.display = 'block';
    }
  }
  
  // 料金タイプをデータ属性として保存（フォーム送信時に使用可能）
  feeInput.dataset.feeType = type;
  
  // グローバル変数にも設定
  window.currentFeeType = type;
  
  // プレビュー更新イベントを発火
  if (typeof updateProfilePreview === 'function') {
    console.log('プレビュー更新を呼び出します...');
    setTimeout(updateProfilePreview, 100);
  }
  
  console.log(`料金タイプを設定しました: ${type}, 値: ${feeInput.value}`);
}

/**
 * 料金タイプの説明を追加
 */
function addFeeTypeDescription(container) {
  // 既存の説明を確認
  let typeDescription = document.getElementById('fee-type-description');
  if (!typeDescription) {
    // 説明テキストを作成
    typeDescription = document.createElement('div');
    typeDescription.id = 'fee-type-description';
    typeDescription.className = 'fee-info-card';
    
    // 説明内容
    typeDescription.innerHTML = `
      <div class="fee-info-title">料金タイプについて</div>
      <ul class="fee-info-list">
        <li><strong>セッション料金</strong>：ツアーや体験1回あたりの固定料金（推奨）<br>
            <small>最低金額¥6,000〜、お客様のニーズに合わせて自由に設定できます</small></li>
        <li><strong>時間料金</strong>：1時間あたりの料金<br>
            <small>¥3,000/時間で固定、長時間のツアーや柔軟な予約に適しています<br>（2時間以上からの予約となり、最低料金は¥6,000です）</small></li>
      </ul>
    `;
    
    // 入力グループの後に挿入
    const inputGroup = container.querySelector('.input-group');
    if (inputGroup) {
      const nextElement = inputGroup.nextElementSibling;
      if (nextElement) {
        container.insertBefore(typeDescription, nextElement);
      } else {
        container.appendChild(typeDescription);
      }
    } else {
      // 入力グループが見つからない場合はコンテナに直接追加
      container.appendChild(typeDescription);
    }
    
    console.log('料金タイプの説明が追加されました');
  }
}