#!/bin/bash

# 最新のバックアップからの復元スクリプト
BACKUP_NAME=$(cat backup_timestamp.txt)
BACKUP_PATH="backups/${BACKUP_NAME}"

if [ ! -d "${BACKUP_PATH}" ]; then
  echo "エラー: バックアップフォルダが見つかりません: ${BACKUP_PATH}"
  exit 1
fi

echo "バックアップ ${BACKUP_NAME} から復元しています..."

# HTMLファイルの復元
echo "HTMLファイルを復元しています..."
cp "${BACKUP_PATH}"/*.html ./ 2>/dev/null || echo "HTMLファイルはバックアップにありません"

# JSファイルの復元
echo "JSファイルを復元しています..."
cp "${BACKUP_PATH}"/guide-data-storage-api.js ./ 2>/dev/null || echo "guide-data-storage-api.js はバックアップにありません"
cp "${BACKUP_PATH}"/guide-card-extractor.js ./ 2>/dev/null || echo "guide-card-extractor.js はバックアップにありません"
cp "${BACKUP_PATH}"/guide-data-api-debug.js ./ 2>/dev/null || echo "guide-data-api-debug.js はバックアップにありません"
cp "${BACKUP_PATH}"/guide-data-final-fix.js ./ 2>/dev/null || echo "guide-data-final-fix.js はバックアップにありません"
cp "${BACKUP_PATH}"/tour-plan-injector.js ./ 2>/dev/null || echo "tour-plan-injector.js はバックアップにありません"
cp "${BACKUP_PATH}"/initialize-guide-data.js ./ 2>/dev/null || echo "initialize-guide-data.js はバックアップにありません"

# CSSファイルの復元
echo "CSSファイルを復元しています..."
cp "${BACKUP_PATH}"/*.css ./ 2>/dev/null || echo "CSSファイルはバックアップにありません"

echo "復元が完了しました！"
echo "復元されたバックアップ: ${BACKUP_NAME}"
echo "復元後のファイル一覧:"
ls -la *.html guide-*.js tour-*.js initialize-*.js
