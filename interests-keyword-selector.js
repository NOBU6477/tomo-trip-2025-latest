/**
 * 興味・得意分野の絞り込み検索に対応した選択機能
 * 観光客がガイド検索時に使えるキーワードタグと自由入力を一元管理
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('専門分野・興味タグセレクター初期化...');
  
  // ページの読み込みが完了してから少し遅延して初期化（DOM完全ロード確保）
  setTimeout(initInterestsKeywordSelector, 500);
});

// グローバルな状態管理
const interestsState = {
  selectedTags: new Set(), // 選択されたタグ（チェックボックス + カスタム）
  customTags: [],          // ユーザー定義のカスタムタグ
};

/**
 * 専門分野・興味セレクターの初期化
 */
function initInterestsKeywordSelector() {
  // スタイルを挿入
  injectStyles();
  
  // 興味・得意分野セクションを取得
  const interestsLabel = document.querySelector('label[for="guide-interests"]');
  if (!interestsLabel) {
    console.error('興味・得意分野ラベルが見つかりません');
    return;
  }
  
  const container = interestsLabel.closest('.mb-3') || interestsLabel.closest('.form-group');
  if (!container) {
    console.error('興味・得意分野セクションが見つかりません');
    return;
  }
  
  console.log('興味・得意分野セクションを見つけました:', container);
  
  // 元の要素を保持（データ送信用）
  const originalCheckboxes = container.querySelectorAll('.form-check-input[type="checkbox"]');
  const originalCustomInput = document.getElementById('interest-custom');
  
  // オリジナルの要素を非表示にする
  originalCheckboxes.forEach(checkbox => {
    checkbox.closest('.form-check').style.display = 'none';
  });
  
  if (originalCustomInput) {
    originalCustomInput.parentElement.style.display = 'none';
  }
  
  // 新しいUI要素を作成
  createModernUI(container, originalCheckboxes, originalCustomInput);
  
  // フォーム送信前の処理（元の入力欄に値を同期）
  setupFormSubmitHandler(originalCheckboxes, originalCustomInput);
}

/**
 * モダンなUIを作成
 */
function createModernUI(container, originalCheckboxes, originalCustomInput) {
  // タイトルと説明テキストエリアを追加
  const titleContainer = document.createElement('div');
  titleContainer.className = 'interests-title-container';
  titleContainer.innerHTML = `
    <div class="interests-main-title">
      <i class="bi bi-tag-fill"></i>専門分野・興味キーワード
    </div>
    <div class="interests-description">
      <i class="bi bi-lightbulb-fill"></i>
      <span>これらのキーワードは観光客の検索結果に表示され、あなたのガイドが見つけやすくなります</span>
    </div>
  `;
  container.appendChild(titleContainer);
  
  // モダンなUIコンテナを作成
  const modernUI = document.createElement('div');
  modernUI.className = 'interests-container';
  container.appendChild(modernUI);
  
  // 選択中のキーワードセクション（上部に配置して目立たせる）
  const selectedSection = document.createElement('div');
  selectedSection.className = 'interests-section interests-selected-section';
  selectedSection.innerHTML = `
    <div class="interests-section-header">
      <div class="interests-section-title">
        <i class="bi bi-check2-circle"></i>選択中のキーワード
        <span class="interests-tag-counter" id="selected-count">0</span>
      </div>
      <div class="interests-section-subtitle">観光客の検索結果に表示されるタグです</div>
    </div>
    <div class="interests-tags-wrapper">
      <div class="interests-tags" id="selected-tags-preview"></div>
      <div class="interests-empty-message" id="empty-selection-message">
        <i class="bi bi-arrow-down-circle"></i>
        <span>下からキーワードを選択するか、自分だけのキーワードを追加してください</span>
      </div>
    </div>
  `;
  modernUI.appendChild(selectedSection);
  
  // プリセットタグセクション
  const presetSection = document.createElement('div');
  presetSection.className = 'interests-section';
  presetSection.innerHTML = `
    <div class="interests-section-header">
      <div class="interests-section-title">
        <i class="bi bi-stars"></i>人気のキーワード
      </div>
      <div class="interests-section-subtitle">クリックして選択・削除できます</div>
    </div>
    <div class="interests-preset-tags-container" id="preset-tags"></div>
  `;
  modernUI.appendChild(presetSection);
  
  // カスタムタグセクション
  const customSection = document.createElement('div');
  customSection.className = 'interests-section';
  customSection.innerHTML = `
    <div class="interests-section-header">
      <div class="interests-section-title">
        <i class="bi bi-pencil-square"></i>カスタムキーワード
      </div>
      <div class="interests-section-subtitle">あなた独自のキーワードを追加できます</div>
    </div>
    <div class="interests-custom-input">
      <div class="custom-input-container">
        <input type="text" id="new-custom-tag" placeholder="新しいキーワードを入力" class="interests-tag-input">
        <button type="button" id="add-custom-tag-btn" class="add-tag-button">
          <i class="bi bi-plus-lg"></i>追加
        </button>
      </div>
      <div class="input-hint">Enterキーでも追加できます</div>
    </div>
    <div class="interests-tags" id="custom-tags"></div>
  `;
  modernUI.appendChild(customSection);
  
  // オリジナルのチェックボックスからプリセットタグを作成
  createPresetTags(originalCheckboxes);
  
  // カスタム入力イベント設定
  setupCustomTagInput();
  
  // すでに選択されているチェックボックスを反映
  originalCheckboxes.forEach(checkbox => {
    if (checkbox.checked) {
      const tagValue = checkbox.value;
      const tagLabel = checkbox.nextElementSibling.textContent;
      interestsState.selectedTags.add(tagValue);
      addToSelectedTagsPreview(tagValue, tagLabel);
      activatePresetTag(tagValue);
    }
  });
  
  // 既存のカスタムタグを反映（カンマ区切りで分割）
  if (originalCustomInput && originalCustomInput.value) {
    const customValues = originalCustomInput.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    customValues.forEach(tag => {
      addCustomTag(tag);
    });
  }
  
  // 選択中のキーワードカウントを更新
  updateSelectedCount();
}

