/**
 * スケジュール管理のカード型UIのための機能
 * 既存の機能を損なわず、UIのみを改善
 */

document.addEventListener('DOMContentLoaded', function() {
  // ガイドプロフィールページかどうかを確認
  if (!isGuideProfilePage()) {
    console.log('ガイドプロフィールページではないため、スケジュールカードUIは初期化しません');
    return;
  }
  
  // スケジュールタブのクリックイベントを監視
  const scheduleTab = document.querySelector('a[href="#profile-schedule"]');
  if (scheduleTab) {
    scheduleTab.addEventListener('click', function() {
      // タブが表示されたらカード型UIを構築
      setTimeout(initScheduleCards, 100);
    });
  }
  
  // ページ読み込み時に既にスケジュールタブが表示されていれば初期化
  setTimeout(function() {
    if (document.querySelector('#profile-schedule.active')) {
      initScheduleCards();
    }
  }, 300);
});

/**
 * 現在のページがガイドプロフィールページかどうかを判定
 */
function isGuideProfilePage() {
  // URLがガイドプロフィールページのパターンに一致するか確認
  const currentUrl = window.location.href;
  
  // guide-profile.htmlを含むURLか、または特定のURLパターンかを確認
  if (currentUrl.includes('guide-profile.html') || 
      currentUrl.includes('/guide/profile') || 
      document.querySelector('body.guide-profile-page')) {
    return true;
  }
  
  // プロフィールタブコンテナが存在するか確認
  const profileTabsContainer = document.querySelector('.profile-tabs');
  const scheduleTab = document.querySelector('a[href="#profile-schedule"]');
  
  return profileTabsContainer && scheduleTab;
}

/**
 * スケジュール管理のカード型UIを初期化
 */
