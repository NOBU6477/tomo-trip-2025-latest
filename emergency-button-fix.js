/**
 * 緊急ボタン修正スクリプト
 * HTMLに直接埋め込んで確実に動作させる
 */

// 即座に実行される緊急修正
(function() {
  'use strict';
  
  console.log('🚨 緊急ボタン修正スクリプト開始');
  
  function emergencyFixButtons() {
    console.log('=== 緊急修正実行中 ===');
    
    // HTMLの実際の構造を調査
    console.log('📋 HTML構造チェック:');
    console.log('- nav要素:', document.querySelector('nav'));
    console.log('- navbar-nav:', document.querySelector('.navbar-nav'));
    console.log('- すべてのaタグ:', document.querySelectorAll('nav a').length + '個');
    
    // 1. ホームボタン修正（実際のHTML構造に基づく）
    const homeBtn = document.getElementById('btn-home');
    console.log('ホームボタン検索結果:', homeBtn);
    
    if (homeBtn) {
      // 既存のイベントをクリア
      homeBtn.onclick = null;
      homeBtn.removeAttribute('onclick');
      
      // 新しいイベントハンドラーを設定
      homeBtn.onclick = function(e) {
        e.preventDefault();
        console.log('🏠 ホームクリック成功');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return false;
      };
      
      // 追加の確認用イベントリスナー
      homeBtn.addEventListener('click', function(e) {
        console.log('🏠 addEventListener経由でもクリック検出');
      });
      
      console.log('✅ ホームボタン修正完了');
    } else {
      console.log('❌ ホームボタンなし - 代替検索実行');
      const altHomeBtn = document.querySelector('a[href="#"]:contains("ホーム")') || 
                        document.querySelector('.nav-link:first-child') ||
                        document.querySelector('nav a:first-child');
      console.log('代替ホームボタン:', altHomeBtn);
      
      if (altHomeBtn) {
        altHomeBtn.onclick = function(e) {
          e.preventDefault();
          console.log('🏠 代替ホームクリック');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return false;
        };
        console.log('✅ 代替ホームボタン修正完了');
      }
    }
    
    // 2. ガイドを探すボタン修正
    const guidesBtn = document.getElementById('btn-guides');
    console.log('ガイドボタン検索結果:', guidesBtn);
    
    if (guidesBtn) {
      guidesBtn.onclick = null;
      guidesBtn.removeAttribute('onclick');
      
      guidesBtn.onclick = function(e) {
        e.preventDefault();
        console.log('🔍 ガイドを探すクリック成功');
        
        // ガイド検索セクションにスクロール
        const guideSection = document.getElementById('guides') || 
                           document.querySelector('#guide-search-section') ||
                           document.querySelector('.guide-filters-section') ||
                           document.querySelector('[id*="guide"]');
        
        console.log('ガイドセクション検索結果:', guideSection);
        
        if (guideSection) {
          guideSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          console.log('📍 ガイドセクションにスクロール実行');
        } else {
          console.log('⚠️ ガイドセクション見つからず - 代替スクロール');
          window.scrollTo({ top: 800, behavior: 'smooth' });
        }
        return false;
      };
      
      guidesBtn.addEventListener('click', function(e) {
        console.log('🔍 addEventListener経由でもガイドクリック検出');
      });
      
      console.log('✅ ガイドボタン修正完了');
    } else {
      console.log('❌ ガイドボタンなし - 代替検索実行');
      const altGuidesBtn = document.querySelector('a:contains("ガイドを探す")') ||
                          document.querySelector('.nav-link:nth-child(2)');
      console.log('代替ガイドボタン:', altGuidesBtn);
    }
    
    // 3. 使い方ボタン修正
    const howBtn = document.getElementById('btn-how-it-works');
    console.log('使い方ボタン検索結果:', howBtn);
    
    if (howBtn) {
      howBtn.onclick = null;
      howBtn.removeAttribute('onclick');
      
      howBtn.onclick = function(e) {
        e.preventDefault();
        console.log('📖 使い方クリック成功');
        
        // 使い方セクションを探す
        const howSection = document.getElementById('how-it-works') ||
                          document.querySelector('.how-it-works') ||
                          document.querySelector('[id*="how"]') ||
                          document.querySelector('section:nth-child(3)');
        
        console.log('使い方セクション検索結果:', howSection);
        
        if (howSection) {
          howSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          console.log('📍 使い方セクションにスクロール実行');
        } else {
          console.log('⚠️ 使い方セクション見つからず - 代替スクロール');
          window.scrollTo({ top: 1200, behavior: 'smooth' });
        }
        return false;
      };
      
      howBtn.addEventListener('click', function(e) {
        console.log('📖 addEventListener経由でも使い方クリック検出');
      });
      
      console.log('✅ 使い方ボタン修正完了');
    } else {
      console.log('❌ 使い方ボタンなし');
    }
    
    // 4. 言語ボタン修正
    const langJaBtn = document.getElementById('lang-ja');
    const langEnBtn = document.getElementById('lang-en');
    
    console.log('日本語ボタン検索結果:', langJaBtn);
    console.log('Englishボタン検索結果:', langEnBtn);
    
    if (langJaBtn) {
      langJaBtn.onclick = null;
      langJaBtn.removeAttribute('onclick');
      
      langJaBtn.onclick = function(e) {
        e.preventDefault();
        console.log('🇯🇵 日本語選択成功');
        setLanguage('ja');
        return false;
      };
      
      langJaBtn.addEventListener('click', function(e) {
        console.log('🇯🇵 addEventListener経由でも日本語クリック検出');
      });
      
      console.log('✅ 日本語ボタン修正完了');
    } else {
      console.log('❌ 日本語ボタンなし');
      const altJaBtn = document.querySelector('a:contains("日本語")');
      console.log('代替日本語ボタン:', altJaBtn);
    }
    
    if (langEnBtn) {
      langEnBtn.onclick = null;
      langEnBtn.removeAttribute('onclick');
      
      langEnBtn.onclick = function(e) {
        e.preventDefault();
        console.log('🇺🇸 English選択成功');
        setLanguage('en');
        return false;
      };
      
      langEnBtn.addEventListener('click', function(e) {
        console.log('🇺🇸 addEventListener経由でもEnglishクリック検出');
      });
      
      console.log('✅ Englishボタン修正完了');
    } else {
      console.log('❌ Englishボタンなし');
      const altEnBtn = document.querySelector('a:contains("English")');
      console.log('代替Englishボタン:', altEnBtn);
    }
    
    console.log('=== 緊急修正完了 ===');
  }
  
  // 言語設定関数
  function setLanguage(lang) {
    localStorage.setItem('preferredLanguage', lang);
    console.log('🌐 言語設定:', lang);
    
    // 既存の翻訳関数があれば実行
    if (typeof translatePage === 'function') {
      translatePage(lang);
    }
    
    // ページリロードで言語変更を反映
    setTimeout(() => {
      location.reload();
    }, 500);
  }
  
  // 複数タイミングで実行
  emergencyFixButtons();
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', emergencyFixButtons);
  }
  
  setTimeout(emergencyFixButtons, 500);
  setTimeout(emergencyFixButtons, 1500);
  
  // グローバル関数として公開
  window.emergencyFixButtons = emergencyFixButtons;
  
  console.log('🚨 緊急修正スクリプト準備完了');
  
})();