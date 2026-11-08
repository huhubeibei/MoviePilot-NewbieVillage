import { createApp } from 'vue'
import AppPage from './components/AppPage.vue'

// 联邦模式下由宿主加载组件；本入口仅用于本地开发预览。
createApp(AppPage).mount('#app')
