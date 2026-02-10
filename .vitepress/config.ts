import { defineConfig } from 'vitepress'
import { teekConfig } from './teekConfig'

const description = [
  '欢迎来到 vitepress-theme-teek 使用文档',
  'Teek 是一个基于 VitePress 构建的主题，是在默认主题的基础上进行拓展，支持 VitePress 的所有功能、配置',
  'Teek 拥有三种典型的知识管理形态：结构化、碎片化、体系化，可以轻松构建一个结构化知识库，适用个人博客、文档站、知识库等场景',
].toString()

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const base = process.env.GITHUB_ACTIONS && repoName ? `/${repoName}/` : '/'

/**
 * VitePress 配置
 *
 * @tutorial https://vitepress.dev/zh/reference/site-config
 */
export default defineConfig({
  extends: teekConfig,
  // ? 站点配置
  base,
  srcDir: './docs',

  // ? frontmatter 配置
  title: 'devops',
  description,

  // ? 主题相关配置
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: '首页', link: '/' },
      {
        text: '编程',
        items: [
          { text: '前端', link: '/fe-intro/' },
          { text: '后端', link: '/be-intro/' },
          { text: '数据库', link: '/db-intro/' },
          { text: '设计模式', link: '/designMode-intro/' },
          { text: '算法', link: '/algorithm-intro/' },
          { text: '解决方案', link: '/solution-intro/' },
        ],
      },
      {
        text: '运维',
        items: [
          { text: 'Windows', link: '/windows-intro/' },
          { text: 'Linux', link: '/linux-intro/' },
        ],
      },
      {
        text: '构建',
        items: [
          { text: 'IDE', link: '/ide-intro/' },
          { text: '版本控制系统', link: '/vcs-intro/' },
          { text: '包管理器', link: '/pm-intro/' },
        ],
      },
      {
        text: '学习',
        items: [
          { text: '计算机基础', link: '/computer-intro/' },
          { text: '输入法', link: '/inputMethod-intro/' },
        ],
      },
      {
        text: '脚本',
        items: [{ text: '工具', link: '/script-intro/' }],
      },
      {
        text: '汇总功能',
        items: [
          { text: '归档页', link: '/archives' },
          { text: '清单页', link: '/articleOverview' },
          { text: '分类页', link: '/categories' },
          { text: '标签页', link: '/tags' },
        ],
      },
    ],
    outline: {
      level: [2, 3],
      label: '本页导航',
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/True-Z/devops',
      },
    ],
    darkModeSwitchLabel: '主题',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部',
    editLink: {
      text: '在 GitHub 上编辑此页',
      pattern: 'https://github.com/True-Z/devops/edit/main/docs/:path',
    },
    lastUpdated: {
      text: '上次更新时间',
    },
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    search: {
      provider: 'local',
    },
  },
})
