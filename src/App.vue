<script setup lang="ts">
import { onMounted } from 'vue'
import { useThemeStore, useLayoutStore } from '@/stores'
import '@/assets/css/style.css'
import TopBar from '@/components/TopBar.vue'
import FooterSection from '@/components/FooterSection.vue'
import BackToTop from '@/components/BackToTop.vue'
import ToastHost from '@/components/content/ToastHost.vue'

const themeStore = useThemeStore()
const layoutStore = useLayoutStore()

onMounted(() => {
  themeStore.initTheme()
  layoutStore.initLayout()
})
</script>

<template>
  <div id="app">
    <TopBar />
    <main class="page-container">
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <FooterSection />
    <BackToTop />
    <ToastHost />
  </div>
</template>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.page-container {
  flex: 1;
  min-height: 0;
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.2s ease;
}
.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}
</style>