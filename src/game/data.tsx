// ─────────────────────────────────────────────────────────────────────────────
//  远洋贸易 · 静态配置数据
// ─────────────────────────────────────────────────────────────────────────────

// v1.5.0：图标字段统一引用矢量图标名（见 components/Glyph.tsx），全站告别 emoji
import type { GlyphName } from '../components/Glyph'

export interface Good {
  id: string
  name: string
  icon: GlyphName
  base: number
}

/** 共 83 种可交易货物，base 为全球基准价；每种只在部分港口流通 */
export const GOODS: Good[] = [
  { id: 'silk', name: '丝绸', icon: 'silk', base: 280 },
  { id: 'porcelain', name: '瓷器', icon: 'porcelain', base: 200 },
  { id: 'tea', name: '茶叶', icon: 'tea', base: 60 },
  { id: 'spice', name: '香料', icon: 'spice', base: 120 },
  { id: 'cotton', name: '棉花', icon: 'cotton', base: 45 },
  { id: 'pearl', name: '珍珠', icon: 'pearl', base: 350 },
  { id: 'gold', name: '黄金', icon: 'gold', base: 520 },
  { id: 'clove', name: '丁香', icon: 'clove', base: 160 },
  { id: 'timber', name: '木材', icon: 'timber', base: 80 },
  { id: 'coffee', name: '咖啡', icon: 'coffee', base: 110 },
  { id: 'fur', name: '皮草', icon: 'fur', base: 260 },
  { id: 'wool', name: '羊毛', icon: 'wool', base: 55 },
  { id: 'whisky', name: '威士忌', icon: 'whisky', base: 170 },
  { id: 'wine', name: '葡萄酒', icon: 'wine', base: 140 },
  { id: 'perfume', name: '香水', icon: 'perfume', base: 240 },
  { id: 'grain', name: '谷物', icon: 'grain', base: 42 },
  { id: 'carpet', name: '波斯地毯', icon: 'carpet', base: 210 },
  { id: 'rose', name: '玫瑰油', icon: 'rose', base: 190 },
  { id: 'gem', name: '宝石', icon: 'gem', base: 620 },
  { id: 'sword', name: '东洋刀', icon: 'sword', base: 300 },
  { id: 'silver', name: '白银', icon: 'silver', base: 420 },
  { id: 'cacao', name: '可可', icon: 'cacao', base: 95 },
  // ── v1.3.0 新增 7 种商品 ──
  { id: 'cheese', name: '奶酪', icon: 'cheese', base: 50 },
  { id: 'watch', name: '钟表', icon: 'watch', base: 480 },
  { id: 'nest', name: '燕窝', icon: 'nest', base: 280 },
  { id: 'vanilla', name: '香草', icon: 'vanilla', base: 220 },
  { id: 'frankincense', name: '乳香', icon: 'frankincense', base: 320 },
  { id: 'olive', name: '橄榄油', icon: 'olive', base: 75 },
  { id: 'tobacco', name: '烟草', icon: 'tobacco', base: 130 },
  // ── v1.2.0 新增 20 种商品（每城特产扩充） ──
  { id: 'amber', name: '琥珀', icon: 'amber', base: 260 },
  { id: 'truffle', name: '松露', icon: 'truffle', base: 350 },
  { id: 'honey', name: '蜂蜜', icon: 'honey', base: 85 },
  { id: 'saffron', name: '藏红花', icon: 'saffron', base: 380 },
  { id: 'caviar', name: '鱼子酱', icon: 'caviar', base: 400 },
  { id: 'date', name: '椰枣', icon: 'date', base: 70 },
  { id: 'indigo', name: '靛蓝', icon: 'indigo', base: 150 },
  { id: 'cinnamon', name: '肉桂', icon: 'cinnamon', base: 170 },
  { id: 'paper', name: '宣纸', icon: 'paper', base: 130 },
  { id: 'lacquer', name: '漆器', icon: 'lacquer', base: 310 },
  { id: 'nutmeg', name: '肉豆蔻', icon: 'nutmeg', base: 180 },
  { id: 'sugar', name: '蔗糖', icon: 'sugar', base: 75 },
  { id: 'diamond', name: '钻石', icon: 'diamond', base: 750 },
  { id: 'leather', name: '皮革', icon: 'leather', base: 100 },
  { id: 'alpaca', name: '羊驼毛', icon: 'alpaca', base: 180 },
  { id: 'salt', name: '海盐', icon: 'salt', base: 55 },
  { id: 'tulip', name: '郁金香', icon: 'tulip', base: 160 },
  { id: 'copper', name: '黄铜', icon: 'copper', base: 300 },
  { id: 'seashell', name: '珍珠母', icon: 'seashell', base: 90 },
  { id: 'rum', name: '朗姆酒', icon: 'rum', base: 120 },
  // ── v1.4.0 隐藏特产（21 城 · 投资 1 级「商会伙伴」解锁）+ 秘藏珍宝 ──
  { id: 'rune', name: '符文石碑', icon: 'rune', base: 320 },
  { id: 'longbow', name: '英格兰长弓', icon: 'longbow', base: 300 },
  { id: 'tapestry', name: '哥特壁毯', icon: 'tapestry', base: 340 },
  { id: 'papyrus', name: '纸莎草卷', icon: 'papyrus', base: 280 },
  { id: 'miniature', name: '波斯细密画', icon: 'miniature', base: 360 },
  { id: 'scimitar', name: '大马士革弯刀', icon: 'scimitar', base: 340 },
  { id: 'sitar', name: '西塔琴', icon: 'sitar', base: 300 },
  { id: 'sapphire', name: '锡兰蓝宝石', icon: 'sapphire', base: 640 },
  { id: 'jade', name: '和田玉雕', icon: 'jade', base: 560 },
  { id: 'armor', name: '武士铠甲', icon: 'armor', base: 480 },
  { id: 'agarwood', name: '沉香木', icon: 'agarwood', base: 520 },
  { id: 'batik', name: '巴迪克蜡染', icon: 'batik', base: 300 },
  { id: 'mask', name: '部落黄金面具', icon: 'mask', base: 420 },
  { id: 'obsidian', name: '黑曜石镜', icon: 'obsidian', base: 400 },
  { id: 'sundisc', name: '太阳金盘', icon: 'sundisc', base: 680 },
  { id: 'guitar', name: '西班牙吉他', icon: 'guitar', base: 300 },
  { id: 'delft', name: '代尔夫特蓝陶', icon: 'delft', base: 340 },
  { id: 'incenseburner', name: '阿拉伯香炉', icon: 'incenseburner', base: 360 },
  { id: 'ambergris', name: '龙涎香', icon: 'ambergris', base: 600 },
  { id: 'elephantegg', name: '象鸟蛋', icon: 'elephantegg', base: 500 },
  { id: 'emerald', name: '哥伦比亚祖母绿', icon: 'emerald', base: 700 },
  // 深海秘藏奖励品：无产地，只能靠挖掘获得，各名港高价求购
  { id: 'relic', name: '沉没神殿珍宝', icon: 'relic', base: 1_800 },
  // ── v1.5.0 新增通用货物（城市进出口经下方 EXTRA_TRADE 批量注入）──
  { id: 'book', name: '古籍善本', icon: 'book', base: 300 },
  { id: 'fleur', name: '鸢尾花饰', icon: 'fleur', base: 190 },
  { id: 'scroll', name: '航海图卷', icon: 'scroll', base: 260 },
  // ── v1.5.0 暹罗 / 意大利专属特产 ──
  { id: 'jasmine', name: '茉莉香米', icon: 'jasmine', base: 240 },
  { id: 'murano', name: '威尼斯玻璃', icon: 'murano', base: 360 },
  // ── 16 世纪改名与「每城≥3 独有特产」补缺：下列货物仅单一港口出产 ──
  { id: 'kris', name: '克力士剑', icon: 'kris', base: 320 },
  { id: 'tumi', name: '印加金刀', icon: 'tumi', base: 340 },
  { id: 'pineapple', name: '菠萝', icon: 'pineapple', base: 90 },
  { id: 'teak', name: '柚木', icon: 'teak', base: 130 },
  { id: 'betel', name: '槟榔', icon: 'betel', base: 70 },
  { id: 'violin', name: '小提琴', icon: 'violin', base: 300 },
  { id: 'marble', name: '大理石', icon: 'marble', base: 150 },
]

/** 特色货物背景描述（图鉴卡片点击展开时显示）；普通货物留空 */
export const GOOD_DESC: Record<string, string> = {
  // ── 7 件新货（v1.5.0） ──
  kris: '马来群岛的波浪刃短剑，刃纹如蛇，是身份与守护的象征。',
  tumi: '印加祭司的黄金半圆刃祭刀，顶端立雕神明，用于祭祀与权柄。',
  pineapple: '新大陆的金色珍果，冠芽如凤尾，曾是欧洲宫廷眼中的奢侈品。',
  teak: '南洋热带硬木，耐腐防蛀，造船与宫殿的首选良材。',
  betel: '东南亚待客佳品，蒌叶裹果同嚼，驱瘴提神，代代相沿。',
  violin: '亚平宁匠人手工琴，云杉面板枫木背板，音色如歌。',
  marble: '意大利开采的雪白石材，纹理如山水，雕饰宫殿与造像。',
  // ── 23 件隐藏特产（每城独家） ──
  rune: '维京先祖刻下的神秘石碑，符文诉说着神话与咒语。',
  longbow: '打垮骑士的紫杉长弓，百年战争中的决胜之矢。',
  tapestry: '挂毯上的圣经与史诗，哥特织机织就的流动壁画。',
  papyrus: '尼罗河沼泽的莎草纸卷，承载古老的咒文与智慧。',
  miniature: '细如毫发的波斯工笔画，金箔铺底，讲尽王宫秘事。',
  scimitar: '大马士革花纹钢弯刀，月光般的刃纹削铁如泥。',
  sitar: '北印度拨弦长颈琴，共鸣弦缭绕，吟唱拉格之情。',
  sapphire: '锡兰河床的矢车菊蓝宝石，深蓝如印度洋之夜。',
  jade: '昆仑和田美玉，温润含蓄，君子比德于玉。',
  armor: '赤备武士的精致胴甲，漆金缀革，忠勇之姿。',
  agarwood: '马来雨林结油的沉香，焚之香气沉静，价比黄金。',
  batik: '爪哇匠人以蜡防染的繁花布，蓝靛与赭红交织。',
  mask: '部落祭祀的木雕面具，狰狞纹样连通祖灵与神祇。',
  obsidian: '中美洲火山玻璃，锋利如刃，雕成匕首与神像。',
  sundisc: '印加太阳神因蒂的金盘，祭祀圣器，光芒灼灼。',
  guitar: '安达卢西亚的六弦吉他，弗拉明戈的火热心跳。',
  delft: '荷兰代尔夫特仿青花锡釉陶，白底蓝纹如瓷。',
  incenseburner: '阿曼黄铜镂空香炉，焚乳香以敬神，烟篆袅袅。',
  ambergris: '抹香鲸肠中结块的灰琥珀，定香之王，千金难求。',
  elephantegg: '马达加斯加巨鸟的化石蛋，盈尺之高，博物奇珍。',
  emerald: '安第斯矿脉的祖母绿，翠色欲滴，绿宝石之王。',
  jasmine: '暹罗茉莉香米，炊时满室清香，米中上品。',
  murano: '穆拉诺岛匠人的彩绘玻璃，炉火淬出琉璃幻彩。',
  // ── 沉没神殿珍宝 ──
  relic: '沉没神殿中的秘藏，金玉交错，唯有按图挖掘方能现世。',
  // ── 普通货物（52 件）──
  silk: '中国丝织，柔光流转，西方贵妇争相追捧的东方奢侈品。',
  porcelain: '白瓷青花纹，海上丝路最负盛名、易碎却价高的货物。',
  tea: '一片东方树叶，风靡欧陆下午茶的源头。',
  spice: '胡椒丁香肉豆蔻，点燃大航海的「甜味黄金」。',
  cotton: '印度棉布轻柔透气，衣被天下的平民大宗。',
  pearl: '波斯湾孕育的圆润明珠，王冠与耳坠的宠儿。',
  gold: '永不贬值的硬通货，贸易与冒险的终极目标。',
  clove: '香料群岛的丁香，一粒便香透整间货舱。',
  timber: '北欧与热带的造船木料，商船的筋骨。',
  coffee: '阿拉伯的黑色饮品，醒神提气，风靡每座港口。',
  fur: '寒带猎得的华贵皮草，御寒更显身份。',
  wool: '英格兰羊毛呢绒，温暖厚实的大宗货。',
  whisky: '苏格兰蒸馏的琥珀烈酒，港口酒馆的常客。',
  wine: '伊比利亚与法兰西的葡萄佳酿，宴席必备。',
  perfume: '花露蒸馏而成的香水，一抹幽香千金不换。',
  grain: '面包与生命的根本，风浪里最稳妥的压舱货。',
  carpet: '波斯匠人手工打结的地毯，足下铺开的繁花庭院。',
  rose: '大马士革玫瑰蒸馏的香精油，价比黄金。',
  gem: '未经琢磨的粗宝石，切磨后身价百倍。',
  sword: '东洋锻刀，百炼钢折叠如波，寒光摄人。',
  silver: '新大陆与日本的白银，跨洋贸易的血脉。',
  cacao: '新大陆的可可豆，欧洲巧克力风味的源头。',
  cheese: '牧场熟成的奶酪，耐储藏的远航海粮。',
  watch: '低地钟表的齿轮艺术，精准丈量时间。',
  nest: '金丝燕的燕窝，滋补珍品，莹润如玉。',
  vanilla: '马达加斯加香草荚，甜点灵魂的幽香。',
  frankincense: '阿曼乳香，焚烧通神，教堂与宫廷皆用。',
  olive: '地中海的橄榄油，灯食皆宜的液体黄金。',
  tobacco: '新大陆烟草叶，烟斗里缭绕的异域瘾。',
  amber: '波罗的海的树脂化石，封存远古虫蚁如时光胶囊。',
  truffle: '林间难寻的黑松露，厨师梦寐的「地下钻石」。',
  honey: '蜂巢酿就的金黄蜜，天然的甜与药。',
  saffron: '藏红花柱头，三万朵方得一磅，红金之称。',
  caviar: '盐渍鱼子酱，黑珍珠般的奢宴之巅。',
  date: '沙漠椰枣，商队旅途的甘甜干粮。',
  indigo: '靛蓝染草，染就一匹匹深沉的蓝布。',
  cinnamon: '锡兰肉桂皮，温甜香气入馔亦入药。',
  paper: '中国宣纸，墨韵淋漓，文明赖此远播。',
  lacquer: '东洋漆器，层层髹涂温润如玉。',
  nutmeg: '香料群岛肉豆蔻，汤点与药引的点睛之笔。',
  sugar: '蔗田熬出的晶糖，甜蜜生意的利润引擎。',
  diamond: '矿区金刚石，切面流转火彩，永恒之石。',
  leather: '硝制兽皮，制靴制甲制书封的百搭料。',
  alpaca: '安第斯羊驼的柔毛，轻暖更胜羊毛。',
  salt: '海盐与矿盐，腌藏万物、富贵之基。',
  tulip: '荷兰郁金香球根，曾掀起癫狂的「花泡沫」。',
  copper: '红铜锭料，铸炮制器的基础金属。',
  seashell: '珍珠母贝壳，嵌饰螺钿的虹彩原料。',
  rum: '蔗蜜酿的朗姆酒，水手杯中的烈性与豪情。',
  book: '活字印就的古籍善本，知识随商船流转。',
  fleur: '鸢尾花饰，法兰西纹章上的金色百合。',
  scroll: '手绘航海图卷，标记暗礁与秘港的航海家笔记。',
}

export const GOOD_BY_ID: Record<string, Good> = Object.fromEntries(
  GOODS.map(g => [g.id, g]),
)

export interface City {
  id: string
  name: string
  sub: string
  /** 地图坐标，百分比（0-100） */
  x: number
  y: number
  /** 名称标签放在建筑的哪一侧，避免遮挡 */
  side: 'left' | 'right'
  /** 特产（本地便宜，多为唯一产地） */
  exports: string[]
  /** 紧缺（本地昂贵，本港只买不卖 → 卖价高） */
  imports: string[]
  blurb: string
}

