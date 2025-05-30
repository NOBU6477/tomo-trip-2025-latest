/**
 * ガイドプロフィール編集機能
 * 写真ギャラリー、スケジュール管理などのガイドプロフィール編集機能を提供
 */
document.addEventListener('DOMContentLoaded', function() {
  // セッションからユーザー情報を取得
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || null;
  
  // ログインしていない場合はホームにリダイレクト
  if (!currentUser || currentUser.type !== 'guide') {
    // アラートを表示
    const alertContainer = document.createElement('div');
    alertContainer.className = 'alert alert-danger alert-dismissible fade show';
    alertContainer.setAttribute('role', 'alert');
    alertContainer.innerHTML = `
      <strong>アクセスが拒否されました</strong> - ガイドとしてログインしてください。
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.body.prepend(alertContainer);
    
    // 3秒後にホームページにリダイレクト
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 3000);
    
    return;
  }
  
  // ユーザー名を表示
  const userNameElement = document.getElementById('user-name');
  if (userNameElement && currentUser) {
    userNameElement.textContent = currentUser.name;
  }
  
  // 基本情報フォームの処理
  setupBasicInfoForm();
  
  // 写真ギャラリーの設定
  setupPhotoGallery();
  
  // スケジュールタブの設定
  setupScheduleTabs();
  
  // メッセージ機能の設定
  // setupMessaging();  // メッセージング機能は別ファイルに実装
  
  // 設定タブの処理
  setupSettingsTab();
  
  // プロフィール写真の変更処理
  setupProfilePhoto();
  
  /**
   * 基本情報フォームのセットアップ
   */
  function setupBasicInfoForm() {
    const profileForm = document.getElementById('profile-basic-form');
    
    if (profileForm) {
      // デモデータをフォームに設定
      document.getElementById('guide-name').value = currentUser.name || 'デモガイド';
      document.getElementById('guide-username').value = 'demo_guide';
      document.getElementById('guide-email').value = currentUser.email || 'guide@example.com';
      document.getElementById('guide-location').value = '東京都新宿区';
      
      // 言語の選択（デモデータ）
      const languagesSelect = document.getElementById('guide-languages');
      if (languagesSelect) {
        // 日本語と英語を選択
        for (let option of languagesSelect.options) {
          if (option.value === 'ja' || option.value === 'en') {
            option.selected = true;
          }
        }
      }
      
      // 自己紹介文（デモデータ）
      document.getElementById('guide-description').value = 
        '東京在住10年以上のローカルガイドです。観光名所だけでなく、地元の人しか知らない隠れた名所や飲食店をご案内します。写真好きの方には特におすすめのスポットをご紹介できます。英語での案内も可能です。';
      
      // 料金設定（デモデータ）
      document.getElementById('guide-session-fee').value = 6000;
      
      // 興味・得意分野（デモデータ）
      document.getElementById('interest-night').checked = true;
      document.getElementById('interest-photo').checked = true;
      
      // フォーム送信処理
      profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 実際のアプリではここでAPIにデータを送信
        
        // 成功メッセージを表示
        showAlert('基本情報が保存されました', 'success');
      });
    }
  }
  
  /**
   * 写真ギャラリーのセットアップ
   */
  function setupPhotoGallery() {
    const photoGallery = document.getElementById('photo-gallery');
    const galleryFileInput = document.getElementById('gallery-file-input');
    const addPhotoButton = document.getElementById('add-photo-button');
    const saveGalleryButton = document.getElementById('save-gallery-button');
    
    if (photoGallery) {
      // 初期の空の写真枠を15個生成
      for (let i = 0; i < 15; i++) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item gallery-item-empty';
        galleryItem.innerHTML = `
          <div class="text-center text-muted">
            <i class="bi bi-plus-lg fs-2"></i>
            <p class="mb-0 small">写真を追加</p>
          </div>
        `;
        galleryItem.setAttribute('data-index', i);
        photoGallery.appendChild(galleryItem);
        
        // 空の写真枠をクリックした時の処理
        galleryItem.addEventListener('click', function() {
          const index = this.getAttribute('data-index');
          galleryFileInput.setAttribute('data-target-index', index);
          galleryFileInput.click();
        });
      }
      
      // ファイル選択時の処理
      if (galleryFileInput) {
        galleryFileInput.addEventListener('change', function() {
          if (this.files && this.files[0]) {
            const targetIndex = this.getAttribute('data-target-index');
            const targetItem = document.querySelector(`.gallery-item[data-index="${targetIndex}"]`);
            
            if (targetItem) {
              const reader = new FileReader();
              
              reader.onload = function(e) {
                targetItem.className = 'gallery-item';
                targetItem.innerHTML = `
                  <img src="${e.target.result}" class="gallery-img" alt="ギャラリー写真">
                  <div class="gallery-item-actions">
                    <button type="button" class="btn btn-outline-light btn-sm me-2 replace-photo" data-index="${targetIndex}">
                      <i class="bi bi-arrow-repeat"></i>
                    </button>
                    <button type="button" class="btn btn-outline-danger btn-sm delete-photo" data-index="${targetIndex}">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                `;
                
                // 写真の変更ボタンのイベント設定
                targetItem.querySelector('.replace-photo').addEventListener('click', function(e) {
                  e.stopPropagation();
                  const index = this.getAttribute('data-index');
                  galleryFileInput.setAttribute('data-target-index', index);
                  galleryFileInput.click();
                });
                
                // 写真の削除ボタンのイベント設定
                targetItem.querySelector('.delete-photo').addEventListener('click', function(e) {
                  e.stopPropagation();
                  const index = this.getAttribute('data-index');
                  const itemToEmpty = document.querySelector(`.gallery-item[data-index="${index}"]`);
                  
                  if (itemToEmpty) {
                    itemToEmpty.className = 'gallery-item gallery-item-empty';
                    itemToEmpty.innerHTML = `
                      <div class="text-center text-muted">
                        <i class="bi bi-plus-lg fs-2"></i>
                        <p class="mb-0 small">写真を追加</p>
                      </div>
                    `;
                  }
                });
              };
              
              reader.readAsDataURL(this.files[0]);
            }
          }
        });
      }
      
      // 「写真を追加」ボタンのイベント
      if (addPhotoButton) {
        addPhotoButton.addEventListener('click', function() {
          // 最初の空の写真枠を探す
          const emptyItem = document.querySelector('.gallery-item-empty');
          
          if (emptyItem) {
            const index = emptyItem.getAttribute('data-index');
            galleryFileInput.setAttribute('data-target-index', index);
            galleryFileInput.click();
          } else {
            showAlert('これ以上写真を追加できません。最大15枚までです。', 'warning');
          }
        });
      }
      
      // 保存ボタンのイベント
      if (saveGalleryButton) {
        saveGalleryButton.addEventListener('click', function() {
          // 実際のアプリではここでAPIにデータを送信
          
          const photoCount = document.querySelectorAll('.gallery-item:not(.gallery-item-empty)').length;
          showAlert(`${photoCount}枚の写真が保存されました`, 'success');
        });
      }
      
      // テスト用に初期データを設定（デモ用）
      addSamplePhotos();
    }
  }
  
  /**
   * サンプル写真を追加（デモ用）
   */
  function addSamplePhotos() {
    // サンプル画像URL（実際のアプリでは動的に生成）
    const sampleImageUrls = [
      'https://placehold.co/300x225/007bff/ffffff?text=Tokyo+Tower',
      'https://placehold.co/300x225/28a745/ffffff?text=Asakusa',
      'https://placehold.co/300x225/dc3545/ffffff?text=Shibuya'
    ];
    
    // サンプル画像を設定
    for (let i = 0; i < sampleImageUrls.length; i++) {
      const targetItem = document.querySelector(`.gallery-item[data-index="${i}"]`);
      
      if (targetItem) {
        targetItem.className = 'gallery-item';
        targetItem.innerHTML = `
          <img src="${sampleImageUrls[i]}" class="gallery-img" alt="ギャラリー写真">
          <div class="gallery-item-actions">
            <button type="button" class="btn btn-outline-light btn-sm me-2 replace-photo" data-index="${i}">
              <i class="bi bi-arrow-repeat"></i>
            </button>
            <button type="button" class="btn btn-outline-danger btn-sm delete-photo" data-index="${i}">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        `;
        
        // 写真の変更ボタンのイベント設定
        targetItem.querySelector('.replace-photo').addEventListener('click', function(e) {
          e.stopPropagation();
          const index = this.getAttribute('data-index');
          document.getElementById('gallery-file-input').setAttribute('data-target-index', index);
          document.getElementById('gallery-file-input').click();
        });
        
        // 写真の削除ボタンのイベント設定
        targetItem.querySelector('.delete-photo').addEventListener('click', function(e) {
          e.stopPropagation();
          const index = this.getAttribute('data-index');
          const itemToEmpty = document.querySelector(`.gallery-item[data-index="${index}"]`);
          
          if (itemToEmpty) {
            itemToEmpty.className = 'gallery-item gallery-item-empty';
            itemToEmpty.innerHTML = `
              <div class="text-center text-muted">
                <i class="bi bi-plus-lg fs-2"></i>
                <p class="mb-0 small">写真を追加</p>
              </div>
            `;
          }
        });
      }
    }
  }
  
  /**
   * スケジュールタブのセットアップ
   */
  function setupScheduleTabs() {
    const scheduleTabs = document.querySelectorAll('#schedule-tabs .nav-link');
    const scheduleAvailableCheckboxes = document.querySelectorAll('.schedule-available');
    const saveScheduleButton = document.getElementById('save-schedule-button');
    
    // 曜日ごとの時間設定コンテナ
    const timeContainers = document.querySelectorAll('[id$="-time-container"]');
    
    // 予約カレンダーの初期化
    initializeReservationCalendar();
    
    // プロフィールの各タブ（基本情報/写真/スケジュール/メッセージ/設定）のイベント設定
    const profileTabs = document.querySelectorAll('#profile-tabs .nav-link');
    profileTabs.forEach(tab => {
      tab.addEventListener('shown.bs.tab', function(event) {
        const targetId = this.getAttribute('href').substring(1);
        
        // 特別な日付セクションの表示制御
        const specialDatesContainer = document.querySelector('.special-dates-container');
        if (specialDatesContainer) {
          // スケジュールタブでのみ表示
          if (targetId === 'profile-schedule') {
            // すぐに表示するのではなく、少し遅延を入れて確実に適用
            setTimeout(() => {
              specialDatesContainer.style.display = 'block';
              // データ属性も設定
              document.body.setAttribute('data-current-page', 'guide-profile-schedule');
              console.log('特別な日付設定セクションを表示しました');
            }, 100);
          } else {
            specialDatesContainer.style.display = 'none';
            document.body.setAttribute('data-current-page', `guide-profile-${targetId.replace('profile-', '')}`);
            console.log('特別な日付設定セクションを非表示にしました');
          }
        }
      });
    });
    
    // 利用可能チェックボックスのイベント設定
    scheduleAvailableCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        const day = this.getAttribute('data-day');
        const timeContainer = document.getElementById(`${day}-time-container`);
        
        if (timeContainer) {
          const timeInputs = timeContainer.querySelectorAll('select');
          
          // チェックボックスの状態に応じて時間入力を有効/無効
          timeInputs.forEach(input => {
            input.disabled = !this.checked;
          });
          
          // 時間コンテナの表示/非表示
          if (this.checked) {
            timeContainer.classList.remove('d-none');
          } else {
            timeContainer.classList.add('d-none');
          }
        }
      });
      
      // 初期状態ではチェックを入れておく（デモ用）
      if (['monday', 'wednesday', 'friday', 'saturday', 'sunday'].includes(checkbox.value)) {
        checkbox.checked = true;
        checkbox.dispatchEvent(new Event('change'));
      } else {
        checkbox.checked = false;
        checkbox.dispatchEvent(new Event('change'));
      }
    });
    
    // 保存ボタンのイベント
    if (saveScheduleButton) {
      saveScheduleButton.addEventListener('click', function() {
        // 予約カレンダーを更新
        updateReservationCalendar();
        
        // 実際のアプリではここでAPIにデータを送信
        
        // 成功メッセージを表示
        showAlert('スケジュールが保存されました', 'success');
      });
    }
  }
  
  /**
   * 予約カレンダーの初期化
   */
  function initializeReservationCalendar() {
    // Note: このカレンダー初期化は schedule-calendar.js に移動しました
    // 下位互換性のために残していますが、実際には実行しないようにしています
    console.log('guide-profile.js: カレンダー初期化はschedule-calendar.jsに移行しました');
    return;
    
    const calendarEl = document.getElementById('reservation-calendar');
    if (!calendarEl) {
      console.error('カレンダー要素が見つかりません');
      return;
    }
    
    console.log('カレンダー要素を初期化します:', calendarEl);
    
    // カレンダーの設定
    const today = new Date();
    
    // デモ用の予約データ（実際のアプリではAPIから取得）
    const demoBookings = [
      {
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
        booked: true,
        time: '10:00-12:00'
      },
      {
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
        booked: true,
        time: '14:00-16:00'
      },
      {
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
        booked: false,
        time: '10:00-12:00'
      },
      {
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 9),
        booked: false,
        time: '13:00-15:00'
      }
    ];
    
    // 利用可能曜日の設定（チェックボックスの状態から取得）
    const availableDays = Array.from(document.querySelectorAll('.schedule-available:checked'))
      .map(checkbox => checkbox.value);
    
    // カレンダーの初期化
    const calendar = flatpickr(calendarEl, {
      inline: true,
      mode: "multiple",
      dateFormat: "Y-m-d",
      locale: "ja",
      minDate: "today",
      maxDate: new Date().fp_incr(90), // 90日先まで
      disable: [
        function(date) {
          // 利用可能曜日以外を無効化
          const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()];
          return !availableDays.includes(dayName);
        }
      ],
      onDayCreate: function(dObj, dStr, fp, dayElem) {
        // 予約状況に応じてクラスを追加
        const date = dayElem.dateObj;
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        
        // 予約済みの日付
        const booking = demoBookings.find(b => {
          const bookingDate = b.date;
          return bookingDate.getFullYear() === date.getFullYear() &&
                 bookingDate.getMonth() === date.getMonth() &&
                 bookingDate.getDate() === date.getDate();
        });
        
        if (booking) {
          if (booking.booked) {
            // 予約済み
            dayElem.classList.add('fully-booked');
            dayElem.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
            dayElem.style.color = '#ff0000';
            dayElem.title = `予約済み: ${booking.time}`;
          } else {
            // 予約可能
            dayElem.classList.add('available');
            dayElem.style.backgroundColor = 'rgba(0, 128, 0, 0.1)';
            dayElem.style.color = '#008000';
            dayElem.title = `予約可能: ${booking.time}`;
          }
        }
      },
      onChange: function(selectedDates, dateStr, instance) {
        // 選択された日付の詳細を表示するなどの処理
        // 実際のアプリではここに予約状況表示機能を実装
      }
    });
    
    // グローバル変数にカレンダーインスタンスを保存
    window.reservationCalendar = calendar;
  }
  
  /**
   * 予約カレンダーの更新
   */
  function updateReservationCalendar() {
    if (!window.reservationCalendar) return;
    
    // 利用可能曜日の再取得
    const availableDays = Array.from(document.querySelectorAll('.schedule-available:checked'))
      .map(checkbox => checkbox.value);
    
    // カレンダーの設定を更新
    window.reservationCalendar.set('disable', [
      function(date) {
        // 利用可能曜日以外を無効化
        const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()];
        return !availableDays.includes(dayName);
      }
    ]);
    
    // カレンダーを再描画
    window.reservationCalendar.redraw();
    
    // 予約可能日の表示を更新
    updateAvailableDays();
  }
  
  /**
   * 予約可能日の表示を更新
   */
  function updateAvailableDays() {
    // 実際のアプリではここでAPIから予約状況を取得して表示更新
    
    // デモ用の表示更新
    showAlert('予約カレンダーが更新されました', 'info');
  }
  
  /**
   * 設定タブのセットアップ
   */
  function setupSettingsTab() {
    const settingsForm = document.getElementById('profile-settings-form');
    const deleteAccountBtn = document.getElementById('delete-account-btn');
    
    if (settingsForm) {
      settingsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // 簡易的なバリデーション
        if (!currentPassword) {
          showAlert('現在のパスワードを入力してください', 'danger');
          return;
        }
        
        if (newPassword !== confirmPassword) {
          showAlert('新しいパスワードと確認用パスワードが一致しません', 'danger');
          return;
        }
        
        if (newPassword && newPassword.length < 8) {
          showAlert('パスワードは8文字以上で設定してください', 'danger');
          return;
        }
        
        // 実際のアプリではここでAPIにデータを送信
        
        // 成功メッセージを表示
        showAlert('パスワードが変更されました', 'success');
        
        // フォームをリセット
        this.reset();
      });
    }
    
    if (deleteAccountBtn) {
      deleteAccountBtn.addEventListener('click', function() {
        // 確認ダイアログを表示
        if (confirm('本当にアカウントを削除しますか？この操作は取り消せません。')) {
          // 実際のアプリではここでAPIにデータを送信
          
          // セッションを削除
          sessionStorage.removeItem('currentUser');
          
          // 成功メッセージを表示
          showAlert('アカウントが削除されました。ホームページにリダイレクトします...', 'success');
          
          // ホームページにリダイレクト
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 2000);
        }
      });
    }
  }
  
  /**
   * プロフィール写真のセットアップ
   */
  function setupProfilePhoto() {
    const profilePhotoContainer = document.querySelector('.profile-photo-container');
    const mainProfilePhoto = document.getElementById('main-profile-photo');
    const mainProfilePreview = document.getElementById('main-profile-preview');
    
    if (profilePhotoContainer && mainProfilePhoto && mainProfilePreview) {
      // プロフィール写真コンテナをクリックしたらファイル選択を開く
      profilePhotoContainer.addEventListener('click', function() {
        mainProfilePhoto.click();
      });
      
      // ファイル選択時の処理
      mainProfilePhoto.addEventListener('change', function() {
        if (this.files && this.files[0]) {
          const reader = new FileReader();
          
          reader.onload = function(e) {
            mainProfilePreview.src = e.target.result;
            
            // 変更をサーバーに保存する処理（実際のアプリではAPIに送信）
            showAlert('プロフィール写真が更新されました', 'success');
          };
          
          reader.readAsDataURL(this.files[0]);
        }
      });
    }
  }
  
  /**
   * アラート表示の共通関数
   */
  function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alert-container');
    
    if (!alertContainer) {
      // アラートコンテナがなければ作成
      const newAlertContainer = document.createElement('div');
      newAlertContainer.id = 'alert-container';
      newAlertContainer.style.position = 'fixed';
      newAlertContainer.style.top = '20px';
      newAlertContainer.style.right = '20px';
      newAlertContainer.style.maxWidth = '400px';
      newAlertContainer.style.zIndex = '9999';
      document.body.appendChild(newAlertContainer);
    }
    
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type} alert-dismissible fade show`;
    alertElement.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    document.getElementById('alert-container').appendChild(alertElement);
    
    // 5秒後に自動的に消える
    setTimeout(() => {
      alertElement.classList.remove('show');
      setTimeout(() => {
        alertElement.remove();
      }, 150);
    }, 5000);
  }
});