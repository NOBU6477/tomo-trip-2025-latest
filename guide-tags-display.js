/**
 * ガイドタグ表示スクリプト
 * ガイドカードとプロフィールにタグを表示し、検索機能を提供します
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('ガイドタグ表示スクリプト初期化...');
  
  // ページタイプに応じた処理を実行
  const isGuideListPage = document.querySelector('.guide-cards-container') !== null;
  const isGuideProfilePage = document.querySelector('#profile-basic-form') !== null;
  
  if (isGuideListPage) {
    // ガイド一覧ページの場合
    initGuideListPageTags();
  } else if (isGuideProfilePage) {
    // ガイドプロフィールページの場合
    initGuideProfilePageTags();
  }
});

/**
 * ガイド一覧ページのタグ表示を初期化
 */
function initGuideListPageTags() {
  // スタイルを注入
  injectTagStyles();
  
  // 検索フィルター要素追加
  addSearchFilterUI();
  
  // 全ガイドカードにタグを追加
  const guideCards = document.querySelectorAll('.guide-card');
  guideCards.forEach(card => {
    addTagsToGuideCard(card);
  });
  
  // 検索フィルターイベント設定
  setupTagFilterEvents();
}

/**
 * ガイドプロフィールページのタグ表示を初期化
 */
function initGuideProfilePageTags() {
  // スタイルを注入
  injectTagStyles();
  
  // プロフィールプレビューにタグ表示エリアを追加
  addTagsToProfilePreview();
  
  // イベントリスナーを追加して専門分野変更時にプレビューを更新
  setupTagPreviewUpdateListener();
}

/**
 * ガイドカードにタグを追加
 */
function addTagsToGuideCard(card) {
  // ガイドのIDを取得
  const guideId = card.dataset.guideId || '';
  if (!guideId) return;
  
  // ダミーデータ（実際には各ガイドの情報からタグを取得する必要があります）
  // サンプルタグを表示するためのプレースホルダー
  const sampleTags = getSampleTagsForCard(card);
  
  // すでにタグコンテナがある場合は削除（重複防止）
  const existingContainer = card.querySelector('.guide-tags-container');
  if (existingContainer) {
    existingContainer.remove();
  }
  
  // タグコンテナを作成
  const tagsContainer = document.createElement('div');
  tagsContainer.className = 'guide-tags-container';
  
  // タグを追加
  sampleTags.forEach(tag => {
    const tagElement = createTagElement(tag);
    tagsContainer.appendChild(tagElement);
  });
  
  // カードの適切な場所に挿入
  // カード内の説明テキストの下に追加
  const cardBody = card.querySelector('.card-body');
  const cardText = card.querySelector('.card-text');
  if (cardBody && cardText) {
    cardBody.insertBefore(tagsContainer, cardText.nextSibling);
  } else {
    // 代替：カードの最後に追加
    card.appendChild(tagsContainer);
  }
}

/**
 * プロフィールプレビューにタグ表示エリアを追加
 */
function addTagsToProfilePreview() {
  // プロフィールプレビューを検索
  const previewContainer = document.querySelector('.profile-preview-container');
  if (!previewContainer) {
    console.log('プロフィールプレビューコンテナが見つかりません');
    return;
  }
  
  // すでにバッジタグコンテナがあれば処理をスキップ
  if (document.querySelector('.badge-tags-container')) {
    console.log('すでにバッジタグコンテナが存在するため、追加処理をスキップします');
    return;
  }
  
  // Badge-vertical-tagsスクリプトが実行済みかを確認
  if (typeof window.initializeBadgeTags === 'function') {
    console.log('バッジ型縦置きタグ初期化関数を呼び出します');
    try {
      window.initializeBadgeTags();
      // 初期表示用のタグを設定（Badge-vertical-tagsが処理）
      return;
    } catch (e) {
      console.error('バッジタグ初期化中にエラーが発生しました:', e);
    }
  } else {
    console.log('バッジ型縦置きタグ関数が見つからないため、従来のタグ表示に戻ります');
  }
  
  // Badge-vertical-tagsがなければ従来の表示方法を使用
  // タグ表示エリアを作成
  const tagsSection = document.createElement('div');
  tagsSection.className = 'profile-tags-section';
  tagsSection.innerHTML = `
    <div class="profile-tags-title">
      <i class="bi bi-tags-fill"></i>専門分野・キーワード
    </div>
    <div class="profile-tags-container" id="profile-tags-preview"></div>
  `;
  
  // プレビュー内の適切な位置（料金の後など）に挿入
  const insertAfter = previewContainer.querySelector('.profile-fee-container') || 
                      previewContainer.querySelector('.profile-description');
  
  if (insertAfter && insertAfter.nextSibling) {
    previewContainer.insertBefore(tagsSection, insertAfter.nextSibling);
  } else {
    // 挿入位置が見つからない場合は最後に追加
    previewContainer.appendChild(tagsSection);
  }
  
  // 初期表示用のタグを設定
  updateProfileTagsPreview();
}

