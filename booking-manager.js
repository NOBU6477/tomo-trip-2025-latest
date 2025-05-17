/**
 * 予約管理用のJavaScriptモジュール
 * ガイドスケジュール管理と予約作成機能を提供します
 */

// 必要なDOMが読み込まれた後に初期化
document.addEventListener('DOMContentLoaded', function() {
  initBookingManager();
});

function initBookingManager() {
  setupBookingModals();
  setupScheduleManagement();
  setupBookingList();
}

/**
 * 予約モーダルの設定
 */
function setupBookingModals() {
  // 予約作成ボタンのイベントリスナー
  const createBookingBtns = document.querySelectorAll('.create-booking-btn');
  if (createBookingBtns) {
    createBookingBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const guideId = this.dataset.guideId;
        openCreateBookingModal(guideId);
      });
    });
  }

  // 予約モーダルの閉じるボタン
  const closeModalBtns = document.querySelectorAll('.close-modal-btn');
  if (closeModalBtns) {
    closeModalBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const modalId = this.closest('.modal').id;
        closeModal(modalId);
      });
    });
  }

  // 予約フォームの送信処理
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
      e.preventDefault();
      submitBookingForm();
    });
  }
}

/**
 * 予約作成モーダルを開く
 * @param {string} guideId ガイドID
 */
function openCreateBookingModal(guideId) {
  // ガイド情報をAPIから取得して表示
  fetchAPI(`/api/guides/${guideId}`)
    .then(guide => {
      // モーダル内の情報を更新
      const modal = document.getElementById('create-booking-modal');
      if (!modal) return;

      const nameElement = modal.querySelector('.guide-name');
      const bioElement = modal.querySelector('.guide-bio');
      const imageElement = modal.querySelector('.guide-image');
      const guideCityElement = modal.querySelector('.guide-city');
      const baseFeeElement = modal.querySelector('.base-fee');
      const hourlyFeeElement = modal.querySelector('.hourly-fee');
      
      if (nameElement) nameElement.textContent = `${guide.user.firstName} ${guide.user.lastName}`;
      if (bioElement) bioElement.textContent = guide.user.bio || '';
      if (guideCityElement) guideCityElement.textContent = guide.city || '';
      if (imageElement && guide.user.profileImage) {
        imageElement.src = guide.user.profileImage;
        imageElement.style.display = 'block';
      } else if (imageElement) {
        imageElement.style.display = 'none';
      }
      
      // 料金情報の表示
      const baseFee = guide.baseFee || 6000;
      const hourlyFee = guide.hourlyFee || 3000;
      if (baseFeeElement) baseFeeElement.textContent = `¥${baseFee.toLocaleString()}`;
      if (hourlyFeeElement) hourlyFeeElement.textContent = `¥${hourlyFee.toLocaleString()}`;

      // フォームのガイドIDを設定
      const guideIdInput = modal.querySelector('input[name="guideId"]');
      if (guideIdInput) guideIdInput.value = guideId;

      // 利用可能な日付を確認して日付選択を有効化
      initDatePicker(guideId);

      // モーダルを表示
      $(modal).modal('show');
    })
    .catch(error => {
      showError('ガイド情報の取得に失敗しました');
      console.error('Error fetching guide:', error);
    });
}

/**
 * 日付選択の初期化
 * @param {string} guideId ガイドID
 */
function initDatePicker(guideId) {
  const dateInput = document.getElementById('booking-date');
  if (!dateInput) return;

  // 本日と翌日以降の日付のみ選択可能にする
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // dateInputの設定
  dateInput.min = tomorrow.toISOString().split('T')[0];
  
  // 日付変更時のイベント
  dateInput.addEventListener('change', function() {
    updateTimeSlots(guideId, this.value);
  });
}

/**
 * ガイドの利用可能時間帯を更新
 * @param {string} guideId ガイドID
 * @param {string} date 日付（YYYY-MM-DD形式）
 */
function updateTimeSlots(guideId, date) {
  const startTimeSelect = document.getElementById('booking-start-time');
  const endTimeSelect = document.getElementById('booking-end-time');
  
  if (!startTimeSelect || !endTimeSelect) return;

  // 選択をリセット
  startTimeSelect.innerHTML = '<option value="">開始時間を選択</option>';
  endTimeSelect.innerHTML = '<option value="">終了時間を選択</option>';
  endTimeSelect.disabled = true;

  if (!date) return;

  // 選択された日付のガイドのスケジュールを取得
  fetchAPI(`/api/guide-availability/${guideId}?date=${date}`)
    .then(response => {
      if (response.isAvailable) {
        // 利用可能時間帯を設定（サンプル実装）
        const availableSlots = generateTimeSlots('09:00', '18:00', 60);
        
        availableSlots.forEach(slot => {
          const option = document.createElement('option');
          option.value = slot;
          option.textContent = slot;
          startTimeSelect.appendChild(option);
        });
        
        startTimeSelect.disabled = false;
      } else {
        // 利用不可能な場合のメッセージ
        startTimeSelect.innerHTML = '<option value="">この日は予約不可</option>';
        startTimeSelect.disabled = true;
      }
    })
    .catch(error => {
      console.error('Error fetching availability:', error);
      startTimeSelect.innerHTML = '<option value="">スケジュール取得エラー</option>';
      startTimeSelect.disabled = true;
    });

  // 開始時間の選択イベント
  startTimeSelect.addEventListener('change', function() {
    updateEndTimeOptions(this.value, endTimeSelect);
  });
}

