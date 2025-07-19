/**
 * 初心者向けガイド統合システム
 * フローティングツールバーの使い方をフィルター機能に統合
 */

console.log('🎓 初心者向けガイド統合システム開始');

// DOM読み込み完了時に実行
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(addBeginnerGuideToFilter, 1000);
});

function addBeginnerGuideToFilter() {
  console.log('🎓 初心者向けガイド追加');
  
  // フィルターボタンを探す
  const filterButton = document.querySelector('button[data-bs-target="#guide-filters"]');
  if (!filterButton) {
    console.log('⚠️ フィルターボタンが見つかりません');
    return;
  }
  
  // フィルターモーダル内にガイドセクションを追加
  const filterModal = document.getElementById('guide-filters');
  if (!filterModal) {
    console.log('⚠️ フィルターモーダルが見つかりません');
    return;
  }
  
  // 既存のガイドが存在するかチェック
  if (document.getElementById('beginner-pagination-guide')) {
    console.log('⚠️ 初心者ガイドは既に追加済み');
    return;
  }
  
  // 新しいガイドセクションを作成
  const guideSection = createBeginnerGuideSection();
  
  // フィルターモーダルの終了部分（検索ボタン前）に挿入
  const searchButtonContainer = filterModal.querySelector('.d-flex.justify-content-end');
  if (searchButtonContainer) {
    searchButtonContainer.parentNode.insertBefore(guideSection, searchButtonContainer);
    console.log('✅ 初心者ガイドをフィルターモーダルに追加完了');
  }
}

function createBeginnerGuideSection() {
  const section = document.createElement('div');
  section.id = 'beginner-pagination-guide';
  section.className = 'col-12 mb-4';
  
  section.innerHTML = `
    <div class="card border-info">
      <div class="card-header bg-info text-white d-flex justify-content-between align-items-center">
        <h6 class="mb-0">
          <i class="bi bi-question-circle-fill me-2"></i>新機能ガイド：右下のツールバーの使い方
        </h6>
        <button class="btn btn-sm btn-outline-light" type="button" data-bs-toggle="collapse" data-bs-target="#pagination-help" aria-expanded="false">
          詳細を見る
        </button>
      </div>
      <div class="collapse" id="pagination-help">
        <div class="card-body">
          
          <!-- フローティングツールバー説明 -->
          <div class="row mb-4">
            <div class="col-12">
              <div class="alert alert-primary d-flex align-items-start">
                <i class="bi bi-info-circle-fill me-3 fs-5"></i>
                <div>
                  <h6 class="alert-heading mb-2">画面右下のツールバーについて</h6>
                  <p class="mb-0 small">
                    右下に表示されているツールバーは「高度ページネーション機能」です。
                    <br>ガイドを効率的に比較・管理するための便利な機能が搭載されています。
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- 機能別説明 -->
          <div class="row">
            
            <!-- ブックマーク機能 -->
            <div class="col-md-6 mb-3">
              <div class="border rounded p-3 h-100">
                <div class="d-flex align-items-center mb-2">
                  <span class="badge bg-warning text-dark me-2">
                    <i class="bi bi-bookmark-star"></i>
                  </span>
                  <h6 class="mb-0 fw-bold">ブックマーク機能</h6>
                </div>
                <ul class="small mb-0 text-muted">
                  <li>ガイドカード左上の<strong>星アイコン</strong>をクリック</li>
                  <li>気になるガイドを保存できます</li>
                  <li>保存されたカードは<span class="text-warning fw-bold">黄色いボーダー</span>で表示</li>
                  <li>右下ツールバーの「ブックマーク」で一覧確認</li>
                </ul>
              </div>
            </div>

            <!-- 比較機能 -->
            <div class="col-md-6 mb-3">
              <div class="border rounded p-3 h-100">
                <div class="d-flex align-items-center mb-2">
                  <span class="badge bg-success me-2">
                    <i class="bi bi-check2-square"></i>
                  </span>
                  <h6 class="mb-0 fw-bold">比較機能（最大3人）</h6>
                </div>
                <ul class="small mb-0 text-muted">
                  <li>ガイドカード左上の<strong>チェックアイコン</strong>をクリック</li>
                  <li>最大3人まで比較リストに追加</li>
                  <li>選択されたカードは<span class="text-success fw-bold">緑色のボーダー</span>で表示</li>
                  <li>右下ツールバーの「比較する」で詳細比較</li>
                </ul>
              </div>
            </div>

            <!-- キーボード操作 -->
            <div class="col-md-6 mb-3">
              <div class="border rounded p-3 h-100">
                <div class="d-flex align-items-center mb-2">
                  <span class="badge bg-secondary me-2">
                    <i class="bi bi-keyboard"></i>
                  </span>
                  <h6 class="mb-0 fw-bold">キーボード操作</h6>
                </div>
                <ul class="small mb-0 text-muted">
                  <li><kbd>←</kbd><kbd>→</kbd> でページ移動</li>
                  <li><kbd>Home</kbd> で最初のページ</li>
                  <li><kbd>End</kbd> で最後のページ</li>
                  <li>入力中でなければどこからでも操作可能</li>
                </ul>
              </div>
            </div>

            <!-- その他の機能 -->
            <div class="col-md-6 mb-3">
              <div class="border rounded p-3 h-100">
                <div class="d-flex align-items-center mb-2">
                  <span class="badge bg-primary me-2">
                    <i class="bi bi-gear"></i>
                  </span>
                  <h6 class="mb-0 fw-bold">その他の便利機能</h6>
                </div>
                <ul class="small mb-0 text-muted">
                  <li><strong>ページジャンプ：</strong>ドロップダウンから直接移動</li>
                  <li><strong>並び替え：</strong>評価順、料金順、名前順</li>
                  <li><strong>ランダム：</strong>偶然の発見を楽しむ</li>
                  <li><strong>閲覧履歴：</strong>見たガイドを記録（青いボーダー）</li>
                </ul>
              </div>
            </div>

          </div>

          <!-- 操作例 -->
          <div class="row mt-4">
            <div class="col-12">
              <div class="alert alert-success">
                <h6 class="alert-heading mb-2">
                  <i class="bi bi-lightbulb me-2"></i>使い方の例
                </h6>
                <ol class="mb-0 small">
                  <li>気になるガイドを<strong>星アイコン</strong>でブックマーク</li>
                  <li>比較したいガイドを<strong>チェックアイコン</strong>で選択（最大3人）</li>
                  <li>右下の「比較する」ボタンで詳細比較</li>
                  <li>キーボードの<kbd>←</kbd><kbd>→</kbd>で他のページもチェック</li>
                  <li>「ランダム」ボタンで新しい発見を楽しむ</li>
                </ol>
              </div>
            </div>
          </div>

          <!-- 注意事項 -->
          <div class="row">
            <div class="col-12">
              <div class="alert alert-warning d-flex align-items-start">
                <i class="bi bi-exclamation-triangle me-3"></i>
                <div class="small">
                  <strong>注意：</strong>
                  <ul class="mb-0 mt-1">
                    <li>フローティングツールバーが表示されない場合は、ページをリロードしてください</li>
                    <li>モバイル端末では画面下部に表示位置が調整されます</li>
                    <li>比較機能は最大3人までの制限があります</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- 使い方動画・デモ -->
          <div class="row">
            <div class="col-12 text-center">
              <button class="btn btn-outline-primary me-2" onclick="window.beginnerGuide.showFloatingToolbar()">
                <i class="bi bi-eye"></i> ツールバーを表示
              </button>
              <button class="btn btn-outline-info me-2" onclick="window.beginnerGuide.highlightFeatures()">
                <i class="bi bi-cursor"></i> 機能をハイライト
              </button>
              <button class="btn btn-outline-success" onclick="window.systemBridge?.showAdvancedFeatures()">
                <i class="bi bi-list-check"></i> 全機能一覧
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  `;
  
  return section;
}