/**
 * タグフィルター検索UI要素を追加
 */
function addSearchFilterUI() {
  // フィルター用UIを挿入する場所を特定
  const targetContainer = document.querySelector('.search-filter-container') || 
                          document.querySelector('.guide-cards-container');
  
  if (!targetContainer) return;
  
  // すでにフィルターコンテナがある場合は何もしない
  if (document.getElementById('tag-filter-container')) return;
  
  // タグフィルターコンテナ作成
  const filterContainer = document.createElement('div');
  filterContainer.id = 'tag-filter-container';
  filterContainer.className = 'tag-filter-container';
  
  // フィルター内容
  filterContainer.innerHTML = `
    <div class="tag-filter-header">
      <div class="tag-filter-title">
        <i class="bi bi-funnel-fill"></i>キーワードで絞り込み
      </div>
      <button type="button" class="tag-filter-clear" id="clear-tag-filters">
        <i class="bi bi-x-circle"></i>クリア
      </button>
    </div>
    <div class="tag-filter-chips" id="tag-filter-chips">
      <div class="filter-chip" data-filter="night">
        <i class="bi bi-moon-stars-fill"></i>ナイトツアー
      </div>
      <div class="filter-chip" data-filter="food">
        <i class="bi bi-cup-hot-fill"></i>グルメ
      </div>
      <div class="filter-chip" data-filter="photo">
        <i class="bi bi-camera-fill"></i>写真スポット
      </div>
      <div class="filter-chip" data-filter="cooking">
        <i class="bi bi-egg-fried"></i>料理
      </div>
      <div class="filter-chip" data-filter="activity">
        <i class="bi bi-bicycle"></i>アクティビティ
      </div>
    </div>
  `;
  
  // 検索フィルターUI挿入
  if (targetContainer.querySelector('.guide-search-bar')) {
    // 検索バーの後に挿入
    targetContainer.insertBefore(filterContainer, targetContainer.querySelector('.guide-search-bar').nextSibling);
  } else {
    // または先頭に挿入
    targetContainer.insertBefore(filterContainer, targetContainer.firstChild);
  }
}

/**
 * タグ要素を作成
 */
function createTagElement(tagData) {
  const tag = document.createElement('div');
  tag.className = 'guide-tag';
  tag.dataset.tagType = tagData.type || 'preset';
  tag.dataset.tagValue = tagData.value || '';
  
  // タグの色とアイコンをタイプに基づいて設定
  const iconClass = getTagIcon(tagData.value);
  const tagColor = getTagColor(tagData.value);
  
  tag.innerHTML = `
    <i class="bi bi-${iconClass}" style="color: ${tagColor};"></i>
    <span>${tagData.label}</span>
  `;
  
  return tag;
}

/**
 * タグのアイコンを取得
 */
function getTagIcon(tagValue) {
  const iconMap = {
    'night': 'moon-stars-fill',
    'food': 'cup-hot-fill',
    'photo': 'camera-fill',
    'cooking': 'egg-fried',
    'activity': 'bicycle'
  };
  
  return iconMap[tagValue] || 'tag-fill';
}

/**
 * タグの色を取得
 */
function getTagColor(tagValue) {
  const colorMap = {
    'night': '#3f51b5',
    'food': '#e65100',
    'photo': '#00838f',
    'cooking': '#e65100',
    'activity': '#558b2f'
  };
  
  return colorMap[tagValue] || '#6c757d';
}

/**
 * カード用のサンプルタグを生成（実際はサーバーからデータを取得）
 */
