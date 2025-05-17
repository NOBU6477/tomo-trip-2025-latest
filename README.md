# ローカルガイドアプリケーション

## アプリケーション概要
多言語対応の国際的な観光ガイドマッチングプラットフォームです。

## 特徴
- 多言語対応（日本語・英語）
- レスポンシブデザイン（PC・モバイル対応）
- ガイド検索・予約機能
- 国際的な身分証明書検証システム

## 開発・実行方法
このアプリケーションはNode.jsで実行されます。

### 標準の起動方法
```
node index.js
```

### 競合解決用の起動方法（推奨）
より信頼性の高い起動スクリプトを使用できます：
```
./start-server.sh
```
この方法は、Pythonサーバーとの競合を自動的に解決します。

サーバーはポート5000で実行されます。

## デプロイ情報
- サーバー: Node.js + Express 4.18.2
- ポート: 5000（重要: Replitは5000ポートのみ公開します）
- 実行コマンド: `./start-server.sh`（推奨）

詳細なデプロイ手順は [DEPLOY_INSTRUCTIONS.md](./DEPLOY_INSTRUCTIONS.md) を参照してください。
デプロイ時の問題解決には [DEPLOY_TROUBLESHOOTING.md](./DEPLOY_TROUBLESHOOTING.md) が役立ちます。

### 重要な注意点
- Pythonサーバー (`python -m http.server`) との競合が発生する場合があります
- Replit環境では推奨実行コマンド `./start-server.sh` を使用することで競合を自動的に解決できます

## 復元方法
バックアップからの復元には以下のコマンドを使用します：
```
bash restore.sh 20250419_195317_nodejs_deployment_ready
```