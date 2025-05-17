#!/bin/bash

# Python HTTPサーバー競合を防止するためのインターセプター設定スクリプト

# ディレクトリが存在しない場合は作成
mkdir -p bin

# Python-interceptor.shに実行権限を付与
chmod +x bin/python-interceptor.sh

# binディレクトリ内にPythonへのシンボリックリンクを作成
ln -sf python-interceptor.sh bin/python
ln -sf python-interceptor.sh bin/python3

echo "Pythonインターセプターの設定が完了しました"
echo "PATHに'./bin'が含まれていることを確認してください"

# binディレクトリを優先させるために、.bashrcを調整（必要であれば）
if [ -f ~/.bashrc ]; then
  # .bashrcに既にPATH設定があるか確認
  if grep -q 'export PATH="$HOME/bin:$PATH"' ~/.bashrc; then
    echo "PATH設定は既に.bashrcに存在します"
  else
    # PATHの先頭にbinディレクトリを追加
    echo 'export PATH="./bin:$PATH"' >> ~/.bashrc
    echo "PATH設定を.bashrcに追加しました"
  fi
fi

# 新しいpath環境変数を表示
echo "現在のPATH: $PATH"
export PATH="./bin:$PATH"
echo "更新後のPATH: $PATH"

# システム情報を表示
echo "システム情報:"
uname -a
echo "Pythonへのリンク:"
ls -la bin/python*