/**
 * 開始時間に基づいて終了時間のオプションを更新
 * @param {string} startTime 選択された開始時間
 * @param {HTMLSelectElement} endTimeSelect 終了時間のセレクト要素
 */
function updateEndTimeOptions(startTime, endTimeSelect) {
  endTimeSelect.innerHTML = '<option value="">終了時間を選択</option>';
  
  if (!startTime) {
    endTimeSelect.disabled = true;
    return;
  }

  // 開始時間の1時間後から3時間後までの選択肢を生成
  const start = parseTimeToMinutes(startTime);
  const slots = [];
  
  for (let i = 1; i <= 3; i++) {
    const endMinutes = start + (i * 60);
    slots.push(formatMinutesToTime(endMinutes));
  }

  slots.forEach(slot => {
    const option = document.createElement('option');
    option.value = slot;
    option.textContent = slot;
    endTimeSelect.appendChild(option);
  });

  endTimeSelect.disabled = false;
}

/**
 * 予約フォームの送信処理
 */
function submitBookingForm() {
  const form = document.getElementById('booking-form');
  if (!form) return;

  const guideId = form.querySelector('input[name="guideId"]').value;
  const date = form.querySelector('#booking-date').value;
  const startTime = form.querySelector('#booking-start-time').value;
  const endTime = form.querySelector('#booking-end-time').value;
  const notes = form.querySelector('#booking-notes').value;

  if (!guideId || !date || !startTime || !endTime) {
    showError('必須項目を入力してください');
    return;
  }

  // 予約時間の計算
  const startMinutes = parseTimeToMinutes(startTime);
  const endMinutes = parseTimeToMinutes(endTime);
  const durationHours = (endMinutes - startMinutes) / 60;
  
  // ガイドの料金情報を取得
  const baseFeeElement = document.querySelector('.base-fee');
  const hourlyFeeElement = document.querySelector('.hourly-fee');
  
  // 料金計算
  const baseFee = parseInt(baseFeeElement ? baseFeeElement.textContent.replace(/[^\d]/g, '') : 6000);
  const hourlyFee = parseInt(hourlyFeeElement ? hourlyFeeElement.textContent.replace(/[^\d]/g, '') : 3000);
  
  // 基本料金（2時間）+ 追加時間に対する時間単価
  const baseHours = 2;
  const extraHours = Math.max(0, durationHours - baseHours);
  const totalFee = baseFee + (hourlyFee * extraHours);
  
  // 予約データを作成
  const bookingData = {
    guideId: parseInt(guideId, 10),
    bookingDate: date,
    startTime,
    endTime,
    notes,
    status: 'pending',
    fee: totalFee,
    durationHours: durationHours
  };

  // APIへの送信
  fetchAPI('/api/bookings', 'POST', bookingData)
    .then(response => {
      // 成功時の処理
      showSuccess('予約リクエストを送信しました');
      closeModal('create-booking-modal');
      
      // 予約一覧を更新
      loadBookings();
    })
    .catch(error => {
      showError('予約の作成に失敗しました: ' + (error.message || '不明なエラー'));
      console.error('Booking error:', error);
    });
}

/**
 * ガイドのスケジュール管理設定
 */
function setupScheduleManagement() {
  const scheduleForm = document.getElementById('schedule-form');
  if (scheduleForm) {
    scheduleForm.addEventListener('submit', function(e) {
      e.preventDefault();
      saveSchedule();
    });
  }

  // 曜日の選択イベント
  const daySelect = document.getElementById('schedule-day');
  if (daySelect) {
    daySelect.addEventListener('change', function() {
      loadDaySchedule(this.value);
    });
    
    // 初期値として月曜日のスケジュールを読み込む
    if (daySelect.value) {
      loadDaySchedule(daySelect.value);
    }
  }

  // 特別な日付設定の初期化
  setupSpecialDateFeature();

  // 例外日の追加ボタン
  const addExceptionBtn = document.getElementById('add-exception-btn');
  if (addExceptionBtn) {
    addExceptionBtn.addEventListener('click', function() {
      showExceptionForm();
    });
  }

  // 例外の保存
  const exceptionForm = document.getElementById('exception-form');
  if (exceptionForm) {
    exceptionForm.addEventListener('submit', function(e) {
      e.preventDefault();
      saveException();
    });
  }

  // 例外一覧の読み込み
  loadExceptions();
}

