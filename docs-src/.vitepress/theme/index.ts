import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { Notice, Links, Card, Pill, BoxCube, CopyText, Underline } from '@theojs/lumen'
import '@theojs/lumen/style'

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'home-hero-info-before': () => h(Notice),
    }),
  enhanceApp({ app }) {
    app.component('Links', Links)
    app.component('Card', Card)
    app.component('Pill', Pill)
    app.component('BoxCube', BoxCube)
    app.component('CopyText', CopyText)
    app.component('Underline', Underline)
  },
} satisfies Theme
