<template>
  <h1>精选合集</h1>
  <p style="color: var(--muted)">编辑人工挑选的软件组合，点卡片进详情，下载走网盘分享。</p>

  <section v-for="col in collections" :key="col.id" :id="col.id" class="section">
    <div class="section-head">
      <h2>{{ col.name }}</h2>
      <span style="color: var(--muted)">{{ col.ids.length }} 款</span>
    </div>
    <p style="color: var(--muted); margin-top: -8px">{{ col.desc }}</p>
    <div class="grid">
      <SoftwareCard v-for="item in colItems(col)" :key="item.id" :item="item" />
    </div>
  </section>
</template>

<script setup>
import { findById } from '../lib/store.js'
import { collections } from '../collections.js'
import SoftwareCard from '../components/SoftwareCard.vue'

function colItems(col) {
  return col.ids.map((id) => findById(id)).filter(Boolean)
}
</script>