/**
 * 指定した曜日のスケジュールを読み込む
 * @param {string} day 曜日（例: "monday"）
 */
function loadDaySchedule(day) {
  const isAvailableCheckbox = document.getElementById('schedule-is-available');
  const startTimeInput = document.getElementById('schedule-start-time');
  const endTimeInput = document.getElementById('schedule-end-time');
  
  if (!isAvailableCheckbox || !startTimeInput || !endTimeInput) return;

  // APIからスケジュールを取得
  fetchAPI(`/api/schedules/${day}`)
    .then(schedule => {
      // フォームに値を設定
      isAvailableCheckbox.checked = schedule.isAvailable;
      startTimeInput.value = schedule.startTime || '09:00';
      endTimeInput.value = schedule.endTime || '18:00';
      
      toggleTimeInputs(isAvailableCheckbox.checked);
    })
    .catch(error => {
      // スケジュールが存在しない場合はデフォルト値を設定
      if (error.status === 404) {
        isAvailableCheckbox.checked = false;
        startTimeInput.value = '09:00';
        endTimeInput.value = '18:00';
        toggleTimeInputs(false);
      } else {
        console.error('Error loading schedule:', error);
        showError('スケジュールの読み込みに失敗しました');
      }
    });

  // 利用可能チェックボックスのイベント
  isAvailableCheckbox.addEventListener('change', function() {
    toggleTimeInputs(this.checked);
  });
}

/**
 * 利用可能フラグに基づいて時間入力の有効/無効を切り替え
 * @param {boolean} isAvailable 利用可能フラグ
 */
function toggleTimeInputs(isAvailable) {
  const startTimeInput = document.getElementById('schedule-start-time');
  const endTimeInput = document.getElementById('schedule-end-time');
  
  if (startTimeInput) startTimeInput.disabled = !isAvailable;
  if (endTimeInput) endTimeInput.disabled = !isAvailable;
}

/**
 * スケジュールの保存
 */
function saveSchedule() {
  const day = document.getElementById('schedule-day').value;
  const isAvailable = document.getElementById('schedule-is-available').checked;
  const startTime = document.getElementById('schedule-start-time').value;
  const endTime = document.getElementById('schedule-end-time').value;

  if (!day) {
    showError('曜日を選択してください');
    return;
  }

  const scheduleData = {
    dayOfWeek: day,
    isAvailable,
    startTime: isAvailable ? startTime : null,
    endTime: isAvailable ? endTime : null
  };

  // APIにスケジュールを送信
  fetchAPI('/api/schedules', 'POST', scheduleData)
    .then(response => {
      showSuccess('スケジュールを保存しました');
    })
    .catch(error => {
      showError('スケジュールの保存に失敗しました');
      console.error('Error saving schedule:', error);
    });
}

/**
 * 例外フォームの表示
 */
function showExceptionForm() {
  const exceptionModal = document.getElementById('exception-modal');
  if (exceptionModal) {
    // 日付入力の最小値を今日に設定
    const dateInput = exceptionModal.querySelector('#exception-date');
    if (dateInput) {
      const today = new Date();
      dateInput.min = today.toISOString().split('T')[0];
    }

    $(exceptionModal).modal('show');
  }
}

/**
 * スケジュール例外の保存
 */
function saveException() {
  const date = document.getElementById('exception-date').value;
  const isAvailable = document.getElementById('exception-is-available').checked;
  const startTime = document.getElementById('exception-start-time').value;
  const endTime = document.getElementById('exception-end-time').value;
  const reason = document.getElementById('exception-reason').value;

  if (!date) {
    showError('日付を選択してください');
    return;
  }

  const exceptionData = {
    exceptionDate: date,
    isAvailable,
    startTime: isAvailable ? startTime : null,
    endTime: isAvailable ? endTime : null,
    reason
  };

  // APIに例外を送信
  fetchAPI('/api/schedule-exceptions', 'POST', exceptionData)
    .then(response => {
      showSuccess('スケジュール例外を保存しました');
      $('#exception-modal').modal('hide');
      
      // 例外一覧を更新
      loadExceptions();
    })
    .catch(error => {
      showError('スケジュール例外の保存に失敗しました');
      console.error('Error saving exception:', error);
    });
}

/**
 * スケジュール例外一覧の読み込み
 */