/**
 * プリセットタグを作成
 */
function createPresetTags(originalCheckboxes) {
  const presetContainer = document.getElementById('preset-tags');
  
  // 各チェックボックスに対応するカテゴリ情報
  const categoryMapping = {
    'night': { icon: 'moon-stars-fill', color: '#3f51b5', label: 'ナイト' },
    'food': { icon: 'cup-hot-fill', color: '#e65100', label: 'グルメ' },
    'photo': { icon: 'camera-fill', color: '#00838f', label: '写真' },
    'cooking': { icon: 'egg-fried', color: '#e65100', label: '料理' },
    'activity': { icon: 'bicycle', color: '#558b2f', label: 'アクティビティ' }
  };
  
  originalCheckboxes.forEach(checkbox => {
    const value = checkbox.value;
    const label = checkbox.nextElementSibling.textContent;
    const category = categoryMapping[value] || { icon: 'tag-fill', color: '#6c757d', label: '' };
    
    const tag = document.createElement('div');
    tag.className = 'interests-preset-chip';
    tag.dataset.value = value;
    tag.dataset.category = value;
    
    tag.innerHTML = `
      <div class="preset-chip-icon" style="background-color: ${category.color}">
        <i class="bi bi-${category.icon}"></i>
      </div>
      <span class="preset-chip-text">${label}</span>
      <span class="preset-chip-status">
        <i class="bi bi-plus-lg add-icon"></i>
        <i class="bi bi-check-lg check-icon"></i>
      </span>
    `;
    
    tag.addEventListener('click', function() {
      const isSelected = interestsState.selectedTags.has(value);
      
      if (isSelected) {
        // すでに選択されている場合は選択を解除
        interestsState.selectedTags.delete(value);
        this.classList.remove('active');
        removeFromSelectedTagsPreview(value);
        
        // オリジナルのチェックボックスの状態も更新
        const originalCheckbox = document.getElementById('interest-' + value);
        if (originalCheckbox) {
          originalCheckbox.checked = false;
        }
      } else {
        // 選択されていない場合は選択を追加
        interestsState.selectedTags.add(value);
        this.classList.add('active');
        addToSelectedTagsPreview(value, label, category);
        
        // オリジナルのチェックボックスの状態も更新
        const originalCheckbox = document.getElementById('interest-' + value);
        if (originalCheckbox) {
          originalCheckbox.checked = true;
        }
      }
      
      updateSelectedCount();
    });
    
    presetContainer.appendChild(tag);
  });
}

