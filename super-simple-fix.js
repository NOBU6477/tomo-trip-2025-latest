/**
 * 超シンプルボタン修正 - HTMLに直接埋め込み
 */

// ページが完全に読み込まれてから実行
window.addEventListener('load', function() {
  console.log('🔧 超シンプル修正開始');
  
  // 1秒後に実行（確実にページが準備できてから）
  setTimeout(function() {
    
    // ホームボタン
    var homeBtn = document.getElementById('btn-home');
    if (homeBtn) {
      homeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('🏠 ホームボタンが動きました！');
        window.scrollTo(0, 0);
      });
      console.log('✅ ホームボタン設定完了');
    } else {
      console.log('❌ ホームボタンが見つかりません');
    }
    
    // ガイドを探すボタン
    var guidesBtn = document.getElementById('btn-guides');
    if (guidesBtn) {
      guidesBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('🔍 ガイドボタンが動きました！');
        var guidesSection = document.getElementById('guides');
        if (guidesSection) {
          guidesSection.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo(0, 800);
        }
      });
      console.log('✅ ガイドボタン設定完了');
    } else {
      console.log('❌ ガイドボタンが見つかりません');
    }
    
    // 使い方ボタン
    var howBtn = document.getElementById('btn-how-it-works');
    if (howBtn) {
      howBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('📖 使い方ボタンが動きました！');
        var howSection = document.getElementById('how-it-works');
        if (howSection) {
          howSection.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo(0, 1200);
        }
      });
      console.log('✅ 使い方ボタン設定完了');
    } else {
      console.log('❌ 使い方ボタンが見つかりません');
    }
    
    // 日本語ボタン
    var jaBtn = document.getElementById('lang-ja');
    if (jaBtn) {
      jaBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('🇯🇵 日本語ボタンが動きました！');
      });
      console.log('✅ 日本語ボタン設定完了');
    } else {
      console.log('❌ 日本語ボタンが見つかりません');
    }
    
    // Englishボタン
    var enBtn = document.getElementById('lang-en');
    if (enBtn) {
      enBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('🇺🇸 Englishボタンが動きました！');
      });
      console.log('✅ Englishボタン設定完了');
    } else {
      console.log('❌ Englishボタンが見つかりません');
    }
    
    console.log('🎉 すべてのボタン設定が完了しました！');
    
  }, 1000);
});