function loadExceptions() {
  const exceptionsList = document.getElementById('exceptions-list');
  if (!exceptionsList) return;

  // 現在の月の範囲を取得
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  const endDate = new Date(today.getFullYear(), today.getMonth() + 3, 0);

  // APIから例外リストを取得
  fetchAPI(`/api/schedule-exceptions?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`)
    .then(exceptions => {
      exceptionsList.innerHTML = '';

      if (exceptions.length === 0) {
        exceptionsList.innerHTML = '<div class="alert alert-info">例外日程はありません</div>';
        return;
      }

      exceptions.forEach(exception => {
        const exceptionItem = document.createElement('div');
        exceptionItem.className = 'exception-item card mb-2';
        
        const statusClass = exception.isAvailable ? 'text-success' : 'text-danger';
        const statusText = exception.isAvailable ? '利用可能' : '利用不可';
        const timeInfo = exception.isAvailable && exception.startTime ? 
          `${exception.startTime} - ${exception.endTime}` : '';

        exceptionItem.innerHTML = `
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h5 class="card-title">${formatDate(exception.exceptionDate)}</h5>
                <p class="card-text ${statusClass}">${statusText} ${timeInfo}</p>
                ${exception.reason ? `<p class="card-text text-muted">${exception.reason}</p>` : ''}
              </div>
              <button class="btn btn-sm btn-outline-danger delete-exception-btn" data-id="${exception.id}">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        `;

        exceptionsList.appendChild(exceptionItem);
      });

      // 削除ボタンのイベントリスナーを設定
      setupExceptionDeleteButtons();
    })
    .catch(error => {
      exceptionsList.innerHTML = '<div class="alert alert-danger">例外の読み込みに失敗しました</div>';
      console.error('Error loading exceptions:', error);
    });
}

/**
 * 例外削除ボタンのイベントリスナー設定
 */
function setupExceptionDeleteButtons() {
  const deleteButtons = document.querySelectorAll('.delete-exception-btn');
  deleteButtons.forEach(button => {
    button.addEventListener('click', function() {
      const exceptionId = this.dataset.id;
      deleteException(exceptionId);
    });
  });
}

/**
 * 特別な日付設定機能のセットアップ
 * ガイドプロフィールページでの特別な日付（例外日）を管理するためのUI機能
 */
function setupSpecialDateFeature() {
  // 日付入力の最小値を今日に設定
  const specialDateInput = document.getElementById('special-date');
  if (specialDateInput) {
    const today = new Date();
    specialDateInput.min = today.toISOString().split('T')[0];
  }

  // 特別な日付の利用可能/不可のトグル処理
  const specialDateAvailableToggle = document.getElementById('special-date-available');
  const specialDateTimeContainer = document.getElementById('special-date-time-container');
  
  if (specialDateAvailableToggle && specialDateTimeContainer) {
    specialDateAvailableToggle.addEventListener('change', function() {
      specialDateTimeContainer.style.display = this.checked ? 'block' : 'none';
    });
  }

  // 特別な日付追加フォームの送信処理
  const specialDateForm = document.getElementById('special-date-form');
  if (specialDateForm) {
    specialDateForm.addEventListener('submit', function(e) {
      e.preventDefault();
      addSpecialDate();
    });
  }

  // 特別な日付一覧を読み込む
  loadSpecialDates();
}

/**
 * スケジュール例外の削除
 * @param {string} id 例外ID
 */
function deleteException(id) {
  if (!confirm('この例外を削除しますか？')) {
    return;
  }

  fetchAPI(`/api/schedule-exceptions/${id}`, 'DELETE')
    .then(() => {
      showSuccess('例外を削除しました');
      loadExceptions();
    })
    .catch(error => {
      showError('例外の削除に失敗しました');
      console.error('Error deleting exception:', error);
    });
}

/**
 * 予約一覧の設定
 */
function setupBookingList() {
  // 予約一覧タブのイベントリスナー
  const bookingTabs = document.querySelectorAll('a[data-toggle="tab"]');
  if (bookingTabs) {
    bookingTabs.forEach(tab => {
      tab.addEventListener('shown.bs.tab', function(e) {
        if (e.target.getAttribute('href') === '#tourist-bookings') {
          loadTouristBookings();
        } else if (e.target.getAttribute('href') === '#guide-bookings') {
          loadGuideBookings();
        }
      });
    });

    // 初期タブの内容を読み込む
    const activeTab = document.querySelector('a[data-toggle="tab"].active');
    if (activeTab) {
      if (activeTab.getAttribute('href') === '#tourist-bookings') {
        loadTouristBookings();
      } else if (activeTab.getAttribute('href') === '#guide-bookings') {
        loadGuideBookings();
      }
    }
  }
}

/**
 * ツーリストとしての予約一覧を読み込む
 */
function loadTouristBookings() {
  const bookingsList = document.getElementById('tourist-bookings-list');
  if (!bookingsList) return;

  // APIから予約一覧を取得
  fetchAPI('/api/bookings/tourist')
    .then(bookings => {
      renderBookingList(bookings, bookingsList, 'tourist');
    })
    .catch(error => {
      bookingsList.innerHTML = '<div class="alert alert-danger">予約の読み込みに失敗しました</div>';
      console.error('Error loading tourist bookings:', error);
    });
}

/**
 * ガイドとしての予約一覧を読み込む
 */
