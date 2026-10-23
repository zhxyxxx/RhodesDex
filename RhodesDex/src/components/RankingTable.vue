<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { loadEventCsv } from '../utils/csv'
import type { Event } from '../types/ranking'

const rows = ref<Event[]>([])
const loading = ref(false)
const error = ref('')

async function loadData() {
  loading.value = true
  error.value = ''

  try {
    rows.value = await loadEventCsv('/event.csv')
    console.log(rows.value)
  } catch (e) {
    error.value = e instanceof Error ? e.message : '加载数据失败'
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>

<template>
  <div>
    <h2>活动文本排行</h2>

    <table>
      <thead>
        <tr>
          <th>排名</th>
          <th>活动名</th>
          <th>文本量</th>
          <th>时间</th>
          <th>类别</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="event in rows" :key="event.sname">
          <td>{{  }}</td>
          <td>{{ event.sname }}</td>
          <td>{{ event.charnum }}</td>
          <td>{{ event.time }}</td>
          <td>{{ event.type }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>