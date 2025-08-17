import os, shutil, zipfile, sys
from pathlib import Path

# -------------------------------
# 設定
# -------------------------------
# 探索候補ルート
SEARCH_ROOTS = [
    Path("tomotrip-github-final"),
    Path("public"),
    Path(".")
]

# フロントで"不足の可能性が高い"ファイル群
FRONT_CANDIDATES = [
    # HTML (root)
    ("qr-code-generator.html", "qr-code-generator.html"),

    # CSS
    ("assets/css/icons.css", "assets/css/icons.css"),
    ("assets/css/footer.css", "assets/css/footer.css"),

    # Fonts
    ("assets/fonts/bootstrap-icons.woff2", "assets/fonts/bootstrap-icons.woff2"),
    ("assets/fonts/bootstrap-icons.woff", "assets/fonts/bootstrap-icons.woff"),

    # Images
    ("assets/images/beach-yacht-tourists.jpg", "assets/images/beach-yacht-tourists.jpg"),
    ("assets/images/tomotrip-logo.png", "assets/images/tomotrip-logo.png"),
    ("assets/images/favicon.svg", "assets/images/favicon.svg"),
    ("assets/img/guides/default-1.svg", "assets/img/guides/default-1.svg"),
    ("assets/img/guides/default-2.svg", "assets/img/guides/default-2.svg"),
    ("assets/img/guides/default-3.svg", "assets/img/guides/default-3.svg"),
    ("assets/img/guides/default-4.svg", "assets/img/guides/default-4.svg"),
    ("assets/img/guides/default-5.svg", "assets/img/guides/default-5.svg"),
]

# ESM modules: 既知の代表と "assets/js/*.mjs" 全回収
KNOWN_MJS = [
    "assets/js/app-init.mjs",
    "assets/js/default-guides.mjs",
    "assets/js/event-handlers.mjs",
    "assets/js/guide-renderer.mjs",
    "assets/js/modal.mjs",
    "assets/js/app-state.mjs",
]

# バックエンド・任意セット
BACKEND_CANDIDATES = [
    ("main.py", "main.py"),
    ("run.py", "run.py"),
    ("simple_server.py", "simple_server.py"),
    ("replit.toml", "replit.toml"),
    ("Procfile", "Procfile"),
    ("runtime.txt", "runtime.txt"),
    ("README.md", "README.md"),
    ("replit.md", "replit.md"),
    ("ROADMAP.md", "ROADMAP.md"),
]

OUT_FRONT_DIR = Path("github-delta-frontend")
OUT_BACK_DIR  = Path("github-backend-optional")
OUT_FRONT_ZIP = Path("github-delta-frontend.zip")
OUT_BACK_ZIP  = Path("backend-optional.zip")

for p in (OUT_FRONT_DIR, OUT_BACK_DIR):
    if p.exists():
        shutil.rmtree(p)
    p.mkdir(parents=True, exist_ok=True)

def find_first(path_rel: str) -> Path | None:
    """候補ルートを順番に探し、はじめに見つかった実ファイルの絶対パスを返す"""
    for root in SEARCH_ROOTS:
        candidate = (root / path_rel)
        if candidate.exists():
            return candidate.resolve()
    return None

def copy_keep_rel(src_abs: Path, rel_path: str, dest_root: Path):
    """src_abs を dest_root/rel_path にコピー（親フォルダを作成しつつ）"""
    dest_path = dest_root / rel_path
    dest_path.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src_abs, dest_path)

# 1) FRONT: 個別候補
front_manifest = []
for rel_in, rel_out in FRONT_CANDIDATES:
    found = find_first(rel_in)
    if found:
        copy_keep_rel(found, rel_out, OUT_FRONT_DIR)
        front_manifest.append(rel_out)

# 1') FRONT: assets/js の .mjs を総ざらい（重複回避）
mjs_found = set()
for root in SEARCH_ROOTS:
    js_dir = root / "assets/js"
    if js_dir.exists():
        for p in js_dir.rglob("*.mjs"):
            # 相対（assets/ からのパス）に正規化
            try:
                idx = str(p).replace(str(root)+os.sep, "")
            except Exception:
                idx = str(p)
            # "assets/..." で始まる形に統一
            parts = idx.split("assets"+os.sep)
            rel = "assets/" + parts[1] if len(parts) > 1 else idx
            if rel not in mjs_found:
                copy_keep_rel(p.resolve(), rel, OUT_FRONT_DIR)
                mjs_found.add(rel)

# 2) BACKEND: 任意セット
back_manifest = []
for rel_in, rel_out in BACKEND_CANDIDATES:
    found = find_first(rel_in)
    if found:
        copy_keep_rel(found, rel_out, OUT_BACK_DIR)
        back_manifest.append(rel_out)

def make_zip(zip_path: Path, folder: Path):
    if zip_path.exists():
        zip_path.unlink()
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for file in folder.rglob("*"):
            if file.is_file():
                zf.write(file, file.relative_to(folder))
    size = zip_path.stat().st_size
    return size

size_front = make_zip(OUT_FRONT_ZIP, OUT_FRONT_DIR)
size_back  = make_zip(OUT_BACK_ZIP,  OUT_BACK_DIR)

def print_manifest(title, items):
    print(f"\n=== {title} ({len(items)} files) ===")
    for x in sorted(items):
        print(" -", x)

print_manifest("FRONT collected", front_manifest + sorted(list(mjs_found)))
print(f"\nCreated {OUT_FRONT_ZIP}  ({size_front/1024:.1f} KB)")
print_manifest("BACKEND collected", back_manifest)
print(f"\nCreated {OUT_BACK_ZIP}   ({size_back/1024:.1f} KB)")

print("\n✅ Done. Please download the above two zip files and upload them to GitHub.")