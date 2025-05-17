/**
 * 最も直接的な手法でプロフィールプレビューにタグを追加する緊急修正スクリプト
 * CSSセレクタ・DOMツリーに依存せず、純粋な位置情報での強制挿入を行う
 */
(function() {
  // ページ読み込み直後のデバッグログ
  console.log('極端タグ修正スクリプトを初期化中...');

  // スタイルを注入
  const styleSheet = document.createElement('style');
  styleSheet.id = 'extreme-tag-styles';
  styleSheet.innerHTML = `
    .extreme-tag-container {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin: 10px 0;
      border-radius: 6px;
      padding: 5px;
    }
    
    .extreme-tag {
      display: inline-flex;
      align-items: center;
      background-color: #007bff;
      color: white;
      font-size: 11px;
      font-weight: 500;
      padding: 2px 10px;
      border-radius: 12px;
      margin-right: 4px;
      margin-bottom: 4px;
    }
    
    .extreme-tag.tag-night { background-color: #3f51b5; }
    .extreme-tag.tag-food { background-color: #e65100; }
    .extreme-tag.tag-photo { background-color: #00838f; }
    .extreme-tag.tag-cooking { background-color: #e65100; }
    .extreme-tag.tag-activity { background-color: #558b2f; }
    .extreme-tag.tag-custom { background-color: #ff9800; }
    .extreme-tag.tag-general { background-color: #6c757d; }
  `;
  document.head.appendChild(styleSheet);
  
  // DOM完全読み込み後に初期処理
  window.addEventListener('load', function() {
    setTimeout(function() {
      console.log('極端タグ修正：DOM分析を開始');
      analyzePageStructure();
      initialTagPlacement();
      
      // タグ変更を監視して定期的に更新
      listenForTagChanges();
      
      // 念のため定期更新も行う
      setInterval(updateTags, 2000);
    }, 1000);
  });

  // 専門分野タグの選択を監視
  function listenForTagChanges() {
    // クリックの監視（タグの追加・削除など）
    document.addEventListener('click', function(e) {
      if (
        e.target.closest('.interests-preset-chip') || 
        e.target.closest('.selected-tag-preview') ||
        e.target.closest('.custom-chip-remove') ||
        e.target.closest('#add-custom-tag-btn')
      ) {
        console.log('タグの変更を検出しました - 更新します');
        setTimeout(updateTags, 300);
      }
    });
    
    // タグ入力要素も監視
    const tagInput = document.getElementById('new-custom-tag');
    if (tagInput) {
      tagInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
          setTimeout(updateTags, 300);
        }
      });
    }
  }
  
  // 初回タグ配置
  function initialTagPlacement() {
    // このスクリプトだけで完結するよう、右列にあるカードをターゲットにする
    applyTagsToRightColumnCard();
  }
  
  // DOM構造分析
  function analyzePageStructure() {
    console.log('=== ページ構造分析を開始 ===');
    
    // 右側カラムを検索
    const rightCols = document.querySelectorAll('.col-md-4, .col-lg-4, .col-xl-4');
    console.log(`右側カラム: ${rightCols.length}個を検出`);
    
    if (rightCols.length > 0) {
      // 最後の右カラムがプレビュー表示用である可能性が高い
      const targetCol = rightCols[rightCols.length - 1]; 
      
      // カードを検索
      const cards = targetCol.querySelectorAll('.card');
      console.log(`右カラム内のカード要素: ${cards.length}個`);
      
      cards.forEach((card, index) => {
        console.log(`カード ${index+1}:`);
        
        // ヘッダーをチェック
        const cardHeaders = card.querySelectorAll('.card-header, .bg-primary, [style*="background"]');
        if (cardHeaders.length > 0) {
          cardHeaders.forEach(header => {
            console.log(` - ヘッダーテキスト: "${header.textContent.trim()}"`);
            
            // ヘッダーの背景色を確認
            const style = window.getComputedStyle(header);
            console.log(` - ヘッダー背景色: ${style.backgroundColor}`);
          });
        }
        
        // タイトル要素をチェック
        const titles = card.querySelectorAll('h1, h2, h3, h4, h5, h6, .card-title');
        if (titles.length > 0) {
          titles.forEach(title => {
            console.log(` - タイトルテキスト: "${title.textContent.trim()}"`);
          });
        }
        
        // 料金要素をチェック
        const priceElements = card.querySelectorAll('[class*="price"], [class*="fee"]');
        if (priceElements.length > 0) {
          console.log(` - 料金要素あり: ${priceElements.length}個`);
          priceElements.forEach(price => {
            console.log(`   * 料金テキスト: "${price.textContent.trim()}"`);
          });
        }
      });
    }
    
    console.log('=== 分析完了 ===');
  }
  
  // タグの更新処理
  function updateTags() {
    // 選択されているタグを取得
    const tags = getSelectedTags();
    
    if (tags.length > 0) {
      console.log(`更新対象タグ: ${tags.length}個`);
      
      // タグを表示する
      applyTagsToRightColumnCard(tags);
    } else {
      console.log('選択されたタグが見つかりません');
    }
  }
  
  // 右カラムのカードにタグを適用
  function applyTagsToRightColumnCard(tags) {
    if (!tags || tags.length === 0) {
      tags = getSelectedTags();
      if (tags.length === 0) return;
    }
    
    // 右側のカラム要素を探す
    const rightCols = document.querySelectorAll('.col-md-4, .col-lg-4, .col-xl-4');
    
    if (rightCols.length === 0) {
      console.log('右側カラムが見つかりません');
      return;
    }
    
    // 最後の右カラムをターゲットにする（通常プレビューはそこにある）
    const targetCol = rightCols[rightCols.length - 1];
    
    // その中のカードを探す
    const cards = targetCol.querySelectorAll('.card');
    
    if (cards.length === 0) {
      console.log('カードが見つかりません');
      return;
    }
    
    // プレビューらしいカードを特定（青いヘッダーか料金表示があるもの）
    let targetCard = null;
    
    // まず青いヘッダーがあるカードを探す
    for (const card of cards) {
      const headers = card.querySelectorAll('.card-header, .bg-primary, [style*="background"]');
      
      for (const header of headers) {
        const style = window.getComputedStyle(header);
        const bgcolor = style.backgroundColor;
        
        if (
          bgcolor.includes('rgb(0, 123, 255)') || 
          bgcolor.includes('rgb(13, 110, 253)') ||
          bgcolor.includes('blue')
        ) {
          // 青いヘッダーらしきものを見つけた
          targetCard = card;
          console.log('青いヘッダーを持つカードを見つけました');
          break;
        }
      }
      
      if (targetCard) break;
    }
    
    // 青いヘッダーが見つからなければ、料金表示があるカードを探す
    if (!targetCard) {
      for (const card of cards) {
        if (card.querySelector('[class*="price"], [class*="fee"]')) {
          targetCard = card;
          console.log('料金表示を持つカードを見つけました');
          break;
        }
      }
    }
    
    // それでもなければ、最初のカードを使う
    if (!targetCard && cards.length > 0) {
      targetCard = cards[0];
      console.log('最初のカードを使用します');
    }
    
    if (targetCard) {
      // カード内のコンテンツ部分（カードボディ）を探す
      const cardBody = targetCard.querySelector('.card-body') || targetCard;
      
      // 既存のタグコンテナを検索
      let tagContainer = cardBody.querySelector('.extreme-tag-container');
      
      // なければ新規作成
      if (!tagContainer) {
        tagContainer = document.createElement('div');
        tagContainer.className = 'extreme-tag-container';
        
        // 料金要素の前に挿入
        const priceElement = cardBody.querySelector('[class*="price"], [class*="fee"]');
        
        if (priceElement) {
          console.log('料金要素の前にタグを挿入します');
          priceElement.parentNode.insertBefore(tagContainer, priceElement);
        } else {
          // 段落があれば最初の段落の後に挿入
          const paragraphs = cardBody.querySelectorAll('p');
          
          if (paragraphs.length > 0) {
            console.log('段落の後にタグを挿入します');
            
            if (paragraphs[0].nextSibling) {
              paragraphs[0].parentNode.insertBefore(tagContainer, paragraphs[0].nextSibling);
            } else {
              paragraphs[0].parentNode.appendChild(tagContainer);
            }
          } else {
            // 何もなければ直接追加
            console.log('カードボディに直接タグを挿入します');
            cardBody.appendChild(tagContainer);
          }
        }
      }
      
      // タグコンテナの内容をクリア
      tagContainer.innerHTML = '';
      console.log('タグコンテナをクリアしました');
      
      // タグを追加
      tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = `extreme-tag tag-${tag.category}`;
        tagElement.textContent = tag.label;
        tagContainer.appendChild(tagElement);
      });
      
      console.log(`${tags.length}個のタグを挿入しました`);
    } else {
      console.log('適切なターゲットカードが見つかりませんでした');
    }
  }

  // 選択されているタグを取得
  function getSelectedTags() {
    const tags = [];
    
    // モダンUIからタグを取得
    const selectedContainer = document.getElementById('selected-tags-preview');
    if (selectedContainer) {
      const selectedTags = selectedContainer.querySelectorAll('.selected-tag-preview:not(.removing)');
      
      selectedTags.forEach(tag => {
        const value = tag.dataset.value || '';
        const label = tag.querySelector('.selected-tag-text')?.textContent || '';
        
        if (label) {
          let category = 'general';
          
          if (value.startsWith('custom:')) {
            category = 'custom';
          } else if (value) {
            category = value;
          }
          
          tags.push({
            value: value,
            label: label,
            category: category
          });
        }
      });
    }
    
    // レガシーUIからもチェック（フォールバック）
    if (tags.length === 0) {
      const checkboxes = document.querySelectorAll('input[type="checkbox"][id^="interest-"]:checked');
      
      checkboxes.forEach(checkbox => {
        const value = checkbox.id.replace('interest-', '');
        const label = checkbox.nextElementSibling?.textContent.trim() || value;
        
        tags.push({
          value: value,
          label: label,
          category: value
        });
      });
    }
    
    return tags;
  }
})();