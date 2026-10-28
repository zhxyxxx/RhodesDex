<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { loadCsv, loadJson } from '../utils/csv'
import type { EliteData, EliteRankData, ItemData } from '../types/ranking'

// 表格数据与页面交互状态
const rows = ref<EliteRankData[]>([])
const loading = ref(false)
const error = ref('')
const selectedStar = ref<number>(6)

// 当前排序方向
type SortDirection = 'asc' | 'desc'
const currentSort = ref<SortDirection>('asc')

function sort() {
  const direction: SortDirection = currentSort.value === 'desc' ? 'asc' : 'desc'
  currentSort.value = direction

  const sortedRows = [...rows.value].sort((left, right) => {
    const comparison = Number(left['value']) - Number(right['value'])
    return direction === 'asc' ? comparison : -comparison
  })
  rows.value = sortedRows
}

// 为当前排序列返回方向箭头
function getSortIndicator(): string {
  return currentSort.value === 'asc' ? ' ▲' : ' ▼'
}

const starClasses: Record<number, string> = {
  4: 'type-four',
  5: 'type-five',
  6: 'type-six',
}

function getStarClass(star: number): string {
  return starClasses[star] ?? ''
}

const starList: number[] = [4, 5, 6]

// 管理类别筛选按钮的选中状态
function isStarSelected(star: number): boolean {
  return selectedStar.value === star
}

// 点击其他类别时切换筛选
function toggleStar(star: number) {
  selectedStar.value = star
}

// 应用当前类别筛选
function isStarVisible(character: EliteData): boolean {
  return selectedStar.value === character.star
}

// 按当前可见行生成连续排名
function getCharRank(index: number): number {
  return rows.value.slice(0, index + 1).filter(isStarVisible).length
}

// 计算干员四种材料的等效价值总和
function getMaterialTotal(
  character: EliteData,
  itemApValues: Record<string, number>,
): number {
  const materials = [
    { name: character.item1, quantity: character.num1 },
    { name: character.item2, quantity: character.num2 },
    { name: character.item3, quantity: character.num3 },
    { name: character.item4, quantity: character.num4 },
  ]

  return materials.reduce(
    (total, material) => total + (itemApValues[material.name] ?? 0) * material.quantity,
    0,
  )
}

