'use client'

import AlgorithmCard from "@/components/AlgorithmCard";
import { ChartScatterIcon, Tree07Icon, FilterHorizontalIcon } from '@hugeicons/core-free-icons';
import { useLocale } from "../lib/i18n_context";
import useTranslation from "../lib/useTranslation";
import Signature from "@/components/Signature";

export default function Home() {
  const locale = useLocale()
  const translation = useTranslation(locale)

  const welcome = translation.landing.welcome
  const algorithms = translation.landing.algorithms
  const sub_title = translation.landing.sub_title

  const algorithms_assets = {
    "knn": {
      icon: ChartScatterIcon,
      href: "/algorithms/knn"
    },
    "decision-tree": {
      icon: Tree07Icon,
      href: "/algorithms/decision-tree"
    },
    "naive-bayes": {
      icon: FilterHorizontalIcon,
      href: "/algorithms/naive-bayes"
    }
  }

  return (
    <div className="font-sans">
      <div className="min-h-screen flex items-center justify-center px-4 sm:pb-8 max-sm:mt-12 py-14">
        <div className="w-full max-w-7xl flex flex-col items-center text-center gap-6">
          <h1 className="max-sm:text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-bold mb-6 max-sm:mb-2 leading-tight w-full text-light">
            {welcome}
          </h1>
            <h2 className="text-primary text-lg font-normal mb-4 italic">{sub_title}</h2>

          <div className="flex flex-wrap gap-4 sm:gap-6 w-full">
            {Object.keys(algorithms).map((algo) => (
              <AlgorithmCard
                key={algo}
                title={algorithms[algo].algo_title}
                description={algorithms[algo].algo_description}
                href={`/${locale}${algorithms_assets[algo].href}`}
                icon={algorithms_assets[algo].icon}
              />
            ))}
          </div>
        </div>
      </div>
      <Signature/>
    </div>
  );
}
