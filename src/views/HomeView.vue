<template>
  <section class="hero">
    <h1>找好软件，来 SoftHub</h1>
    <p>精选免费与开源软件，下载全部走网盘分享，本站不托管、不捆绑。</p>
    <form class="hero-search" @submit.prevent="goSearch">
      <input v-model="query" type="search" placeholder="搜索软件名称、英文名、标签…" />
      <button type="submit">搜索</button>
    </form>
  </section>

  <nav class="cat-nav">
    <span class="cat-nav-item active">全部</span>
    <a
      v-for="c in catCounts"
      :key="c.name"
      class="cat-nav-item"
      :href="`#/category/${encodeURIComponent(c.name)}`"
    >
      {{ c.name }}<span class="cat-nav-count">{{ c.count }}</span>
    </a>
  </nav>

  <div class="home-layout">
    <section class="feed-list">
      <article v-for="item in store.items" :key="item.id" class="feed-item">
        <a class="feed-main" :href="`#/software/${item.id}`">
          <span class="feed-avatar" :style="{ background: avatarColor(item.id) }">{{ item.name.slice(0, 1) }}</span>
          <span class="feed-body">
            <span class="feed-title">{{ item.name }} <small class="feed-en">{{ item.enName }}</small></span>
            <span class="feed-desc">{{ item.desc }}</span>
            <span class="feed-meta">
              <span class="chip">{{ item.category }}</span>
              <span class="chip chip-plain">{{ item.license }}</span>
              <span v-for="plat in item.platforms" :key="plat" class="chip chip-plain">{{ plat }}</span>
              <span v-if="item.netdisks && item.netdisks.length" class="chip chip-accent">网盘下载</span>
            </span>
          </span>
        </a>
      </article>
    </section>

    <aside class="sidebar">
      <section class="side-card">
        <h3>分类</h3>
        <ul class="side-list">
          <li v-for="c in catCounts" :key="c.name">
            <a :href="`#/category/${encodeURIComponent(c.name)}`">{{ c.name }}<span>{{ c.count }} 款</span></a>
          </li>
        </ul>
      </section>
      <section class="side-card">
        <h3>精选合集</h3>
        <ul class="side-list">
          <li v-for="col in collections" :key="col.id">
            <a :href="`#/collections#${col.id}`">{{ col.name }}<span>{{ col.ids.length }} 款</span></a>
          </li>
        </ul>
        <a class="side-more" href="#/collections">全部合集 →</a>
      </section>
      <section class="side-card side-note">
        <h3>本站说明</h3>
        <p>只收录免费与开源软件；唯一下载方式是网盘分享，不提供官网下载入口。</p>
      </section>
    </aside>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { store } from '../lib/store.js'
import { collections } from '../collections.js'

const query = ref('')

const catCounts = computed(() => {
  const map = new Map()
  for (const item of store.items) {
    map.set(item.category, (map.get(item.category) || 0) + 1)
  }
  return [...map.entries()].map(([name, count]) => ({ name, count }))
})

const PALETTE = ['#2563eb', '#0891b2', '#059669', '#d97706', '#dc2626', '#7c3aed', '#db2777', '#4d7c0f']
function goSearch() {
  location.hash = `#/search?q=${encodeURIComponent(query.value.trim())}`
}

function avatarColor(id) {
  let hash = 0
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0
  return PALETTE[hash % PALETTE.length]
}
</script>
