/**
 * スケジュール予約カレンダー管理スクリプト
 * 予約カレンダーの初期化と操作を行います
 */

// カレンダーの状態を保持
let currentCalendar = null;
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

// 予約状況データの例（APIから取得するデータ）
// 実際の実装ではAPIからデータを取得します
const sampleBookings = [
  { date: '2025-04-23', status: 'booked', name: '山田様' },
  { date: '2025-04-25', status: 'booked', name: '佐藤様' },
  { date: '2025-04-30', status: 'booked', name: '鈴木様' },
  { date: '2025-05-05', status: 'booked', name: '田中様' },
  { date: '2025-05-10', status: 'booked', name: '伊藤様' }
];

// 特別な日付設定の例（APIから取得するデータ）
// 実際の実装ではAPIからデータを取得します
const sampleSpecialDates = [
  { date: '2025-04-29', isAvailable: false, reason: 'ゴールデンウィーク' },
  { date: '2025-05-03', isAvailable: false, reason: '祝日' },
  { date: '2025-05-04', isAvailable: false, reason: '祝日' },
  { date: '2025-05-20', isAvailable: true, startTime: '10:00', endTime: '18:00', reason: '特別営業日' }
];

// 定期的なスケジュール設定（APIから取得するデータ）
// 実際の実装ではAPIからデータを取得します
const sampleScheduleSettings = {
  monday: { isAvailable: true, startTime: '9:00', endTime: '17:00' },
  tuesday: { isAvailable: true, startTime: '9:00', endTime: '17:00' },
  wednesday: { isAvailable: true, startTime: '9:00', endTime: '17:00' },
  thursday: { isAvailable: true, startTime: '9:00', endTime: '17:00' },
  friday: { isAvailable: true, startTime: '9:00', endTime: '17:00' },
  saturday: { isAvailable: true, startTime: '10:00', endTime: '16:00' },
  sunday: { isAvailable: false }
};

// 曜日のマッピング
const dayOfWeekMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

/**
 * 予約カレンダーを初期化
 */
function initReservationCalendar() {
  const calendarElement = document.getElementById('reservation-calendar');
  
  if (!calendarElement) {
    console.error('カレンダー要素が見つかりません');
    return;
  }
  
  // カレンダーボタンの設定
  setupCalendarButtons();
  
  // カレンダーの構築と描画
  buildCalendar(currentYear, currentMonth);
}

/**
 * カレンダーナビゲーションボタンの設定
 */
function setupCalendarButtons() {
  // 前月ボタン
  const prevMonthBtn = document.getElementById('prevMonthBtn');
  if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', function() {
      navigateMonth(-1);
    });
  }
  
  // 今月ボタン
  const currentMonthBtn = document.getElementById('currentMonthBtn');
  if (currentMonthBtn) {
    currentMonthBtn.addEventListener('click', function() {
      const now = new Date();
      currentYear = now.getFullYear();
      currentMonth = now.getMonth();
      buildCalendar(currentYear, currentMonth);
    });
  }
  
  // 翌月ボタン
  const nextMonthBtn = document.getElementById('nextMonthBtn');
  if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', function() {
      navigateMonth(1);
    });
  }
  
  // 前年ボタン
  const prevYearBtn = document.getElementById('prevYearBtn');
  if (prevYearBtn) {
    prevYearBtn.addEventListener('click', function() {
      navigateYear(-1);
    });
  }
  
  // 翌年ボタン
  const nextYearBtn = document.getElementById('nextYearBtn');
  if (nextYearBtn) {
    nextYearBtn.addEventListener('click', function() {
      navigateYear(1);
    });
  }
}

/**
 * 月を移動
 * @param {number} step - 移動ステップ（-1: 前月、1: 翌月）
 */
function navigateMonth(step) {
  currentMonth += step;
  
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  } else if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  
  buildCalendar(currentYear, currentMonth);
}

/**
 * 年を移動
 * @param {number} step - 移動ステップ（-1: 前年、1: 翌年）
 */
function navigateYear(step) {
  currentYear += step;
  buildCalendar(currentYear, currentMonth);
}

