/**
 * スピナー問題の最終修正スクリプト
 * 特別な日付リストの表示を確実に制御
 */

document.addEventListener('DOMContentLoaded', function() {
  // スピナー要素とリスト要素を取得
  const spinner = document.getElementById('special-dates-spinner');
  const emptyMessage = document.getElementById('special-dates-empty');
  const specialDatesList = document.getElementById('special-dates-list');
  
  if (!spinner || !emptyMessage || !specialDatesList) {
    console.warn('特別な日付表示のための要素が見つかりません');
    return;
  }
  
  // スピナーの表示・非表示を制御する関数
  window.showSpecialDatesSpinner = function() {
    spinner.style.display = 'flex';
    emptyMessage.style.display = 'none';
  };
  
  // スピナーを非表示にして空リストメッセージを表示する関数
  window.showEmptySpecialDatesMessage = function() {
    spinner.style.display = 'none';
    emptyMessage.style.display = 'flex';
  };
  
  // スピナーと空リストメッセージの両方を非表示にする関数
  window.hideSpecialDatesMessages = function() {
    spinner.style.display = 'none';
    emptyMessage.style.display = 'none';
  };
  
  // 特別な日付リストの表示を初期状態で設定
  // 最初はスピナーを表示する
  showSpecialDatesSpinner();
  
  // 特別な日付アイテムを追加する関数をグローバルに公開
  window.addSpecialDateItem = function(dateData) {
    // 必要なデータを確認
    if (!dateData || !dateData.date) {
      console.error('不正な日付データです', dateData);
      return;
    }
    
    // スピナーと空メッセージを非表示
    hideSpecialDatesMessages();
    
    // 日付のフォーマット
    const dateObj = new Date(dateData.date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const formattedDate = `${year}年${month}月${day}日`;
    
    // 既存のアイテムを確認 (同じIDがあれば更新、なければ追加)
    const existingItem = dateData.id ? 
      document.querySelector(`.special-date-item[data-id="${dateData.id}"]`) : 
      null;
    
    if (existingItem) {
      // 既存アイテムを更新
      existingItem.querySelector('.special-date-item-date').textContent = formattedDate;
      
      const badge = existingItem.querySelector('.special-date-item-badge');
      if (badge) {
        badge.textContent = dateData.available ? '利用可能' : '利用不可';
        badge.className = `special-date-item-badge ${dateData.available ? 'badge-available' : 'badge-unavailable'}`;
      }
      
      const details = existingItem.querySelector('.special-date-item-details');
      if (details) {
        details.textContent = dateData.available ? 
          `${dateData.startTime} 〜 ${dateData.endTime}` : 
          '時間指定なし';
      }
      
      const reason = existingItem.querySelector('.special-date-item-reason');
      if (reason) {
        reason.textContent = dateData.reason || '理由の記載なし';
      }
    } else {
      // 新しいアイテムを作成
      const item = document.createElement('div');
      item.className = 'special-date-item';
      if (dateData.id) {
        item.setAttribute('data-id', dateData.id);
      }
      
      // 利用可能かどうかのバッジクラス
      const badgeClass = dateData.available ? 'badge-available' : 'badge-unavailable';
      const badgeText = dateData.available ? '利用可能' : '利用不可';
      
      // 時間帯の表示
      const timeInfo = dateData.available ? 
        `${dateData.startTime} 〜 ${dateData.endTime}` : 
        '時間指定なし';
      
      // 理由の表示
      const reasonText = dateData.reason || '理由の記載なし';
      
      // アイテム自体にも利用可能・不可のクラスを追加
      item.classList.add(badgeClass);
      
      // HTMLの構造を設定
      item.innerHTML = `
        <div class="special-date-item-header">
          <span class="special-date-item-date">${formattedDate}</span>
          <span class="special-date-item-badge ${badgeClass}">${badgeText}</span>
        </div>
        <div class="special-date-item-details">${timeInfo}</div>
        <p class="special-date-item-reason">${reasonText}</p>
        <button class="special-date-item-delete" data-id="${dateData.id || ''}">
          <i class="bi bi-trash"></i>
        </button>
      `;
      
      // 削除ボタンにイベントリスナーを追加
      const deleteButton = item.querySelector('.special-date-item-delete');
      if (deleteButton) {
        deleteButton.addEventListener('click', function() {
          const itemId = this.getAttribute('data-id');
          if (itemId && window.deleteSpecialDate) {
            window.deleteSpecialDate(itemId);
          } else {
            // 開発中の仮の実装
            item.remove();
            if (specialDatesList.querySelectorAll('.special-date-item').length === 0) {
              showEmptySpecialDatesMessage();
            }
          }
        });
      }
      
      // リストに追加
      specialDatesList.appendChild(item);
    }
  };
  
  // 既存の関数との統合
  const originalLoadSpecialDates = window.loadSpecialDates;
  if (typeof originalLoadSpecialDates === 'function') {
    window.loadSpecialDates = function() {
      // スピナーを表示
      showSpecialDatesSpinner();
      
      // 元の関数を呼び出す
      originalLoadSpecialDates();
    };
  }
  
  // デモデータでテスト
  setTimeout(function() {
    // 本番環境ではコメントアウトまたは削除する
    if (specialDatesList.querySelectorAll('.special-date-item').length === 0) {
      // テストデータ
      const demoData = [
        {
          id: '1',
          date: '2025-04-28',
          available: true,
          startTime: '10:00',
          endTime: '15:00',
          reason: 'テスト用データ'
        },
        {
          id: '2',
          date: '2025-05-05',
          available: false,
          reason: '祝日のためお休み'
        }
      ];
      
      // テストデータがない場合に表示
      if (demoData.length > 0) {
        demoData.forEach(data => {
          addSpecialDateItem(data);
        });
      } else {
        showEmptySpecialDatesMessage();
      }
    }
  }, 1500);
  
  console.log('スピナー修正初期化完了');
});