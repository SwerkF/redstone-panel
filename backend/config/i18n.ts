import app from '@adonisjs/core/services/app'
import { defineConfig, formatters, loaders } from '@adonisjs/i18n'

const i18nConfig = defineConfig({
    defaultLocale: 'en',
    formatter: formatters.icu(),

    loaders: [
        loaders.fs({
            location: app.languageFilesPath(),
        }),
    ],

    fallbackLocales: {
        fr: 'en',
    },

    supportedLocales: ['en', 'fr'],
})

export default i18nConfig
