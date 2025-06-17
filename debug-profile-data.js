/**
 * プロフィールデータデバッグ用スクリプト
 * 現在のデータ状態を詳しく調査する
 */

(function() {
  'use strict';

  function debugProfileData() {
    console.log('=== プロフィールデータデバッグ開始 ===');

    // 1. セッションストレージの状態確認
    console.log('--- セッションストレージ ---');
    console.log('currentUser:', sessionStorage.getItem('currentUser'));
    console.log('guideRegistrationData:', sessionStorage.getItem('guideRegistrationData'));
    console.log('currentGuideId:', sessionStorage.getItem('currentGuideId'));

    // 2. ローカルストレージの状態確認
    console.log('--- ローカルストレージ ---');
    console.log('guideProfiles:', localStorage.getItem('guideProfiles'));
    console.log('savedGuides:', localStorage.getItem('savedGuides'));

    // 3. フォームフィールドの現在値確認
    console.log('--- フォームフィールド現在値 ---');
    const fields = ['guide-name', 'guide-username', 'guide-email', 'guide-phone', 'guide-location'];
    fields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      console.log(`${fieldId}:`, field ? field.value : 'フィールドなし');
    });

    // 4. URLパラメータ確認
    console.log('--- URLパラメータ ---');
    const urlParams = new URLSearchParams(window.location.search);
    for (const [key, value] of urlParams) {
      console.log(`${key}: ${value}`);
    }

    // 5. DOMに設定されているdata属性確認
    console.log('--- DOM data属性 ---');
    const elementsWithData = document.querySelectorAll('[data-guide-id], [data-user-id]');
    elementsWithData.forEach(element => {
      console.log('要素:', element.tagName, 'data-guide-id:', element.getAttribute('data-guide-id'), 'data-user-id:', element.getAttribute('data-user-id'));
    });

    console.log('=== デバッグ終了 ===');
  }

  // ページロード後に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', debugProfileData);
  } else {
    debugProfileData();
  }

  // 手動実行用
  window.debugProfileData = debugProfileData;

})();