/**
 * プリセットタグをアクティブにする
 */
function activatePresetTag(value) {
  const tag = document.querySelector(`.interests-preset-chip[data-value="${value}"]`);
  if (tag) {
    tag.classList.add('active');
    
    // バッジタグの更新もトリガー
    if (typeof window.updateBadgeTags === 'function') {
      console.log('プリセットタグアクティブ化時にバッジタグの更新をトリガー:', value);
      setTimeout(window.updateBadgeTags, 50);
    }
  }
}

/**
 * カスタムタグの入力を設定
 */
function setupCustomTagInput() {
  const tagInput = document.getElementById('new-custom-tag');
  const addButton = document.getElementById('add-custom-tag-btn');
  
  if (!tagInput || !addButton) {
    console.error('カスタムタグ入力欄または追加ボタンが見つかりません');
    return;
  }
  
  console.log('カスタムタグ入力欄と追加ボタンのイベント設定');
  
  // すでに設定済みのイベントを削除（重複防止）
  const newInput = tagInput.cloneNode(true);
  tagInput.parentNode.replaceChild(newInput, tagInput);
  
  const newButton = addButton.cloneNode(true);
  addButton.parentNode.replaceChild(newButton, addButton);
  
  // Enterキーでの追加処理
  newInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && this.value.trim()) {
      e.preventDefault();
      const tagValue = this.value.trim();
      console.log('Enterキーによる新規タグ追加:', tagValue);
      addCustomTag(tagValue);
      this.value = '';
      updateSelectedCount();
      
      // タグの更新をバッジにも反映
      if (typeof window.updateBadgeTags === 'function') {
        setTimeout(() => window.updateBadgeTags(), 100);
      }
      
      // 入力後にフォーカスを維持する
      setTimeout(() => this.focus(), 0);
    }
  });
  
  // ボタンクリックでの追加処理
  newButton.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const tagValue = newInput.value.trim();
    if (tagValue) {
      console.log('ボタンクリックによる新規タグ追加:', tagValue);
      addCustomTag(tagValue);
      newInput.value = '';
      updateSelectedCount();
      
      // タグの更新をバッジにも反映
      if (typeof window.updateBadgeTags === 'function') {
        setTimeout(() => window.updateBadgeTags(), 100);
      }
      
      // 入力後にフォーカスを維持する
      setTimeout(() => newInput.focus(), 0);
    }
    
    return false;
  });
}

/**
 * カスタムタグを追加
 */
function addCustomTag(tagValue) {
  // すでに追加済みの場合は何もしない
  if (interestsState.customTags.includes(tagValue)) {
    return;
  }
  
  // タグの最大文字数制限（20文字）
  const truncatedValue = tagValue.length > 20 ? tagValue.substring(0, 20) + '...' : tagValue;
  
  // カスタムタグを追加
  interestsState.customTags.push(tagValue);
  interestsState.selectedTags.add('custom:' + tagValue);
  
  // カスタムタグUIを追加
  const customTagsContainer = document.getElementById('custom-tags');
  const tag = document.createElement('div');
  tag.className = 'interests-custom-chip active';
  tag.dataset.value = 'custom:' + tagValue;
  
  tag.innerHTML = `
    <div class="custom-chip-content">
      <i class="bi bi-bookmark-fill"></i>
      <span class="custom-chip-text">${truncatedValue}</span>
    </div>
    <button class="custom-chip-remove" aria-label="タグを削除">
      <i class="bi bi-x-lg"></i>
    </button>
  `;
  
  // 削除ボタンのイベント
  const removeBtn = tag.querySelector('.custom-chip-remove');
  removeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    
    // カスタムタグの状態から削除
    interestsState.customTags = interestsState.customTags.filter(tag => tag !== tagValue);
    interestsState.selectedTags.delete('custom:' + tagValue);
    
    // UIから削除
    tag.classList.add('removing');
    
    // アニメーション完了後に要素を削除
    setTimeout(() => {
      tag.remove();
      removeFromSelectedTagsPreview('custom:' + tagValue);
      updateSelectedCount();
    }, 300);
  });
  
  customTagsContainer.appendChild(tag);
  
  // 選択中プレビューにも追加
  addToSelectedTagsPreview('custom:' + tagValue, truncatedValue, { icon: 'bookmark-fill', color: '#ff9800' });
}