function getSampleTagsForCard(card) {
  // 実際のアプリケーションでは、各ガイドカードのデータ属性やAPIからタグ情報を取得します
  // ここではデモ目的でランダムなタグを返します
  
  const allTags = [
    { value: 'night', label: 'ナイトツアー', type: 'preset' },
    { value: 'food', label: 'グルメ', type: 'preset' },
    { value: 'photo', label: '写真スポット', type: 'preset' },
    { value: 'cooking', label: '料理', type: 'preset' },
    { value: 'activity', label: 'アクティビティ', type: 'preset' }
  ];
  
  // カードの内容に基づいて関連タグを特定する擬似ロジック
  const cardText = card.textContent.toLowerCase();
  const matchingTags = [];
  
  // カードテキストに特定のキーワードが含まれていればタグを追加
  if (cardText.includes('夜') || cardText.includes('ナイト')) {
    matchingTags.push(allTags.find(tag => tag.value === 'night'));
  }
  
  if (cardText.includes('料理') || cardText.includes('食事') || cardText.includes('グルメ')) {
    matchingTags.push(allTags.find(tag => tag.value === 'food'));
  }
  
  if (cardText.includes('写真') || cardText.includes('カメラ')) {
    matchingTags.push(allTags.find(tag => tag.value === 'photo'));
  }
  
  if (cardText.includes('アクティビティ') || cardText.includes('体験')) {
    matchingTags.push(allTags.find(tag => tag.value === 'activity'));
  }
  
  // 最低1つのタグを返すための処理
  if (matchingTags.length === 0) {
    // ランダムにサンプルタグを1つ選択
    const randomIndex = Math.floor(Math.random() * allTags.length);
    matchingTags.push(allTags[randomIndex]);
  }
  
  return matchingTags.filter(tag => tag); // undefinedを除外
}

/**
 * タグフィルターイベントのセットアップ
 */
function setupTagFilterEvents() {
  // フィルターチップクリックイベント
  const filterChips = document.querySelectorAll('.filter-chip');
  filterChips.forEach(chip => {
    // すでに設定されているイベントリスナーを削除（重複防止）
    const oldClone = chip.cloneNode(true);
    chip.parentNode.replaceChild(oldClone, chip);
    
    // 新しいイベントリスナーを追加
    oldClone.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // アクティブ状態をトグル
      this.classList.toggle('active');
      
      // クリックフィードバックを追加（特にactivityフィルターの場合）
      const isActivity = this.dataset.filter === 'activity';
      if (isActivity) {
        // アクティビティボタン専用の強調エフェクト
        this.style.transform = 'scale(1.05)';
        setTimeout(() => {
          this.style.transform = '';
        }, 200);
      }
      
      console.log('フィルターチップクリック:', this.dataset.filter, this.classList.contains('active'));
      
      // フィルターを適用
      applyTagFilters();
      
      // クリックイベントがバブルしないようにする
      return false;
    });
  });
  
  // フィルタークリアボタン
  const clearButton = document.getElementById('clear-tag-filters');
  if (clearButton) {
    clearButton.addEventListener('click', function() {
      // すべてのフィルターを非アクティブ化
      const activeChips = document.querySelectorAll('.filter-chip.active');
      activeChips.forEach(chip => chip.classList.remove('active'));
      applyTagFilters();
    });
  }
}

/**
 * タグフィルターを適用
 */
function applyTagFilters() {
  // アクティブなフィルターを取得
  const activeFilters = Array.from(document.querySelectorAll('.filter-chip.active'))
                            .map(chip => chip.dataset.filter);
  
  // すべてのガイドカードを取得
  const guideCards = document.querySelectorAll('.guide-card');
  
  // フィルターが選択されていない場合はすべて表示
  if (activeFilters.length === 0) {
    guideCards.forEach(card => {
      card.style.display = '';
      card.classList.remove('card-filtered-out');
    });
    return;
  }
  
  // 各カードをフィルタリング
  guideCards.forEach(card => {
    // カード内のタグを取得
    const cardTags = Array.from(card.querySelectorAll('.guide-tag'))
                          .map(tag => tag.dataset.tagValue);
    
    // カードタグとフィルターの重複をチェック
    const matchesFilter = activeFilters.some(filter => cardTags.includes(filter));
    
    // フィルター一致するカードのみ表示
    if (matchesFilter) {
      card.style.display = '';
      card.classList.remove('card-filtered-out');
      // 一致したタグをハイライト
      highlightMatchingTags(card, activeFilters);
    } else {
      card.style.display = 'none';
      card.classList.add('card-filtered-out');
    }
  });
  
  // フィルター結果メッセージを表示
  updateFilterResultMessage(activeFilters);
}

/**
 * 一致するタグをハイライト表示
 */
function highlightMatchingTags(card, activeFilters) {
  const tags = card.querySelectorAll('.guide-tag');
  tags.forEach(tag => {
    if (activeFilters.includes(tag.dataset.tagValue)) {
      tag.classList.add('tag-highlighted');
    } else {
      tag.classList.remove('tag-highlighted');
    }
  });
}

/**
 * フィルター結果メッセージを更新
 */
