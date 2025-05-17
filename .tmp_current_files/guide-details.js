/**
 * ガイド詳細ページのスクリプト
 * ガイド情報の表示、予約、チャット機能の制御
 */
document.addEventListener('DOMContentLoaded', function() {
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
  // ガイドデータをローカルストレージから取得を試みる
  let guideData = null;
  
  // ローカルストレージからデータ取得を試みる
  if (window.guideDetailsManager && typeof window.guideDetailsManager.getGuideById === 'function') {
    guideData = window.guideDetailsManager.getGuideById(guideId);
    console.log(`ガイドID ${guideId} のデータを検索しています...`);
    // データが見つかった場合はログに出力
    if (guideData) {
      console.log('保存されたガイドデータを表示します:', guideData);
    }
  }
  
  // データが見つからない場合はデフォルトのガイドデータを使用
  if (!guideData) {
    guideData = {
      id: guideId,
      name: '加藤 九郎',
      location: '沖縄県 与那国島',
      languages: ['日本語', '英語', '中国語'],
      rating: 4.5,
      reviewCount: 12,
      bio: 'こんにちは！私は沖縄県与那国島在住の加藤九郎です。10年間で100人以上の外国人の方々に与那国島の魅力をご案内してきました。特に西崎や祖納（そない）地区などのエリアに詳しく、観光スポットだけでなく、地元の人しか知らない隠れた名所や美味しいお店もご紹介できます。\n\n日本語、英語、中国語でのガイドが可能で、写真撮影も得意なので、旅の思い出作りもお手伝いします。お客様のリクエストに柔軟に対応し、あなただけの特別な与那国島観光をご提案します。',
      specialties: ['海洋アクティビティ', '歴史・文化', '与那国島グルメツアー', '沖縄料理', '伝統的集落巡り'],
      services: [
        { title: 'カスタマイズツアー', description: 'あなたの希望に沿った完全オーダーメイドツアー' },
        { title: '通訳サポート', description: '買い物やレストランでの会話をサポート' },
        { title: '写真撮影', description: '旅の思い出を素敵な写真に残すお手伝い' },
        { title: '交通手段のサポート', description: '与那国島内の移動や観光施設へのアクセスをサポート' }
      ],
      price: 18000,
      availability: {
        monday: { available: true, hours: '9:00 - 17:00' },
        tuesday: { available: true, hours: '9:00 - 17:00' },
        wednesday: { available: false, hours: '休み' },
        thursday: { available: true, hours: '12:00 - 20:00' },
        friday: { available: true, hours: '12:00 - 20:00' },
        saturday: { available: true, hours: '10:00 - 18:00' },
        sunday: { available: true, hours: '10:00 - 18:00' }
      },
      gallery: [
        'https://via.placeholder.com/600x400?text=与那国島の景色1',
        'https://via.placeholder.com/600x400?text=与那国島の景色2',
        'https://via.placeholder.com/600x400?text=与那国島の景色3',
        'https://via.placeholder.com/600x400?text=与那国島の景色4',
        'https://via.placeholder.com/600x400?text=与那国島の景色5',
        'https://via.placeholder.com/600x400?text=与那国島の景色6'
      ],
      reviews: [
        {
          user: 'ジョン・スミス',
          rating: 5,
          date: '2025年3月15日',
          comment: '加藤さんは素晴らしいガイドでした！与那国島の隠れた名所を案内してくれて、特に海中遺跡ツアーが素晴らしく、本当に特別な体験ができました。地元の美味しい海鮮料理店も紹介してくれて、次回も絶対にお願いしたいと思います。'
        },
        {
          user: 'エミリー・ジョンソン',
          rating: 4,
          date: '2025年2月28日',
          comment: '初めての与那国島旅行でしたが、加藤さんのおかげで不安なく島の歴史的な魅力を楽しむことができました。英語も流暢で、与那国島の文化について詳しく説明してくれました。写真もたくさん撮ってくれて、素敵な思い出になりました。'
        },
        {
          user: 'マイケル・チェン',
          rating: 4.5,
          date: '2025年1月15日',
          comment: '与那国島の秘密のスポットを案内してもらい、通常の観光では得られない深い知識を教えてもらいました。特に島の伝統的なお祭りに参加できたのは素晴らしい経験でした。加藤さんの知識と親しみやすさのおかげで素晴らしい時間を過ごせました。'
        }
      ]
    };
  }
  
  // 基本情報の表示
  document.getElementById('guide-name').textContent = guideData.name;
  document.getElementById('guide-location').textContent = guideData.location;
  document.getElementById('guide-bio').textContent = guideData.bio;
  
  // 言語バッジの表示
  document.getElementById('guide-language-jp').textContent = guideData.languages[0];
  document.getElementById('guide-language-en').textContent = guideData.languages[1];
  
  // 予約可能日の選択肢をセットアップ
  setupAvailabilityDates();
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