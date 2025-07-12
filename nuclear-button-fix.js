/**
 * 核爆弾級ボタン修正システム - 最終手段
 * 他のすべてのシステムが失敗した場合の最後の手段
 */

// 即座に実行する関数
(function nuclearButtonFix() {
  console.log('☢️ 核爆弾級ボタン修正システム起動');
  
  // 新規登録ボタンの完全置換
  function replaceSignUpButton() {
    const currentButton = document.getElementById('signup-button-fixed');
    if (currentButton) {
      // 新しいボタンを作成
      const newButton = document.createElement('button');
      newButton.className = 'btn btn-light';
      newButton.id = 'signup-button-fixed';
      newButton.setAttribute('onclick', 'showRegisterOptions()');
      newButton.textContent = '新規登録';
      
      // 完全に置き換え
      currentButton.parentNode.replaceChild(newButton, currentButton);
      console.log('☢️ ボタン核爆弾置換完了');
    }
  }
  
  // 全ての Sign Up テキストを破壊
  function destroyAllSignUpText() {
    // 全てのテキストノードを検索
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
      if (node.nodeValue.includes('Sign Up')) {
        textNodes.push(node);
      }
    }
    
    // Sign Up を 新規登録 に置換
    textNodes.forEach(textNode => {
      textNode.nodeValue = textNode.nodeValue.replace(/Sign Up/g, '新規登録');
      console.log('☢️ テキストノード破壊: Sign Up → 新規登録');
    });
  }
  
  // 全ての要素のテキストコンテンツを強制変更
  function forceChangeAllElements() {
    document.querySelectorAll('*').forEach(element => {
      if (element.textContent && element.textContent.includes('Sign Up')) {
        element.textContent = element.textContent.replace(/Sign Up/g, '新規登録');
        console.log('☢️ 要素破壊:', element.tagName);
      }
    });
  }
  
  // スクロール問題の核爆弾解決
  function nuclearScrollFix() {
    // 全ての要素から overflow:hidden を削除
    document.querySelectorAll('*').forEach(el => {
      el.style.overflow = '';
      el.style.overflowY = '';
      el.style.overflowX = '';
    });
    
    // body と html を強制設定
    document.body.style.cssText = '';
    document.documentElement.style.cssText = '';
    document.body.style.overflow = 'visible';
    document.documentElement.style.overflow = 'visible';
    
    console.log('☢️ スクロール核爆弾修正完了');
  }
  
  // 継続的な破壊活動
  function continuousDestruction() {
    replaceSignUpButton();
    destroyAllSignUpText();
    forceChangeAllElements();
    nuclearScrollFix();
    
    // 10ms後に再実行
    setTimeout(continuousDestruction, 10);
  }
  
  // 即座に開始
  continuousDestruction();
  
  // 全イベントで破壊活動
  ['DOMContentLoaded', 'load', 'click', 'scroll', 'resize'].forEach(event => {
    document.addEventListener(event, () => {
      replaceSignUpButton();
      destroyAllSignUpText();
      forceChangeAllElements();
      nuclearScrollFix();
    });
  });
  
  console.log('☢️ 核爆弾システム完全起動 - 破壊活動開始');
})();