export const CITIES: City[] = [
  {
    id: 'norway', name: '挪威', sub: 'NORWAY', x: 17, y: 12, side: 'right',
    exports: ['timber', 'fur', 'amber'], imports: ['wine', 'coffee', 'tea', 'spice', 'salt', 'sugar'],
    blurb: '峡湾深处，盛产木材与皮草',
  },
  {
    id: 'england', name: '英格兰', sub: 'ENGLAND', x: 7, y: 30, side: 'right',
    exports: ['wool', 'whisky', 'cheese'], imports: ['tea', 'spice', 'fur', 'carpet', 'nest', 'frankincense', 'truffle', 'caviar', 'sugar', 'alpaca', 'lacquer'],
    blurb: '雾都港埠，羊毛与麦芽威士忌之乡',
  },
  {
    id: 'france', name: '法兰西', sub: 'FRANCE', x: 17, y: 43, side: 'right',
    exports: ['wine', 'perfume', 'truffle'], imports: ['wool', 'fur', 'silk', 'coffee', 'vanilla', 'olive', 'cinnamon', 'nutmeg', 'diamond', 'leather', 'tulip'],
    blurb: '塞纳河畔，葡萄酒与香水的国度',
  },
  {
    id: 'egypt', name: '埃及', sub: 'EGYPT', x: 29, y: 49, side: 'right',
    exports: ['grain', 'honey'], imports: ['timber', 'wine', 'silver', 'spice', 'frankincense', 'paper', 'rum', 'cinnamon'],
    blurb: '尼罗河畔的粮仓，长绒棉之乡',
  },
  {
    id: 'persia', name: '波斯', sub: 'SAFAVID PERSIA', x: 41, y: 20, side: 'left',
    exports: ['carpet', 'rose', 'saffron', 'caviar'], imports: ['grain', 'pearl', 'gold', 'seashell'],
    blurb: '丝路古国，玫瑰与地毯的故乡',
  },
  {
    id: 'arabia', name: '阿拉伯', sub: 'ARABIA', x: 38, y: 34, side: 'left',
    exports: ['pearl', 'coffee', 'date'], imports: ['timber', 'grain', 'silk', 'porcelain', 'paper'],
    blurb: '沙漠商路的中心，珍珠汇聚之地',
  },
  {
    id: 'india', name: '印度', sub: 'MUGHAL INDIA', x: 53, y: 29, side: 'right',
    exports: ['spice', 'cotton', 'indigo'], imports: ['carpet', 'gem', 'silver', 'clove', 'frankincense', 'date', 'diamond', 'seashell'],
    blurb: '香料与棉花的帝国',
  },
  {
    id: 'srilanka', name: '锡兰', sub: 'CEYLON', x: 60, y: 44, side: 'right',
    exports: ['gem', 'cinnamon'], imports: ['gold', 'whisky', 'wine', 'cacao', 'honey', 'date'],
    blurb: '印度洋上的宝石与红茶之岛',
  },
  {
    id: 'china', name: '中国', sub: 'MING CHINA', x: 76, y: 14, side: 'left',
    exports: ['silk', 'porcelain', 'tea', 'paper'], imports: ['pearl', 'clove', 'rose', 'wine', 'nest', 'watch', 'amber', 'saffron', 'copper'],
    blurb: '丝绸与瓷器之乡，海内最富',
  },
  {
    id: 'japan', name: '日本', sub: 'JAPAN', x: 94, y: 34, side: 'left',
    exports: ['sword', 'silver', 'lacquer'], imports: ['silk', 'tea', 'cotton', 'gem', 'watch', 'tobacco', 'caviar', 'salt', 'copper', 'tulip'],
    blurb: '樱花之国，锻造与白银之邦',
  },
  {
    id: 'malacca', name: '马六甲', sub: 'MALACCA', x: 73, y: 56, side: 'right',
    exports: ['clove', 'spice', 'nutmeg'], imports: ['porcelain', 'cotton', 'whisky'],
    blurb: '东西方咽喉，万国商船必经',
  },
  {
    id: 'java', name: '爪哇', sub: 'JAVA', x: 78, y: 75, side: 'left',
    exports: ['coffee', 'sugar', 'kris'], imports: ['silk', 'tea', 'sword'],
    blurb: '火山脚下的千岛之国，咖啡飘香',
  },
  {
    id: 'africa', name: '好望角', sub: 'CAPE OF GOOD HOPE', x: 19, y: 66, side: 'right',
    exports: ['gold', 'coffee', 'diamond'], imports: ['porcelain', 'whisky', 'gem'],
    blurb: '好望角黄金与宝石海岸',
  },
  {
    id: 'aztec', name: '阿兹特克', sub: 'AZTEC', x: 85, y: 89, side: 'left',
    exports: ['cacao', 'leather'], imports: ['silk', 'tea', 'wine', 'vanilla', 'saffron'],
    blurb: '新大陆的白银王国',
  },
  {
    id: 'inca', name: '印加', sub: 'INCA', x: 63, y: 97, side: 'left',
    exports: ['alpaca', 'tumi'], imports: ['sword', 'perfume', 'wool', 'watch', 'olive'],
    blurb: '云中之城，黄金与宝石之地',
  },
  // ── v1.3.0 新增 6 个港口 ──
  {
    id: 'spain', name: '西班牙', sub: 'SPAIN', x: 8, y: 53, side: 'right',
    exports: ['olive', 'wine', 'salt'], imports: ['spice', 'silk', 'gold', 'cheese', 'leather', 'lacquer'],
    blurb: '伊比利亚半岛，橄榄园与斗牛士的故土',
  },
  {
    id: 'netherlands', name: '荷兰', sub: 'NETHERLANDS', x: 22, y: 25, side: 'right',
    exports: ['watch', 'tulip'], imports: ['silk', 'tea', 'gem', 'wine', 'vanilla', 'tobacco', 'indigo', 'nutmeg', 'alpaca', 'rum'],
    blurb: '低地之国，风车与郁金香，钟表匠之都',
  },
  {
    id: 'oman', name: '阿曼', sub: 'OMAN', x: 42, y: 47, side: 'left',
    exports: ['frankincense', 'copper'], imports: ['timber', 'wine', 'porcelain', 'sword'],
    blurb: '阿拉伯海之门，乳香与珍珠的产地',
  },
  {
    id: 'borneo', name: '汶莱', sub: 'BRUNEI', x: 79, y: 66, side: 'left',
    exports: ['nest', 'seashell'], imports: ['silk', 'wine', 'perfume', 'silver'],
    blurb: '热带雨林深处，金丝燕燕窝与红木之乡',
  },
  {
    id: 'madagascar', name: '马达加斯加', sub: 'MADAGASCAR', x: 44, y: 82, side: 'left',
    exports: ['vanilla', 'coffee', 'rum'], imports: ['silk', 'tea', 'sword', 'whisky', 'honey'],
    blurb: '印度洋上的香草之岛，猴面包树与狐猴',
  },
  {
    id: 'panama', name: '巴拿马', sub: 'PANAMA', x: 72, y: 92, side: 'right',
    exports: ['tobacco', 'pineapple'], imports: ['silk', 'wine', 'perfume', 'gem'],
    blurb: '两洋咽喉，烟草与白银的新大陆港口',
  },
  // ── v1.5.0 新增 2 个港口 ──
  {
    id: 'siam', name: '暹罗', sub: 'SIAM', x: 67, y: 40, side: 'right',
    exports: ['spice', 'teak', 'betel'], imports: ['silk', 'porcelain', 'tea', 'wool', 'gem', 'wine', 'watch', 'perfume'],
    blurb: '湄南河畔的稻香王国，香料与蔗糖之乡',
  },
  {
    id: 'italy', name: '威尼斯', sub: 'VENICE', x: 30, y: 41, side: 'right',
    exports: ['wine', 'violin', 'marble'], imports: ['silk', 'porcelain', 'tea', 'spice', 'gem', 'diamond', 'saffron', 'carpet', 'rose'],
    blurb: '地中海商贸枢纽，美酒与香水的摇篮',
  },
]

export const CITY_BY_ID: Record<string, City> = Object.fromEntries(
  CITIES.map(c => [c.id, c]),
)

// ── 各地宅邸（v1.6）：每城一处，3 级，按地区特色设计 —— 买房为长期金币消耗口 ──
export const HOUSE_STAGE_NAMES = ['小宅', '大宅', '府邸'] as const
/** 每级房屋给该城 buy / sell 价格加成各 +% */
export const HOUSE_BONUS_PER_LEVEL = 1.2
/** 购房（Lv0→1）与升 2 / 3 级的花费（统一阶梯，城市富庶差异靠加成之外的收藏体验体现） */
export const HOUSE_COSTS: [number, number, number] = [100_000, 300_000, 800_000]
/** 每城一处宅邸：base = 特色宅名（会自动拼接「·小宅/大宅/府邸」），desc = 地区特色描述 */
export const HOUSES: Record<string, { base: string; desc: string }> = {
  norway: { base: '峡湾木屋', desc: '深峡湾畔的云杉木屋，壁炉与毛皮抵御漫长极夜' },
  england: { base: '雾都石邸', desc: '红砖灰瓦的伦敦宅，壁炉旁陈着陈年威士忌' },
  france: { base: '塞纳酒庄', desc: '葡萄园环抱的石砌酒庄，酒窖藏满勃艮第' },
  egypt: { base: '尼罗庄园', desc: '河畔椰枣荫下的土黄宅院，粮仓常年满囤' },
  persia: { base: '丝路庭院', desc: '拱廊环绕的波斯庭院，玫瑰与地毯堆满厅堂' },
  arabia: { base: '沙漠商栈', desc: '夯土与椰枣木的商栈，珍珠藏于暗格' },
  india: { base: '香料行馆', desc: '红砂岩拱门行馆，空气里浮着香料与靛蓝' },
  srilanka: { base: '宝石凉亭', desc: '印度洋椰影下的凉亭，宝石匣流光四溢' },
  china: { base: '飞檐府邸', desc: '朱漆飞檐的临海府邸，瓷器与丝绸堆满回廊' },
  japan: { base: '数寄屋', desc: '枯山水庭院中的茶室木屋，刀与漆器悬于壁' },
  malacca: { base: '海峡商馆', desc: '骑楼连排的商馆，万国商旗在门前林立' },
  java: { base: '火山木楼', desc: '火山灰沃土上的高脚木楼，咖啡香漫整院' },
  africa: { base: '黄金海岸别墅', desc: '海岬崖上的白石别墅，宝石箱满盈' },
  aztec: { base: '石砌神庙宅', desc: '金字塔旁的石砌宅院，白银暗藏于祭坛下' },
  inca: { base: '云中石宫', desc: '安第斯山巅的巨石宅宫，黄金点缀梁柱' },
  spain: { base: '橄榄庄园', desc: '安达卢西亚的庄园，橄榄园邻着小小斗牛场' },
  netherlands: { base: '风车宅', desc: '运河畔的砖砌窄屋，风车与郁金香为邻' },
  oman: { base: '乳香驿站', desc: '海湾白墙驿站，乳香与珍珠在夜里散香' },
  borneo: { base: '雨林高脚屋', desc: '雨林深处的红木高脚屋，燕窝悬于梁下' },
  madagascar: { base: '香草椰屋', desc: '香草丛中的椰叶小屋，狐猴攀着屋檐' },
  panama: { base: '两洋岗哨宅', desc: '地峡小丘上的岗哨宅，烟草在梁间熏香' },
  siam: { base: '湄南水榭', desc: '浮于河上的柚木水榭，香料与蔗糖随波飘香' },
  italy: { base: '运河商馆', desc: '运河边的拱窗商馆，贡多拉泊在门前' },
}

// ── 隐藏特产（v1.4.0）：本港投资 ≥ 1 级解锁挂牌与购买；集中注入，避免散改 23 个城市定义 ──

/** 每座城市的隐藏特产（进 exports，产地价便宜） */
export const SECRET_OF_CITY: Record<string, string> = {
  norway: 'rune', england: 'longbow', france: 'tapestry', egypt: 'papyrus',
  persia: 'miniature', arabia: 'scimitar', india: 'sitar', srilanka: 'sapphire',
  china: 'jade', japan: 'armor', malacca: 'agarwood', java: 'batik',
  africa: 'mask', aztec: 'obsidian', inca: 'sundisc', spain: 'guitar',
  netherlands: 'delft', oman: 'incenseburner', borneo: 'ambergris',
  madagascar: 'elephantegg', panama: 'emerald',
  siam: 'jasmine', italy: 'murano',
}

/** 隐藏特产的销地（进 imports，高价收购） */
const SECRET_DEMAND: Record<string, string[]> = {
  norway: ['england', 'france', 'netherlands'],
  england: ['france', 'spain', 'netherlands'],
  france: ['england', 'spain', 'netherlands'],
  egypt: ['france', 'england', 'arabia'],
  persia: ['arabia', 'india', 'egypt'],
  arabia: ['persia', 'oman', 'egypt'],
  india: ['persia', 'china', 'srilanka'],
  srilanka: ['india', 'england', 'france'],
  china: ['japan', 'persia', 'netherlands'],
  japan: ['china', 'england', 'france'],
  malacca: ['china', 'arabia', 'japan'],
  java: ['malacca', 'srilanka', 'netherlands'],
  africa: ['france', 'england', 'spain'],
  aztec: ['spain', 'france', 'japan'],
  inca: ['spain', 'france', 'england'],
  spain: ['france', 'england', 'netherlands'],
  netherlands: ['england', 'france', 'japan'],
  oman: ['arabia', 'persia', 'india'],
  borneo: ['china', 'arabia', 'france'],
  madagascar: ['france', 'england', 'china'],
  panama: ['france', 'england', 'japan'],
  siam: ['china', 'japan', 'persia'],
  italy: ['france', 'england', 'spain'],
}

for (const [cid, gid] of Object.entries(SECRET_OF_CITY)) {
  const c = CITY_BY_ID[cid]
  if (c && !c.exports.includes(gid)) c.exports.push(gid)
  for (const icid of SECRET_DEMAND[cid] ?? []) {
    const ic = CITY_BY_ID[icid]
    if (ic && !ic.imports.includes(gid)) ic.imports.push(gid)
  }
}
// v1.5.0 新增通用货物：批量注入城市进出口，避免散改 21 个城市定义
const EXTRA_TRADE: Record<string, { exportAt: string[]; importAt: string[] }> = {
  book:   { exportAt: ['france', 'england', 'netherlands'], importAt: ['china', 'japan', 'persia', 'inca'] },
  fleur:  { exportAt: ['france', 'persia'], importAt: ['england', 'spain', 'netherlands', 'japan'] },
  scroll: { exportAt: ['china', 'persia', 'arabia'], importAt: ['england', 'france', 'netherlands', 'spain'] },
}
for (const [gid, cfg] of Object.entries(EXTRA_TRADE)) {
  for (const cid of cfg.exportAt) {
    const c = CITY_BY_ID[cid]
    if (c && !c.exports.includes(gid)) c.exports.push(gid)
  }
  for (const cid of cfg.importAt) {
    const c = CITY_BY_ID[cid]
    if (c && !c.imports.includes(gid)) c.imports.push(gid)
  }
}

// v1.5.0 新增 7 件特色货的销地（进 imports，高价收购，形成「产地低价买 → 需求港高价卖」闭环）
//   产地：kris/爪哇 · tumi/印加 · pineapple/汶莱 · teak·betel/暹罗 · violin·marble/威尼斯
const NEWGOOD_DEMAND: Record<string, string[]> = {
  kris:      ['spain', 'japan', 'france'],
  tumi:      ['spain', 'france', 'england'],
  pineapple: ['england', 'france', 'netherlands'],
  teak:      ['england', 'netherlands', 'japan'],
  betel:     ['china', 'japan', 'arabia'],
  violin:    ['france', 'england', 'spain'],
  marble:    ['france', 'england', 'spain'],
}
for (const [gid, cities] of Object.entries(NEWGOOD_DEMAND)) {
  for (const cid of cities) {
    const c = CITY_BY_ID[cid]
    if (c && !c.imports.includes(gid)) c.imports.push(gid)
  }
}

// 沉没神殿珍宝：只有名港求购，无产地
for (const cid of ['england', 'france', 'netherlands', 'japan', 'spain', 'inca']) {
  const c = CITY_BY_ID[cid]
  if (c && !c.imports.includes('relic')) c.imports.push('relic')
}

/** 是否为隐藏特产（投资门禁用） */
export function isSecretGood(goodId: string): boolean {
  return Object.values(SECRET_OF_CITY).includes(goodId)
}

export interface ShipClass {
  id: string
  name: string
  icon: GlyphName
  desc: string
  /** 载重上限 */
  cap: number
  /** 航速倍率 */
  speed: number
  /** 卖出利润加成（%） */
  bonus: number
  cost: number
  color: string
}