/**
 * 選択中タグプレビューに追加
 */
function addToSelectedTagsPreview(value, label, category = null) {
  const selectedContainer = document.getElementById('selected-tags-preview');
  const emptyMessage = document.getElementById('empty-selection-message');
  
  // すでにある場合はスキップ
  if (document.querySelector(`.selected-tag-preview[data-value="${value}"]`)) {
    return;
  }
  
  // カテゴリー情報がない場合のデフォルト設定
  if (!category) {
    if (value.startsWith('custom:')) {
      category = { icon: 'bookmark-fill', color: '#ff9800' };
    } else {
      // プリセットタグのデフォルト
      const presetMapping = {
        'night': { icon: 'moon-stars-fill', color: '#3f51b5' },
        'food': { icon: 'cup-hot-fill', color: '#e65100' },
        'photo': { icon: 'camera-fill', color: '#00838f' },
        'cooking': { icon: 'egg-fried', color: '#e65100' },
        'activity': { icon: 'bicycle', color: '#558b2f' }
      };
      category = presetMapping[value] || { icon: 'tag-fill', color: '#6c757d' };
    }
  }
  
  const tag = document.createElement('div');
  tag.className = 'selected-tag-preview';
  tag.dataset.value = value;
  
  tag.innerHTML = `
    <div class="selected-tag-content">
      <div class="selected-tag-icon" style="background-color: ${category.color}">
        <i class="bi bi-${category.icon}"></i>
      </div>
      <span class="selected-tag-text">${label}</span>
    </div>
    <button class="selected-tag-remove" aria-label="タグを削除">
      <i class="bi bi-x-lg"></i>
    </button>
  `;
  
  // 削除ボタンのイベント
  const removeBtn = tag.querySelector('.selected-tag-remove');
  removeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    
    // アニメーション効果
    tag.classList.add('removing');
    
    setTimeout(() => {
      // キーワードのタイプに基づいて異なる処理
      if (value.startsWith('custom:')) {
        // カスタムタグの場合
        const customValue = value.replace('custom:', '');
        
        // カスタムタグの状態から削除
        interestsState.customTags = interestsState.customTags.filter(tag => tag !== customValue);
        interestsState.selectedTags.delete(value);
        
        // カスタムタグUIからも削除
        const customTag = document.querySelector(`.interests-custom-chip[data-value="${value}"]`);
        if (customTag) {
          customTag.classList.add('removing');
          setTimeout(() => customTag.remove(), 300);
        }
        
      } else {
        // プリセットタグの場合
        interestsState.selectedTags.delete(value);
        
        // プリセットタグのアクティブ状態を解除
        const presetTag = document.querySelector(`.interests-preset-chip[data-value="${value}"]`);
        if (presetTag) presetTag.classList.remove('active');
        
        // オリジナルのチェックボックスの状態も更新
        const originalCheckbox = document.getElementById('interest-' + value);
        if (originalCheckbox) {
          originalCheckbox.checked = false;
        }
      }
      
      // 選択中プレビューから削除
      tag.remove();
      
      updateSelectedCount();
    }, 300);
  });
  
  selectedContainer.appendChild(tag);
  
  // 空メッセージを非表示
  if (emptyMessage) {
    emptyMessage.style.display = 'none';
  }
}

/**
 * 選択中タグプレビューから削除
 */
function removeFromSelectedTagsPreview(value) {
  const tag = document.querySelector(`.selected-tag-preview[data-value="${value}"]`);
  if (tag) {
    tag.classList.add('removing');
    setTimeout(() => tag.remove(), 300);
  }
  
  // すべてのタグが削除された場合は空メッセージを表示
  const selectedContainer = document.getElementById('selected-tags-preview');
  const emptyMessage = document.getElementById('empty-selection-message');
  
  if (selectedContainer && selectedContainer.childElementCount === 0 && emptyMessage) {
    emptyMessage.style.display = 'flex';
  }
}

/**
 * 選択中のキーワード数を更新
 */
