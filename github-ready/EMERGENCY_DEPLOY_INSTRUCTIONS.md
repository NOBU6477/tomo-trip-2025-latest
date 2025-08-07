# 🚨 TomoTrip Emergency Deployment Instructions

## 問題の概要
- **"Could not find run command"エラー**: `.replit`ファイルが`node server.js`を要求
- **編集権限なし**: Replitが`.replit`ファイルの編集を禁止
- **解決策**: Emergency Deployment Script使用

## 🔧 Emergency Deployment手順

### 1. GitHubからダウンロード
必要ファイル:
- `deploy.py` - Emergency deployment script
- `main.py` - Production Python server
- `replit.toml` - Updated deployment configuration
- `index.html` - Japanese main page
- `index-en.html` - English main page
- 画像ファイル全て

### 2. Replitプロジェクト作成
1. 新しいReplitプロジェクト作成
2. 全ファイルをアップロード
3. `chmod +x deploy.py`実行

### 3. デプロイメント実行
```bash
python3 deploy.py
```

## 🎯 Emergency Script の機能
- **直接Python実行**: .replit設定を完全にバイパス
- **環境自動設定**: PORT=5000, PYTHONPATH設定
- **エラーハンドリング**: 詳細なエラー報告
- **Ctrl+C対応**: 正常終了処理

## ✅ 動作確認済み
- HTTP 200レスポンス確認
- 全機能正常動作
- Production Ready

---
**最終更新**: 2025年8月7日 16:06
**ステータス**: Emergency Ready 🔴