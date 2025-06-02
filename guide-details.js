/**
 * ガイド詳細ページのスクリプト
 * ガイド情報の表示、予約、チャット機能の制御
 */
document.addEventListener('DOMContentLoaded', function() {
  // URLからガイドIDを取得
  const urlParams = new URLSearchParams(window.location.search);
  const guideId = urlParams.get('id');
  
  console.log(`ガイド詳細ページを初期化中... ガイドID: ${guideId}`);
  
  // データ同期システムの読み込みを待つ
  function initializeGuideDetails() {
    if (guideId) {
      // 少し遅延を入れて他のスクリプトが完全に読み込まれてから実行
      setTimeout(() => {
        loadGuideDetails(guideId);
      }, 500);
    } else {
      console.warn('ガイドIDがURLパラメータに含まれていません');
      showErrorMessage('ガイドIDが指定されていません。');
    }
  }
  
  // データ同期システムが利用可能かチェック
  if (window.guideDataSync) {
    initializeGuideDetails();
  } else {
    // データ同期システムの読み込みを待つ
    let checkCount = 0;
    const checkInterval = setInterval(() => {
      checkCount++;
      if (window.guideDataSync || checkCount > 10) {
        clearInterval(checkInterval);
        initializeGuideDetails();
      }
    }, 100);
  }
  
  // 予約日選択
  setupDateSelection();
  
  // チャット送信処理
  setupChatForm();
  
  // 予約フォーム送信
  setupBookingForm();
  
  // ページのアラート要素をチェック
  checkAlertElements();
  
  console.log("ガイド詳細ページの基本機能を初期化しました");
});

/**
 * ガイド詳細情報を読み込む
 */
function loadGuideDetails(guideId) {
  console.log(`ガイドID ${guideId} の詳細情報を読み込み中...`);
  
  // データ同期システムからガイドデータを取得
  let guideData = null;
  
  // 1. データ同期システムから取得を試行
  if (window.guideDataSync && typeof window.guideDataSync.getGuideData === 'function') {
    guideData = window.guideDataSync.getGuideData(guideId);
    if (guideData) {
      console.log(`データ同期システムからデータを取得: ${guideData.name}`);
    }
  }
  
  // 2. データ同期システムで見つからない場合、直接ストレージから検索
  if (!guideData) {
    console.log('データ同期システムで見つからないため、直接検索します');
    
    // セッションストレージから個別データを検索
    const individualKey = `guide_${guideId}`;
    const individualData = sessionStorage.getItem(individualKey);
    if (individualData) {
      try {
        guideData = JSON.parse(individualData);
        console.log(`セッションストレージからデータを取得: ${guideData.name}`);
      } catch (e) {
        console.warn('個別データの解析に失敗:', e);
      }
    }
    
    // ローカルストレージからガイドリストを検索
    if (!guideData) {
      const savedGuides = localStorage.getItem('userAddedGuides');
      if (savedGuides) {
        try {
          const guidesArray = JSON.parse(savedGuides);
          guideData = guidesArray.find(guide => guide.id.toString() === guideId.toString());
          if (guideData) {
            console.log(`ローカルストレージからデータを取得: ${guideData.name}`);
          }
        } catch (e) {
          console.warn('ローカルストレージデータの解析に失敗:', e);
        }
      }
    }
    
    // 現在のユーザーデータを確認
    if (!guideData) {
      const currentUser = sessionStorage.getItem('currentUser');
      if (currentUser) {
        try {
          const userData = JSON.parse(currentUser);
          if (userData.id && userData.id.toString() === guideId.toString()) {
            guideData = userData;
            console.log(`現在のユーザーデータを使用: ${guideData.name}`);
          }
        } catch (e) {
          console.warn('現在のユーザーデータの解析に失敗:', e);
        }
      }
    }
  }
  
  // データが見つからない場合はエラーメッセージを表示
  if (!guideData) {
    console.error(`ガイドID ${guideId} のデータが見つかりません`);
    showErrorMessage('ガイド情報が見つかりませんでした。');
    return;
  }
  
  console.log('取得したガイドデータ:', guideData);
  
  // 基本情報の表示
  updateGuideBasicInfo(guideData);
  
  // 詳細情報の表示
  updateGuideDetailedInfo(guideData);
  
  // 料金情報の表示
  updateGuidePricing(guideData);
  
  // スキルと特技の表示
  updateGuideSkills(guideData);
  
  // 言語の表示
  updateGuideLanguages(guideData);
  
  // プロフィール画像の表示
  updateGuideProfileImage(guideData);
  
  // 予約可能日の選択肢をセットアップ
  setupAvailabilityDates();
  
  console.log('ガイド詳細情報の表示が完了しました:', guideData.name);
}