function updateSelectedCount() {
  const countElement = document.getElementById('selected-count');
  const count = interestsState.selectedTags.size;
  countElement.textContent = count.toString();
  
  // 選択がない場合と選択がある場合でセクションの表示を切り替え
  const selectedSection = document.querySelector('.interests-selected-section');
  const emptyMessage = document.getElementById('empty-selection-message');
  
  if (count === 0) {
    selectedSection.classList.add('empty');
    if (emptyMessage) emptyMessage.style.display = 'flex';
  } else {
    selectedSection.classList.remove('empty');
    if (emptyMessage) emptyMessage.style.display = 'none';
  }
  
  // バッジタグの更新をトリガー
  if (typeof window.updateBadgeTags === 'function') {
    console.log('タグ数更新後にバッジタグの更新をトリガー');
    setTimeout(window.updateBadgeTags, 50);
  }
}

/**
 * フォーム送信ハンドラをセットアップ
 */
function setupFormSubmitHandler(originalCheckboxes, originalCustomInput) {
  // プロフィールフォームを検索
  const profileForm = document.getElementById('profile-basic-form');
  if (!profileForm) return;
  
  profileForm.addEventListener('submit', function(e) {
    // カスタムタグをオリジナルの入力欄に反映
    if (originalCustomInput) {
      originalCustomInput.value = interestsState.customTags.join(', ');
    }
    
    // チェックボックスは個別にイベントで更新済み
  });
}

/**
 * スタイルを注入
 */
