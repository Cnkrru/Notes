import { ref, watch, onMounted } from 'vue'
import Prism, { ensureLanguageLoaded } from '@/utils/prism'

/**
 * 为结构化预览（JsonView / YamlView / TomlView）的源码视图提供 Prism 语法高亮。
 */
export function useSourceHighlight(lang, active) {
  const sourceRef = ref(null)

  async function apply() {
    const el = sourceRef.value
    if (!el) return
    el.classList.add('language-' + lang)
    await ensureLanguageLoaded(lang)
    Prism.highlightElement(el)
  }

  // flush:'post' 确保 v-else 已渲染出 <code> 再高亮
  watch(active, (v) => { if (v) apply() }, { flush: 'post' })
  onMounted(() => { if (active.value) apply() })

  return { sourceRef }
}