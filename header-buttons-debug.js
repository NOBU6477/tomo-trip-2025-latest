/**
 * ヘッダーボタン専用デバッグスクリプト
 * DOMContentLoaded競合問題の解決とボタン動作の確実な実装
 */

(function() {
  'use strict';
  
  console.log('🔧 ヘッダーボタンデバッグスクリプト開始');
  
  // グローバル初期化フラグ
  window.headerButtonsInitialized = false;
  
  function debugButtonElements() {
    console.log('=== ボタン要素デバッグ ===');
    
    const homeBtn = document.getElementById('btn-home');
    const guidesBtn = document.getElementById('btn-guides');
    const howItWorksBtn = document.getElementById('btn-how-it-works');
    const langJaBtn = document.getElementById('lang-ja');
    const langEnBtn = document.getElementById('lang-en');
    
    console.log('ホームボタン:', homeBtn);
    console.log('ガイドを探すボタン:', guidesBtn);
    console.log('使い方ボタン:', howItWorksBtn);
    console.log('日本語ボタン:', langJaBtn);
    console.log('Englishボタン:', langEnBtn);
    
    if (homeBtn) console.log('✅ ホームボタン存在');
    if (guidesBtn) console.log('✅ ガイドを探すボタン存在');
    if (howItWorksBtn) console.log('✅ 使い方ボタン存在');
    if (langJaBtn) console.log('✅ 日本語ボタン存在');
    if (langEnBtn) console.log('✅ Englishボタン存在');
    
    return {
      homeBtn, guidesBtn, howItWorksBtn, langJaBtn, langEnBtn
    };
  }
  
  function initializeHeaderButtons() {
    if (window.headerButtonsInitialized) {
      console.log('⚠️ ボタンは既に初期化済み');
      return;
    }
    
    console.log('🚀 ヘッダーボタン初期化開始');
    
    const buttons = debugButtonElements();
    
    // ホームボタン
    if (buttons.homeBtn) {
      buttons.homeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('🏠 ホームボタンクリック実行');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      console.log('✅ ホームボタンイベント設定完了');
    } else {
      console.error('❌ ホームボタンが見つかりません');
    }
    
    // ガイドを探すボタン
    if (buttons.guidesBtn) {
      buttons.guidesBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('🔍 ガイドを探すボタンクリック実行');
        const guidesSection = document.getElementById('guides');
        if (guidesSection) {
          guidesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          console.error('❌ ガイドセクションが見つかりません');
        }
      });
      console.log('✅ ガイドを探すボタンイベント設定完了');
    } else {
      console.error('❌ ガイドを探すボタンが見つかりません');
    }
    
    // 使い方ボタン
    if (buttons.howItWorksBtn) {
      buttons.howItWorksBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('📖 使い方ボタンクリック実行');
        const howItWorksSection = document.getElementById('how-it-works');
        if (howItWorksSection) {
          howItWorksSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          console.error('❌ 使い方セクションが見つかりません');
        }
      });
      console.log('✅ 使い方ボタンイベント設定完了');
    } else {
      console.error('❌ 使い方ボタンが見つかりません');
    }
    
    // 日本語選択ボタン
    if (buttons.langJaBtn) {
      buttons.langJaBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('🇯🇵 日本語選択実行');
        const languageButton = document.getElementById('languageDropdown');
        if (languageButton) {
          languageButton.textContent = '日本語';
        }
        // 通知機能があれば実行
        if (typeof showNotification === 'function') {
          showNotification('言語を日本語に変更しました', 'success');
        }
      });
      console.log('✅ 日本語ボタンイベント設定完了');
    } else {
      console.error('❌ 日本語ボタンが見つかりません');
    }
    
    // English選択ボタン
    if (buttons.langEnBtn) {
      buttons.langEnBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('🇺🇸 English選択実行');
        const languageButton = document.getElementById('languageDropdown');
        if (languageButton) {
          languageButton.textContent = 'English';
        }
        // 通知機能があれば実行
        if (typeof showNotification === 'function') {
          showNotification('言語をEnglishに変更しました', 'success');
        }
      });
      console.log('✅ Englishボタンイベント設定完了');
    } else {
      console.error('❌ Englishボタンが見つかりません');
    }
    
    window.headerButtonsInitialized = true;
    console.log('🎉 ヘッダーボタン初期化完了');
  }
  
  // 即座に実行を試行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeHeaderButtons);
  } else {
    initializeHeaderButtons();
  }
  
  // 追加の安全な初期化
  setTimeout(initializeHeaderButtons, 500);
  setTimeout(initializeHeaderButtons, 1500);
  
  // グローバル関数として公開
  window.initializeHeaderButtons = initializeHeaderButtons;
  window.debugButtonElements = debugButtonElements;
  
})();