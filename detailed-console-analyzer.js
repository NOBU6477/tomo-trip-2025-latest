/**
 * 詳細コンソール分析システム
 * 「優」問題の完全解決のための総合分析
 */

(function() {
  'use strict';

  let analysisData = {};

  /**
   * セッションストレージの全データを詳細分析
   */
  function analyzeAllSessionData() {
    console.log('=== 📊 セッションストレージ全データ分析 ===');
    
    const allKeys = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      allKeys.push(sessionStorage.key(i));
    }
    
    console.log('🔑 保存されているキー一覧:', allKeys);
    
    allKeys.forEach(key => {
      const rawValue = sessionStorage.getItem(key);
      console.log(`\n📄 ${key}:`);
      console.log('  生データ:', rawValue);
      
      try {
        const parsed = JSON.parse(rawValue);
        console.log('  パース済み:', parsed);
        
        if (typeof parsed === 'object' && parsed !== null) {
          Object.keys(parsed).forEach(objKey => {
            const value = parsed[objKey];
            console.log(`    ${objKey}: "${value}" (type: ${typeof value})`);
            
            // 「優」を含むデータをマーク
            if (value === '優') {
              console.log(`    ⚠️ 「優」を発見: ${key}.${objKey}`);
              analysisData.foundYuu = analysisData.foundYuu || [];
              analysisData.foundYuu.push(`${key}.${objKey}`);
            }
          });
        }
      } catch (e) {
        console.log('  ⚠️ JSON解析不可:', e.message);
      }
    });
    
    return analysisData;
  }

  /**
   * DOM要素の現在状況を詳細分析
   */
  function analyzeDOMElements() {
    console.log('\n=== 🎯 DOM要素現在状況分析 ===');
    
    const targetElements = [
      'display-name',
      'display-username', 
      'user-name',
      'display-email',
      'display-location'
    ];
    
    targetElements.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        console.log(`\n🔍 ${id}:`);
        console.log(`  textContent: "${element.textContent}"`);
        console.log(`  innerHTML: "${element.innerHTML}"`);
        console.log(`  value: "${element.value || 'N/A'}"`);
        console.log(`  data-override-set: "${element.getAttribute('data-override-set')}"`);
        console.log(`  data-original-value: "${element.getAttribute('data-original-value')}"`);
        console.log(`  data-nuclear-fixed: "${element.getAttribute('data-nuclear-fixed')}"`);
        
        // 「優」の検出
        if (element.textContent === '優') {
          console.log(`  ⚠️ 「優」を検出: ${id}`);
          analysisData.domYuu = analysisData.domYuu || [];
          analysisData.domYuu.push(id);
        }
      } else {
        console.log(`❌ ${id}: 要素が見つかりません`);
      }
    });
  }

  /**
   * フォーム入力要素の分析
   */
  function analyzeFormElements() {
    console.log('\n=== 📝 フォーム入力要素分析 ===');
    
    const formElements = [
      'guide-name',
      'guide-username',
      'guide-email',
      'guide-location',
      'guide-description'
    ];
    
    formElements.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        console.log(`\n📝 ${id}:`);
        console.log(`  value: "${element.value}"`);
        console.log(`  placeholder: "${element.placeholder}"`);
        console.log(`  defaultValue: "${element.defaultValue}"`);
        
        if (element.value === '優') {
          console.log(`  ⚠️ フォームで「優」を検出: ${id}`);
          analysisData.formYuu = analysisData.formYuu || [];
          analysisData.formYuu.push(id);
        }
      }
    });
  }

  /**
   * 実行されているスクリプトの分析
   */
  function analyzeLoadedScripts() {
    console.log('\n=== 📜 読み込み済みスクリプト分析 ===');
    
    const scripts = document.querySelectorAll('script[src]');
    console.log(`📂 外部スクリプト数: ${scripts.length}`);
    
    Array.from(scripts).forEach((script, index) => {
      const src = script.src || script.getAttribute('src');
      console.log(`  ${index + 1}. ${src.split('/').pop()}`);
    });
    
    const inlineScripts = document.querySelectorAll('script:not([src])');
    console.log(`📄 インラインスクリプト数: ${inlineScripts.length}`);
  }

  /**
   * ブラウザコンソールのエラー分析
   */
  function analyzeConsoleErrors() {
    console.log('\n=== ⚠️ コンソールエラー分析 ===');
    
    // エラーキャッチャーを設定
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.error = function(...args) {
      console.log('🚨 ERROR発見:', args);
      analysisData.errors = analysisData.errors || [];
      analysisData.errors.push(args.join(' '));
      originalError.apply(console, args);
    };
    
    console.warn = function(...args) {
      console.log('⚠️ WARNING発見:', args);
      analysisData.warnings = analysisData.warnings || [];
      analysisData.warnings.push(args.join(' '));
      originalWarn.apply(console, args);
    };
  }

  /**
   * リアルタイム変更の監視
   */
  function setupRealTimeWatcher() {
    console.log('\n=== 👁️ リアルタイム変更監視開始 ===');
    
    const targetIds = ['display-name', 'display-username', 'user-name'];
    
    targetIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        const observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            console.log(`🔄 ${id} 変更検出:`, {
              type: mutation.type,
              oldValue: mutation.oldValue,
              newValue: element.textContent,
              timestamp: new Date().toISOString()
            });
            
            if (element.textContent === '優') {
              console.log(`🚨 「優」が設定されました: ${id}`);
              console.trace('設定元のスタックトレース:');
            }
          });
        });

        observer.observe(element, {
          childList: true,
          characterData: true,
          subtree: true,
          characterDataOldValue: true
        });
      }
    });
  }

  /**
   * 手動でのデータ強制設定テスト
   */
  function testManualDataSet() {
    console.log('\n=== 🧪 手動データ設定テスト ===');
    
    // セッションストレージから実データを取得
    const testData = getActualTestData();
    if (testData) {
      console.log('✅ テストデータ取得成功:', testData);
      
      // 手動で設定
      const nameElement = document.getElementById('display-name');
      const usernameElement = document.getElementById('display-username');
      
      if (nameElement) {
        nameElement.textContent = testData.name || 'テスト太郎';
        console.log(`🔧 display-name を手動設定: "${nameElement.textContent}"`);
      }
      
      if (usernameElement) {
        usernameElement.textContent = testData.username || 'test_user';
        console.log(`🔧 display-username を手動設定: "${usernameElement.textContent}"`);
      }
      
      // 3秒後に確認
      setTimeout(() => {
        console.log('\n⏰ 3秒後の確認:');
        if (nameElement) {
          console.log(`  display-name: "${nameElement.textContent}"`);
        }
        if (usernameElement) {
          console.log(`  display-username: "${usernameElement.textContent}"`);
        }
      }, 3000);
    } else {
      console.log('❌ テストデータが見つかりません');
    }
  }

  /**
   * 実際のテストデータを取得
   */
  function getActualTestData() {
    const sources = [
      'currentUser',
      'guideRegistrationData',
      'latestGuideRegistration'
    ];
    
    for (const key of sources) {
      try {
        const data = sessionStorage.getItem(key);
        if (data) {
          const parsed = JSON.parse(data);
          if (parsed && (parsed.name || parsed.firstName) && parsed.name !== '優') {
            return parsed;
          }
        }
      } catch (e) {
        continue;
      }
    }
    return null;
  }

  /**
   * 総合分析結果のレポート生成
   */
  function generateAnalysisReport() {
    setTimeout(() => {
      console.log('\n=== 📋 総合分析レポート ===');
      
      if (analysisData.foundYuu) {
        console.log('🚨 セッションストレージで「優」発見:', analysisData.foundYuu);
      }
      
      if (analysisData.domYuu) {
        console.log('🚨 DOM要素で「優」発見:', analysisData.domYuu);
      }
      
      if (analysisData.formYuu) {
        console.log('🚨 フォーム要素で「優」発見:', analysisData.formYuu);
      }
      
      if (analysisData.errors) {
        console.log('⚠️ エラー:', analysisData.errors);
      }
      
      if (analysisData.warnings) {
        console.log('⚠️ 警告:', analysisData.warnings);
      }
      
      console.log('📊 分析完了時刻:', new Date().toISOString());
    }, 5000);
  }

  /**
   * メイン実行関数
   */
  function runDetailedAnalysis() {
    console.log('🔍 詳細コンソール分析システム開始');
    
    analyzeConsoleErrors();
    analyzeAllSessionData();
    analyzeDOMElements();
    analyzeFormElements();
    analyzeLoadedScripts();
    setupRealTimeWatcher();
    testManualDataSet();
    generateAnalysisReport();
    
    // グローバル関数として公開
    window.rerunAnalysis = runDetailedAnalysis;
    window.getAnalysisData = () => analysisData;
    
    console.log('🔍 詳細分析システム初期化完了');
  }

  // 自動実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runDetailedAnalysis);
  } else {
    runDetailedAnalysis();
  }

})();