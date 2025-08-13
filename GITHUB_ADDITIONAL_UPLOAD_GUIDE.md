# 🚀 GitHub追加アップロードガイド

## 📋 現在の状況
GitHubリポジトリに基本ファイルは既にアップロード済みですが、Webサイトの動作に必要な重要なアセットファイルが不足しています。

## 📦 追加アップロードが必要なファイル

### 🔥 重要: assetsフォルダー
現在のリポジトリには `assets` フォルダーがありません。これがないとWebサイトが正常に動作しません。

**追加が必要な重要ファイル:**

### 📁 github-additional-upload/assets/
```
assets/
├── js/                          # 🔥 最重要 - JavaScriptモジュール
│   ├── app-init.mjs            # メインアプリ初期化
│   ├── emergency-buttons.mjs    # 緊急ボタン（日本語）
│   ├── emergency-buttons-en.mjs # 緊急ボタン（英語）
│   ├── data/
│   │   └── default-guides.mjs   # 12個のガイドデータ
│   ├── events/
│   │   └── event-handlers.mjs   # イベント処理
│   ├── locations/
│   │   └── location-setup.mjs   # 位置情報設定
│   ├── state/
│   │   └── app-state.mjs       # アプリ状態管理
│   ├── ui/
│   │   ├── guide-renderer.mjs   # ガイド表示
│   │   └── modal.mjs           # モーダル処理
│   └── utils/
│       └── logger.mjs          # ログ機能
├── css/                        # スタイルシート
│   ├── footer.css              # フッター
│   └── icons.css               # アイコン
├── images/                     # 🌊 海洋テーマ画像
│   ├── beach-yacht-tourists.jpg # メイン背景画像
│   ├── tomotrip-logo.png       # ロゴ
│   └── yacht-beach-background.jpg
├── img/
│   └── guides/                 # ガイドアバター
│       ├── default-1.svg
│       ├── default-2.svg
│       ├── default-3.svg
│       ├── default-4.svg
│       └── default-5.svg
└── fonts/
    └── bootstrap-icons.woff2    # アイコンフォント
```

## 🎯 アップロード手順

### 1. GitHubリポジトリで追加アップロード
1. リポジトリのメインページで **「Add file」** → **「Upload files」** をクリック
2. `github-additional-upload/assets` フォルダーを選択
3. フォルダー全体をドラッグ&ドロップ
4. Commit message: `Add essential assets - JS modules, CSS, images`
5. **「Commit changes」** をクリック

### 2. 個別ファイルの確認
アップロード後、以下のファイルパスが正常に表示されることを確認:
```
assets/js/app-init.mjs
assets/js/data/default-guides.mjs
assets/images/beach-yacht-tourists.jpg
assets/img/guides/default-1.svg
```

## ⚠️ 重要な注意事項

### 必須ファイル
- **app-init.mjs**: Webサイトのメイン初期化スクリプト
- **default-guides.mjs**: 12個のガイドデータ（表示に必須）
- **beach-yacht-tourists.jpg**: メイン背景画像
- **guide-renderer.mjs**: ガイドカード表示機能

### フォルダー構造の重要性
GitHubでは正確なフォルダー構造が重要です。以下の構造を維持してください:
```
リポジトリ/
├── index.html
├── main.py
└── assets/          # ← この階層が重要
    ├── js/
    ├── css/
    ├── images/
    └── img/
```

## 🌊 アップロード完了後の確認

### GitHub Pagesでの確認
1. Settings > Pages
2. Source: "Deploy from a branch"
3. Branch: "main"
4. Save
5. 数分後にWebサイトとして表示される

### 期待される表示
- 海洋テーマの背景画像
- 12個のガイドカード
- 日本語・英語の言語切り替えボタン
- レスポンシブデザイン（モバイル対応）

## 🔧 トラブルシューティング

### ファイルが見つからない場合
- ブラウザのキャッシュをクリア
- GitHubページを再読み込み
- ファイルパスが正確か確認

### 表示されない場合
- `index.html` がルートディレクトリにあることを確認
- `assets` フォルダーがルートディレクトリにあることを確認

---

## ✅ アップロード準備完了
`github-additional-upload/assets` フォルダーがGitHub追加アップロード用に準備完了しました。