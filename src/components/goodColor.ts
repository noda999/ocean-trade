// 货物图标的配色：用货品 id 稳定地派生一个柔和的色相，
// 所有货物自动获得协调的「浅底 + 深描边」双色，不再千篇一律的米色。
// 统一限定饱和度 / 明度，保证整体是清爽的 pastel 调性，不会刺眼。

function hueOf(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return h % 360
}

export interface GoodTint {
  bg: string
  fg: string
  border: string
}

export function goodTint(id: string): GoodTint {
  const hue = hueOf(id)
  return {
    bg: `hsl(${hue} 66% 93%)`,
    fg: `hsl(${hue} 50% 37%)`,
    border: `hsl(${hue} 52% 82%)`,
  }
}