function updateFilterResultMessage(activeFilters) {
  // すでにメッセージがあれば削除
  const existingMessage = document.querySelector('.filter-result-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // アクティブなフィルターがなければ何もしない
  if (activeFilters.length === 0) {
    return;
  }
  
  // 表示中ガイドカード数を取得
  const visibleCards = document.querySelectorAll('.guide-card:not(.card-filtered-out)');
  const totalCards = document.querySelectorAll('.guide-card');
  
  // メッセージ要素作成
  const message = document.createElement('div');
  message.className = 'filter-result-message';
  
  // フィルターラベル作成
  const filterLabels = activeFilters.map(filter => {
    const filterChip = document.querySelector(`.filter-chip[data-filter="${filter}"]`);
    return filterChip ? filterChip.textContent.trim() : filter;
  });
  
  // メッセージテキスト
  message.innerHTML = `
    <i class="bi bi-info-circle-fill"></i>
    <span>"${filterLabels.join('", "')}" タグで絞り込み: ${visibleCards.length}/${totalCards.length} 件表示中</span>
  `;
  
  // フィルターコンテナの後に挿入
  const filterContainer = document.getElementById('tag-filter-container');
  if (filterContainer && filterContainer.nextSibling) {
    filterContainer.parentNode.insertBefore(message, filterContainer.nextSibling);
  } else if (filterContainer) {
    filterContainer.parentNode.appendChild(message);
  }
}

/**
 * 専門分野変更時のプレビュー更新リスナーを設定
 */
function setupTagPreviewUpdateListener() {
  // プレビューの初期更新
  updateProfileTagsPreview();
  
  // チェックボックス変更イベント
  document.querySelectorAll('.interest-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      updateProfileTagsPreview();
    });
  });
  
  // カスタムタグ追加・削除イベントリスナー
  // interestsStateの変更を監視するMutationObserverを使用できないため
  // セレクター内の特定のイベントをトリガーにする
  
  // カスタムタグ入力欄のイベント
  const tagInput = document.getElementById('new-custom-tag');
  if (tagInput) {
    tagInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        // Enterキー押下時に少し遅延してプレビュー更新
        setTimeout(updateProfileTagsPreview, 100);
      }
    });
  }
  
  // 追加ボタンのイベント
  const addButton = document.getElementById('add-custom-tag-btn');
  if (addButton) {
    addButton.addEventListener('click', function() {
      setTimeout(updateProfileTagsPreview, 100);
    });
  }
  
  // 選択中タグエリアのクリックイベント（削除ボタン等）
  const selectedTagsContainer = document.getElementById('selected-tags-preview');
  if (selectedTagsContainer) {
    selectedTagsContainer.addEventListener('click', function(e) {
      if (e.target.closest('.selected-tag-remove')) {
        setTimeout(updateProfileTagsPreview, 100);
      }
    });
  }
}

/**
 * プロフィールのタグプレビューを更新
 */
function updateProfileTagsPreview() {
  const tagsContainer = document.getElementById('profile-tags-preview');
  if (!tagsContainer) return;
  
  // 既存のタグをクリア
  tagsContainer.innerHTML = '';
  
  // 選択されているタグを収集
  const selectedTags = [];
  
  // チェックボックスから取得
  document.querySelectorAll('.interest-checkbox:checked').forEach(checkbox => {
    selectedTags.push({
      value: checkbox.value,
      label: checkbox.nextElementSibling.textContent.trim(),
      type: 'preset'
    });
  });
  
  // カスタムタグから取得（interestsStateオブジェクトから）
  if (window.interestsState && window.interestsState.customTags) {
    window.interestsState.customTags.forEach(tagText => {
      selectedTags.push({
        value: 'custom:' + tagText,
        label: tagText,
        type: 'custom'
      });
    });
  }
  
  // タグが見つからない場合のプレースホルダー
  if (selectedTags.length === 0) {
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'profile-tags-empty';
    emptyMessage.innerHTML = '専門分野や興味を追加すると、ここに表示されます';
    tagsContainer.appendChild(emptyMessage);
    return;
  }
  
  // タグを追加
  selectedTags.forEach(tag => {
    const tagElement = createProfileTagElement(tag);
    tagsContainer.appendChild(tagElement);
  });
}

/**
 * プロフィールプレビュー用のタグ要素を作成
 */
