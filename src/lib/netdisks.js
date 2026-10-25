// 网盘品牌配置：主题色 + 官方图标。
// 图标是各网盘官方站点的 favicon，存在 public/icons/ 下随站发布；
// 光鸭网盘未找到官方站点，暂用品牌色字形占位——之后拿到官方图标文件后，
// 只需把它存为 public/icons/guangya.png，无需改代码即可替换。
export const NETDISKS = {
  quark: { name: '夸克网盘', color: '#0D53FF', onColor: '#ffffff', icon: 'icons/quark.ico' },
  xunlei: { name: '迅雷网盘', color: '#3F85FF', onColor: '#ffffff', icon: 'icons/xunlei.ico' },
  uc: { name: 'UC网盘', color: '#FF6A00', onColor: '#ffffff', icon: 'icons/uc.png' },
  guangya: { name: '光鸭网盘', color: '#E8A200', onColor: '#1a1a1a', icon: 'icons/guangya.png' },
}

export function netdiskMeta(type) {
  return NETDISKS[type] || { name: type, color: '#666666', onColor: '#ffffff', icon: '' }
}