function initScheduleCards() {
  // スケジュールタブのコンテンツ要素を取得
  const scheduleTabContent = document.getElementById('profile-schedule');
  if (!scheduleTabContent) return;
  
  // スケジュール管理説明と特別な日付設定の要素を取得
  const specialDateSection = scheduleTabContent.querySelector('.special-dates-section');
  const specialDateHeading = findFirstElementByText('h4', '特別な日付設定');
  if (!specialDateSection && !specialDateHeading) return;
  
  // 既存のカードUIが存在するか確認
  if (scheduleTabContent.querySelector('.schedule-options')) {
    console.log('スケジュールカードUIは既に表示されています');
    return;
  }
  
  // 親要素のクラスを確認して、コンテナを取得
  let scheduleContainer = null;
  if (specialDateSection) {
    scheduleContainer = specialDateSection.closest('.tab-pane');
  } else if (specialDateHeading) {
    scheduleContainer = specialDateHeading.closest('.tab-pane');
  }
  scheduleContainer = scheduleContainer || scheduleTabContent;
  
  // 既存コンテンツを一時的に非表示
  const existingContents = Array.from(scheduleContainer.children);
  existingContents.forEach(el => {
    if (!el.classList.contains('card-container')) {
      el.style.display = 'none';
    }
  });
  
  // カード型UIのコンテナを作成
  const cardContainer = document.createElement('div');
  cardContainer.className = 'card-container fade-in';
  
  // スケジュール管理の説明カード
  const infoCard = document.createElement('div');
  infoCard.className = 'schedule-info-card';
  infoCard.innerHTML = `
    <div class="d-flex align-items-center">
      <i class="bi bi-info-circle-fill fs-5 me-2"></i>
      <div>
        <h5 class="mb-0">スケジュール管理について</h5>
        <p class="mb-0">ガイドとしての活動スケジュールを設定します。曜日ごとの基本スケジュールや特別な日付設定、予約カレンダーの確認ができます。</p>
      </div>
    </div>
  `;
  
  // 機能カードのコンテナ
  const scheduleOptions = document.createElement('div');
  scheduleOptions.className = 'schedule-options';
  
  // 曜日別スケジュール設定カード
  const weeklyCard = document.createElement('div');
  weeklyCard.className = 'schedule-card';
  weeklyCard.innerHTML = `
    <div class="schedule-card-icon primary">
      <i class="bi bi-calendar-week"></i>
    </div>
    <h5>曜日別スケジュール</h5>
    <p>各曜日ごとに活動可能かどうか、活動可能な場合は開始時間と終了時間を設定します。</p>
    <button id="btn-weekly-schedule" class="btn btn-primary">
      <i class="bi bi-pencil-square"></i> 曜日別スケジュールを設定
    </button>
  `;
  
  // 特別な日付設定カード
  const specialDatesCard = document.createElement('div');
  specialDatesCard.className = 'schedule-card';
  specialDatesCard.innerHTML = `
    <div class="schedule-card-icon danger">
      <i class="bi bi-calendar-x"></i>
    </div>
    <h5>特別な日付設定</h5>
    <p>祝日や特別イベント日など、通常の曜日設定とは異なる予約受付状況を設定します。</p>
    <button id="btn-special-dates" class="btn btn-danger">
      <i class="bi bi-calendar-plus"></i> 特別な日付を管理
    </button>
  `;
  
  // カレンダー表示カード
  const calendarCard = document.createElement('div');
  calendarCard.className = 'schedule-card';
  calendarCard.innerHTML = `
    <div class="schedule-card-icon success">
      <i class="bi bi-calendar-check"></i>
    </div>
    <h5>予約状況カレンダー</h5>
    <p>現在の予約状況をカレンダー形式で確認できます。予約可能日や予約済みの日を一目で確認できます。</p>
    <button id="btn-calendar-view" class="btn btn-success">
      <i class="bi bi-eye"></i> カレンダーを表示
    </button>
  `;
  
  // 要素を追加
  scheduleOptions.appendChild(weeklyCard);
  scheduleOptions.appendChild(specialDatesCard);
  scheduleOptions.appendChild(calendarCard);
  cardContainer.appendChild(infoCard);
  cardContainer.appendChild(scheduleOptions);
  
  // コンテナをスケジュールタブに追加
  scheduleContainer.insertBefore(cardContainer, scheduleContainer.firstChild);
  
  // ボタンにイベントリスナーを設定
  document.getElementById('btn-weekly-schedule').addEventListener('click', function() {
    // カード型UIを非表示にして元のUIを表示
    cardContainer.style.display = 'none';
    
    // 曜日別スケジュール設定に関連する要素を表示
    showWeeklyScheduleElements(scheduleTabContent);
  });
  
  document.getElementById('btn-special-dates').addEventListener('click', function() {
    // カード型UIを非表示にして元のUIを表示
    cardContainer.style.display = 'none';
    
    // 特別な日付設定に関連する要素を表示
    showSpecialDatesElements(scheduleTabContent);
    
    // 特別な日付リストを読み込む（既存関数があれば実行）
    if (typeof loadSpecialDates === 'function') {
      try {
        loadSpecialDates();
      } catch (e) {
        console.error('特別な日付リストの読み込みに失敗しました', e);
      }
    }
  });
  
  document.getElementById('btn-calendar-view').addEventListener('click', function() {
    // カード型UIを非表示にして元のUIを表示
    cardContainer.style.display = 'none';
    
    // カレンダー表示関連の要素を表示
    showCalendarElements(scheduleTabContent);
    
    // カレンダーの表示を更新（既存関数があれば実行）
    setTimeout(() => {
      if (typeof updateCalendar === 'function') {
        try {
          updateCalendar();
        } catch (e) {
          console.error('カレンダーの更新に失敗しました', e);
        }
      }
      
      // カレンダー要素のサイズを調整するためにwindowリサイズイベントを発生
      window.dispatchEvent(new Event('resize'));
    }, 100);
  });
  
  // 戻るボタン機能を追加
  addBackButtons(scheduleTabContent, cardContainer);
}

/**
 * 曜日別スケジュール設定に関連する要素を表示
 */
