import re
import sys

def clean_html_tags(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # タグを修正する置換パターン
    patterns = [
        # 余分な<i>タグとその内容を削除
        (r'<i class="bi bi-file-earmark-image me-2"></i> ', ''),
        (r'<i class="bi bi-camera"></i> <i class="bi bi-camera me-2"></i>', '<i class="bi bi-camera me-2"></i>'),
        # スタイル属性の修正
        (r'style="height: 200px;">', 'style="height: 200px;">'),
        (r'style="margin-top: 50px;">', 'style="margin-top: 50px;">'),
        # 成功メッセージの修正
        (r'<i class="bi bi-check-circle"></i> <i class="bi bi-file-earmark-image me-2"></i> アップロード', '<i class="bi bi-check-circle"></i> アップロード')
    ]
    
    for pattern, replacement in patterns:
        content = re.sub(pattern, replacement, content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Cleaned HTML tags in {file_path}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        clean_html_tags(sys.argv[1])
    else:
        print("Please provide a file path")

