# 🌟 TomoTrip完全ファイルリスト - GitHub移行用

## ✅ メインアプリケーションファイル (本番必須)

### 🌐 HTMLページ
- `index.html` - 日本語メインページ
- `index-en.html` - 英語版ページ
- `sponsor-registration.html` - スポンサー登録ページ
- `qr-code-generator.html` - QRコード生成ページ

### 🎨 CSS スタイル
- `ocean_background.css` - 海洋テーマ背景
- `assets/css/icons.css` - Bootstrap Icons CSS
- `assets/css/footer.css` - フッタースタイル

### 🚀 JavaScript モジュール (.mjs)
- `assets/js/app-init.mjs` - アプリケーション初期化
- `assets/js/data/default-guides.mjs` - デフォルトガイドデータ
- `assets/js/emergency-buttons.mjs` - 緊急ボタン（日本語）
- `assets/js/emergency-buttons-en.mjs` - 緊急ボタン（英語）
- `assets/js/events/event-handlers.mjs` - イベント処理
- `assets/js/locations/location-setup.mjs` - 場所設定
- `assets/js/state/app-state.mjs` - アプリケーション状態管理
- `assets/js/ui/guide-renderer.mjs` - ガイド表示機能
- `assets/js/ui/modal.mjs` - モーダル機能
- `assets/js/utils/logger.mjs` - ログ機能

### 🛠️ サポートJavaScript
- `management.js` - 管理機能
- `error_suppressor.js` - エラー抑制
- `webgl-fix.js` - WebGL最適化
- `sw-unregister.js` - Service Worker解除

### 🖼️ 画像アセット
- `assets/images/beach-yacht-tourists.jpg` - メイン背景画像 (2.6MB)
- `assets/images/tomotrip-logo.png` - ロゴ画像
- `assets/images/yacht-beach-background.jpg` - 追加背景
- `assets/img/guides/default-1.svg` - ガイドアバター1
- `assets/img/guides/default-2.svg` - ガイドアバター2
- `assets/img/guides/default-3.svg` - ガイドアバター3
- `assets/img/guides/default-4.svg` - ガイドアバター4
- `assets/img/guides/default-5.svg` - ガイドアバター5
- `favicon.svg` - ファビコン

### 📱 フォントファイル
- `assets/fonts/bootstrap-icons.woff2` - Bootstrap Iconsフォント
- `assets/fonts/bootstrap-icons.woff` - Bootstrap Iconsフォント（フォールバック）

### 🐍 バックエンドファイル
- `main.py` - Pythonサーバー（本番デプロイ用）
- `run.py` - サーバー起動スクリプト
- `simple_server.py` - シンプルサーバー

### ⚙️ 設定ファイル
- `replit.toml` - Replit設定
- `runtime.txt` - Python runtime指定
- `Procfile` - Heroku デプロイ用

## 📚 ドキュメンテーション

### 📖 プロジェクト文書
- `README.md` - プロジェクト説明
- `replit.md` - 技術アーキテクチャ文書
- `ROADMAP.md` - 開発ロードマップ

### 🔧 技術レポート
- `FINAL_PRODUCTION_COMPLIANCE_REPORT.md` - 本番準拠レポート
- `CSP_COMPLIANCE_REPORT.md` - CSP準拠レポート
- `GITHUB_UPLOAD_FINAL_INSTRUCTIONS.md` - GitHub アップロード手順

## 🚫 GitHub移行対象外 (開発用ファイル)

### 🗂️ 開発用フォルダ
- `attached_assets/` - 開発画像（460MB+）
- `export-tomotrip/` - 作業用エクスポートフォルダ
- `github-ready/` - 旧GitHub準備フォルダ
- `github-additional-upload/` - 追加アップロードフォルダ

### 🧪 テスト・開発ファイル
- `deployment_test.py` - デプロイテスト
- `test_server.py` - テストサーバー
- `diagnose.py` - 診断スクリプト
- `fix_*.py` - 修正スクリプト群

## 📦 最終GitHub移行パッケージ

**`export-tomotrip-clean.zip`** (3.1MB)
- 27個の本番必須ファイル
- 開発用画像を除外済み
- 即座にデプロイ可能