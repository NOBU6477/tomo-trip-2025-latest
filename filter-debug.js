/**
 * フィルター機能デバッグ・修正スクリプト
 * 既存のフィルター問題を特定し修正する
 */

(function() {
  'use strict';

  // フィルター機能の緊急修正
  function fixFilterFunctionality() {
    console.log('フィルター機能の修正を開始...');

    // 検索ボタンのイベントリスナーを再設定
    const searchButton = document.querySelector('#apply-filters');
    const resetButton = document.querySelector('#reset-filters');

    if (searchButton) {
      // 既存のonclickを削除
      searchButton.removeAttribute('onclick');
      
      // 新しいイベントリスナーを追加
      searchButton.addEventListener('click', function(e) {
        e.preventDefault();
        performSearch();
      });
      console.log('検索ボタンのイベントリスナーを修正');
    }

    if (resetButton) {
      resetButton.removeAttribute('onclick');
      resetButton.addEventListener('click', function(e) {
        e.preventDefault();
        resetFilters();
      });
      console.log('リセットボタンのイベントリスナーを修正');
    }
  }

  // 検索機能の実装
  function performSearch() {
    console.log('検索処理を開始...');
    
    try {
      // フィルター値を取得
      const locationSelect = document.querySelector('#location-filter');
      const languageSelect = document.querySelector('#language-filter');
      const feeSelect = document.querySelector('#fee-filter');
      const keywordInput = document.querySelector('#keyword-filter-custom');

      const filters = {
        location: locationSelect ? locationSelect.value : '',
        language: languageSelect ? languageSelect.value : '',
        fee: feeSelect ? feeSelect.value : '',
        keywords: keywordInput ? keywordInput.value.toLowerCase() : ''
      };

      console.log('フィルター条件:', filters);

      // キーワードチェックボックスの取得
      const keywordCheckboxes = document.querySelectorAll('.keyword-checkbox');
      const selectedKeywords = Array.from(keywordCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value.toLowerCase());

      console.log('選択されたキーワード:', selectedKeywords);

      // ガイドカードを検索
      const guideCards = document.querySelectorAll('.guide-item');
      let visibleCount = 0;

      guideCards.forEach(card => {
        const isVisible = evaluateCard(card, filters, selectedKeywords);
        
        if (isVisible) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      // 結果表示を更新
      updateResultDisplay(visibleCount);
      console.log(`検索完了: ${visibleCount}件のガイドが見つかりました`);

    } catch (error) {
      console.error('検索処理エラー:', error);
      alert('検索中にエラーが発生しました。ページを再読み込みしてください。');
    }
  }

  // カード評価
  function evaluateCard(card, filters, selectedKeywords) {
    const cardText = card.textContent.toLowerCase();
    
    // 地域フィルター
    if (filters.location && filters.location !== 'すべて' && filters.location !== '') {
      const locationMatch = cardText.includes(filters.location.toLowerCase()) ||
                           cardText.includes(getPrefectureName(filters.location));
      if (!locationMatch) return false;
    }

    // 言語フィルター
    if (filters.language && filters.language !== 'すべて' && filters.language !== '') {
      const languageMatch = cardText.includes(filters.language.toLowerCase()) ||
                           (filters.language === '英語' && cardText.includes('english'));
      if (!languageMatch) return false;
    }

    // 料金フィルター
    if (filters.fee && filters.fee !== 'すべて' && filters.fee !== '') {
      // 簡易的な料金マッチング
      const feeRange = parseFeeRange(filters.fee);
      const cardFee = extractFeeFromCard(cardText);
      
      if (feeRange && cardFee !== null) {
        if (cardFee < feeRange.min || cardFee > feeRange.max) return false;
      }
    }

    // キーワードフィルター
    if (selectedKeywords.length > 0) {
      const keywordMatch = selectedKeywords.some(keyword => 
        cardText.includes(keyword.toLowerCase())
      );
      if (!keywordMatch) return false;
    }

    // テキストキーワード検索
    if (filters.keywords && filters.keywords.trim() !== '') {
      const keywords = filters.keywords.split(',').map(k => k.trim());
      const textMatch = keywords.some(keyword => 
        cardText.includes(keyword)
      );
      if (!textMatch) return false;
    }

    return true;
  }

  // ヘルパー関数
  function getPrefectureName(location) {
    const prefectureMap = {
      '北海道': '北海道',
      '青森県': '青森',
      '岩手県': '岩手',
      '宮城県': '宮城',
      '秋田県': '秋田',
      '山形県': '山形',
      '福島県': '福島',
      '茨城県': '茨城',
      '栃木県': '栃木',
      '群馬県': '群馬',
      '埼玉県': '埼玉',
      '千葉県': '千葉',
      '東京都': '東京',
      '神奈川県': '神奈川',
      '新潟県': '新潟',
      '富山県': '富山',
      '石川県': '石川',
      '福井県': '福井',
      '山梨県': '山梨',
      '長野県': '長野',
      '岐阜県': '岐阜',
      '静岡県': '静岡',
      '愛知県': '愛知',
      '三重県': '三重',
      '滋賀県': '滋賀',
      '京都府': '京都',
      '大阪府': '大阪',
      '兵庫県': '兵庫',
      '奈良県': '奈良',
      '和歌山県': '和歌山',
      '鳥取県': '鳥取',
      '島根県': '島根',
      '岡山県': '岡山',
      '広島県': '広島',
      '山口県': '山口',
      '徳島県': '徳島',
      '香川県': '香川',
      '愛媛県': '愛媛',
      '高知県': '高知',
      '福岡県': '福岡',
      '佐賀県': '佐賀',
      '長崎県': '長崎',
      '熊本県': '熊本',
      '大分県': '大分',
      '宮崎県': '宮崎',
      '鹿児島県': '鹿児島',
      '沖縄県': '沖縄'
    };
    return prefectureMap[location] || location;
  }

  function parseFeeRange(feeOption) {
    if (feeOption.includes('無料')) return { min: 0, max: 0 };
    if (feeOption.includes('3000円未満')) return { min: 0, max: 2999 };
    if (feeOption.includes('3000-5000円')) return { min: 3000, max: 5000 };
    if (feeOption.includes('5000円以上')) return { min: 5000, max: Infinity };
    return null;
  }

  function extractFeeFromCard(cardText) {
    const feeMatch = cardText.match(/[¥￥]?([0-9,]+)\s*円/);
    return feeMatch ? parseInt(feeMatch[1].replace(/,/g, '')) : null;
  }

  function updateResultDisplay(count) {
    const resultElement = document.querySelector('.search-results, .result-count, .guide-count');
    if (resultElement) {
      resultElement.textContent = `${count}件のガイドが見つかりました`;
    }
  }

  // リセット機能
  function resetFilters() {
    console.log('フィルターをリセット中...');

    // セレクトボックスをリセット
    const selects = document.querySelectorAll('#location-filter, #language-filter, #fee-filter');
    selects.forEach(select => {
      select.selectedIndex = 0;
    });

    // テキスト入力をクリア
    const textInput = document.querySelector('#keyword-filter-custom');
    if (textInput) {
      textInput.value = '';
    }

    // チェックボックスをクリア
    const checkboxes = document.querySelectorAll('.keyword-checkbox');
    checkboxes.forEach(cb => {
      cb.checked = false;
    });

    // 全てのカードを表示
    const guideCards = document.querySelectorAll('.guide-item');
    guideCards.forEach(card => {
      card.style.display = '';
    });

    updateResultDisplay(guideCards.length);
    console.log('フィルターリセット完了');
  }

  // 初期化
  function initialize() {
    // DOM準備完了後に実行
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fixFilterFunctionality);
    } else {
      fixFilterFunctionality();
    }

    // ページ読み込み完了後にも実行（念のため）
    window.addEventListener('load', function() {
      setTimeout(fixFilterFunctionality, 500);
    });
  }

  // 開始
  initialize();

})();