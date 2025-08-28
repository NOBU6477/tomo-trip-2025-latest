# 🚀 Replit セットアップガイド - TomoTrip システム

## 📋 Replit環境構築手順

### 1. 基本設定確認

**実行ファイル**: `server.js`（既に設定済み）
**ポート**: `process.env.PORT || 5000`（Replit自動割り当て対応済み）

### 2. .replit設定（完了済み）

```toml
run = "node server.js"
modules = ["nodejs-20", "postgresql-16"]

[interpreter]
language = "nodejs"

[workflows]
runButton = "Project"

[[workflows.workflow]]
name = "TomoTripAPIServer"
author = "agent"

[[workflows.workflow.tasks]]
task = "shell.exec"
args = "node server.js"
waitForPort = 5000

[workflows.workflow.metadata]
outputType = "webview"
```

### 3. package.json（更新済み）

```json
{
  "name": "tomotrip-tourism-guide-platform",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "dependencies": {
    "express": "^4.19.2",
    "cors": "^2.8.5"
  },
  "engines": {
    "node": ">=20"
  }
}
```

### 4. 🔑 必要な環境変数（Secrets設定）

Replitの「Secrets」タブで以下を設定：

```bash
# データベース設定（Replit PostgreSQLを使用する場合）
DATABASE_URL=postgres://user:password@host:5432/database

# セッション暗号化キー（64文字のランダム文字列）
SESSION_SECRET=your_random_64_character_secret_key_here_make_it_secure

# 実行環境
NODE_ENV=development

# ポート（Replitが自動設定するので通常不要）
PORT=5000
```

### 5. 🗄️ PostgreSQL設定（オプション）

**現在のシステム**: メモリ内データストレージ（即座に動作）
**将来の拡張**: PostgreSQL接続の場合は以下を追加

```bash
# Replitデータベースを有効化した場合
npm install pg
# または
npm install @neondatabase/serverless drizzle-orm
```

### 6. 🔧 動作確認エンドポイント（実装済み）

- **ヘルスチェック**: `GET /health`
- **API情報**: `GET /api`
- **店舗管理**: `GET /api/sponsor-stores`

### 7. ▶️ 起動手順

1. **Runボタンをクリック**
2. **自動的にserver.jsが実行される**
3. **Webviewでアプリケーションが表示される**

### 8. 📊 ログ確認

正常起動時のコンソール出力：
```
🚀 TomoTrip Server running on port 5000
📊 Data stored in memory - stores: 0, guides: 0, reservations: 0
🔍 Health check: http://localhost:5000/health
📖 API info: http://localhost:5000/api
```

## 🎯 システム機能

### ✅ 現在動作中の機能

1. **協賛店登録・管理システム**
   - 新規店舗登録: POST /api/sponsor-stores
   - 店舗一覧取得: GET /api/sponsor-stores
   - 個別店舗情報: GET /api/sponsor-stores/:id
   - 店舗情報更新: PUT /api/sponsor-stores/:id

2. **観光ガイドシステム**
   - ガイド登録: POST /api/tourism-guides
   - 店舗別ガイド取得: GET /api/tourism-guides/store/:storeId

3. **予約管理システム**
   - 予約作成: POST /api/reservations
   - 店舗別予約取得: GET /api/reservations/store/:storeId

4. **フロントエンド**
   - 日本語・英語対応サイト
   - 店舗登録フォーム
   - 個別店舗管理画面
   - 協賛店一覧ページ

## 🔍 トラブルシューティング

### よくある問題

1. **ポートエラー**
   - Replit は自動的にPORTを設定するので通常問題なし
   - `process.env.PORT || 5000`を使用済み

2. **データが保存されない**
   - 現在はメモリ内ストレージ（Replit再起動でリセット）
   - 永続化が必要な場合はPostgreSQL設定を追加

3. **モジュールエラー**
   - `npm install`は自動実行されます
   - 手動実行: Shell タブで`npm install`

### 確認コマンド

```bash
# ヘルスチェック
curl https://your-repl-url.replit.dev/health

# API確認
curl https://your-repl-url.replit.dev/api
```

## 📈 パフォーマンス最適化

### Replit向け最適化（実装済み）

- ✅ Express.js軽量設定
- ✅ CORS設定済み
- ✅ 静的ファイル配信最適化
- ✅ メモリ効率化データ構造
- ✅ レスポンスタイム最適化

### スケーリング時の考慮事項

- データベース移行（PostgreSQL/MongoDB）
- セッションストレージ外部化
- CDN導入（静的リソース）
- ロードバランサー対応

## 🎉 完了状態

**✅ Replit環境完全対応済み**

- サーバー設定完了
- 環境変数対応
- ヘルスチェック実装
- エラーハンドリング
- ログ出力最適化
- ポート自動設定

**次のステップ**: Runボタンクリックで即座に稼働開始！