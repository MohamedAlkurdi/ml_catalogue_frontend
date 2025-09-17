import Link from "next/link";
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowUpRight01Icon } from '@hugeicons/core-free-icons';
import useTranslation from "@/app/lib/useTranslation";
import { useLocale } from "@/app/lib/i18n_context";


export default function Signature() {
    const locale = useLocale()
    const translation = useTranslation(locale)

    const developer = translation.landing.developer

    return (
        <div className="w-full fixed bottom-2 text-center flex justify-center max-sm:relative max-md:relative max-md:my-8">
            <div className="w-1/2 max-sm:w-3/4">
                <Link className=" btn" target="blank" href={"https://muhammedalkurdiportfolio.vercel.app/en"}>
                    {developer}
                    <HugeiconsIcon icon={ArrowUpRight01Icon} />
                </Link>
            </div>
        </div>
    )
}