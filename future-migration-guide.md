# Node.jsサーバーへの移行ガイド

## 概要

このプロジェクトは将来的に完全なNode.js/Express APIサーバーに移行することを計画しています。このガイドでは、静的HTTPサーバーからNode.jsサーバーへの移行手順を説明します。

## 移行手順

### 1. ワークフロー設定の変更

Pythonの静的HTTPサーバーから、Node.jsサーバーに切り替えるには：

```
現在のワークフロー: python3 -m http.server 5000 --bind 0.0.0.0
新しいワークフロー: node server-future.js
```

### 2. 必要な依存関係の確認

以下の依存関係が必要です：

- express@4.x (5.xではなく4.xを推奨)
- cors
- dotenv

### 3. サーバーファイルの有効化

`server-future.js`をメインサーバーファイルとして使用します。このファイルは既に作成済みで、Express 4.xベースの安定したサーバー実装を提供します。

### 4. APIエンドポイントの実装

サーバーファイル内のコメントに従って、必要なAPIエンドポイントを実装してください。例：

```javascript
// ユーザー認証API
app.post('/api/login', ...);
app.post('/api/register', ...);

// ガイドデータAPI
app.get('/api/guides', ...);
app.get('/api/guides/:id', ...);
```

### 5. データベース連携の設定

データベースを使用する場合：

1. PostgreSQLデータベースの接続情報を`.env`ファイルに設定
2. DrizzleのORMを使用したデータベース操作を実装

## デプロイ手順

Node.jsサーバーへの移行後のデプロイ手順：

1. Replitダッシュボードから「Deploy」ボタンをクリック
2. 環境変数が正しく設定されていることを確認
3. デプロイが完了すると、`<your-repl-name>.replit.app`のURLでアクセス可能になります

## トラブルシューティング

移行中に問題が発生した場合：

1. サーバーが正しく起動しているか確認（ログを確認）
2. ポート5000が使用されているか確認
3. 必要な依存関係がすべてインストールされているか確認

必要に応じて元の静的サーバー設定に戻すこともできます。

## 参考リンク

- Express.js ドキュメント: https://expressjs.com/
- Drizzle ORM ドキュメント: https://orm.drizzle.team/
- Node.js ベストプラクティス: https://github.com/goldbergyoni/nodebestpractices