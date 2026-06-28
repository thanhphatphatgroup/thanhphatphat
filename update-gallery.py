from pathlib import Path
import json
import re
from datetime import datetime

# ==========================================
# CẤU HÌNH
# ==========================================

ROOT = Path("images/products")

IMAGE_EXTS = {
    ".webp",
    ".png",
    ".jpg",
    ".jpeg"
}


# ==========================================
# SẮP XẾP TÊN FILE
# ==========================================

def natural_sort(name):

    return [
        int(text) if text.isdigit() else text.lower()
        for text in re.split(r'(\d+)', name)
    ]


# ==========================================
# KIỂM TRA THIẾU SỐ
# ==========================================

def check_missing(files):

    numbers = []

    for file in files:

        match = re.search(r'(\d+)(?=\.[^.]+$)', file)

        if match:
            numbers.append(int(match.group(1)))

    if not numbers:
        return []

    numbers.sort()

    missing = []

    for i in range(numbers[0], numbers[-1]):

        if i not in numbers:
            missing.append(i)

    return missing


# ==========================================
# MAIN
# ==========================================

print("=" * 60)
print("      UPDATE GALLERY")
print("=" * 60)

total_images = 0

for folder in sorted(ROOT.iterdir()):

    if not folder.is_dir():
        continue

    images = []

    for file in folder.iterdir():

        if file.suffix.lower() in IMAGE_EXTS:

            images.append(file.name)

    images.sort(key=natural_sort)

    gallery = {

        "count": len(images),

        "updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),

        "images": images

    }

    with open(folder / "gallery.json", "w", encoding="utf8") as f:

        json.dump(
            gallery,
            f,
            ensure_ascii=False,
            indent=4
        )

    total_images += len(images)

    print(f"✓ {folder.name:<20} {len(images):>4} ảnh")

    missing = check_missing(images)

    if missing:

        print("   ⚠ Thiếu:", ", ".join(map(str, missing)))

print("=" * 60)

print(f"TỔNG CỘNG: {total_images} ảnh")

print("=" * 60)

print("Hoàn thành.")