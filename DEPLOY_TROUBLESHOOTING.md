# デプロイのトラブルシューティングガイド

このドキュメントでは、Replitでのデプロイ時に発生する可能性のある問題と、その解決方法について説明します。

## Python HTTP サーバーとNode.jsサーバーの競合（重要）

最も一般的な問題は、Python HTTPサーバーとNode.jsサーバーの競合です。これはログで以下のようなエラーメッセージとして表示されます：

```
command finished with error [sh -c python -m http.server 8000]: signal: terminated
a port configuration was specified but the required port was never opened
```

### 解決方法

1. **完全な解決策：直接実行スクリプト**（最も効果的）：
   このプロジェクトには、特別に設計された直接実行スクリプトが含まれています。
   Replitのデプロイ設定で、実行コマンドを必ず以下に設定してください：
   ```
   node deploy_direct.js
   ```
   この方法では、Node.jsが直接サーバーを起動し、起動前にPythonプロセスも自動的に停止するため、競合問題を完全に解消します。
   
2. **代替方法としてシェルスクリプトを使用**：
   上記の方法で解決しない場合は、シェルスクリプトを試してください：
   ```
   ./start-server.sh
   ```
   このスクリプトもPythonコマンドをインターセプトし、競合を防止しますが、1番目の方法ほど確実ではありません。

3. **`.replit` ファイルの確認（可能な場合）**：
   可能であれば、`.replit` ファイルの `[deployment]` セクションを以下のように設定します：
   ```
   [deployment]
   run = ["sh", "-c", "node deploy_direct.js"]
   ```

4. **実行中のプロセスの確認**：
   ```bash
   ps aux | grep python
   ```
   実行して、Pythonサーバーのプロセスが残っていないか確認し、必要に応じて停止します。

5. **ポート設定の確認**：
   `index.js` ファイルでポートが環境変数 `PORT` を使用し、デフォルトが `5000` に設定されていることを確認します。
   ```javascript
   const PORT = process.env.PORT || 5000;
   ```

## 404 エラー（File not found）

ファイルが見つからないというエラーがログに表示される場合：

```
404, message File not found
```

### 解決方法

1. **静的ファイルのパスを確認**：
   `index.js` で静的ファイルのパスが正しく設定されていることを確認します。
   ```javascript
   app.use(express.static(__dirname));
   ```

2. **ルーティングを確認**：
   特に SPA (Single Page Application) の場合、すべてのパスが `index.html` にリダイレクトされるように設定します。
   ```javascript
   app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, 'index.html'));
   });
   ```

## ポートの競合

ポートが既に使用されているというエラーが表示される場合：

```
Error: listen EADDRINUSE: address already in use
```

### 解決方法

1. **実行中のプロセスの確認**：
   ```bash
   lsof -i :5000
   ```
   または
   ```bash
   netstat -tulpn | grep 5000
   ```
   を実行して、ポート5000を使用しているプロセスを確認します。

2. **ワークフローの再起動**：
   ワークフローを停止して再起動します。

## デプロイログの確認

問題が発生した場合は、常にデプロイログを確認して具体的なエラーメッセージを特定することが重要です。

1. Replitダッシュボードのデプロイタブに移動します。
2. 最新のデプロイを選択します。
3. 「Logs」タブをクリックしてデプロイログを表示します。

## 最終手段：バックアップからの復元

問題が解決しない場合は、以前の動作していた状態に戻すことを検討してください：

```bash
bash restore.sh 20250419_195317_nodejs_deployment_ready
```