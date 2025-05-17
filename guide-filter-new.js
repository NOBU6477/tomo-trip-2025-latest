/**
 * 改良版ガイド検索リアルタイムフィルター機能
 * 
 * フィルターフォームの各要素の変更を監視し、
 * ガイドカードをリアルタイムでフィルタリングして表示します。
 * URLエンコード対応、北海道固有問題修正、一般的なフィルタリング性能の向上。
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('改良版フィルター機能の初期化を開始...');
  
  // フィルターフォームの要素を取得
  const locationFilter = document.getElementById('location-filter');
  const languageFilter = document.getElementById('language-filter');
  const feeFilter = document.getElementById('fee-filter');
  const keywordCheckboxes = document.querySelectorAll('.keyword-checkbox');
  const customKeywordInput = document.getElementById('keyword-filter-custom');
  const filterForm = document.getElementById('guide-filter-form');
  const resetButton = document.getElementById('reset-filters');
  const applyFilterButton = document.getElementById('apply-filters');
  
  // 結果表示用の要素
  const searchResultsCounter = document.getElementById('search-results-counter') || createResultCounter();
  const noResultsMessage = document.getElementById('no-results-message') || createNoResultsMessage();
  
  // 必要なコンポーネントがない場合は警告
  if (!filterForm) {
    console.warn('フィルターフォームが見つかりません。検索機能は無効です。');
    return;
  }
  
  // フィルターの変更イベントの設定
  function setupFilterEvents() {
    if (locationFilter) locationFilter.addEventListener('change', performFilter);
    if (languageFilter) languageFilter.addEventListener('change', performFilter);
    if (feeFilter) feeFilter.addEventListener('change', performFilter);
    
    // キーワードチェックボックスの変更を監視
    keywordCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', performFilter);
    });
    
    // カスタムキーワード入力フィールドの変更を監視
    if (customKeywordInput) {
      customKeywordInput.addEventListener('input', debounce(performFilter, 300));
    }
    
    // リセットボタンの処理
    if (resetButton) {
      resetButton.addEventListener('click', resetFilters);
    }
    
    // 検索ボタンイベント（明示的なフィルター適用）
    if (applyFilterButton) {
      applyFilterButton.addEventListener('click', function(e) {
        e.preventDefault(); // フォーム送信を防止
        performFilter();
      });
    }
    
    console.log('フィルターイベントを設定しました');
  }
  
  // フィルターのリセット処理
  function resetFilters() {
    console.log('フィルターをリセットします...');
    
    // フォームの値をリセット
    if (locationFilter) locationFilter.value = '';
    if (languageFilter) languageFilter.value = '';
    if (feeFilter) feeFilter.value = '';
    
    // キーワードのチェックを外す
    keywordCheckboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
    
    // カスタムキーワードをクリア
    if (customKeywordInput) {
      customKeywordInput.value = '';
    }
    
    // リセット後に検索を再実行
    setTimeout(performFilter, 50);
  }
  
  // 検索結果カウンターを作成
  function createResultCounter() {
    const counter = document.createElement('div');
    counter.id = 'search-results-counter';
    counter.className = 'alert alert-success fw-bold fs-5 text-center my-3';
    counter.textContent = 'ガイドを検索中...';
    
    const guidesSection = document.getElementById('guides');
    if (guidesSection) {
      const cardsContainer = guidesSection.querySelector('#guide-cards-container');
      if (cardsContainer) {
        cardsContainer.parentNode.insertBefore(counter, cardsContainer);
      }
    }
    
    return counter;
  }
  
  // 検索結果なしメッセージを作成
  function createNoResultsMessage() {
    const message = document.createElement('div');
    message.id = 'no-results-message';
    message.className = 'alert alert-info text-center my-4 d-none';
    message.textContent = '検索条件に一致するガイドが見つかりませんでした。条件を変更してお試しください。';
    
    const guidesContainer = document.getElementById('guide-cards-container');
    if (guidesContainer) {
      guidesContainer.parentNode.insertBefore(message, guidesContainer.nextSibling);
    }
    
    return message;
  }
  
  // ガイドカードから必要なデータを抽出してキャッシュ
  let cardsData = [];
  
  // ガイドカードデータを準備
  function prepareCardsData() {
    console.log('ガイドカードデータを準備しています...');
    const allGuideCards = document.querySelectorAll('.guide-card');
    
    if (allGuideCards.length === 0) {
      console.warn('ガイドカードが見つかりません。フィルター機能は限定的に動作します。');
    }
    
    cardsData = Array.from(allGuideCards).map(card => {
      // ガイドカードの要素を参照で保持
      const cardElement = card;
      const guideItem = card.closest('.guide-item');
      
      // 基本情報の取得
      let guideId = card.getAttribute('data-guide-id') || '';
      let location = '';
      let languages = '';
      let fee = 0;
      let keywords = '';
      
      // データ属性から情報を取得
      if (card.hasAttribute('data-location')) {
        location = card.getAttribute('data-location').toLowerCase();
      } else {
        // データ属性がない場合はDOM要素から取得（複数の方法で試みる）
        const locationEl = card.querySelector('.guide-location');
        if (locationEl) {
          location = locationEl.textContent.trim().toLowerCase();
          // データ属性を設定（後続の処理のため）
          card.setAttribute('data-location', location);
        } else {
          // 代替方法：地域情報が含まれているかもしれないp要素を探す
          const paragraphs = card.querySelectorAll('p');
          for (const p of paragraphs) {
            const text = p.textContent.trim();
            if (text.includes('北海道') || text.includes('札幌') || 
                text.includes('東京') || text.includes('県')) {
              location = text.toLowerCase();
              card.setAttribute('data-location', location);
              console.log(`代替方法で地域情報を取得: ID=${guideId}, 地域=${location}`);
              break;
            }
          }
        }
      }
      
      // ガイドカードに地域情報がない場合のフォールバック処理
      if (!location || location === '') {
        // ガイドカードのテキスト全体から地域情報を抽出する試み
        const cardText = card.textContent.trim();
        
        // 都道府県名のリスト
        const prefectures = [
          '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
          '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
          '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
          '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
          '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
          '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
          '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
        ];
        
        // 主要都市名
        const majorCities = [
          '札幌', '函館', '旭川', '釧路', '帯広', '小樽', '千歳', // 北海道
          '仙台', '金沢', '新潟', '富山', '高山', '名古屋', '京都',
          '大阪', '神戸', '広島', '福岡', '那覇'
        ];
        
        // 都道府県名から地域を検出
        for (const prefecture of prefectures) {
          if (cardText.includes(prefecture)) {
            location = prefecture;
            card.setAttribute('data-location', location);
            console.log(`都道府県名から地域を検出: ID=${guideId}, 地域=${location}`);
            break;
          }
        }
        
        // まだ地域情報がない場合は都市名から判定
        if (!location || location === '') {
          for (const city of majorCities) {
            if (cardText.includes(city)) {
              // 都市名から対応する都道府県情報を設定
              if (['札幌', '函館', '旭川', '釧路', '帯広', '小樽', '千歳'].includes(city)) {
                location = '北海道';
              } else if (city === '仙台') {
                location = '宮城県';
              } else if (city === '金沢') {
                location = '石川県';
              } else if (city === '新潟') {
                location = '新潟県';
              } else if (city === '富山') {
                location = '富山県';
              } else if (city === '高山') {
                location = '岐阜県';
              } else if (city === '名古屋') {
                location = '愛知県';
              } else if (city === '京都') {
                location = '京都府';
              } else if (city === '大阪') {
                location = '大阪府';
              } else if (city === '神戸') {
                location = '兵庫県';
              } else if (city === '広島') {
                location = '広島県';
              } else if (city === '福岡') {
                location = '福岡県';
              } else if (city === '那覇') {
                location = '沖縄県';
              }
              
              if (location) {
                card.setAttribute('data-location', location);
                console.log(`都市名から地域を検出: ID=${guideId}, 都市=${city}, 地域=${location}`);
                break;
              }
            }
          }
        }
      }
      
      // 特定のカードIDがDOMに北海道タグが含まれているものを確保（データ整合性のため）
      if (guideId && ['1', '2', '3', '4', '5'].includes(guideId)) {
        const isHokkaidoCard = card.textContent.includes('北海道') || 
                              card.textContent.includes('札幌') || 
                              card.textContent.includes('函館');
                              
        if (isHokkaidoCard && !location.includes('北海道')) {
          location = location ? `北海道 ${location}` : '北海道';
          card.setAttribute('data-location', location);
          console.log(`北海道情報を強化: ID=${guideId}, 新地域=${location}`);
        }
      }
      
      // 言語情報を取得
      if (card.hasAttribute('data-languages')) {
        languages = card.getAttribute('data-languages').toLowerCase();
      } else {
        const langElements = card.querySelectorAll('.guide-languages .badge');
        if (langElements.length > 0) {
          languages = Array.from(langElements)
            .map(badge => badge.textContent.trim().toLowerCase())
            .join(',');
          card.setAttribute('data-languages', languages);
        }
      }
      
      // 料金情報を取得
      if (card.hasAttribute('data-fee')) {
        fee = parseInt(card.getAttribute('data-fee')) || 0;
      } else {
        const feeElement = card.querySelector('.guide-fee') || 
                          card.querySelector('.badge.bg-primary');
        if (feeElement) {
          const feeText = feeElement.textContent;
          const feeMatch = feeText.match(/¥([0-9,]+)/);
          if (feeMatch) {
            fee = parseInt(feeMatch[1].replace(/,/g, ''));
            card.setAttribute('data-fee', fee.toString());
          }
        }
      }
      
      // キーワード情報を取得
      if (card.hasAttribute('data-keywords')) {
        keywords = card.getAttribute('data-keywords').toLowerCase();
      } else {
        const badgeElements = card.querySelectorAll('.badge:not(.bg-primary):not(.guide-lang)');
        if (badgeElements.length > 0) {
          keywords = Array.from(badgeElements)
            .map(badge => badge.textContent.trim().toLowerCase())
            .join(',');
          card.setAttribute('data-keywords', keywords);
        }
      }
      
      // URLデコードを適用（エンコードされた文字列への対応）
      try {
        location = decodeURIComponent(location);
        languages = decodeURIComponent(languages);
        keywords = decodeURIComponent(keywords);
      } catch (e) {
        console.error('URLデコードエラー:', e);
      }
      
      console.log(`カード情報準備: ID=${guideId}, 地域=${location}, 言語=${languages}, 料金=${fee}, キーワード=${keywords}`);
      
      // 北海道関連のデバッグ用
      if (location.includes('北海道') || location.includes('札幌') || location.includes('函館')) {
        console.log(`北海道関連ガイド発見: ${guideId} - ${location}`);
      }
      
      return {
        element: cardElement,
        container: guideItem,
        id: guideId,
        location: location,
        languages: languages.split(',').map(lang => lang.trim()),
        fee: fee,
        keywords: keywords.split(',').map(kw => kw.trim()),
        // 状態管理用のフラグ
        visible: true
      };
    });
    
    console.log(`${cardsData.length}件のガイドカードデータを準備しました`);
  }
  
  // フィルター処理のメイン関数
  function performFilter() {
    console.log('フィルター処理を実行中...');
    
    // フィルター条件を取得
    const locationRaw = locationFilter ? locationFilter.value : '';
    const location = locationRaw.toLowerCase();
    
    // 北海道フィルター用デバッグ情報
    console.log(`選択された地域: "${locationRaw}" (値そのまま), 小文字化: "${location}"`);
    
    const language = languageFilter ? languageFilter.value.toLowerCase() : '';
    const fee = feeFilter ? parseInt(feeFilter.value) || 999999 : 999999;
    
    // チェックボックスからキーワードを取得
    const selectedKeywords = Array.from(keywordCheckboxes)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value.toLowerCase());
    
    // 追加キーワードの取得
    const customKeywords = customKeywordInput && customKeywordInput.value
      ? customKeywordInput.value.split(',').map(kw => kw.trim().toLowerCase()).filter(kw => kw !== '')
      : [];
    
    // すべてのキーワードを結合
    const allKeywords = [...selectedKeywords, ...customKeywords];
    
    console.log(`フィルター条件: 地域=${location}, 言語=${language}, 料金=${fee}, キーワード=[${allKeywords.join(', ')}]`);
    
    let visibleCount = 0;
    
    // フィルター処理を実施
    cardsData.forEach(card => {
      // 北海道特別処理の適用
      let matchesLocation = true;
      if (location && location !== '' && location !== 'すべて') {
        // 地域名を取得
        const locationName = locationRaw;
        console.log(`地域条件チェック: カードID=${card.id}, 条件="${locationName}", カード地域="${card.location}"`);
        
        if (locationName === '北海道' || locationRaw === '北海道') {
          // 北海道の特別処理: 北海道または札幌などの地名を含む場合のみ一致
          const hokkaidoTerms = ['北海道', '札幌', '函館', '旭川', '釧路', '帯広', '小樽', '千歳'];
          
          // いずれかの北海道関連キーワードが含まれているか確認
          matchesLocation = hokkaidoTerms.some(term => 
            card.location.toLowerCase().includes(term.toLowerCase())
          );
          
          // デバッグ用
          if (matchesLocation) {
            console.log(`北海道条件に一致: カードID=${card.id}, 地域=${card.location}`);
          } else {
            console.log(`北海道条件に一致しない: カードID=${card.id}, 地域=${card.location}`);
          }
        } else {
          // 通常の地域フィルター: 部分一致で判定
          matchesLocation = card.location.toLowerCase().includes(location.toLowerCase());
        }
      }
      
      // 言語フィルター
      let matchesLanguage = true;
      if (language && language !== 'すべて') {
        matchesLanguage = card.languages.some(lang => lang === language);
      }
      
      // 料金フィルター
      let matchesFee = card.fee <= fee;
      
      // キーワードフィルター
      let matchesKeywords = true;
      if (allKeywords.length > 0) {
        matchesKeywords = allKeywords.some(keyword => 
          card.keywords.some(cardKeyword => cardKeyword.includes(keyword))
        );
      }
      
      // 総合的な一致判定
      const shouldShow = matchesLocation && matchesLanguage && matchesFee && matchesKeywords;
      
      // フィルター結果をコンソールに出力（デバッグ用）
      console.log(`カードID=${card.id}: 地域=${matchesLocation}, 言語=${matchesLanguage}, 料金=${matchesFee}, キーワード=${matchesKeywords}`);
      
      // 表示/非表示の切り替え
      toggleCardVisibility(card, shouldShow);
      
      // 表示カウントの更新
      if (shouldShow) {
        visibleCount++;
      }
    });
    
    // 検索結果の表示更新
    updateResultsDisplay(visibleCount);
    
    console.log(`フィルター完了: ${visibleCount}件のガイドが表示されています`);
  }
  
  // ガイドカードの表示/非表示を切り替える
  function toggleCardVisibility(card, visible) {
    const element = card.element;
    const container = card.container;
    
    // カードの可視性状態を更新
    card.visible = visible;
    
    if (visible) {
      // 表示処理
      if (container) {
        container.classList.remove('hidden-guide');
        container.style.display = '';
        
        // フェードイン効果
        container.style.opacity = '0';
        setTimeout(() => {
          container.style.transition = 'opacity 0.3s ease-in-out';
          container.style.opacity = '1';
        }, 10);
      } else {
        element.classList.remove('hidden-guide');
        element.style.display = '';
        
        // フェードイン効果
        element.style.opacity = '0';
        setTimeout(() => {
          element.style.transition = 'opacity 0.3s ease-in-out';
          element.style.opacity = '1';
        }, 10);
      }
    } else {
      // 非表示処理
      if (container) {
        container.style.transition = 'opacity 0.3s ease-in-out';
        container.style.opacity = '0';
        setTimeout(() => {
          container.classList.add('hidden-guide');
          container.style.display = 'none';
        }, 300);
      } else {
        element.style.transition = 'opacity 0.3s ease-in-out';
        element.style.opacity = '0';
        setTimeout(() => {
          element.classList.add('hidden-guide');
          element.style.display = 'none';
        }, 300);
      }
    }
  }
  
  // 検索結果表示の更新
  function updateResultsDisplay(visibleCount) {
    // 件数表示の更新
    if (searchResultsCounter) {
      searchResultsCounter.textContent = `${visibleCount}件のガイドが見つかりました`;
      
      // 結果がある場合は成功スタイル、ない場合は情報スタイルに変更
      if (visibleCount > 0) {
        searchResultsCounter.className = 'alert alert-success fw-bold fs-5 text-center my-3';
      } else {
        searchResultsCounter.className = 'alert alert-info fw-bold fs-5 text-center my-3';
      }
    }
    
    // 検索結果なしメッセージの表示/非表示
    if (noResultsMessage) {
      if (visibleCount === 0) {
        noResultsMessage.classList.remove('d-none');
      } else {
        noResultsMessage.classList.add('d-none');
      }
    }
  }
  
  // 連続した呼び出しを間引くためのデバウンス関数
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // 初期化処理を実行
  function initialize() {
    prepareCardsData();
    setupFilterEvents();
    performFilter(); // 初期表示用にフィルター処理を実行
    
    console.log('改良版フィルター機能の初期化が完了しました');
    
    // グローバルスコープに関数を公開（他のスクリプトからの呼び出し用）
    window.applyFilters = performFilter;
    window.resetAllFilters = resetFilters;
  }
  
  // 初期化を実行
  initialize();
});