<script setup lang="ts">
import EliteRankingTable from './components/EliteRankingTable.vue';
import EventRankingTable from './components/EventRankingTable.vue'
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>RhodesDex</h1>
    </header>

    <main class="main">
      <!-- <EventRankingTable /> -->
      <EliteRankingTable />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
}

.header {
  padding: 2rem;
}

.main {
  display: flex;
  justify-content: center;
  padding: clamp(0.75rem, 3vw, 2rem);
}
</style>