#!/bin/bash

# バックアップ作成スクリプト
# 現在の状態をバックアップし、いつでも復元できるようにします

# タイムスタンプを取得
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="./backups"
BACKUP_NAME="project_backup_${TIMESTAMP}"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"

# バックアップディレクトリが存在しない場合は作成
if [ ! -d "$BACKUP_DIR" ]; then
  mkdir -p "$BACKUP_DIR"
  echo "バックアップディレクトリを作成しました: $BACKUP_DIR"
fi

# バックアップを作成
echo "バックアップを作成しています..."
echo "タイムスタンプ: $TIMESTAMP"

# node_modules と .git を除外して tar で圧縮
tar --exclude='./node_modules' --exclude='./.git' --exclude='./backups' -czf "$BACKUP_PATH" .

# バックアップが正常に作成されたか確認
if [ $? -eq 0 ]; then
  echo "バックアップが正常に作成されました: $BACKUP_PATH"
  echo "バックアップサイズ: $(du -h $BACKUP_PATH | cut -f1)"
  
  # 最新のバックアップへのシンボリックリンクを作成
  LATEST_LINK="${BACKUP_DIR}/latest_backup.tar.gz"
  if [ -L "$LATEST_LINK" ]; then
    rm "$LATEST_LINK"
  fi
  ln -s "$BACKUP_PATH" "$LATEST_LINK"
  echo "最新バックアップへのリンクを更新しました: $LATEST_LINK"
  
  # タイムスタンプを保存
  echo "$TIMESTAMP" > backup_timestamp.txt
  echo "タイムスタンプを保存しました: backup_timestamp.txt"
  
  # 復元方法の説明
  echo ""
  echo "== バックアップの復元方法 =="
  echo "バックアップを復元するには以下のコマンドを実行してください:"
  echo "  bash restore-backup.sh $BACKUP_NAME"
  echo "または、最新のバックアップを復元するには:"
  echo "  bash restore-backup.sh latest"
else
  echo "エラー: バックアップの作成に失敗しました"
  exit 1
fi

# 復元スクリプトがなければ作成
RESTORE_SCRIPT="restore-backup.sh"
if [ ! -f "$RESTORE_SCRIPT" ]; then
  cat > "$RESTORE_SCRIPT" << 'EOF'
#!/bin/bash

# バックアップ復元スクリプト

if [ $# -eq 0 ]; then
  echo "使用法: bash $0 <バックアップ名 または 'latest'>"
  exit 1
fi

BACKUP_NAME=$1
BACKUP_DIR="./backups"

if [ "$BACKUP_NAME" = "latest" ]; then
  BACKUP_PATH="${BACKUP_DIR}/latest_backup.tar.gz"
else
  BACKUP_PATH="${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
fi

if [ ! -f "$BACKUP_PATH" ]; then
  echo "エラー: バックアップファイルが見つかりません: $BACKUP_PATH"
  echo "利用可能なバックアップ:"
  ls -1 ${BACKUP_DIR}/*.tar.gz 2>/dev/null | sed 's|.*/||' | sed 's|\.tar\.gz$||'
  exit 1
fi

echo "バックアップを復元しています: $BACKUP_PATH"

# 復元前の確認
read -p "現在のファイルは上書きされます。続行しますか？ (y/n): " confirm
if [ "$confirm" != "y" ]; then
  echo "復元をキャンセルしました"
  exit 0
fi

# 現在のディレクトリ内の一時ファイルを除いて全て削除
find . -maxdepth 1 -not -name "backups" -not -name "." -not -name ".." -not -name "*.sh" -exec rm -rf {} \;

# バックアップから復元
tar -xzf "$BACKUP_PATH"

echo "復元が完了しました"
echo "サーバーを再起動してください"
EOF

  chmod +x "$RESTORE_SCRIPT"
  echo ""
  echo "復元スクリプトを作成しました: $RESTORE_SCRIPT"
fi

echo ""
echo "バックアップ処理が完了しました！"