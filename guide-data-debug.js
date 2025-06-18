/**
 * ガイドデータデバッグシステム
 * データの流れを追跡して問題を特定
 */
(function() {
  'use strict';

  /**
   * データフローをデバッグ
   */
  function debugDataFlow() {
    console.log('=== ガイドデータデバッグ開始 ===');
    
    // 1. フォームから収集されるデータを確認
    const formData = collectCurrentFormData();
    console.log('1. フォームデータ:', formData);
    
    // 2. ローカルストレージの状態を確認
    const localStorageData = {
      guideProfiles: JSON.parse(localStorage.getItem('guideProfiles') || '{}'),
      userAddedGuides: JSON.parse(localStorage.getItem('userAddedGuides') || '[]'),
      guideProfileData: JSON.parse(localStorage.getItem('guideProfileData') || 'null')
    };
    console.log('2. ローカルストレージデータ:', localStorageData);
    
    // 3. セッションストレージの状態を確認
    const sessionData = {
      guideProfileData: JSON.parse(sessionStorage.getItem('guideProfileData') || 'null'),
      latestGuideData: JSON.parse(sessionStorage.getItem('latestGuideData') || 'null')
    };
    console.log('3. セッションストレージデータ:', sessionData);
    
    // 4. 変換後のガイドカードデータを確認
    if (window.guideDataBridge && formData) {
      const transformedData = window.guideDataBridge.transformToGuideCard(formData);
      console.log('4. 変換後ガイドカードデータ:', transformedData);
    }
    
    console.log('=== ガイドデータデバッグ終了 ===');
  }

  /**
   * 現在のフォームデータを収集
   */
  function collectCurrentFormData() {
    const data = {
      name: document.getElementById('guide-name')?.value || '',
      username: document.getElementById('guide-username')?.value || '',
      email: document.getElementById('guide-email')?.value || '',
      location: document.getElementById('guide-location')?.value || '',
      languages: getSelectedLanguages(),
      description: document.getElementById('guide-description')?.value || '',
      sessionFee: document.getElementById('guide-session-fee')?.value || '',
      interests: getSelectedInterests(),
      additionalInfo: document.getElementById('interest-custom')?.value || ''
    };
    
    return data;
  }

  /**
   * 選択された言語を取得
   */
  function getSelectedLanguages() {
    const checkedLanguages = document.querySelectorAll('.language-checkbox:checked');
    return Array.from(checkedLanguages).map(input => ({
      value: input.value,
      label: input.nextElementSibling?.textContent?.trim() || input.value
    }));
  }

  /**
   * 選択された興味・得意分野を取得
   */
  function getSelectedInterests() {
    const checkedInterests = document.querySelectorAll('input[id^="interest-"]:checked');
    return Array.from(checkedInterests).map(input => ({
      value: input.value,
      label: input.nextElementSibling?.textContent?.trim() || input.value
    }));
  }

  /**
   * データ保存プロセスを詳細に監視
   */
  function monitorSaveProcess() {
    console.log('=== 保存プロセス監視開始 ===');
    
    const originalHandleProfileSave = window.handleProfileSave;
    if (originalHandleProfileSave) {
      window.handleProfileSave = function(profileData) {
        console.log('保存プロセス - 受信データ:', profileData);
        
        const result = originalHandleProfileSave.call(this, profileData);
        
        console.log('保存プロセス - 結果:', result);
        
        // 保存後の状態確認
        setTimeout(() => {
          const afterSave = JSON.parse(localStorage.getItem('userAddedGuides') || '[]');
          console.log('保存後のuserAddedGuides:', afterSave);
        }, 100);
        
        return result;
      };
    }
    
    console.log('=== 保存プロセス監視設定完了 ===');
  }

  /**
   * リアルタイムデータ監視
   */
  function setupRealtimeMonitoring() {
    // フォーム入力の監視
    const formElements = document.querySelectorAll('input, textarea, select');
    formElements.forEach(element => {
      element.addEventListener('change', function() {
        console.log(`フォーム変更: ${this.id || this.name} = ${this.value}`);
      });
    });

    // ローカルストレージの変更監視
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
      if (key.includes('guide') || key.includes('Guide')) {
        console.log(`ローカルストレージ更新: ${key}`, JSON.parse(value));
      }
      return originalSetItem.call(this, key, value);
    };
  }

  /**
   * ガイドカード作成プロセスの監視
   */
  function monitorCardCreation() {
    // guide-list-sync.jsのforceUpdateGuideList関数を監視
    if (window.forceUpdateGuideList) {
      const originalForceUpdate = window.forceUpdateGuideList;
      window.forceUpdateGuideList = function() {
        console.log('=== ガイドリスト強制更新開始 ===');
        const guides = JSON.parse(localStorage.getItem('userAddedGuides') || '[]');
        console.log('更新対象ガイド数:', guides.length);
        guides.forEach((guide, index) => {
          console.log(`ガイド${index + 1}:`, guide);
        });
        
        const result = originalForceUpdate.call(this);
        
        console.log('=== ガイドリスト強制更新完了 ===');
        return result;
      };
    }
  }

  /**
   * 完全なデータフロー検証
   */
  function validateCompleteDataFlow() {
    console.log('=== 完全データフロー検証 ===');
    
    // Step 1: フォームデータの検証
    const formData = collectCurrentFormData();
    console.log('Step 1 - フォームデータ:', formData);
    
    if (!formData.name) {
      console.error('エラー: 名前が入力されていません');
      return false;
    }
    
    if (!formData.location) {
      console.error('エラー: 活動エリアが選択されていません');
      return false;
    }
    
    // Step 2: 変換プロセスの検証
    if (window.guideDataBridge) {
      const isValid = window.guideDataBridge.validateProfileData(formData);
      console.log('Step 2 - データ検証結果:', isValid);
      
      if (isValid) {
        const transformed = window.guideDataBridge.transformToGuideCard(formData);
        console.log('Step 2 - 変換後データ:', transformed);
      }
    }
    
    console.log('=== 検証完了 ===');
    return true;
  }

  /**
   * デバッグUIの追加
   */
  function addDebugUI() {
    const debugPanel = document.createElement('div');
    debugPanel.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 10px;
      border-radius: 5px;
      z-index: 9999;
      font-size: 12px;
      max-width: 300px;
    `;
    
    debugPanel.innerHTML = `
      <h6>ガイドデータデバッグ</h6>
      <button onclick="window.debugDataFlow()" style="margin: 2px; padding: 5px; font-size: 11px;">データフロー確認</button>
      <button onclick="window.validateCompleteDataFlow()" style="margin: 2px; padding: 5px; font-size: 11px;">完全検証</button>
      <button onclick="console.clear()" style="margin: 2px; padding: 5px; font-size: 11px;">コンソールクリア</button>
    `;
    
    document.body.appendChild(debugPanel);
  }

  /**
   * 初期化
   */
  function initialize() {
    // グローバル関数として公開
    window.debugDataFlow = debugDataFlow;
    window.validateCompleteDataFlow = validateCompleteDataFlow;
    window.collectCurrentFormData = collectCurrentFormData;
    
    // 各種監視の開始
    monitorSaveProcess();
    setupRealtimeMonitoring();
    monitorCardCreation();
    
    // デバッグUIの追加（開発時のみ）
    if (window.location.search.includes('debug=true')) {
      addDebugUI();
    }
    
    console.log('ガイドデータデバッグシステム初期化完了');
    
    // 初期状態のデバッグ
    setTimeout(debugDataFlow, 1000);
  }

  // 初期化実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

})();