/**
 * 完全な言語切り替えスクリプト
 * 全てのUI要素を英語/日本語に切り替える
 * 設定を保存して他のページとも共有
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('言語切り替え機能を初期化');

  // 言語ボタンの要素を取得
  const engLink = document.querySelector('.dropdown-item[data-lang="en"]');
  const jpnLink = document.querySelector('.dropdown-item[data-lang="ja"]');
  
  // 言語ボタンが見つかったかログに出力
  console.log('英語ボタン:', engLink ? '見つかりました' : '見つかりません');
  console.log('日本語ボタン:', jpnLink ? '見つかりました' : '見つかりません');
  
  if (engLink) {
    engLink.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('英語に切り替えるボタンがクリックされました');
      
      // 英語モードを保存
      localStorage.setItem('selectedLanguage', 'en');
      
      // language-switcher.jsを使用可能な場合はそちらを使う
      if (typeof switchLanguage === 'function') {
        switchLanguage('en');
      } else {
        // 英語に翻訳
        translateToEnglish();
      }
    });
  }
  
  if (jpnLink) {
    jpnLink.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('日本語に切り替えるボタンがクリックされました');
      
      // 日本語モードを保存
      localStorage.setItem('selectedLanguage', 'ja');
      
      // 日本語に戻す - より良い方法 - language-switcher.jsに任せる
      // language-switcher.jsがある場合はそちらの機能を使い、なければリロード
      if (typeof switchLanguage === 'function') {
        switchLanguage('ja');
      } else {
        location.reload();
      }
    });
  }
  
  // 前回の言語設定を確認し、復元
  const savedLanguage = localStorage.getItem('selectedLanguage');
  if (savedLanguage === 'en') {
    console.log('前回の言語設定：英語を復元します');
    
    // language-switcher.jsを使用可能な場合はそちらを使う
    if (typeof switchLanguage === 'function') {
      switchLanguage('en');
    } else {
      // 英語に翻訳
      translateToEnglish();
    }
    
    // 言語ドロップダウンの表示も更新
    const langBtn = document.getElementById('languageDropdown');
    if (langBtn) {
      langBtn.textContent = 'English';
    }
  }
  
  // 英語への翻訳関数
  function translateToEnglish() {
    // 言語メニューの表示を更新
    const langBtn = document.getElementById('languageDropdown');
    if (langBtn) {
      langBtn.textContent = 'English';
    }
    
    // ナビゲーションメニュー項目の翻訳
    document.querySelectorAll('.navbar-nav .nav-link').forEach(function(link, index) {
      if (index === 0) link.textContent = 'Home';
      else if (index === 1) link.textContent = 'Find Guides';
      else if (index === 2) link.textContent = 'How to Use';
    });
    
    // ボタンとリンクの翻訳
    document.querySelectorAll('button.btn, a.btn').forEach(function(btn) {
      if (btn.textContent.includes('ログイン')) btn.textContent = 'Login';
      else if (btn.textContent.trim() === '新規登録') btn.textContent = 'Register';
      else if (btn.textContent.includes('ガイドを探す') || btn.textContent.includes('もっと見る')) btn.textContent = 'Find Guides';
      else if (btn.textContent.includes('お問い合わせ')) btn.textContent = 'Contact Us';
      else if (btn.textContent.includes('詳細を見る')) btn.textContent = 'See Details';
      else if (btn.textContent.includes('リセット')) btn.textContent = 'Reset';
      else if (btn.textContent.includes('検索')) btn.textContent = 'Search';
      else if (btn.textContent.includes('ガイドとして登録')) btn.textContent = 'Register as Guide';
      else if (btn.textContent.includes('もっと見る')) btn.textContent = 'See More';
    });
    
    // ヒーローセクションの翻訳
    const heroTitle = document.querySelector('.hero-section h1');
    const heroSubtitle = document.querySelector('.hero-section .lead');
    if (heroTitle) heroTitle.textContent = 'Your Special Journey Awaits';
    if (heroSubtitle) heroSubtitle.textContent = 'Experience hidden gems with local guides that you cannot find in regular tours';
    
    // 登録メニューの翻訳
    document.querySelectorAll('.dropdown-menu .dropdown-item').forEach(function(item) {
      if (item.textContent.includes('旅行者として登録')) {
        const title = item.querySelector('.fw-bold');
        const desc = item.querySelector('.small');
        if (title) title.textContent = 'Register as Tourist';
        if (desc) desc.textContent = 'Experience unique trips with local guides';
      }
      else if (item.textContent.includes('ガイドとして登録')) {
        const title = item.querySelector('.fw-bold');
        const desc = item.querySelector('.small');
        if (title) title.textContent = 'Register as Guide';
        if (desc) desc.textContent = 'Share your knowledge and experience';
      }
    });
    
    // セクションタイトルと見出しの翻訳
    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(function(title) {
      if (title.textContent.includes('人気のガイド')) title.textContent = 'Popular Guides';
      else if (title.textContent.includes('使い方')) title.textContent = 'How It Works';
      else if (title.textContent.includes('ガイドとして活躍')) title.textContent = 'Benefits of Being a Guide';
      else if (title.textContent.includes('ガイドになる')) title.textContent = 'Benefits of Being a Guide';
      else if (title.textContent.includes('アカウント登録')) title.textContent = 'Create Account';
      else if (title.textContent.includes('ガイドを探す')) title.textContent = 'Find Guides';
      else if (title.textContent.includes('予約して楽しむ')) title.textContent = 'Book and Enjoy';
    });
    
    // Benefits section subtitle
    const benefitSubtitle = document.querySelector('#benefits-section p');
    if (benefitSubtitle && benefitSubtitle.textContent.includes('あなたの知識と経験を活かして')) {
      benefitSubtitle.textContent = 'Share your knowledge and experience to provide special experiences for travelers from around the world';
    }
    
    // 検索フィルターカードの翻訳
    document.querySelectorAll('.card-header, .card-body h5, .card-title').forEach(function(elem) {
      if (elem.textContent.includes('ガイドを絞り込む')) elem.textContent = 'Filter Guides';
      else if (elem.textContent.includes('キーワード')) elem.textContent = 'Keywords';
    });
    
    // 検索フォームのラベル翻訳
    document.querySelectorAll('label, .form-label, th, .col-form-label').forEach(function(label) {
      if (label.textContent.includes('地域')) label.textContent = 'Region';
      else if (label.textContent.includes('言語')) label.textContent = 'Language';
      else if (label.textContent.includes('料金')) label.textContent = 'Fee';
      else if (label.textContent.includes('キーワード')) label.textContent = 'Keywords';
    });
    
    // フォームセレクトのオプションの翻訳
    document.querySelectorAll('select option').forEach(function(option) {
      if (option.textContent === 'すべて') option.textContent = 'All';
    });
    
    // チェックボックスラベルの翻訳 - より正確なセレクタを使用
    document.querySelectorAll('.form-check-label, .form-check input[type="checkbox"] + label').forEach(function(label) {
      if (label.textContent.includes('ナイトツアー')) label.textContent = 'Night Tours';
      else if (label.textContent.includes('グルメ')) label.textContent = 'Gourmet';
      else if (label.textContent.includes('写真スポット')) label.textContent = 'Photo Spots';
      else if (label.textContent.includes('料理')) label.textContent = 'Cooking';
      else if (label.textContent.includes('アクティビティ')) label.textContent = 'Activities';
    });
    
    // 入力フィールドのプレースホルダーの翻訳 - 完全一致でなく部分一致で探す
    document.querySelectorAll('input, textarea').forEach(function(input) {
      if (input.placeholder && (
          input.placeholder.includes('その他のキーワード') || 
          input.placeholder.includes('キーワードを入力') ||
          input.placeholder.includes('コンマ区切り')
      )) {
        input.placeholder = 'Enter other keywords (separate with commas)';
      }
    });
    
    // ガイド紹介カードの翻訳（複数のセレクタとパターンを使用してより確実に翻訳）
    document.querySelectorAll('.card').forEach(function(card) {
      // ガイド名の下の説明文の翻訳
      const descriptions = card.querySelectorAll('p');
      descriptions.forEach(function(description) {
        if (description.textContent.includes('東京在住の食文化')) {
          description.textContent = 'A detailed guide to Tokyo\'s food culture, taking you to hidden gems known only to locals.';
        } else if (description.textContent.includes('京都在住10年')) {
          description.textContent = 'Resident of Kyoto for 10 years, conveying various attractions from historical temples and shrines to modern Kyoto.';
        } else if (description.textContent.includes('大阪のストリートフード')) {
          description.textContent = 'Local guide specializing in Osaka\'s street food and nightlife, experience the hospitality and personality of Osaka!';
        }
      });
      
      // 言語表示の翻訳
      const languageTexts = card.querySelectorAll('.small, small, .guide-languages');
      languageTexts.forEach(function(text) {
        if (text && text.textContent.includes('言語:')) {
          text.textContent = text.textContent
            .replace('言語:', 'Languages:')
            .replace('日本語', 'Japanese')
            .replace('英語', 'English')
            .replace('中国語', 'Chinese');
        }
      });
      
      // 料金表示の翻訳
      const priceTexts = card.querySelectorAll('.guide-price, .price, .fee, .guide-fee');
      priceTexts.forEach(function(price) {
        if (price && price.textContent.includes('/回')) {
          price.textContent = price.textContent.replace('/回', '/session');
        }
      });
      
      // すべてのボタンの翻訳
      const buttons = card.querySelectorAll('a.btn, button.btn');
      buttons.forEach(function(button) {
        if (button.textContent.includes('詳細を見る')) {
          button.textContent = 'See Details';
        } else if (button.textContent.includes('もっと見る')) {
          button.textContent = 'See More';
        }
      });
      
      // 認証バッジの翻訳
      const badges = card.querySelectorAll('.badge, .verified-badge');
      badges.forEach(function(badge) {
        if (badge && badge.textContent.includes('認証済み')) {
          badge.textContent = 'Verified';
        }
      });
    });
    
    // 使い方セクションの翻訳
    const howItWorksSection = document.querySelector('#how-it-works');
    if (howItWorksSection) {
      // ステップタイトルの翻訳
      howItWorksSection.querySelectorAll('h5, h6, .step-title').forEach(function(title) {
        if (title.textContent.includes('アカウント登録')) title.textContent = 'Create Account';
        else if (title.textContent.includes('ガイドを探す')) title.textContent = 'Find Guides';
        else if (title.textContent.includes('予約して楽しむ')) title.textContent = 'Book and Enjoy';
      });
      
      // ステップ説明の翻訳
      howItWorksSection.querySelectorAll('.step-description, p').forEach(function(desc) {
        if (desc.textContent.includes('簡単な情報入力と電話番号認証')) {
          desc.textContent = 'Simple information input and phone number verification';
        } else if (desc.textContent.includes('場所、言語、専門性などで理想のガイド')) {
          desc.textContent = 'Search for ideal guides by location, language, and specialties';
        } else if (desc.textContent.includes('希望の日時で予約し、特別な体験')) {
          desc.textContent = 'Book on your preferred date and enjoy a special experience';
        }
      });
      
      // タブの翻訳
      const touristTab = howItWorksSection.querySelector('#touristTab');
      const guideTab = howItWorksSection.querySelector('#guideTab');
      if (touristTab) touristTab.textContent = 'For Tourists';
      if (guideTab) guideTab.textContent = 'For Guides';
    }
    
    // ベネフィットセクションの見出しを翻訳
    const benefitSectionTitle = document.querySelector('#benefits-section h2, .benefit-section-title');
    if (benefitSectionTitle && benefitSectionTitle.textContent.includes('ガイドとして活躍')) {
      benefitSectionTitle.textContent = 'Benefits of Being a Guide';
    }

    // ベネフィットカードのタイトルを翻訳 - より広範囲のセレクタ
    document.querySelectorAll('.card h5, .card h4, .card-title, .benefit-card-title, .card-header, .benefit-title').forEach(function(title) {
      if (title.textContent.includes('あなたの日常が観光資源')) title.textContent = 'Your Daily Life Becomes a Tourist Attraction';
      else if (title.textContent.includes('観光客の方を友達')) title.textContent = 'Welcome Tourists as Friends';
      else if (title.textContent.includes('隙間時間を使って')) title.textContent = 'Work Efficiently in Your Free Time';
      else if (title.textContent.includes('自分の好きなこと')) title.textContent = 'Do What You Love';
      else if (title.textContent.includes('世界中の人と')) title.textContent = 'Meet People from Around the World';
      else if (title.textContent.includes('語学力を活かし')) title.textContent = 'Improve Your Language Skills';
      else if (title.textContent.includes('地元への愛着')) title.textContent = 'Deepen Your Love for Your Hometown';
      else if (title.textContent.includes('安心のサポート体制')) title.textContent = 'Reliable Support System';
      else if (title.textContent.includes('自分のペースで')) title.textContent = 'Work at Your Own Pace';
      else if (title.textContent.includes('地域活性化')) title.textContent = 'Contribute to Local Economy';
    });
    
    document.querySelectorAll('.card p, .card-body p, p').forEach(function(p) {
      if (p.textContent.includes('地元の方だけが知る特別な場所')) {
        p.textContent = 'By sharing special places that only locals know about, your everyday surroundings become valuable tourism resources.';
      } else if (p.textContent.includes('形式ばったガイドツアー')) {
        p.textContent = 'Rather than a formal guided tour, you can naturally convey the charm of your local area as if spending time with friends.';
      } else if (p.textContent.includes('自分の都合の良い時間')) {
        p.textContent = 'You can set your schedule according to your convenience, allowing you to earn income while balancing with your main job or studies.';
      } else if (p.textContent.includes('趣味や特技、専門知識')) {
        p.textContent = 'By providing unique guided experiences that utilize your hobbies, skills, and specialized knowledge, you can turn your passion into income.';
      } else if (p.textContent.includes('様々な国や文化から来た旅行者との交流')) {
        p.textContent = 'Interact with travelers from different countries and cultures, expanding your international network and deepening cross-cultural understanding.';
      } else if (p.textContent.includes('外国語を使う実践的な機会')) {
        p.textContent = 'Gain practical opportunities to use foreign languages, naturally improving your communication skills.';
      } else if (p.textContent.includes('地元の魅力を発信することで')) {
        p.textContent = 'By promoting the attractions of your local area, you will develop a deeper appreciation and attachment to your hometown.';
      } else if (p.textContent.includes('予約を受ける日時や頻度は完全に自分')) {
        p.textContent = 'When and how often you accept bookings is completely up to you, allowing for a lifestyle that suits your needs.';
      } else if (p.textContent.includes('予約管理、決済、保険など')) {
        p.textContent = 'We provide the essential support for guide activities such as reservation management, payment, and insurance, so you can work with peace of mind.';
      } else if (p.textContent.includes('観光客を地元のお店や施設')) {
        p.textContent = 'By introducing tourists to local shops and facilities, you contribute to the revitalization of the local economy and community development.';
      }
    });

    // 「もっと見る」ボタンを翻訳
    document.querySelectorAll('.btn-primary').forEach(function(btn) {
      if (btn.textContent.trim() === 'もっと見る') {
        btn.textContent = 'See More';
      }
    });

    // 「ガイドとして登録する」ボタンを翻訳
    document.querySelectorAll('a.btn-primary, button.btn-primary').forEach(function(btn) {
      if (btn.textContent.trim() === 'ガイドとして登録する') {
        btn.textContent = 'Register as Guide';
      }
    });
    
    // タイトル変更
    document.title = 'Local Guide - Experience Special Journeys';
  }
});