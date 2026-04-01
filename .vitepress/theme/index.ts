import Teek from 'vitepress-theme-teek'
import 'vitepress-theme-teek/index.css'
import OverviewPage from './components/OverviewPage.vue'

export default {
  extends: Teek,
  enhanceApp(ctx: any) {
    Teek.enhanceApp?.(ctx)
    const { app } = ctx
    app.component('TkOverviewPage', OverviewPage)
  },
}
