import React, { useState, useEffect, useRef } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { PlayIcon, Rotate01Icon, Database02Icon, ChartIcon, ChartBarLineIcon, Target03Icon, ArrowDown01Icon, ArrowRight01Icon, ArrowUp01Icon, StructureCheckIcon, PieChart06Icon } from '@hugeicons/core-free-icons';
import { useLocale } from '@/app/lib/i18n_context';
import useTranslation from '@/app/lib/useTranslation';

const NaiveBayesHowItWorks = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [expandedSections, setExpandedSections] = useState({});
    const [isMainCollapsed, setIsMainCollapsed] = useState(true);
    const contentRef = useRef(null);

    const sampleData = [
        { id: 1, outlook: 'Sunny', temperature: 'Hot', humidity: 'High', windy: false, playTennis: 'No' },
        { id: 2, outlook: 'Sunny', temperature: 'Hot', humidity: 'High', windy: true, playTennis: 'No' },
        { id: 3, outlook: 'Overcast', temperature: 'Hot', humidity: 'High', windy: false, playTennis: 'Yes' },
        { id: 4, outlook: 'Rainy', temperature: 'Mild', humidity: 'High', windy: false, playTennis: 'Yes' },
        { id: 5, outlook: 'Rainy', temperature: 'Cool', humidity: 'Normal', windy: false, playTennis: 'Yes' },
        { id: 6, outlook: 'Rainy', temperature: 'Cool', humidity: 'Normal', windy: true, playTennis: 'No' },
        { id: 7, outlook: 'Overcast', temperature: 'Cool', humidity: 'Normal', windy: true, playTennis: 'Yes' },
    ];

    const testInstance = { outlook: 'Sunny', temperature: 'Cool', humidity: 'High', windy: false };

    const locale = useLocale()
    const translation = useTranslation(locale)
    const steps = translation.naive_bayes_how_it_works.steps
    const title = translation.naive_bayes_how_it_works.title
    const playing_word = translation.naive_bayes_how_it_works.playing
    const play_demo = translation.naive_bayes_how_it_works.play_demo
    const reset_word = translation.naive_bayes_how_it_works.reset
    const step_word = translation.naive_bayes_how_it_works.step
    const explanation = translation.naive_bayes_how_it_works.explanation
    const class_distribution = translation.naive_bayes_how_it_works.class_distribution
    const final_prediction = translation.naive_bayes_how_it_works.final_prediction
    const prediction_word = translation.naive_bayes_how_it_works.prediction
    const code_ref = translation.naive_bayes_how_it_works.code_ref
    const sample_data = translation.naive_bayes_how_it_works.sample_data
    const test_instance = translation.naive_bayes_how_it_works.test_instance
    const algorithm_objective = translation.naive_bayes_how_it_works.algorithm_objective
    const final_prediction_probs = translation.naive_bayes_how_it_works.final_prediction_probs
    const probability_distribution = translation.naive_bayes_how_it_works.probability_distribution
    const visual_distribution = translation.naive_bayes_how_it_works.visual_distribution
    const calculation_breakdown = translation.naive_bayes_how_it_works.calculation_breakdown
    const after_normalization = translation.naive_bayes_how_it_works.after_normalization

    const assets = {
        "step1": {
            code: `data = preprocess_dataset("weather.csv")
# Remove ID columns and prepare data`,
            icon: Database02Icon
        },
        "step2": {
            code: `target_values_share(target_column)
# P(Yes) = count(Yes) / total_samples
# P(No) = count(No) / total_samples`,
            icon: ChartIcon
        },
        "step3": {
            code: `calculate_prior_probs(data)
# P(Sunny|Yes) = count(Sunny,Yes) / count(Yes)
# Apply Laplace smoothing for unseen values`,
            icon: ChartBarLineIcon
        },
        "step4": {
            code: `P(class|features) = P(class) × ∏P(feature_i|class)
# Calculate for each possible class`,
            icon: Target03Icon
        },
        "step5": {
            code: `classify(probs)
# Return argmax(P(class|features))`,
            icon: StructureCheckIcon
        }
    }
    const classCount = { Yes: 4, No: 3 };
    const totalSamples = 7;
    const priorProbs = {
        Yes: classCount.Yes / totalSamples,
        No: classCount.No / totalSamples
    };

    const featureProbs = {
        Sunny: { Yes: 1 / 4, No: 2 / 3 },
        Cool: { Yes: 2 / 4, No: 1 / 3 },
        High: { Yes: 3 / 4, No: 3 / 3 },
        false: { Yes: 3 / 4, No: 1 / 3 }
    };

    const finalProbs = {
        Yes: priorProbs.Yes * featureProbs.Sunny.Yes * featureProbs.Cool.Yes * featureProbs.High.Yes * featureProbs.false.Yes,
        No: priorProbs.No * featureProbs.Sunny.No * featureProbs.Cool.No * featureProbs.High.No * featureProbs.false.No
    };

    // Normalize probabilities
    const totalProb = finalProbs.Yes + finalProbs.No;
    const normalizedProbs = {
        Yes: (finalProbs.Yes / totalProb * 100).toFixed(2),
        No: (finalProbs.No / totalProb * 100).toFixed(2)
    };

    const toggleSection = (id) => {
        setExpandedSections(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const toggleMainComponent = () => {
        setIsMainCollapsed(!isMainCollapsed);
    };

    const playAnimation = () => {
        setIsPlaying(true);
        setCurrentStep(0);
        const timer = setInterval(() => {
            setCurrentStep(prev => {
                if (prev >= steps.length - 1) {
                    clearInterval(timer);
                    setIsPlaying(false);
                    return prev;
                }
                return prev + 1;
            });
        }, 3000);
    };

    const resetAnimation = () => {
        setCurrentStep(0);
        setIsPlaying(false);
    };

    return (
        <div className="max-w-4xl mx-auto bg-gradient-to-br mt-8 card-bg rounded-xl shadow-lg">
            <div
                className="p-4 sm:p-6 cursor-pointer rounded-t-xl transition-colors duration-200"
                onClick={toggleMainComponent}
            >
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="p-2 sm:p-3 btn-color rounded-full">
                            <HugeiconsIcon icon={PieChart06Icon} size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary text-center sm:text-left">
                                {title}
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors text-sm sm:text-base">
                        <span>{isMainCollapsed ? 'Expand' : 'Collapse'}</span>
                        {isMainCollapsed ? (
                            <HugeiconsIcon icon={ArrowDown01Icon} className="w-5 h-5 sm:w-6 sm:h-6" />
                        ) : (
                            <HugeiconsIcon icon={ArrowUp01Icon} className="w-5 h-5 sm:w-6 sm:h-6" />
                        )}
                    </div>
                </div>
            </div>

            <div
                ref={contentRef}
                className={`overflow-hidden transition-all duration-700 ease-in-out`}
                style={{
                    maxHeight: isMainCollapsed ? '0px' : `${contentRef.current?.scrollHeight || 2000}px`
                }}
            >
                <div className="px-8 max-sm:px-2 pb-8">

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6 sm:mt-8 mb-8 sm:mb-12">
                        <button
                            onClick={playAnimation}
                            disabled={isPlaying}
                            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 btn-color text-white rounded-lg disabled:opacity-50 transition-all duration-300 cursor-pointer"
                        >
                            <HugeiconsIcon icon={PlayIcon} className="w-4 h-4" />
                            {isPlaying ? playing_word : play_demo}
                        </button>
                        <button
                            onClick={resetAnimation}
                            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 cursor-pointer"
                        >
                            <HugeiconsIcon icon={Rotate01Icon} className="w-4 h-4" />
                            {reset_word}
                        </button>
                    </div>

                    <div className="space-y-6">
                        {steps.map((step, index) => {
                            const IconComponent = assets[step.key].icon;
                            const isActive = currentStep >= index;
                            const isCurrent = currentStep === index;

                            return (
                                <div key={step.id} className="relative">
                                    <div
                                        className={`rounded-xl border-2 transition-all duration-500 cursor-pointer ${isActive
                                            ? 'naive-bayes-active-step'
                                            : 'border-gray-200 bg-gray-50'
                                            } 
                                            ${isCurrent ? 'custom-ring' : ''}
                                            `
                                        }
                                        onClick={() => toggleSection(step.id)}
                                    >
                                        <div className=" max-sm:p-2 p-6">
                                            <div className="flex items-center gap-4 max-sm:gap-2">
                                                <div className={`p-3 rounded-full transition-all duration-300 ${isActive ? 'btn-color text-white' : 'bg-gray-400 text-white'
                                                    }`}>
                                                    <HugeiconsIcon icon={IconComponent} size={24} />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-xl max-sm:text-lg font-semibold text-gray-800">
                                                        {step_word} {step.id}: {step.title}
                                                    </h3>
                                                </div>
                                                <div className={`transition-transform duration-300 ${expandedSections[step.id] ? 'rotate-90' : 'rotate-0'}`}>
                                                    <HugeiconsIcon icon={ArrowRight01Icon} size={24} className="text-gray-400" />
                                                </div>
                                            </div>

                                            <div
                                                className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedSections[step.id]
                                                    ? 'max-h-[2000px] opacity-100 mt-6'
                                                    : 'max-h-0 opacity-0 mt-0'
                                                    }`}
                                            >
                                                <div className="border-t pt-6">
                                                    <div className="grid md:grid-cols-1 gap-6">
                                                        <div>
                                                            <h4 className="font-semibold text-gray-800 mb-3">{explanation}</h4>
                                                            <p className="text-gray-700 leading-relaxed">{step.details}</p>

                                                            {index === 1 && (
                                                                <div className="mt-4 p-4 bg-blue-100 rounded-lg">
                                                                    <h5 className="font-medium text-blue-800 mb-2">{class_distribution}</h5>
                                                                    <div className="text-sm text-blue-700">
                                                                        <div>P(Yes) = {classCount.Yes}/{totalSamples} = {priorProbs.Yes.toFixed(3)}</div>
                                                                        <div>P(No) = {classCount.No}/{totalSamples} = {priorProbs.No.toFixed(3)}</div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {index === 4 && (
                                                                <div className="mt-4 p-4 bg-green-100 rounded-lg">
                                                                    <h5 className="font-medium text-green-800 mb-2">{final_prediction}</h5>
                                                                    <div className="text-sm text-green-700">
                                                                        <div>P(Yes|features) = {normalizedProbs.Yes}%</div>
                                                                        <div>P(No|features) = {normalizedProbs.No}%</div>
                                                                        <div className="font-bold mt-2">
                                                                            {prediction_word} {normalizedProbs.Yes > normalizedProbs.No ? 'Yes' : 'No'}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className='overflow-x-auto'>
                                                            <h4 className="font-semibold text-gray-800 mb-3">{code_ref}</h4>
                                                            <pre className="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                                                                <code>{assets[step.key].code}</code>
                                                            </pre>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-12 btn-color rounded-xl max-sm:p-4 p-6">
                        <h3 className="text-xl font-semibold text-secondary mb-4">{sample_data}</h3>
                        <div className="bg-white rounded p-2 sm:p-3 max-h-32 sm:max-h-48 overflow-auto">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="border-b text-gray-700">
                                        <th className="text-left p-1 ">Outlook</th>
                                        <th className="text-left p-1 ">Temp</th>
                                        <th className="text-left p-1 ">Humidity</th>
                                        <th className="text-left p-1 ">Windy</th>
                                        <th className="text-left p-1  font-bold text-red-600">Play</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sampleData.map(row => (
                                        <tr key={row.id} className="border-b text-xs text-gray-700">
                                            <td className="p-1">{row.outlook}</td>
                                            <td className="p-1">{row.temperature}</td>
                                            <td className="p-1">{row.humidity}</td>
                                            <td className="p-1">{row.windy.toString()}</td>
                                            <td className="p-1 font-bold">{row.playTennis}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 p-4 bg-yellow-100 rounded-lg">
                            <h4 className="font-semibold text-yellow-800 mb-2">{test_instance}</h4>
                            <div className="text-yellow-700">
                                Outlook: Sunny, Temperature: Cool, Humidity: High, Windy: false
                            </div>
                            <div className="text-sm text-yellow-600 mt-1">
                                {algorithm_objective}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 btn-color rounded-xl max-sm:p-4 p-6">
                        <h3 className="text-xl font-semibold text-secondary mb-6 text-center">
                            {final_prediction_probs}
                        </h3>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-lg p-6 shadow-md">
                                <h4 className="font-medium text-gray-700 mb-4 text-center">{probability_distribution}</h4>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-green-600 font-medium">Play Tennis: Yes</span>
                                            <span className="text-green-600 font-bold">{normalizedProbs.Yes}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-6">
                                            <div
                                                className="bg-gradient-to-r from-green-400 to-green-600 h-6 rounded-full transition-all duration-1000 flex items-center justify-end pr-2"
                                                style={{ width: `${normalizedProbs.Yes}%` }}
                                            >
                                                <span className="text-white text-xs font-bold">
                                                    {parseFloat(normalizedProbs.Yes) > 15 ? `${normalizedProbs.Yes}%` : ''}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-red-600 font-medium">Play Tennis: No</span>
                                            <span className="text-red-600 font-bold">{normalizedProbs.No}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-6">
                                            <div
                                                className="bg-gradient-to-r from-red-400 to-red-600 h-6 rounded-full transition-all duration-1000 flex items-center justify-end pr-2"
                                                style={{ width: `${normalizedProbs.No}%` }}
                                            >
                                                <span className="text-white text-xs font-bold">
                                                    {parseFloat(normalizedProbs.No) > 15 ? `${normalizedProbs.No}%` : ''}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-6 shadow-md">
                                <h4 className="font-medium text-gray-700 mb-4 text-center">{visual_distribution}</h4>
                                <div className="flex items-center justify-center">
                                    <div className="relative w-48 h-48">
                                        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                                            <circle
                                                cx="50"
                                                cy="50"
                                                r="40"
                                                fill="none"
                                                stroke="#e5e7eb"
                                                strokeWidth="20"
                                            />

                                            <circle
                                                cx="50"
                                                cy="50"
                                                r="40"
                                                fill="none"
                                                stroke="url(#greenGradient)"
                                                strokeWidth="20"
                                                strokeDasharray={`${(parseFloat(normalizedProbs.Yes) * 251.33) / 100} 251.33`}
                                                strokeDashoffset="0"
                                                className="transition-all duration-1000"
                                            />

                                            <circle
                                                cx="50"
                                                cy="50"
                                                r="40"
                                                fill="none"
                                                stroke="url(#redGradient)"
                                                strokeWidth="20"
                                                strokeDasharray={`${(parseFloat(normalizedProbs.No) * 251.33) / 100} 251.33`}
                                                strokeDashoffset={`-${(parseFloat(normalizedProbs.Yes) * 251.33) / 100}`}
                                                className="transition-all duration-1000"
                                            />

                                            <defs>
                                                <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="#10b981" />
                                                    <stop offset="100%" stopColor="#059669" />
                                                </linearGradient>
                                                <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="#ef4444" />
                                                    <stop offset="100%" stopColor="#dc2626" />
                                                </linearGradient>
                                            </defs>
                                        </svg>

                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-gray-800">
                                                    {normalizedProbs.Yes > normalizedProbs.No ? 'YES' : 'NO'}
                                                </div>
                                                <div className="text-sm text-gray-600">Prediction</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-center space-x-6">
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-600 rounded mr-2"></div>
                                        <span className="text-sm text-gray-700">Yes ({normalizedProbs.Yes}%)</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-red-600 rounded mr-2"></div>
                                        <span className="text-sm text-gray-700">No ({normalizedProbs.No}%)</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 bg-white rounded-lg p-6 shadow-md">
                            <h4 className="font-medium text-gray-700 mb-4 text-center">{calculation_breakdown}</h4>
                            <div className="grid md:grid-cols-2 gap-6 text-sm ltr">
                                <div className="space-y-2">
                                    <h5 className="font-semibold text-green-700">P(Yes | features):</h5>
                                    <div className="text-gray-600 font-mono">
                                        <div>P(Yes) = {priorProbs.Yes.toFixed(3)}</div>
                                        <div>P(Sunny|Yes) = {featureProbs.Sunny.Yes.toFixed(3)}</div>
                                        <div>P(Cool|Yes) = {featureProbs.Cool.Yes.toFixed(3)}</div>
                                        <div>P(High|Yes) = {featureProbs.High.Yes.toFixed(3)}</div>
                                        <div>P(false|Yes) = {featureProbs.false.Yes.toFixed(3)}</div>
                                        <div className="border-t pt-2 mt-2">
                                            <strong>Product = {finalProbs.Yes.toFixed(6)}</strong>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h5 className="font-semibold text-red-700">P(No | features):</h5>
                                    <div className="text-gray-600 font-mono">
                                        <div>P(No) = {priorProbs.No.toFixed(3)}</div>
                                        <div>P(Sunny|No) = {featureProbs.Sunny.No.toFixed(3)}</div>
                                        <div>P(Cool|No) = {featureProbs.Cool.No.toFixed(3)}</div>
                                        <div>P(High|No) = {featureProbs.High.No.toFixed(3)}</div>
                                        <div>P(false|No) = {featureProbs.false.No.toFixed(3)}</div>
                                        <div className="border-t pt-2 mt-2">
                                            <strong>Product = {finalProbs.No.toFixed(6)}</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 text-center text-sm text-gray-600">
                                <div className="bg-gray-100 rounded p-3">
                                    <strong>{after_normalization}</strong> 
                                    <span>  </span>
                                    <span className="ml-2">
                                        P(Yes) = {normalizedProbs.Yes}%, P(No) = {normalizedProbs.No}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NaiveBayesHowItWorks;