import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/wq-draggable/',
  title: "wq-draggable",
  description: "A simple drag-and-drop library",

  locales: {
    root: {
      lang: 'zh-CN',
      title: 'wq-draggable',
      description: '一个简单的拖拽库',
      label: '简体中文',
      dir: '/cn',
      themeConfig: {
        nav: [
          { text: '首页', link: '/' },
          { text: '示例', link: '/markdown-examples' },
          {text: 'api', link: '/api-examples'}
        ]
      }
    },
    en: {
      lang: 'en-US',
      title: 'wq-draggable',
        description: 'A simple drag-and-drop library',
      label: 'English',
      themeConfig: {
          nav: [
          { text: 'Home', link: '/' },
          { text: 'Examples', link: '/markdown-examples' },
          {text: 'api', link: '/api-examples'}
        ]
      }
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
