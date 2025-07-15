/**
 * 静的サイト切り替えシステム
 * 日本語サイトと英語サイトの独立した切り替え機能
 */

(function() {
  'use strict';
  
  console.log('🌐 静的サイト切り替えシステム開始');
  
  function getCurrentSite() {
    const path = window.location.pathname;
    if (path.includes('index-en.html') || path.includes('en.html')) {
      return 'english';
    }
    return 'japanese';
  }
  
  function setupLanguageSwitcher() {
    // 言語切り替えボタンの設定
    const languageDropdown = document.getElementById('languageDropdown');
    const languageLinks = document.querySelectorAll('.dropdown-menu a[href*="index"], .dropdown-menu a[href*="en"]');
    
    if (languageDropdown) {
      const currentSite = getCurrentSite();
      
      // 現在のサイトに応じてボタンテキストを設定
      if (currentSite === 'english') {
        languageDropdown.textContent = 'English';
      } else {
        languageDropdown.textContent = '日本語';
      }
      
      console.log(`🔤 現在のサイト: ${currentSite}`);
    }
    
    // 言語切り替えリンクにクリックイベントを追加
    languageLinks.forEach(link => {
      link.addEventListener('click', function(event) {
        event.preventDefault();
        
        const targetUrl = this.getAttribute('href');
        console.log(`🔄 サイト切り替え: ${targetUrl}`);
        
        // 現在の状態を保存（必要に応じて）
        saveCurrentState();
        
        // ページ遷移
        window.location.href = targetUrl;
      });
    });
  }
  
  function saveCurrentState() {
    // フィルター設定やユーザー状態を保存
    const currentState = {
      timestamp: Date.now(),
      filters: {
        location: document.getElementById('location-filter')?.value || '',
        language: document.getElementById('language-filter')?.value || '',
        fee: document.getElementById('fee-filter')?.value || ''
      },
      scrollPosition: window.pageYOffset
    };
    
    try {
      sessionStorage.setItem('siteState', JSON.stringify(currentState));
      console.log('💾 サイト状態保存完了');
    } catch (error) {
      console.error('サイト状態保存エラー:', error);
    }
  }
  
  function restoreState() {
    try {
      const savedState = sessionStorage.getItem('siteState');
      if (savedState) {
        const state = JSON.parse(savedState);
        
        // フィルター状態の復元
        if (state.filters) {
          const locationFilter = document.getElementById('location-filter');
          const languageFilter = document.getElementById('language-filter');
          const feeFilter = document.getElementById('fee-filter');
          
          if (locationFilter && state.filters.location) {
            locationFilter.value = state.filters.location;
          }
          if (languageFilter && state.filters.language) {
            languageFilter.value = state.filters.language;
          }
          if (feeFilter && state.filters.fee) {
            feeFilter.value = state.filters.fee;
          }
        }
        
        // スクロール位置の復元
        if (state.scrollPosition) {
          setTimeout(() => {
            window.scrollTo(0, state.scrollPosition);
          }, 100);
        }
        
        console.log('🔄 サイト状態復元完了');
      }
    } catch (error) {
      console.error('サイト状態復元エラー:', error);
    }
  }
  
  function createSiteIndicator() {
    const currentSite = getCurrentSite();
    const indicator = document.createElement('div');
    indicator.id = 'site-indicator';
    indicator.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: ${currentSite === 'english' ? '#dc3545' : '#0d6efd'};
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 12px;
      z-index: 1000;
      opacity: 0.8;
    `;
    indicator.textContent = currentSite === 'english' ? 'English Site' : '日本語サイト';
    
    document.body.appendChild(indicator);
    
    // 3秒後に非表示
    setTimeout(() => {
      indicator.style.opacity = '0';
      setTimeout(() => {
        if (indicator.parentNode) {
          indicator.parentNode.removeChild(indicator);
        }
      }, 300);
    }, 3000);
  }
  
  function preventDynamicTranslation() {
    // 動的翻訳スクリプトの無効化
    const translationScripts = [
      'dynamic-content-translation.js',
      'complete-language-fix.js',
      'direct-translation.js',
      'language-switcher.js'
    ];
    
    translationScripts.forEach(scriptName => {
      const scripts = document.querySelectorAll(`script[src*="${scriptName}"]`);
      scripts.forEach(script => {
        script.remove();
        console.log(`🚫 動的翻訳スクリプト削除: ${scriptName}`);
      });
    });
  }
  
  function initialize() {
    setupLanguageSwitcher();
    restoreState();
    createSiteIndicator();
    preventDynamicTranslation();
    
    console.log('✅ 静的サイト切り替えシステム初期化完了');
  }
  
  // 初期化実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
  // ページ離脱時に状態保存
  window.addEventListener('beforeunload', saveCurrentState);
  
})();