/**
 * カレンダーを構築
 * @param {number} year - 表示する年
 * @param {number} month - 表示する月（0-11）
 */
function buildCalendar(year, month) {
  const calendarElement = document.getElementById('reservation-calendar');
  if (!calendarElement) return;
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();
  
  // 月名を取得
  const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  
  // カレンダーのHTMLを生成
  let calendarHTML = `
    <div class="calendar-header">
      <h5 class="calendar-month-year">${year}年 ${monthNames[month]}</h5>
    </div>
    <table class="calendar-table">
      <thead>
        <tr>
          <th>日</th>
          <th>月</th>
          <th>火</th>
          <th>水</th>
          <th>木</th>
          <th>金</th>
          <th>土</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  // 日付を計算
  let day = 1;
  const rows = Math.ceil((daysInMonth + startDayOfWeek) / 7);
  
  for (let i = 0; i < rows; i++) {
    calendarHTML += '<tr>';
    
    for (let j = 0; j < 7; j++) {
      if ((i === 0 && j < startDayOfWeek) || day > daysInMonth) {
        calendarHTML += '<td class="empty-day"></td>';
      } else {
        const currentDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dateClass = getDateClass(currentDate, day);
        const dateContent = getDateContent(currentDate, day);
        
        calendarHTML += `
          <td class="${dateClass}" data-date="${currentDate}">
            <div class="calendar-day-number">${day}</div>
            ${dateContent}
          </td>
        `;
        
        day++;
      }
    }
    
    calendarHTML += '</tr>';
  }
  
  calendarHTML += `
      </tbody>
    </table>
  `;
  
  // カレンダーを表示
  calendarElement.innerHTML = calendarHTML;
  
  // カレンダー日付のクリックイベントを設定
  setupCalendarDayClicks();
}

/**
 * 日付のクラスを取得
 * @param {string} dateStr - 日付文字列（YYYY-MM-DD）
 * @param {number} day - 日
 * @returns {string} 日付に適用するCSSクラス
 */
function getDateClass(dateStr, day) {
  const today = new Date();
  const currentDate = new Date(dateStr);
  let classes = 'calendar-day';
  
  // 土曜日の場合
  if (currentDate.getDay() === 6) {
    classes += ' weekend saturday';
  }
  
  // 日曜日の場合
  if (currentDate.getDay() === 0) {
    classes += ' weekend sunday';
  }
  
  // 今日の日付の場合
  if (
    today.getFullYear() === currentDate.getFullYear() &&
    today.getMonth() === currentDate.getMonth() &&
    today.getDate() === currentDate.getDate()
  ) {
    classes += ' today';
  }
  
  // 過去の日付の場合
  if (currentDate < new Date(today.setHours(0, 0, 0, 0))) {
    classes += ' past-day';
    return classes;
  }
  
  // 予約状況に基づくクラス
  const booking = sampleBookings.find(b => b.date === dateStr);
  if (booking) {
    classes += ' booked-day';
    return classes;
  }
  
  // 特別な日付設定に基づくクラス
  const specialDate = sampleSpecialDates.find(sd => sd.date === dateStr);
  if (specialDate) {
    classes += specialDate.isAvailable ? ' special-available-day' : ' special-unavailable-day';
    return classes;
  }
  
  // 通常のスケジュール設定に基づくクラス
  const dayOfWeek = dayOfWeekMap[currentDate.getDay()];
  const scheduleForDay = sampleScheduleSettings[dayOfWeek];
  
  if (scheduleForDay && scheduleForDay.isAvailable) {
    classes += ' available-day';
  } else {
    classes += ' unavailable-day';
  }
  
  return classes;
}

/**
 * 日付のコンテンツを取得
 * @param {string} dateStr - 日付文字列（YYYY-MM-DD）
 * @param {number} day - 日
 * @returns {string} 日付に表示する追加コンテンツのHTML
 */
function getDateContent(dateStr, day) {
  let content = '';
  
  // 予約がある場合、予約マーカーを表示
  const booking = sampleBookings.find(b => b.date === dateStr);
  if (booking) {
    content += '<div class="booking-marker" title="予約あり"></div>';
  }
  
  // 特別な日付設定がある場合、特別日マーカーを表示
  const specialDate = sampleSpecialDates.find(sd => sd.date === dateStr);
  if (specialDate) {
    const markerClass = specialDate.isAvailable ? 'special-available-marker' : 'special-unavailable-marker';
    content += `<div class="${markerClass}" title="${specialDate.reason || '特別設定'}"></div>`;
  }
  
  return content;
}

/**
 * カレンダー日付のクリックイベントを設定
 */
function setupCalendarDayClicks() {
  const calendarDays = document.querySelectorAll('.calendar-day');
  
  calendarDays.forEach(day => {
    day.addEventListener('click', function() {
      // すでに過去の日付の場合は何もしない
      if (day.classList.contains('past-day')) {
        return;
      }
      
      const dateStr = day.getAttribute('data-date');
      showDateDetails(dateStr, day);
    });
  });
}

/**
 * 日付の詳細情報を表示
 * @param {string} dateStr - 日付文字列（YYYY-MM-DD）
 * @param {HTMLElement} dayElement - 日付要素
 */
function showDateDetails(dateStr, dayElement) {
  // 日付をフォーマット
  const date = new Date(dateStr);
  const formattedDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  
  // 予約情報を取得
  const booking = sampleBookings.find(b => b.date === dateStr);
  
  // 特別な日付設定を取得
  const specialDate = sampleSpecialDates.find(sd => sd.date === dateStr);
  
  // 通常スケジュール設定を取得
  const dayOfWeek = dayOfWeekMap[date.getDay()];
  const dayOfWeekNames = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'];
  const scheduleForDay = sampleScheduleSettings[dayOfWeek];
  
  // ダイアログのコンテンツを作成
  let dialogHTML = `
    <div class="date-detail-header">${formattedDate}（${dayOfWeekNames[date.getDay()]}）</div>
    <div class="date-detail-content">
  `;
  
  // 予約情報があれば表示
  if (booking) {
    dialogHTML += `
      <div class="detail-section booking-section">
        <h6><i class="bi bi-calendar-check"></i> 予約情報</h6>
        <div class="detail-item">
          <span class="detail-label">予約者:</span>
          <span class="detail-value">${booking.name}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">ステータス:</span>
          <span class="detail-value">${booking.status === 'booked' ? '予約確定' : '予約待ち'}</span>
        </div>
      </div>
    `;
  }
  
  // 特別な日付設定があれば表示
  if (specialDate) {
    dialogHTML += `
      <div class="detail-section special-date-section">
        <h6><i class="bi bi-calendar-star"></i> 特別設定</h6>
        <div class="detail-item">
          <span class="detail-label">予約受付:</span>
          <span class="detail-value">${specialDate.isAvailable ? '可能' : '不可'}</span>
        </div>
    `;
    
    if (specialDate.isAvailable) {
      dialogHTML += `
        <div class="detail-item">
          <span class="detail-label">時間帯:</span>
          <span class="detail-value">${specialDate.startTime}～${specialDate.endTime}</span>
        </div>
      `;
    }
    
    if (specialDate.reason) {
      dialogHTML += `
        <div class="detail-item">
          <span class="detail-label">理由:</span>
          <span class="detail-value">${specialDate.reason}</span>
        </div>
      `;
    }
    
    dialogHTML += `</div>`;
  }
  
  // 通常スケジュール設定を表示
  dialogHTML += `
    <div class="detail-section regular-schedule-section">
      <h6><i class="bi bi-clock"></i> 通常スケジュール設定</h6>
  `;
  
  if (scheduleForDay && scheduleForDay.isAvailable) {
    dialogHTML += `
      <div class="detail-item">
        <span class="detail-label">予約受付:</span>
        <span class="detail-value">可能</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">時間帯:</span>
        <span class="detail-value">${scheduleForDay.startTime}～${scheduleForDay.endTime}</span>
      </div>
    `;
  } else {
    dialogHTML += `
      <div class="detail-item">
        <span class="detail-label">予約受付:</span>
        <span class="detail-value">不可</span>
      </div>
    `;
  }
  
  dialogHTML += `
      </div>
    </div>
  `;
  
  // ダイアログを表示（実際の表示方法はプロジェクトに合わせて実装）
  alert(`${formattedDate}の予約状況:\n${booking ? '予約あり: ' + booking.name : '予約なし'}\n${specialDate ? '特別設定: ' + (specialDate.isAvailable ? '予約可能' : '予約不可') : ''}`);
  
  // 実際のプロジェクトではモーダル表示などにする
  console.log(dialogHTML);
}

/**
 * 特別な日付を追加する関数
 */
function addSpecialDate() {
  console.log('特別な日付追加関数が呼び出されました');
  
  try {
    // フォーム要素の取得
    const dateInput = document.getElementById('special-date');
    const availableToggle = document.getElementById('special-date-available');
    const startTimeSelect = document.getElementById('special-date-start');
    const endTimeSelect = document.getElementById('special-date-end');
    const reasonTextarea = document.getElementById('special-date-reason');
    
    if (!dateInput || !availableToggle) {
      console.error('必要なフォーム要素が見つかりません');
      alert('フォーム要素が見つかりません。ページをリロードして再試行してください。');
      return false;
    }
    
    console.log('フォーム要素を取得しました');
    
    // 日付の取得（flatpickrインスタンスから直接取得を試みる）
    let date = '';
    
    // 入力フィールドの値を最初に確認
    if (dateInput.value) {
      date = dateInput.value;
      console.log('入力フィールドから日付を取得:', date);
    } 
    // flatpickrインスタンスがあれば、そこから値を取得
    else if (dateInput._flatpickr && dateInput._flatpickr.selectedDates && dateInput._flatpickr.selectedDates.length > 0) {
      date = dateInput._flatpickr.selectedDates[0].toISOString().split('T')[0];
      console.log('flatpickrから日付を取得:', date);
    }
    // それでも取得できなければ、今日の日付を使用
    else {
      const today = new Date();
      date = today.toISOString().split('T')[0];
      console.log('デフォルト日付(今日)を使用:', date);
    }
    
    const isAvailable = availableToggle.checked;
    const startTime = isAvailable && startTimeSelect ? startTimeSelect.value : '';
    const endTime = isAvailable && endTimeSelect ? endTimeSelect.value : '';
    const reason = reasonTextarea ? reasonTextarea.value : '';
    
    console.log('取得した値:', { date, isAvailable, startTime, endTime, reason });
    
    if (!date) {
      alert('日付を選択してください');
      return false;
    }
    
    // 開始時間と終了時間が選択されているか確認（予約可能な場合）
    if (isAvailable && (!startTime || !endTime)) {
      alert('開始時間と終了時間を選択してください');
      return false;
    }
    
    // 既に同じ日付の設定が存在するかチェック
    const existingDate = sampleSpecialDates.find(sd => sd.date === date);
    if (existingDate) {
      if (confirm('この日付の設定は既に存在します。上書きしますか？')) {
        // 既存の設定を削除
        const index = sampleSpecialDates.findIndex(sd => sd.date === date);
        if (index !== -1) {
          sampleSpecialDates.splice(index, 1);
        }
      } else {
        return false;
      }
    }
    
    // 新しい特別な日付データを作成
    const newSpecialDate = {
      id: Date.now(), // 一意のIDを生成
      date: date,
      isAvailable: isAvailable,
      startTime: startTime,
      endTime: endTime,
      reason: reason
    };
    
    console.log('新しい特別な日付データを作成しました:', newSpecialDate);
    
    // サンプルデータに追加（実際の実装ではAPIを呼び出す）
    sampleSpecialDates.push(newSpecialDate);
    
    // 成功メッセージを表示
    alert('特別な日付を追加しました: ' + new Date(date).toLocaleDateString('ja-JP') + (isAvailable ? ' (予約可能)' : ' (予約不可)'));
    
    // 特別な日付リストを更新 - タイマーを追加して確実に実行されるようにする
    setTimeout(() => {
      console.log('リスト更新を実行します');
      updateSpecialDatesList();
    }, 100);
    
    // フォームをリセット
    if (reasonTextarea) {
      reasonTextarea.value = '';
    }
    
    // 特別な日付トグルをリセット（デフォルトで予約可能に）
    if (availableToggle) {
      availableToggle.checked = true;
      // 時間セレクターの表示設定を更新
      const timeSelectsContainer = document.querySelector('.time-selects');
      if (timeSelectsContainer) {
        timeSelectsContainer.style.display = 'grid';
      }
    }
    
    // カレンダーを再描画
    if (typeof buildCalendar === 'function') {
      buildCalendar(currentYear, currentMonth);
    }
    
    return true;
  } catch (err) {
    console.error('特別な日付追加中にエラーが発生しました:', err);
    alert('エラーが発生しました: ' + err.message);
    return false;
  }
}

/**
 * 特別な日付リストを更新する関数
 */
function updateSpecialDatesList() {
  console.log('特別な日付リスト更新関数が呼び出されました');

  const listContainer = document.getElementById('special-dates-list');
  const spinner = document.getElementById('special-dates-spinner');
  const emptyMessage = document.getElementById('special-dates-empty');
  
  // デバッグのために現在のデータを出力
  console.log('現在のsampleSpecialDates:', JSON.stringify(sampleSpecialDates));
  
  // スピナーを非表示（遅延処理を追加して動作を確実にする）
  if (spinner) {
    spinner.style.display = 'none';
    console.log('スピナーを非表示にしました');
  }
  
  // リストコンテナが見つからない場合は終了
  if (!listContainer) {
    console.error('リストコンテナが見つかりません');
    return;
  }
  
  console.log('リストコンテナを取得しました:', listContainer);
  
  try {
    // 既存のリストアイテムをクリア
    listContainer.innerHTML = '';
    
    // タイムライン要素を作成
    const timeline = document.createElement('div');
    timeline.className = 'special-date-timeline';
    listContainer.appendChild(timeline);
    
    // 特別な日付がない場合は空メッセージを表示
    if (!sampleSpecialDates || sampleSpecialDates.length === 0) {
      console.log('特別な日付が設定されていません');
      if (emptyMessage) {
        emptyMessage.style.display = 'block';
      }
      return;
    }
    
    // 空メッセージを非表示
    if (emptyMessage) {
      emptyMessage.style.display = 'none';
    }
    
    // 日付でソート
    const sortedDates = [...sampleSpecialDates].sort((a, b) => new Date(a.date) - new Date(b.date));
    console.log('ソート済みの特別な日付:', sortedDates);
    
    // 各特別な日付についてリストアイテムを作成
    sortedDates.forEach((specialDate, index) => {
      try {
        console.log(`日付アイテム #${index + 1}を処理中:`, specialDate);
        
        const dateObj = new Date(specialDate.date);
        
        // より読みやすいフォーマットで日付を表示
        const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' };
        const formattedDate = dateObj.toLocaleDateString('ja-JP', options);
        
        const item = document.createElement('div');
        item.className = 'special-date-item';
        item.dataset.id = specialDate.id;
        
        let statusClass = specialDate.isAvailable ? 'available' : 'unavailable';
        let statusText = specialDate.isAvailable ? '予約可能' : '予約不可';
        let statusIcon = specialDate.isAvailable ? 'check-circle-fill' : 'x-circle-fill';
        
        const timeInfo = specialDate.isAvailable && specialDate.startTime && specialDate.endTime
          ? `
            <div class="special-date-time">
              <i class="bi bi-clock"></i> ${specialDate.startTime} - ${specialDate.endTime}
            </div>
          ` 
          : '';
        
        const reasonInfo = specialDate.reason 
          ? `
            <div class="special-date-reason">
              <i class="bi bi-card-text"></i> ${specialDate.reason}
            </div>
          ` 
          : '';
        
        item.innerHTML = `
          <div class="special-date-item-content">
            <div class="special-date-header">
              <div class="special-date-date">${formattedDate}</div>
              <div class="special-date-status ${statusClass}">
                <i class="bi bi-${statusIcon}"></i> ${statusText}
              </div>
            </div>
            
            ${timeInfo}
            ${reasonInfo}
            
            <button class="special-date-delete-btn" onclick="deleteSpecialDate(${specialDate.id})">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        `;
        
        timeline.appendChild(item);
      } catch (err) {
        console.error(`日付 #${index + 1} (${specialDate?.date})の処理中にエラーが発生しました:`, err);
      }
    });
    
    console.log('特別な日付リストの更新が完了しました');
  } catch (err) {
    console.error('特別な日付リストの更新中にエラーが発生しました:', err);
  }
}

