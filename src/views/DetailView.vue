<template>
  <div v-if="item" class="detail">
    <div class="detail-head">
      <span v-if="!item.image" class="avatar detail-avatar" :style="{ background: avatarColor }">{{ avatarChar }}</span>
      <div>
        <h1>{{ item.name }}</h1>
        <p class="detail-en">{{ item.enName }}</p>
        <div class="meta-grid">
          <span class="chip">{{ item.category }}</span>
          <span class="chip chip-plain">{{ item.license }}</span>
          <span v-for="plat in item.platforms" :key="plat" class="chip chip-plain">{{ plat }}</span>
          <span v-for="tag in item.tags" :key="tag" class="chip chip-plain">#{{ tag }}</span>
        </div>
      </div>
    </div>

    <img v-if="item.image" class="detail-image" :src="item.image" :alt="item.name" />

    <p class="detail-desc">{{ item.desc }}</p>

    <div class="btn-row">
      <button class="btn" @click="toggleFavorite(item.id)">
        {{ fav ? '★ 已收藏，点击取消' : '☆ 收藏这款软件' }}
      </button>
    </div>

    <div class="notice">
      本站唯一的下载方式是网盘下载（见下方网盘下载区），本站不托管任何安装文件，也不修改安装包。
    </div>

    <section class="section">
      <div class="section-head">
        <h2>网盘下载</h2>
      </div>
      <div v-if="netdisks.length" class="netdisk-list">
        <div v-for="nd in netdisks" :key="nd.type" class="netdisk-row" :style="{ '--nd': netdiskMeta(nd.type).color }">
          <img v-if="netdiskMeta(nd.type).icon && !iconFailed[nd.type]" class="netdisk-icon" :src="netdiskMeta(nd.type).icon" :alt="netdiskMeta(nd.type).name" @error="iconFailed[nd.type] = true" />
          <span v-else class="netdisk-icon netdisk-glyph" :style="{ background: netdiskMeta(nd.type).color, color: netdiskMeta(nd.type).onColor }">{{ netdiskMeta(nd.type).name.slice(0, 1) }}</span>
          <span class="netdisk-name">{{ netdiskMeta(nd.type).name }}</span>
          <a class="netdisk-go" :style="{ background: netdiskMeta(nd.type).color, color: netdiskMeta(nd.type).onColor }" :href="nd.url" target="_blank" rel="noreferrer">打开下载 ↗</a>
          <span v-if="nd.code" class="netdisk-code">
            提取码：<code>{{ nd.code }}</code>
            <button class="copy-btn" @click="copyCode(nd)">
              {{ copiedType === nd.type ? '✓ 已复制' : '复制提取码' }}
            </button>
          </span>
          <span v-else class="netdisk-code">无需提取码</span>
        </div>
        <p style="color: var(--muted); font-size: 13px; margin: 0">
          网盘链接为站长分享，下载前请自行甄别文件安全，认准发布者信息。
        </p>
      </div>
      <p v-else class="empty">暂无网盘下载链接，该软件暂时没有可用的下载方式。</p>
    </section>

    <section class="section">
      <div class="section-head">
        <h2>应用截图</h2>
      </div>
      <div v-if="screenshots.length">
        <img class="shot-main" :src="screenshots[activeShot]" :alt="`${item.name} 截图 ${activeShot + 1}`" />
        <div class="shot-thumbs">
          <button
            v-for="(shot, i) in screenshots"
            :key="i"
            class="shot-thumb"
            :class="{ active: i === activeShot }"
            @click="activeShot = i"
          >
            <img :src="shot" :alt="`${item.name} 截图缩略图 ${i + 1}`" style="width: 100%; height: 100%; object-fit: cover; border-radius: 6px" />
          </button>
        </div>
      </div>
      <div v-else class="shot-empty">暂无应用截图</div>
    </section>

    <section class="section">
      <div class="section-head">
        <h2>同类软件</h2>
        <a :href="`#/category/${encodeURIComponent(item.category)}`">查看全部{{ item.category }} →</a>
      </div>
      <div v-if="related.length" class="grid">
        <SoftwareCard v-for="rel in related" :key="rel.id" :item="rel" />
      </div>
      <p v-else class="empty">暂无同类软件。</p>
    </section>

    <section class="section">
      <div class="section-head">
        <h2>评论</h2>
      </div>
      <p style="color: var(--muted); font-size: 13px; margin: 0">评论仅保存在当前浏览器，换设备或清除浏览器数据后不会同步。</p>
      <form class="comment-form" @submit.prevent="submitComment">
        <input v-model="nick" type="text" maxlength="20" placeholder="昵称（可选，默认匿名）" />
        <textarea v-model="commentText" maxlength="1000" placeholder="写下你的看法…" required></textarea>
        <div>
          <button class="btn btn-primary" type="submit" :disabled="!commentText.trim()">发表评论</button>
        </div>
      </form>
      <div v-if="commentList.length" class="comment-list">
        <article v-for="(c, i) in commentList" :key="`${c.at}-${i}`" class="comment-item">
          <div class="comment-meta">
            <strong>{{ c.nick }}</strong> · {{ formatTime(c.at) }}
          </div>
          <p class="comment-text">{{ c.text }}</p>
        </article>
      </div>
      <p v-else class="empty">暂无评论，来抢沙发。</p>
    </section>
  </div>
  <p v-else class="empty">找不到这款软件，<a href="#/">回首页</a>。</p>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { netdiskMeta } from '../lib/netdisks.js'
import { store, findById } from '../lib/store.js'
import { isFavorite, toggleFavorite } from '../lib/favorites.js'
import { commentsFor, addComment } from '../lib/comments.js'
import SoftwareCard from '../components/SoftwareCard.vue'

const props = defineProps({
  id: { type: String, required: true },
})

const item = computed(() => findById(props.id))
const fav = computed(() => item.value && isFavorite(item.value.id))
const avatarChar = computed(() => (item.value?.name || '?').slice(0, 1))

const PALETTE = ['#2563eb', '#0891b2', '#059669', '#d97706', '#dc2626', '#7c3aed', '#db2777', '#4d7c0f']
const avatarColor = computed(() => {
  if (!item.value) return PALETTE[0]
  let hash = 0
  for (const ch of item.value.id) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0
  return PALETTE[hash % PALETTE.length]
})

const netdisks = computed(() => (Array.isArray(item.value?.netdisks) ? item.value.netdisks : []))
// 图标加载失败（如光鸭官方图标暂未拿到）时回退为品牌色字形
const iconFailed = reactive({})
const screenshots = computed(() => (Array.isArray(item.value?.screenshots) ? item.value.screenshots : []))
const activeShot = ref(0)
watch(item, () => { activeShot.value = 0 })

const copiedType = ref('')
let copiedTimer = null
async function copyCode(nd) {
  if (!nd.code) return
  try {
    await navigator.clipboard.writeText(nd.code)
  } catch {
    // 剪贴板不可用时回退
    const ta = document.createElement('textarea')
    ta.value = nd.code
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    ta.remove()
  }
  copiedType.value = nd.type
  clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => { copiedType.value = '' }, 2000)
}

const related = computed(() => {
  if (!item.value) return []
  return store.items
    .filter((entry) => entry.category === item.value.category && entry.id !== item.value.id)
    .slice(0, 4)
})

// 评论
const nick = ref('')
const commentText = ref('')
const commentList = computed(() => (item.value ? commentsFor(item.value.id) : []))
function submitComment() {
  if (!item.value) return
  if (addComment(item.value.id, nick.value, commentText.value)) {
    commentText.value = ''
  }
}
function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}
</script>
