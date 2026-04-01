import { defineConfig } from 'vitepress'
import { teekConfig } from './teekConfig'

const description = [
  '欢迎来到 vitepress-theme-teek 使用文档',
  'Teek 是一个基于 VitePress 构建的主题，是在默认主题的基础上进行拓展，支持 VitePress 的所有功能、配置',
  'Teek 拥有三种典型的知识管理形态：结构化、碎片化、体系化，可以轻松构建一个结构化知识库，适用个人博客、文档站、知识库等场景',
].toString()

const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env
const repoName = env?.GITHUB_REPOSITORY?.split('/')[1]
const base = env?.GITHUB_ACTIONS && repoName ? `/${repoName}/` : '/'

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
  head: [['link', { rel: 'icon', href: `${base}favicon.ico` }]],

  // ? frontmatter 配置
  title: 'devops',
  description,

  // ? 主题相关配置
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: '首页', link: '/' },
      { text: '知识库组织说明', link: '/knowledge-base-organization/' },
      {
        text: '编程',
        items: [
          { text: '目录', link: '/coding/' },
          { text: '前端', link: '/fe-intro/' },
          { text: '后端', link: '/be-intro/' },
          { text: '数据库', link: '/db-intro/' },
          { text: '设计模式', link: '/designMode-intro/' },
          { text: '算法', link: '/algorithm-intro/' },
          { text: '解决方案', link: '/solution-intro/' },
          { text: '工程协作', link: '/dev-collab-intro/' },
          { text: '脚本工具', link: '/automation-script-intro/' },
        ],
      },
      {
        text: '运维',
        items: [
          { text: '目录', link: '/ops/' },
          {
            text: '运维认知',
            items: [
              { text: '目录', link: '/ops/cognition/' },
              { text: '运维是什么', link: '/ops/what-is-ops-intro/' },
              { text: '运维分类全览', link: '/ops/ops-category-overview-intro/' },
              { text: '学习路径', link: '/ops/path-intro/' },
            ],
          },
          {
            text: '运维基础',
            items: [
              { text: '目录', link: '/ops/basic/' },
              { text: '计算机组成', link: '/ops/composition-intro/' },
              { text: '操作系统原理', link: '/ops/basic-os-intro/' },
              { text: '计算机网络', link: '/ops/computer-network-intro/' },
              { text: '数据结构与算法', link: '/ops/data-structure-algorithm-intro/' },
            ],
          },
          {
            text: '操作系统',
            items: [
              { text: '目录', link: '/ops/os/' },
              { text: 'Windows', link: '/ops/windows-intro/' },
              { text: 'Linux', link: '/ops/linux-intro/' },
            ],
          },
          {
            text: '知识实操',
            items: [
              { text: '目录', link: '/ops/knowledge-practice/' },
              { text: '文件与目录', link: '/ops/files-intro/' },
              { text: '权限与用户', link: '/ops/permission-intro/' },
              { text: '环境变量', link: '/ops/env-var-intro/' },
              { text: '服务管理', link: '/ops/service-intro/' },
              { text: '进程与资源', link: '/ops/process-resource-intro/' },
              { text: '网络连通', link: '/ops/network-intro/' },
              { text: '日志与排障', link: '/ops/troubleshooting-intro/' },
              { text: '磁盘与存储', link: '/ops/storage-intro/' },
              { text: '计划任务', link: '/ops/scheduled-task-intro/' },
            ],
          },
          {
            text: '实操方案',
            items: [
              { text: '目录', link: '/ops/practice/' },
              { text: '环境搭建', link: '/ops/env-setup-intro/' },
              { text: '部署发布', link: '/ops/deploy-intro/' },
              { text: '备份与恢复', link: '/ops/backup-recovery-intro/' },
              { text: '回滚方案', link: '/ops/rollback-intro/' },
              { text: '排障手册', link: '/ops/troubleshooting-manual-intro/' },
              { text: '常用操作流', link: '/ops/common-flow-intro/' },
            ],
          },
          {
            text: '自动化运维',
            items: [
              { text: '目录', link: '/ops/automation/' },
              { text: 'Python基础', link: '/ops/python-basic-intro/' },
              { text: 'Shell脚本', link: '/ops/shell-script-intro/' },
              { text: '任务编排', link: '/ops/task-orchestration-intro/' },
              { text: '自动化工具与实践', link: '/ops/automation-tools-practice-intro/' },
            ],
          },
        ],
      },
      {
        text: '学习与执行',
        items: [
          { text: '目录', link: '/learning-methods/' },
          { text: '学习与执行', link: '/learning-methods-intro/' },
          { text: '运维基础', link: '/ops/basic/' },
          { text: '锻炼', link: '/fitness-intro/' },
          { text: '生活常识', link: '/life-common-sense-intro/' },
          { text: '饮食', link: '/diet-intro/' },
          { text: '为人处事', link: '/social-intro/' },
          { text: '唱歌', link: '/singing-intro/' },
          { text: '输入法', link: '/inputMethod-intro/' },
          { text: '语言', link: '/language-intro/' },
          { text: '恋爱知识', link: '/love-intro/' },
        ],
      },
      { text: '经历记录', link: '/experience-reflection-intro/' },
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
