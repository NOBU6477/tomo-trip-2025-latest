/**
 * 協賛店登録機能
 * 登録フォームの処理とローカルストレージへの保存
 */

(function() {
  'use strict';
  
  console.log('協賛店登録スクリプト開始');
  
  // ロゴアップロード処理
  function setupLogoUpload() {
    const logoFile = document.getElementById('logoFile');
    const logoPreview = document.getElementById('logoPreview');
    
    logoFile.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        // ファイルサイズチェック (5MB制限)
        if (file.size > 5 * 1024 * 1024) {
          alert('ファイルサイズは5MB以下にしてください。');
          return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
          logoPreview.src = e.target.result;
          logoPreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
      }
    });
  }
  
  // フォーム送信処理
  function setupFormSubmission() {
    const form = document.getElementById('sponsorForm');
    
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // フォームデータを収集
      const formData = {
        id: 'sponsor_' + Date.now(),
        storeName: document.getElementById('storeName').value,
        storeType: document.getElementById('storeType').value,
        contactName: document.getElementById('contactName').value,
        contactEmail: document.getElementById('contactEmail').value,
        phone: document.getElementById('phone').value,
        website: document.getElementById('website').value,
        address: document.getElementById('address').value,
        description: document.getElementById('description').value,
        benefits: document.getElementById('benefits').value,
        logo: document.getElementById('logoPreview').src || '',
        registrationDate: new Date().toISOString(),
        status: 'pending' // pending, approved, rejected
      };
      
      // バリデーション
      if (!validateForm(formData)) {
        return;
      }
      
      // ローカルストレージに保存
      saveSponsorData(formData);
      
      // 成功画面を表示
      showSuccessMessage();
    });
  }
  
  // フォームバリデーション
  function validateForm(data) {
    const required = ['storeName', 'storeType', 'contactName', 'contactEmail', 'phone', 'address'];
    
    for (const field of required) {
      if (!data[field] || data[field].trim() === '') {
        alert(`${getFieldLabel(field)}は必須項目です。`);
        return false;
      }
    }
    
    // メールアドレスの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.contactEmail)) {
      alert('正しいメールアドレスを入力してください。');
      return false;
    }
    
    // ロゴファイルのチェック
    if (!data.logo) {
      alert('店舗ロゴをアップロードしてください。');
      return false;
    }
    
    return true;
  }
  
  // フィールドラベルを取得
  function getFieldLabel(field) {
    const labels = {
      storeName: '店舗名',
      storeType: '業種',
      contactName: '担当者名',
      contactEmail: 'メールアドレス',
      phone: '電話番号',
      address: '住所'
    };
    return labels[field] || field;
  }
  
  // 協賛店データを保存
  function saveSponsorData(data) {
    try {
      // 既存の協賛店データを取得
      let sponsors = JSON.parse(localStorage.getItem('sponsorData') || '[]');
      
      // 新しいデータを追加
      sponsors.push(data);
      
      // 保存
      localStorage.setItem('sponsorData', JSON.stringify(sponsors));
      
      console.log('協賛店データ保存完了:', data.storeName);
      
      // トップページの流れるロゴに追加するためのフラグ
      localStorage.setItem('newSponsorAdded', 'true');
      
    } catch (error) {
      console.error('データ保存エラー:', error);
      alert('データの保存に失敗しました。もう一度お試しください。');
    }
  }
  
  // 成功メッセージを表示
  function showSuccessMessage() {
    document.getElementById('registrationForm').style.display = 'none';
    document.getElementById('successMessage').style.display = 'block';
  }
  
  // 協賛店一覧ページに移動
  window.goToSponsorList = function() {
    window.location.href = 'sponsor-list.html';
  };
  
  // 初期化
  document.addEventListener('DOMContentLoaded', function() {
    setupLogoUpload();
    setupFormSubmission();
  });
  
})();