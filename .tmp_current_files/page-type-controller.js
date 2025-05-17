/**
 * ページタイプコントローラー
 * 現在のページを識別し、特別な日付設定セクションなどの要素の表示を制御します
 */

document.addEventListener('DOMContentLoaded', function() {
  // ページタイプを検出して設定
  detectAndSetPageType();

  // タブ切り替え時のイベント処理を設定
  setupTabChangeHandlers();
});

/**
 * 現在のページを検出し、bodyタグにデータ属性を設定
 */
function detectAndSetPageType() {
  const pathname = window.location.pathname;
  const body = document.body;
  let pageType = 'unknown';
  
  // パスに基づいてページタイプを特定
  if (pathname.endsWith('/') || pathname.endsWith('/index.html')) {
    pageType = 'index';
  } else if (pathname.includes('guide-profile.html')) {
    pageType = 'guide-profile';
    body.classList.add('guide-profile-page');
    
    // アクティブなタブを検出
    const activeTabId = detectActiveProfileTab();
    body.setAttribute('data-current-page', `guide-profile-${activeTabId}`);
  } else if (pathname.includes('guide-details.html')) {
    pageType = 'guide-details';
  } else if (pathname.includes('tourist-profile.html')) {
    pageType = 'tourist-profile';
  } else if (pathname.includes('booking-payment.html')) {
    pageType = 'booking-payment';
  } else if (pathname.includes('booking-confirmation.html')) {
    pageType = 'booking-confirmation';
  } else if (pathname.includes('messages.html')) {
    pageType = 'messages';
  }
  
  // bodyタグにページタイプを設定
  body.setAttribute('data-page-type', pageType);
  
  console.log(`ページタイプを検出しました: ${pageType}`);
  
  // 特定のページでは特別な日付セクションを明示的に非表示
  if (pageType !== 'guide-profile') {
    hideSpecialDatesSection();
  } else {
    // ガイドプロフィールページでのみ、タブに基づいて表示を制御
    controlSpecialDatesBySections();
  }
}

/**
 * アクティブなプロフィールタブを検出
 */
function detectActiveProfileTab() {
  const activeTab = document.querySelector('#profile-tabs .nav-link.active');
  if (activeTab) {
    const tabId = activeTab.getAttribute('href').substring(1);
    return tabId.replace('profile-', '');
  }
  return 'basic'; // デフォルトはプロフィール基本情報
}

/**
 * タブ切り替え時のイベントハンドラをセットアップ
 */
function setupTabChangeHandlers() {
  const profileTabs = document.querySelectorAll('#profile-tabs .nav-link');
  
  profileTabs.forEach(tab => {
    tab.addEventListener('shown.bs.tab', function(event) {
      const tabId = event.target.getAttribute('href').substring(1);
      const tabType = tabId.replace('profile-', '');
      
      // bodyタグのデータ属性を更新
      document.body.setAttribute('data-current-page', `guide-profile-${tabType}`);
      
      // タブに基づいて特別な日付セクションを表示/非表示
      controlSpecialDatesBySections();
      
      console.log(`タブ切り替え: ${tabType}`);
    });
  });
}

/**
 * 特別な日付設定セクションをタブに基づいて表示/非表示
 */
function controlSpecialDatesBySections() {
  const specialDatesContainer = document.querySelector('.special-dates-container');
  if (!specialDatesContainer) return;
  
  const currentTab = detectActiveProfileTab();
  
  if (currentTab === 'schedule') {
    // scheduleタブの場合のみ表示
    specialDatesContainer.style.display = 'block';
    console.log('特別な日付設定セクションを表示しました');
  } else {
    // それ以外のタブでは非表示
    specialDatesContainer.style.display = 'none';
    console.log('特別な日付設定セクションを非表示にしました');
  }
}

/**
 * 特別な日付セクションを強制的に非表示
 */
function hideSpecialDatesSection() {
  const specialDatesContainers = document.querySelectorAll('.special-dates-container, .special-dates-section');
  
  specialDatesContainers.forEach(container => {
    container.style.display = 'none';
    console.log('特別な日付設定セクションを強制的に非表示にしました');
  });
}