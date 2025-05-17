/**
 * 予約・支払い機能
 * Firebase統合での予約処理と支払い処理を行います
 */

// Firebase関連機能をインポート
import { 
  savePaymentToFirebase,
  updatePaymentStatus,
  createPaymentHistory
} from './firebase-payment.js';

// DOMコンテンツ読み込み後に実行
document.addEventListener('DOMContentLoaded', function() {
  console.log('予約・支払い機能を初期化しています...');
  
  // 支払い方法切り替え
  const creditCardMethod = document.getElementById('payment-credit-card');
  const firebaseMethod = document.getElementById('payment-firebase');
  const creditCardRadio = document.getElementById('method-credit-card');
  const firebaseRadio = document.getElementById('method-firebase');
  const creditCardForm = document.getElementById('credit-card-form');
  const firebaseForm = document.getElementById('firebase-payment-form');
  
  // ボタン要素
  const paymentButton = document.getElementById('payment-button');
  const backButton = document.getElementById('back-button');
  const loadingSpinner = document.getElementById('loading-spinner');
  
  // URL検索パラメータからの予約情報取得
  const urlParams = new URLSearchParams(window.location.search);
  const guideId = urlParams.get('guide') || 'G12345'; // デフォルト値
  const bookingDate = urlParams.get('date') || '2025-05-15';
  const bookingTime = urlParams.get('time') || '10:00-12:00';
  const bookingLocation = urlParams.get('location') || '東京駅前';
  const participants = urlParams.get('participants') || '2';
  
  // ローカルストレージから選択中のガイド情報があれば取得
  let guideInfo = JSON.parse(localStorage.getItem('selectedGuide')) || {
    id: guideId,
    name: 'デモガイド',
    location: '東京都新宿区',
    languages: ['日本語', '英語'],
    sessionFee: 6000
  };
  
  // セッションからユーザー情報取得
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || null;
  
  // 予約詳細の表示
  function displayBookingDetails() {
    document.getElementById('guide-name').textContent = guideInfo.name;
    document.getElementById('guide-location').textContent = guideInfo.location;
    document.getElementById('booking-date').textContent = formatDate(bookingDate);
    document.getElementById('booking-time').textContent = bookingTime;
    document.getElementById('booking-location').textContent = bookingLocation;
    document.getElementById('booking-participants').textContent = `${participants}名`;
    
    // 料金計算
    const sessionFee = guideInfo.sessionFee || 6000;
    const serviceFee = Math.floor(sessionFee * 0.1); // 10%のサービス料
    const totalFee = sessionFee + serviceFee;
    
    document.getElementById('session-fee').textContent = `¥${sessionFee.toLocaleString()}`;
    document.getElementById('service-fee').textContent = `¥${serviceFee.toLocaleString()}`;
    document.getElementById('total-fee').textContent = `¥${totalFee.toLocaleString()}`;
  }
  
  // 日付フォーマット関数
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  }
  
  // ユーザー情報を自動入力
  function autofillUserInfo() {
    if (currentUser) {
      const emailInputs = document.querySelectorAll('input[type="email"]');
      emailInputs.forEach(input => {
        input.value = currentUser.email || '';
      });
      
      const phoneInputs = document.querySelectorAll('input[type="tel"]');
      phoneInputs.forEach(input => {
        input.value = currentUser.phone || '';
      });
      
      // カード名義に名前を設定
      const nameInputs = document.querySelectorAll('#card-holder, #firebase-name');
      nameInputs.forEach(input => {
        input.value = currentUser.name || '';
      });
    }
  }
  
  // 支払い方法切り替え
  if (creditCardMethod && firebaseMethod) {
    creditCardMethod.addEventListener('click', function() {
      creditCardRadio.checked = true;
      creditCardMethod.classList.add('selected');
      firebaseMethod.classList.remove('selected');
      creditCardForm.style.display = 'block';
      firebaseForm.style.display = 'none';
    });
    
    firebaseMethod.addEventListener('click', function() {
      firebaseRadio.checked = true;
      firebaseMethod.classList.add('selected');
      creditCardMethod.classList.remove('selected');
      creditCardForm.style.display = 'none';
      firebaseForm.style.display = 'block';
    });
  }
  
  // 支払いボタンのイベント
  if (paymentButton) {
    paymentButton.addEventListener('click', function() {
      // 合意のチェック
      const agreeTerms = document.getElementById('agree-terms');
      if (!agreeTerms.checked) {
        showAlert('利用規約への同意が必要です', 'warning');
        return;
      }
      
      // バリデーション
      const isFirebasePayment = firebaseRadio && firebaseRadio.checked;
      let isValid = true;
      let formData = {};
      
      if (isFirebasePayment) {
        // Firebase支払いフォームのバリデーション
        const name = document.getElementById('firebase-name').value;
        const email = document.getElementById('firebase-email').value;
        const phone = document.getElementById('firebase-phone').value;
        
        if (!name || !email || !phone) {
          isValid = false;
          showAlert('すべての必須項目を入力してください', 'warning');
        } else {
          formData = {
            name,
            email,
            phone,
            notes: document.getElementById('firebase-note').value,
            paymentMethod: 'firebase'
          };
        }
      } else {
        // クレジットカードフォームのバリデーション
        const cardHolder = document.getElementById('card-holder').value;
        const cardNumber = document.getElementById('card-number').value;
        const cardExpiry = document.getElementById('card-expiry').value;
        const cardCvc = document.getElementById('card-cvc').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        
        if (!cardHolder || !cardNumber || !cardExpiry || !cardCvc || !email || !phone) {
          isValid = false;
          showAlert('すべての必須項目を入力してください', 'warning');
        } else if (cardNumber.replace(/\s/g, '').length !== 16) {
          isValid = false;
          showAlert('有効なカード番号を入力してください', 'warning');
        } else {
          formData = {
            cardHolder,
            cardNumber: cardNumber.replace(/\s/g, ''),
            cardExpiry,
            cardCvc,
            email,
            phone,
            notes: document.getElementById('notes').value,
            paymentMethod: 'credit_card'
          };
        }
      }
      
      if (isValid) {
        processPayment(formData);
      }
    });
  }
  
  // 戻るボタンのイベント
  if (backButton) {
    backButton.addEventListener('click', function() {
      // ブラウザの履歴を戻る
      window.history.back();
    });
  }
  
  // 支払い処理を実行
  async function processPayment(formData) {
    try {
      // ローディング表示
      showLoading(true);
      
      // 予約情報を作成
      const bookingData = {
        guideId,
        guideName: guideInfo.name,
        touristId: currentUser ? currentUser.id : 'anonymous',
        touristName: currentUser ? currentUser.name : formData.name,
        touristEmail: formData.email,
        touristPhone: formData.phone,
        bookingDate,
        bookingTime,
        location: bookingLocation,
        participants: parseInt(participants),
        notes: formData.notes,
        sessionFee: guideInfo.sessionFee || 6000,
        serviceFee: Math.floor((guideInfo.sessionFee || 6000) * 0.1),
        totalFee: (guideInfo.sessionFee || 6000) + Math.floor((guideInfo.sessionFee || 6000) * 0.1),
        paymentMethod: formData.paymentMethod,
        status: 'pending'
      };
      
      // Firebase決済処理
      console.log('Firebase決済データを準備:', bookingData);
      
      // 決済情報をFirestoreに保存
      const paymentId = await savePaymentToFirebase({
        ...bookingData,
        paymentDetails: formData.paymentMethod === 'credit_card' ? {
          cardNumberLast4: formData.cardNumber.slice(-4)
        } : {}
      });
      
      console.log('決済データが保存されました。ID:', paymentId);
      
      // テスト環境では即時に決済成功とする
      await updatePaymentStatus(paymentId, 'completed');
      
      // 決済履歴を作成
      if (currentUser) {
        await createPaymentHistory(paymentId, {
          type: 'booking_payment',
          amount: bookingData.totalFee,
          description: `${bookingData.guideName}への予約 (${formatDate(bookingData.bookingDate)})`
        });
      }
      
      // 処理成功
      console.log('決済処理が完了しました');
      showLoading(false);
      
      // 予約データをローカルストレージに保存して確認ページへ
      localStorage.setItem('lastBooking', JSON.stringify({
        ...bookingData,
        paymentId,
        paymentStatus: 'completed'
      }));
      
      // 成功メッセージを表示
      showAlert('予約が完了しました。確認ページに移動します...', 'success');
      
      // 確認ページへ移動（2秒後）
      setTimeout(() => {
        window.location.href = 'booking-confirmation.html?id=' + paymentId;
      }, 2000);
      
    } catch (error) {
      console.error('決済処理中にエラーが発生しました:', error);
      showLoading(false);
      showAlert('決済処理に失敗しました: ' + error.message, 'danger');
    }
  }
  
  // ローディング表示の切り替え
  function showLoading(isLoading) {
    if (loadingSpinner) {
      if (isLoading) {
        loadingSpinner.classList.add('active');
      } else {
        loadingSpinner.classList.remove('active');
      }
    }
  }
  
  // アラート表示
  function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alert-container') || createAlertContainer();
    
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type} alert-dismissible fade show`;
    alertElement.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    alertContainer.appendChild(alertElement);
    
    // 5秒後に自動的に消える
    setTimeout(() => {
      alertElement.classList.remove('show');
      setTimeout(() => {
        alertElement.remove();
      }, 150);
    }, 5000);
  }
  
  // アラートコンテナ作成
  function createAlertContainer() {
    const container = document.createElement('div');
    container.id = 'alert-container';
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.maxWidth = '400px';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
    return container;
  }
  
  // 初期化関数
  function init() {
    displayBookingDetails();
    autofillUserInfo();
    
    // ログインしていない場合の警告
    if (!currentUser) {
      showAlert('ログインすると予約がより簡単になります。', 'info');
    }
  }
  
  // 初期化実行
  init();
});