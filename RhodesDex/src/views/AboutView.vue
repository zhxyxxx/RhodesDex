<template>
  <section class="about-page">
    <h2>关于</h2>
    <p>
      开发者: <a href="https://space.bilibili.com/1424066" target="_blank" rel="noopener noreferrer">@x叉X叉x</a><br>
      Github: <a href="https://github.com/zhxyxxx/RhodesDex" target="_blank" rel="noopener noreferrer">zhxyxxx/RhodesDex</a><br>
      本网站是《明日方舟》相关的数据整理与可视化项目。如果在使用中发现错误或有任何建议，欢迎您通过b站私信或Github issue联系我。<br>
      本网站部分数据来源于<a href="http://prts.wiki/" target="_blank" rel="noopener noreferrer"> PRTS </a>及<a href="https://ark.yituliu.cn/" target="_blank" rel="noopener noreferrer"> 明日方舟一图流</a>。
    </p>
    <p>
      本网站是由《明日方舟》游戏爱好者制作。网站所涉及的公司名称、商标、产品等均为其各自所有者的资产，仅供识别。<br>
      网站内使用的游戏图片、动画、音频、文本原文，仅用于更好地表现游戏资料，其版权属于上海鹰角网络科技有限公司及其关联公司。<br>
      除非另有声明，网站其他内容采用<a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer"> CC BY-NC-SA 4.0 </a>共享授权。
    </p>
  </section>
</template>

<style scoped>
.about-page {
  width: min(100%, 760px);
  margin: 0 auto;
  text-align: left;
}

h2 {
  text-align: center;
}

p {
  line-height: 1.8;
}

.about-page p + p {
  margin-top: 5rem;
}

.about-page a {
  color: #08a26c;
  text-decoration: none;
  font-weight: 600;
  position: relative;
  top: 0.04em;
}

.about-page a:focus-visible {
  border-radius: 2px;
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}
</style>
