/**
 * カレンダー機能デバッグ用スクリプト - 月切り替えボタン機能追加
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('カレンダーデバッグスクリプトを実行します');
  
  // flatpickrが存在するか確認
  if (typeof flatpickr === 'undefined') {
    console.error('flatpickrライブラリが見つかりません');
  } else {
    console.log('flatpickrライブラリは正常に読み込まれています');
  }
  
  let calendarInstance = null;
  
  // カレンダーの初期化関数
  function initializeCalendar(calendarEl) {
    try {
      calendarInstance = flatpickr(calendarEl, {
        inline: true,
        dateFormat: "Y-m-d",
        locale: "ja",
        monthSelectorType: "static",
        disableMobile: true
      });
      console.log('カレンダーの初期化に成功しました');
      setupCalendarNavigation();
      return calendarInstance;
    } catch (error) {
      console.error('カレンダーの初期化に失敗しました:', error);
      return null;
    }
  }
  
  // カレンダーナビゲーションボタンの設定
  function setupCalendarNavigation() {
    // 前月ボタン
    const prevMonthBtn = document.getElementById('prevMonthBtn');
    if (prevMonthBtn) {
      prevMonthBtn.addEventListener('click', function() {
        if (calendarInstance) {
          const currentDate = calendarInstance.selectedDates[0] || new Date();
          const currentMonth = currentDate.getMonth();
          const currentYear = currentDate.getFullYear();
          
          // 前月に移動
          const newDate = new Date(currentYear, currentMonth - 1, 1);
          calendarInstance.jumpToDate(newDate);
          updateCurrentMonthButtonText();
          console.log('前月に移動:', newDate.toLocaleDateString());
        }
      });
    }
    
    // 翌月ボタン
    const nextMonthBtn = document.getElementById('nextMonthBtn');
    if (nextMonthBtn) {
      nextMonthBtn.addEventListener('click', function() {
        if (calendarInstance) {
          const currentDate = calendarInstance.selectedDates[0] || new Date();
          const currentMonth = currentDate.getMonth();
          const currentYear = currentDate.getFullYear();
          
          // 翌月に移動
          const newDate = new Date(currentYear, currentMonth + 1, 1);
          calendarInstance.jumpToDate(newDate);
          updateCurrentMonthButtonText();
          console.log('翌月に移動:', newDate.toLocaleDateString());
        }
      });
    }
    
    // 今月ボタン
    const currentMonthBtn = document.getElementById('currentMonthBtn');
    if (currentMonthBtn) {
      currentMonthBtn.addEventListener('click', function() {
        if (calendarInstance) {
          // 今月に移動
          const today = new Date();
          calendarInstance.jumpToDate(today);
          updateCurrentMonthButtonText();
          console.log('今月に移動:', today.toLocaleDateString());
        }
      });
      
      // 初期表示時のボタンテキスト設定
      updateCurrentMonthButtonText();
    }
    
    // 前年ボタン
    const prevYearBtn = document.getElementById('prevYearBtn');
    if (prevYearBtn) {
      prevYearBtn.addEventListener('click', function() {
        if (calendarInstance) {
          const currentDate = calendarInstance.selectedDates[0] || new Date();
          const currentMonth = currentDate.getMonth();
          const currentYear = currentDate.getFullYear();
          
          // 前年に移動
          const newDate = new Date(currentYear - 1, currentMonth, 1);
          calendarInstance.jumpToDate(newDate);
          updateCurrentMonthButtonText();
          console.log('前年に移動:', newDate.toLocaleDateString());
        }
      });
    }
    
    // 翌年ボタン
    const nextYearBtn = document.getElementById('nextYearBtn');
    if (nextYearBtn) {
      nextYearBtn.addEventListener('click', function() {
        if (calendarInstance) {
          const currentDate = calendarInstance.selectedDates[0] || new Date();
          const currentMonth = currentDate.getMonth();
          const currentYear = currentDate.getFullYear();
          
          // 翌年に移動
          const newDate = new Date(currentYear + 1, currentMonth, 1);
          calendarInstance.jumpToDate(newDate);
          updateCurrentMonthButtonText();
          console.log('翌年に移動:', newDate.toLocaleDateString());
        }
      });
    }
  }
  
  // 「今月」ボタンのテキストを現在表示されている年月に更新
  function updateCurrentMonthButtonText() {
    const currentMonthBtn = document.getElementById('currentMonthBtn');
    if (currentMonthBtn && calendarInstance) {
      const currentDate = calendarInstance.currentYear && calendarInstance.currentMonth !== undefined
        ? new Date(calendarInstance.currentYear, calendarInstance.currentMonth, 1)
        : new Date();
      
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // 月は0から始まるので+1
      
      currentMonthBtn.textContent = `${year}年${month}月`;
    }
  }
  
  // 予約カレンダー要素の確認
  const calendarEl = document.getElementById('reservation-calendar');
  if (!calendarEl) {
    console.error('カレンダー要素(#reservation-calendar)が見つかりません');
  } else {
    console.log('カレンダー要素が見つかりました:', calendarEl);
    
    // ダイレクトにflatpickrを初期化
    initializeCalendar(calendarEl);
  }
  
  // スケジュールタブがクリックされたときのイベントを追加
  const scheduleTab = document.querySelector('a[href="#profile-schedule"]');
  if (scheduleTab) {
    console.log('スケジュールタブが見つかりました');
    scheduleTab.addEventListener('shown.bs.tab', function() {
      console.log('スケジュールタブが表示されました。カレンダーを再初期化します');
      
      // タブ表示後にカレンダーを再初期化
      const calendarEl = document.getElementById('reservation-calendar');
      if (calendarEl) {
        initializeCalendar(calendarEl);
      }
    });
  } else {
    console.error('スケジュールタブが見つかりません');
  }
});