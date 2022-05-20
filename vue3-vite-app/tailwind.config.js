module.exports = {
  content: [],
  theme: {
    extend: {},
    // 自定义背景颜色
    backgroundColor: theme => ({
      // 首先将 tailwind 默认的颜色结构
      ...theme('colors'),
      // 再添加自定义的颜色
      'navBg': '#6ee7b7',
      'navItem': '#10b981',
      'navHover': '#0a7c5a'
    })
  },
  plugins: [],
  darkMode: 'media', // or 'media' or 'class'
  // 配置 purge 选项指定所有的 pages 和 components 文件，使得 Tailwind 可以在生产构建中对未使用的样式进行 tree-shaking 优化
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
}