/**
 * ガイドの基本情報を更新
 */
function updateGuideBasicInfo(guideData) {
  console.log('基本情報を更新中:', guideData.name);
  
  // 名前の更新
  const nameElements = document.querySelectorAll('#guide-name, .guide-name, [data-field="name"]');
  nameElements.forEach(elem => {
    if (elem) elem.textContent = guideData.name || 'ガイド名未設定';
  });
  
  // 地域の更新
  const locationElements = document.querySelectorAll('#guide-location, .guide-location, [data-field="location"]');
  locationElements.forEach(elem => {
    if (elem) elem.textContent = guideData.city || guideData.location || '地域未設定';
  });
  
  // 自己紹介の更新
  const bioElements = document.querySelectorAll('#guide-bio, .guide-bio, [data-field="bio"]');
  bioElements.forEach(elem => {
    if (elem) elem.textContent = guideData.bio || '自己紹介が未設定です。';
  });
  
  console.log('基本情報の更新が完了しました');
}

/**
 * ガイドの詳細情報を更新
 */
function updateGuideDetailedInfo(guideData) {
  // 自己紹介文の更新
  const bioElements = document.querySelectorAll('[data-field="bio"]');
  bioElements.forEach(elem => {
    elem.textContent = guideData.bio || '自己紹介が未設定です。';
  });
  
  // 経験年数の表示
  const experienceElem = document.querySelector('[data-field="experience"]');
  if (experienceElem && guideData.experience) {
    experienceElem.textContent = `${guideData.experience}年の経験`;
  }
}

/**
 * ガイドの料金情報を更新
 */
function updateGuidePricing(guideData) {
  console.log('料金情報を更新中:', guideData.name);
  
  // 基本料金の表示
  const price = guideData.price || guideData.baseFee || guideData.fee || '価格未設定';
  const priceElements = document.querySelectorAll('[data-field="price"], .guide-price, #guide-price, .price-display');
  
  priceElements.forEach(elem => {
    if (elem) {
      elem.textContent = typeof price === 'number' ? `¥${price.toLocaleString()}` : price;
    }
  });
  
  // 時間単価がある場合は表示
  if (guideData.hourlyFee) {
    const hourlyElements = document.querySelectorAll('[data-field="hourlyFee"], .guide-hourly-fee, #guide-hourly-fee');
    hourlyElements.forEach(elem => {
      if (elem) {
        elem.textContent = `¥${guideData.hourlyFee.toLocaleString()}/時間`;
      }
    });
  }
  
  console.log('料金情報の更新が完了しました');
}

/**
 * ガイドのスキルと特技を更新
 */
function updateGuideSkills(guideData) {
  console.log('スキルと特技を更新中:', guideData.name);
  
  // 専門分野の表示
  const specialtiesContainers = document.querySelectorAll('[data-field="specialties"], .guide-specialties, #guide-specialties');
  specialtiesContainers.forEach(container => {
    if (container && guideData.specialties && Array.isArray(guideData.specialties)) {
      const specialtiesHtml = guideData.specialties.map(specialty => 
        `<span class="badge bg-primary me-2 mb-2">${specialty}</span>`
      ).join('');
      container.innerHTML = specialtiesHtml;
    }
  });
  
  // キーワードの表示
  const keywordsContainers = document.querySelectorAll('[data-field="keywords"], .guide-keywords, #guide-keywords');
  keywordsContainers.forEach(container => {
    if (container && guideData.keywords && Array.isArray(guideData.keywords)) {
      const keywordsHtml = guideData.keywords.map(keyword => 
        `<span class="badge bg-secondary me-2 mb-2">${keyword}</span>`
      ).join('');
      container.innerHTML = keywordsHtml;
    }
  });
  
  console.log('スキルと特技の更新が完了しました');
}

/**
 * ガイドの言語情報を更新
 */
function updateGuideLanguages(guideData) {
  console.log('言語情報を更新中:', guideData.name);
  
  const languages = guideData.languages || ['日本語'];
  
  // 言語バッジコンテナの更新
  const languagesContainers = document.querySelectorAll('[data-field="languages"], .guide-languages, #guide-languages');
  languagesContainers.forEach(container => {
    if (container) {
      const languagesHtml = languages.map(lang => 
        `<span class="badge bg-info me-2 mb-2">${lang}</span>`
      ).join('');
      container.innerHTML = languagesHtml;
    }
  });
  
  // 個別の言語要素も更新
  const jpLangElements = document.querySelectorAll('#guide-language-jp, .guide-language-jp');
  jpLangElements.forEach(elem => {
    if (elem) elem.textContent = languages[0] || '日本語';
  });
  
  const enLangElements = document.querySelectorAll('#guide-language-en, .guide-language-en');
  enLangElements.forEach(elem => {
    if (elem && languages[1]) elem.textContent = languages[1];
  });
  
  console.log('言語情報の更新が完了しました');
}

