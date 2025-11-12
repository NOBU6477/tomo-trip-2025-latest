# 🚀 TomoTrip クイックスタートガイド

## 📱 アプリURL
```
https://31176088-3ca0-49de-9098-7b5f0f0a1c9a-00-1jhrgwtjgmb39.kirk.replit.dev
```

---

## ✅ 修正完了した問題

### 1. ガイド登録ページの構文エラー
**問題**: 活動地域以降の項目が機能しなかった  
**原因**: JavaScriptの中括弧が1つ閉じられていなかった  
**修正**: `initializePhoneVerification`関数の閉じ括弧を追加  
**結果**: ✅ すべてのフィールドが正常に動作

### 2. ガイドダッシュボードのエラー
**問題**: 「GUIDE_ID が未設定です」エラーが表示された  
**原因**: URLに `?id=ガイドID` が必要だった  
**修正**: URLパラメータチェックとエラーメッセージを追加、ガイド登録ページへ自動リダイレクト  
**結果**: ✅ 正しいURLでアクセスすれば正常に表示、IDがない場合は自動的に登録ページへ

### 3. プロフィール編集ボタンの問題
**問題**: クリックするとトップページに遷移してしまう  
**原因**: ガイドIDを引き継がずにリダイレクトしていた  
**修正**: `editProfile()`関数でIDを引き継ぐよう修正  
**結果**: ✅ `/guide-edit.html?id=ガイドID` に正しく遷移

### 4. 協賛店ダッシュボードのリダイレクト問題
**問題**: OKボタンを押すとトップページではなく間違ったページに遷移する  
**原因**: すべてのエラーリダイレクトが `index.html` になっていた  
**修正**: すべてのリダイレクトを `/sponsor-login.html` に変更  
**結果**: ✅ 認証エラー時は協賓店ログインページに正しくリダイレクト

---

## 🎯 1分でわかる使い方

### ガイドとして登録する

1. **登録ページにアクセス**
   ```
   https://31176088-3ca0-49de-9098-7b5f0f0a1c9a-00-1jhrgwtjgmb39.kirk.replit.dev/guide-registration-perfect.html
   ```

2. **フォームに入力**
   - ガイド名、メールアドレス、性別、年齢
   - 活動地域（都道府県）
   - 電話番号 → 認証コード受信 → 認証確認
   - 身分証明書アップロード
   - 言語、自己紹介、料金など

3. **登録完了**
   - **ガイドID**が表示される（必ずメモ！）
   - 例：`577f0c89-fa4f-44e8-8f7f-a4ddb9431767`

### ダッシュボードを見る

```
https://31176088-3ca0-49de-9098-7b5f0f0a1c9a-00-1jhrgwtjgmb39.kirk.replit.dev/guide-dashboard.html?id=ガイドID
```

**重要**: URLの最後に `?id=ガイドID` を必ず付ける！

---

## 🧪 すぐに試せる既存データ

### ガイドダッシュボード

**テスト太郎** (ID: 577f0c89-fa4f-44e8-8f7f-a4ddb9431767)
```
https://31176088-3ca0-49de-9098-7b5f0f0a1c9a-00-1jhrgwtjgmb39.kirk.replit.dev/guide-dashboard.html?id=577f0c89-fa4f-44e8-8f7f-a4ddb9431767
```

表示される内容：
- 今月の配当: ¥0（まだ送客実績なし）
- 現在のランク: Bronze
- Silverまで: 60ポイント必要
- ランク早見表: Bronze/Silver/Gold/Platinum

**林修** (ID: fa12dc14-1899-4bd5-bbd3-8ce0a2c359e9)
```
https://31176088-3ca0-49de-9098-7b5f0f0a1c9a-00-1jhrgwtjgmb39.kirk.replit.dev/guide-dashboard.html?id=fa12dc14-1899-4bd5-bbd3-8ce0a2c359e9
```

### 協賛店ダッシュボード

**沖縄そば ま～さん** (ID: b73af3d7-a4ea-4c7f-84f1-3e17534c79b0)
```
https://31176088-3ca0-49de-9098-7b5f0f0a1c9a-00-1jhrgwtjgmb39.kirk.replit.dev/store-dashboard.html?id=b73af3d7-a4ea-4c7f-84f1-3e17534c79b0
```