function showWeeklyScheduleElements(container) {
  // 曜日別スケジュールに関する見出しを探す
  const weeklyHeadings = findElementsByText('h4', '曜日別スケジュール');
  weeklyHeadings.forEach(el => {
    el.style.display = '';
  });
  
  // フォームや関連divを表示
  const scheduleElements = container.querySelectorAll('form[id*="schedule"], div[id*="weekly"]');
  scheduleElements.forEach(el => {
    el.style.display = '';
  });
  
  // 関連しない要素を非表示に
  hideUnrelatedElements(container, 'weekly');
}

/**
 * 特別な日付設定に関連する要素を表示
 */
function showSpecialDatesElements(container) {
  // 特別な日付設定に関する見出しを探す
  const specialHeadings = findElementsByText('h4', '特別な日付設定');
  specialHeadings.forEach(el => {
    el.style.display = '';
  });
  
  // 特別な日付関連の要素を表示
  const specialElements = container.querySelectorAll('div[id*="special"], form[id*="special"]');
  specialElements.forEach(el => {
    el.style.display = '';
  });
  
  // 特別な日付設定は固定の要素も含める
  const specialDateSection = container.querySelector('.special-dates-section');
  if (specialDateSection) {
    specialDateSection.style.display = '';
  }
  
  // 関連しない要素を非表示に
  hideUnrelatedElements(container, 'special');
}

/**
 * カレンダー表示関連の要素を表示
 */
function showCalendarElements(container) {
  // カレンダーに関する見出しを探す
  const calendarHeadings = findElementsByText('h4', '予約カレンダー');
  calendarHeadings.forEach(el => {
    el.style.display = '';
  });
  
  // カレンダー関連の要素を表示
  const calendarElements = container.querySelectorAll('div[id*="calendar"], .calendar-container');
  calendarElements.forEach(el => {
    el.style.display = '';
  });
  
  // 関連しない要素を非表示に
  hideUnrelatedElements(container, 'calendar');
}

/**
 * 指定したカテゴリに関連しない要素を非表示にする
 */
function hideUnrelatedElements(container, category) {
  // 曜日別スケジュール
  if (category !== 'weekly') {
    // 見出しを非表示
    const weeklyHeadings = findElementsByText('h4', '曜日別スケジュール');
    weeklyHeadings.forEach(el => {
      el.style.display = 'none';
    });
    
    // 関連する要素を非表示
    const weeklyElements = container.querySelectorAll('form[id*="schedule"]:not([id*="special"]), div[id*="weekly"]');
    weeklyElements.forEach(el => {
      el.style.display = 'none';
    });
  }
  
  // 特別な日付設定
  if (category !== 'special') {
    // 見出しを非表示
    const specialHeadings = findElementsByText('h4', '特別な日付設定');
    specialHeadings.forEach(el => {
      el.style.display = 'none';
    });
    
    // 関連する要素を非表示
    const specialElements = container.querySelectorAll('div[id*="special"], form[id*="special"]');
    specialElements.forEach(el => {
      el.style.display = 'none';
    });
  }
  
  // カレンダー表示
  if (category !== 'calendar') {
    // 見出しを非表示
    const calendarHeadings = findElementsByText('h4', '予約カレンダー');
    calendarHeadings.forEach(el => {
      el.style.display = 'none';
    });
    
    // 関連する要素を非表示
    const calendarElements = container.querySelectorAll('div[id*="calendar"]:not([id*="special"]), .calendar-container');
    calendarElements.forEach(el => {
      el.style.display = 'none';
    });
  }
  
  // 「スケジュールを保存」ボタンは常に表示
  const saveButtons = [];
  document.querySelectorAll('button').forEach(btn => {
    if (btn.textContent.includes('スケジュールを保存')) {
      saveButtons.push(btn);
    }
  });
  
  saveButtons.forEach(btn => {
    btn.style.display = '';
  });
}

/**
 * カード型UIに戻るためのボタンを追加
 */
