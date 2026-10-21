# 将 dist-taptap 打成 TapTap H5 包体：
# - zip 根只允许一个文件夹，且文件夹内含入口 index.html（TapTap 包体管理要求）
# - 用正斜杠归档路径，避免 Windows 反斜杠导致的解压兼容问题
# 用法：npm run build:taptap && python scripts/pack-taptap.py
import os
import re
import zipfile

SRC = 'dist-taptap'
OUT = 'ocean-trade-taptap.zip'
FOLDER = 'ocean-trade'  # zip 内唯一的顶层文件夹名


def main() -> None:
    if not os.path.isdir(SRC):
        raise SystemExit(f'缺少 {SRC}/，请先运行 npm run build:taptap')
    if os.path.exists(OUT):
        os.remove(OUT)

    with zipfile.ZipFile(OUT, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for root, _dirs, files in os.walk(SRC):
            for name in files:
                path = os.path.join(root, name)
                arc = f'{FOLDER}/' + os.path.relpath(path, SRC).replace(os.sep, '/')
                z.write(path, arc)

    with zipfile.ZipFile(OUT) as z:
        names = z.namelist()
        html = z.read(f'{FOLDER}/index.html').decode('utf-8')

    size_mb = os.path.getsize(OUT) / 1e6
    roots = sorted({n.split('/')[0] for n in names})
    scripts = re.findall(r'src="([^"]+\.js)"', html)
    css = re.findall(r'href="([^"]+\.css)"', html)

    print(f'zip: {OUT}  {size_mb:.2f} MB  entries={len(names)}')
    print('顶层条目（应只有 ' + FOLDER + '）:', roots)
    print(f'入口 {FOLDER}/index.html 存在:', f'{FOLDER}/index.html' in names)
    print('JS 引用:', scripts)
    print('CSS 引用:', css)
    print('绝对路径残留（应 []）:', re.findall(r'(?:src|href)="/[^/]', html))
    print('含音频 audio/bgm.mp3:', f'{FOLDER}/audio/bgm.mp3' in names)

    # JS 产物内的资源引用抽查（必须全部相对，子路径下才不会 404）
    js_names = [n for n in names if re.match(rf'{FOLDER}/assets/.+\.js$', n)]
    if js_names:
        with zipfile.ZipFile(OUT) as zz:
            js = ''.join(zz.read(n).decode('utf-8', errors='ignore') for n in js_names)
        print('JS 音频相对引用 ./audio/bgm:', './audio/bgm' in js)
        print('JS 图标相对引用 ./icons/:', './icons/' in js)
        bad = [tok for tok in ('"/audio/', '"/icons/', "'/audio/", "'/icons/") if tok in js]
        print('JS 绝对引用残留（应 []）:', bad)
    else:
        print('警告：未在 zip 中找到 JS chunk')

    assert roots == [FOLDER], 'zip 顶层必须只有一个文件夹'
    assert not re.findall(r'(?:src|href)="/[^/]', html), '存在绝对路径引用（会导致子路径 404）'


if __name__ == '__main__':
    main()
