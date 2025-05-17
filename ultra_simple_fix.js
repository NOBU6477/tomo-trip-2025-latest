/**
 * 超シンプル・最終解決策
 * 余計な処理を一切排除した最小限のコードで確実に動作させる
 */
(function() {
  console.log('超シンプル・最終解決策を実行します');
  
  // 初期化
  document.addEventListener('DOMContentLoaded', init);
  window.addEventListener('load', init);
  
  // すぐに実行
  setTimeout(init, 0);
  
  function init() {
    console.log('超シンプル最終解決策を初期化します');
    fixLanguageSwitcher();
    fixRegisterDropdown();
  }
  
  /**
   * 言語切替ボタン修正
   */
  function fixLanguageSwitcher() {
    console.log('言語切替ボタンを修正します');
    
    // 英語ボタン
    const enButton = document.getElementById('en-button');
    if (enButton) {
      // イベントリスナーをすべて削除
      const newEnButton = enButton.cloneNode(true);
      enButton.parentNode.replaceChild(newEnButton, enButton);
      
      // 新しいイベントリスナーを追加
      newEnButton.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('英語ボタンがクリックされました - 超シンプル版');
        translateToEnglish();
        return false;
      });
    }
    
    // 日本語ボタン
    const jaButton = document.getElementById('ja-button');
    if (jaButton) {
      // イベントリスナーをすべて削除
      const newJaButton = jaButton.cloneNode(true);
      jaButton.parentNode.replaceChild(newJaButton, jaButton);
      
      // 新しいイベントリスナーを追加
      newJaButton.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('日本語ボタンがクリックされました - 超シンプル版');
        location.reload(); // もっとも確実な方法でページを日本語に戻す
        return false;
      });
    }
  }
  
  /**
   * 英語への翻訳
   */
  function translateToEnglish() {
    console.log('ページを英語に翻訳します - 超シンプル版');
    
    // メニュー項目を翻訳
    translateElement('ガイドを探す', 'Find Guides');
    translateElement('ガイドとして登録', 'Register as Guide');
    translateElement('旅行者として登録', 'Register as Tourist');
    translateElement('ログイン', 'Login');
    translateElement('新規登録', 'Register');
    translateElement('予約管理', 'Bookings');
    translateElement('ガイドプロフィール', 'Guide Profile');
    translateElement('旅行者プロフィール', 'Tourist Profile');
    translateElement('メッセージ', 'Messages');
    translateElement('ログアウト', 'Logout');
    
    // ヘッダーを翻訳
    translateElement('人気のガイド', 'Popular Guides');
    
    // フィルターセクションを翻訳
    translateElement('ガイドを絞り込む', 'Filter Guides');
    translateElement('場所', 'Location');
    translateElement('言語', 'Language');
    translateElement('料金', 'Price');
    translateElement('キーワード', 'Keywords');
    translateElement('ナイトツアー', 'Night Tour');
    translateElement('グルメ', 'Food');
    translateElement('写真スポット', 'Photo Spot');
    translateElement('料理', 'Cooking');
    translateElement('アクティビティ', 'Activity');
    translateElement('検索', 'Search');
    translateElement('リセット', 'Reset');
    
    // 使い方セクションを翻訳
    translateElement('使い方', 'How to Use');
    translateElement('アカウント登録', 'Create Account');
    translateElement('簡単な情報入力と電話番号認証で登録完了', 'Simple signup with phone verification');
    translateElement('ガイドを見つける', 'Find Guides');
    translateElement('場所、言語、専門性などで理想のガイドを検索', 'Search by location, language, and expertise');
    translateElement('予約して楽しむ', 'Book and Enjoy');
    translateElement('希望の日時で予約し、特別な体験を楽しむ', 'Book at your preferred time and enjoy a special experience');
    
    // メリットセクションを翻訳
    translateElement('ガイドとして活躍するメリット', 'Benefits of Being a Guide');
    translateElement('あなたの知識と経験を活かして、世界中の旅行者に特別な体験を提供しましょう', 'Share your knowledge and experience to provide special experiences to travelers from around the world');
    translateElement('柔軟な働き方', 'Flexible Work Style');
    translateElement('自分のスケジュールに合わせて活動できます。空き時間を有効活用しましょう。', 'Work according to your own schedule. Make effective use of your free time.');
    translateElement('追加収入', 'Additional Income');
    translateElement('あなたの専門知識や特技を収入に変えることができます。', 'Turn your expertise and skills into income.');
    translateElement('国際交流', 'International Exchange');
    translateElement('世界中の人々と交流し、異文化理解を深めることができます。', 'Interact with people from around the world and deepen cross-cultural understanding.');
    translateElement('自己成長', 'Personal Growth');
    translateElement('ガイド活動を通じて、コミュニケーション能力や知識が向上します。', 'Improve your communication skills and knowledge through guiding activities.');
    
    // プレースホルダーの翻訳
    translatePlaceholder('その他のキーワードを入力（コンマ区切りで複数入力可）', 'Enter other keywords (comma separated)');
    
    // 言語切替ボタンのハイライトを更新
    updateLanguageButtonHighlight('en');
    
    // 状態を保存
    localStorage.setItem('language', 'en');
  }
  
  /**
   * テキスト要素を翻訳
   */
  function translateElement(japaneseText, englishText) {
    // テキストを含む要素を探す
    const elements = findElementsByText(japaneseText);
    
    // 見つかったすべての要素のテキストを置換
    elements.forEach(element => {
      element.textContent = element.textContent.replace(japaneseText, englishText);
    });
  }
  
  /**
   * プレースホルダーを翻訳
   */
  function translatePlaceholder(japaneseText, englishText) {
    const inputs = document.querySelectorAll('input[placeholder], textarea[placeholder]');
    inputs.forEach(input => {
      if (input.getAttribute('placeholder') === japaneseText) {
        input.setAttribute('placeholder', englishText);
      }
    });
  }
  
  /**
   * 言語ボタンのハイライトを更新
   */
  function updateLanguageButtonHighlight(language) {
    const enButton = document.getElementById('en-button');
    const jaButton = document.getElementById('ja-button');
    
    if (enButton && jaButton) {
      if (language === 'en') {
        enButton.classList.add('active');
        jaButton.classList.remove('active');
      } else {
        jaButton.classList.add('active');
        enButton.classList.remove('active');
      }
    }
  }
  
  /**
   * 特定のテキストを含む要素を探す
   */
  function findElementsByText(searchText) {
    const elements = [];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      { acceptNode: node => node.nodeValue.includes(searchText) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT }
    );
    
    let node;
    while (node = walker.nextNode()) {
      elements.push(node.parentNode);
    }
    
    return elements;
  }
  
  /**
   * 新規登録ドロップダウン修正
   */
  function fixRegisterDropdown() {
    console.log('新規登録ドロップダウンを修正します');
    
    // 新規登録ボタンを取得
    const registerButton = document.getElementById('registerDropdown');
    if (!registerButton) {
      console.error('新規登録ボタンが見つかりません');
      return;
    }
    
    // ドロップダウンメニューを取得
    const dropdownMenu = document.querySelector('.dropdown-menu[aria-labelledby="registerDropdown"]');
    if (!dropdownMenu) {
      console.error('ドロップダウンメニューが見つかりません');
      return;
    }
    
    // ボタンの元のクリックイベントを削除するためにコピーして置き換え
    const newRegisterButton = registerButton.cloneNode(true);
    registerButton.parentNode.replaceChild(newRegisterButton, registerButton);
    
    // 旅行者登録項目を取得
    const touristItem = dropdownMenu.querySelector('a[data-bs-target="#registerTouristModal"]');
    const touristItemClone = touristItem ? touristItem.cloneNode(true) : null;
    if (touristItem && touristItemClone) {
      touristItem.parentNode.replaceChild(touristItemClone, touristItem);
    }
    
    // ガイド登録項目を取得
    const guideItem = dropdownMenu.querySelector('a[data-bs-target="#registerGuideModal"]');
    const guideItemClone = guideItem ? guideItem.cloneNode(true) : null;
    if (guideItem && guideItemClone) {
      guideItem.parentNode.replaceChild(guideItemClone, guideItem);
    }
    
    // ドロップダウンメニューのスタイルを設定
    dropdownMenu.style.display = 'none';
    dropdownMenu.style.position = 'absolute';
    dropdownMenu.style.top = '100%';
    dropdownMenu.style.right = '0';
    dropdownMenu.style.zIndex = '1000';
    dropdownMenu.style.minWidth = '10rem';
    dropdownMenu.style.padding = '0.5rem 0';
    dropdownMenu.style.backgroundColor = '#fff';
    dropdownMenu.style.border = '1px solid rgba(0,0,0,0.15)';
    dropdownMenu.style.borderRadius = '0.25rem';
    
    // ボタンクリック時の動作を設定
    newRegisterButton.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('新規登録ボタンがクリックされました（超シンプル版）');
      
      // ドロップダウンの表示切替
      const isVisible = dropdownMenu.style.display === 'block';
      dropdownMenu.style.display = isVisible ? 'none' : 'block';
      
      return false;
    };
    
    // 旅行者として登録リンクのクリック動作
    if (touristItemClone) {
      touristItemClone.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('旅行者登録リンクがクリックされました（超シンプル版）');
        
        // モーダルを開く
        const modal = document.getElementById('registerTouristModal');
        if (modal) {
          dropdownMenu.style.display = 'none';
          showModal(modal);
        }
        
        return false;
      };
    }
    
    // ガイドとして登録リンクのクリック動作
    if (guideItemClone) {
      guideItemClone.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('ガイド登録リンクがクリックされました（超シンプル版）');
        
        // モーダルを開く
        const modal = document.getElementById('registerGuideModal');
        if (modal) {
          dropdownMenu.style.display = 'none';
          showModal(modal);
        }
        
        return false;
      };
    }
    
    // ドキュメント内の別の場所をクリックするとドロップダウンを閉じる
    document.addEventListener('click', function(e) {
      if (!newRegisterButton.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.style.display = 'none';
      }
    });
  }
  
  /**
   * モーダルを表示する関数
   */
  function showModal(modal) {
    if (!modal) return;
    
    console.log('モーダルを表示します:', modal.id);
    
    // 背景を作成
    let backdrop = document.querySelector('.modal-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      document.body.appendChild(backdrop);
    }
    
    // モーダルを表示
    modal.style.display = 'block';
    modal.classList.add('show');
    modal.setAttribute('aria-modal', 'true');
    modal.removeAttribute('aria-hidden');
    
    // body要素にスタイルを適用
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '15px';
    
    // 閉じるボタンにイベントリスナーを設定
    const closeButtons = modal.querySelectorAll('[data-bs-dismiss="modal"]');
    closeButtons.forEach(function(button) {
      // 既存のイベントリスナーを削除
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
      
      // 新しいイベントリスナーを設定
      newButton.addEventListener('click', function(e) {
        e.preventDefault();
        hideModal(modal);
        return false;
      });
    });
    
    // モーダル外のクリックでも閉じられるようにする
    modal.onclick = function(e) {
      if (e.target === modal) {
        hideModal(modal);
      }
    };
  }
  
  /**
   * モーダルを非表示にする関数
   */
  function hideModal(modal) {
    if (!modal) return;
    
    console.log('モーダルを非表示にします:', modal.id);
    
    // モーダルを非表示
    modal.style.display = 'none';
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    
    // 背景を削除
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.parentNode.removeChild(backdrop);
    }
    
    // body要素のスタイルを元に戻す
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }
})();