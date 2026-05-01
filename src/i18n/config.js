import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import ar from './ar.json'

const savedLanguage = localStorage.getItem('language') || 'en'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar }
    },
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng)
  document.documentElement.lang = lng
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.setAttribute('dir', lng === 'ar' ? 'rtl' : 'ltr')
})

// Set initial direction
document.documentElement.lang = savedLanguage
document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr'
document.documentElement.setAttribute('dir', savedLanguage === 'ar' ? 'rtl' : 'ltr')

export default i18n
