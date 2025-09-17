import { useLocale } from '@/app/lib/i18n_context'
import { handleTargetSelection } from '../../common_utils'
import useTranslation from '@/app/lib/useTranslation'

export default function AlgorithmConfig({ DTState, setDTState }) {
    const locale = useLocale()
    const translation = useTranslation(locale)
    const select_target = translation.dt_algorithm_config.select_target
    const selected_column = translation.dt_algorithm_config.select_target

    return (
        <>
            <h1 className="mt-6 text-lg font-semibold">
                {select_target}
            </h1>
            <ul
                className={`flex w-full gap-2 flex-wrap mt-4 ${DTState.selectedTarget
                    ? "pointer-events-none opacity-50"
                    : ""
                    }`}
            >
                {DTState.columns.map((element, idx) => (
                    <li
                        className="px-3 py-1 rounded-lg btn-color cursor-pointer text-white"
                        onClick={(e) => handleTargetSelection(e, setDTState)}
                        key={idx}
                    >
                        {element.name}
                    </li>
                ))}
            </ul>
            {DTState.selectedTarget && (
                <>
                    <h1 className="mt-6 text-lg font-semibold">
                        {selected_column} {DTState.selectedTarget}
                    </h1>
                </>
            )}
        </>
    )
}