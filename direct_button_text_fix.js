/**
 * 証明写真ボタンテキストを直接修正するスクリプト
 * ラジオボタン機能も完全に書き換え
 */
(function() {
  'use strict';
  
  // DOMの読み込みが完了したら初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  /**
   * 初期化
   */
  function init() {
    console.log('証明写真ボタンテキスト直接修正スクリプトを初期化');
    
    // モーダル表示イベントを監視
    document.addEventListener('shown.bs.modal', function(event) {
      if (!event.target || !event.target.id) return;
      
      console.log('モーダルが表示されました: ' + event.target.id);
      
      if (event.target.id.includes('RegisterModal') || 
          event.target.id.includes('DocumentModal')) {
        // 少し遅延させて実行（DOMが完全に構築された後）
        setTimeout(fixAllPhotoElements, 100);
      }
    });
    
    // 定期的に実行
    setInterval(fixAllPhotoElements, 1000);
    
    // 初期実行
    fixAllPhotoElements();
  }
  
  /**
   * 証明写真関連の全要素を修正
   */
  function fixAllPhotoElements() {
    // ボタンテキストを修正
    fixButtonTexts();
    
    // ラジオボタン機能を修正
    fixRadioButtons();
  }
  
  /**
   * ボタンテキストを修正
   */
  function fixButtonTexts() {
    // すべてのボタン要素をチェック
    const buttons = document.getElementsByTagName('button');
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      const text = button.textContent.trim();
      
      // ボタンテキストの置換
      if (text === 'PHOTO SELECT') {
        button.innerHTML = button.innerHTML.replace('PHOTO SELECT', '写真を選択');
        console.log('PHOTO SELECT ボタンを修正しました');
      } else if (text === 'PHOTO CAMERA') {
        button.innerHTML = button.innerHTML.replace('PHOTO CAMERA', 'カメラで撮影');
        console.log('PHOTO CAMERA ボタンを修正しました');
      }
    }
    
    // 削除リンクの修正
    const elements = document.querySelectorAll('a, span, div');
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (element.textContent && 
          (element.textContent.trim() === 'delete' || 
          element.textContent.trim() === 'Delete')) {
        element.textContent = '削除';
      }
    }
  }
  
  /**
   * ラジオボタン機能を修正（完全置換方式）
   */
  function fixRadioButtons() {
    // すべてのラジオボタンを調査
    const idPhotoTypeSelector = document.getElementById('id-photo-type-selector');
    if (!idPhotoTypeSelector) return;
    
    // 既に処理済みの場合はスキップ
    if (idPhotoTypeSelector.getAttribute('data-fixed-radio') === 'true') return;
    
    // シングルとデュアルセクションを取得
    const singlePhotoSection = document.getElementById('single-photo-section');
    const dualPhotoSection = document.getElementById('dual-photo-section');
    
    if (!singlePhotoSection || !dualPhotoSection) {
      console.log('シングル/デュアル写真セクションが見つかりません');
      return;
    }
    
    // ラジオボタンを取得
    const singleRadio = document.getElementById('id-photo-type-single');
    const dualRadio = document.getElementById('id-photo-type-dual');
    
    if (!singleRadio || !dualRadio) {
      console.log('写真タイプラジオボタンが見つかりません');
      return;
    }
    
    console.log('ラジオボタンを特定しました:', 
               'シングル=', singleRadio.id, 
               'デュアル=', dualRadio.id);
    
    // 既存のイベントリスナーをすべてクリア
    const singleRadioClone = singleRadio.cloneNode(true);
    const dualRadioClone = dualRadio.cloneNode(true);
    
    singleRadio.parentNode.replaceChild(singleRadioClone, singleRadio);
    dualRadio.parentNode.replaceChild(dualRadioClone, dualRadio);
    
    // 新しいイベントリスナーを設定
    singleRadioClone.onclick = function() {
      console.log('シングル写真ラジオボタンがクリックされました');
      showPhotoSection(singlePhotoSection);
      hidePhotoSection(dualPhotoSection);
    };
    
    dualRadioClone.onclick = function() {
      console.log('デュアル写真ラジオボタンがクリックされました');
      hidePhotoSection(singlePhotoSection);
      showPhotoSection(dualPhotoSection);
    };
    
    // 初期状態を設定
    if (singleRadioClone.checked) {
      showPhotoSection(singlePhotoSection);
      hidePhotoSection(dualPhotoSection);
    } else if (dualRadioClone.checked) {
      hidePhotoSection(singlePhotoSection);
      showPhotoSection(dualPhotoSection);
    }
    
    // 処理済みフラグを設定
    idPhotoTypeSelector.setAttribute('data-fixed-radio', 'true');
    console.log('ラジオボタンを修正完了しました');
  }
  
  /**
   * 写真セクションを表示
   */
  function showPhotoSection(section) {
    if (!section) return;
    section.style.display = 'block';
    section.classList.remove('d-none');
  }
  
  /**
   * 写真セクションを非表示
   */
  function hidePhotoSection(section) {
    if (!section) return;
    section.style.display = 'none';
    section.classList.add('d-none');
  }
})();