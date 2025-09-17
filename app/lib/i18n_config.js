import { redirect } from "next/navigation"

const supported_locales = ['en', 'ar', "tr"]
const default_locale = 'en'

const isSupportedLocale = (locale) => {
    return supported_locales.includes(locale)
}

const handleLocale = async (params) => {
    const request = await params
    try {
        if (request.locale) {
            if (isSupportedLocale(request.locale)) {
                return request.locale
            }
            console.log("language is not supported, supported locales are:", supported_locales)
            console.log("falling back to default locale (en)...")
            return default_locale
        }
    } catch (e) {
        console.log('Error handling locale: ', e)
        redirect(`/${default_locale}`)
    }
}

export { supported_locales, default_locale, handleLocale }