import { defineTeekConfig } from 'vitepress-theme-teek/config'

/**
 * teek 配置
 * @tutorial https://vp.teek.top/reference/config.html
 */
export const teekConfig = defineTeekConfig({
  // ? 全局配置
  teekHome: true,
  vpHome: false,
  codeBlock: {
    enabled: true
  },
  sidebarTrigger: true,
  author: {
    name: 'True',
    link: 'https://github.com/True-Z'
  },

  // ? 插件配置
  vitePlugins: {
    sidebarOption: {
      ignoreList: [/.*.assets/, /.*.gitkeep/]
    }
  }
})
