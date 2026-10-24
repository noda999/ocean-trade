# 批量量化压缩 public/icons/*.png（视觉无损，为 XHS 10MB 包腾空间）
import os
from PIL import Image

SRC = os.path.join(os.path.dirname(__file__), '..', 'public', 'icons')

before = after = 0
for name in sorted(os.listdir(SRC)):
    if not name.lower().endswith('.png'):
        continue
    p = os.path.join(SRC, name)
    im = Image.open(p)
    q = im.quantize(colors=256, method=2) if im.mode == 'RGBA' else im.quantize(colors=256)
    tmp = p + '.tmp.png'
    q.save(tmp, optimize=True)
    before += os.path.getsize(p)
    after += os.path.getsize(tmp)
    os.replace(tmp, p)

print(f'icons: {before/1e6:.2f} MB -> {after/1e6:.2f} MB （释放 {(before-after)/1e6:.2f} MB）')