// 初心者ガイド用のヘルパー機能
window.beginnerGuide = {
  showFloatingToolbar: function() {
    const toolbar = document.getElementById('floating-toolbar');
    if (toolbar) {
      toolbar.style.display = 'block';
      toolbar.style.animation = 'pulse 2s infinite';
      
      setTimeout(() => {
        toolbar.style.animation = '';
      }, 6000);
      
      // ツールバーまでスクロール
      toolbar.scrollIntoView({ behavior: 'smooth', block: 'end' });
      
      alert('右下のツールバーをご確認ください。点滅しているのが新しい高度ページネーション機能です。');
    } else {
      alert('ツールバーが見つかりません。ページをリロードしてから再度お試しください。');
    }
  },

  highlightFeatures: function() {
    console.log('🔍 機能ハイライト実行');
    
    // ガイドカード上のアイコンをハイライト
    const bookmarkIcons = document.querySelectorAll('.guide-card .btn-outline-warning');
    const compareIcons = document.querySelectorAll('.guide-card .btn-outline-success');
    
    // ブックマークアイコンをハイライト
    bookmarkIcons.forEach(icon => {
      icon.style.animation = 'pulse 2s infinite';
      icon.style.borderColor = '#ffc107';
      icon.style.borderWidth = '2px';
    });
    
    // 比較アイコンをハイライト
    compareIcons.forEach(icon => {
      icon.style.animation = 'pulse 2s infinite';
      icon.style.borderColor = '#28a745';
      icon.style.borderWidth = '2px';
    });
    
    // 3秒後にハイライト解除
    setTimeout(() => {
      bookmarkIcons.forEach(icon => {
        icon.style.animation = '';
        icon.style.borderColor = '';
        icon.style.borderWidth = '';
      });
      
      compareIcons.forEach(icon => {
        icon.style.animation = '';
        icon.style.borderColor = '';
        icon.style.borderWidth = '';
      });
    }, 6000);
    
    alert('ガイドカード左上の星アイコン（ブックマーク）とチェックアイコン（比較）がハイライトされました。これらをクリックして機能をお試しください。');
  }
};

// CSSアニメーションを追加
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.7; }
    100% { transform: scale(1); opacity: 1; }
  }
  
  .floating-toolbar.highlight {
    box-shadow: 0 0 20px rgba(13, 110, 253, 0.5) !important;
    border-color: #0d6efd !important;
  }
  
  #pagination-help kbd {
    background-color: #e9ecef;
    border: 1px solid #adb5bd;
    border-radius: 3px;
    color: #495057;
    font-size: 0.8em;
    padding: 0.2rem 0.4rem;
  }
  
  #pagination-help .badge {
    font-size: 0.9em;
  }
  
  #pagination-help .alert {
    border: 1px solid;
    border-radius: 0.375rem;
  }
  
  #pagination-help .alert-primary {
    border-color: #b6d7ff;
    background-color: #f0f8ff;
  }
  
  #pagination-help .alert-success {
    border-color: #badbcc;
    background-color: #f0fff4;
  }
  
  #pagination-help .alert-warning {
    border-color: #ffe5b3;
    background-color: #fffbf0;
  }
`;
document.head.appendChild(style);

console.log('✅ 初心者向けガイド統合システム読み込み完了');

// 遅延実行でガイド追加
setTimeout(addBeginnerGuideToFilter, 2000);
setTimeout(addBeginnerGuideToFilter, 5000);