export const SHIPS: ShipClass[] = [
  { id: 'sloop', name: '小帆船', icon: 'shipSloop', desc: '入门商船，轻便灵活', cap: 40, speed: 1.0, bonus: 0, cost: 0, color: '#5aaedc' },
  { id: 'schooner', name: '双桅商船', icon: 'shipSchooner', desc: '标准贸易船型，运力翻倍', cap: 90, speed: 1.25, bonus: 8, cost: 6000, color: '#4cba6a' },
  { id: 'clipper', name: '飞剪船', icon: 'shipClipper', desc: '极速船型，航程大幅缩短', cap: 120, speed: 1.7, bonus: 12, cost: 18000, color: '#9b6ee0' },
  { id: 'galleon', name: '大型商船', icon: 'shipGalleon', desc: '重型货运主力，利润加成高', cap: 200, speed: 1.15, bonus: 20, cost: 45000, color: '#e87070' },
  { id: 'royal', name: '皇家盖伦', icon: 'shipRoyal', desc: '传说级旗舰，财富与荣耀的象征', cap: 360, speed: 1.35, bonus: 35, cost: 120000, color: '#f5913a' },
  // ── v1.1.0 终局目标：一亿金币的传奇宝船 ──
  { id: 'legend', name: '传奇宝船', icon: 'shipLegend', desc: '郑和宝船队旗舰复刻 · 一亿金币的海上巨无霸', cap: 600, speed: 1.5, bonus: 45, cost: 100_000_000, color: '#d4af37' },
]

export const SHIP_BY_ID: Record<string, ShipClass> = Object.fromEntries(
  SHIPS.map(s => [s.id, s]),
)

// ── 船具工坊（v1.2.0）──────────────────────────────────────────────────────────
// 装备：永久生效，每件只能买一次；补给：消耗品，事件中自动消耗或手动使用

export interface EquipDef {
  id: string
  name: string
  icon: GlyphName
  desc: string
  cost: number
  /** 航速 +% */
  speed?: number
  /** 卖出利润 +% */
  trade?: number
  /** 载重 +（绝对值） */
  cap?: number
  /** 声望获取 +% */
  repGain?: number
  /** 需先拥有该船（如传奇宝船专属龙骨） */
  requireShip?: string
}

export const EQUIPS: EquipDef[] = [
  { id: 'e_sail', name: '强化纵帆', icon: 'eqSail', desc: '全船航速 +8%', cost: 45_000, speed: 8 },
  { id: 'e_ledger', name: '商人账本', icon: 'eqLedger', desc: '卖出利润 +6%', cost: 55_000, trade: 6 },
  { id: 'e_hold', name: '扩容货舱', icon: 'eqHold', desc: '货舱载重 +60', cost: 70_000, cap: 60 },
  { id: 'e_chart', name: '精致海图', icon: 'eqChart', desc: '航速 +5%，利润 +3%', cost: 90_000, speed: 5, trade: 3 },
  { id: 'e_guild', name: '商会徽章', icon: 'eqGuild', desc: '各港声望获取 +50%', cost: 120_000, repGain: 50 },
  { id: 'e_keel', name: '金龙骨', icon: 'eqKeel', desc: '航速 +12%、载重 +120、利润 +8% —— 传奇宝船专属', cost: 8_000_000, requireShip: 'legend', speed: 12, cap: 120, trade: 8 },
]

export const EQUIP_BY_ID: Record<string, EquipDef> = Object.fromEntries(
  EQUIPS.map(e => [e.id, e]),
)

export interface SupplyDef {
  id: string
  name: string
  icon: GlyphName
  desc: string
  /** 单价 */
  cost: number
  /** auto = 对应海上事件自动消耗；manual = 航行中手动使用 */
  use: 'auto' | 'manual'
}

export const SUPPLIES: SupplyDef[] = [
  { id: 's_cannon', name: '舰炮组', icon: 'supCannon', desc: '遭遇海盗时自动开火：击退海盗并缴获战利品', cost: 2_500, use: 'auto' },
  { id: 's_timber', name: '修理木料', icon: 'supTimber', desc: '暴风雨时自动加固船体：航程延误减半', cost: 800, use: 'auto' },
  { id: 's_charter', name: '通商特许状', icon: 'supCharter', desc: '港口检疫时自动出示：免排队直接进港', cost: 600, use: 'auto' },
  { id: 's_rum', name: '朗姆酒桶', icon: 'supRum', desc: '航行中使用：船员士气大振，剩余航程 -40%', cost: 1_200, use: 'manual' },
]

export const SUPPLY_BY_ID: Record<string, SupplyDef> = Object.fromEntries(
  SUPPLIES.map(x => [x.id, x]),
)

// ── 港口商情 / 投资 / 委托（v1.3.0）──────────────────────────────────────────

export type CityEventKind = 'boom' | 'shortage' | 'blockade' | 'festival'

export const CITY_EVENT_INFO: Record<CityEventKind, { name: string; icon: GlyphName; desc: string }> = {
  boom: { name: '丰产季', icon: 'wheat', desc: '特产大量上市，本港买入价 -45%' },
  shortage: { name: '抢购潮', icon: 'flame', desc: '全城抢购紧缺货，本港卖出价 ×2.2' },
  blockade: { name: '瘟疫封锁', icon: 'barrier', desc: '市集关闭无法买卖（委托交付照常办理）' },
  festival: { name: '节庆集市', icon: 'mask', desc: '节庆限定货大受欢迎，本港卖出价 ×1.8' },
}

/** 商情调度间隔（秒）与单次持续时长范围（秒） */
export const CITY_EVENT_CYCLE = 32
export const CITY_EVENT_DURATION: [number, number] = [70, 110]
/** 全图同时最多几个商情事件 */
export const CITY_EVENT_MAX = 4

/** 港口投资：3 级，每级买入折扣 / 卖出加成 / 每个市场周期的分红 */
export interface InvestLevelDef {
  cost: number
  buy: number
  sell: number
  dividend: number
  title: string
}

export const INVEST_LEVELS: InvestLevelDef[] = [
  { cost: 25_000, buy: 4, sell: 4, dividend: 150, title: '商会伙伴' },
  { cost: 70_000, buy: 4, sell: 4, dividend: 450, title: '港口股东' },
  { cost: 160_000, buy: 4, sell: 4, dividend: 1_100, title: '荣誉市民' },
]

/** 各港口港务官/商会的寄语（v1.7）：按当前投资等级显示，满级时是专属感谢词 */
export const INVEST_VOICES: Record<string, [string, string, string]> = {
  norway:      ['卑尔根的码头认钱也认人，你既入了股，往后木料先紧着你挑。', '汉萨的老账房说了，你这名字可以记进商会的铜册了。', '北海的风冷，可挪威的港口记得每一个守信的人。这面铜牌，挂你船上。'],
  england:     ['皇家交易所的地板上，给你留了个位置。', '东印度公司的先生们开始打听你的船期了——这是好事。', '女王陛下的海关见了你的旗，会先敬礼再验货。英格兰认你这位朋友。'],
  france:      ['波尔多的酒窖里，永远为你留着一桶。', '商会的晚宴上，你的座位已经排到了公爵那桌。', '法兰西的港口向懂生活的人敞开。这枚徽章，配你的船正合适。'],
  egypt:       ['亚历山大的灯塔照着你进港，账房先生会把数目算得公道。', '帕夏的书记官已把你的名字写进港册，往后少些盘查。', '尼罗河的粮船靠岸时，第一个卸货的总是你的船。埃及记得恩人。'],
  persia:      ['设拉子的玫瑰园，为你多开了一扇门。', '商队的驼铃里有你的名号了，沙漠里的路会好走些。', '波斯的商人不轻易交朋友，但对你，愿以地毯上的花纹起誓。'],
  arabia:      ['马斯喀特的市场里，你的话有人听了。', '采珠人的船队愿意跟着你走——他们信你。', '沙漠的待客之道：客人住三日便是家人。你已是我们的人。'],
  india:       ['苏拉特的码头，你的货先过秤，价钱好商量。', '商会的账簿上，你的那一页写得比谁都体面。', '恒河的水洗过多少商人的誓，莫卧儿记得守约的人。你算一个。'],
  srilanka:    ['科伦坡的宝石街，愿意让你挑头一水的好货。', '肉桂园的香气里，你的名字已经被念叨熟了。', '锡兰的宝石匠说，好石头配好眼光。这枚蓝宝，只给你看。'],
  china:       ['泉州的市舶司给你留了文牒，报关少些周折。', '十三行的行商愿意与你合股，这是难得的体面。', '天朝的港口重信义。你既以诚来，便以礼待——这方印，收好。'],
  japan:       ['长崎的奉行所给你备了朱印状，入港不必候潮。', '堺市的商人开始按你的船期备货了，这是敬重。', '武士重一诺。你守了约，日本便记住了你。这柄刀，赠知音。'],
  malacca:     ['马六甲的关吏见你的货单，会少问两句。', '香料仓的钥匙，有一把配了你的名字。', '海峡的风记得每一艘守信用的船。马六甲以香料敬你这位朋友。'],
  java:        ['巴达维亚的仓库给你留了通风最好的位置。', '香料园的管事说，你的船一到就先装货。', '爪哇的火山与海都认了你的旗。这一袋豆子，是新收的头一茬。'],
  africa:      ['好望角的总督府给你留了茶位，路过就来坐坐。', '东印度公司的账房开始为你留舱位了，风暴季也不误。', '两洋交汇之处，风浪最烈，朋友最真。好望角认你这位老主顾。'],
  aztec:       ['大市场的摊主们认得你的船旗了，可可豆先紧着你。', '祭司说你的到来是好兆头，市场里给你留了最好的摊位。', '可可与皮革换来的情谊，比金子沉。阿兹特克不会忘。'],
  inca:        ['库斯科的驿道为你多备了一队脚夫。', '山城的织工愿意先给你看新染的羊驼毛。', '安第斯的山风高，情谊更高。这枚图米，是我们的心意。'],
  spain:       ['塞维利亚的交易所给你留了位置，金银船期先告诉你。', '船坞的工匠会优先修你的船，这是股东的体面。', '西班牙的日头烈，待朋友更烈。这杯酒，敬你的信义。'],
  netherlands: ['阿姆斯特丹的交易所里，你的名字能赊到好价。', '郁金香拍卖行的好货，会先给你留一束。', '荷兰人算账精，可对守信的朋友从不含糊。这枚徽章，值一船信任。'],
  oman:        ['马斯喀特的港口给你备了仓，乳香先紧着你装。', '航海世家的老船长们肯与你同席了，这是敬意。', '阿曼的帆影曾布满印度洋。如今，你的船也算其中一道。'],
  borneo:      ['汶莱的河口码头，你的船可以直接靠岸。', '燕窝洞的采手愿意先给你留头一水的货。', '婆罗洲的雨林雨多，人情浓。你的事，就是汶莱的事。'],
  madagascar:  ['塔马塔夫的集市给你留了棚位，香草随你挑。', '庄园主们的账本上，你的名字被圈了红。', '这片岛的香草与朗姆，愿为懂它的人多香一分。敬你。'],
  panama:      ['巴拿马的驿道给你留了骡队，货物过境快些。', '地峡的商栈愿意为你加宽一条道。', '两洋之间的路，认的是可靠的人。你走通了这条路，也就走进了巴拿马。'],
  siam:        ['大城的码头给你留了泊位，柚木先给你量。', '皇家的商船队愿意与你同行，这是难得的信任。', '湄南河的水流过多少商船，暹罗记得每一艘守约的。你是其一。'],
  italy:       ['里亚托桥的商人们，开始用你的名号谈价了。', '总督府的晚宴，你的席位在临窗那一侧。', '威尼斯的商人不轻易许诺，可一旦许诺，便以金币起誓。你已得了我们的誓。'],
}

