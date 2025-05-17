/**
 * 曜日タブのモダンUIスクリプト
 * 時間帯設定の曜日タブをよりスタイリッシュに
 */

document.addEventListener('DOMContentLoaded', function() {
  // すでに存在する曜日タブ要素を取得
  const weekdayTabsContainer = document.querySelector('.nav-tabs');
  
  // 曜日タブが存在する場合はモダンなデザインに変更
  if (weekdayTabsContainer && weekdayTabsContainer.parentElement.id === 'schedule-tabs-container') {
    // クラスを追加して新しいスタイルを適用
    weekdayTabsContainer.classList.add('weekday-tabs');
    
    // 各タブ要素にクラスを追加
    const tabItems = weekdayTabsContainer.querySelectorAll('.nav-link');
    tabItems.forEach(tab => {
      tab.classList.add('weekday-tab');
      
      // アクティブな要素には特別なクラスを適用
      if (tab.classList.contains('active')) {
        tab.classList.add('active-weekday-tab');
      }
      
      // タブクリック時のイベントハンドラーを追加
      tab.addEventListener('click', function() {
        // すべてのタブから active-weekday-tab クラスを削除
        tabItems.forEach(t => t.classList.remove('active-weekday-tab'));
        
        // クリックされたタブに active-weekday-tab クラスを追加
        this.classList.add('active-weekday-tab');
      });
    });
    
    console.log('曜日タブをモダンなデザインに変更しました');
  }
  
  // 時間帯設定パネルに新しいスタイルを適用
  const timeSettingsPanels = document.querySelectorAll('.tab-pane');
  timeSettingsPanels.forEach(panel => {
    if (panel.id && panel.id.includes('day-schedule')) {
      panel.classList.add('time-settings-panel');
      
      // パネルの内部要素にもスタイルを適用
      const headers = panel.querySelectorAll('h4, h5');
      headers.forEach(header => {
        header.classList.add('time-settings-title');
      });
      
      // 時間選択ドロップダウンを改善
      const selects = panel.querySelectorAll('select');
      selects.forEach(select => {
        select.classList.add('time-picker');
        
        // インラインスタイルを直接追加して確実に見えるようにする
        select.style.backgroundColor = '#ffffff';
        select.style.color = '#000000';
        select.style.border = '2px solid #0077b6';
        select.style.fontWeight = '500';
        select.style.padding = '12px 15px';
        select.style.borderRadius = '8px';
        select.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        
        // オプションにもスタイルを適用
        for (let i = 0; i < select.options.length; i++) {
          const option = select.options[i];
          option.style.backgroundColor = '#ffffff';
          option.style.color = '#000000';
          option.style.padding = '10px';
        }
        
        // セレクトをラップするコンテナを作成
        const parent = select.parentElement;
        const label = parent.querySelector('label');
        
        // すでにtime-picker-containerでラップされていない場合のみ実行
        if (!parent.classList.contains('time-picker-container')) {
          const container = document.createElement('div');
          container.classList.add('time-picker-container');
          
          // 既存の要素を新しいコンテナに移動
          if (label) parent.removeChild(label);
          parent.removeChild(select);
          
          if (label) container.appendChild(label);
          container.appendChild(select);
          
          // コンテナを元の場所に追加
          parent.appendChild(container);
        }
      });
    }
  });
});