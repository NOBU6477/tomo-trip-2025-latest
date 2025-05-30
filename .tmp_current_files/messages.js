/**
 * メッセージページのスクリプト
 * メッセージの表示と送信、使い方ガイドの制御などの機能を提供
 */
document.addEventListener('DOMContentLoaded', function() {
  // 使い方ガイドの制御
  initUsageGuide();
  
  // URLパラメータの処理 - 先に実行して新規メッセージ相手を追加
  processUrlParameters();
  
  // メッセージ関連の機能初期化
  initMessageFeatures();
  
  // ファイル添付機能
  initFileAttachment();
});

/**
 * URLパラメータを処理する
 * guide_id と guide_name パラメータがあれば、新しい連絡先として追加
 */
function processUrlParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  const guideId = urlParams.get('guide_id');
  const guideName = urlParams.get('guide_name');
  
  if (guideId && guideName) {
    console.log(`URLパラメータから新規連絡先を追加: ${guideName} (ID: ${guideId})`);
    
    // 既存の連絡先リスト
    const contactsList = document.querySelector('.contacts-list');
    if (!contactsList) return;
    
    // この連絡先が既に存在するかチェック
    const existingContact = document.querySelector(`.message-item[data-contact-id="${guideId}"]`);
    if (existingContact) {
      // 既存の連絡先が見つかった場合はそれを選択
      document.querySelectorAll('.message-item').forEach(item => {
        item.classList.remove('active');
      });
      existingContact.classList.add('active');
      
      // 会話を読み込む
      loadContactConversation(guideId);
      return;
    }
    
    // 新しい連絡先を追加
    const newContact = document.createElement('div');
    newContact.className = 'message-item d-flex align-items-center p-3 border-bottom active';
    newContact.setAttribute('data-contact-id', guideId);
    
    // プロフィール画像の最初の文字を抽出
    const initial = guideName.charAt(0);
    
    newContact.innerHTML = `
      <div class="avatar me-3 text-center bg-primary text-white rounded-circle" style="width: 40px; height: 40px; line-height: 40px;">${initial}</div>
      <div class="flex-grow-1">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <span class="fw-bold">${guideName}</span>
          <small class="text-muted">新規</small>
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <small class="text-muted">メッセージを送信してください</small>
        </div>
      </div>
    `;
    
    // 全ての連絡先を非アクティブにする
    document.querySelectorAll('.message-item').forEach(item => {
      item.classList.remove('active');
    });
    
    // リストの先頭に追加
    if (contactsList.firstChild) {
      contactsList.insertBefore(newContact, contactsList.firstChild);
    } else {
      contactsList.appendChild(newContact);
    }
    
    // クリックイベントを設定
    newContact.addEventListener('click', function() {
      document.querySelectorAll('.message-item').forEach(item => {
        item.classList.remove('active');
      });
      this.classList.add('active');
      loadContactConversation(guideId);
    });
    
    // 空の会話を表示
    showEmptyConversation(guideName);
    
    // 連絡先リストが空だった場合のメッセージを非表示に
    const emptyMessage = document.querySelector('.no-messages');
    if (emptyMessage) {
      emptyMessage.style.display = 'none';
    }
  }
}

/**
 * 新しい会話の場合、空の会話画面を表示
 */
