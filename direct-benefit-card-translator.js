/**
 * ベネフィットカードタイトルを直接置換する専用スクリプト
 * 最優先で実行され、他のスクリプトより強制的に翻訳を適用する
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('直接ベネフィットカード翻訳機能をロード');
  
  // 言語切り替えボタンのクリックを監視
  document.addEventListener('click', function(event) {
    if (event.target && event.target.closest('#englishBtn')) {
      console.log('英語ボタンがクリックされました - 直接翻訳を実行');
      setTimeout(translateBenefitTitles, 100);  // 少し遅延させて他のスクリプトの後に実行
    }
  });

  // MutationObserverでDOM変更を監視
  const observer = new MutationObserver(function(mutations) {
    const langBtn = document.getElementById('languageDropdown');
    if (langBtn && langBtn.textContent.includes('English')) {
      console.log('英語モードを検出 - 直接翻訳を適用');
      translateBenefitTitles();
    }
  });

  // 監視設定
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true
  });

  // 初期ロード時にも確認
  setTimeout(checkAndTranslate, 500);

  function checkAndTranslate() {
    const langBtn = document.getElementById('languageDropdown');
    if (langBtn && langBtn.textContent.includes('English')) {
      console.log('初期ロード時に英語モードを検出 - 直接翻訳を適用');
      translateBenefitTitles();
    }
  }

  function translateBenefitTitles() {
    // セクションタイトル
    const sectionTitle = document.querySelector('h2');
    if (sectionTitle && sectionTitle.textContent.includes('ガイドとして活躍')) {
      sectionTitle.textContent = 'Benefits of Being a Guide';
    }

    // 各ベネフィットカードのタイトル
    translateCardTitle('あなたの日常が観光資源になる', 'Your Daily Life Becomes a Tourist Attraction');
    translateCardTitle('観光客の方を友達としてお迎えするだけです', 'Welcome Tourists as Friends');
    translateCardTitle('隙間時間を使って効率よくお仕事をする', 'Work Efficiently in Your Free Time');
    translateCardTitle('自分の好きなことを仕事にできる', 'Do What You Love');
    translateCardTitle('世界中の人と新しい出会いが生まれる', 'Meet People from Around the World');
    translateCardTitle('語学力を活かし、さらに向上させられる', 'Improve Your Language Skills');
    translateCardTitle('地元への愛着と誇りが深まる', 'Deepen Your Love for Your Hometown');
    translateCardTitle('安心のサポート体制', 'Reliable Support System');
    translateCardTitle('自分のペースで活動可能', 'Work at Your Own Pace');
    translateCardTitle('地域活性化に貢献できる', 'Contribute to Local Economy');

    // ブルーチェックマーク付きのカードタイトルを直接探して置換 - より徹底的なアプローチ
    document.querySelectorAll('.card, .benefit-card, .col-md-6, .col-lg-6').forEach(function(card) {
      // すべてのチェックアイコンを検索
      const checkIcons = card.querySelectorAll('.text-primary, .bi-check-circle-fill, svg.text-primary, .bi.bi-check-circle, .bi.bi-check, .bi-check');
      
      // 各チェックアイコンを処理
      checkIcons.forEach(function(checkIcon) {
        // より広範囲に隣接するテキスト要素を探す
        // 1. 直接の兄弟要素を確認
        let sibling = checkIcon.nextElementSibling;
        while (sibling) {
          if (sibling.textContent.trim()) {
            // 日本語テキストを検出して置換
            replaceJapaneseWithEnglish(sibling);
            break;
          }
          sibling = sibling.nextElementSibling;
        }

        // 2. 親要素と親要素の子要素を確認
        let parent = checkIcon.parentElement;
        if (parent) {
          const textNodes = Array.from(parent.childNodes).filter(node => 
            node.nodeType === 3 && node.textContent.trim()
          );
          
          if (textNodes.length > 0) {
            replaceJapaneseWithEnglish(parent);
          } else {
            // 親要素の兄弟も確認
            sibling = parent.nextElementSibling;
            while (sibling) {
              if (sibling.textContent.trim()) {
                replaceJapaneseWithEnglish(sibling);
                break;
              }
              sibling = sibling.nextElementSibling;
            }
          }
        }
      });
      
      // カード内のすべてのテキスト要素を直接検索して置換
      const allTextElements = card.querySelectorAll('*');
      allTextElements.forEach(function(elem) {
        if (elem.childNodes.length === 1 && elem.childNodes[0].nodeType === 3 && elem.textContent.trim()) {
          replaceJapaneseWithEnglish(elem);
        }
      });
    });
    
    // 日本語テキストを英語に置換する関数
    function replaceJapaneseWithEnglish(element) {
      const text = element.textContent.trim();
      
      // 日本語のタイトルを英語に置換
      if (text.includes('あなたの日常が観光資源')) {
        element.textContent = 'Your Daily Life Becomes a Tourist Attraction';
      } else if (text.includes('観光客の方を友達')) {
        element.textContent = 'Welcome Tourists as Friends';
      } else if (text.includes('隙間時間を使って')) {
        element.textContent = 'Work Efficiently in Your Free Time';
      } else if (text.includes('自分の好きなこと')) {
        element.textContent = 'Do What You Love';
      } else if (text.includes('世界中の人と')) {
        element.textContent = 'Meet People from Around the World';
      } else if (text.includes('語学力を活かし')) {
        element.textContent = 'Improve Your Language Skills';
      } else if (text.includes('地元への愛着')) {
        element.textContent = 'Deepen Your Love for Your Hometown';
      } else if (text.includes('安心のサポート')) {
        element.textContent = 'Reliable Support System';
      } else if (text.includes('自分のペースで')) {
        element.textContent = 'Work at Your Own Pace';
      } else if (text.includes('地域活性化')) {
        element.textContent = 'Contribute to Local Economy';
      }
    }
  }

  function translateCardTitle(japaneseText, englishText) {
    // 通常のカードタイトル要素
    document.querySelectorAll('h3, h4, h5, .card-title, .card-header, .benefit-title').forEach(function(title) {
      if (title && title.textContent && title.textContent.includes(japaneseText)) {
        title.textContent = englishText;
      }
    });

    // テキスト要素を直接探す（特殊なHTML構造の場合）
    document.querySelectorAll('strong, b, span, div').forEach(function(elem) {
      if (elem.childNodes.length === 1 && elem.childNodes[0].nodeType === 3) {
        // テキストノードを持つ単純な要素
        if (elem.textContent.includes(japaneseText)) {
          elem.textContent = englishText;
        }
      }
    });
  }

  // チェックアイコンに最も近いテキスト要素を見つける
  function findNearestText(element) {
    // 1. 同じ親の下の兄弟要素を調べる
    let sibling = element.nextElementSibling;
    while (sibling) {
      if (sibling.textContent.trim()) {
        return sibling;
      }
      sibling = sibling.nextElementSibling;
    }

    // 2. 親要素のテキストを調べる
    let parent = element.parentElement;
    if (parent && parent.childNodes) {
      for (let i = 0; i < parent.childNodes.length; i++) {
        const node = parent.childNodes[i];
        if (node.nodeType === 3 && node.textContent.trim()) { // テキストノード
          return parent;
        }
      }
    }

    // 3. 親の次の兄弟要素を調べる
    if (parent) {
      sibling = parent.nextElementSibling;
      while (sibling) {
        if (sibling.textContent.trim()) {
          return sibling;
        }
        sibling = sibling.nextElementSibling;
      }
    }

    // 4. 同じカード内の他の要素を探す
    const card = element.closest('.card, .benefit-card');
    if (card) {
      const possibleTitles = card.querySelectorAll('h3, h4, h5, strong, b, span.fw-bold');
      for (let i = 0; i < possibleTitles.length; i++) {
        if (possibleTitles[i].textContent.trim()) {
          return possibleTitles[i];
        }
      }
    }

    return null;
  }
});