/** 单个投资项目（v1.7）：每个港口 3 个地区专属方向，效果侧重不同 */
export interface InvestProjectDef {
  id: string
  name: string
  icon: string
  desc: string
  cost: number
  buy: number
  sell: number
  dividend: number
}
/** 各港口投资方向（v1.7）：可自由选择先投哪个，而非单一等级 */
export const INVEST_PROJECTS: Record<string, InvestProjectDef[]> = {
  norway: [
    { id: 'p1', name: '卑尔根木料仓', icon: 'crate', desc: '木材毛皮的吞吐全握在手里', cost: 25_000, buy: 4, sell: 4, dividend: 0 },
    { id: 'p2', name: '汉萨商栈合股', icon: 'purse', desc: '北海上最好的货先过你的手', cost: 70_000, buy: 2, sell: 6, dividend: 0 },
    { id: 'p3', name: '北海航路基金', icon: 'bank', desc: '船队每趟归来都给你分一份', cost: 160_000, buy: 2, sell: 2, dividend: 1_400 },
  ],
  england: [
    { id: 'p1', name: '皇家交易所席位', icon: 'exchange', desc: '在伦敦的地板上占一个名号', cost: 25_000, buy: 4, sell: 4, dividend: 0 },
    { id: 'p2', name: '东印度公司股份', icon: 'purse', desc: '远东的船期先送到你案头', cost: 70_000, buy: 2, sell: 6, dividend: 0 },
    { id: 'p3', name: '伦敦保险行', icon: 'bank', desc: '每艘进出港的船都有你一份保金', cost: 160_000, buy: 2, sell: 2, dividend: 1_400 },
  ],
  france: [
    { id: 'p1', name: '波尔多酒窖', icon: 'bottle', desc: '一桶好酒就是一张通行证', cost: 25_000, buy: 4, sell: 4, dividend: 0 },
    { id: 'p2', name: '里昂丝绸行', icon: 'purse', desc: '贵族们的料子由你定价', cost: 70_000, buy: 2, sell: 6, dividend: 0 },
    { id: 'p3', name: '巴黎香料基金', icon: 'bank', desc: '宫廷的香气里藏着分红', cost: 160_000, buy: 2, sell: 2, dividend: 1_400 },
  ],
  spain: [
    { id: 'p1', name: '塞维利亚船坞', icon: 'anchor', desc: '修船优先，出海更快', cost: 25_000, buy: 4, sell: 4, dividend: 0 },
    { id: 'p2', name: '美洲金银航线', icon: 'coin', desc: '新大陆的银子先过你的舱', cost: 70_000, buy: 2, sell: 6, dividend: 0 },
    { id: 'p3', name: '王室债劵', icon: 'bank', desc: '国王借钱，你来收息', cost: 160_000, buy: 2, sell: 2, dividend: 1_400 },
  ],
  netherlands: [
    { id: 'p1', name: '阿姆斯特丹仓栈', icon: 'crate', desc: '全欧洲的货都在这儿转手', cost: 25_000, buy: 4, sell: 4, dividend: 0 },
    { id: 'p2', name: '郁金香拍卖行', icon: 'flower', desc: '一朵花也能卖出天价', cost: 70_000, buy: 2, sell: 6, dividend: 0 },
    { id: 'p3', name: '东印度联营基金', icon: 'bank', desc: '低地国家的钱生钱', cost: 160_000, buy: 2, sell: 2, dividend: 1_400 },
  ],
  italy: [
    { id: 'p1', name: '里亚托商铺', icon: 'market', desc: '桥头的铺面租金稳当', cost: 25_000, buy: 4, sell: 4, dividend: 0 },
    { id: 'p2', name: '玻璃工坊合股', icon: 'gem', desc: '穆拉诺的玻璃，供不应求', cost: 70_000, buy: 2, sell: 6, dividend: 0 },
    { id: 'p3', name: '总督府债劵', icon: 'bank', desc: '共和国从不赖账', cost: 160_000, buy: 2, sell: 2, dividend: 1_400 },
  ],
  egypt: [
    { id: 'p1', name: '亚历山大粮仓', icon: 'wheat', desc: '尼罗河的粮食由你周转', cost: 25_000, buy: 8, sell: 0, dividend: 0 },
    { id: 'p2', name: '尼罗河香料行', icon: 'purse', desc: '东西方的香气在此换手', cost: 70_000, buy: 0, sell: 8, dividend: 0 },
    { id: 'p3', name: '帕夏航运基金', icon: 'bank', desc: '粮船每次靠岸都分你一份', cost: 160_000, buy: 2, sell: 2, dividend: 900 },
  ],
  persia: [
    { id: 'p1', name: '设拉子玫瑰园', icon: 'flower', desc: '玫瑰水与藏红花的源头', cost: 25_000, buy: 8, sell: 0, dividend: 0 },
    { id: 'p2', name: '地毯商队', icon: 'purse', desc: '丝路的花纹卖到欧洲', cost: 70_000, buy: 0, sell: 8, dividend: 0 },
    { id: 'p3', name: '丝路基金', icon: 'bank', desc: '驼铃一响，银子就来', cost: 160_000, buy: 2, sell: 2, dividend: 900 },
  ],
  arabia: [
    { id: 'p1', name: '马斯喀特珍珠行', icon: 'gem', desc: '采珠人的第一手好货', cost: 25_000, buy: 8, sell: 0, dividend: 0 },
    { id: 'p2', name: '咖啡商栈', icon: 'purse', desc: '摩卡的味道你说了算', cost: 70_000, buy: 0, sell: 8, dividend: 0 },
    { id: 'p3', name: '采珠船队基金', icon: 'bank', desc: '每季的珍珠都有你一份', cost: 160_000, buy: 2, sell: 2, dividend: 900 },
  ],
  india: [
    { id: 'p1', name: '苏拉特棉花仓', icon: 'crate', desc: '棉布的源头价由你开', cost: 25_000, buy: 8, sell: 0, dividend: 0 },
    { id: 'p2', name: '香料批发行', icon: 'purse', desc: '胡椒与靛蓝的定价权', cost: 70_000, buy: 0, sell: 8, dividend: 0 },
    { id: 'p3', name: '莫卧儿商队基金', icon: 'bank', desc: '帝国的商道为你生息', cost: 160_000, buy: 2, sell: 2, dividend: 900 },
  ],
  srilanka: [
    { id: 'p1', name: '科伦坡宝石行', icon: 'gem', desc: '宝石街的好货先给你挑', cost: 25_000, buy: 8, sell: 0, dividend: 0 },
    { id: 'p2', name: '肉桂园', icon: 'leaf', desc: '锡兰肉桂只此一家', cost: 70_000, buy: 0, sell: 8, dividend: 0 },
    { id: 'p3', name: '宝石匠行会基金', icon: 'bank', desc: '每一刀打磨都有你的份', cost: 160_000, buy: 2, sell: 2, dividend: 900 },
  ],
  china: [
    { id: 'p1', name: '泉州码头仓', icon: 'crate', desc: '丝绸与瓷器的出海口', cost: 25_000, buy: 8, sell: 0, dividend: 0 },
    { id: 'p2', name: '十三行商号', icon: 'purse', desc: '天朝的货由你经手', cost: 70_000, buy: 0, sell: 8, dividend: 0 },
    { id: 'p3', name: '市舶司基金', icon: 'bank', desc: '海贸的税银也分红', cost: 160_000, buy: 2, sell: 2, dividend: 900 },
  ],
  japan: [
    { id: 'p1', name: '长崎唐馆', icon: 'crate', desc: '唯一的通商窗口由你打理', cost: 25_000, buy: 4, sell: 4, dividend: 0 },
    { id: 'p2', name: '堺市漆器行', icon: 'purse', desc: '漆器与刀剑的行情', cost: 70_000, buy: 2, sell: 6, dividend: 0 },
    { id: 'p3', name: '朱印船基金', icon: 'bank', desc: '官许的船队稳赚不赔', cost: 160_000, buy: 2, sell: 2, dividend: 1_400 },
  ],
  malacca: [
    { id: 'p1', name: '香料仓', icon: 'crate', desc: '丁香与豆蔻的集散地', cost: 25_000, buy: 8, sell: 0, dividend: 0 },
    { id: 'p2', name: '海峡商栈', icon: 'purse', desc: '过海峡的船都得问你价', cost: 70_000, buy: 0, sell: 8, dividend: 0 },
    { id: 'p3', name: '苏丹航运基金', icon: 'bank', desc: '海峡的过路钱分成', cost: 160_000, buy: 2, sell: 2, dividend: 900 },
  ],
  java: [
    { id: 'p1', name: '巴达维亚咖啡园', icon: 'leaf', desc: '爪哇豆的第一茬归你', cost: 25_000, buy: 8, sell: 0, dividend: 0 },
    { id: 'p2', name: '糖坊', icon: 'purse', desc: '蔗糖的甜头你尝最大一口', cost: 70_000, buy: 0, sell: 8, dividend: 0 },
    { id: 'p3', name: '香料园基金', icon: 'bank', desc: '火山灰养出的好收成', cost: 160_000, buy: 2, sell: 2, dividend: 900 },
  ],
  africa: [
    { id: 'p1', name: '好望角补给站', icon: 'anchor', desc: '过路船都得在此补水修帆', cost: 25_000, buy: 4, sell: 4, dividend: 0 },
    { id: 'p2', name: '象牙黄金贸易行', icon: 'gem', desc: '两洋之间的硬通货', cost: 70_000, buy: 2, sell: 6, dividend: 0 },
    { id: 'p3', name: '东印度航线基金', icon: 'bank', desc: '风暴季也有人替你赚钱', cost: 160_000, buy: 2, sell: 2, dividend: 1_400 },
  ],
  aztec: [
    { id: 'p1', name: '可可园', icon: 'leaf', desc: '苦豆子成了硬通货', cost: 25_000, buy: 8, sell: 0, dividend: 0 },
    { id: 'p2', name: '皮革市集', icon: 'purse', desc: '大市场的皮货由你验', cost: 70_000, buy: 0, sell: 8, dividend: 0 },
    { id: 'p3', name: '大市场基金', icon: 'bank', desc: '摊主的租金细水长流', cost: 160_000, buy: 2, sell: 2, dividend: 900 },
  ],
  inca: [
    { id: 'p1', name: '羊驼牧场', icon: 'leaf', desc: '云中之城的柔软毛料', cost: 25_000, buy: 8, sell: 0, dividend: 0 },
    { id: 'p2', name: '山城织坊', icon: 'purse', desc: '织工的染布卖给谁由你说', cost: 70_000, buy: 0, sell: 8, dividend: 0 },
    { id: 'p3', name: '驿道基金', icon: 'bank', desc: '每队脚夫都替你走一段', cost: 160_000, buy: 2, sell: 2, dividend: 900 },
  ],
  oman: [
    { id: 'p1', name: '乳香仓', icon: 'crate', desc: '神庙与宫廷都要的香', cost: 25_000, buy: 8, sell: 0, dividend: 0 },
    { id: 'p2', name: '铜器商栈', icon: 'purse', desc: '印度洋的铜价看你的脸色', cost: 70_000, buy: 0, sell: 8, dividend: 0 },
    { id: 'p3', name: '印度洋船队基金', icon: 'bank', desc: '老船长的帆影里有你的份', cost: 160_000, buy: 2, sell: 2, dividend: 900 },
  ],
  borneo: [
    { id: 'p1', name: '燕窝洞', icon: 'crate', desc: '头一水的燕窝归你', cost: 25_000, buy: 8, sell: 0, dividend: 0 },
    { id: 'p2', name: '海贝集市', icon: 'purse', desc: '雨林与海货在此换手', cost: 70_000, buy: 0, sell: 8, dividend: 0 },
    { id: 'p3', name: '河口商栈基金', icon: 'bank', desc: '汶莱的事就是你的事', cost: 160_000, buy: 2, sell: 2, dividend: 900 },
  ],
  madagascar: [
    { id: 'p1', name: '香草园', icon: 'leaf', desc: '香草荚的头一茬', cost: 25_000, buy: 8, sell: 0, dividend: 0 },
    { id: 'p2', name: '朗姆酒坊', icon: 'bottle', desc: '甘蔗烧出的烈性利润', cost: 70_000, buy: 0, sell: 8, dividend: 0 },
    { id: 'p3', name: '庄园联营基金', icon: 'bank', desc: '香草与朗姆都替你生息', cost: 160_000, buy: 2, sell: 2, dividend: 900 },
  ],
  panama: [
    { id: 'p1', name: '地峡驿道', icon: 'truck', desc: '两洋之间的货由你搬', cost: 25_000, buy: 8, sell: 0, dividend: 0 },
    { id: 'p2', name: '烟草商栈', icon: 'purse', desc: '烟叶的行情你定调', cost: 70_000, buy: 0, sell: 8, dividend: 0 },
    { id: 'p3', name: '两洋转运基金', icon: 'bank', desc: '骡队每趟都有你的份', cost: 160_000, buy: 2, sell: 2, dividend: 900 },
  ],
  siam: [
    { id: 'p1', name: '柚木林', icon: 'crate', desc: '最好的船材出自你手', cost: 25_000, buy: 8, sell: 0, dividend: 0 },
    { id: 'p2', name: '香料行', icon: 'purse', desc: '暹罗的香卖遍东方', cost: 70_000, buy: 0, sell: 8, dividend: 0 },
    { id: 'p3', name: '皇家商船基金', icon: 'bank', desc: '皇家的船队与你同利', cost: 160_000, buy: 2, sell: 2, dividend: 900 },
  ],
}

/** 限时委托：刷新周期 / 委托板容量 / 同时最多接单数 */
export const ORDER_CYCLE = 40
export const ORDER_BOARD_MAX = 6
export const ORDER_ACTIVE_MAX = 3
/** 委托奖励 = 需求货值 × (基础倍率 + 距离系数) */
export const ORDER_BASE_RATE = 1.75
export const ORDER_DIST_RATE = 0.012

// ── v1.4.0：进港关税 / 海事悬赏 / 深海秘藏 / 银行 ────────────────────────────

/** 进港关税 = 固定 + 货舱货值比例；投资 2 级半价、3 级全免 */
export const TARIFF_BASE = 30
export const TARIFF_RATE = 0.01

/** 通缉海盗：strength 越高赏金越多 */
export interface PirateDef {
  id: string
  name: string
  icon: GlyphName
  strength: number
}

export const PIRATES: PirateDef[] = [
  { id: 'p_rat', name: '独眼耗子', icon: 'piratRat', strength: 40 },
  { id: 'p_hook', name: '铁钩手·席德', icon: 'piratHook', strength: 55 },
  { id: 'p_kraken', name: '唤雾者·莫比', icon: 'piratKraken', strength: 70 },
  { id: 'p_morgan', name: '血帆·摩根', icon: 'piratMorgan', strength: 85 },
  { id: 'p_ivory', name: '象牙王·科萨', icon: 'piratIvory', strength: 95 },
  { id: 'p_barbarossa', name: '红胡子·巴巴罗萨', icon: 'piratBarbarossa', strength: 105 },
  { id: 'p_blackbeard', name: '黑胡子·蒂奇', icon: 'piratBlack', strength: 125 },
  { id: 'p_dragonlady', name: '龙夫人·郑', icon: 'piratDragon', strength: 150 },
  { id: 'p_storm', name: '风暴女巫·美杜莎', icon: 'piratStorm', strength: 165 },
  { id: 'p_davy', name: '深渊之王·戴维', icon: 'piratDavy', strength: 180 },
]

export const PIRATE_BY_ID: Record<string, PirateDef> = Object.fromEntries(
  PIRATES.map(p => [p.id, p]),
)

/** 悬赏刷新间隔 / 单张悬赏有效期（游戏时钟秒） */
export const BOUNTY_CYCLE = 75
export const BOUNTY_TTL = 260
/** 赏金 = strength × 随机系数 */
export const BOUNTY_RATE: [number, number] = [90, 130]

/** 出击战力 = 基础 + 船级×系数 + 舰炮组库存×系数 */
export const RAID_BASE_POWER = 15
export const RAID_SHIP_POWER = 18
export const RAID_CANNON_POWER = 12

/** 深海秘藏：集齐 4 块碎片后可在目标港挖掘 */
export const MAP_FRAGS_NEED = 4
export const DIG_BASE_REWARD = 22_000
export const DIG_STEP_REWARD = 10_000
export const DIG_RELIC_QTY = 4

/** 银行：每市场周期计息比例 / 信用额度（资产×比例，上下限）/ 破产清算线（债务 > 资产×比例） */
export const LOAN_INTEREST = 0.0015
export const LOAN_CREDIT_RATE = 0.5
export const LOAN_CREDIT_MIN = 8_000
export const LOAN_CREDIT_MAX = 250_000
export const LOAN_CRASH_RATIO = 3

// ── 船员（酒馆招募）──────────────────────────────────────────────────────────

/** Q 版形象配置（由 CrewAvatar 组件绘制） */
export interface CrewLook {
  skin: string
  hair: string
  hairStyle: 'short' | 'long' | 'bun' | 'bald'
  hat: 'tricorn' | 'sailor' | 'bandana' | 'turban' | 'chef' | 'feather' | 'none'
  hatColor: string
  /** 帽子副色（三角帽帽冠 / 头巾羽毛 / 缠头巾浅层） */
  hatColor2?: string
  beardStyle?: 'full' | 'mustache'
  beardColor?: string
  accessory?: 'eyepatch' | 'pipe' | 'earring' | 'scar'
}

export interface CrewMember {
  id: string
  name: string
  /** 职位：航海家 / 水手长 / 水手 / 大厨 / 炮手 / 瞭望手… */
  role: string
  /** 只能在这座城市招募 */
  cityId: string
  cost: number
  /** 航速加成 %（乘算在船速上） */
  speed: number
  /** 卖出利润加成 %（叠加在船只加成上） */
  trade: number
  desc: string
  look: CrewLook
  /** 卡片主色 */
  color: string
  /** 可进修的课程 id（见 CREW_COURSES），按性格定制 */
  courses: string[]
  /** 偏好的礼物标签（见 CREW_GIFTS.tags）：送中则好感大涨 */
  likes: string[]
  /** 讨厌的礼物标签：送中则好感下跌 */
  dislikes: string[]
}

/** 船员培训（v1.6）：长期消耗金币的成长线 —— 每级给航速 / 利润加成各 +2%，封顶 10 级 */
export const CREW_MAX_LEVEL = 10
export const CREW_TRAIN_BASE = 4_000
export const CREW_TRAIN_RATE = 2.4
export const CREW_TRAIN_BONUS = 2
/** 船员送礼（v1.6）：好感养成，金币消耗口 */
export const CREW_GIFT_COST = 15_000
export const CREW_FAVOR_MAX = 100
/** 每满 CREW_FAVOR_BONUS_STEP 点好感，额外 +CREW_FAVOR_BONUS_PER% 利润加成 */
export const CREW_FAVOR_BONUS_STEP = 12
export const CREW_FAVOR_BONUS_PER = 1

/** 训练课程（v1.7）：每名船员按性格只能修部分课程；总养成等级封顶 CREW_MAX_LEVEL，在所选课程间自由分配 */
export interface CrewCourseDef {
  id: string
  name: string
  icon: string
  desc: string
  /** 每级给航速 / 利润加成 % */
  speed: number
  trade: number
}
export const CREW_COURSES: Record<string, CrewCourseDef> = {
  nav:   { id: 'nav',   name: '航海术', icon: 'compass',  desc: '熟记洋流与航线，航速提升',     speed: 1.8, trade: 0 },
  trade: { id: 'trade', name: '经商课', icon: 'purse',    desc: '讨价还价的门道，利润提升',     speed: 0,   trade: 1.8 },
  gun:   { id: 'gun',   name: '炮术',   icon: 'target',   desc: '操炮与威慑，利润微增',         speed: 0.4, trade: 1.2 },
  charm: { id: 'charm', name: '交际术', icon: 'cheers',   desc: '应酬与周旋，利润提升',         speed: 0,   trade: 1.4 },
  scout: { id: 'scout', name: '瞭望术', icon: 'spyglass', desc: '识天辨货，航速与利润兼得',     speed: 1.0, trade: 0.6 },
  cook:  { id: 'cook',  name: '膳食',   icon: 'flame',    desc: '一手好菜稳住人心，利润微增',   speed: 0,   trade: 1.0 },
  medic: { id: 'medic', name: '医道',   icon: 'bottle',   desc: '草药与急救，航速利润兼得',     speed: 0.6, trade: 0.6 },
  lore:  { id: 'lore',  name: '海图考', icon: 'book',     desc: '考据海图秘闻，航速利润兼得',   speed: 0.8, trade: 0.8 },
}

/** 礼物（v1.7）：用金币购买后送给船员；契合其偏好则好感大涨，踩雷则下跌 */
export interface CrewGiftDef {
  id: string
  name: string
  cost: number
  tags: string[]
  desc: string
}
export const CREW_GIFTS: CrewGiftDef[] = [
  { id: 'rum',     name: '陈年朗姆',   cost: 12_000, tags: ['drink'],     desc: '海盗与老水手的最爱' },
  { id: 'blade',   name: '镶宝石短刀', cost: 26_000, tags: ['weapon'],   desc: '锋利又有面子' },
  { id: 'silk',    name: '江南丝绸',   cost: 18_000, tags: ['luxury'],   desc: '柔软华贵' },
  { id: 'gem',     name: '异色宝石',   cost: 30_000, tags: ['gem'],      desc: '一眼辨得出成色' },
  { id: 'chart',   name: '手绘海图',   cost: 16_000, tags: ['nav'],      desc: '标注了隐秘航线' },
  { id: 'spice',   name: '珍稀香料',   cost: 14_000, tags: ['spice'],    desc: '远处港口的硬通货' },
  { id: 'lute',    name: '鲁特琴',     cost: 15_000, tags: ['music'],    desc: '甲板上的消遣' },
  { id: 'book',    name: '绝版古籍',   cost: 20_000, tags: ['book'],     desc: '记载航海秘闻' },
  { id: 'tobacco', name: '上等烟叶',   cost: 10_000, tags: ['smoke'],    desc: '饭后一袋最惬意' },
  { id: 'medal',   name: '荣誉勋章',   cost: 22_000, tags: ['honor'],    desc: '象征英勇与忠义' },
  { id: 'perfume', name: '远东香水',   cost: 19_000, tags: ['luxury'],   desc: '香气撩人' },
  { id: 'herb',    name: '名贵草药',   cost: 13_000, tags: ['medicine'], desc: '调理身子' },
]

