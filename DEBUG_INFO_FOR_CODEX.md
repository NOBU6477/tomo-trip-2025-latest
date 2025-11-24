# TomoTrip ガイド表示バグ - デバッグ情報

## 現在の状況

### 🔴 問題点
- ページ読み込み時にガイドカードが**まったく表示されない**
- ガイド数のカウンター表示は出ている（「1-12件表示中（12件中）」など）
- DevToolsで以下の出力を確認：
  - `Pagination: page 1/1, showing 6 total guides`
  - `Rendered 6 guide cards for page 1 of 1`
- ガイドが6個しか認識されていない（14個のAPIデータから）
- ガイドカードが画面上には描画されていない

### サーバーログ確認済み
```
📋 API returning 14 guides for language: ja
```
- APIから14個のガイドが正常に返ってきている
- サーバーは正常に動作している

---

## 実施した修正内容

### 修正1: `guide-renderer.mjs` (行14, 43)
**問題**: `renderGuideCards` が非同期処理の完了を待っていなかった

**修正前**:
```javascript
export function renderGuideCards(guidesToRender = null, usePagination = true, resetPagination = true) {
    if (usePagination && guides.length > 12) {
        initializePaginationSystem(guides, resetPagination);  // ← await なし
        return;  // ← 非同期処理完了前に戻る
    }
    renderAllGuideCards(guides);
}
```

**修正後**:
```javascript
export async function renderGuideCards(guidesToRender = null, usePagination = true, resetPagination = true) {
    if (usePagination && guides.length > 12) {
        await initializePaginationSystem(guides, resetPagination);  // ← await 追加
        return;
    }
    renderAllGuideCards(guides);
}
```

### 修正2: `event-handlers.mjs` (行1149, 1234)
**問題**: リセット・フィルター時にページネーション引数が不足していた

**修正前**:
```javascript
// 行1145
if (window.renderGuideCards) {
    window.renderGuideCards(window.AppState.guides);  // ← 引数不足
}

// 行1229
if (window.renderGuideCards) {
    window.renderGuideCards(filteredGuides);  // ← 引数不足
}
```

**修正後**:
```javascript
// 行1149（handleResetFilters内）
if (window.renderGuideCards) {
    window.renderGuideCards(window.AppState.guides, true, true);  // ← ページネーション引数追加
}

// 行1234（applyCurrentFilters内）
if (window.renderGuideCards) {
    window.renderGuideCards(filteredGuides, true, true);  // ← ページネーション引数追加
}
```

---

## ⚠️ **推測される問題**

### 主な原因：**async/await の呼び出し元対応不足**

`renderGuideCards` を `async` にしたが、**呼び出し元が `await` していない**

#### app-init.mjs 行287
```javascript
async function appInit() {
    // ...
    setTimeout(() => {
        console.log('🎯 Starting guide rendering with delay for DOM readiness');
        renderGuideCards(guides);  // ← await なし！
    }, 500);
}
```

**問題**: `renderGuideCards` が async なのに await されていないので、ガイド描画前に次の処理へ進んでしまう

#### event-handlers.mjs 行1146, 1231
```javascript
if (window.renderGuideCards) {
    window.renderGuideCards(window.AppState.guides, true, true);  // ← await なし！
}
```

**問題**: 同様にこれらも await されていない

---

## 関連するコードファイル

### ファイル構成
- `public/assets/js/ui/guide-renderer.mjs` (760行)
  - `renderGuideCards()` - 描画メイン関数（**async に変更済み**）
  - `initializePaginationSystem()` - ペジネーション初期化（async）
  - `renderAllGuideCards()` - 実際の描画処理

- `public/assets/js/events/event-handlers.mjs` (1280行)
  - `handleResetFilters()` - リセットボタンハンドラ（行1123-1156）
  - `applyCurrentFilters()` - フィルター適用関数（行1163-1250）
  - 他、複数の `renderGuideCards` 呼び出し箇所

- `public/assets/js/app-init.mjs` (511行)
  - `appInit()` - 初期化メイン関数（行229-）
  - `loadGuidesFromAPI()` - API呼び出し

- `public/assets/js/ui/scalable-pagination.mjs` (338行)
  - `ScalablePagination` クラス
  - `itemsPerPage: 12` に統一済み

---

## 推奨される修正内容