function injectStyles() {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = `
    /* 興味・専門分野セレクター用スタイル */
    .interests-title-container {
      margin-bottom: 16px;
    }
    
    .interests-main-title {
      font-size: 16px;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .interests-main-title i {
      color: #0077cc;
    }
    
    .interests-description {
      display: flex;
      align-items: center;
      background-color: #f0f7ff;
      border-left: 4px solid #0077cc;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 13px;
      color: #3a5069;
      line-height: 1.4;
    }
    
    .interests-description i {
      color: #0077cc;
      margin-right: 8px;
      font-size: 14px;
      flex-shrink: 0;
    }
    
    .interests-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
      padding: 0;
      border-radius: 12px;
    }
    
    .interests-section {
      position: relative;
      padding: 16px;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }
    
    .interests-section-header {
      margin-bottom: 14px;
    }
    
    .interests-section-title {
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 4px;
      font-size: 15px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .interests-section-title i {
      color: #0077cc;
      font-size: 16px;
    }
    
    .interests-section-subtitle {
      font-size: 13px;
      color: #6c757d;
    }
    
    .interests-tag-counter {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background-color: #0077cc;
      color: white;
      font-size: 12px;
      font-weight: 600;
      min-width: 20px;
      height: 20px;
      border-radius: 10px;
      padding: 0 6px;
      margin-left: 6px;
    }
    
    /* 選択中タグエリア */
    .interests-tags-wrapper {
      position: relative;
      min-height: 60px;
    }
    
    .interests-empty-message {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(248, 249, 250, 0.8);
      border-radius: 8px;
      padding: 16px;
      text-align: center;
      color: #6c757d;
      font-size: 14px;
      gap: 8px;
      z-index: 1;
    }
    
    .interests-empty-message i {
      font-size: 18px;
      color: #0077cc;
    }
    
    .interests-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 8px;
    }
    
    /* プリセットチップスタイル */
    .interests-preset-tags-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 10px;
    }
    
    .interests-preset-chip {
      display: flex;
      align-items: center;
      padding: 8px 12px;
      background-color: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s ease;
      user-select: none;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }
    
    .interests-preset-chip:hover {
      background-color: #f1f3f5;
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    }
    
    .preset-chip-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 8px;
      color: white;
      margin-right: 10px;
      font-size: 14px;
      flex-shrink: 0;
      transition: all 0.2s ease;
    }
    
    .preset-chip-text {
      flex-grow: 1;
      font-size: 14px;
      font-weight: 500;
      color: #495057;
    }
    
    .preset-chip-status {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      flex-shrink: 0;
      transition: all 0.2s ease;
      background-color: rgba(0, 0, 0, 0.1);
      color: white;
    }
    
    .preset-chip-status .add-icon {
      display: block;
    }
    
    .preset-chip-status .check-icon {
      display: none;
    }
    
    /* アクティブ状態のプリセットチップ */
    .interests-preset-chip.active {
      background-color: rgba(0, 119, 204, 0.08);
      border-color: rgba(0, 119, 204, 0.2);
    }
    
    .interests-preset-chip.active .preset-chip-text {
      color: #0077cc;
      font-weight: 600;
    }
    
    .interests-preset-chip.active .preset-chip-status {
      background-color: #0077cc;
    }
    
    .interests-preset-chip.active .add-icon {
      display: none;
    }
    
    .interests-preset-chip.active .check-icon {
      display: block;
    }
    
    /* カスタム入力エリア */
    .interests-custom-input {
      margin-bottom: 14px;
    }
    
    .custom-input-container {
      display: flex;
      gap: 8px;
    }
    
    .interests-tag-input {
      flex-grow: 1;
      padding: 12px 16px;
      border-radius: 10px;
      border: 1px solid #dee2e6;
      font-size: 14px;
      transition: all 0.3s ease;
      outline: none;
      background-color: #f8f9fa;
    }
    
    .interests-tag-input:focus {
      border-color: #0077cc;
      box-shadow: 0 0 0 3px rgba(0, 119, 204, 0.12);
      background-color: #fff;
    }
    
    .input-hint {
      font-size: 12px;
      color: #6c757d;
      margin-top: 6px;
      margin-left: 4px;
    }
    
    .add-tag-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      background-color: #0077cc;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 0 16px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .add-tag-button:hover {
      background-color: #0069d9;
    }
    
    .add-tag-button:active {
      transform: translateY(1px);
    }
    
    /* カスタムタグスタイル */
    .interests-custom-chip {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      background-color: rgba(255, 152, 0, 0.08);
      border: 1px solid rgba(255, 152, 0, 0.2);
      border-radius: 10px;
      transition: all 0.2s ease;
      animation: fadeIn 0.3s ease forwards;
    }
    
    .interests-custom-chip.removing {
      opacity: 0;
      transform: translateX(20px);
    }
    
    .custom-chip-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .custom-chip-content i {
      color: #ff9800;
      font-size: 14px;
    }
    
    .custom-chip-text {
      color: #e65100;
      font-weight: 500;
      font-size: 14px;
    }
    
    .custom-chip-remove {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background-color: rgba(255, 152, 0, 0.2);
      color: #e65100;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      padding: 0;
      font-size: 12px;
    }
    
    .custom-chip-remove:hover {
      background-color: rgba(255, 152, 0, 0.3);
    }
    
    /* 選択中タグスタイル */
    .selected-tag-preview {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      background-color: white;
      border: 1px solid #e9ecef;
      border-radius: 10px;
      transition: all 0.3s ease;
      animation: fadeIn 0.3s ease forwards;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
    
    .selected-tag-preview.removing {
      opacity: 0;
      transform: translateX(20px);
    }
    
    .selected-tag-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .selected-tag-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 6px;
      color: white;
      font-size: 12px;
      flex-shrink: 0;
    }
    
    .selected-tag-text {
      font-size: 14px;
      font-weight: 500;
      color: #2c3e50;
    }
    
    .selected-tag-remove {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background-color: #e9ecef;
      color: #495057;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      padding: 0;
      font-size: 12px;
    }
    
    .selected-tag-remove:hover {
      background-color: #dee2e6;
      color: #000;
    }
    
    /* アニメーション */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    /* レスポンシブデザイン */
    @media (max-width: 767px) {
      .interests-preset-tags-container {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      }
      
      .interests-preset-chip {
        padding: 6px 10px;
      }
      
      .preset-chip-icon {
        width: 24px;
        height: 24px;
        font-size: 12px;
        margin-right: 8px;
      }
      
      .preset-chip-text {
        font-size: 13px;
      }
      
      .preset-chip-status {
        width: 20px;
        height: 20px;
      }
      
      .selected-tag-preview {
        padding: 6px 10px;
      }
      
      .selected-tag-icon {
        width: 22px;
        height: 22px;
        font-size: 11px;
      }
      
      .selected-tag-text {
        font-size: 13px;
      }
      
      .interests-custom-chip {
        padding: 6px 10px;
      }
      
      .custom-chip-content i {
        font-size: 12px;
      }
      
      .custom-chip-text {
        font-size: 13px;
      }
    }
  `;
  
  document.head.appendChild(styleElement);
}