/** 18 位可雇佣的航海好手，散落在世界各港 */
export const CREW: CrewMember[] = [
  {
    id: 'c_zheng', name: '郑一嫂', role: '航海家', cityId: 'china', cost: 9_000, speed: 10, trade: 0,
    desc: '红旗帮当家，海图过目不忘，海盗见了都绕道',
    color: '#d94141',
    look: { skin: '#ffd9b3', hair: '#1a1a1a', hairStyle: 'long', hat: 'bandana', hatColor: '#d94141', accessory: 'earring' },
    courses: ['nav', 'trade', 'charm'],
    likes: ['honor', 'luxury', 'weapon'],
    dislikes: ['drink', 'smoke'],
  },
  {
    id: 'c_mary', name: '玛丽·雷德', role: '航海家', cityId: 'england', cost: 12_000, speed: 0, trade: 8,
    desc: '曾是私掠船长，讨价还价从没输过',
    color: '#c1452b',
    look: { skin: '#ffd9b3', hair: '#c1452b', hairStyle: 'long', hat: 'tricorn', hatColor: '#3a2d20', hatColor2: '#241b13', accessory: 'eyepatch' },
    courses: ['trade', 'charm', 'gun'],
    likes: ['gem', 'book', 'weapon'],
    dislikes: ['luxury', 'smoke'],
  },
  {
    id: 'c_sinbad', name: '辛巴达', role: '航海家', cityId: 'arabia', cost: 10_000, speed: 8, trade: 0,
    desc: '七次远航的老船长，总能抢在风暴前进港',
    color: '#c9a24b',
    look: { skin: '#e0a878', hair: '#201510', hairStyle: 'short', hat: 'turban', hatColor: '#efe3c2', hatColor2: '#f8f0d8', beardStyle: 'full', beardColor: '#201510' },
    courses: ['nav', 'lore', 'scout'],
    likes: ['gem', 'book', 'drink'],
    dislikes: ['luxury'],
  },
  {
    id: 'c_zhenghe', name: '郑和', role: '大航海家', cityId: 'malacca', cost: 30_000, speed: 10, trade: 6,
    desc: '七下西洋的舰队总帅，宝船队的传奇',
    color: '#f0a83c',
    look: { skin: '#ffd9b3', hair: '#1a1a1a', hairStyle: 'bun', hat: 'none', hatColor: '#f0a83c' },
    courses: ['nav', 'lore', 'trade'],
    likes: ['book', 'gem', 'luxury'],
    dislikes: ['drink'],
  },
  {
    id: 'c_raja', name: '拉吉·辛', role: '水手长', cityId: 'india', cost: 6_000, speed: 0, trade: 4,
    desc: '装卸又快又稳，压舱货也能卖出好价钱',
    color: '#4c9e5f',
    look: { skin: '#b57a4a', hair: '#141414', hairStyle: 'short', hat: 'turban', hatColor: '#4c9e5f', hatColor2: '#7cc08d', accessory: 'earring' },
    courses: ['trade', 'medic', 'cook'],
    likes: ['spice', 'medicine'],
    dislikes: ['weapon', 'honor'],
  },
  {
    id: 'c_kotaro', name: '小太郎', role: '水手', cityId: 'japan', cost: 5_000, speed: 5, trade: 0,
    desc: '桅杆上蹿下跳，收帆张帆只要一半时间',
    color: '#4a6fa5',
    look: { skin: '#ffd9b3', hair: '#141414', hairStyle: 'short', hat: 'bandana', hatColor: '#4a6fa5' },
    courses: ['nav', 'scout', 'gun'],
    likes: ['weapon', 'drink'],
    dislikes: ['luxury'],
  },
  {
    id: 'c_john', name: '老约翰', role: '老水手', cityId: 'norway', cost: 4_000, speed: 4, trade: 0,
    desc: '在北海漂了四十年，闭着眼都能认出洋流',
    color: '#2e4057',
    look: { skin: '#ffd9b3', hair: '#e8e8e8', hairStyle: 'bald', hat: 'tricorn', hatColor: '#2e4057', hatColor2: '#1f2d3d', beardStyle: 'full', beardColor: '#e8e8e8' },
    courses: ['nav', 'medic'],
    likes: ['drink', 'smoke'],
    dislikes: ['luxury', 'perfume'],
  },
  {
    id: 'c_pierre', name: '皮埃尔', role: '大厨', cityId: 'france', cost: 5_500, speed: 0, trade: 5,
    desc: '一手好炖菜让港口官员心情大好，税费都少了',
    color: '#9b6ee0',
    look: { skin: '#ffd9b3', hair: '#6b4a2f', hairStyle: 'short', hat: 'chef', hatColor: '#9b6ee0', beardStyle: 'mustache', beardColor: '#6b4a2f' },
    courses: ['cook', 'charm', 'medic'],
    likes: ['spice', 'luxury', 'drink'],
    dislikes: ['weapon'],
  },
  {
    id: 'c_diaz', name: '迪亚士', role: '航海家', cityId: 'spain', cost: 8_000, speed: 6, trade: 0,
    desc: '绕过好望角的狠人，最懂怎么走顺风航线',
    color: '#6b2737',
    look: { skin: '#e8b88a', hair: '#1d1710', hairStyle: 'short', hat: 'tricorn', hatColor: '#6b2737', hatColor2: '#4d1b27', accessory: 'pipe' },
    courses: ['nav', 'gun', 'scout'],
    likes: ['drink', 'book', 'weapon'],
    dislikes: ['luxury'],
  },
  {
    id: 'c_katalina', name: '卡塔丽娜', role: '炮手', cityId: 'aztec', cost: 7_000, speed: 3, trade: 5,
    desc: '红发炮神，商路安全她说了算',
    color: '#b23a48',
    look: { skin: '#c98a5a', hair: '#141414', hairStyle: 'long', hat: 'feather', hatColor: '#b23a48', hatColor2: '#e8542f', accessory: 'earring' },
    courses: ['gun', 'charm', 'scout'],
    likes: ['weapon', 'honor', 'drink'],
    dislikes: ['perfume', 'luxury'],
  },
  {
    id: 'c_kwame', name: '夸梅', role: '水手', cityId: 'africa', cost: 4_500, speed: 4, trade: 2,
    desc: '好望角老水手，风浪越大他划得越欢',
    color: '#3f9e8e',
    look: { skin: '#8a5a3a', hair: '#141414', hairStyle: 'short', hat: 'bandana', hatColor: '#f5c830', accessory: 'scar' },
    courses: ['scout', 'nav', 'medic'],
    likes: ['drink', 'smoke', 'music'],
    dislikes: ['luxury'],
  },
  {
    id: 'c_daisy', name: '范黛西', role: '瞭望手', cityId: 'netherlands', cost: 6_500, speed: 6, trade: 0,
    desc: '站在桅顶就能望见十海里外的商机',
    color: '#e8874a',
    look: { skin: '#ffd9b3', hair: '#e8c96b', hairStyle: 'long', hat: 'sailor', hatColor: '#2b5e8f' },
    courses: ['scout', 'trade', 'lore'],
    likes: ['gem', 'book', 'luxury'],
    dislikes: ['drink', 'smoke'],
  },
  // ── v1.2.0 新增 6 位船员（补齐此前没有船员的港口） ──
  {
    id: 'c_nefertari', name: '奈菲尔塔莉', role: '女商人', cityId: 'egypt', cost: 11_000, speed: 0, trade: 7,
    desc: '尼罗河畔的大商贾，货船排队等她验货',
    color: '#d4a017',
    look: { skin: '#c98a5a', hair: '#141414', hairStyle: 'long', hat: 'bandana', hatColor: '#d4a017', hatColor2: '#f5e6b8', accessory: 'earring' },
    courses: ['trade', 'charm', 'lore'],
    likes: ['gem', 'luxury', 'perfume'],
    dislikes: ['drink'],
  },
  {
    id: 'c_rustam', name: '鲁斯塔姆', role: '护卫队长', cityId: 'persia', cost: 8_000, speed: 3, trade: 4,
    desc: '波斯史诗里的英雄后人，押过的货一趟没丢过',
    color: '#8a4f2d',
    look: { skin: '#e0a878', hair: '#201510', hairStyle: 'short', hat: 'turban', hatColor: '#8a4f2d', hatColor2: '#c98a50', beardStyle: 'full', beardColor: '#201510', accessory: 'scar' },
    courses: ['gun', 'medic', 'charm'],
    likes: ['weapon', 'honor', 'book'],
    dislikes: ['luxury', 'perfume'],
  },
  {
    id: 'c_vira', name: '维拉', role: '珠宝匠', cityId: 'srilanka', cost: 9_500, speed: 0, trade: 6,
    desc: '一眼辨真假宝石，卖价总能再抬一手',
    color: '#c05299',
    look: { skin: '#b57a4a', hair: '#141414', hairStyle: 'bun', hat: 'bandana', hatColor: '#c05299', accessory: 'earring' },
    courses: ['trade', 'lore', 'charm'],
    likes: ['gem', 'luxury', 'book'],
    dislikes: ['drink', 'smoke'],
  },
  {
    id: 'c_bayu', name: '巴尤', role: '水手', cityId: 'java', cost: 5_500, speed: 5, trade: 0,
    desc: '火山海边长大，看云识风比看罗盘还准',
    color: '#5f8d4e',
    look: { skin: '#b57a4a', hair: '#141414', hairStyle: 'short', hat: 'bandana', hatColor: '#5f8d4e', accessory: 'pipe' },
    courses: ['scout', 'nav', 'charm'],
    likes: ['smoke', 'drink', 'spice'],
    dislikes: ['weapon', 'honor'],
  },
  {
    id: 'c_mira', name: '米拉', role: '药剂师', cityId: 'madagascar', cost: 6_500, speed: 2, trade: 3,
    desc: '香草与草药专家，船员不晕船，货也不坏',
    color: '#3aa6a0',
    look: { skin: '#8a5a3a', hair: '#141414', hairStyle: 'long', hat: 'feather', hatColor: '#3aa6a0', hatColor2: '#8fd4c8' },
    courses: ['medic', 'cook', 'lore'],
    likes: ['medicine', 'herb', 'spice'],
    dislikes: ['weapon', 'drink'],
  },
  {
    id: 'c_tupa', name: '图帕克', role: '星象舵手', cityId: 'inca', cost: 8_500, speed: 7, trade: 0,
    desc: '云中之城的舵手，夜里靠星星也能抄近路',
    color: '#b8860b',
    look: { skin: '#b57a4a', hair: '#141414', hairStyle: 'long', hat: 'feather', hatColor: '#b8860b', hatColor2: '#e8d44a', accessory: 'earring' },
    courses: ['nav', 'lore', 'scout'],
    likes: ['book', 'gem', 'music'],
    dislikes: ['luxury', 'drink'],
  },
]

