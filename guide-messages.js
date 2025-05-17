/**
 * ガイドプロフィール管理ページ内のメッセージタブ用スクリプト
 * 左側のユーザー一覧をクリックすると右側に会話内容を表示
 */
document.addEventListener('DOMContentLoaded', function() {
  // 進行中の確認のためのログ
  console.log("ガイドメッセージスクリプトを初期化しています");
  
  // メッセージタブが表示されたときにメッセージ機能を初期化
  const messageTabLink = document.querySelector('a[href="#profile-messages"]');
  if (messageTabLink) {
    console.log('メッセージタブのリンクを発見しました');
    
    messageTabLink.addEventListener('shown.bs.tab', function (e) {
      console.log('メッセージタブが表示されました');
      initializeMessages();
    });
    
    // 初期ロード時にもチェック
    if (window.location.hash === '#profile-messages') {
      initializeMessages();
    }
  } else {
    console.log('メッセージタブのリンクが見つかりません');
  }
  
  // ガイド使用情報の閉じるボタンの処理
  const closeGuideBtn = document.getElementById('close-message-guide');
  if (closeGuideBtn) {
    closeGuideBtn.addEventListener('click', function() {
      const guide = document.getElementById('message-usage-guide');
      if (guide) guide.style.display = 'none';
    });
  }
});

/**
 * メッセージ機能の初期化
 */
function initializeMessages() {
  console.log('メッセージ機能を初期化中...');
  
  // メッセージ一覧の各アイテムにクリックイベントを追加
  setupMessageItems();
  
  // メッセージ返信フォームの処理
  setupMessageForm();
}

/**
 * メッセージアイテムのセットアップ
 */
function setupMessageItems() {
  // メッセージ一覧の行
  const messageRows = document.querySelectorAll('.message-user-row');
  
  if (messageRows.length === 0) {
    console.log('メッセージ一覧が見つかりません');
    return;
  }
  
  console.log(`${messageRows.length}件のメッセージを検出`);
  
  // 各メッセージ行にクリックイベントを設定
  messageRows.forEach(row => {
    row.addEventListener('click', function() {
      // すべての行から選択状態を解除
      messageRows.forEach(r => r.classList.remove('active', 'bg-light'));
      
      // クリックされた行をアクティブにする
      this.classList.add('active', 'bg-light');
      
      // ユーザー情報を取得
      const userName = this.querySelector('strong')?.textContent || '不明なユーザー';
      const messagePreview = this.querySelector('small')?.textContent || '';
      const timeInfo = this.querySelector('small.text-muted:last-child')?.textContent || '';
      
      // ユーザーの会話データを読み込む
      loadUserConversation(userName, messagePreview, timeInfo);
    });
  });
  
  // 最初のアイテムを選択状態にする
  if (messageRows.length > 0 && !document.querySelector('.message-user-row.active')) {
    messageRows[0].click();
  }
}

/**
 * 選択されたユーザーの会話内容を表示
 */