function showEmptyConversation(name) {
  const messageContent = document.querySelector('.message-content');
  if (!messageContent) return;
  
  // ヘッダーと会話エリアを初期化
  messageContent.innerHTML = `
    <div class="message-header d-flex align-items-center p-3 border-bottom">
      <div class="d-flex align-items-center flex-grow-1">
        <div class="avatar bg-primary text-white rounded-circle me-3 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
          ${name.charAt(0)}
        </div>
        <div>
          <h6 class="mb-0">${name}</h6>
          <small class="text-muted">メッセージを送信して会話を開始</small>
        </div>
      </div>
    </div>
    <div class="message-body p-4"></div>
    <div class="message-input-area border-top p-3">
      <form id="message-form" class="d-flex align-items-center">
        <button type="button" class="btn btn-light rounded-circle me-2" id="attachment-btn">
          <i class="bi bi-paperclip"></i>
        </button>
        <input type="file" id="file-attachment" class="d-none" multiple>
        <input type="text" class="form-control me-2" id="message-input" placeholder="メッセージを入力...">
        <button type="submit" class="btn btn-primary rounded-circle">
          <i class="bi bi-send-fill"></i>
        </button>
      </form>
    </div>
  `;
  
  // メッセージ送信フォームにイベントリスナーを再設定
  const messageForm = document.getElementById('message-form');
  const messageInput = document.getElementById('message-input');
  
  if (messageForm && messageInput) {
    messageForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const message = messageInput.value.trim();
      if (message) {
        sendMessage(message);
        messageInput.value = '';
      }
    });
  }
  
  // ファイル添付ボタンの再設定
  initFileAttachment();
}

/**
 * 使い方ガイドの表示制御
 */
function initUsageGuide() {
  const usageGuide = document.getElementById('message-usage-guide');
  const closeButton = document.getElementById('close-usage-guide');
  
  // 表示状態の読み込み
  const guideHidden = localStorage.getItem('message_guide_hidden') === 'true';
  
  if (guideHidden) {
    usageGuide.style.display = 'none';
  }
  
  // 閉じるボタンの処理
  if (closeButton) {
    closeButton.addEventListener('click', function() {
      // アニメーションで非表示
      usageGuide.style.opacity = '0';
      usageGuide.style.transform = 'translateY(-20px)';
      
      // アニメーション完了後に非表示
      setTimeout(() => {
        usageGuide.style.display = 'none';
        
        // 非表示状態を保存
        localStorage.setItem('message_guide_hidden', 'true');
      }, 300);
    });
  }
}

/**
 * メッセージ機能の初期化
 */
