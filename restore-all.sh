#!/bin/bash

# 全プロジェクトスナップショットを復元するスクリプト

# 最新のバックアップディレクトリへのパスを取得
BACKUP_DIR="backups/latest_calendar_backup"

# バックアップが存在するか確認
if [ ! -d "$BACKUP_DIR" ]; then
  echo "エラー: バックアップディレクトリが見つかりません: $BACKUP_DIR"
  exit 1
fi

if [ ! -d "$BACKUP_DIR/project_snapshot" ]; then
  echo "エラー: プロジェクトスナップショットが見つかりません: $BACKUP_DIR/project_snapshot"
  exit 1
fi

echo "プロジェクト全体を復元します..."
echo "バックアップ元: $BACKUP_DIR/project_snapshot"

# 確認を求める
read -p "現在のプロジェクトファイルが上書きされます。続行しますか？ (y/n): " confirm
if [ "$confirm" != "y" ]; then
  echo "復元をキャンセルしました"
  exit 0
fi

# 全体のバックアップを作成
echo "現在のプロジェクトのバックアップを作成しています..."
TEMP_DIR="temp_project_backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$TEMP_DIR"
cp -r *.html *.js *.css "$TEMP_DIR/" 2>/dev/null || true
echo "現在のプロジェクトファイルを $TEMP_DIR に保存しました"

# 全ファイルを復元
echo "プロジェクトスナップショットからファイルを復元しています..."
cp -r $BACKUP_DIR/project_snapshot/* ./

echo "復元が完了しました"
echo "----------------"
echo "問題が発生した場合は $TEMP_DIR ディレクトリから元のファイルを復元できます"
echo "復元を確認するには、ブラウザでページをリロードしてください"