function loadUserConversation(userName, messagePreview, timeInfo) {
  // 会話コンテナを取得
  const conversationContainer = document.querySelector('.conversation-container');
  
  if (!conversationContainer) {
    console.error('会話コンテナが見つかりません');
    return;
  }
  
  // ユーザーに基づくメッセージデータ
  let messages = [];
  
  // 既存のメッセージデータを取得（表示されているもの）
  const existingMessages = document.querySelectorAll('.message-container .message-bubble');
  
  if (existingMessages.length > 0) {
    // 既存のメッセージを構造化データに変換
    messages = Array.from(existingMessages).map(msg => {
      const isReceived = msg.classList.contains('message-received');
      const text = msg.querySelector('div:first-child')?.textContent || '';
      const time = msg.querySelector('.message-time')?.textContent || '';
      
      return {
        type: isReceived ? 'received' : 'sent',
        text: text,
        time: time
      };
    });
  } else {
    // ダミーメッセージを生成（既存メッセージがない場合）
    if (userName === '佐藤太郎') {
      messages = [
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
      ];
    } else if (userName === '鈴木花子') {
      messages = [
        {
          type: 'received',
          text: '先日はお世話になりました。素晴らしい体験でした。また機会があればぜひお願いしたいです。',
          time: '13:20'
        },
        {
          type: 'sent',
          text: '鈴木様、こちらこそありがとうございました。楽しんでいただけて何よりです。また機会がございましたらぜひご連絡ください。',
          time: '14:05'
        },
        {
          type: 'received',
          text: 'はい、またの機会がありましたらよろしくお願いします。おすすめいただいたお店もとても良かったです。',
          time: '14:30'
        }
      ];
    } else if (userName === '田中誠') {
      messages = [
        {
          type: 'sent',
          text: '田中様、先日はご参加いただきありがとうございました。お写真をお送りします。',
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
      ];
    } else {
      // その他のユーザー用のダミーメッセージ
      messages = [
        {
          type: 'received',
          text: `${userName}です。お世話になっております。`,
          time: '12:00'
        },
        {
          type: 'sent',
          text: `${userName}様、メッセージありがとうございます。`,
          time: '12:30'
        }
      ];
    }
  }
  
  // 会話コンテンツを更新
  updateConversationContent(conversationContainer, userName, messagePreview, timeInfo, messages);
}

/**
 * 会話コンテンツを更新
 */
function updateConversationContent(container, userName, messagePreview, timeInfo, messages) {
  // ヘッダー部分を更新
  const header = container.querySelector('.conversation-header') || createConversationHeader(container);
  header.innerHTML = `
    <div class="d-flex align-items-center">
      <div class="me-auto">
        <div class="fw-bold">${userName}</div>
        <small class="text-muted">${timeInfo}</small>
      </div>
    </div>
  `;
  
  // メッセージ部分を更新
  const messageContainer = container.querySelector('.message-container') || createMessageContainer(container);
  messageContainer.innerHTML = '';
  
  // メッセージを表示
  messages.forEach(msg => {
    const messageElement = document.createElement('div');
    messageElement.className = `message-bubble message-${msg.type}`;
    
    messageElement.innerHTML = `
      <div>${msg.text}</div>
      <div class="message-time">${msg.time}</div>
    `;
    
    messageContainer.appendChild(messageElement);
  });
  
  // 最下部にスクロール
  messageContainer.scrollTop = messageContainer.scrollHeight;
}

/**
 * 会話ヘッダーがない場合は作成
 */
function createConversationHeader(container) {
  const header = document.createElement('div');
  header.className = 'conversation-header mb-3';
  container.appendChild(header);
  return header;
}

/**
 * メッセージコンテナがない場合は作成
 */
function createMessageContainer(container) {
  const messageContainer = document.createElement('div');
  messageContainer.className = 'message-container d-flex flex-column';
  messageContainer.style.maxHeight = '300px';
  messageContainer.style.overflowY = 'auto';
  messageContainer.style.marginBottom = '15px';
  container.appendChild(messageContainer);
  return messageContainer;
}

/**
 * メッセージ返信フォームのセットアップ
 */
function setupMessageForm() {
  const replyForm = document.getElementById('message-reply-form');
  const replyInput = document.getElementById('message-reply');
  
  if (replyForm && replyInput) {
    replyForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const message = replyInput.value.trim();
      if (message) {
        sendReplyMessage(message);
        replyInput.value = '';
      }
    });
  }
}

/**
 * 返信メッセージを送信
 */
function sendReplyMessage(message) {
  const messageContainer = document.querySelector('.message-container');
  if (!messageContainer) return;
  
  // 現在時刻
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;
  
  // 送信メッセージ要素を作成
  const messageElement = document.createElement('div');
  messageElement.className = 'message-bubble message-sent';
  messageElement.innerHTML = `
    <div>${message}</div>
    <div class="message-time">${timeStr}</div>
  `;
  
  // メッセージを追加
  messageContainer.appendChild(messageElement);
  
  // 最下部にスクロール
  messageContainer.scrollTop = messageContainer.scrollHeight;
  
  // ランダムな返信（デモ用）
  if (Math.random() > 0.5) {
    setTimeout(() => {
      simulateReply(messageContainer);
    }, 3000);
  }
}

/**
 * 自動返信をシミュレート（デモ用）
 */
function simulateReply(container) {
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
  replyElement.className = 'message-bubble message-received';
  replyElement.innerHTML = `
    <div>${randomReply}</div>
    <div class="message-time">${timeStr}</div>
  `;
  
  // メッセージを追加
  container.appendChild(replyElement);
  
  // 最下部にスクロール
  container.scrollTop = container.scrollHeight;
}

// スタイルの追加
function addMessageStyles() {
  if (document.getElementById('guide-message-styles')) return;
  
  const styleElement = document.createElement('style');
  styleElement.id = 'guide-message-styles';
  styleElement.textContent = `
    .message-user-row {
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .message-user-row:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
    .message-bubble {
      border-radius: 1rem;
      padding: 0.75rem 1rem;
      margin-bottom: 1rem;
      max-width: 80%;
      position: relative;
    }
    .message-sent {
      align-self: flex-end;
      background-color: #0077b6;
      color: white;
      border-bottom-right-radius: 0.25rem;
      margin-left: auto;
    }
    .message-received {
      align-self: flex-start;
      background-color: #f0f0f0;
      border-bottom-left-radius: 0.25rem;
    }
    .message-time {
      font-size: 0.7rem;
      color: rgba(255, 255, 255, 0.7);
      text-align: right;
      margin-top: 0.25rem;
    }
    .message-received .message-time {
      color: #6c757d;
    }
    .conversation-container {
      border-radius: 0.5rem;
      background-color: white;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    }
  `;
  
  document.head.appendChild(styleElement);
}

// スタイルを追加
addMessageStyles();