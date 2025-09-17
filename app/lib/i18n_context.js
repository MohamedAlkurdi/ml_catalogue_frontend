'use client'

import { createContext, useContext } from 'react'

const LocaleContext = createContext()

export function LocaleProvider({ children, locale }) {
    return (
        <LocaleContext.Provider value={locale}>
            {children}
        </LocaleContext.Provider>
    )
}

export function useLocale() {
    const context = useContext(LocaleContext)
    if (context === undefined) {
        throw new Error('useLocale must be used within a LocaleProvider')
    }
    return context
}