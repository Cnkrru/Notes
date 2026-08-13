<script setup lang="ts">
</script>

<template>
  <div class="not-found">
    <div class="not-found-inner">
      <div class="not-found-code">404</div>
      <h1 class="not-found-title">页面未找到</h1>
      <p class="not-found-desc">你访问的页面不存在，可能已被移除或输入了错误的链接。</p>
      <div class="not-found-actions">
        <router-link class="btn btn-primary" to="/">返回首页</router-link>
        <button class="btn btn-secondary" @click="$router.back()">返回上页</button>
      </div>
    </div>
  </div>
</template>