表示される内容：
- 効果測定: 送客数、予約数、来店率
- TOP貢献ガイド: 最も貢献しているガイド3名

---

## 🔧 開発者向けAPI確認

### ランクシステム
```
https://31176088-3ca0-49de-9098-7b5f0f0a1c9a-00-1jhrgwtjgmb39.kirk.replit.dev/api/admin/ranks
```

返ってくるデータ：
```json
[
  {"name":"Bronze","minScore":0,"bonusRate":0,"maxStores":20},
  {"name":"Silver","minScore":60,"bonusRate":0.05,"maxStores":50},
  {"name":"Gold","minScore":120,"bonusRate":0.1,"maxStores":100},
  {"name":"Platinum","minScore":200,"bonusRate":0.15,"maxStores":100}
]
```

### Feature Flags
```
https://31176088-3ca0-49de-9098-7b5f0f0a1c9a-00-1jhrgwtjgmb39.kirk.replit.dev/api/admin/flags
```

返ってくるデータ：
```json
{
  "ENABLE_PAYOUTS": true,
  "ENABLE_GUIDE_RANKING": true,
  "SHOW_GUIDE_REAL_NAME_TO_STORE": false
}
```

### ガイドダッシュボードAPI
```
https://31176088-3ca0-49de-9098-7b5f0f0a1c9a-00-1jhrgwtjgmb39.kirk.replit.dev/api/guides/577f0c89-fa4f-44e8-8f7f-a4ddb9431767/dashboard
```

返ってくるデータ：
```json
{
  "guideId": "577f0c89-fa4f-44e8-8f7f-a4ddb9431767",
  "period": "2025-11",
  "summary": {
    "current_rank": "Bronze",
    "rank_score": 0,
    "next_rank": "Silver",
    "points_to_next": 60,
    "payout_month_total": 0
  },
  "payouts": [],
  "referred_stores": []
}
```

---

## ❗ よくある間違い

### ❌ 間違い1: URLにIDを付けない
```
https://.../guide-dashboard.html
```
→ 「GUIDE_ID が未設定です」エラー

### ✅ 正しい方法
```
https://.../guide-dashboard.html?id=577f0c89-fa4f-44e8-8f7f-a4ddb9431767
```

### ❌ 間違い2: 古いブラウザキャッシュ
→ プロフィール編集がうまく動かない

### ✅ 正しい方法
- Ctrl+F5（Windows）または Cmd+Shift+R（Mac）でハードリロード
- または、シークレットウィンドウで開く

---

## 📋 動作確認チェックリスト

### ガイド登録ページ
- [ ] ページが正常に表示される
- [ ] ガイド名、メール、性別、年齢が入力できる
- [ ] **活動地域ドロップダウンが表示される**（124オプション）
- [ ] 電話認証が動作する
- [ ] 身分証明書がアップロードできる
- [ ] 言語、自己紹介、料金が入力できる
- [ ] 登録完了でガイドIDが発行される

### ガイドダッシュボード
- [ ] URLに `?id=ガイドID` を付けてアクセス
- [ ] 「GUIDE_ID が未設定です」エラーが出ない
- [ ] 配当カードが表示される
- [ ] ランクカードが表示される（Bronze、60pt必要）
- [ ] ランク早見表が表示される
- [ ] **プロフィール編集ボタンでIDが引き継がれる**

### 協賛店ダッシュボード
- [ ] URLに `?id=店舗ID` を付けてアクセス
- [ ] 効果測定カードが表示される
- [ ] TOP貢献ガイドが表示される

---

## 🎉 すべて完了！

すべてのチェックが完了したら、本番環境へのデプロイ準備が完了しています！

---

## 📞 サポート

問題が発生した場合は、以下を確認してください：

1. ブラウザのコンソール（F12）にエラーが表示されていないか
2. URLに正しく `?id=ガイドID` が含まれているか
3. ブラウザキャッシュをクリアしたか（Ctrl+F5）

それでも解決しない場合は、詳細な TEST_GUIDE.md を参照してください。