function createProfileTagElement(tagData) {
  const tag = document.createElement('div');
  tag.className = 'profile-tag';
  tag.dataset.tagType = tagData.type || 'preset';
  tag.dataset.tagValue = tagData.value || '';
  
  // タグの色とアイコンをタイプに基づいて設定
  let iconClass, tagColor;
  
  if (tagData.type === 'custom') {
    iconClass = 'bookmark-fill';
    tagColor = '#ff9800';
  } else {
    iconClass = getTagIcon(tagData.value);
    tagColor = getTagColor(tagData.value);
  }
  
  tag.innerHTML = `
    <i class="bi bi-${iconClass}" style="color: ${tagColor};"></i>
    <span>${tagData.label}</span>
  `;
  
  return tag;
}

/**
 * タグ表示用スタイルを注入
 */
function injectTagStyles() {
  // すでにスタイルが適用されている場合は注入しない
  if (document.getElementById('guide-tags-styles')) {
    return;
  }
  
  const styleElement = document.createElement('style');
  styleElement.id = 'guide-tags-styles';
  styleElement.innerHTML = `
    /* ガイドカードのタグスタイル */
    .guide-tags-container {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin: 8px 0 4px;
    }
    
    .guide-tag {
      display: inline-flex;
      align-items: center;
      padding: 3px 8px;
      background-color: rgba(0, 0, 0, 0.04);
      border-radius: 16px;
      font-size: 12px;
      color: #444;
      transition: all 0.2s ease;
    }
    
    .guide-tag i {
      margin-right: 4px;
      font-size: 11px;
    }
    
    .guide-tag.tag-highlighted {
      background-color: rgba(0, 119, 204, 0.1);
      box-shadow: 0 0 0 1px rgba(0, 119, 204, 0.2);
      transform: translateY(-1px);
    }
    
    /* タグフィルターコンテナ */
    .tag-filter-container {
      margin: 16px 0;
      padding: 12px 16px;
      background-color: #f8f9fa;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .tag-filter-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .tag-filter-title {
      font-weight: 600;
      color: #495057;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .tag-filter-title i {
      color: #0077cc;
    }
    
    .tag-filter-clear {
      display: flex;
      align-items: center;
      gap: 4px;
      background: none;
      border: none;
      font-size: 12px;
      color: #6c757d;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      transition: all 0.2s ease;
    }
    
    .tag-filter-clear:hover {
      background-color: rgba(108, 117, 125, 0.1);
      color: #495057;
    }
    
    .tag-filter-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    
    .filter-chip {
      display: inline-flex;
      align-items: center;
      padding: 6px 12px;
      background-color: white;
      border: 1px solid #dee2e6;
      border-radius: 30px;
      font-size: 13px;
      color: #495057;
      cursor: pointer;
      transition: all 0.2s ease;
      user-select: none;
    }
    
    .filter-chip i {
      margin-right: 6px;
    }
    
    .filter-chip:hover {
      background-color: #f1f3f5;
      border-color: #ced4da;
    }
    
    .filter-chip.active {
      background-color: #e1f5fe;
      border-color: #0077cc;
      color: #0077cc;
      font-weight: 500;
    }
    
    .filter-result-message {
      margin: 10px 0;
      padding: 10px 12px;
      background-color: #e1f5fe;
      border-radius: 6px;
      font-size: 13px;
      color: #0277bd;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .filter-result-message i {
      color: #0277bd;
      font-size: 14px;
    }
    
    /* プロフィールページのタグスタイル */
    .profile-tags-section {
      margin: 16px 0;
      padding: 10px 0;
      border-top: 1px solid #eeeeee;
    }
    
    .profile-tags-title {
      font-weight: 600;
      font-size: 14px;
      color: #333;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .profile-tags-title i {
      color: #0077cc;
      font-size: 14px;
    }
    
    .profile-tags-container {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    
    .profile-tag {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      background-color: #f8f9fa;
      border-radius: 16px;
      font-size: 13px;
      color: #444;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }
    
    .profile-tag i {
      margin-right: 4px;
      font-size: 12px;
    }
    
    .profile-tags-empty {
      color: #6c757d;
      font-style: italic;
      font-size: 13px;
      padding: 6px 0;
    }
    
    /* アニメーション効果 */
    @keyframes tagAppear {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .guide-tag, .profile-tag {
      animation: tagAppear 0.3s ease-out forwards;
    }
    
    /* レスポンシブ対応 */
    @media (max-width: 767px) {
      .tag-filter-chips {
        gap: 6px;
      }
      
      .filter-chip {
        padding: 4px 10px;
        font-size: 12px;
      }
      
      .guide-tag {
        font-size: 11px;
        padding: 2px 6px;
      }
      
      .profile-tag {
        font-size: 12px;
        padding: 3px 8px;
      }
    }
  `;
  
  document.head.appendChild(styleElement);
}