function loadGuideBookings() {
  const bookingsList = document.getElementById('guide-bookings-list');
  if (!bookingsList) return;

  // APIから予約一覧を取得
  fetchAPI('/api/bookings/guide')
    .then(bookings => {
      renderBookingList(bookings, bookingsList, 'guide');
    })
    .catch(error => {
      bookingsList.innerHTML = '<div class="alert alert-danger">予約の読み込みに失敗しました</div>';
      console.error('Error loading guide bookings:', error);
    });
}

/**
 * 予約一覧の表示
 * @param {Array} bookings 予約リスト
 * @param {HTMLElement} container 表示先のコンテナ要素
 * @param {string} role ユーザの役割（'tourist'または'guide'）
 */
function renderBookingList(bookings, container, role) {
  container.innerHTML = '';

  if (bookings.length === 0) {
    container.innerHTML = '<div class="alert alert-info">予約はありません</div>';
    return;
  }

  bookings.forEach(booking => {
    const bookingItem = document.createElement('div');
    bookingItem.className = 'booking-item card mb-3';
    
    // ステータスによってカードのスタイルを変更
    const statusClass = getStatusClass(booking.status);
    const statusText = getStatusText(booking.status);

    // 表示するユーザー情報を役割に応じて変更
    const userInfoPromise = role === 'tourist' 
      ? fetchAPI(`/api/guides/${booking.guideId}`) 
      : fetchAPI(`/api/users/${booking.touristId}`);

    userInfoPromise.then(userInfo => {
      const userName = role === 'tourist' 
        ? `${userInfo.user.firstName} ${userInfo.user.lastName}`
        : `${userInfo.firstName} ${userInfo.lastName}`;

      bookingItem.innerHTML = `
        <div class="card-header d-flex justify-content-between align-items-center">
          <span>予約ID: ${booking.id}</span>
          <span class="badge ${statusClass}">${statusText}</span>
        </div>
        <div class="card-body">
          <h5 class="card-title">${formatDate(booking.bookingDate)}</h5>
          <p class="card-text">時間: ${booking.startTime} - ${booking.endTime}</p>
          <p class="card-text">${role === 'tourist' ? 'ガイド' : 'ツーリスト'}: ${userName}</p>
          <p class="card-text text-success"><i class="fas fa-yen-sign"></i> 料金: ¥${booking.fee ? booking.fee.toLocaleString() : '計算中...'}</p>
          ${booking.notes ? `<p class="card-text text-muted">メモ: ${booking.notes}</p>` : ''}
          
          <div class="booking-actions mt-3">
            ${getBookingActionButtons(booking, role)}
          </div>
        </div>
      `;

      container.appendChild(bookingItem);

      // ボタンのイベントリスナーを設定
      const actionButtons = bookingItem.querySelectorAll('.booking-action-btn');
      actionButtons.forEach(button => {
        button.addEventListener('click', function() {
          const action = this.dataset.action;
          const bookingId = this.dataset.bookingId;
          updateBookingStatus(bookingId, action);
        });
      });
    }).catch(error => {
      console.error('Error fetching user info:', error);
      bookingItem.innerHTML = '<div class="card-body"><p class="text-danger">ユーザー情報の取得に失敗しました</p></div>';
      container.appendChild(bookingItem);
    });
  });
}

/**
 * 予約ステータスに応じたアクションボタンを取得
 * @param {Object} booking 予約情報
 * @param {string} role ユーザの役割
 * @returns {string} HTMLボタン要素の文字列
 */
function getBookingActionButtons(booking, role) {
  // ステータスと役割に応じて適切なボタンを表示
  switch (booking.status) {
    case 'pending':
      if (role === 'guide') {
        return `
          <button class="btn btn-success booking-action-btn" data-action="confirmed" data-booking-id="${booking.id}">
            承認する
          </button>
          <button class="btn btn-danger booking-action-btn" data-action="cancelled" data-booking-id="${booking.id}">
            拒否する
          </button>
        `;
      } else {
        return `
          <button class="btn btn-warning booking-action-btn" data-action="cancelled" data-booking-id="${booking.id}">
            キャンセルする
          </button>
        `;
      }
    
    case 'confirmed':
      if (role === 'guide') {
        return `
          <button class="btn btn-primary booking-action-btn" data-action="completed" data-booking-id="${booking.id}">
            完了にする
          </button>
          <button class="btn btn-danger booking-action-btn" data-action="cancelled" data-booking-id="${booking.id}">
            キャンセルする
          </button>
        `;
      } else {
        return `
          <button class="btn btn-warning booking-action-btn" data-action="cancelled" data-booking-id="${booking.id}">
            キャンセルする
          </button>
        `;
      }
    
    case 'completed':
      if (role === 'tourist') {
        return `
          <button class="btn btn-info" onclick="openReviewModal(${booking.id}, ${booking.guideId})">
            レビューを書く
          </button>
        `;
      }
      return '';
    
    case 'cancelled':
      return '';
    
    default:
      return '';
  }
}

