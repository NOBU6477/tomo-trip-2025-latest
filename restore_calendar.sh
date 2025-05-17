#!/bin/bash

# スケジュールカレンダーバックアップを復元するスクリプト

# 最新のバックアップディレクトリへのパスを取得
BACKUP_DIR="backups/latest_calendar_backup"

# バックアップが存在するか確認
if [ ! -d "$BACKUP_DIR" ]; then
  echo "エラー: バックアップディレクトリが見つかりません: $BACKUP_DIR"
  exit 1
fi

echo "スケジュールカレンダー機能を復元します..."
echo "バックアップ元: $BACKUP_DIR"

# ファイルのバックアップを作成
echo "現在のファイルのバックアップを作成しています..."
TEMP_DIR="temp_backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$TEMP_DIR"
cp guide-profile.html "$TEMP_DIR/" 2>/dev/null || true
cp schedule-styles.css "$TEMP_DIR/" 2>/dev/null || true
cp calendar-debug.js "$TEMP_DIR/" 2>/dev/null || true
echo "現在のファイルを $TEMP_DIR に保存しました"

# ファイルを復元
echo "カレンダー機能ファイルを復元しています..."
cp "$BACKUP_DIR/guide-profile.html" ./ 2>/dev/null && echo "- guide-profile.html を復元しました" || echo "- guide-profile.html の復元に失敗しました"
cp "$BACKUP_DIR/schedule-styles.css" ./ 2>/dev/null && echo "- schedule-styles.css を復元しました" || echo "- schedule-styles.css の復元に失敗しました"
cp "$BACKUP_DIR/calendar-debug.js" ./ 2>/dev/null && echo "- calendar-debug.js を復元しました" || echo "- calendar-debug.js の復元に失敗しました"

echo "復元が完了しました"
echo "----------------"
echo "問題が発生した場合は $TEMP_DIR ディレクトリから元のファイルを復元できます"
echo "復元を確認するには、ブラウザでスケジュールページをリロードしてください"