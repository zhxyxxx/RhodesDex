<template>
  <div class="app">
    <header class="header">
      <h1>
        <img class="site-icon" src="/rhodes.png" alt="" />
        <span>RhodesDex</span>
      </h1>
      <nav class="page-navigation" aria-label="排行榜页面">
        <RouterLink to="/event">剧情文本量</RouterLink>
        <RouterLink to="/elite">干员精二数据</RouterLink>
        <RouterLink to="/about">关于</RouterLink>
      </nav>
    </header>

    <main class="main">
      <RouterView />
    </main>

    <footer class="footer">
      <small>RhodesDex · 明日方舟数据整理</small>
    </footer>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  padding: 2rem;
}

h1 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.site-icon {
  width: 1em;
  height: 1em;
  object-fit: contain;
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
  flex: 1;
  display: flex;
  justify-content: center;
  padding: clamp(0.75rem, 3vw, 2rem);
}

.footer {
  border-top: 1px solid var(--border);
  padding: 16px 2rem;
  color: var(--text);
  text-align: center;
}
</style>