function addBackButtons(container, cardContainer) {
  // 各セクションの見出しとテキスト
  const sections = [
    { text: '曜日別スケジュール' },
    { text: '特別な日付設定' },
    { text: '予約カレンダー' }
  ];
  
  sections.forEach(section => {
    // 対応する見出しを検索
    const headings = findElementsByText('h4', section.text);
    
    headings.forEach(headingElement => {
      if (headingElement && !headingElement.querySelector('.btn-back')) {
        const backButton = document.createElement('button');
        backButton.className = 'btn btn-sm btn-outline-secondary ms-2 btn-back';
        backButton.innerHTML = '<i class="bi bi-arrow-left"></i> 戻る';
        backButton.addEventListener('click', function(e) {
          e.preventDefault();
          
          // 関連する要素を非表示にする
          // セクションの種類に応じて異なる処理を適用
          if (section.text === '曜日別スケジュール') {
            hideAllScheduleItems(container);
          } else if (section.text === '特別な日付設定') {
            hideAllSpecialDateItems(container);
          } else if (section.text === '予約カレンダー') {
            hideAllCalendarItems(container);
          }
          
          // カード型UIを表示
          cardContainer.style.display = '';
        });
        
        // 見出しにボタンを追加
        if (headingElement.childElementCount === 0 || !headingElement.querySelector('.btn-back')) {
          headingElement.style.display = 'flex';
          headingElement.style.justifyContent = 'space-between';
          headingElement.style.alignItems = 'center';
          headingElement.appendChild(backButton);
        }
      }
    });
  });
}

/**
 * 曜日別スケジュール関連のすべての要素を非表示にする
 */
function hideAllScheduleItems(container) {
  // 曜日別スケジュールの見出しを非表示
  const scheduleHeadings = findElementsByText('h4', '曜日別スケジュール');
  scheduleHeadings.forEach(el => el.style.display = 'none');
  
  // スケジュール関連のすべての要素を非表示
  const scheduleItems = container.querySelectorAll('form[id*="schedule"]:not([id*="special"]), div[id*="weekly"]');
  scheduleItems.forEach(el => el.style.display = 'none');
}

/**
 * 特別な日付設定関連のすべての要素を非表示にする
 */
function hideAllSpecialDateItems(container) {
  // 特別な日付設定の見出しを非表示
  const specialHeadings = findElementsByText('h4', '特別な日付設定');
  specialHeadings.forEach(el => el.style.display = 'none');
  
  // 特別な日付設定関連のすべての要素を非表示
  const specialItems = container.querySelectorAll('.special-dates-section, div[id*="special"], form[id*="special"]');
  specialItems.forEach(el => el.style.display = 'none');
}

/**
 * カレンダー関連のすべての要素を非表示にする
 */
function hideAllCalendarItems(container) {
  // カレンダーの見出しを非表示
  const calendarHeadings = findElementsByText('h4', '予約カレンダー');
  calendarHeadings.forEach(el => el.style.display = 'none');
  
  // カレンダー関連のすべての要素を非表示
  const calendarItems = container.querySelectorAll('div[id*="calendar"], .calendar-container');
  calendarItems.forEach(el => el.style.display = 'none');
}

// テキスト内容を含む要素を検索するヘルパー関数
function findElementsByText(selector, text) {
  const elements = document.querySelectorAll(selector);
  const results = [];
  
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].textContent.includes(text)) {
      results.push(elements[i]);
    }
  }
  
  return results;
}

// テキストを含む最初の要素を取得
function findFirstElementByText(selector, text) {
  const elements = findElementsByText(selector, text);
  return elements.length > 0 ? elements[0] : null;
}

// 標準的なquerySelectorとquerySelectorAllを使うように修正
function findHeadingWithText(text) {
  const headings = document.querySelectorAll('h4');
  for (let i = 0; i < headings.length; i++) {
    if (headings[i].textContent.includes(text)) {
      return headings[i];
    }
  }
  return null;
}

/**
 * 特別な日付関連の関数はbooking-manager.jsから呼び出す
 * ここではbooking-manager.jsのloadSpecialDates関数を呼び出す
 */
// loadSpecialDates関数は削除し、booking-manager.jsの関数を使用