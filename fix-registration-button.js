/**
 * 新規登録ボタン修正スクリプト
 * 「投資営業」などの誤表示を完全に修正
 */

(function() {
  'use strict';

  console.log('新規登録ボタン修正システム開始');

  function fixRegistrationButton() {
    // ナビゲーションバーの新規登録ボタンを修正
    const navButtons = document.querySelectorAll('button, .btn');
    
    navButtons.forEach(button => {
      const text = button.textContent.trim();
      
      // 「投資営業」や誤った表示を修正
      if (text.includes('投資営業') || 
          text.includes('Sign Up') || 
          text.includes('Register') ||
          text === '投資営業' ||
          (button.className.includes('btn-light') && 
           button.closest('#navbarNav') &&
           !text.includes('新規登録') &&
           !text.includes('ログイン'))) {
        
        console.log('新規登録ボタンを修正:', text, '→ 新規登録');
        button.innerHTML = '新規登録';
        
        // イベントリスナーも正しく設定
        button.onclick = function() {
          showRegisterOptions();
        };
      }
    });

    // 特定のIDやクラスで新規登録ボタンを修正
    const specificButtons = document.querySelectorAll('#navbar-user-area button:last-child, .btn-light');
    specificButtons.forEach(button => {
      if (button.closest('#navbar-user-area') && 
          !button.textContent.includes('新規登録')) {
        console.log('ナビゲーション新規登録ボタン修正');
        button.textContent = '新規登録';
        button.onclick = function() {
          showRegisterOptions();
        };
      }
    });

    // 直接的な要素修正
    const userArea = document.getElementById('navbar-user-area');
    if (userArea) {
      const buttons = userArea.querySelectorAll('button');
      if (buttons.length >= 2) {
        const registerBtn = buttons[1]; // 2番目のボタン（新規登録）
        if (registerBtn && !registerBtn.textContent.includes('新規登録')) {
          console.log('直接修正:', registerBtn.textContent, '→ 新規登録');
          registerBtn.textContent = '新規登録';
          registerBtn.onclick = function() {
            showRegisterOptions();
          };
        }
      }
    }
  }

  // 協賛店表示の動的システム
  function setupDynamicSponsors() {
    // 協賛店データ配列
    const sponsors = [
      {
        name: "海の家レストラン",
        image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=100&h=60&fit=crop",
        offer: "20%OFF"
      },
      {
        name: "山田温泉ホテル",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&h=60&fit=crop",
        offer: "特別価格"
      },
      {
        name: "サクラ観光バス",
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=100&h=60&fit=crop",
        offer: "送迎無料"
      },
      {
        name: "伝統工芸体験館",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=60&fit=crop",
        offer: "体験割引"
      },
      {
        name: "地元特産品店",
        image: "https://images.unsplash.com/photo-1543083115-638c32cd3d58?w=100&h=60&fit=crop",
        offer: "お土産10%OFF"
      },
      {
        name: "カフェ桜",
        image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=100&h=60&fit=crop",
        offer: "ドリンク1杯無料"
      },
      {
        name: "釣り船太郎",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100&h=60&fit=crop",
        offer: "初回半額"
      },
      {
        name: "レンタル自転車",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=60&fit=crop",
        offer: "1日レンタル"
      }
    ];

    // ローカルストレージから追加の協賛店を取得
    function getStoredSponsors() {
      try {
        const stored = localStorage.getItem('additional_sponsors');
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        console.log('協賛店データの読み込みエラー:', e);
        return [];
      }
    }

    // 協賛店を保存
    function addSponsor(sponsor) {
      try {
        const stored = getStoredSponsors();
        stored.push(sponsor);
        localStorage.setItem('additional_sponsors', JSON.stringify(stored));
        updateSponsorDisplay();
      } catch (e) {
        console.log('協賛店データの保存エラー:', e);
      }
    }

    // 協賛店表示を更新
    function updateSponsorDisplay() {
      const sponsorScroll = document.querySelector('.sponsor-scroll');
      if (!sponsorScroll) return;

      const allSponsors = [...sponsors, ...getStoredSponsors()];
      
      // 協賛店が少ない場合は繰り返し表示
      const displaySponsors = allSponsors.length < 4 ? 
        [...allSponsors, ...allSponsors, ...allSponsors] : 
        [...allSponsors, ...allSponsors]; // 2回繰り返し

      sponsorScroll.innerHTML = '';
      
      displaySponsors.forEach(sponsor => {
        const sponsorItem = document.createElement('div');
        sponsorItem.className = 'sponsor-item';
        sponsorItem.innerHTML = `
          <img src="${sponsor.image}" alt="${sponsor.name}" class="sponsor-logo" onerror="this.style.display='none'">
          <span class="sponsor-text">${sponsor.name}</span>
          <span class="sponsor-offer">${sponsor.offer}</span>
        `;
        sponsorScroll.appendChild(sponsorItem);
      });

      console.log(`協賛店表示更新: ${allSponsors.length}件の協賛店`);
    }

    // 初期表示更新
    updateSponsorDisplay();

    // グローバル関数として公開
    window.addSponsor = addSponsor;
    window.updateSponsorDisplay = updateSponsorDisplay;
  }

  // 即座に実行
  fixRegistrationButton();
  setupDynamicSponsors();

  // DOM読み込み後に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      fixRegistrationButton();
      setupDynamicSponsors();
    });
  }

  // 継続的な監視
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' || mutation.type === 'characterData') {
        setTimeout(fixRegistrationButton, 100);
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });

  // 定期的な修正
  setInterval(fixRegistrationButton, 2000);

  console.log('新規登録ボタン修正システム完了');
})();