/** 船员人物志与好感故事（v1.6）：bio = 人物志长文；stories = 好感达到 at 时解锁的往事 */
export const CREW_STORIES: Record<string, { bio: string; stories: { at: number; text: string }[] }> = {
  c_zheng: {
    bio: '生于珠江水上人家，十五岁那年珠江发大水，全家随船漂没，是红旗帮的舢板把她捞起来的。夫君郭婆带是帮中少帅，成亲才三年便战死在官军炮火里，二十出头的她被众叔伯硬推上了龙头之位。她立的规矩比官府还硬：劫官船不劫渔船，抢粮仓不抢药铺，伤了妇孺的当场沉海。如今帮众早散了大半，唯有她那枚铜令牌，老海盗们见了仍要低头叫一声当家。',
    stories: [
      { at: 20, text: '「我头回掌舵那年，帮里三个叔伯不服，联名要改立男丁。」她笑里藏着刀，「我当着全帮的面，把那封联名状就着灯烧了——火光里，再没人敢抬头看我。」' },
      { at: 45, text: '「有回官兵扮成商船来剿，我让妇孺先下小船撤。」她摩挲旧腰刀，「自己带人断后，那一夜江水红了一半。活回来的弟兄，从此只叫我当家的，不叫少奶奶。」' },
      { at: 70, text: '「你船上有规矩吗？」她忽然问。见你摇头，她点头，「没有也好。但记着一条——对穷苦人留条活路，海会记得。规矩是死的，人心是活的。」' },
      { at: 100, text: '她把那枚磨得发亮的铜令牌塞进你手心：「红旗帮散了，可这海上认令牌的老辈还在。往后遇着难处，报我郑一嫂三个字，有人会给你行个方便。这令牌，值一条命。」' },
    ],
  },
  c_mary: {
    bio: '英吉利海峡上最年轻的私掠船长，十七岁便凭着一张亲王亲签的私掠证，劫下生平第一条西班牙运银船。她长年男装出海，左眼蒙布不只是扮相，更是为了吓退那些认得她真容的仇家。三十年的刀口舔血，直到亲眼看着最要好的同伴被绞上港口的绞架，她才把船卖了，换身裙子做起体面买卖——可谈判桌上的她，算盘打得比舰炮还准。',
    stories: [
      { at: 20, text: '「我头一条船，是从赌桌上赢来的。」她转着酒杯，「对面船长输红了眼，连船带货押上，偏巧那晚我手气旺。打那起我信一条：海上的输赢，开赌前就定了。」' },
      { at: 45, text: '「有个西班牙伯爵，悬赏要我左手。」她指了指眼罩，「因为这只眼，是他家护卫的弯刀留的。后来他的货船撞上我的私掠证——你说巧不巧，债是要还的。」' },
      { at: 70, text: '「做买卖这些年，我学了比开炮还难的事：等人还价。」她难得正色，「炮一响就定了，价能谈一整宿。你一急，就输了。沉住气，船长。」' },
      { at: 100, text: '她从怀里掏出那张泛黄的私掠证塞给你：「留着。哪天岸上待腻了，海上那条路我替你留着门。不过——别学我蒙这只眼，遇着风沙真疼。」' },
    ],
  },
  c_sinbad: {
    bio: '巴士拉港的茶馆里，说书人最爱拍着惊堂木讲他的故事：巨鸟、海怪、磁石山、会唱歌的沉船，七次远航每一次都像一段神话。可真实的老辛巴达只是个极精明的领航员，所谓的巨鸟不过是大鹰，海怪是缠满藤壶的朽木。他从不拆穿说书人——「故事比真相值钱，听客掏的铜板，买的是惊险，不是实数。」如今他头发花白，却仍是这片海里最认得风的人。',
    stories: [
      { at: 20, text: '「人们只记得我第几次差点死，没人记得我怎么活下来。」他指指脑袋，「记性、耐心，再加一点好运——这就是航海家全部的当心家当。海不挑人，它只挑肯学的人。」' },
      { at: 45, text: '「说书人讲我斗巨鸟，其实那是只大鹰，叼走了我的帽子。」他笑，「可你说给茶馆听，谁爱听真话？故事要惊险，账要实数，两码事。」' },
      { at: 70, text: '「第七次远航回来我就发誓不再出海。」他把旧罗盘递给你，「可跟着你跑了几程，我又想多讲一个故事了。看来誓言这东西，遇着对的人就软。」' },
      { at: 100, text: '他拍拍你肩：「罗盘我留了半辈子，今个给你。它指的不是北，是‘该去的地方’。你信它，它就灵。下一段故事，该你来讲了。」' },
    ],
  },
  c_zhenghe: {
    bio: '宝船舰队的总帅，当年率两百余艘巨舰七下西洋，最远抵得过赤道以南的远邦。朝廷裁撤宝船后，他留在马六甲的港务司里，整日伏案重抄那部半毁的航海志。年轻人笑他守着旧纸，他只摇头：「舰队散了，海还在。后人要出海，总得有人告诉他们哪儿有暗礁、哪儿有淡水。」',
    stories: [
      { at: 20, text: '「舰队最盛时，两百余艘船，桅杆如林，夜里灯火照得海面发红。」他望着港口，「可我记最牢的，是风暴夜里每一盏不肯熄的灯——那是活人的念想。」' },
      { at: 45, text: '「朝廷说宝船费钱，把船都拆了。」他手指划过案上的旧图，「我没争。争来的船也是木，会烂。可这图上的风讯，烂不了。」' },
      { at: 70, text: '他把一册手抄航海志推到你面前：「西洋的暗礁、淡水的湾、哪国港口的人情，都在里面。舰队散了，海还在——你拿去，替我多看几眼。」' },
      { at: 100, text: '「我这一生，七下西洋，没丢过一艘船、一个人。」他极慢地说，「如今把这份安稳托付给你。航程长，记得常常靠岸，看看灯。」' },
    ],
  },
  c_raja: {
    bio: '孟买码头最大的搬运行里，拉吉·辛十六岁就扛起了别人扛不动的樟木箱。他爹是码头的老秤官，教他一句话：秤能骗人一时，骗不了一世。二十年下来，他练出一手绝活——不用开箱，掂一掂、闻一闻，就能报出货色成色，连最精的老板都挑不出错。他笑说自己是「用脚丈量过半条印度洋的人」。',
    stories: [
      { at: 20, text: '「我爹是码头秤官，临老教我：秤能骗人一时，骗不了一世。」拉吉拍拍胸口的旧秤砣，「所以我装货，从不短人一斤，口碑比银两圆。」' },
      { at: 45, text: '「有回一箱丝绸夹层藏了走私的火药，我掂出分量不对，当场拦下。」他压低声，「那一箱要是上船，半条船都没了。老板夸我，我只要了句实话。」' },
      { at: 70, text: '「跟你跑了几趟，攒的钱够回孟买开间小货栈了。」他咧嘴笑，「不过嘛，码头的风、船上的闹，货栈里可没有。我再陪你跑两年。」' },
      { at: 100, text: '临别他塞给你一把小铜秤：「带着。买卖公道，路才走得长。哪天你不想漂了，来孟买，我的栈门给你留着。」' },
    ],
  },
  c_kotaro: {
    bio: '九州渔村最小的儿子，生来坐不住，总爬上村口那棵老松往海里望。十二岁那年偷爬上过路的商船，被水手长拎下来时，怀里还揣着半块饭团。从那以后他认定自己属于桅杆而不是田地，身轻如燕，能在颠簸的帆索间睡觉。他的梦很简单也很野：攒够钱造一条自己的小船，去「海的那一边」亲眼看看。',
    stories: [
      { at: 20, text: '「村里的老人说，海的那边是龙神的国度。」他挠挠头，「我倒不是想见龙神，就是想亲眼看看，海到底有没有尽头。」' },
      { at: 45, text: '「上次风浪大，我爬上桅顶收帆，底下的人脸都白了。」他得意，「我在绳上睡惯了，晃？那是龙神在摇摇篮呢。」' },
      { at: 70, text: '他忽然认真：「船长，等我攒够了钱，能请你给我那条小船起个名字吗？要威风点的，比如‘斩浪’之类。」' },
      { at: 100, text: '「钱攒得差不多啦！」他掏出个木雕小帆船，「这是我照想的样子刻的。名字你来起，我信你起的，准能真出海。」' },
    ],
  },
  c_john: {
    bio: '北海的浪养大的孩子，从十四岁跟船打杂，到如今白胡子结了四十年盐霜。他认得每一段洋流的脾气，据说闭着眼能嗅出三天后的风暴，老水手们说他是「被海记住的人」。年轻时他有个孪生弟弟同船出海，约定谁先攒够钱就回村成家——可那一年的大风暴，只送回了他一个人。',
    stories: [
      { at: 20, text: '「年轻时我和弟弟各跟一条船，说好谁先攒够钱就回村成家。」他灌口烈酒，「后来我攒够了，他的船却再没回来。那年大风暴，海不讲情面。」' },
      { at: 45, text: '「打那以后我学了一手：看云识风。」他眯眼望天，「云压得低、泛着铁色，三天内必有风。这本事，是我用弟弟换来的，舍不得烂在肚里。」' },
      { at: 70, text: '「我这条老骨头，本来打算沉在北海里的。」他难得笑了，「现在嘛，再陪你跑几年。你船上热闹，比海底强。」' },
      { at: 100, text: '他把自己用了四十年的旧罗盘递来：「指针早偏了，可我闻风比看针准。给你，算个念想。哪天你迷了，别信针，信你闻到的海。」' },
    ],
  },
  c_pierre: {
    bio: '里昂名厨世家的旁支，打小在灶台边闻着勃艮第的红酒炖牛肉长大。只因一道汤的咸淡得罪了来赴宴的公爵夫人，他连夜卷了铺盖逃出家门，阴差阳错上了船。没想到一手家常炖菜，竟比船上的火药还管用——最挑剔的港口税官，吃过他一顿饭也能多宽限三天。他常说自己卖的不是菜，是人情。',
    stories: [
      { at: 20, text: '「厨艺的尽头不是味道，是人情。」他掂着汤勺，「让谁吃、什么时候吃、和谁一起吃——这三件事想明白了，谈判就赢了一半。」' },
      { at: 45, text: '「有回税官卡我们货，我请他吃了顿勃艮第炖牛肉。」他眨眼，「他边吃边松了口，那批货省下的税，够买十头牛。你看，灶台也是账房。」' },
      { at: 70, text: '「我要在普罗旺斯开间小馆子，只做给水手吃。」他擦擦手，「不过在那之前，你的船员归我喂饱。饿着的兵，打不了好仗，也谈不成好价。」' },
      { at: 100, text: '他塞给你一张油渍斑斑的配方：「这是我祖母的炖牛肉方子。哪天你不想跑船了，照着做，开个店，养活自己。别忘了，先喂饱人，再谈生意。」' },
    ],
  },
  c_diaz: {
    bio: '绕过好望角的狠角色，半张脸被非洲的日头烙下深褐的印。年轻时替王室探海，画的航线图被里斯本重金收进档案馆，本人却宁可蹲在甲板上抽他的烟斗。他见过的好望角风暴，比多数船长见过的晴天还多，船员私下叫他「不怕死的迪亚士」，他却说自己只是「回头路太远，只好往前」。',
    stories: [
      { at: 20, text: '「好望角那晚，浪比桅杆还高。」他吐个烟圈，「船员都在祷告，我在想——回头路更远，那就再往前走走看。怕，是最费帆的事。」' },
      { at: 45, text: '「王室收了我的航线图，封了爵位想留我。」他把烟斗在靴底磕磕，「我拒了。画图的手，不该困在档案室。航海人的封地，是整片海。」' },
      { at: 70, text: '「你走的线，比我当年野。」他难得有了精神，「好。海是给敢走的人留的，循规蹈矩的，只配在港里数浪。」' },
      { at: 100, text: '他解下腰间旧烟袋：「陪我半辈子了，给你。想家或想不通时，抽一口，看会儿海——答案都在浪里，不在陆上。」' },
    ],
  },
  c_katalina: {
    bio: '塞维利亚炮术世家的独女，因一场决斗风波，连夜随商船远走新大陆。红发烈性，自幼摸炮，装填速度是寻常炮手的两倍，据说闭着眼都能在三百步外命中靶船的桅杆。她从不让男人替她上膛，腰间别着兄长留下的火折子，说那是「主炮第一响的引子」。',
    stories: [
      { at: 20, text: '「我兄长教我开炮，说炮响之前，先想清楚为谁而响。」她擦着炮膛，「那时我不懂。后来懂了：为船，为船上的弟兄，不是为勋章。」' },
      { at: 45, text: '「那场决斗，是为护一个被欺的船娘。」她眼神冷了冷，「他们笑女人碰不得炮。我让他们看看，火光里分不出男女，只分得出准不准。」' },
      { at: 70, text: '「新大陆的银子买不到的东西，我在这条船上找到了。」她把家传火折子递来，「以后主炮的第一响，永远为你放。这是承诺，不是客气。」' },
      { at: 100, text: '她握住你手，把火折子按进掌心：「火折子燃过三百仗，从没哑过。你是我认的船长，它认你。往后风浪再大，炮响处，我在。」' },
    ],
  },
  c_kwame: {
    bio: '好望角渔村出身，左脸一道弯疤，是与一条虎鲨搏命的纪念。风浪越大他越兴奋，收网时唱的渔歌能压过浪头，船员们笑称他是「海神发小」。他认得每一处暗礁后的避风湾，也认得哪片云里藏着雨——在这片吃人的海里，他活成了最被偏爱的那个。',
    stories: [
      { at: 20, text: '「这道疤？十六岁那年一条虎鲨送的。」他笑露白牙，「它咬我一口，我捅它三刀——海里的规矩，讲究个礼尚往来，不白挨。」' },
      { at: 45, text: '「有回遇着暗礁，全船慌，我凭记认出那是小时候躲过的湾。」他拍胸，「海神发小不是白叫的，它认得我，我也认得它的脾气。」' },
      { at: 70, text: '「我妈说我是海神庙里挂名的孩子。」他望着浪，「跟着你跑了这么远，我看海神是点了头，默认了。那我更得替它照看这船。」' },
      { at: 100, text: '他解下颈间一小串鲨齿：「这是我第一条鲨的牙。给你，挂着。海再狠，也认肯跟它打交道的人。你够胆，它护你。」' },
    ],
  },
  c_daisy: {
    bio: '代尔夫特商人的长女，本该继承父辈的账房与运河边的宅子，却偏爱上爬桅杆。她的目力惊人，站上桅顶能分辨十海里外船帆的国籍，顺带算出对方载的是香料还是火药。父亲气得撕了她的嫁妆单，她却把账本一推：「账房里的数字会骗人，桅杆上看见的，才是真金。」',
    stories: [
      { at: 20, text: '「父亲说我眼睛里全是浪，留不住钱。」她从桅顶跳下，「可他不知道，桅杆上看得的每一笔生意，都比账房里算的值钱——我看见的是真金。」' },
      { at: 45, text: '「有回我望见十海里外是敌船，报了你不信，结果绕开一劫。」她耸肩，「账本能算盈亏，算不出远处的帆。信我眼睛，省你半条命。」' },
      { at: 70, text: '「我给家里去了封信，附了张自己画的航海图。」她眨眼，「落款写：您的女儿，是一名航海家。父亲回了信，只说‘别累着眼睛’。」' },
      { at: 100, text: '她把那支随身的小望远镜递来：「陪我望过无数远帆。给你，替我看更远的。海的那头有什么，我猜了一辈子，该你去看真相了。」' },
    ],
  },
  c_nefertari: {
    bio: '亚历山大港数得着的大商贾，手掌一摸货色，比秤还准。她做生意的规矩全城闻名：价可以谈，货不能假，掺假的伙计她当场请出柜台。十二岁替瞎眼的父亲看铺，一场沙暴毁了整仓亚麻，她却在那次亏空里悟出道理——商人真正的本钱不是货，是信了她的人。',
    stories: [
      { at: 20, text: '「我十二岁替瞎眼父亲看铺，一场沙暴毁了整仓亚麻。」她转着戒指，「那年我懂：商人真正的本钱不是货，是信了你好、肯再来的人。」' },
      { at: 45, text: '「有个伙计往香料里掺沙，我当场请他出柜台。」她淡淡，「街坊说我狠。可今天省一勺沙，明天丢的是整条街的信任，划不来。」' },
      { at: 70, text: '「我在尼罗河边给你留了块地。」她难得笑，「盖个货栈吧——商人的情谊，就该用生意来还。你帮我跑货，我给你落脚处。」' },
      { at: 100, text: '她把一枚印章塞给你：「这是我铺子的章，认货也认人。往后你运来的，盖了这章就是‘奈菲尔塔莉家’的，全港认。这是信，不是印。」' },
    ],
  },
  c_rustam: {
    bio: '《列王纪》里英雄鲁斯塔姆的旁系后人，打小听着先祖斩妖的史诗长大。他没去战场，却干了十五年押镖，黄金、宝石、王冠都押过，一趟没丢。他话少，腰间弯刀却从不出鞘——老镖师说，刀出鞘是要见血的，能不动刀化解的，都不叫事。',
    stories: [
      { at: 20, text: '「祖父教我刀法，第一课不是出刀，是收刀。」他按着刀柄，「让人怕你容易，让人信你，难。我押了十五年镖，靠的是后头这句。」' },
      { at: 45, text: '「有回遇匪，我没拔刀，只把货往地上一放，说‘拿去，但记着是谁给的’。」他平静，「他们真拿了，可后来那帮人再没劫过我们的船。」' },
      { at: 70, text: '「我这辈子押过黄金、宝石、王冠。」他第一次笑得轻松，「最难押的原来是人心——而你这条船，我押对了。人心这镖，我接了。」' },
      { at: 100, text: '他解下腰间弯刀横在你面前：「它从没为钱出过鞘。今个给你——不是让你砍，是让你记着：能不动刀化解的，都不叫事。船交你，我放心。」' },
    ],
  },
  c_vira: {
    bio: '科伦坡宝石街最好的匠人之一，家传四代的鉴石眼力。据说她把宝石贴在耳边听一听，就知道它埋在哪一国的河床、沾过谁的手。老板们出三倍工钱想挖她去大埠，她都摇头——「街角那家小铺，是我祖母磨了一辈子的，我舍不得。」',
    stories: [
      { at: 20, text: '「这颗蓝宝石里有一丝云。」她对着光，「和我祖母当年留下的一模一样。宝石会记事——就像人，磨不掉来处。」' },
      { at: 45, text: '「有回客人拿假祖母绿来骗，我贴耳一听就笑了。」她摇头，「石头不说话，可它震动的频率会。真假，耳朵比眼睛诚实。」' },
      { at: 70, text: '「我打磨了此生最得意的四方宝石。」她把锦盒推来，「等你哪天不跑船了，它替我向你问好。也算我这行当，给你留个念。」' },
      { at: 100, text: '她解下颈间一枚祖传的蓝石坠子：「磨了我祖母、我娘、我三代的手。给你，挂着。好货要识货的人戴，就像好船要懂海的人开。」' },
    ],
  },
  c_bayu: {
    bio: '爪哇火山脚下长大的孩子，看云识风比看罗盘还准。闲下来就嚼着槟榔，讲山神打喷嚏、海就得跟着抖三抖的怪谈，船员们半信半疑，却不得不服他报的风向。那次火山灰落了满甲板，全船慌作一团，唯他稳稳掌舵：「别怕，山神在给咱们的船撒圣灰呢。」',
    stories: [
      { at: 20, text: '「那次火山灰落了满甲板，大伙都慌。」他嚼槟榔笑，「我说别怕，山神在给咱们的船撒圣灰呢——这叫开光。后来真顺风顺水。」' },
      { at: 45, text: '「云往哪边跑，雨就在哪边等。」他指天，「罗盘指北，可风不认北。我看云比看针准，你信我，少绕三程路。」' },
      { at: 70, text: '「我娘托商队捎了袋家乡咖啡豆。」他把袋子塞你，「船上的活我多干点，你多分我几杯就行。家乡味，抵得半程想家。」' },
      { at: 100, text: '他掏出个火山石雕的小像：「山神的样子，我照记忆刻的。给你，挂船上。它护过我这条命，也护你的。风浪大时，摸摸它。」' },
    ],
  },
  c_mira: {
    bio: '香草庄园的第三代药师，精通草药与香料配伍。她的晕船药和腌菜方子，是全船的命根子——没有它们，半船人到了好望角都得趴在船舷吐。她脾气和药一样，苦口但管用，船员嫌她啰嗦，真遇上寒热时却第一个找她。她说香草不认贵贱，谁需要，它就救谁。',
    stories: [
      { at: 20, text: '「我祖母用香草救过一船瘟病的水手。」她捣药臼，「药草不认贵贱，谁需要，它就救谁。这道理，我用来待人。」' },
      { at: 45, text: '「有回半船人晕浪吐虚了，我的药下去，第二天全活蹦乱跳。」她别过脸，「他们谢我，我嫌吵。药到就好，谢什么。」' },
      { at: 70, text: '「我配了副新药，专治想家的病。」她难得软了声调，「成分保密——反正船长你要是想家了，就来找我。这病，我包治。」' },
      { at: 100, text: '她塞给你一个小布囊：「里头是安神的香草，闻着像家。跑远了、睡不着时打开。我治得了全船，也得治得了你这个船长。」' },
    ],
  },
  c_tupa: {
    bio: '安第斯山城的观星者后裔，族人说他「把星星当亲戚认」。他白天睡觉，夜里掌舵，靠南十字星就能在不见陆地的黑夜里定位。祭司说他天生属于夜空，不该困在甲板，他却笑：「夜里的海最老实，它只对星星说真话，而我听得懂。」',
    stories: [
      { at: 20, text: '「祭司说，星星是先祖的眼睛。」他仰头指南十字，「迷路时别看海，看天——先祖一直都在，他们认得你回的路。」' },
      { at: 45, text: '「有回浓雾三天不见岸，我靠星星把船领回航道。」他平静，「船员说我疯，可星星从没骗过我。海会吞人，天不会。」' },
      { at: 70, text: '「我给一颗最亮的星起了你的名字。」他难得郑重，「往后夜里掌舵，等于你陪我一起走。你不在甲板，也在天上看着。」' },
      { at: 100, text: '他把一册手绘星图铺开：「这是我们山城传了十二代的星位。给你，照着走，黑夜再长也不迷。先祖的眼睛，替你亮着。」' },
    ],
  },
}

export const CREW_BY_ID: Record<string, CrewMember> = Object.fromEntries(
  CREW.map(c => [c.id, c]),
)

/** 船名未填写时的默认显示 */
export const DEFAULT_SHIP_NAME = '我的商船'
/** 显示用船名：玩家自定义为空时回退到默认名 */
export function shipDisplayName(shipName: string, shipClassName?: string): string {
  const n = shipName.trim()
  if (n) return n
  return shipClassName ? `${DEFAULT_SHIP_NAME}·${shipClassName}` : DEFAULT_SHIP_NAME
}
/** 取名最长字符数（中文/中文标点按 1 个字符计） */
export const SHIP_NAME_MAX = 12

