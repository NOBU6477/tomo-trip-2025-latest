# TomoTrip - Local Guide Matching Platform

## 概要
地元ガイドと旅行者をマッチングするWebプラットフォームです。日本語版と英語版の2つのサイトが含まれています。

## ファイル構成

### メインファイル
- `index.html` - 日本語版メインページ
- `index-en.html` - 英語版メインページ
- `index.js` - Node.js Express サーバー
- `package.json` - Node.js 依存関係

### JavaScript機能ファイル
- `emergency-fix.js` - 緊急修復システム（スクロール・言語切り替え・ガイド数表示）
- `load-70-guides.js` - 日本語版ガイドデータ読み込み
- `load-70-guides-en.js` - 英語版ガイドデータ読み込み
- `comprehensive-filter.js` - フィルター機能
- `filter-toggle.js` - フィルター表示/非表示切り替え
- `enhanced-filter-fix-ja.js` - 日本語版フィルター修正
- `enhanced-filter-fix-en.js` - 英語版フィルター修正
- `benefit-card-fix.js` - ベネフィットカード表示修正
- `japanese-counter-fix.js` - 日本語版ガイド数表示修正
- `universal-benefit-fix.js` - 共通ベネフィットカード修正
- `guide-filter-fix.js` - ガイドフィルター修正

### スタイルファイル
- `sponsor-buttons-redesign.css` - スポンサーボタンのスタイル

### ディレクトリ
- `attached_assets/` - 画像ファイル格納用

## 起動方法

1. Node.js をインストール
2. 依存関係をインストール:
   ```bash
   npm install
   ```
3. サーバーを起動:
   ```bash
   npm start
   ```
   または
   ```bash
   node index.js
   ```

## 特徴

### 機能
- 70人のガイドプロフィール表示
- 多言語対応（日本語・英語）
- リアルタイムフィルター検索
- レスポンシブデザイン
- ガイド・旅行者登録システム
- スポンサー広告システム

### 技術スタック
- **フロントエンド**: Vanilla JavaScript, Bootstrap 5.3
- **バックエンド**: Node.js, Express
- **デザイン**: Bootstrap CSS, カスタムCSS
- **外部CDN**: Bootstrap, Bootstrap Icons

## 主要機能

1. **ガイド検索・フィルター**
   - キーワード検索
   - 都道府県フィルター
   - 言語フィルター
   - カテゴリーフィルター

2. **登録システム**
   - 旅行者登録
   - ガイド登録
   - 電話番号認証
   - 身分証明書アップロード

3. **言語切り替え**
   - ヘッダーの言語切り替えボタン
   - 動的コンテンツ翻訳
   - 言語設定持続

## 開発メモ

- サーバーはポート5000で起動
- 外部画像はUnsplashを使用
- CDNでBootstrapとアイコンを読み込み
- モバイルファーストのレスポンシブデザイン

## GitHubアップロード準備完了

このフォルダ内のすべてのファイルはGitHubにアップロード可能です。不要なテンポラリファイルや未使用スクリプトは除外済みです。