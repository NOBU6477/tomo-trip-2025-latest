# 🚨 TomoTrip 緊急問題 - 要約版

## 問題
**「新規登録」ボタン → 古い `perfect.html` が開く（修正済みの `v2.html` ではない）**

## 異常な点
- ✅ サーバーは完全修正済み（curlで確認OK）
- ✅ ファイル名も変更済み（button-setup-v3.js）
- ❌ **別ブラウザ（Edge）でも発生** ← 通常あり得ない
- ❌ Console に新しいログが出ない = 古いJSが実行中

## 試したこと（すべて失敗）
1. サーバー側リダイレクト ✅
2. ファイル無効化 ✅
3. JavaScript書き換え ✅
4. キャッシュバスター追加 ✅
5. **ファイル名完全変更** ✅
6. **別ブラウザテスト** ❌ ← それでもダメ

## 最有力仮説
**Replitプロキシが `index.html` をキャッシュ → 古いJS参照が実行される**

## 提案する解決策

### 🥇 解決策B: 新規エントリーポイント（3分・確実）
```html
<!-- public/register-guide.html -->
<meta http-equiv="refresh" content="0;url=/guide-registration-v2.html">
<script>window.location.href = '/guide-registration-v2.html';</script>
```
**URL**: `https://...replit.app/register-guide.html`  
**メリット**: キャッシュ完全回避、即実装可能

### 🥈 解決策A: サーバー側動的HTML（5分・最強）
```javascript
app.get('/', (req, res) => {
  let html = fs.readFileSync('public/index.html', 'utf8');
  html = html.replace(/\.js"/g, `.js?t=${Date.now()}"`);
  res.send(html);
});
```
**メリット**: プロキシキャッシュも無効化

## 質問
1. Replitプロキシのキャッシュクリア方法は？
2. より良い解決策はある？
3. どの解決策を最初に試すべき？

---

**詳細**: `URGENT_AI_CONSULTATION_REQUEST.md` 参照
