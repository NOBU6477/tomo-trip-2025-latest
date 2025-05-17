#!/bin/bash

# 現在時刻を取得してタイムスタンプを作成
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="multilingual_fixed_${TIMESTAMP}"
BACKUP_DIR="backups/${BACKUP_NAME}"

# バックアップディレクトリを作成
mkdir -p "$BACKUP_DIR"

# 重要なファイルをバックアップ
echo "言語機能とUI修正のバックアップを作成しています: ${BACKUP_NAME}"

# 翻訳関連ファイルのバックアップ
mkdir -p "$BACKUP_DIR/translations"
cp translations/translation-data.js "$BACKUP_DIR/translations/"
cp translations/translator.js "$BACKUP_DIR/translations/"

# HTML/CSSファイルのバックアップ
cp index.html "$BACKUP_DIR/"
cp guide-details.html "$BACKUP_DIR/"
cp login-modal-styles.css "$BACKUP_DIR/"
cp desktop-fixes.css "$BACKUP_DIR/"

# 言語・翻訳関連のJSファイルのバックアップ
cp shared-language-utils.js "$BACKUP_DIR/"
cp dropdown-translator.js "$BACKUP_DIR/"
cp benefits-translator.js "$BACKUP_DIR/"
cp minimal-language.js "$BACKUP_DIR/"
cp json-token-fix.js "$BACKUP_DIR/"
cp direct-benefit-card-translator.js "$BACKUP_DIR/"

# ガイドデータ関連ファイルのバックアップ
cp guide-details-data.js "$BACKUP_DIR/"
cp guide-filter-new.js "$BACKUP_DIR/"
cp guide-tags-display.js "$BACKUP_DIR/"
cp guide-data-storage-api.js "$BACKUP_DIR/"
cp guide-card-extractor.js "$BACKUP_DIR/"

# バックアップタイムスタンプを記録
echo "$BACKUP_NAME" > backup_timestamp.txt

echo "バックアップが完了しました: $BACKUP_DIR"
echo "バックアップはbackups/${BACKUP_NAME}ディレクトリに保存されました"