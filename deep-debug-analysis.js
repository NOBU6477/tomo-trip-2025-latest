/**
 * 深層デバッグ分析システム
 * 「優」表示問題の全角度分析
 */

(function() {
  'use strict';

  /**
   * DOM要素の詳細分析
   */
  function analyzeDisplayElements() {
    console.log('=== DOM要素詳細分析 ===');
    
    const elementIds = ['display-name', 'display-username', 'user-name'];
    
    elementIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        console.log(`\n${id} の詳細分析:`);
        console.log('- textContent:', JSON.stringify(element.textContent));
        console.log('- innerHTML:', JSON.stringify(element.innerHTML));
        console.log('- innerText:', JSON.stringify(element.innerText));
        console.log('- value:', JSON.stringify(element.value));
        console.log('- dataset:', element.dataset);
        console.log('- attributes:', Array.from(element.attributes).map(attr => `${attr.name}="${attr.value}"`));
        console.log('- computedStyle display:', window.getComputedStyle(element).display);
        console.log('- parentNode:', element.parentNode?.tagName);
        console.log('- 子要素数:', element.children.length);
        
        // 子要素も確認
        if (element.children.length > 0) {
          Array.from(element.children).forEach((child, index) => {
            console.log(`  子要素[${index}]:`, child.tagName, child.textContent);
          });
        }
      } else {
        console.log(`${id}: 要素が見つかりません`);
      }
    });
  }

  /**
   * セッションストレージの完全分析
   */
  function analyzeSessionStorage() {
    console.log('\n=== セッションストレージ完全分析 ===');
    
    const keys = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      keys.push(sessionStorage.key(i));
    }
    
    console.log('保存されているキー:', keys);
    
    keys.forEach(key => {
      const value = sessionStorage.getItem(key);
      console.log(`\n${key}:`);
      console.log('- 生の値:', value);
      console.log('- 値の型:', typeof value);
      console.log('- 値の長さ:', value?.length);
      
      try {
        const parsed = JSON.parse(value);
        console.log('- パース結果:', parsed);
        console.log('- パース結果の型:', typeof parsed);
        
        if (typeof parsed === 'object' && parsed !== null) {
          console.log('- オブジェクトのキー:', Object.keys(parsed));
          Object.keys(parsed).forEach(objKey => {
            console.log(`  ${objKey}:`, JSON.stringify(parsed[objKey]));
          });
        }
      } catch (e) {
        console.log('- JSON解析不可:', e.message);
      }
    });
  }

  /**
   * イベントリスナーの分析
   */
  function analyzeEventListeners() {
    console.log('\n=== イベントリスナー分析 ===');
    
    const elementIds = ['display-name', 'display-username', 'user-name'];
    
    elementIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        console.log(`\n${id} のイベント分析:`);
        
        // 親要素をたどってイベントリスナーを確認
        let currentElement = element;
        let level = 0;
        
        while (currentElement && level < 5) {
          console.log(`レベル${level} (${currentElement.tagName}):`, currentElement.className);
          
          // DOMイベントプロパティをチェック
          const eventProps = ['onclick', 'onload', 'onchange', 'oninput'];
          eventProps.forEach(prop => {
            if (currentElement[prop]) {
              console.log(`  ${prop}:`, currentElement[prop].toString().substring(0, 100));
            }
          });
          
          currentElement = currentElement.parentElement;
          level++;
        }
      }
    });
  }

  /**
   * スクリプトタグの分析
   */
  function analyzeScriptTags() {
    console.log('\n=== 読み込まれているスクリプト分析 ===');
    
    const scripts = document.querySelectorAll('script[src]');
    const scriptSources = Array.from(scripts).map(script => script.src || script.getAttribute('src'));
    
    console.log('読み込まれているスクリプト一覧:');
    scriptSources.forEach((src, index) => {
      console.log(`${index + 1}. ${src}`);
    });
    
    // インラインスクリプトも確認
    const inlineScripts = document.querySelectorAll('script:not([src])');
    console.log(`\nインラインスクリプト数: ${inlineScripts.length}`);
    
    inlineScripts.forEach((script, index) => {
      const content = script.textContent;
      if (content.includes('優') || content.includes('display-name') || content.includes('user-name')) {
        console.log(`インラインスクリプト[${index}] に関連コードあり:`, content.substring(0, 200));
      }
    });
  }

  /**
   * CSS スタイルの分析
   */
  function analyzeCSSStyles() {
    console.log('\n=== CSS スタイル分析 ===');
    
    const elementIds = ['display-name', 'display-username', 'user-name'];
    
    elementIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        const styles = window.getComputedStyle(element);
        console.log(`\n${id} のスタイル:`);
        console.log('- display:', styles.display);
        console.log('- visibility:', styles.visibility);
        console.log('- opacity:', styles.opacity);
        console.log('- content:', styles.content);
        console.log('- transform:', styles.transform);
        console.log('- position:', styles.position);
        console.log('- z-index:', styles.zIndex);
        
        // ::before, ::after の擬似要素もチェック
        try {
          const beforeStyles = window.getComputedStyle(element, '::before');
          const afterStyles = window.getComputedStyle(element, '::after');
          if (beforeStyles.content !== 'none') {
            console.log('- ::before content:', beforeStyles.content);
          }
          if (afterStyles.content !== 'none') {
            console.log('- ::after content:', afterStyles.content);
          }
        } catch (e) {
          // 擬似要素がない場合
        }
      }
    });
  }

  /**
   * MutationObserver でリアルタイム変更を監視
   */
  function startRealTimeMonitoring() {
    console.log('\n=== リアルタイム変更監視開始 ===');
    
    const elementIds = ['display-name', 'display-username', 'user-name'];
    
    elementIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        const observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            console.log(`${id} に変更検出:`, {
              type: mutation.type,
              oldValue: mutation.oldValue,
              newValue: element.textContent,
              target: mutation.target.tagName,
              timestamp: new Date().toISOString()
            });
            
            // スタックトレースを取得して変更の原因を特定
            console.trace('変更の呼び出し元:');
          });
        });

        observer.observe(element, {
          childList: true,
          characterData: true,
          subtree: true,
          attributeOldValue: true,
          characterDataOldValue: true
        });

        console.log(`${id} の監視を開始`);
      }
    });
  }

  /**
   * ページ読み込み順序の分析
   */
  function analyzeLoadOrder() {
    console.log('\n=== ページ読み込み順序分析 ===');
    console.log('document.readyState:', document.readyState);
    console.log('DOMContentLoaded発火済み:', document.readyState !== 'loading');
    console.log('window.onload発火済み:', document.readyState === 'complete');
    console.log('現在時刻:', new Date().toISOString());
    
    // パフォーマンス情報
    if (performance && performance.timing) {
      const timing = performance.timing;
      console.log('ページ読み込み時間:', {
        'DOM構築時間': timing.domContentLoadedEventEnd - timing.domLoading,
        '全読み込み時間': timing.loadEventEnd - timing.navigationStart,
        'スクリプト実行時間': timing.domComplete - timing.domContentLoadedEventEnd
      });
    }
  }

  /**
   * 総合デバッグ実行
   */
  function runComprehensiveDebug() {
    console.log('🔍 総合デバッグ分析開始');
    
    analyzeDisplayElements();
    analyzeSessionStorage();
    analyzeEventListeners();
    analyzeScriptTags();
    analyzeCSSStyles();
    analyzeLoadOrder();
    startRealTimeMonitoring();
    
    // 手動で要素の値を変更してテスト
    setTimeout(() => {
      console.log('\n=== 手動変更テスト ===');
      const testElement = document.getElementById('display-name');
      if (testElement) {
        const originalValue = testElement.textContent;
        testElement.textContent = 'テスト値';
        console.log('手動で変更しました:', originalValue, '->', testElement.textContent);
        
        setTimeout(() => {
          console.log('3秒後の値:', testElement.textContent);
          if (testElement.textContent !== 'テスト値') {
            console.log('🚨 値が自動的に戻されました！何かが上書きしています');
          }
        }, 3000);
      }
    }, 2000);
    
    console.log('🔍 総合デバッグ分析完了');
  }

  // グローバル関数として公開
  window.runDeepDebug = runComprehensiveDebug;
  window.analyzeElements = analyzeDisplayElements;
  window.analyzeStorage = analyzeSessionStorage;

  // 自動実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runComprehensiveDebug);
  } else {
    runComprehensiveDebug();
  }

})();