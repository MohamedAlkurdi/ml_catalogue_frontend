import { useLocale } from '@/app/lib/i18n_context';
import {handleInputChange, handleTargetSelection, generateInput} from '../../common_utils'
import useTranslation from '@/app/lib/useTranslation';

export default function AlgorithmConfig({BayesState, setBayesState, pythonToJsType, setError}) {
    const locale = useLocale()
    const translation =  useTranslation(locale)
    const select_target = translation.naive_bayes_algorithm_config.select_target
    const selected_column = translation.naive_bayes_algorithm_config.selected_column
    const enter_input = translation.naive_bayes_algorithm_config.enter_input
    const or_geenrate_one = translation.naive_bayes_algorithm_config.or_geenrate_one
    const generate_input = translation.naive_bayes_algorithm_config.generate_input
    const saved_input = translation.naive_bayes_algorithm_config.saved_input

    return(
    <>
        <h1 className="mt-6 text-lg font-semibold">
            {select_target}
        </h1>
        <ul
            className={`flex w-full gap-2 flex-wrap mt-4 ${BayesState.selectedTarget
                ? "pointer-events-none opacity-50"
                : ""
                }`}
        >
            {BayesState.columns.map((element, idx) => (
                <li
                    className="px-3 py-1 rounded-lg btn-color cursor-pointer text-white"
                    onClick={(e) => handleTargetSelection(e, setBayesState)}
                    key={idx}
                >
                    {element.name}
                </li>
            ))}
        </ul>
        {BayesState.selectedTarget && (
            <>
                <h1 className="mt-6 text-lg font-semibold">
                    {selected_column} {BayesState.selectedTarget}
                </h1>
                <h1 className="mt-4 text-lg font-semibold">{enter_input}</h1>
                <form className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
                    {BayesState.columns.map((col, index) => {
                        if (col.name === BayesState.selectedTarget) return null;
                        return (
                            <div key={index} className="flex flex-col">
                                <label className="font-medium text-primary mb-1">
                                    {col.name}{" "}
                                    <span className="text-sm text-gray-500">
                                        ({col.type})
                                    </span>
                                </label>
                                {pythonToJsType[col.type] === "boolean" ? (
                                    <select
                                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onChange={(e) =>
                                            handleInputChange(
                                                col.name,
                                                e.target.value === "true",
                                                col.type,
                                                pythonToJsType,
                                                setBayesState,
                                                setError,
                                            )
                                        }
                                    >
                                        <option value="true">True</option>
                                        <option value="false">False</option>
                                    </select>
                                ) : pythonToJsType[col.type] === "text" ? (
                                    <select
                                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onChange={(e) =>
                                            handleInputChange(
                                                col.name,
                                                e.target.value,
                                                col.type,
                                                pythonToJsType,
                                                setBayesState,
                                                setError,
                                            )
                                        }
                                    >
                                        {Array.from(
                                            new Set(
                                                BayesState.preview.preview.map(
                                                    (row) => row[col.name]
                                                )
                                            )
                                        ).map((val, index) => (
                                            <option key={index} value={val}>
                                                {val}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={pythonToJsType[col.type]}
                                        placeholder={`Enter ${col.name}`}
                                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onChange={(e) =>
                                            handleInputChange(
                                                col.name,
                                                e.target.value,
                                                col.type,
                                                pythonToJsType,
                                                setBayesState,
                                                setError,
                                            )
                                        }
                                    />
                                )}
                            </div>
                        );
                    })}
                </form>
                <h1 className="mt-4 text-lg font-semibold">{or_geenrate_one}</h1>
                <button
                    onClick={() => generateInput(BayesState, setBayesState, pythonToJsType, setError, translation)}
                    className="btn"
                >
                    {generate_input}
                </button>
                <h1 className="mt-4 text-lg font-semibold">{saved_input}</h1>
                <div className="mt-4 p-4 border border-gray-300 rounded bg-gray-50 text-black">
                    <pre className="text-sm">
                        {JSON.stringify(BayesState.savedInput, null, 2)}
                    </pre>
                </div>
            </>
        )}
    </>
    )
}