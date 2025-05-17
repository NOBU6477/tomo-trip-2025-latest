#!/bin/bash

# 指定されたバックアップから復元するスクリプト
BACKUP_NAME=$1

if [ -z "$BACKUP_NAME" ]; then
  echo "エラー: バックアップ名が指定されていません。"
  echo "使用方法: bash restore.sh <バックアップ名>"
  echo ""
  echo "利用可能なバックアップ:"
  ls -l backups/ | grep -v total | awk '{print "- " $9}'
  exit 1
fi

BACKUP_DIR="backups/${BACKUP_NAME}"

if [ ! -d "$BACKUP_DIR" ]; then
  echo "エラー: 指定されたバックアップフォルダが存在しません: ${BACKUP_DIR}"
  echo "利用可能なバックアップ:"
  ls -l backups/ | grep -v total | awk '{print "- " $9}'
  exit 1
fi

echo "バックアップ ${BACKUP_NAME} から復元しています..."

# 現在のファイルを一時フォルダに複製
mkdir -p .tmp_current_files
cp -r *.html *.js *.css *.png *.jpg *.jpeg *.gif .tmp_current_files/ 2>/dev/null || :

# 特定の設定ファイルも保存
if [ -f "package.json" ]; then
  cp package.json .tmp_current_files/
fi

if [ -f "package-lock.json" ]; then
  cp package-lock.json .tmp_current_files/
fi

# バックアップからファイルを復元
echo "ウェブページのファイルを復元中..."
cp -r "${BACKUP_DIR}"/*.html "${BACKUP_DIR}"/*.js "${BACKUP_DIR}"/*.css "${BACKUP_DIR}"/*.png "${BACKUP_DIR}"/*.jpg "${BACKUP_DIR}"/*.jpeg "${BACKUP_DIR}"/*.gif ./ 2>/dev/null || :

# Node.js関連ファイルも復元
if [ -f "${BACKUP_DIR}/package.json" ]; then
  echo "Node.js設定ファイルを復元中..."
  cp "${BACKUP_DIR}/package.json" ./
fi

if [ -f "${BACKUP_DIR}/package-lock.json" ]; then
  cp "${BACKUP_DIR}/package-lock.json" ./
fi

# ワークフロー設定の復元
if [ -d "${BACKUP_DIR}/workflow-configs" ] && [ -d "workflow-configs" ]; then
  echo "ワークフロー設定を復元中..."
  cp -r "${BACKUP_DIR}/workflow-configs"/* ./workflow-configs/ 2>/dev/null || :
fi

echo "復元が完了しました。"
echo "復元したバージョン情報:"
cat "${BACKUP_DIR}/version_info.txt"

# Node.jsが含まれているかどうかを確認
if grep -q "Node.js" "${BACKUP_DIR}/version_info.txt"; then
  echo ""
  echo "このバックアップはNode.js設定を含んでいます。"
  echo "必要に応じてサーバーを再起動してください: workflow restart 'Node.js Server'"
fi

echo ""
echo "注意: 作業中のファイルは .tmp_current_files/ に保存されています。"
echo "必要に応じて確認してください。"