/**
 * 特別な日付を削除する関数
 * @param {number} id - 削除する特別な日付のID
 */
function deleteSpecialDate(id) {
  // 確認ダイアログ
  if (!confirm('この特別な日付設定を削除してもよろしいですか？')) {
    return;
  }
  
  // IDに一致する特別な日付を削除
  const index = sampleSpecialDates.findIndex(date => date.id === id);
  if (index !== -1) {
    sampleSpecialDates.splice(index, 1);
    
    // リストを更新
    updateSpecialDatesList();
    
    // カレンダーを再描画
    buildCalendar(currentYear, currentMonth);
    
    console.log('特別な日付を削除しました:', id);
  }
}

/**
 * 特別な日付入力フィールドの初期化
 */
function initSpecialDateField() {
  const dateInput = document.getElementById('special-date');
  if (!dateInput) {
    console.warn('特別な日付入力フィールドが見つかりません');
    return;
  }
  
  // 今日の日付以降のみ選択可能に設定
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const formattedToday = `${year}-${month}-${day}`;
  
  try {
    // flatpickrが既に初期化されているか確認
    if (dateInput._flatpickr) {
      dateInput._flatpickr.destroy();
      console.log('既存のflatpickrインスタンスを破棄しました');
    }
    
    // 日付選択用のflatpickrを初期化 - モダンなテーマ適用
    flatpickr(dateInput, {
      dateFormat: "Y-m-d",
      minDate: "today",
      disableMobile: true,
      locale: 'ja',
      defaultDate: formattedToday,
      allowInput: true,
      clickOpens: true,
      time_24hr: true,
      inline: false,  // インラインモードを無効化
      static: true,   // 静的な位置決め
      appendTo: document.getElementById('special-date').parentNode,  // 親要素に追加
      maxDate: new Date().fp_incr(180), // 半年先まで指定可能
      animate: true, // アニメーション有効化
      showMonths: 1, // モバイルでは1ヶ月表示
      // ネイティブカレンダーのモバイル対応
      disableMobile: "true",
      // モダンテーマ追加設定
      nextArrow: '<i class="bi bi-chevron-right"></i>',
      prevArrow: '<i class="bi bi-chevron-left"></i>',
      // 選択時のイベント
      onChange: function(selectedDates, dateStr) {
        console.log('選択された日付:', dateStr);
        
        // 開始時間と終了時間のデフォルト値を設定
        const startTimeSelect = document.getElementById('special-date-start');
        const endTimeSelect = document.getElementById('special-date-end');
        
        if (startTimeSelect && endTimeSelect) {
          // 開始時間が未選択なら「9:00」をデフォルトに設定
          if (!startTimeSelect.value) {
            startTimeSelect.value = '9:00';
            updateEndTimeOptions('9:00', endTimeSelect);
          }
        }
      },
      // 開く時のコールバック
      onOpen: function(selectedDates, dateStr, instance) {
        // カレンダーのモダンなスタイルを適用
        instance.calendarContainer.classList.add('modern-calendar');
      }
    });
    console.log('flatpickrカレンダーを初期化しました');
  } catch (error) {
    console.error('flatpickr初期化エラー:', error);
  }
  
  // 時間選択要素の取得
  const startTimeSelect = document.getElementById('special-date-start');
  const endTimeSelect = document.getElementById('special-date-end');
  
  if (startTimeSelect && endTimeSelect) {
    // 時間選択肢の作成関数を実装
    populateTimeOptions(startTimeSelect, '09:00');
    
    // 開始時間が変更されたときに終了時間のオプションを調整
    startTimeSelect.addEventListener('change', function() {
      const selectedStartTime = this.value;
      updateEndTimeOptions(selectedStartTime, endTimeSelect);
    });
    
    // 初期状態でも終了時間のオプションを調整
    updateEndTimeOptions(startTimeSelect.value || '09:00', endTimeSelect);
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
  
  // 特別な日付追加ボタンのイベントリスナー設定
  const addButton = document.getElementById('add-special-date-btn');
  if (addButton) {
    addButton.removeEventListener('click', addSpecialDate);
    addButton.addEventListener('click', addSpecialDate);
    console.log('特別な日付追加ボタンにイベントリスナーを設定しました');
  } else {
    console.warn('特別な日付追加ボタンが見つかりません');
  }
  
  console.log('特別な日付入力フィールドを初期化しました');
}

/**
 * 開始時間に基づいて終了時間のオプションを更新
 * @param {string} startTime 選択された開始時間
 * @param {HTMLSelectElement} endTimeSelect 終了時間のセレクト要素
 */
function updateEndTimeOptions(startTime, endTimeSelect) {
  console.log('終了時間オプション更新関数が呼び出されました:', startTime);
  
  if (!startTime || !endTimeSelect) {
    console.warn('開始時間または終了時間のセレクト要素が見つかりません');
    return;
  }
  
  try {
    // 開始時間を分に変換
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const startTotalMinutes = startHours * 60 + startMinutes;
    
    // 既存のオプションをクリア
    endTimeSelect.innerHTML = '';
    
    // セレクト要素自体のスタイルを直接設定
    endTimeSelect.style.backgroundColor = '#ffffff';
    endTimeSelect.style.color = '#000000';
    endTimeSelect.style.border = '2px solid #0077b6';
    endTimeSelect.style.fontWeight = '500';
    endTimeSelect.style.padding = '12px 15px';
    
    // 開始時間から30分後から23:30までの30分間隔のオプションを追加
    for (let time = startTotalMinutes + 30; time <= 23 * 60 + 30; time += 30) {
      // 24時を超えないようにする
      if (time >= 24 * 60) continue;
      
      const hours = Math.floor(time / 60);
      const minutes = time % 60;
      // 時間を2桁表示にフォーマット
      const formattedHours = hours.toString().padStart(2, '0');
      const timeStr = `${formattedHours}:${minutes === 0 ? '00' : minutes}`;
      
      const option = document.createElement('option');
      option.value = timeStr;
      option.textContent = timeStr;
      
      // 各オプションのスタイルを直接設定
      option.style.backgroundColor = '#ffffff';
      option.style.color = '#000000';
      option.style.padding = '10px';
      option.style.fontWeight = 'normal';
      
      // 最初のオプションを選択状態にする
      if (time === startTotalMinutes + 30) {
        option.selected = true;
        option.style.backgroundColor = '#e6f2ff';
        option.style.fontWeight = 'bold';
      }
      
      endTimeSelect.appendChild(option);
    }
    
    // 選択肢がない場合は、開始時間+30分を追加（次の日に回る場合は考慮しない）
    if (endTimeSelect.options.length === 0) {
      const defaultEndHours = startHours;
      const defaultEndMinutes = startMinutes + 30;
      
      // 分が60を超える場合は時間を調整
      const adjustedHours = defaultEndHours + Math.floor(defaultEndMinutes / 60);
      const adjustedMinutes = defaultEndMinutes % 60;
      
      // 時間が24時を超えないようにする
      if (adjustedHours < 24) {
        const formattedHours = adjustedHours.toString().padStart(2, '0');
        const formattedMinutes = adjustedMinutes === 0 ? '00' : adjustedMinutes.toString().padStart(2, '0');
        
        const option = document.createElement('option');
        option.value = `${formattedHours}:${formattedMinutes}`;
        option.textContent = option.value;
        option.selected = true;
        endTimeSelect.appendChild(option);
      }
    }
    
    // 直接値を設定してUIを更新する
    if (endTimeSelect.selectedIndex === -1 && endTimeSelect.options.length > 0) {
      endTimeSelect.selectedIndex = 0;
    }
    
    console.log('終了時間のオプションを更新しました:', endTimeSelect.options.length, '個のオプション');
  } catch (err) {
    console.error('終了時間のオプション更新中にエラーが発生しました:', err);
  }
}

// ページ読み込み時にカレンダーを初期化して特別な日付リストを表示
document.addEventListener('DOMContentLoaded', function() {
  console.log('予約カレンダーを初期化します...');
  
  // カレンダーと特別な日付フィールドを初期化
  initReservationCalendar();
  initSpecialDateField();
  
  // トグルスイッチの挙動を初期化
  const availableToggle = document.getElementById('special-date-available');
  const timeContainer = document.querySelector('.time-selects');
  
  if (availableToggle && timeContainer) {
    // イベントリスナーを設定（既存のリスナーを削除してから）
    availableToggle.removeEventListener('change', toggleTimeSelector);
    availableToggle.addEventListener('change', toggleTimeSelector);
    
    // 初期状態を設定
    toggleTimeSelector.call(availableToggle);
    
    console.log('時間セレクターの表示切り替えリスナーを設定しました');
  }
  
  // 特別な日付リストを表示
  updateSpecialDatesList();
});

/**
 * 特別な時間セレクターの表示を切り替える関数
 * チェックボックスのchange/clickイベントのコールバックとして使用
 */
function toggleTimeSelector() {
  const timeContainer = document.querySelector('.time-selects');
  if (timeContainer) {
    if (this.checked) {
      // 予約可能な場合は表示
      timeContainer.style.display = 'grid';
      
      // 初期値を設定
      const startTimeSelect = document.getElementById('special-date-start');
      const endTimeSelect = document.getElementById('special-date-end');
      
      if (startTimeSelect && endTimeSelect) {
        // 開始時間の選択肢が設定されていなければ設定する
        if (startTimeSelect.options.length === 0) {
          populateTimeOptions(startTimeSelect, '09:00');
        }
        
        if (startTimeSelect.value && endTimeSelect) {
          // 開始時間が選択されている場合、終了時間のオプションを更新
          updateEndTimeOptions(startTimeSelect.value, endTimeSelect);
        }
      }
      
      console.log('時間セレクターの表示状態を更新: 表示');
    } else {
      // 予約不可の場合は非表示
      timeContainer.style.display = 'none';
      console.log('時間セレクターの表示状態を更新: 非表示');
    }
  }
}

/**
 * 時間選択肢を生成する
 * @param {HTMLSelectElement} selectElement 時間選択セレクト要素
 * @param {string} defaultValue デフォルト選択値
 */
function populateTimeOptions(selectElement, defaultValue) {
  console.log('時間選択肢を生成します', selectElement?.id);
  
  if (!selectElement) {
    console.warn('時間選択要素が見つかりません');
    return;
  }
  
  try {
    // 既存のオプションをクリア
    selectElement.innerHTML = '';
    
    // スタイルを直接設定して確実に見やすくする
    selectElement.style.backgroundColor = '#ffffff';
    selectElement.style.color = '#000000';
    selectElement.style.border = '2px solid #0077b6';
    selectElement.style.fontWeight = '500';
    selectElement.style.padding = '12px 15px';
    
    // 00:00から23:30まで30分間隔で選択肢を生成
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        const timeValue = `${formattedHour}:${formattedMinute}`;
        
        const option = document.createElement('option');
        option.value = timeValue;
        option.textContent = timeValue;
        option.style.backgroundColor = '#ffffff';
        option.style.color = '#000000';
        option.style.padding = '10px';
        option.style.fontWeight = 'normal';
        
        // デフォルト値と一致する場合は選択状態にする
        if (timeValue === defaultValue) {
          option.selected = true;
          option.style.backgroundColor = '#e6f2ff';
          option.style.fontWeight = 'bold';
        }
        
        selectElement.appendChild(option);
      }
    }
    
    console.log(`${selectElement.options.length}個の時間選択肢を生成しました`);
  } catch (err) {
    console.error('時間選択肢生成中にエラーが発生しました:', err);
  }
}