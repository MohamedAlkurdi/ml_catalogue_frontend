"use client"
import translationEN from '../../messages/en.json'
import translationAR from '../../messages/ar.json'
import translationTR from '../../messages/tr.json'
import { supported_locales } from './i18n_config'

const useTranslation = (locale) => {
    if (locale === supported_locales[1]) {
        return translationAR
    }
    if (locale === supported_locales[2]){
        return translationTR
    }
    return translationEN
}

export default useTranslation