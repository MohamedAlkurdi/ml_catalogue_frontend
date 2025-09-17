"use client"

import { useParams, usePathname, useRouter } from "next/navigation"
import { useCallback } from "react"

export default function LangToggle() {
    const params = useParams()
    const pathname = usePathname()
    const router = useRouter()

    const currentLocale = params.locale ? String(params.locale) : 'en'

    const handleLanguageChange = useCallback((event) => {
        const newLocale = event.target.value

        const pathnameWithoutLocale = pathname.replace(`/${currentLocale}`, '')

        const newPath = `/${newLocale}${pathnameWithoutLocale}`

        router.push(newPath)
    }, [currentLocale, pathname, router])

    return (
        <div>
            <select
                onChange={handleLanguageChange}
                className="font-bold p-2 rounded-md card-bg text-secondary btn-color hover:bg-opacity-30 transition-colors focus:border-0 focus:outline-0"
                value={currentLocale}
            >
                <option className="font-bold" value="en">EN</option>
                <option className="font-bold" value="ar">AR</option>
                <option className="font-bold" value="tr">TR</option>
            </select>
        </div>
    )
}