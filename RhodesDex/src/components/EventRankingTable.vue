<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { loadCsv } from '../utils/csv'
import type { EventData } from '../types/ranking'

// 表格数据与页面交互状态
const rows = ref<EventData[]>([])
const loading = ref(false)
const error = ref('')
const selectedType = ref<string | null>(null)

// 可排序字段与当前排序方向
type SortKey = 'charnum' | 'time'
type SortDirection = 'asc' | 'desc'
const currentSort = ref<{ key: SortKey; direction: SortDirection } | null>(null)

// 按点击的列排序，再次点击时切换升降序
function sortBy(key: SortKey) {
  const direction: SortDirection =
    currentSort.value?.key === key && currentSort.value.direction === 'desc'
      ? 'asc'
      : 'desc'
  currentSort.value = { key, direction }

  const sortedRows = [...rows.value].sort((left, right) => {
    const comparison = Number(left[key]) - Number(right[key])
    return direction === 'asc' ? comparison : -comparison
  })
  rows.value = sortedRows
}

// 为当前排序列返回方向箭头
function getSortIndicator(key: SortKey): string {
  if (currentSort.value?.key !== key) return ''
  return currentSort.value.direction === 'asc' ? ' ▲' : ' ▼'
}

// 活动类型对应的样式类与界面名称
const eventTypeClasses: Record<string, string> = {
  main: 'type-main',
  act_ss: 'type-sidestory',
  act_om: 'type-omnibus',
}

// 返回活动类型对应的 CSS 类
function getEventTypeClass(type: string): string {
  return eventTypeClasses[type] ?? ''
}

// 将 CSV 类型代码转换为界面显示名称
const eventTypeLabels: Record<string, string> = {
  main: '主线',
  act_ss: 'SideStory',
  act_om: '故事集',
}

// 将主线活动名转换为 EP 编号格式
function getEventName(event: EventData): string {
  if (event.type !== 'main') return event.sname
  return event.sname.replace(/^(\d+)_(.+)$/, 'EP$1 $2')
}

// 管理类别筛选按钮的选中状态
function isTypeSelected(type: string): boolean {
  return selectedType.value === type
}

// 点击当前类别时清除筛选，点击其他类别时切换筛选
function toggleType(type: string) {
  selectedType.value = selectedType.value === type ? null : type
}

// 隐藏空活动名，并应用当前类别筛选
function isEventVisible(event: EventData): boolean {
  const hasName = Boolean(event.sname?.trim())
  const matchesType =
    selectedType.value === null || selectedType.value === event.type

  return hasName && matchesType
}

// 按当前可见行生成连续排名
function getEventRank(index: number): number {
  return rows.value.slice(0, index + 1).filter(isEventVisible).length
}

// 将 YYYYMM 格式转换为 YYYY/MM
function getEventTime(time: number): string {
  const formattedTime = String(time)
  return /^\d{6}$/.test(formattedTime)
    ? `${formattedTime.slice(0, 4)}/${formattedTime.slice(4)}`
    : formattedTime
}

// 加载活动CSV，并设置初始时间降序（异步加载）
async function loadData() {
  loading.value = true
  error.value = ''

  try {
    rows.value = await loadCsv<EventData>('/event.csv')
    sortBy('time')
    // console.log(rows.value)
  } catch (e) {
    error.value = e instanceof Error ? e.message : '加载数据失败'
  } finally {
    loading.value = false
  }
}

// 组件挂载后开始加载数据
onMounted(loadData)
</script>

<template>
  <section class="ranking-table">
    <h2>活动文本量</h2>

    <!-- 类别筛选按钮 -->
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

    <!-- 可横向滚动的排行表格 -->
    <div class="table-wrapper">
      <table>
        <colgroup>
          <col class="rank-column" />
          <col class="name-column" />
          <col class="count-column" />
          <col class="time-column" />
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

        <!-- 只渲染当前可见的活动 -->
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
/* 表格主体的最大宽度 */
.ranking-table {
  width: min(100%, 960px);
}

h2 {
  margin-bottom: 16px;
  text-align: center;
}

/* 筛选按钮靠右排列 */
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

/* 筛选按钮的基础外观 */
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

/* 三种类别的行背景色与筛选按钮颜色 */
tr.type-main td {
  background-color: #8fbc8f;
}

.filter-button.type-main {
  background: #8fbc8f;
}

tr.type-sidestory td {
  background-color: #b0c4de;
}

.filter-button.type-sidestory {
  background: #b0c4de;
}

tr.type-omnibus td {
  background-color: #c79999;
}

.filter-button.type-omnibus {
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
  outline: 2px solid #000;
  outline-offset: 2px;
}

/* 小屏幕下允许表格横向滚动 */
.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

/* 固定表格布局和整体最小宽度 */
table {
  width: 100%;
  min-width: 360px;
  font-size: clamp(0.8rem, 1.7vw, 1rem);
  table-layout: fixed;
  border-collapse: collapse;
}

/* 单元格边框、留白与对齐 */
th,
td {
  border: 1px solid #fff;
  padding: clamp(6px, 1.5vw, 12px) clamp(6px, 2vw, 20px);
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
  outline: 2px solid #000;
  outline-offset: 4px;
}

/* 各列宽度比例 */
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