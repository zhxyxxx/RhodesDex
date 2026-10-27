<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { loadCsv } from '../utils/csv'
import type { EventData } from '../types/ranking'

const rows = ref<EventData[]>([])
const loading = ref(false)
const error = ref('')
const selectedType = ref<string | null>(null)

type SortKey = 'charnum' | 'time'
type SortDirection = 'asc' | 'desc'

const currentSort = ref<{ key: SortKey; direction: SortDirection } | null>(null)

function sortBy(key: SortKey) {
  const direction: SortDirection =
    currentSort.value?.key === key && currentSort.value.direction === 'desc'
      ? 'asc'
      : 'desc'

  currentSort.value = { key, direction }

  const sortedRows = [...rows.value].sort((left, right) => {
    let comparison: number

    comparison = Number(left[key]) - Number(right[key])

    return direction === 'asc' ? comparison : -comparison
  })

  rows.value = sortedRows
}

function getSortIndicator(key: SortKey): string {
  if (currentSort.value?.key !== key) return ''
  return currentSort.value.direction === 'asc' ? ' ▲' : ' ▼'
}

const eventTypeClasses: Record<string, string> = {
  main: 'type-main',
  act_ss: 'type-side-story',
  act_om: 'type-story-collection',
}

function getEventTypeClass(type: string): string {
  return eventTypeClasses[type] ?? ''
}
const eventTypeLabels: Record<string, string> = {
  main: '主线',
  act_ss: 'SideStory',
  act_om: '故事集',
}

function getEventName(event: EventData): string {
  if (event.type !== 'main') return event.sname
  return event.sname.replace(/^(\d+)_(.+)$/, 'EP$1 $2')
}

function isTypeSelected(type: string): boolean {
  return selectedType.value === type
}

function toggleType(type: string) {
  selectedType.value = selectedType.value === type ? null : type
}

function isEventVisible(event: EventData): boolean {
  const hasName = Boolean(event.sname?.trim())
  const matchesType =
    selectedType.value === null || selectedType.value === event.type

  return hasName && matchesType
}

function getEventRank(index: number): number {
  return rows.value.slice(0, index + 1).filter(isEventVisible).length
}

function getEventTime(time: number): string {
  const formattedTime = String(time)
  return /^\d{6}$/.test(formattedTime)
    ? `${formattedTime.slice(0, 4)}/${formattedTime.slice(4)}`
    : formattedTime
}

async function loadData() {
  loading.value = true
  error.value = ''

  try {
    rows.value = await loadCsv<EventData>('/event.csv')
    sortBy('time')
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
  <section class="ranking-table">
    <h2>活动文本量</h2>

    <div class="table-toolbar">
      <div class="filter-buttons" role="group" aria-label="按类别筛选">
        <button
          v-for="(label, type) in eventTypeLabels"
          :key="type"
          type="button"
          class="filter-button"
          :class="[getEventTypeClass(type), { active: isTypeSelected(type) }]"
          :aria-pressed="isTypeSelected(type)"
          @click="toggleType(type)"
        >
          {{ label }}
        </button>
      </div>
    </div>

    <div class="table-wrapper">
      <table>
        <colgroup>
          <col class="rank-column" />
          <col class="name-column" />
          <col class="count-column" />
          <col class="time-column" />
          <col class="type-column" />
        </colgroup>
        <thead>
          <tr>
            <th> </th>
            <th>活动</th>
            <th :aria-sort="currentSort?.key === 'charnum' ? (currentSort.direction === 'asc' ? 'ascending' : 'descending') : 'none'">
              <button type="button" @click="sortBy('charnum')">字数{{ getSortIndicator('charnum') }}</button>
            </th>
            <th :aria-sort="currentSort?.key === 'time' ? (currentSort.direction === 'asc' ? 'ascending' : 'descending') : 'none'">
              <button type="button" @click="sortBy('time')">时间{{ getSortIndicator('time') }}</button>
            </th>
          </tr>
        </thead>

        <tbody>
          <template v-for="(event, index) in rows" :key="index">
            <tr v-if="isEventVisible(event)" :class="getEventTypeClass(event.type)">
              <td>{{ getEventRank(index) }}</td>
              <td>{{ getEventName(event) }}</td>
              <td>{{ event.charnum }}</td>
              <td>{{ getEventTime(event.time) }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.ranking-table {
  width: min(100%, 960px);
}

h2 {
  margin-bottom: 16px;
  text-align: center;
}

.table-toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.filter-button {
  border: 1px solid var(--border);
  border-radius: 6px;
  border-width: 2px;
  padding: 8px 22px;
  color: #000;
  border-color: #fff;
  background: var(--bg);
  font: inherit;
  cursor: pointer;
}

tr.type-main td {
  background-color: #8fbc8f;
}

.filter-button.type-main {
  background: #8fbc8f;
}

tr.type-side-story td {
  background-color: #b0c4de;
}

.filter-button.type-side-story {
  background: #b0c4de;
}

tr.type-story-collection td {
  background-color: #c79999;
}

.filter-button.type-story-collection {
  background: #c79999;
}

.filter-button.active {
  border-color: #fff;
  color: #fff;
}

.filter-button:hover {
  border-color: #000;
  color: #fff;
}

.filter-button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  min-width: 720px;
  table-layout: fixed;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #fff;
  padding: 12px 20px;
  text-align: center;
}

td {
  color: #000;
  font-weight: 500;
}

th {
  color: #fff;
  background-color: #9d9d9d;
  font-weight: 600;
}

th button {
  border: 0;
  padding: 0;
  color: inherit;
  background: none;
  font: inherit;
  cursor: pointer;
}

th button:hover {
  color: #000;
}

th button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 4px;
}

.rank-column {
  width: 10%;
}

.name-column {
  width: 50%;
}

.count-column {
  width: 20%;
}

.time-column {
  width: 20%;
}
</style>