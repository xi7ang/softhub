<template>
  <h1>我的收藏</h1>
  <p style="color: var(--muted)">收藏只保存在这台设备的浏览器里（localStorage），换设备不会同步。</p>
  <div v-if="items.length" class="grid">
    <SoftwareCard v-for="item in items" :key="item.id" :item="item" />
  </div>
  <p v-else class="empty">
    还没有收藏。去<a href="#/">首页</a>逛逛，点卡片上的「收藏」就能加进来。
  </p>
</template>

<script setup>
import { computed } from 'vue'
import { store, findById } from '../lib/store.js'
import { favorites } from '../lib/favorites.js'

const items = computed(() =>
  [...favorites.ids].map((id) => findById(id)).filter(Boolean),
)
</script>