/**
 * 予約ステータスの更新
 * @param {string} bookingId 予約ID
 * @param {string} status 新しいステータス
 */
function updateBookingStatus(bookingId, status) {
  const statusText = getStatusText(status);
  if (!confirm(`予約を${statusText}にしますか？`)) {
    return;
  }

  // APIにステータス更新リクエストを送信
  fetchAPI(`/api/bookings/${bookingId}/status`, 'PATCH', { status })
    .then(response => {
      showSuccess(`予約を${statusText}に更新しました`);
      
      // ビューを更新
      const activeTab = document.querySelector('a[data-toggle="tab"].active');
      if (activeTab) {
        if (activeTab.getAttribute('href') === '#tourist-bookings') {
          loadTouristBookings();
        } else if (activeTab.getAttribute('href') === '#guide-bookings') {
          loadGuideBookings();
        }
      }
    })
    .catch(error => {
      showError('予約ステータスの更新に失敗しました');
      console.error('Error updating booking status:', error);
    });
}

/**
 * レビューモーダルを開く
 * @param {string} bookingId 予約ID
 * @param {string} reviewedId レビュー対象のユーザーID
 */
function openReviewModal(bookingId, reviewedId) {
  const reviewModal = document.getElementById('review-modal');
  if (!reviewModal) return;

  // フォームの値を設定
  const bookingIdInput = reviewModal.querySelector('input[name="bookingId"]');
  const reviewedIdInput = reviewModal.querySelector('input[name="reviewedId"]');
  
  if (bookingIdInput) bookingIdInput.value = bookingId;
  if (reviewedIdInput) reviewedIdInput.value = reviewedId;

  $(reviewModal).modal('show');

  // レビュー送信イベント
  const reviewForm = reviewModal.querySelector('form');
  if (reviewForm) {
    reviewForm.addEventListener('submit', function(e) {
      e.preventDefault();
      submitReview();
    });
  }
}

/**
 * レビューの送信
 */
function submitReview() {
  const form = document.querySelector('#review-form');
  if (!form) return;

  const bookingId = form.querySelector('input[name="bookingId"]').value;
  const reviewedId = form.querySelector('input[name="reviewedId"]').value;
  const rating = form.querySelector('input[name="rating"]:checked').value;
  const comment = form.querySelector('textarea[name="comment"]').value;

  if (!rating) {
    showError('評価を選択してください');
    return;
  }

  const reviewData = {
    bookingId: parseInt(bookingId, 10),
    reviewedId: parseInt(reviewedId, 10),
    rating: parseInt(rating, 10),
    comment
  };

  // APIにレビューを送信
  fetchAPI('/api/reviews', 'POST', reviewData)
    .then(response => {
      showSuccess('レビューを投稿しました');
      $('#review-modal').modal('hide');
      
      // レビューフォームをリセット
      form.reset();
    })
    .catch(error => {
      showError('レビューの投稿に失敗しました');
      console.error('Error submitting review:', error);
    });
}

/**
 * APIへのリクエスト関数
 * @param {string} endpoint APIエンドポイント
 * @param {string} method HTTPメソッド（GET, POST, PATCH, DELETE）
 * @param {Object} data リクエストデータ
 * @returns {Promise} リクエスト結果のPromise
 */
function fetchAPI(endpoint, method = 'GET', data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin'
  };

  if (data && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }

  return fetch(endpoint, options)
    .then(response => {
      if (response.ok) {
        if (response.status === 204) {
          return null; // No content
        }
        return response.json();
      }
      
      // エラーハンドリング
      return response.json().then(errorData => {
        throw { 
          status: response.status, 
          message: errorData.message || 'Unknown error', 
          data: errorData 
        };
      });
    });
}

/**
 * エラーメッセージの表示
 * @param {string} message 表示するメッセージ
 */
function showError(message) {
  const alertsContainer = document.getElementById('alerts-container');
  if (!alertsContainer) return;

  const alert = document.createElement('div');
  alert.className = 'alert alert-danger alert-dismissible fade show';
  alert.innerHTML = `
    ${message}
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  `;

  alertsContainer.appendChild(alert);

  // 5秒後に自動的に消える
  setTimeout(() => {
    $(alert).alert('close');
  }, 5000);
}

/**
 * 成功メッセージの表示
 * @param {string} message 表示するメッセージ
 */
function showSuccess(message) {
  const alertsContainer = document.getElementById('alerts-container');
  if (!alertsContainer) return;

  const alert = document.createElement('div');
  alert.className = 'alert alert-success alert-dismissible fade show';
  alert.innerHTML = `
    ${message}
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  `;

  alertsContainer.appendChild(alert);

  // 5秒後に自動的に消える
  setTimeout(() => {
    $(alert).alert('close');
  }, 5000);
}

/**
 * モーダルを閉じる
 * @param {string} modalId モーダルのID
 */
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    $(modal).modal('hide');
  }
}

