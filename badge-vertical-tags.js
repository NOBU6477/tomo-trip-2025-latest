/**
 * 狭いスペースに最適化したバッジ型縦置きタグ表示
 * プロフィールプレビューの下部に配置する専用デザイン
 * 左上のプロフィール写真下のタグは表示しない
 */
(function() {
  console.log('バッジ型縦置きタグを初期化します（プレビューのみ）');
  
  // グローバルスコープに関数を公開（他スクリプトから呼び出せるように）
  window.initializeBadgeTags = initializeBadgeTags;
  window.updateBadgeTags = updateBadgeTags;
  
  // スタイル追加
  const style = document.createElement('style');
  style.textContent = `
    /* バッジ型タグコンテナ */
    .badge-tags-container {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin: 8px 0;
      padding-top: 8px;
      border-top: 1px solid rgba(0,0,0,0.1);
      width: 100%;
      overflow: hidden;
    }
    
    /* タグラベル */
    .badge-tags-label {
      font-size: 12px;
      font-weight: 500;
      color: #555;
      margin-bottom: 2px;
    }
    
    /* 個別タグ */
    .badge-tag {
      display: inline-flex;
      align-items: center;
      background-color: #f8f9fa;
      color: #333;
      font-size: 11px;
      padding: 4px 10px;
      border-radius: 50px;
      margin-right: 4px;
      margin-bottom: 6px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      border: 1px solid rgba(0,0,0,0.08);
    }
    
    /* セッションエリアの青背景の削除 - より強力なセレクタで上書き */
    .card,
    .card-body,
    .profile-preview-container,
    .profile-card,
    .preview-card,
    .card-content,
    .profile-tags,
    .profile-tags-container,
    div[class*="tags-"],
    div[class*="tag-"],
    div[class*="-tags"],
    div[class*="-tag"],
    .profile-preview-container div,
    .card-body > div,
    .blue-background,
    .bg-light-blue,
    [class*="tags-section"],
    .profile-section,
    .tags-section,
    .keywords-section {
      background-color: transparent !important;
    }
    
    /* ガイドキーワード・タグの青背景を強制的に消去 */
    .guide-keywords, 
    .guide-tags, 
    .profile-tags, 
    .profile-tags-section, 
    .profile-tags-container,
    .profile-preview-section,
    [class*="tags-section"],
    .profile-tags-title,
    .badge-tags-label,
    .tags-title,
    .card .profile-tags {
      background-color: transparent !important;
      box-shadow: none !important;
      border: none !important;
      padding: 5px 0 !important;
      margin: 0 !important;
      border-radius: 0 !important;
    }
    
    /* プロフィールプレビュー用のタグコンテナの上書き */
    .profile-preview-container .profile-tags-container {
      background-color: transparent !important;
      display: flex !important;
      flex-direction: column !important;
      padding: 0 !important;
      margin: 8px 0 !important;
      border-radius: 0 !important;
      box-shadow: none !important;
    }
    
    /* 青背景対策 - すべてのタグ関連コンテナのスタイルを上書き */
    .profile-tag,
    .profile-tags-container,
    .badge-tags-container,
    [class*="-tags-"],
    .profile-preview-container [class*="-tags-"],
    .profile-tags-section,
    .profile-view-tags,
    .profile-preview-section,
    .card-body .profile-tags,
    .card .profile-tags {
      background-color: transparent !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      border: none !important;
      padding: 0 !important;
    }
    
    /* 専門分野・キーワードラベルの青背景を消す */
    .profile-tags-title,
    .badge-tags-label,
    .profile-tags-section,
    .profile-preview-container .profile-tags-section {
      background-color: transparent !important;
      padding: 0 !important;
      margin-bottom: 6px !important;
      box-shadow: none !important;
    }
    
    /* 個別タグの背景設定（青背景ではなく薄いグレー） */
    .profile-tag {
      background-color: #f8f9fa !important;
      border: 1px solid rgba(0,0,0,0.08) !important;
      display: inline-flex !important;
      margin-bottom: 4px !important;
      padding: 3px 8px !important;
      border-radius: 50px !important;
    }
    
    /* モバイル向け */
    @media (max-width: 767px) {
      .mobile-badge-container {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 0.35rem;
      }
      
      .mobile-badge-container .badge-tag {
        font-size: 0.8rem;
        padding: 0.3rem 0.5rem;
        margin: 0.15rem 0;
      }
    }
    
    /* タグアイコン */
    .badge-tag-icon {
      margin-right: 4px;
      font-size: 10px;
    }
    
    /* カテゴリー別色分け */
    .tag-tour { background-color: #e3f2fd; color: #0d47a1; }
    .tag-food { background-color: #e8f5e9; color: #1b5e20; }
    .tag-culture { background-color: #fff3e0; color: #e65100; }
    .tag-activity { background-color: #e0f7fa; color: #006064; }
    .tag-nature { background-color: #f1f8e9; color: #33691e; }
    .tag-shopping { background-color: #fce4ec; color: #880e4f; }
    .tag-custom { background-color: #f3e5f5; color: #4a148c; }
    .tag-general { background-color: #eeeeee; color: #424242; }
  `;
  document.head.appendChild(style);
  
  // アイコンマッピング
  const CATEGORY_ICONS = {
    'tour': 'map',
    'food': 'cup-hot',
    'culture': 'book',
    'activity': 'person-walking',
    'nature': 'tree',
    'shopping': 'bag',
    'custom': 'bookmark-star',
    'general': 'tag'
  };
  
  // 初期化
  window.addEventListener('DOMContentLoaded', initializeBadgeTags);
  // 複数回の初期化を試行して完全な適用を保証
  setTimeout(initializeBadgeTags, 500);
  setTimeout(initializeBadgeTags, 1000);
  setTimeout(initializeBadgeTags, 2000);
  // ページローディング状態を確認
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initializeBadgeTags();
  }
  
  // 既存のプロフィールプレビューを強制的に修正
  function forceClearPreviewStyles() {
    // プレビュー専用の追加スタイルを注入
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      /* 強制的なプレビュー修正 */
      .profile-preview-container {
        padding-top: 10px !important;
        background-color: transparent !important;
      }
      
      /* プレビュー内部のタグ青背景を強制的に消去 */
      .profile-preview-container .profile-tags,
      .profile-preview-container .profile-tags-container,
      .profile-preview-container [class*="tag"],
      .profile-preview-container [class*="tags"],
      .profile-card,
      .profile-card div,
      .profile-card .card-body,
      .card-body .section,
      .card,
      #profile-preview,
      .card-body .row,
      .card-body .col,
      .card-body > div,
      [class*="bg-"],
      [class*="background-"],
      .session-info,
      .session-details,
      .price-display,
      .price-tag,
      .session-price {
        background-color: transparent !important;
        box-shadow: none !important;
        border: none !important;
      }
      
      /* セッションセクション全体に強制適用 */
      .profile-tags-section,
      .keyword-section,
      .tag-section,
      .profile-preview-section,
      .card .section,
      .card-body .row,
      [class*="blue-bg"],
      [class*="bg-blue"] {
        background-color: transparent !important;
        padding: 0 !important;
        margin: 5px 0 !important;
      }
      
      /* セッション下部のキーワードセクション */
      .keyword-section {
        margin-top: 15px !important;
        padding-top: 15px !important;
        border-top: 1px solid rgba(0,0,0,0.1) !important;
        background-color: transparent !important;
        width: 100% !important;
        display: block !important;
        clear: both !important;
      }
      
      /* バッジコンテナを縦に配置 */
      .badge-tags-container {
        display: flex !important;
        flex-direction: column !important;
        width: 100% !important;
        padding: 0 !important;
        background-color: transparent !important;
      }
      
      /* バッジラベルのスタイル */
      .badge-tags-label {
        font-weight: 600 !important;
        margin-bottom: 5px !important;
        font-size: 14px !important;
        color: #333 !important;
        background-color: transparent !important;
      }
      
      /* 個別タグの修正 - 横一列ではなく縦に並べる */
      .badge-tag {
        display: inline-flex !important;
        background-color: #f8f9fa !important;
        border: 1px solid rgba(0,0,0,0.08) !important;
        border-radius: 50px !important;
        padding: 4px 10px !important;
        margin-bottom: 4px !important;
        margin-right: 4px !important;
        width: auto !important;
        align-items: center !important;
        font-size: 12px !important;
        color: #333 !important;
      }
      
      /* スマホ表示のタグスタイル */
      @media (max-width: 767px) {
        .keyword-section {
          margin-top: 10px !important;
          padding-top: 10px !important;
        }
        
        .badge-tag {
          padding: 3px 8px !important;
          margin-bottom: 3px !important;
          font-size: 11px !important;
        }
      }
    `;
    document.head.appendChild(styleElement);
    
    // 既存のプレビュータグコンテナをリセット
    const allPreviewTags = document.querySelectorAll('.profile-preview-container .profile-tags, .card-body .profile-tags, .profile-tags-section');
    allPreviewTags.forEach(el => {
      if (el && el.style) {
        el.style.backgroundColor = 'transparent';
        el.style.boxShadow = 'none';
        el.style.border = 'none';
        el.style.padding = '0';
      }
    });
    
    // 青背景の要素を強制的に透明に
    const blueElements = document.querySelectorAll('.card, .card-body, .profile-preview-container, .section');
    blueElements.forEach(el => {
      if (el && el.style) {
        el.style.backgroundColor = 'transparent';
      }
    });
    
    // 1秒ごとにバッジタグ更新を実行
    setInterval(window.updateBadgeTags, 1000);
  }
  
  // スタイル強制修正を実行
  setTimeout(forceClearPreviewStyles, 800);
  
  // タグ表示の初期化
  function initializeBadgeTags() {
    console.log('バッジタグを初期化しています...');
    
    // 既存のタグは全て削除
    clearAllExistingTags();
    
    // 新しいバッジタグを表示
    updateBadgeTags();
    
    // タグ変更のリスナー
    setupTagChangeListeners();
  }
  
  // 既存の全タグをクリア
  function clearAllExistingTags() {
    const existingContainers = document.querySelectorAll('.badge-tags-container');
    for (const container of existingContainers) {
      if (container) {
        try {
          container.remove();
        } catch (e) {
          console.error('タグコンテナの削除に失敗:', e);
          container.style.display = 'none';
        }
      }
    }
  }
  
  // バッジコンテナを作成
  function createBadgeContainer(previewCard) {
    if (!previewCard) {
      console.error('プレビューカードが見つからないためタグコンテナを作成できません');
      return null;
    }
    
    try {
      const container = document.createElement('div');
      container.className = 'badge-tags-container';
      
      // タイトルラベル
      const label = document.createElement('div');
      label.className = 'badge-tags-label';
      label.textContent = '専門分野・キーワード';
      container.appendChild(label);
      
      // セッション情報の下に専用のタグセクションを追加
      const sessionSection = previewCard.querySelector('.card-body .row') || 
                             previewCard.querySelector('.card-body .session-info') ||
                             previewCard.querySelector('.session-details');
      
      if (sessionSection) {
        // 料金表示を確認
        const priceDisplay = previewCard.querySelector('.card-body .price-display') ||
                            previewCard.querySelector('.price-tag') ||
                            previewCard.querySelector('.session-price');
        
        // 専用のセクションを作成
        const keywordSection = document.createElement('div');
        keywordSection.className = 'keyword-section mt-3';
        keywordSection.style.borderTop = '1px solid rgba(0,0,0,0.1)';
        keywordSection.style.paddingTop = '10px';
        keywordSection.style.marginTop = '10px';
        
        // セクションにコンテナを追加
        keywordSection.appendChild(container);
        
        // 料金表示の後にセクションを挿入
        if (priceDisplay) {
          priceDisplay.parentNode.insertBefore(keywordSection, priceDisplay.nextSibling);
          console.log('料金表示の後にキーワードセクションを挿入しました');
        } else {
          // セッションの後に追加
          const parent = sessionSection.parentNode;
          parent.appendChild(keywordSection);
          console.log('セッション情報の後にキーワードセクションを追加しました');
        }
        
        return container;
      }
      
      // カードボディの最下部
      const cardBody = previewCard.querySelector('.card-body');
      if (cardBody) {
        // 専用のセクションを作成
        const keywordSection = document.createElement('div');
        keywordSection.className = 'keyword-section mt-3';
        keywordSection.style.borderTop = '1px solid rgba(0,0,0,0.1)';
        keywordSection.style.paddingTop = '10px';
        keywordSection.style.marginTop = '10px';
        
        // セクションにコンテナを追加して本体に挿入
        keywordSection.appendChild(container);
        cardBody.appendChild(keywordSection);
        
        console.log('カードボディの最下部にキーワードセクションを追加しました');
        return container;
      }
      
      // プレビューコンテナの場合
      if (previewCard.classList.contains('profile-preview-container')) {
        const keywordSection = document.createElement('div');
        keywordSection.className = 'keyword-section mt-3';
        keywordSection.style.borderTop = '1px solid rgba(0,0,0,0.1)';
        keywordSection.style.paddingTop = '10px';
        keywordSection.style.marginTop = '10px';
        
        keywordSection.appendChild(container);
        previewCard.appendChild(keywordSection);
        console.log('プレビューコンテナにキーワードセクションを追加しました');
        return container;
      }
      
      // 最後の手段 - カード自体に直接追加
      previewCard.appendChild(container);
      console.log('カード自体にタグコンテナを直接追加しました');
      return container;
    } catch (e) {
      console.error('タグコンテナ作成中にエラーが発生しました:', e);
      return null;
    }
  }
  
  // バッジを更新
  function updateBadgesInContainer(container, tags) {
    if (!container) {
      console.error('タグコンテナが見つからないためバッジを更新できません');
      return;
    }
    
    try {
      // タイトル以外のコンテンツをクリア
      const label = container.querySelector('.badge-tags-label');
      container.innerHTML = '';
      
      // ラベルを再追加
      if (label) {
        container.appendChild(label);
      } else {
        // ラベルがなければ新規作成
        const newLabel = document.createElement('div');
        newLabel.className = 'badge-tags-label';
        newLabel.textContent = '専門分野・キーワード';
        container.appendChild(newLabel);
      }
      
      // 各タグをバッジとして追加
      tags.forEach(tag => {
        if (!tag || !tag.label) return;
        
        const badge = document.createElement('div');
        badge.className = `badge-tag tag-${tag.category || 'general'}`;
        
        try {
          // アイコン
          const iconName = CATEGORY_ICONS[tag.category] || CATEGORY_ICONS.general;
          const icon = document.createElement('span');
          icon.className = 'badge-tag-icon';
          icon.innerHTML = `<i class="bi bi-${iconName}"></i>`;
          
          // テキスト
          const text = document.createElement('span');
          text.textContent = tag.label;
          
          badge.appendChild(icon);
          badge.appendChild(text);
          container.appendChild(badge);
        } catch (e) {
          console.error('タグバッジ作成中にエラーが発生しました:', e);
        }
      });
      
      // スマホ向けにコンテナを最適化
      optimizeContainerForMobile(container);
    } catch (e) {
      console.error('バッジ更新中にエラーが発生しました:', e);
    }
  }
  
  // スマホ向けに表示を最適化
  function optimizeContainerForMobile(container) {
    try {
      // スマホかどうかを判定
      const isMobile = window.innerWidth < 768;
      
      if (isMobile) {
        // スマホ向けのクラスを追加
        container.classList.add('mobile-badge-container');
        
        // スマホ向けに横スクロールを可能にする
        container.style.display = 'flex';
        container.style.flexWrap = 'wrap';
        container.style.gap = '0.35rem';
        
        // 子要素のスタイル最適化
        const badges = container.querySelectorAll('.badge-tag');
        badges.forEach(badge => {
          badge.style.fontSize = '0.8rem';
          badge.style.padding = '0.3rem 0.5rem';
          badge.style.margin = '0.15rem 0';
        });
      }
    } catch (e) {
      console.error('モバイル最適化中にエラーが発生しました:', e);
    }
  }
  
  // プロフィールプレビューカードを見つける（右側のプレビューのみ）
  function findProfilePreviewCard() {
    try {
      // まず最も確実に見つかるパターン - profile-preview-containerクラスを持つ要素
      const directPreviewContainer = document.querySelector('.profile-preview-container');
      if (directPreviewContainer) {
        console.log('プレビューコンテナを直接見つけました');
        return directPreviewContainer;
      }
    
      // プレビューヘッダーとカードを探す
      const previewHeaders = document.querySelectorAll('.card-header');
      for (const header of previewHeaders) {
        if (header && header.textContent && (header.textContent.includes('プレビュー') || header.textContent.includes('Preview'))) {
          const card = header.closest('.card');
          if (card) {
            console.log('プレビューヘッダーからカードを見つけました');
            return card;
          }
        }
      }
      
      // 青いヘッダーのプレビューカードを探す
      const blueHeaders = document.querySelectorAll('.card-header');
      for (const header of blueHeaders) {
        if (!header) continue;
        try {
          const style = window.getComputedStyle(header);
          if (
            (style.backgroundColor.includes('rgb(0, 123, 255)') || 
             style.backgroundColor.includes('rgb(13, 110, 253)')) &&
            (header.textContent && (header.textContent.includes('プロフィール') || 
                                    header.textContent.includes('Profile')))
          ) {
            const card = header.closest('.card');
            
            // スマホでは.col-md-12 col-lg-4クラスがあるか確認
            if (card) {
              console.log('青いヘッダーからカードを見つけました');
              return card;
            }
          }
        } catch (e) {
          console.error('ヘッダーのスタイル取得エラー:', e);
        }
      }
      
      // プロフィールらしいカードを探す（スマホ対応）
      const allCards = document.querySelectorAll('.card');
      for (const card of allCards) {
        if (!card) continue;
        
        // プロフィール写真を含むカードを探す
        const hasProfileImage = card.querySelector('img.rounded-circle') || 
                              card.querySelector('img.profile-image') || 
                              card.querySelector('.guide-preview-photo img');
                              
        if (hasProfileImage) {
          console.log('プロフィール写真からカードを見つけました');
          return card;
        }
        
        // ガイド名らしい要素を含むか
        const hasGuideName = card.querySelector('.guide-preview-name') || 
                           card.querySelector('.profile-name') ||
                           card.querySelector('.guide-name');
        
        if (hasGuideName) {
          console.log('ガイド名からカードを見つけました');
          return card;
        }
      }
      
      // 右側のカラムだけを探す（スマホではcol-md-12 col-lg-4になっている可能性がある）
      const rightColumns = document.querySelectorAll('.col-lg-4, .col-xl-4, .col-md-12.col-lg-4, .profile-preview');
      for (const col of rightColumns) {
        if (!col) continue;
        
        // 青いヘッダーのカードを探す
        const cards = col.querySelectorAll('.card');
        for (const card of cards) {
          if (card && card.querySelector('.card-header.bg-primary')) {
            console.log('右カラムの青ヘッダーカードを見つけました');
            return card;
          }
        }
        
        // なければ最初のカードを返す
        if (cards && cards.length > 0) {
          console.log('右カラムの最初のカードを見つけました');
          return cards[0];
        }
        
        // カードが見つからなければカラム自体を返す
        return col;
      }
    } catch (e) {
      console.error('プレビューカード検索中にエラーが発生しました:', e);
    }
    
    // それでも見つからない場合はプレビューっぽい要素を探す
    try {
      const fallbackElements = [
        document.querySelector('.profile-preview'),
        document.querySelector('.preview-card'),
        document.querySelector('[id*="preview"]'),
        document.querySelector('[class*="preview"]')
      ];
      
      for (const element of fallbackElements) {
        if (element) {
          console.log('フォールバック要素を見つけました');
          return element;
        }
      }
    } catch (e) {
      console.error('フォールバック検索中にエラーが発生しました:', e);
    }
    
    console.warn('プレビューカードが見つかりませんでした');
    return null;
  }
  
  // タグ変更監視
  function setupTagChangeListeners() {
    try {
      // インタレスト選択変更の監視
      const interests = document.querySelectorAll('input[type="checkbox"][id^="interest-"]');
      interests.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
          console.log('インタレスト変更を検出: タグを更新します');
          setTimeout(updateBadgeTags, 10);
          
          // 青背景を強制的に消去
          forceClearBlueBg();
        });
      });
      
      // 新UI用のタグ選択を監視
      const tagContainer = document.getElementById('selected-tags-preview');
      if (tagContainer) {
        // MutationObserverでタグコンテナの変更を監視
        const observer = new MutationObserver(() => {
          console.log('タグ選択コンテナの変更を検出: タグを更新します');
          setTimeout(updateBadgeTags, 10);
          
          // 青背景を強制的に消去
          forceClearBlueBg();
        });
        
        observer.observe(tagContainer, { childList: true, subtree: true });
      }
      
      // クリックイベントも監視（タグの選択/削除ボタンなど）
      document.addEventListener('click', function(e) {
        // チェックボックスやキーワード関連のクリックを検出して更新
        if (e.target.closest('.interests-preset-chip') || 
            e.target.closest('.selected-tag-remove') || 
            e.target.closest('.custom-chip-remove') ||
            e.target.closest('#add-custom-tag-btn')) {
          console.log('キーワード関連のクリックを検出: タグを更新します');
          setTimeout(() => {
            updateBadgeTags();
            forceClearBlueBg();
          }, 50);
        }
      });
      
      // 青背景を強制的に消去する関数
      function forceClearBlueBg() {
        // プレビューセクションの背景を強制的に透明に
        const sections = document.querySelectorAll(
          '.card, .card-body, .profile-tags-section, .profile-tags, .profile-preview-container, ' +
          '[class*="blue-bg"], [class*="bg-blue"], [class*="bg-primary"], [class*="blue-background"], ' +
          '.session-info, .session-details, .price-display, .price-tag, .session-price, ' +
          '.card-body .row, .card-body .col, .card-body > div'
        );
        
        sections.forEach(el => {
          if (el && el.style) {
            el.style.backgroundColor = 'transparent';
            el.style.boxShadow = 'none';
            el.style.border = 'none';
          }
        });
        
        // キーワードセクションがあるか確認し、なければ作成
        const previewCard = findProfilePreviewCard();
        if (previewCard) {
          let keywordSection = previewCard.querySelector('.keyword-section');
          if (!keywordSection) {
            updateBadgeTags(); // キーワードセクションを作成するために更新を実行
          }
        }
      }
      
      // 初期化時も背景クリア
      forceClearBlueBg();
      
      // 直接トリガーも定期的に実行（バックアップとして）
      setInterval(() => {
        updateBadgeTags();
        forceClearBlueBg();
      }, 1000);
    } catch (e) {
      console.error('タグ変更リスナー設定中にエラーが発生しました:', e);
    }
  }
  
  // バッジタグの更新 - グローバルアクセス用に公開
  window.updateBadgeTags = function() {
    try {
      // プレビューカードを取得
      const previewCard = findProfilePreviewCard();
      
      if (!previewCard) {
        console.warn('プレビューカードが見つからないためタグ更新をスキップします');
        return;
      }
      
      // 選択されたタグを取得
      const selectedTags = getSelectedTags();
      
      // 既存のバッジコンテナを探す
      let badgeContainer = previewCard.querySelector('.badge-tags-container');
      
      // なければ新規作成
      if (!badgeContainer) {
        badgeContainer = createBadgeContainer(previewCard);
      }
      
      // バッジを更新
      if (badgeContainer) {
        updateBadgesInContainer(badgeContainer, selectedTags);
      }
    } catch (e) {
      console.error('バッジタグ更新中にエラーが発生しました:', e);
    }
  }
  
  // 選択されたタグを取得
  function getSelectedTags() {
    const tags = [];
    
    try {
      // 新UIで選択中のタグを取得
      const selectedContainer = document.getElementById('selected-tags-preview');
      if (selectedContainer) {
        const selectedTags = selectedContainer.querySelectorAll('.selected-tag-preview:not(.removing)');
        
        selectedTags.forEach(tag => {
          const value = tag.dataset.value || '';
          const label = tag.querySelector('.selected-tag-text')?.textContent || '';
          
          if (label) {
            // カテゴリの特定
            let category = 'general';
            
            if (value.startsWith('custom:')) {
              category = 'custom';
            } else if (value) {
              category = value;
            }
            
            tags.push({
              value: value,
              label: label,
              category: category
            });
          }
        });
      }
      
      // 従来のチェックボックスからのフォールバック
      if (tags.length === 0) {
        const checkboxes = document.querySelectorAll('input[type="checkbox"][id^="interest-"]:checked');
        
        checkboxes.forEach(checkbox => {
          const value = checkbox.id.replace('interest-', '');
          const label = checkbox.nextElementSibling?.textContent?.trim() || value;
          
          tags.push({
            value: value,
            label: label,
            category: value
          });
        });
      }
      
      console.log('[badge-vertical-tags] 選択されているタグ:', tags.length > 0 ? tags.map(t => t.label) : 'なし');
    } catch (e) {
      console.error('タグ取得中にエラーが発生しました:', e);
    }
    
    return tags;
  }
})();