function initMessageFeatures() {
  // メッセージフォームの送信処理
  const messageForm = document.getElementById('message-form');
  const messageInput = document.getElementById('message-input');
  
  if (messageForm && messageInput) {
    messageForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const message = messageInput.value.trim();
      if (message) {
        sendMessage(message);
        messageInput.value = '';
      }
    });
  }
  
  // 連絡先クリック処理
  const contactItems = document.querySelectorAll('.message-item');
  
  contactItems.forEach(item => {
    item.addEventListener('click', function() {
      // 以前の選択を解除
      document.querySelectorAll('.message-item.active').forEach(el => {
        el.classList.remove('active');
      });
      
      // 新しい選択をアクティブに
      this.classList.add('active');
      
      // 連絡先IDの取得
      const contactId = this.dataset.contactId;
      
      // 会話を読み込む
      console.log(`会話ID ${contactId} を読み込みます`);
      loadContactConversation(contactId);
    });
  });
  
  // 検索機能
  const searchInput = document.getElementById('message-search-input');
  
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      
      contactItems.forEach(item => {
        const name = item.querySelector('.fw-bold').textContent.toLowerCase();
        const lastMessage = item.querySelector('small.text-muted').textContent.toLowerCase();
        
        if (name.includes(searchTerm) || lastMessage.includes(searchTerm)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
}

/**
 * メッセージを送信
 */
function sendMessage(message) {
  // メッセージ送信のデモ実装
  // 実際のアプリではAPIリクエストを行う
  
  // メッセージコンテナ
  const messageBody = document.querySelector('.message-body');
  
  if (messageBody) {
    // 現在時刻
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;
    
    // メッセージ要素を作成
    const messageElement = document.createElement('div');
    messageElement.className = 'message-sent message-bubble align-self-end';
    messageElement.innerHTML = `
      <div>${message}</div>
      <div class="message-time">${timeStr}</div>
    `;
    
    // メッセージを追加
    messageBody.appendChild(messageElement);
    
    // 最下部にスクロール
    messageBody.scrollTop = messageBody.scrollHeight;
    
    // 自動返信デモ（3秒後）
    if (Math.random() > 0.5) {
      setTimeout(() => {
        simulateReply();
      }, 3000);
    }
  }
}

/**
 * 自動返信のシミュレーション（デモ用）
 */
function simulateReply() {
  const messageBody = document.querySelector('.message-body');
  const replies = [
    'ありがとうございます。確認しました。',
    'はい、了解しました。',
    '詳細な情報をありがとうございます。',
    'お返事ありがとうございます。当日お会いできるのを楽しみにしています。'
  ];
  
  // ランダムな返信を選択
  const randomReply = replies[Math.floor(Math.random() * replies.length)];
  
  // 現在時刻
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;
  
  // 返信メッセージ要素を作成
  const replyElement = document.createElement('div');
  replyElement.className = 'message-received message-bubble';
  replyElement.innerHTML = `
    <div>${randomReply}</div>
    <div class="message-time">${timeStr}</div>
  `;
  
  // メッセージを追加
  messageBody.appendChild(replyElement);
  
  // 最下部にスクロール
  messageBody.scrollTop = messageBody.scrollHeight;
  
  // 未読バッジを更新
  updateUnreadBadge();
}

/**
 * 未読バッジの更新（デモ用）
 */
function updateUnreadBadge() {
  const activeContact = document.querySelector('.message-item.active');
  if (activeContact) {
    const badge = activeContact.querySelector('.badge');
    if (badge) {
      const count = parseInt(badge.textContent) || 0;
      badge.textContent = count + 1;
      badge.style.display = 'inline-block';
    } else {
      const newBadge = document.createElement('span');
      newBadge.className = 'badge bg-primary rounded-pill';
      newBadge.textContent = '1';
      
      const metaDiv = activeContact.querySelector('div:last-child');
      if (metaDiv) {
        metaDiv.appendChild(newBadge);
      }
    }
  }
}

/**
 * ファイル添付機能の初期化
 */
function initFileAttachment() {
  const attachmentBtn = document.getElementById('attachment-btn');
  const fileInput = document.getElementById('file-attachment');
  
  if (attachmentBtn && fileInput) {
    // 添付ボタンクリックでファイル選択ダイアログを開く
    attachmentBtn.addEventListener('click', function() {
      fileInput.click();
    });
    
    // ファイル選択時の処理
    fileInput.addEventListener('change', function() {
      if (this.files.length > 0) {
        handleSelectedFiles(this.files);
      }
    });
  }
}

/**
 * 選択されたファイルの処理
 */
function handleSelectedFiles(files) {
  // ファイル処理のデモ実装
  // 実際のアプリではファイルアップロードとメッセージ送信処理を行う
  
  const fileNames = Array.from(files).map(file => file.name).join(', ');
  const message = `ファイルを添付しました: ${fileNames}`;
  
  // メッセージとして送信
  sendMessage(message);
  
  // ファイル入力をリセット
  document.getElementById('file-attachment').value = '';
}

/**
 * 会話データ（デモ用）
 */
const conversationData = {
  '1': {
    contact: {
      name: '佐藤太郎',
      avatar: 'https://placehold.co/40?text=佐藤',
      bookingInfo: '予約: 2025年6月10日 東京観光',
      status: 'online'
    },
    messages: [
      {
        type: 'received',
        text: 'こんにちは、6月10日に東京観光の予約をした佐藤と申します。当日の集合場所について質問があります。東京駅のどの出口で待ち合わせればよいでしょうか？',
        time: '10:15'
      },
      {
        type: 'sent',
        text: '佐藤様、ご予約ありがとうございます。集合場所は東京駅丸の内中央口の前でお待ちしております。何か目印になるものを持っていきますので、ご安心ください。',
        time: '10:30'
      },
      {
        type: 'received',
        text: 'ありがとうございます。了解しました。当日よろしくお願いします。他に準備しておくべきことはありますか？',
        time: '10:45'
      }
    ]
  },
  '2': {
    contact: {
      name: '鈴木花子',
      avatar: 'https://placehold.co/40?text=鈴木',
      bookingInfo: '予約: 2025年5月25日 鎌倉観光',
      status: 'offline'
    },
    messages: [
      {
        type: 'received',
        text: '先日はお世話になりました。素晴らしい体験でした。また機会があればぜひお願いしたいです。',
        time: '13:20'
      },
      {
        type: 'sent',
        text: '鈴木様、こちらこそありがとうございました。楽しんでいただけて何よりです。また鎌倉にいらっしゃる際はぜひご連絡ください。',
        time: '14:05'
      },
      {
        type: 'received',
        text: 'はい、またの機会がありましたらよろしくお願いします。おすすめいただいたお店もとても良かったです。',
        time: '14:30'
      }
    ]
  },
  '3': {
    contact: {
      name: '田中誠',
      avatar: 'https://placehold.co/40?text=田中',
      bookingInfo: '予約: 2025年4月15日 浅草観光',
      status: 'offline'
    },
    messages: [
      {
        type: 'sent',
        text: '田中様、先日は浅草観光にご参加いただきありがとうございました。お写真をお送りします。',
        time: '09:10'
      },
      {
        type: 'sent',
        text: '（写真が添付されています）',
        time: '09:11'
      },
      {
        type: 'received',
        text: '写真送っていただきありがとうございます。素敵な思い出になりました。また東京に行く際はよろしくお願いします。',
        time: '10:25'
      }
    ]
  }
};

/**
 * 連絡先に応じた会話を読み込む
 */
function loadContactConversation(contactId) {
  const data = conversationData[contactId];
  if (!data) return;
  
  // ヘッダー情報を更新
  updateContactHeader(data.contact);
  
  // メッセージ内容を更新
  updateMessageContent(data.messages);
  
  // バッジ（通知）を削除
  clearBadge(contactId);
}

/**
 * 連絡先ヘッダー情報を更新
 */
function updateContactHeader(contact) {
  const header = document.querySelector('.message-header');
  if (!header) return;
  
  // 名前、アバター、予約情報を更新
  const avatar = header.querySelector('.contact-avatar');
  const name = header.querySelector('.fw-bold');
  const bookingInfo = header.querySelector('#booking-info');
  const status = header.querySelector('.contact-status');
  
  if (avatar) avatar.src = contact.avatar;
  if (name) name.textContent = contact.name;
  if (bookingInfo) bookingInfo.textContent = contact.bookingInfo;
  
  // オンライン状態を更新
  if (status) {
    status.className = 'contact-status ms-auto';
    status.classList.add(contact.status);
  }
}

/**
 * メッセージ内容を更新
 */
function updateMessageContent(messages) {
  const messageBody = document.querySelector('.message-body');
  if (!messageBody) return;
  
  // 既存のメッセージをクリア
  messageBody.innerHTML = '';
  
  // 新しいメッセージを追加（観光客視点）
  messages.forEach(msg => {
    const messageElement = document.createElement('div');
    
    // 観光客視点の表示に変更: 'received'はガイドから受信したメッセージなので観光客側からみると相手から届いたメッセージ
    // 'sent'はガイドへ送信したメッセージなので観光客側からみると自分が送ったメッセージ
    if (msg.type === 'received') {
      // ガイドからのメッセージ → 相手（左側）に表示
      messageElement.className = 'message-received message-bubble';
    } else {
      // 観光客からのメッセージ → 自分（右側）に表示
      messageElement.className = 'message-sent message-bubble align-self-end';
    }
    
    messageElement.innerHTML = `
      <div>${msg.text}</div>
      <div class="message-time">${msg.time}</div>
    `;
    
    messageBody.appendChild(messageElement);
  });
  
  // 最下部にスクロール
  messageBody.scrollTop = messageBody.scrollHeight;
}

/**
 * 通知バッジをクリア
 */
function clearBadge(contactId) {
  const contact = document.querySelector(`.message-item[data-contact-id="${contactId}"]`);
  if (!contact) return;
  
  const badge = contact.querySelector('.badge');
  if (badge) {
    badge.style.display = 'none';
  }
}