// ユーティリティ関数

/**
 * 日付のフォーマット
 * @param {string} dateStr 日付文字列
 * @returns {string} フォーマットされた日付
 */
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('ja-JP', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    weekday: 'long' 
  }).format(date);
}

/**
 * 予約ステータスに応じたCSSクラス名を取得
 * @param {string} status 予約ステータス
 * @returns {string} CSSクラス名
 */
function getStatusClass(status) {
  switch (status) {
    case 'pending': return 'badge-warning';
    case 'confirmed': return 'badge-success';
    case 'cancelled': return 'badge-danger';
    case 'completed': return 'badge-info';
    default: return 'badge-secondary';
  }
}

/**
 * 予約ステータスのテキストを取得
 * @param {string} status 予約ステータス
 * @returns {string} ステータステキスト
 */
function getStatusText(status) {
  switch (status) {
    case 'pending': return '承認待ち';
    case 'confirmed': return '承認済み';
    case 'cancelled': return 'キャンセル';
    case 'completed': return '完了';
    default: return status;
  }
}

/**
 * 開始時間と終了時間の間の時間枠を生成
 * @param {string} startTime 開始時間（HH:MM形式）
 * @param {string} endTime 終了時間（HH:MM形式）
 * @param {number} intervalMinutes 時間間隔（分）
 * @returns {Array} 時間枠の配列
 */
