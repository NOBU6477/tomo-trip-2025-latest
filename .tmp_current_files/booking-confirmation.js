/**
 * 予約確認ページのスクリプト
 * 予約情報の表示とアクション機能を実装
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('予約確認ページを初期化しています...');
  
  // URL検索パラメータから予約IDを取得
  const urlParams = new URLSearchParams(window.location.search);
  const bookingId = urlParams.get('id') || '';
  
  // ローカルストレージから予約情報を取得
  const lastBooking = JSON.parse(localStorage.getItem('lastBooking')) || null;
  
  // 予約IDの表示
  document.getElementById('booking-id').textContent = bookingId || (lastBooking?.paymentId || 'BK12345678');
  
  // 予約詳細の表示
  if (lastBooking) {
    // ガイド情報
    document.getElementById('guide-name').textContent = lastBooking.guideName || 'デモガイド';
    
    // 予約情報
    document.getElementById('booking-date').textContent = formatDate(lastBooking.bookingDate);
    document.getElementById('booking-time').textContent = lastBooking.bookingTime || '10:00 - 12:00';
    document.getElementById('booking-location').textContent = lastBooking.location || '東京駅前';
    document.getElementById('booking-participants').textContent = `${lastBooking.participants || 2}名`;
    
    // 支払い情報
    document.getElementById('payment-method').textContent = 
      lastBooking.paymentMethod === 'credit_card' ? 'クレジットカード' : 
      lastBooking.paymentMethod === 'firebase' ? 'Google Pay' : '未設定';
    
    // 支払い状態のバッジ
    const paymentStatusBadge = document.getElementById('payment-status');
    if (paymentStatusBadge) {
      if (lastBooking.paymentStatus === 'completed') {
        paymentStatusBadge.textContent = '完了';
        paymentStatusBadge.className = 'badge bg-success';
      } else if (lastBooking.paymentStatus === 'pending') {
        paymentStatusBadge.textContent = '処理中';
        paymentStatusBadge.className = 'badge bg-warning text-dark';
      } else if (lastBooking.paymentStatus === 'failed') {
        paymentStatusBadge.textContent = '失敗';
        paymentStatusBadge.className = 'badge bg-danger';
      }
    }
    
    // 合計金額
    document.getElementById('total-amount').textContent = `¥${lastBooking.totalFee?.toLocaleString() || '6,600'}`;
    
    // QRコード生成（ここでは単純なダミー画像）
    generateQRCode(`Booking:${bookingId || lastBooking.paymentId || 'BK12345678'}`);
  }
  
  // 日付フォーマット関数
  function formatDate(dateStr) {
    if (!dateStr) return '2025年5月15日';
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  }
  
  // QRコード生成（ダミー実装）
  function generateQRCode(data) {
    const qrCodeImage = document.getElementById('qr-code-image');
    if (qrCodeImage) {
      // 実際の実装ではQRコードライブラリを使用して生成
      // ここではダミー画像のままにする
      // qrCodeImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data)}`;
    }
  }
  
  // 印刷ボタンのイベント
  const printButton = document.getElementById('print-button');
  if (printButton) {
    printButton.addEventListener('click', function(e) {
      e.preventDefault();
      window.print();
    });
  }
  
  // カレンダーに追加ボタンのイベント
  const addCalendarButton = document.getElementById('add-calendar-button');
  if (addCalendarButton) {
    addCalendarButton.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Google Calendarへの追加URLを生成
      const title = `ローカルガイド予約: ${document.getElementById('guide-name').textContent}`;
      const details = `予約ID: ${document.getElementById('booking-id').textContent}\n集合場所: ${document.getElementById('booking-location').textContent}\n参加人数: ${document.getElementById('booking-participants').textContent}`;
      const location = document.getElementById('booking-location').textContent;
      
      // 日付と時間を解析
      const dateText = document.getElementById('booking-date').textContent;
      const timeText = document.getElementById('booking-time').textContent;
      
      // 日本語の日付文字列から年月日を抽出
      const dateMatch = dateText.match(/(\d+)年(\d+)月(\d+)日/);
      const year = dateMatch ? parseInt(dateMatch[1]) : 2025;
      const month = dateMatch ? parseInt(dateMatch[2]) - 1 : 4; // JavaScriptの月は0始まり
      const day = dateMatch ? parseInt(dateMatch[3]) : 15;
      
      // 時間の文字列から開始時間と終了時間を抽出
      const timeMatch = timeText.match(/(\d+):(\d+)\s*-\s*(\d+):(\d+)/);
      const startHour = timeMatch ? parseInt(timeMatch[1]) : 10;
      const startMinute = timeMatch ? parseInt(timeMatch[2]) : 0;
      const endHour = timeMatch ? parseInt(timeMatch[3]) : 12;
      const endMinute = timeMatch ? parseInt(timeMatch[4]) : 0;
      
      // 日時オブジェクトを作成
      const startDate = new Date(year, month, day, startHour, startMinute);
      const endDate = new Date(year, month, day, endHour, endMinute);
      
      // ISO形式の日時文字列に変換
      const startDateTime = startDate.toISOString().replace(/[-:]/g, '').substring(0, 15);
      const endDateTime = endDate.toISOString().replace(/[-:]/g, '').substring(0, 15);
      
      // Google Calendar追加用のURL生成
      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDateTime}/${endDateTime}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}&sf=true&output=xml`;
      
      // 新しいウィンドウでGoogle Calendar追加ページを開く
      window.open(googleCalendarUrl, '_blank');
    });
  }
  
  // ガイドにメッセージを送るボタンのイベント
  const messageGuideButton = document.getElementById('message-guide-button');
  if (messageGuideButton) {
    messageGuideButton.addEventListener('click', function(e) {
      e.preventDefault();
      
      if (lastBooking?.guideId) {
        // メッセージページに遷移
        window.location.href = `messages.html?recipient=${lastBooking.guideId}`;
      } else {
        // デモ用のガイドID
        window.location.href = `messages.html?recipient=G12345`;
      }
    });
  }
});