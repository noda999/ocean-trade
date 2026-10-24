# 第三批生成图 → 压缩接入（六舰 + 三季海图纹理 + 挖宝）
from PIL import Image
import glob, os

SRC = 'generated-images'

def conv(pat, out, max_w, q=70):
    fs = glob.glob(os.path.join(SRC, pat))
    if not fs:
        print('NOT FOUND:', pat)
        return
    im = Image.open(fs[0]).convert('RGB')
    if im.width > max_w:
        h = round(im.height * max_w / im.width)
        im = im.resize((max_w, h), Image.LANCZOS)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    im.save(out, 'JPEG', quality=q, optimize=True)
    print('saved', out, im.size, round(os.path.getsize(out) / 1024), 'KB')

SHIPS = {
    '*单桅小帆船*': 'sloop', '*标准双桅商船*': 'schooner', '*飞剪船*': 'clipper',
    '*大型盖伦商船*': 'galleon', '*皇家盖伦旗舰*': 'royal', '*郑和宝船队旗舰*': 'legend',
}
for pat, name in SHIPS.items():
    conv('游戏船只插画' + pat, f'public/ships/{name}.jpg', 512, 72)

SEASONS = {'春季主题*': 'spring', '夏季主题*': 'summer', '冬季主题*': 'winter'}
for pat, name in SEASONS.items():
    conv('古航海图羊皮纸*' + pat, f'public/seasons/{name}.jpg', 900, 65)

conv('游戏插画*藏宝图旁有一把铁铲*', 'public/promo/dig_treasure.jpg', 900, 70)
conv('游戏插画*古代沉船遗迹*', 'public/promo/dig_relic.jpg', 900, 70)
