<template>
  <header class="topbar">
    <div class="topbar-inner">
      <a class="logo" href="#/">SoftHub<small>软件源神</small></a>
      <nav class="nav">
        <a href="#/" :class="{ active: route.name === 'home' }">首页</a>
        <a href="#/collections" :class="{ active: route.name === 'collections' }">合集</a>
        <a href="#/favorites" :class="{ active: route.name === 'favorites' }">收藏</a>
        <a href="#/disclaimer" :class="{ active: route.name === 'disclaimer' }">免责声明</a>
        <a href="#/about" :class="{ active: route.name === 'about' }">关于</a>
      </nav>
      <button
        class="theme-btn"
        :title="theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'"
        @click="toggleTheme"
      >
        {{ theme === 'dark' ? '🌙' : '☀️' }}
      </button>
    </div>
  </header>

  <main class="container">
    <p v-if="store.error" class="error">{{ store.error }}</p>
    <template v-else-if="store.loaded">
      <HomeView v-if="route.name === 'home'" />
      <CategoryView v-else-if="route.name === 'category'" :name="route.param" />
      <DetailView v-else-if="route.name === 'detail'" :id="route.param" />
      <CollectionsView v-else-if="route.name === 'collections'" />
      <SearchView v-else-if="route.name === 'search'" :query="route.param" />
      <FavoritesView v-else-if="route.name === 'favorites'" />
      <DisclaimerView v-else-if="route.name === 'disclaimer'" />
      <AboutView v-else-if="route.name === 'about'" />
      <p v-else class="empty">页面不存在，<a href="#/">回首页</a>。</p>
    </template>
    <p v-else class="empty">正在加载软件数据…</p>
  </main>

  <footer class="footer">
    SoftHub · 软件源神 —— 精选免费与开源软件，下载全部走网盘分享，本站不托管任何文件。
    <br />
    <a href="#/disclaimer">免责声明</a> · <a href="#/about">关于本站</a>
  </footer>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { store, loadSoftware } from './lib/store.js'
import { theme, applyTheme, toggleTheme } from './lib/theme.js'
import HomeView from './views/HomeView.vue'
import CategoryView from './views/CategoryView.vue'
import DetailView from './views/DetailView.vue'
import CollectionsView from './views/CollectionsView.vue'
import SearchView from './views/SearchView.vue'
import FavoritesView from './views/FavoritesView.vue'
import DisclaimerView from './views/DisclaimerView.vue'
import AboutView from './views/AboutView.vue'

const route = ref({ name: 'home', param: '' })

function parseHash() {
  const raw = (location.hash || '#/').slice(2)
  const [path, query] = raw.split('?')
  const parts = path.split('/').filter(Boolean)
  if (parts.length === 0) return { name: 'home', param: '' }
  if (parts[0] === 'category' && parts[1]) return { name: 'category', param: decodeURIComponent(parts[1]) }
  if (parts[0] === 'software' && parts[1]) return { name: 'detail', param: parts[1] }
  if (['collections', 'favorites', 'disclaimer', 'about'].includes(parts[0])) return { name: parts[0], param: '' }
  if (parts[0] === 'search') {
    const q = new URLSearchParams(query || '').get('q') || ''
    return { name: 'search', param: q }
  }
  return { name: 'notfound', param: '' }
}

function onHashChange() {
  route.value = parseHash()
  window.scrollTo(0, 0)
}

onMounted(() => {
  applyTheme(theme.value)
  onHashChange()
  window.addEventListener('hashchange', onHashChange)
  loadSoftware()
})
onUnmounted(() => {
  window.removeEventListener('hashchange', onHashChange)
})
</script>
