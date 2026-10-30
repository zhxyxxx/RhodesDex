<template>
  <div class="app">
    <header class="header">
      <h1>RhodesDex</h1>
      <nav class="page-navigation" aria-label="排行榜页面">
        <RouterLink to="/event">剧情文本量</RouterLink>
        <RouterLink to="/elite">干员精二数据</RouterLink>
      </nav>
    </header>

    <main class="main">
      <RouterView />
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

.page-navigation {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 0;
  border-bottom: 1px solid var(--border);
}

.page-navigation a {
  border-bottom: 3px solid transparent;
  margin-bottom: -1px;
  padding: 10px 20px;
  color: var(--text);
  background: transparent;
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s;
}

.page-navigation a:hover,
.page-navigation a:focus-visible {
  color: var(--text-h);
  background: var(--social-bg);
}

.page-navigation a.router-link-active {
  border-bottom-color: #08a26c;
  color: var(--text-h);
  font-weight: 600;
}

.main {
  display: flex;
  justify-content: center;
  padding: clamp(0.75rem, 3vw, 2rem);
}
</style>