/** 海面上其他商船 —— 沿固定航线循环航行 */
export interface AiShip {
  id: string
  name: string
  color: string
  from: string
  to: string
  /** 相位偏移 0-1，让船只错开 */
  offset: number
}

export const AI_SHIPS: AiShip[] = [
  { id: 'a1', name: '海洋之心', color: '#e87070', from: 'china', to: 'malacca', offset: 0.00 },
  { id: 'a2', name: '破浪号', color: '#5aaedc', from: 'norway', to: 'arabia', offset: 0.22 },
  { id: 'a3', name: '翡翠风帆', color: '#4cba6a', from: 'india', to: 'srilanka', offset: 0.55 },
  { id: 'a4', name: '星辉号', color: '#9b6ee0', from: 'africa', to: 'india', offset: 0.15 },
  { id: 'a5', name: '金羊毛号', color: '#f5c830', from: 'arabia', to: 'china', offset: 0.68 },
  { id: 'a6', name: '云帆号', color: '#f5913a', from: 'malacca', to: 'africa', offset: 0.42 },
  { id: 'a7', name: '银鸥号', color: '#8fd4e8', from: 'srilanka', to: 'norway', offset: 0.80 },
  { id: 'a8', name: '黑钻号', color: '#c9b394', from: 'aztec', to: 'france', offset: 0.33 },
  { id: 'a9', name: '武藏丸', color: '#e070a0', from: 'japan', to: 'java', offset: 0.10 },
  { id: 'a10', name: '尼罗之星', color: '#7fc8a0', from: 'egypt', to: 'persia', offset: 0.72 },
]

export interface Milestone {
  id: string
  label: string
  target: number
  gold: number
  boost: number
  icon: GlyphName
}

export const MILESTONES: Milestone[] = [
  { id: 'm1', label: '初出茅庐', target: 5_000, gold: 1_000, boost: 1, icon: 'target' },
  { id: 'm2', label: '初级商人', target: 20_000, gold: 3_000, boost: 1, icon: 'coin' },
  { id: 'm3', label: '见习商人', target: 60_000, gold: 8_000, boost: 2, icon: 'crate' },
  { id: 'm4', label: '海上商人', target: 150_000, gold: 20_000, boost: 3, icon: 'compass' },
  { id: 'm5', label: '东方富商', target: 400_000, gold: 50_000, boost: 5, icon: 'amphora' },
  { id: 'm6', label: '大航海王', target: 1_000_000, gold: 120_000, boost: 10, icon: 'crown' },
  // ── v1.1.0 通关后阶段 ──
  { id: 'm7', label: '七海豪商', target: 3_000_000, gold: 250_000, boost: 12, icon: 'globe' },
  { id: 'm8', label: '海上巨富', target: 10_000_000, gold: 800_000, boost: 20, icon: 'gem' },
  { id: 'm9', label: '七海霸主', target: 100_000_000, gold: 8_000_000, boost: 50, icon: 'horn' },
]

/** 贸易成就：按到达城市数 / 买过商品数 / 卖过商品数 / 交易过商品数（买卖并集）解锁 */
export interface AchievementDef {
  id: string
  label: string
  icon: GlyphName
  desc: string
  target: number
  kind: 'visited' | 'bought' | 'sold' | 'traded'
}

export const ACHIEVEMENTS: AchievementDef[] = [
  // ── 足迹 ──
  { id: 'av1', icon: 'compass', label: '初次远航', desc: '到达 2 座城市', target: 2, kind: 'visited' },
  { id: 'av2', icon: 'map', label: '见识渐广', desc: '到达 6 座城市', target: 6, kind: 'visited' },
  { id: 'av3', icon: 'globe', label: '环游四海', desc: '到达 12 座城市', target: 12, kind: 'visited' },
  { id: 'av4', icon: 'orbit', label: '世界尽头', desc: '到达 18 座城市', target: 18, kind: 'visited' },
  { id: 'av5', icon: 'globe', label: '全球通', desc: '到达全部 23 座城市', target: 23, kind: 'visited' },
  // ── 采购 ──
  { id: 'ab1', icon: 'loadIn', label: '尝鲜买家', desc: '买过 5 种商品', target: 5, kind: 'bought' },
  { id: 'ab2', icon: 'cart', label: '收购达人', desc: '买过 12 种商品', target: 12, kind: 'bought' },
  { id: 'ab3', icon: 'box', label: '万货通', desc: '买过 20 种商品', target: 20, kind: 'bought' },
  { id: 'ab4', icon: 'gem', label: '全品收购家', desc: `买过全部 ${GOODS.length} 种商品`, target: GOODS.length, kind: 'bought' },
  // ── 出售 ──
  { id: 'as1', icon: 'purse', label: '第一桶金', desc: '卖出过 5 种商品', target: 5, kind: 'sold' },
  { id: 'as2', icon: 'exchange', label: '销售行家', desc: '卖出过 12 种商品', target: 12, kind: 'sold' },
  { id: 'as3', icon: 'trendUp', label: '大批发商', desc: '卖出过 20 种商品', target: 20, kind: 'sold' },
  { id: 'as4', icon: 'crown', label: '垄断商人', desc: `卖出过全部 ${GOODS.length} 种商品`, target: GOODS.length, kind: 'sold' },
  // ── 买过且卖过（并集）──
  { id: 'at1', icon: 'scale', label: '两头通吃', desc: '交易过（买或卖）10 种商品', target: 10, kind: 'traded' },
  { id: 'at2', icon: 'swap', label: '全链路商人', desc: `交易过（买或卖）全部 ${GOODS.length} 种商品`, target: GOODS.length, kind: 'traded' },
]

/** 传奇功勋：通关（大航海王）之后的长线目标，全部基于已持久化的计数器，老存档自动结算 */
export interface LegendDef {
  id: string
  icon: GlyphName
  label: string
  desc: string
  kind: 'assets' | 'trades' | 'profit' | 'distance' | 'best' | 'ships' | 'crew' | 'cities' | 'atlas' | 'events'
  target: number
  gold: number
  boost: number
}

export const LEGENDS: LegendDef[] = [
  { id: 'lg-cities', icon: 'orbit', label: '万国来朝', desc: `到访全部 ${CITIES.length} 座城市`, kind: 'cities', target: CITIES.length, gold: 80_000, boost: 4 },
  { id: 'lg-atlas', icon: 'book', label: '万货图鉴', desc: `买卖过全部 ${GOODS.length} 种商品`, kind: 'atlas', target: GOODS.length, gold: 80_000, boost: 4 },
  { id: 'lg-fleet', icon: 'shipRoyal', label: '船队大亨', desc: `集齐全部 5 艘常规船（传奇宝船除外）`, kind: 'ships', target: 5, gold: 100_000, boost: 5 },
  { id: 'lg-crew', icon: 'beer', label: '众星云集', desc: `招募全部 ${CREW.length} 位船员`, kind: 'crew', target: CREW.length, gold: 120_000, boost: 5 },
  { id: 'lg-best', icon: 'medal', label: '世纪豪赌', desc: '单笔利润达到 10 万金', kind: 'best', target: 100_000, gold: 120_000, boost: 5 },
  { id: 'lg-trades', icon: 'swap', label: '商路不息', desc: '完成 500 笔交易', kind: 'trades', target: 500, gold: 150_000, boost: 6 },
  { id: 'lg-distance', icon: 'compass', label: '海上生涯', desc: '累计航行 10 万海里', kind: 'distance', target: 100_000, gold: 150_000, boost: 6 },
  { id: 'lg-profit', icon: 'trendUp', label: '日进斗金', desc: '累计利润 200 万金', kind: 'profit', target: 2_000_000, gold: 200_000, boost: 8 },
  { id: 'lg-events', icon: 'wave', label: '命运弄人', desc: '经历 100 次海上事件', kind: 'events', target: 100, gold: 60_000, boost: 3 },
  { id: 'lg-wealth', icon: 'crown', label: '富可敌国', desc: '总资产达到 500 万金', kind: 'assets', target: 5_000_000, gold: 300_000, boost: 10 },
]

/** 集齐全部传奇功勋后的终极称号 */
export const LEGEND_TITLE = '传奇船长'

export const TITLES: { min: number; name: string }[] = [
  { min: 0, name: '初出茅庐' },
  { min: 20_000, name: '初级商人' },
  { min: 60_000, name: '见习商人' },
  { min: 150_000, name: '海上商人' },
  { min: 400_000, name: '东方富商' },
  { min: 1_000_000, name: '大航海王' },
  // ── v1.1.0 通关后称号 ──
  { min: 3_000_000, name: '七海豪商' },
  { min: 10_000_000, name: '海上巨富' },
  { min: 100_000_000, name: '七海霸主' },
]

// ── 季节 / 季风（v1.1.0）──────────────────────────────────────────────────────
// 由 clock 推导（SEASON_LEN 一换），完全不落盘：旧档读进来天然继承当前季节

/** 每季时长（秒） */
export const SEASON_LEN = 300

export interface SeasonDef {
  id: string
  name: string
  icon: GlyphName
  /** 面向玩家的效果说明 */
  desc: string
  /** 该季风覆盖的海域：驶入这些港口航速 +20% */
  windCities: string[]
  /** 该季需求看涨的商品：紧缺刷新时优先挑它们 */
  boostGoods: string[]
}

export const SEASONS: SeasonDef[] = [
  {
    id: 'spring', name: '春季 · 东信风', icon: 'flower',
    desc: '东亚航线提速 20%，茶丝纸漆需求看涨',
    windCities: ['china', 'japan', 'malacca', 'java', 'borneo'],
    boostGoods: ['tea', 'silk', 'porcelain', 'nest', 'paper', 'lacquer'],
  },
  {
    id: 'summer', name: '夏季 · 西南季风', icon: 'sun',
    desc: '印度洋航线提速 20%，香料染料需求看涨',
    windCities: ['india', 'srilanka', 'arabia', 'oman', 'persia', 'madagascar'],
    boostGoods: ['spice', 'clove', 'coffee', 'pearl', 'frankincense', 'indigo', 'cinnamon'],
  },
  {
    id: 'autumn', name: '秋季 · 西风带', icon: 'leaf',
    desc: '欧洲航线提速 20%，美食珍馐需求看涨',
    windCities: ['norway', 'england', 'france', 'netherlands', 'spain', 'egypt'],
    boostGoods: ['wine', 'wool', 'whisky', 'perfume', 'watch', 'cheese', 'truffle', 'caviar'],
  },
  {
    id: 'winter', name: '冬季 · 东北季风', icon: 'snow',
    desc: '新大陆航线提速 20%，矿产皮货需求看涨',
    windCities: ['africa', 'aztec', 'inca', 'panama'],
    boostGoods: ['gold', 'silver', 'gem', 'cacao', 'fur', 'tobacco', 'diamond', 'alpaca', 'leather'],
  },
]

/** 当前季节（由游戏时钟推导，无需存档） */
export function seasonOf(clock: number): SeasonDef {
  return SEASONS[Math.floor(clock / SEASON_LEN) % SEASONS.length]
}

// ── 港口声望（v1.1.0）─────────────────────────────────────────────────────────
// 靠港 +3、每笔交易 +2；声望换价格优惠（每 5 点 1%，上限 15%）

export const REP_MAX = 150
/** 每点声望的到达/交易增量 */
export const REP_GAIN_ARRIVE = 3
export const REP_GAIN_TRADE = 2

export const REP_TIERS: { min: number; name: string }[] = [
  { min: 0, name: '初来乍到' },
  { min: 10, name: '熟面孔' },
  { min: 30, name: '港口常客' },
  { min: 60, name: '城中名人' },
  { min: 100, name: '一城传奇' },
]

export function repTierName(rep: number): string {
  let name = REP_TIERS[0].name
  for (const t of REP_TIERS) if (rep >= t.min) name = t.name
  return name
}

// ── 船员委托（v1.1.0）─────────────────────────────────────────────────────────
// 每位船员 3 段小任务链：招募后解锁第 1 段，逐段领取。
// 判定全部基于已有计数器 / 新增 rep 字段，旧存档自动结算。

export type QuestCond =
  | { kind: 'visit'; cityId: string }
  | { kind: 'tradeGood'; goodId: string }
  | { kind: 'assets'; target: number }
  | { kind: 'trades'; target: number }
  | { kind: 'distance'; target: number }
  | { kind: 'best'; target: number }
  | { kind: 'cities'; target: number }
  | { kind: 'atlas'; target: number }
  | { kind: 'events'; target: number }
  | { kind: 'profit'; target: number }
  | { kind: 'crewCount'; target: number }
  | { kind: 'ship'; shipId: string }
  | { kind: 'rep'; cityId: string; target: number }

export interface CrewQuestDef {
  id: string
  crewId: string
  stage: 1 | 2 | 3
  title: string
  desc: string
  cond: QuestCond
  gold: number
  boost: number
}

