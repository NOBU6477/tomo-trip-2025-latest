#!/usr/bin/env python3
import os
import re

def replace_in_file(filepath):
    """ファイル内のvia.placeholder.comをplacehold.coに置換"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # via.placeholder.com を placehold.co に置換
        old_content = content
        content = re.sub(r'via\.placeholder\.com', 'placehold.co', content)
        
        if content != old_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"エラー {filepath}: {e}")
        return False

def main():
    """メイン処理"""
    extensions = ['.js', '.html', '.css']
    exclude_dirs = {'.git', 'node_modules'}
    
    replaced_files = []
    
    # ルートディレクトリから検索
    for root, dirs, files in os.walk('.'):
        # 除外ディレクトリをスキップ
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        
        for file in files:
            # 対象の拡張子のみ処理
            if any(file.endswith(ext) for ext in extensions):
                filepath = os.path.join(root, file)
                if replace_in_file(filepath):
                    replaced_files.append(filepath)
    
    print(f"置換完了: {len(replaced_files)} ファイル")
    for filepath in replaced_files[:10]:  # 最初の10ファイルを表示
        print(f"  - {filepath}")
    
    if len(replaced_files) > 10:
        print(f"  ... さらに {len(replaced_files) - 10} ファイル")

if __name__ == "__main__":
    main()