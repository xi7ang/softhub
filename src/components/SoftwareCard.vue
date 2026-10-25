<template>
  <article class="card">
    <a class="card-main" :href="`#/software/${item.id}`">
      <span class="avatar" :style="{ background: avatarColor }">{{ avatarChar }}</span>
      <span class="card-body">
        <span class="card-title">{{ item.name }}</span>
        <span class="card-en">{{ item.enName }}</span>
        <span class="card-desc">{{ item.desc }}</span>
      </span>
    </a>
    <div class="card-foot">
      <span class="chips">
        <span class="chip">{{ item.category }}</span>
        <span class="chip chip-plain">{{ item.license }}</span>
      </span>
      <button
        class="fav-btn"
        :class="{ active: fav }"
        :title="fav ? '取消收藏' : '收藏'"
        @click="toggleFavorite(item.id)"
      >
        {{ fav ? '★ 已收藏' : '☆ 收藏' }}
      </button>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { isFavorite, toggleFavorite } from '../lib/favorites.js'

const props = defineProps({
  item: { type: Object, required: true },
})

const fav = computed(() => isFavorite(props.item.id))
const avatarChar = computed(() => (props.item.name || '?').slice(0, 1))

const PALETTE = ['#2563eb', '#0891b2', '#059669', '#d97706', '#dc2626', '#7c3aed', '#db2777', '#4d7c0f']
const avatarColor = computed(() => {
  let hash = 0
  for (const ch of props.item.id) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0
  return PALETTE[hash % PALETTE.length]
})
</script>
