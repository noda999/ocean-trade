# 第二批生成图 → 压缩接入（胜利/海盗/画廊扩展/错误页 + 应用图标）
from PIL import Image
import glob, os

SRC = 'generated-images'
PROMO = 'public/promo'

# 场景图：横幅/画廊，转 JPEG
MAPPING = {
    '*一位船长戴着金色王冠*': ('victory', 900),   # VictoryModal 顶部横幅
    '*一艘挂黑帆的海盗船*': ('pirate', 900),      # PirateModal 顶部横幅
    '*陡峭的北欧峡湾港口*': ('ai4', 1280),        # 画廊第 4 屏
    '*丝绸之路的香料集市*': ('ai5', 1280),        # 画廊第 5 屏
    '*小木船搁浅在沙滩上*': ('error', 640),       # 错误页插画
}
for pat, (name, max_w) in MAPPING.items():
    fs = glob.glob(os.path.join(SRC, pat))
    if not fs:
        print('NOT FOUND:', pat)
        continue
    im = Image.open(fs[0]).convert('RGB')
    if im.width > max_w:
        h = round(im.height * max_w / im.width)
        im = im.resize((max_w, h), Image.LANCZOS)
    out = os.path.join(PROMO, name + '.jpg')
    im.save(out, 'JPEG', quality=70, optimize=True)
    print('saved', out, im.size, round(os.path.getsize(out) / 1024), 'KB')

# 应用图标：保持 PNG（需锐利边缘），量化 + 缩到 512
fs = glob.glob(os.path.join(SRC, '*木质帆船扬帆航行*'))
if fs:
    im = Image.open(fs[0])
    if im.width > 512:
        h = round(im.height * 512 / im.width)
        im = im.resize((512, h), Image.LANCZOS)
    q = im.quantize(colors=256, method=2) if im.mode == 'RGBA' else im.quantize(colors=256)
    out = 'public/icon.png'
    q.save(out, optimize=True)
    print('saved', out, im.size, round(os.path.getsize(out) / 1024), 'KB')
