/**
 * モダンカレンダー設定
 * flatpickrをより洗練されたデザインで設定するためのスクリプト
 */

document.addEventListener('DOMContentLoaded', function() {
  // このスクリプトは非推奨となりました - schedule-calendar.jsに置き換えられています
  console.log('modern-calendar.js: このスクリプトは非推奨になりました');
  return;

  // 以下の古いコードは実行されません
  // 特別な日付入力フィールドを取得
  const specialDateInput = document.getElementById('special-date');
  
  if (specialDateInput && false) { // falseを追加して実行されないようにします
    // flatpickrの初期化オプション
    const options = {
      dateFormat: "Y-m-d",
      minDate: "today",
      disableMobile: "true", // モバイルネイティブのカレンダーを使用しない
      locale: 'ja', // 日本語ロケール
      monthSelectorType: "static", // 月選択を静的表示に
      
      // 今日の日付以降のみ選択可能
      onOpen: function(selectedDates, dateStr, instance) {
        // カレンダーが開いたときのアニメーション効果
        instance.calendarContainer.classList.add('open');
      },
      
      // 選択したときのコールバック
      onChange: function(selectedDates, dateStr, instance) {
        // 日付が選択されたときの処理
        console.log('選択された日付:', dateStr);
        
        // イベントをトリガーして他のスクリプトに通知
        const event = new CustomEvent('special-date-changed', {
          detail: { date: dateStr }
        });
        document.dispatchEvent(event);
      }
    };
    
    // flatpickrを初期化
    const calendar = flatpickr(specialDateInput, options);
    
    // 今日の日付をデフォルト値に設定
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedToday = `${year}-${month}-${day}`;
    specialDateInput.value = formattedToday;
    
    console.log('モダンカレンダー初期化完了');
  } else {
    console.warn('特別な日付入力フィールドが見つかりません');
  }
});

// 時間帯設定 UI の初期化
document.addEventListener('DOMContentLoaded', function() {
  // このスクリプトは非推奨となりました - schedule-calendar.jsに置き換えられています
  console.log('modern-calendar.js (time settings): このスクリプトは非推奨になりました');
  return;

  // 以下の古いコードは実行されません
  // 時間選択要素の取得
  const startTimeSelect = document.getElementById('special-date-start');
  const endTimeSelect = document.getElementById('special-date-end');
  
  if (startTimeSelect && endTimeSelect && false) { // falseを追加して実行されないようにします
    // 開始時間が変更されたときに、終了時間のオプションを調整
    startTimeSelect.addEventListener('change', function() {
      const selectedStartTime = this.value;
      updateEndTimeOptions(selectedStartTime, endTimeSelect);
    });
    
    // 初期状態でも終了時間のオプションを調整
    updateEndTimeOptions(startTimeSelect.value, endTimeSelect);
  }
  
  // トグルスイッチの挙動
  const availableToggle = document.getElementById('special-date-available');
  const timeContainer = document.getElementById('special-date-time-container');
  
  if (availableToggle && timeContainer) {
    availableToggle.addEventListener('change', function() {
      timeContainer.style.display = this.checked ? 'block' : 'none';
    });
    
    // 初期状態の設定
    timeContainer.style.display = availableToggle.checked ? 'block' : 'none';
  }
});

/**
 * 開始時間に基づいて終了時間のオプションを更新
 * @param {string} startTime 選択された開始時間
 * @param {HTMLSelectElement} endTimeSelect 終了時間のセレクト要素
 */
function updateEndTimeOptions(startTime, endTimeSelect) {
  // 現在の選択を記憶
  const currentEndTime = endTimeSelect.value;
  
  // 時間を分に変換
  const startMinutes = parseTimeToMinutes(startTime);
  
  // 少なくとも2時間後から選択可能にする
  const minEndMinutes = startMinutes + 120;
  
  // オプションをリセット
  endTimeSelect.innerHTML = '';
  
  // 利用可能な終了時間オプションを追加（30分単位）
  for (let minutes = minEndMinutes; minutes <= 22 * 60; minutes += 30) {
    const timeStr = formatMinutesToTime(minutes);
    const option = document.createElement('option');
    option.value = timeStr;
    option.textContent = timeStr;
    endTimeSelect.appendChild(option);
  }
  
  // 以前の選択が有効範囲なら復元、そうでなければ最初のオプションを選択
  const validEndTimes = Array.from(endTimeSelect.options).map(opt => opt.value);
  if (validEndTimes.includes(currentEndTime)) {
    endTimeSelect.value = currentEndTime;
  } else {
    endTimeSelect.selectedIndex = 0; // 最初のオプションを選択
  }
}

/**
 * 時間文字列を分に変換
 * @param {string} timeStr 時間文字列（HH:MM形式）
 * @returns {number} 分に変換した値
 */
function parseTimeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * 分を時間文字列に変換
 * @param {number} minutes 分
 * @returns {string} 時間文字列（HH:MM形式）
 */
function formatMinutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}