async function loadData() {
  loading.value = true
  error.value = ''

  try {
    const [loadedRows, itemData] = await Promise.all([
      loadCsv<EliteData>('/elite_data.csv'),
      loadJson<ItemData>('/item.json'),
    ])
    const itemApValues = Object.fromEntries(
      itemData.map((item) => [item.name, item.apValue]),
    )

    rows.value = loadedRows.map((character) => ({
      ...character,
      value: getMaterialTotal(character, itemApValues),
    }))
    sort()
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
    <h2>干员精二等效理智</h2>

    <!-- 类别筛选按钮 -->
    <div class="table-toolbar">
      <div class="filter-buttons" role="group" aria-label="按类别筛选">
        <button
          v-for="star in starList"
          :key="star"
          type="button"
          class="filter-button"
          :class="[getStarClass(star), { active: isStarSelected(star) }]"
          :aria-pressed="isStarSelected(star)"
          @click="toggleStar(star)"
        >
          {{ star }}星
        </button>
      </div>
    </div>

    <!-- 可横向滚动的排行表格 -->
    <div class="table-wrapper">
      <table>
        <colgroup>
          <col class="rank-column" />
          <col class="operator-column" />
          <col class="material1-column" />
          <col class="count-column" />
          <col class="material1-column" />
          <col class="count-column" />
          <col class="material2-column" />
          <col class="count-column" />
          <col class="material2-column" />
          <col class="count-column" />
          <col class="result-column" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col"> </th>
            <th scope="col">干员</th>
            <th colspan="4" scope="colgroup" class="elite-one-header">精英一</th>
            <th colspan="4" scope="colgroup" class="elite-two-header">精英二</th>
            <th scope="col" :aria-sort="currentSort === 'asc' ? 'ascending' : 'descending'">
              <button type="button" @click="sort()">等效理智{{ getSortIndicator() }}</button>
            </th>
          </tr>
        </thead>

        <tbody>
          <template v-for="(character, index) in rows" :key="index">
            <tr v-if="isStarVisible(character)" :class="getStarClass(character.star)">
              <td>{{ getCharRank(index) }}</td>
              <td>{{ character.char }}</td>
              <td>{{ character.item1 }}</td>
              <td>{{ character.num1 }}</td>
              <td>{{ character.item2 }}</td>
              <td>{{ character.num2 }}</td>
              <td>{{ character.item3 }}</td>
              <td>{{ character.num3 }}</td>
              <td>{{ character.item4 }}</td>
              <td>{{ character.num4 }}</td>
              <td>{{ character.value.toFixed(1) }}</td>
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
  width: min(100%, 1080px);

  --elite-one-header: #afeeee;
  --elite-two-header: #98fb98;
  --operator-four-cell: #d8bfd8;
  --operator-five-cell: #f0e68c;
  --operator-six-cell: #f5c193;
  --material-name-cell: #f0f8ff;
  --material-count-cell: #e6e6fa;

  --value-cell: #dcdcdc;
  --rank-cell: #dcdcdc;
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

.filter-button.active {
  border-color: #fff;
  color: #fff;
  font-weight: 600;
}

.filter-button:hover {
  border-color: #000;
  color: #fff;
}

.filter-button:focus-visible {
  outline: 2px solid #000;
  outline-offset: 2px;
}

.filter-button.type-four {
  background: #ee82ee;
}

.filter-button.type-five {
  background: #ffd700;
}

.filter-button.type-six {
  background: #ff8c00;
}

/* 小屏幕下允许表格横向滚动 */
.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

/* 固定表格布局和整体最小宽度 */
table {
  width: 100%;
  min-width: 640px;
  font-size: clamp(0.8rem, 1.7vw, 1rem);
  table-layout: fixed;
  border-collapse: collapse;
}

/* 单元格边框、留白与对齐 */
th,
td {
  border: 1px solid #fff;
  box-sizing: border-box;
  padding: clamp(6px, 1.2vw, 10px) clamp(3px, 0.8vw, 8px);
  text-align: center;
}

td {
  color: #000;
  font-weight: 500;
}

/* 排名列保持白色，干员列根据星级着色 */
td:first-child {
  background-color: var(--rank-cell);
}

tr.type-four td:nth-child(2) {
  background-color: var(--operator-four-cell);
}

tr.type-five td:nth-child(2) {
  background-color: var(--operator-five-cell);
}

tr.type-six td:nth-child(2) {
  background-color: var(--operator-six-cell);
}

/* 所有材料名共用一种底色，数量列共用另一种 */
td:nth-child(3),
td:nth-child(5),
td:nth-child(7),
td:nth-child(9) {
  background-color: var(--material-name-cell);
}

td:nth-child(4),
td:nth-child(6),
td:nth-child(8),
td:nth-child(10) {
  background-color: var(--material-count-cell);
}

td:nth-child(11) {
  background-color: var(--value-cell);
}

th {
  color: #000;
  background-color: #bcbcbc;
  font-weight: 600;
}

th:nth-child(1) {
    background-color: var(--bg);
}

th.elite-one-header {
  color: #000;
  background-color: var(--elite-one-header);
}

th.elite-two-header {
  color: #000;
  background-color: var(--elite-two-header);
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
  color: #fff;
}

th button:focus-visible {
  outline: 2px solid #000;
  outline-offset: 4px;
}

/* 各列宽度比例 */
.rank-column {
  width: 6%;
}

.operator-column {
  width: 16%;
}

.material1-column {
  width: 10%;
}

.material2-column {
  width: 13%;
}

.count-column {
  width: 5%;
}

.result-column {
  width: 13%;
}
</style>