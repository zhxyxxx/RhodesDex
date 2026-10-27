<script setup lang="ts">
import EventRankingTable from './components/EventRankingTable.vue'
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>RhodesDex</h1>
    </header>

    <main class="main">
      <EventRankingTable />
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
  padding: 2rem;
}
</style>