/**
 * ガイドのプロフィール画像を更新
 */
function updateGuideProfileImage(guideData) {
  console.log('プロフィール画像を更新中:', guideData.name);
  
  const imageUrl = guideData.profileImage || guideData.imageUrl || 'https://placehold.co/400x300/e3f2fd/1976d2/png?text=Guide';
  
  // プロフィール画像要素の更新
  const profileImages = document.querySelectorAll('.guide-profile-img, [data-field="profileImage"], .guide-image, #guide-profile-image');
  profileImages.forEach(img => {
    if (img.tagName === 'IMG') {
      img.src = imageUrl;
      img.alt = `${guideData.name}のプロフィール画像`;
    } else {
      img.style.backgroundImage = `url(${imageUrl})`;
    }
  });
  
  console.log('プロフィール画像の更新が完了しました');
}

/**
 * エラーメッセージを表示
 */
function showErrorMessage(message) {
  const alertContainer = document.getElementById('alert-container') || document.querySelector('.container');
  if (alertContainer) {
    const alertHtml = `
      <div class="alert alert-warning alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
    alertContainer.insertAdjacentHTML('afterbegin', alertHtml);
  }
}

/**
 * 予約可能日の選択肢をセットアップ
 */
function setupAvailabilityDates() {
  // 日付クリックイベントのセットアップ
  document.querySelectorAll('.availability-date').forEach(dateElem => {
    dateElem.addEventListener('click', function() {
      // 以前に選択された日付があれば選択解除
      document.querySelectorAll('.availability-date').forEach(elem => {
        elem.classList.remove('selected');
      });
      
      // この日付を選択済みにする
      this.classList.add('selected');
      
      // 時間枠セクションを表示
      const timeSlotSection = document.getElementById('time-slot-section');
      timeSlotSection.classList.remove('d-none');
      
      // 時間枠クリックイベントのセットアップ
      setupTimeSlotSelection();
      
      // スクロール
      timeSlotSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });
}

/**
 * 時間枠選択のセットアップ
 */
function setupTimeSlotSelection() {
  document.querySelectorAll('.time-slot').forEach(timeSlot => {
    timeSlot.addEventListener('click', function() {
      // 以前に選択された時間枠があれば選択解除
      document.querySelectorAll('.time-slot').forEach(elem => {
        elem.classList.remove('selected');
      });
      
      // この時間枠を選択済みにする
      this.classList.add('selected');
      
      // 予約フォームを表示
      const bookingForm = document.getElementById('booking-form');
      bookingForm.classList.remove('d-none');
      
      // スクロール
      bookingForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });
}

/**
 * 日付選択のセットアップ
 */
function setupDateSelection() {
  // 予約日の選択処理
  document.querySelectorAll('.availability-date').forEach(date => {
    date.addEventListener('click', function() {
      document.querySelectorAll('.availability-date').forEach(d => {
        d.classList.remove('selected');
      });
      this.classList.add('selected');
      
      // 選択された日付に応じて時間枠を表示
      document.getElementById('time-slot-section').classList.remove('d-none');
    });
  });
}

/**
 * チャットフォームのセットアップ
 */
function setupChatForm() {
  const chatForm = document.getElementById('chat-form');
  if (chatForm) {
    chatForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const messageInput = this.querySelector('input[type="text"]');
      const messageText = messageInput.value.trim();
      
      if (messageText) {
        // 新しいメッセージを追加
        const chatBox = document.querySelector('.chat-box');
        const messageHtml = `
          <div class="clearfix mb-4">
            <div class="message-bubble sent">
              ${messageText}
            </div>
            <div class="message-time text-end">${getCurrentTime()}</div>
          </div>
        `;
        
        chatBox.insertAdjacentHTML('beforeend', messageHtml);
        
        // 入力欄をクリア
        messageInput.value = '';
        
        // 最下部にスクロール
        chatBox.scrollTop = chatBox.scrollHeight;
        
        // 自動返信（デモ用）
        setTimeout(() => {
          const replyHtml = `
            <div class="clearfix mb-4">
              <div class="message-bubble received">
                ありがとうございます！メッセージを確認しました。できるだけ早くご返信いたします。
              </div>
              <div class="message-time">${getCurrentTime()}</div>
            </div>
          `;
          
          chatBox.insertAdjacentHTML('beforeend', replyHtml);
          chatBox.scrollTop = chatBox.scrollHeight;
        }, 1000);
      }
    });
  }
}

/**
 * 予約フォームのセットアップ
 */
function setupBookingForm() {
  const bookingForm = document.querySelector('#booking-form form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const participants = document.getElementById('booking-participants').value;
      const request = document.getElementById('booking-request').value;
      
      // 予約データの取得（実際はAPIに送信）
      const bookingData = {
        guideId: new URLSearchParams(window.location.search).get('id') || '1',
        date: document.querySelector('.availability-date.selected strong')?.textContent || '選択された日付なし',
        time: document.querySelector('.time-slot.selected')?.textContent || '選択された時間なし',
        participants: participants,
        request: request,
        userId: JSON.parse(sessionStorage.getItem('currentUser') || '{}').id
      };
      
      console.log('予約データ:', bookingData);
      
      // 成功メッセージを表示
      alert('予約リクエストが送信されました。ガイドからの確認をお待ちください。');
      
      // 予約後はチャットタブに移動して詳細を相談できるようにする
      document.getElementById('chat-tab').click();
    });
  }
}

/**
 * 現在時刻を取得（HH:MM形式）
 */
function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * ページ内のアラート要素をチェックする
 */
function checkAlertElements() {
  // アラートコンテナがなければ作成
  if (!document.getElementById('alert-container')) {
    const alertContainer = document.createElement('div');
    alertContainer.id = 'alert-container';
    const container = document.querySelector('.container');
    if (container) {
      container.prepend(alertContainer);
    }
  }
}

/**
 * ギャラリー画像のモーダル表示
 */
document.addEventListener('DOMContentLoaded', function() {
  // ギャラリー画像コンテナクリックでモーダル表示
  document.querySelectorAll('.gallery-img-container').forEach(container => {
    container.addEventListener('click', function() {
      const img = this.querySelector('.gallery-img');
      const imgSrc = img.src;
      const imgAlt = img.alt;
      
      // ギャラリーカードのタイトルとキャプションを取得
      const titleElem = this.closest('.gallery-card').querySelector('.h6');
      const captionElem = this.closest('.gallery-card').querySelector('.small.text-muted');
      
      const title = titleElem ? titleElem.textContent : '';
      const caption = captionElem ? captionElem.textContent : '';
      
      // モーダルがなければ作成
      let galleryModal = document.getElementById('galleryModal');
      if (!galleryModal) {
        const modalHtml = `
          <div class="modal fade" id="galleryModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-xl modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">ギャラリー</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-center">
                  <img id="galleryModalImage" class="img-fluid rounded" alt="">
                  <div class="mt-3">
                    <h5 id="galleryModalTitle" class="mb-1"></h5>
                    <p id="galleryModalCaption" class="text-muted"></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        galleryModal = document.getElementById('galleryModal');
      }
      
      // モーダル内の画像とキャプションを更新
      const modalImg = document.getElementById('galleryModalImage');
      const modalTitle = document.getElementById('galleryModalTitle');
      const modalCaption = document.getElementById('galleryModalCaption');
      
      modalImg.src = imgSrc;
      modalImg.alt = imgAlt;
      
      if (modalTitle) modalTitle.textContent = title;
      if (modalCaption) modalCaption.textContent = caption;
      
      // モーダルを表示
      const bsModal = new bootstrap.Modal(galleryModal);
      bsModal.show();
    });
  });

  // ギャラリーの直接イメージにも同じ処理を追加（互換性のため）
  document.querySelectorAll('.gallery-img:not(.gallery-img-container .gallery-img)').forEach(img => {
    img.addEventListener('click', function() {
      const imgSrc = this.src;
      const imgAlt = this.alt;
      
      // モーダルがなければ作成
      let galleryModal = document.getElementById('galleryModal');
      if (!galleryModal) {
        const modalHtml = `
          <div class="modal fade" id="galleryModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-xl modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">ギャラリー</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-center">
                  <img id="galleryModalImage" class="img-fluid rounded" alt="">
                </div>
              </div>
            </div>
          </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        galleryModal = document.getElementById('galleryModal');
      }
      
      // モーダル内の画像を更新
      const modalImg = document.getElementById('galleryModalImage');
      modalImg.src = imgSrc;
      modalImg.alt = imgAlt;
      
      // モーダルを表示
      const bsModal = new bootstrap.Modal(galleryModal);
      bsModal.show();
    });
  });
});