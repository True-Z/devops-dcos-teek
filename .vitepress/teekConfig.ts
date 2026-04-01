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
    enabled: true,
    collapseHeight: false,
  },
  sidebarTrigger: true,
  author: {
    name: 'True',
    link: 'https://github.com/True-Z',
  },

  // ? 插件配置
  vitePlugins: {
    sidebarOption: {
      ignoreList: [/.*.assets/, /.*.gitkeep/],
      // 一级、二级分组默认展开，方便先看到主分类和二级分类入口。
      // 三级及更深层级分组默认折叠，避免侧边栏在进入具体内容后一次性展开过多内容。
      // VitePress 侧边栏分组天然支持多个同时展开，这里只控制默认展开状态。
      collapsed: (relativePath) => relativePath.split('/').length >= 3,
    },
  },
})