### 解決策1：呼び出し元を async/await 対応
```javascript
// app-init.mjs 行287
setTimeout(async () => {  // ← async 追加
    console.log('🎯 Starting guide rendering with delay for DOM readiness');
    await renderGuideCards(guides);  // ← await 追加
}, 500);

// event-handlers.mjs 行1146
if (window.renderGuideCards) {
    await window.renderGuideCards(window.AppState.guides, true, true);  // ← await 追加
}

// event-handlers.mjs 行1231
if (window.renderGuideCards) {
    await window.renderGuideCards(filteredGuides, true, true);  // ← await 追加
}
```

### 解決策2：renderGuideCards を同期関数に戻す
非同期処理を内部で完結させ、呼び出しは同期のままにする

---

## renderGuideCards の関数シグネチャ

```javascript
export async function renderGuideCards(
    guidesToRender = null,  // ガイド配列 or null
    usePagination = true,   // ページネーション使用フラグ
    resetPagination = true  // ページネーションリセットフラグ
)
```

---

## 現在のガイド数データ

- **API から取得**: 14個
- **default-guides.mjs に含まれる**: 12個
- **ページサイズ**: 12個/ページに統一
- **期待される表示**:
  - ページ1: 12個
  - ページ2: 2個

---

## スクリーンショット分析

### 画像1-2：ガイド人数表示の不一致
- 「1-13件表示中（13件中）」 → 正しくない（API: 14個）
- 「1-12件表示中（12件中）」 → 6個しか表示されていない

### 画像3：DevTools コンソール出力
```
Pagination: page 1/1, showing 6 total guides
Rendered 6 guide cards for page 1 of 1
```
- ガイドが6個に制限されている
- ガイドカードが実際には描画されていない

---

## 確認すべき項目

1. **async/await チェーン**: 呼び出し元すべてに `await` が付いているか
2. **エラーハンドリング**: Promise拒否が発生していないか（コンソール確認）
3. **paginationSystem の状態**: 初期化が正常に完了しているか
4. **renderAllGuideCards 関数**: 実際にDOMに描画しているか
5. **ガイドカード HTML生成**: `createGuideCardHTML` が正常に動作しているか

---

## 提供するコードスニペット

### guide-renderer.mjs の核となる部分
```javascript
export async function renderGuideCards(guidesToRender = null, usePagination = true, resetPagination = true) {
    let guides;
    
    if (guidesToRender !== null) {
        guides = guidesToRender;
        console.log('🎯 Using provided guides:', guides.length);
    } else {
        const appState = window.AppState;
        if (appState?.isFiltered && appState?.filteredGuides != null) {
            guides = appState.filteredGuides;
        } else {
            guides = appState?.guides ?? [];
        }
    }
    
    if (window.AppState && resetPagination) {
        window.AppState.currentPage = 1;
    }
    
    if (usePagination && guides.length > 12) {
        await initializePaginationSystem(guides, resetPagination);  // ← async/await
        return;
    }
    
    renderAllGuideCards(guides);
}

async function initializePaginationSystem(guides, resetPagination = true) {
    if (!paginationSystem || resetPagination) {
        const { ScalablePagination } = await import('./scalable-pagination.mjs');
        
        paginationSystem = new ScalablePagination({
            itemsPerPage: 12,
            maxVisiblePages: 5,
            container: '#paginationContainer',
            onPageLoad: (pageItems, currentPage, totalPages) => {
                renderAllGuideCards(pageItems);
                updateGuideCounters(pageItems.length, guides.length);
            }
        });
        
        window.setPaginationSystem(paginationSystem);
        ensurePaginationContainers();
    }
    
    paginationSystem.setData(guides);
    paginationSystem.renderPagination();
    paginationSystem.updatePageInfo();
    
    const firstPageItems = paginationSystem.getCurrentPageItems();
    renderAllGuideCards(firstPageItems);
}
```

---

## 次のステップ

1. **app-init.mjs** の `renderGuideCards` 呼び出しに `await` を追加
2. **event-handlers.mjs** の全 `renderGuideCards` 呼び出しに `await` を追加
3. ワークフロー再起動
4. DevTools で以下を確認：
   - コンソールエラーがないか
   - `renderAllGuideCards` が正常に実行されているか
   - ガイドカードがDOMに描画されているか
   - ペジネーション情報が正しいか