export const CREW_QUESTS: CrewQuestDef[] = [
  // 郑一嫂（中国 · 航海家）
  { id: 'q_zheng_1', crewId: 'c_zheng', stage: 1, title: '红旗帮的考验', desc: '把丝绸装上船，见识一下海上的生意', cond: { kind: 'tradeGood', goodId: 'silk' }, gold: 8_000, boost: 1 },
  { id: 'q_zheng_2', crewId: 'c_zheng', stage: 2, title: '海图上的旧路', desc: '亲自去一趟马六甲，红旗帮的老巢就在那片海', cond: { kind: 'visit', cityId: 'malacca' }, gold: 20_000, boost: 2 },
  { id: 'q_zheng_3', crewId: 'c_zheng', stage: 3, title: '南海女王', desc: '累计航行 3 万海里，让整片南海记住你的帆', cond: { kind: 'distance', target: 30_000 }, gold: 60_000, boost: 5 },
  // 玛丽·雷德（英国 · 航海家）
  { id: 'q_mary_1', crewId: 'c_mary', stage: 1, title: '私掠者的直觉', desc: '做一笔利润 5,000 金的大买卖给她看看', cond: { kind: 'best', target: 5_000 }, gold: 10_000, boost: 1 },
  { id: 'q_mary_2', crewId: 'c_mary', stage: 2, title: '伦敦的老主顾', desc: '在英国混到「港口常客」的名声（声望 30）', cond: { kind: 'rep', cityId: 'england', target: 30 }, gold: 30_000, boost: 3 },
  { id: 'q_mary_3', crewId: 'c_mary', stage: 3, title: '讨价还价之王', desc: '累计利润 50 万金，让谈判桌对面闻风丧胆', cond: { kind: 'profit', target: 500_000 }, gold: 90_000, boost: 6 },
  // 辛巴达（阿拉伯 · 航海家）
  { id: 'q_sinbad_1', crewId: 'c_sinbad', stage: 1, title: '第七次远航', desc: '把船开到印度，那是辛巴达故事开始的地方', cond: { kind: 'visit', cityId: 'india' }, gold: 8_000, boost: 1 },
  { id: 'q_sinbad_2', crewId: 'c_sinbad', stage: 2, title: '风暴前方', desc: '完成 100 笔交易，老船长教你看云识风', cond: { kind: 'trades', target: 100 }, gold: 25_000, boost: 2 },
  { id: 'q_sinbad_3', crewId: 'c_sinbad', stage: 3, title: '七海传说', desc: '到访全部 23 座城市，走完辛巴达没走完的路', cond: { kind: 'cities', target: 23 }, gold: 80_000, boost: 6 },
  // 郑和（马六甲 · 大航海家）
  { id: 'q_zhenghe_1', crewId: 'c_zhenghe', stage: 1, title: '宝船队的遗产', desc: '购入大型商船，重现宝船的气势', cond: { kind: 'ship', shipId: 'galleon' }, gold: 30_000, boost: 3 },
  { id: 'q_zhenghe_2', crewId: 'c_zhenghe', stage: 2, title: '满剌加的旧盟', desc: '在马六甲攒下「港口常客」的名声（声望 40）', cond: { kind: 'rep', cityId: 'malacca', target: 40 }, gold: 50_000, boost: 4 },
  { id: 'q_zhenghe_3', crewId: 'c_zhenghe', stage: 3, title: '舰队总帅', desc: '招募 8 位船员，组建属于你的宝船队', cond: { kind: 'crewCount', target: 8 }, gold: 100_000, boost: 8 },
  // 拉吉·辛（印度 · 水手长）
  { id: 'q_raja_1', crewId: 'c_raja', stage: 1, title: '香料之路', desc: '经手一批香料，这是印度洋的硬通货', cond: { kind: 'tradeGood', goodId: 'spice' }, gold: 6_000, boost: 1 },
  { id: 'q_raja_2', crewId: 'c_raja', stage: 2, title: '压舱的艺术', desc: '资产达到 5 万金，压舱货也是钱', cond: { kind: 'assets', target: 50_000 }, gold: 20_000, boost: 2 },
  { id: 'q_raja_3', crewId: 'c_raja', stage: 3, title: '印度洋之主', desc: '资产达到 50 万金，孟买的码头为你让路', cond: { kind: 'assets', target: 500_000 }, gold: 60_000, boost: 5 },
  // 小太郎（日本 · 水手）
  { id: 'q_kotaro_1', crewId: 'c_kotaro', stage: 1, title: '东洋刀之路', desc: '经手一批东洋刀，见识岛国的锻造', cond: { kind: 'tradeGood', goodId: 'sword' }, gold: 6_000, boost: 1 },
  { id: 'q_kotaro_2', crewId: 'c_kotaro', stage: 2, title: '樱花航线', desc: '把船开到中国，师父说那里的瓷器最漂亮', cond: { kind: 'visit', cityId: 'china' }, gold: 15_000, boost: 1 },
  { id: 'q_kotaro_3', crewId: 'c_kotaro', stage: 3, title: '疾风收帆', desc: '累计航行 5 万海里，桅杆上再也没人比你快', cond: { kind: 'distance', target: 50_000 }, gold: 50_000, boost: 4 },
  // 老约翰（挪威 · 老水手）
  { id: 'q_john_1', crewId: 'c_john', stage: 1, title: '北海的老朋友', desc: '经手一批皮草，北海的硬通货', cond: { kind: 'tradeGood', goodId: 'fur' }, gold: 6_000, boost: 1 },
  { id: 'q_john_2', crewId: 'c_john', stage: 2, title: '四十年洋流', desc: '把船开到南非，老约翰当年就在好望角翻的船', cond: { kind: 'visit', cityId: 'africa' }, gold: 20_000, boost: 2 },
  { id: 'q_john_3', crewId: 'c_john', stage: 3, title: '老水手的罗盘', desc: '经历 80 次海上事件，什么风浪都见过了', cond: { kind: 'events', target: 80 }, gold: 60_000, boost: 5 },
  // 皮埃尔（法国 · 大厨）
  { id: 'q_pierre_1', crewId: 'c_pierre', stage: 1, title: '一锅好炖菜', desc: '经手一批葡萄酒，炖菜的秘密就在酒里', cond: { kind: 'tradeGood', goodId: 'wine' }, gold: 6_000, boost: 1 },
  { id: 'q_pierre_2', crewId: 'c_pierre', stage: 2, title: '米其林航海', desc: '在法国攒下「港口常客」的名声（声望 30）', cond: { kind: 'rep', cityId: 'france', target: 30 }, gold: 25_000, boost: 2 },
  { id: 'q_pierre_3', crewId: 'c_pierre', stage: 3, title: '美食家的环球梦', desc: `买卖过全部 ${GOODS.length} 种商品，凑齐一桌满汉全席`, cond: { kind: 'atlas', target: GOODS.length }, gold: 80_000, boost: 6 },
  // 迪亚士（西班牙 · 航海家）
  { id: 'q_diaz_1', crewId: 'c_diaz', stage: 1, title: '好望角的记忆', desc: '把船开到南非，替迪亚士再看一眼好望角', cond: { kind: 'visit', cityId: 'africa' }, gold: 10_000, boost: 1 },
  { id: 'q_diaz_2', crewId: 'c_diaz', stage: 2, title: '顺风航线', desc: '完成 200 笔交易，学会等风来', cond: { kind: 'trades', target: 200 }, gold: 40_000, boost: 3 },
  { id: 'q_diaz_3', crewId: 'c_diaz', stage: 3, title: '绕过世界之角', desc: '累计利润 100 万金，把好望角甩在身后', cond: { kind: 'profit', target: 1_000_000 }, gold: 80_000, boost: 6 },
  // 卡塔丽娜（阿兹特克 · 炮手）
  { id: 'q_katalina_1', crewId: 'c_katalina', stage: 1, title: '红发炮神', desc: '经手一批白银，新大陆的白色黄金', cond: { kind: 'tradeGood', goodId: 'silver' }, gold: 8_000, boost: 1 },
  { id: 'q_katalina_2', crewId: 'c_katalina', stage: 2, title: '新大陆的白银', desc: '把船开到印加，云中之城黄金遍地', cond: { kind: 'visit', cityId: 'inca' }, gold: 25_000, boost: 2 },
  { id: 'q_katalina_3', crewId: 'c_katalina', stage: 3, title: '商路护卫', desc: '单笔利润 5 万金，红发炮神护航的商队不愁卖', cond: { kind: 'best', target: 50_000 }, gold: 70_000, boost: 5 },
  // 夸梅（南非 · 水手）
  { id: 'q_kwame_1', crewId: 'c_kwame', stage: 1, title: '黄金海岸', desc: '经手一批黄金，几内亚湾的金砂', cond: { kind: 'tradeGood', goodId: 'gold' }, gold: 8_000, boost: 1 },
  { id: 'q_kwame_2', crewId: 'c_kwame', stage: 2, title: '好望角冲浪', desc: '把船开到马达加斯加，猴面包树下歇歇脚', cond: { kind: 'visit', cityId: 'madagascar' }, gold: 20_000, boost: 2 },
  { id: 'q_kwame_3', crewId: 'c_kwame', stage: 3, title: '风浪越大越欢', desc: '经历 120 次海上事件，好望角的浪也认得你', cond: { kind: 'events', target: 120 }, gold: 60_000, boost: 5 },
  // 范黛西（荷兰 · 瞭望手）
  { id: 'q_daisy_1', crewId: 'c_daisy', stage: 1, title: '桅顶之眼', desc: '把船开到挪威，从桅顶望一眼峡湾', cond: { kind: 'visit', cityId: 'norway' }, gold: 8_000, boost: 1 },
  { id: 'q_daisy_2', crewId: 'c_daisy', stage: 2, title: '十海里外的商机', desc: '经手一批钟表，荷兰人的精密手艺', cond: { kind: 'tradeGood', goodId: 'watch' }, gold: 20_000, boost: 2 },
  { id: 'q_daisy_3', crewId: 'c_daisy', stage: 3, title: '郁金香的国度', desc: '在荷兰攒下「城中名人」的名声（声望 60）', cond: { kind: 'rep', cityId: 'netherlands', target: 60 }, gold: 60_000, boost: 5 },
  // ── v1.2.0 新船员委托 ──
  { id: 'q_nefertari_1', crewId: 'c_nefertari', stage: 1, title: '尼罗河的验货单', desc: '经手一批长绒棉，埃及的白色黄金', cond: { kind: 'tradeGood', goodId: 'cotton' }, gold: 7_000, boost: 1 },
  { id: 'q_nefertari_2', crewId: 'c_nefertari', stage: 2, title: '宝石之岛的路子', desc: '亲自去一趟斯里兰卡，认识红宝石矿的行家', cond: { kind: 'visit', cityId: 'srilanka' }, gold: 22_000, boost: 2 },
  { id: 'q_nefertari_3', crewId: 'c_nefertari', stage: 3, title: '大商贾的名声', desc: '累计利润 75 万金，让整个地中海记住你', cond: { kind: 'profit', target: 750_000 }, gold: 75_000, boost: 5 },
  { id: 'q_rustam_1', crewId: 'c_rustam', stage: 1, title: '英雄的试炼', desc: '经历 40 次海上事件，鲁斯塔姆只服见过风浪的人', cond: { kind: 'events', target: 40 }, gold: 8_000, boost: 1 },
  { id: 'q_rustam_2', crewId: 'c_rustam', stage: 2, title: '藏红花的香气', desc: '经手一批藏红花，波斯最贵的香料', cond: { kind: 'tradeGood', goodId: 'saffron' }, gold: 20_000, boost: 2 },
  { id: 'q_rustam_3', crewId: 'c_rustam', stage: 3, title: '万里押镖', desc: '累计航行 4 万海里，货一趟没丢', cond: { kind: 'distance', target: 40_000 }, gold: 60_000, boost: 5 },
  { id: 'q_vira_1', crewId: 'c_vira', stage: 1, title: '宝石匠的火眼', desc: '经手一批宝石，看看你的眼力', cond: { kind: 'tradeGood', goodId: 'gem' }, gold: 7_000, boost: 1 },
  { id: 'q_vira_2', crewId: 'c_vira', stage: 2, title: '锡兰的熟人', desc: '在斯里兰卡攒下「港口常客」的名声（声望 30）', cond: { kind: 'rep', cityId: 'srilanka', target: 30 }, gold: 25_000, boost: 2 },
  { id: 'q_vira_3', crewId: 'c_vira', stage: 3, title: '一锤定音', desc: '单笔利润 3 万金，好石头也要会卖', cond: { kind: 'best', target: 30_000 }, gold: 65_000, boost: 5 },
  { id: 'q_bayu_1', crewId: 'c_bayu', stage: 1, title: '火山的馈赠', desc: '经手一批爪哇咖啡，火山灰养出的豆子', cond: { kind: 'tradeGood', goodId: 'coffee' }, gold: 6_000, boost: 1 },
  { id: 'q_bayu_2', crewId: 'c_bayu', stage: 2, title: '雨林的邻居', desc: '把船开到婆罗洲，看看雨林深处的大树', cond: { kind: 'visit', cityId: 'borneo' }, gold: 15_000, boost: 1 },
  { id: 'q_bayu_3', crewId: 'c_bayu', stage: 3, title: '千岛老水手', desc: '完成 300 笔交易，航线烂熟于心', cond: { kind: 'trades', target: 300 }, gold: 55_000, boost: 4 },
  { id: 'q_mira_1', crewId: 'c_mira', stage: 1, title: '香草的魔法', desc: '经手一批香草，马达加斯加的味道', cond: { kind: 'tradeGood', goodId: 'vanilla' }, gold: 6_000, boost: 1 },
  { id: 'q_mira_2', crewId: 'c_mira', stage: 2, title: '药师的行囊', desc: '经手一批丁香，船上药箱的常备', cond: { kind: 'tradeGood', goodId: 'clove' }, gold: 15_000, boost: 2 },
  { id: 'q_mira_3', crewId: 'c_mira', stage: 3, title: '不晕船的船员', desc: '经历 100 次海上事件，米拉的药箱从没空过', cond: { kind: 'events', target: 100 }, gold: 60_000, boost: 5 },
  { id: 'q_tupa_1', crewId: 'c_tupa', stage: 1, title: '云中之城的航路', desc: '把船开到巴拿马，认一认新大陆的海', cond: { kind: 'visit', cityId: 'panama' }, gold: 8_000, boost: 1 },
  { id: 'q_tupa_2', crewId: 'c_tupa', stage: 2, title: '太阳的金子', desc: '经手一批黄金，印加人管它叫太阳的汗水', cond: { kind: 'tradeGood', goodId: 'gold' }, gold: 20_000, boost: 2 },
  { id: 'q_tupa_3', crewId: 'c_tupa', stage: 3, title: '星星认识你', desc: '到访 15 座城市，北斗星会替你指路', cond: { kind: 'cities', target: 15 }, gold: 70_000, boost: 5 },
]

export interface VoyageEventDef {
  id: string
  icon: GlyphName
  title: string
  kind: 'good' | 'bad'
  desc: string
}

export const VOYAGE_EVENTS: VoyageEventDef[] = [
  { id: 'pirate', icon: 'pirate', title: '遭遇海盗船', kind: 'bad', desc: '海平线窜出黑帆拦住去路。有舰炮组可迎战缴获战利品，破财消灾用金币换平安，硬拼则全看运气。' },
  { id: 'storm', icon: 'storm', title: '暴风雨来袭', kind: 'bad', desc: '巨浪拍船、航程延误。备好修理木料可自动加固船体，延误减半。' },
  { id: 'quarantine', icon: 'flag', title: '港口检疫排队', kind: 'bad', desc: '目的港突发检疫，进港延迟数秒。持有通商特许状可免排队直接靠岸。' },
  { id: 'reef', icon: 'barrier', title: '暗礁搁浅', kind: 'bad', desc: '船底擦上暗礁偏离航线、绕行延误。备有修理木料可快速补舱，把延误压到最小。' },
  { id: 'mutiny', icon: 'skull', title: '船员哗变', kind: 'bad', desc: '风浪久航、补给见底，船员鼓噪生事，被勒索一笔现金才肯平息。' },
  { id: 'fog', icon: 'compass', title: '浓雾迷航', kind: 'bad', desc: '海雾锁路、星罗难辨，只能减速绕行，航程平白多耗数秒。' },
  { id: 'fire', icon: 'flame', title: '船舱失火', kind: 'bad', desc: '舱内走水，随机烧毁一批货物。修理木料可即时扑灭，免遭损失。' },
  { id: 'doldrums', icon: 'anchor', title: '无风带滞留', kind: 'bad', desc: '闯进赤道无风带，帆布垂落、寸步难行，航程被大幅拉长。' },
  { id: 'whirl', icon: 'wave', title: '漩涡暗流', kind: 'bad', desc: '被海底暗流卷离航线，被迫绕行，白白多耗一段航程。' },
  { id: 'wind', icon: 'wind', title: '顺风顺水', kind: 'good', desc: '一路好风相送，航程大幅缩短，等于白捡一段路程。' },
  { id: 'bottle', icon: 'bottle', title: '捞起漂流瓶', kind: 'good', desc: '海面漂来旧瓶：藏宝图未集齐时可能捡到碎片，否则兑出几枚旧金币。' },
  { id: 'dolphin', icon: 'dolphin', title: '海豚引航', kind: 'good', desc: '一群海豚跃出船首领航，讨个好彩头，获加速卡 ×1。' },
  { id: 'cargo', icon: 'box', title: '海上漂货', kind: 'good', desc: '捞起随浪漂浮的货物补进货舱，畅销货也能白捡；货舱已满则无缘。' },
  { id: 'deal', icon: 'exchange', title: '港口商机', kind: 'good', desc: '顺路做成一笔小生意，落袋一笔金币，稳稳的额外进账。' },
  { id: 'merchant', icon: 'ship', title: '偶遇商船', kind: 'good', desc: '途中邂逅同航商船，顺手倒卖一批货，落袋一笔金币。' },
  { id: 'festival', icon: 'cheers', title: '海上节庆', kind: 'good', desc: '两地船队海上相逢、举杯同庆，领到赏金还获加速卡 ×1。' },
  { id: 'whale', icon: 'crystal', title: '巨鲸护航', kind: 'good', desc: '一头巨鲸贴着船舷引路，顺水推舟，航程明显缩短。' },
  { id: 'spring', icon: 'beer', title: '甘泉补给', kind: 'good', desc: '泊近小岛补足淡水给养，士气大振，获加速卡 ×1。' },
  { id: 'wreck', icon: 'gem', title: '海难遗财', kind: 'good', desc: '捞起沉船散落的财宝箱，白得一笔不小的金币。' },
  { id: 'current', icon: 'bolt', title: '幸运洋流', kind: 'good', desc: '恰好搭上强劲洋流，顺流而下，航程被大幅缩短。' },
  { id: 'corsair', icon: 'helm', title: '私掠船追袭', kind: 'bad', desc: '挂着私掠旗的快船咬上船尾，被迫改道绕行，白白多耗一段航程。' },
  { id: 'kraken', icon: 'hourglass', title: '海怪惊扰', kind: 'bad', desc: '深海中巨影掠过船底，船员心慌手抖，航速骤降、行程拖慢。' },
  { id: 'sirens', icon: 'purse', title: '海妖之歌', kind: 'bad', desc: '礁石间传来惑人心神的歌声，得花一笔金币才能稳住船员心神。' },
  { id: 'oasis', icon: 'coin', title: '无名小岛补给', kind: 'good', desc: '泊近一座无人小岛补给淡水给养，落袋一笔金币还获加速卡。' },
  { id: 'envoy', icon: 'crown', title: '王国使节船', kind: 'good', desc: '偶遇王国的使节帆船，领到一笔丰厚的远洋赏金。' },
  { id: 'lighthouse', icon: 'spyglass', title: '灯塔引航', kind: 'good', desc: '夜航望见远方灯塔，借光校准航线，航程明显缩短。' },
  { id: 'smuggle', icon: 'gift', title: '走私黑市', kind: 'good', desc: '夜色中撞见走私黑市，顺手做成一笔来路不明的暴利买卖，落袋一笔金币。' },
  { id: 'seabird', icon: 'sparkles', title: '海鸟指路', kind: 'good', desc: '一群海鸟盘旋不散，循着它们的去向抄了近道，航程缩短。' },
  { id: 'dehydrate', icon: 'sun', title: '暴晒脱水', kind: 'bad', desc: '烈日当空、淡水告急，船员口干舌燥体力不支，航程被拖慢。' },
  { id: 'iceberg', icon: 'snow', title: '冰山漂近', kind: 'bad', desc: '海面漂来浮冰，只能改道绕行，白白多耗一段航程。' },
]

/** 市场刷新周期（秒） */
export const MARKET_CYCLE = 8
/** 紧缺天气刷新周期（秒） */
export const SPICE_CYCLE = 24
/** 情报网络解锁价格 */
export const INTEL_PRICE = 800
/** 初始资金 */
export const START_MONEY = 3000
/** 初始城市 */
export const START_CITY = 'china'
