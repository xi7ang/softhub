# SoftHub · 软件源神

精选免费与开源软件的分享站：首页、分类浏览、软件详情、合集、搜索、收藏、免责声明与关于页面。

本站不托管任何软件文件，唯一的下载方式是站长分享的网盘链接（夸克、迅雷、UC、光鸭）。

## 本地运行

```bash
npm install
npm run dev
```

浏览器打开 http://localhost:5173

## 构建

```bash
npm run build
npm run preview
```

构建产物在 `dist/` 目录。

## 数据

软件条目在 `public/data/software.json`，合集定义在 `src/collections.js`。
条目不含下载量、浏览量、评分、文件大小等无法核实的数据。

条目字段：`id`、`name`、`enName`、`desc`、`category`、`tags`、`platforms`、
`license`，以及以下三个可选字段（`website` 官网首页与 `download` 官方下载页地址仍保留在数据中备用，但页面不再展示，站内唯一展示的下载方式是网盘下载）。

分类法借鉴 lzlfx 的按功能细分法（只借用分类名，不搬该站任何内容）：
`办公开发`、`系统增强`、`图形图像`、`媒体处理`、`办公软件`、`上传下载`、
`媒体播放`、`浏览器`、`小说阅读`、`录像截图`、`三维设计`、`IT·互联网`。
首页分类入口与分类页均直接取数据中的 `category` 字段派生，新增分类无需改代码。

### 网盘下载 `netdisks` 与品牌图标

网盘行按各网盘主题色展示，图标存在 `public/icons/` 下：夸克、迅雷、UC
用的是各网盘官方站点的 favicon；光鸭网盘未找到官方站点，暂用品牌色
字形占位，拿到官方图标后存为 `public/icons/guangya.png` 即可替换，无需改代码。

### 网盘下载 `netdisks`

数组，每项为 `{type, url, code}`，`type` 只能是以下四种之一：

| type | 网盘名称 |
| --- | --- |
| `quark` | 夸克网盘 |
| `xunlei` | 迅雷网盘 |
| `uc` | UC网盘 |
| `guangya` | 光鸭网盘 |

`url` 为网盘分享链接，`code` 为提取码（无提取码时填空字符串）。
示例：

```json
"netdisks": [
  { "type": "quark", "url": "https://pan.quark.cn/s/xxxx", "code": "abcd" },
  { "type": "xunlei", "url": "https://pan.xunlei.com/s/xxxx", "code": "" }
]
```

没有网盘链接的条目填 `"netdisks": []`，详情页会显示“暂无网盘下载链接”
（此时该条目暂无可用下载方式）。请只填真实有效的分享链接，
不要编造链接或提取码。

### 资源图片 `image` 与应用截图 `screenshots`

- `image`：详情页顶部展示的资源图/图标图片 URL，没有填空字符串 `""`，
  为空时详情页显示首字头像。
- `screenshots`：应用截图 URL 数组，详情页以大图 + 缩略图切换展示；
  没有截图填 `[]`，详情页显示“暂无应用截图”占位，不会出破图。
  请只填可核实的图片地址，不要猜测或盗链无法确认的图片。

## 主题

顶栏有 ☀️/🌙 切换按钮，浅色与深色两套主题通过 CSS 变量实现。
选择保存在浏览器 localStorage（键 `softhub-theme`），未保存时跟随系统偏好。

## 评论

详情页评论仅保存在当前浏览器 localStorage（键 `softhub:comments`，按条目 id 分组），
无后端、无网络请求；收藏同样只保存在本地（键 `softhub:favorites`）。
