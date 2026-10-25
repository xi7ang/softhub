<template>
  <h1>{{ name }}</h1>
  <p style="color: var(--muted)">共 {{ filtered.length }} 款软件</p>

  <div class="toolbar">
    <span>标签：</span>
    <button
      class="chip"
      :class="{ active: !activeTag }"
      @click="activeTag = ''"
    >
      全部
    </button>
    <button
      v-for="tag in tags"
      :key="tag"
      class="chip"
      :class="{ active: activeTag === tag }"
      @click="activeTag = tag"
    >
      {{ tag }}
    </button>
    <span style="margin-left: auto">排序：</span>
    <select v-model="sort">
      <option value="newest">最新收录</option>
      <option value="name">按名称</option>
    </select>
  </div>

  <div v-if="filtered.length" class="grid">
    <SoftwareCard v-for="item in filtered" :key="item.id" :item="item" />
  </div>
  <p v-else class="empty">这个分类下还没有软件。</p>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { store } from '../lib/store.js'
import SoftwareCard from '../components/SoftwareCard.vue'

const props = defineProps({
  name: { type: String, required: true },
})

const activeTag = ref('')
const sort = ref('newest')

watch(() => props.name, () => {
  activeTag.value = ''
  sort.value = 'newest'
})

const inCategory = computed(() =>
  store.items.filter((item) => item.category === props.name),
)

const tags = computed(() => {
  const seen = []
  for (const item of inCategory.value) {
    for (const tag of item.tags || []) {
      if (!seen.includes(tag)) seen.push(tag)
    }
  }
  return seen
})

const filtered = computed(() => {
  let list = inCategory.value
  if (activeTag.value) list = list.filter((item) => (item.tags || []).includes(activeTag.value))
  if (sort.value === 'name') {
    return [...list].sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
  }
  return list
})
</script>