function generateTimeSlots(startTime, endTime, intervalMinutes = 30) {
  const slots = [];
  let current = parseTimeToMinutes(startTime);
  const end = parseTimeToMinutes(endTime);

  while (current < end) {
    slots.push(formatMinutesToTime(current));
    current += intervalMinutes;
  }

  return slots;
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

/**
 * 特別な日付(例外日)一覧を読み込む関数
 * ガイドプロフィールページの特別な日付設定セクションに表示するための一覧を取得
 * ウルトラモダンデザイン対応版
 * @global - グローバルスコープで利用可能にする
 */
window.loadSpecialDates = function() {
  // 現在のページがガイドプロフィール管理ページのスケジュールタブかどうかを確認
  const isProfileSchedulePage = document.body.classList.contains('guide-profile-page');
  
  // ガイドプロフィールページでのみdata属性を設定
  if (isProfileSchedulePage) {
    document.body.setAttribute('data-current-page', 'guide-profile-schedule');
    // 特別な日付セクションをガイドプロフィールページのスケジュールタブでのみ表示
    const specialDatesSection = document.querySelector('.special-dates-section');
    if (specialDatesSection) {
      // スケジュールタブがアクティブかどうかを確認
      const scheduleTab = document.getElementById('profile-schedule');
      if (scheduleTab && scheduleTab.classList.contains('active')) {
        specialDatesSection.style.display = 'block';
      } else {
        specialDatesSection.style.display = 'none';
        return; // アクティブでなければ処理を終了
      }
    }
  } else {
    // ガイドプロフィールページ以外では特別な日付セクションを非表示
    const specialDatesSection = document.querySelector('.special-dates-section');
    if (specialDatesSection) {
      specialDatesSection.style.display = 'none';
      return; // ガイドプロフィールページでなければ処理を終了
    }
  }
  
  // 特別な日付リストコンテナを取得
  const specialDatesList = document.getElementById('special-dates-list');
  if (!specialDatesList) return;

  // スピナーと空メッセージ要素を取得
  const spinnerElement = document.getElementById('special-dates-spinner');
  const emptyElement = document.getElementById('special-dates-empty');
  
  // スピナーを表示、空メッセージを非表示に
  if (spinnerElement) spinnerElement.style.display = 'flex';
  if (emptyElement) emptyElement.style.display = 'none';
  
  // 既存の特別日付アイテムを削除（再読み込み時）
  const existingItems = specialDatesList.querySelectorAll('.special-date-item');
  existingItems.forEach(item => item.remove());
  
  console.log('特別な日付リスト読み込み開始: モダンスピナー表示中');

  // 今日から3ヶ月分の範囲を取得（APIでは使うので準備しておく）
  const today = new Date();
  const endDate = new Date(today);
  endDate.setMonth(endDate.getMonth() + 3);

  // データを取得して表示するための内部関数
  // 遅延を入れてスピナーがちゃんと表示されるようにする
  setTimeout(function() {
    // モックデータ - 実際の実装では非同期APIリクエストになる
    const mockExceptions = [
      { id: '1', exceptionDate: '2025-05-05', isAvailable: false, reason: '祝日のためお休み' },
      { id: '2', exceptionDate: '2025-05-10', isAvailable: true, startTime: '10:00', endTime: '15:00', reason: '午後のみ可能' },
      { id: '3', exceptionDate: '2025-05-20', isAvailable: false, reason: 'イベント参加のため' },
      { id: '4', exceptionDate: '2025-06-01', isAvailable: true, startTime: '13:00', endTime: '17:00', reason: '午後のみ' }
    ];

    // HTML生成開始
    let htmlContent = '';
    
    // スピナー要素を非表示
    if (spinnerElement) {
      spinnerElement.style.display = 'none';
    }
    
    // 特別な日付がない場合の表示
    if (mockExceptions.length === 0) {
      if (emptyElement) {
        emptyElement.style.display = 'flex';  // 空のリストメッセージを表示
      }
    } else {
      // 日付順にソート
      mockExceptions.sort((a, b) => new Date(a.exceptionDate) - new Date(b.exceptionDate));
      
      // 各特別日付項目をHTMLとして生成 - モダンデザイン対応
      mockExceptions.forEach(exception => {
        // 日付をフォーマット
        const dateObj = new Date(exception.exceptionDate);
        const formattedDate = formatDate(exception.exceptionDate);
        const dayOfWeek = dateObj.toLocaleDateString('ja-JP', { weekday: 'long' });
        
        // バッジ用クラスとテキスト
        const badgeClass = exception.isAvailable ? 'badge-available' : 'badge-unavailable';
        const statusText = exception.isAvailable ? '予約受付可能' : '予約受付不可';
        
        // モダンなカード型アイテムHTMLを追加
        htmlContent += `
          <div class="special-date-item">
            <div class="special-date-item-header">
              <span class="special-date-item-date">${formattedDate}（${dayOfWeek}）</span>
              <span class="special-date-item-badge ${badgeClass}">${statusText}</span>
            </div>
            ${exception.isAvailable && exception.startTime ? `
              <div class="special-date-item-details">
                <i class="bi bi-clock"></i> ${exception.startTime} 〜 ${exception.endTime}
              </div>
            ` : ''}
            ${exception.reason ? `
              <div class="special-date-item-reason">
                <i class="bi bi-info-circle me-1"></i> ${exception.reason}
              </div>
            ` : ''}
            <button type="button" class="special-date-item-delete delete-special-date-btn" data-id="${exception.id}">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        `;
      });
    }
    
    // データを表示
    specialDatesList.insertAdjacentHTML('beforeend', htmlContent);
    
    // 削除ボタンのイベントリスナー設定
    setupSpecialDateDeleteButtons();
    
    console.log('特別な日付リスト読み込み完了:', mockExceptions.length, '件のデータを表示');
  }, 800); // 800ミリ秒の遅延 - モダンスピナーの表示が確認できるように
}

/**
 * 特別な日付の削除ボタンにイベントリスナーを設定
 * @global - グローバルスコープで利用可能にする
 */
window.setupSpecialDateDeleteButtons = function() {
  const deleteButtons = document.querySelectorAll('.delete-special-date-btn');
  deleteButtons.forEach(button => {
    button.addEventListener('click', function() {
      const specialDateId = this.dataset.id;
      deleteSpecialDate(specialDateId);
    });
  });
}

/**
 * 特別な日付を削除する関数
 * @param {string} id 特別な日付(例外日)ID
 * @global - グローバルスコープで利用可能にする
 */
window.deleteSpecialDate = function(id) {
  if (!confirm('この特別な日付設定を削除しますか？')) {
    return;
  }

  // 例外日削除と同じAPIを使用
  fetchAPI(`/api/schedule-exceptions/${id}`, 'DELETE')
    .then(() => {
      showSuccess('特別な日付設定を削除しました');
      loadSpecialDates(); // 一覧を再読み込み
    })
    .catch(error => {
      showError('特別な日付設定の削除に失敗しました');
      console.error('Error deleting special date:', error);
    });
}

/**
 * 新しい特別な日付を追加する関数
 * @global - グローバルスコープで利用可能にする
 */
window.addSpecialDate = function() {
  const date = document.getElementById('special-date').value;
  const isAvailable = document.getElementById('special-date-available').checked;
  const startTime = document.getElementById('special-date-start').value;
  const endTime = document.getElementById('special-date-end').value;
  const reason = document.getElementById('special-date-reason').value;

  if (!date) {
    showError('日付を選択してください');
    return;
  }

  // 日付チェック - 過去の日付は設定不可
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (selectedDate < today) {
    showError('過去の日付は選択できません');
    return;
  }

  // スケジュール例外と同じAPIを使用
  const specialDateData = {
    exceptionDate: date,
    isAvailable,
    startTime: isAvailable ? startTime : null,
    endTime: isAvailable ? endTime : null,
    reason
  };

  // APIに送信
  fetchAPI('/api/schedule-exceptions', 'POST', specialDateData)
    .then(response => {
      showSuccess('特別な日付設定を保存しました');
      
      // フォームリセット
      document.getElementById('special-date-form').reset();
      
      // 一覧を再読み込み
      loadSpecialDates();
    })
    .catch(error => {
      showError('特別な日付設定の保存に失敗しました');
      console.error('Error saving special date:', error);
    });
}