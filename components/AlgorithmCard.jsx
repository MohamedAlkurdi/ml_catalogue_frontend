import Link from "next/link";
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon, ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import { useLocale } from "@/app/lib/i18n_context";
import useTranslation from "@/app/lib/useTranslation";

export default function AlgorithmCard({ title, description, href, icon }) {
  const locale = useLocale()
  const translation = useTranslation(locale)

  const explore_algorithm = translation.landing.explore_algorithm

  return (
    <Link
      href={href}
      className="group flex-1 min-w-[265px] relative overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
    >
      <div className="absolute inset-0 light-btn-bg opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
      <div className="relative p-5">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br btn-color text-secondary mb-6 mx-auto shadow-lg">
          <HugeiconsIcon icon={icon} />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3 text-center">
          {title}
        </h3>

        <div className={`mt-6 flex items-center justify-center text-light font-semibold group-hover:translate-x-1 transition-transform duration-300`}>
          {explore_algorithm}
          {
            locale === "ar" ?
            <HugeiconsIcon icon={ArrowLeft01Icon} />
            : <HugeiconsIcon icon={ArrowRight01Icon} />
          }
        </div>
      </div>
    </Link>
  );
}
