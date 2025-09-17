import LangToggle from "@/components/LangToggle";
import { handleLocale } from "../lib/i18n_config";
import { LocaleProvider } from "../lib/i18n_context";
import ThemeToggle from "@/components/ThemeToggle";
import SideNavigation from "@/components/SideNavigation";

export default async function LocaleLayout({ children, params }) {
    const locale = await handleLocale(params)
    return (
        <>
            <div className={`fixed top-3 flex gap-3 z-50 items-center ${locale == "ar" ? "left-3 rtl" : "right-3 "}`}>
                <LangToggle />
                <ThemeToggle />
            </div>
            <LocaleProvider locale={locale}>
                <SideNavigation />
                <div className={`${locale === 'en' || locale === 'tr' ? `ltr` : 'rtl'} max-w-[100vw] overflow-x-hidden background`}>
                    {children}
                </div>
            </LocaleProvider>
        </>

    )
}