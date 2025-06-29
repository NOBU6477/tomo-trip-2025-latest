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
    
    // 1. ホームボタン修正
    const homeBtn = document.getElementById('btn-home');
    if (homeBtn) {
      homeBtn.onclick = function(e) {
        e.preventDefault();
        console.log('🏠 ホームクリック');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return false;
      };
      console.log('✅ ホームボタン修正完了');
    } else {
      console.log('❌ ホームボタンなし');
    }
    
    // 2. ガイドを探すボタン修正
    const guidesBtn = document.getElementById('btn-guides');
    if (guidesBtn) {
      guidesBtn.onclick = function(e) {
        e.preventDefault();
        console.log('🔍 ガイドを探すクリック');
        
        // ガイド検索セクションにスクロール
        const guideSection = document.getElementById('guide-search-section') || 
                           document.querySelector('.guide-filters-section') ||
                           document.querySelector('[id*="guide"]');
        
        if (guideSection) {
          guideSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          console.log('📍 ガイドセクションにスクロール');
        } else {
          console.log('⚠️ ガイドセクション見つからず - トップにスクロール');
          window.scrollTo({ top: 500, behavior: 'smooth' });
        }
        return false;
      };
      console.log('✅ ガイドボタン修正完了');
    } else {
      console.log('❌ ガイドボタンなし');
    }
    
    // 3. 使い方ボタン修正
    const howBtn = document.getElementById('btn-how-it-works');
    if (howBtn) {
      howBtn.onclick = function(e) {
        e.preventDefault();
        console.log('📖 使い方クリック');
        
        // 使い方セクションを探す
        const howSection = document.getElementById('how-it-works') ||
                          document.querySelector('.how-it-works') ||
                          document.querySelector('[id*="how"]');
        
        if (howSection) {
          howSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          console.log('📍 使い方セクションにスクロール');
        } else {
          console.log('⚠️ 使い方セクション見つからず');
          window.scrollTo({ top: 1000, behavior: 'smooth' });
        }
        return false;
      };
      console.log('✅ 使い方ボタン修正完了');
    } else {
      console.log('❌ 使い方ボタンなし');
    }
    
    // 4. 言語ボタン修正
    const langJaBtn = document.getElementById('lang-ja');
    if (langJaBtn) {
      langJaBtn.onclick = function(e) {
        e.preventDefault();
        console.log('🇯🇵 日本語選択');
        setLanguage('ja');
        return false;
      };
      console.log('✅ 日本語ボタン修正完了');
    } else {
      console.log('❌ 日本語ボタンなし');
    }
    
    const langEnBtn = document.getElementById('lang-en');
    if (langEnBtn) {
      langEnBtn.onclick = function(e) {
        e.preventDefault();
        console.log('🇺🇸 English選択');
        setLanguage('en');
        return false;
      };
      console.log('✅ Englishボタン修正完了');
    } else {
      console.log('❌ Englishボタンなし');
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