// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  /**
   * components/form/BaseInput.vue を BaseInput として解決する（既定だと FormBaseInput になる）
   */
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  devtools: { enabled: process.env.NODE_ENV === 'development' },
  typescript: {
    strict: true,
  },
  css: ['~/assets/styles/form.scss', '@fortawesome/fontawesome-free/css/all.min.css'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
  },
  app: {
    // GitHub Pages 等のサブパス公開時は NUXT_APP_BASE_URL=/リポジトリ名/ を指定（末尾スラッシュ）
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      title: '会員登録 | Smart Form',
      htmlAttrs: { lang: 'ja' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Nuxt 3・Vue 3 と vee-validate / Yup の会員登録フォーム実装例。コントラスト、ラベル、キーボード操作、エラー表示など WCAG を参照したアクセシビリティ配慮。',
        },
      ],
    },
  },
})
