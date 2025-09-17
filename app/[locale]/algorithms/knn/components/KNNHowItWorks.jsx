import React, { useState, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { PlayIcon, Rotate01Icon, Calculator01Icon, Target03Icon, Target02Icon, ChartLineData02Icon, ArrowDown01Icon, ArrowUp01Icon, StructureCheckIcon, ChartScatterIcon } from '@hugeicons/core-free-icons';
import { useLocale } from '@/app/lib/i18n_context';
import useTranslation from '@/app/lib/useTranslation';

const KNNHowItWorks = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedK, setSelectedK] = useState(3);
    const [isExpanded, setIsExpanded] = useState(false);

    const locale = useLocale()
    const translation = useTranslation(locale)

    const steps = translation.knn_how_it_works.steps
    const title = translation.knn_how_it_works.title
    const collapse_word = translation.knn_how_it_works.collapse
    const expand_word = translation.knn_how_it_works.expand
    const playing_word = translation.knn_how_it_works.playing
    const play_demo = translation.knn_how_it_works.play_demo
    const reset_word = translation.knn_how_it_works.reset
    const data_vis = translation.knn_how_it_works.data_vis
    const algorithm_details = translation.knn_how_it_works.algorithm_details
    const details_placeholder = translation.knn_how_it_works.details_placeholder
    const distance_calc = translation.knn_how_it_works.distance_calc
    const distance_formula = translation.knn_how_it_works.distance_formula
    const classification_results = translation.knn_how_it_works.classification_results
    const vote_count = translation.knn_how_it_works.vote_count
    const class_word = translation.knn_how_it_works.class_word
    const vote_word = translation.knn_how_it_works.vote_word
    const predicted_class = translation.knn_how_it_works.predicted_class
    const core_algorithm_steps = translation.knn_how_it_works.core_algorithm_steps
    const knn_algorithm = translation.knn_how_it_works.knn_algorithm
    const sorted_by_distance = translation.knn_how_it_works.sorted_by_distance
    const nearest_neighbors = translation.knn_how_it_works.nearest_neighbors



    const datasetPoints = [
        { id: 1, features: [2, 3], target: 'A', distance: null },
        { id: 2, features: [3, 2], target: 'A', distance: null },
        { id: 3, features: [6, 7], target: 'B', distance: null },
        { id: 4, features: [7, 6], target: 'B', distance: null },
        { id: 5, features: [1, 1], target: 'A', distance: null },
        { id: 6, features: [8, 8], target: 'B', distance: null },
        { id: 7, features: [4, 5], target: 'A', distance: null },
        { id: 8, features: [5, 4], target: 'B', distance: null }
    ];

    const inputPoint = { features: [4, 4], target: '?' };

    const icons = {
        "step1": <HugeiconsIcon icon={Target03Icon} className="w-5 h-5" />,
        "step2": <HugeiconsIcon icon={Calculator01Icon} className="w-5 h-5" />,
        "step3": <HugeiconsIcon icon={ChartLineData02Icon} className="w-5 h-5" />,
        "step4": <HugeiconsIcon icon={Target02Icon} className="w-5 h-5" />,
        "step5": <HugeiconsIcon icon={StructureCheckIcon} className="w-5 h-5" />,
    }

    const calculateDistance = (p1, p2) => {
        return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
    };

    const pointsWithDistances = datasetPoints.map(point => ({
        ...point,
        distance: calculateDistance(point.features, inputPoint.features)
    })).sort((a, b) => a.distance - b.distance);

    const kNeighbors = pointsWithDistances.slice(0, selectedK);
    const prediction = kNeighbors.reduce((acc, point) => {
        acc[point.target] = (acc[point.target] || 0) + 1;
        return acc;
    }, {});
    const finalPrediction = Object.keys(prediction).reduce((a, b) =>
        prediction[a] > prediction[b] ? a : b
    );

    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentStep(prev => {
                    if (prev >= steps.length - 1) {
                        setIsPlaying(false);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, steps.length]);

    const resetDemo = () => {
        setCurrentStep(0);
        setIsPlaying(false);
    };

    const startDemo = () => {
        setIsPlaying(true);
    };

    const getPointColor = (point, step) => {
        if (step < 2) return point.target === 'A' ? 'bg-pink-500' : 'bg-red-500';
        if (step === 2 || step === 3) {
            const isNeighbor = kNeighbors.some(n => n.id === point.id);
            return isNeighbor ? 'bg-green-500' : 'bg-gray-300';
        }
        if (step >= 4) {
            const isSelected = kNeighbors.slice(0, selectedK).some(n => n.id === point.id);
            return isSelected ? 'bg-green-500' : 'bg-gray-300';
        }
        return 'bg-gray-300';
    };

    return (
        <div className="max-w-4xl mx-auto bg-gradient-to-br mt-6 sm:mt-8 card-bg rounded-xl shadow-lg">
            <div
                className="p-4 sm:p-6 cursor-pointer rounded-t-xl transition-colors duration-200"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="p-2 sm:p-3 btn-color rounded-full">
                            <HugeiconsIcon icon={ChartScatterIcon} size={24} className="text-white" />
                        </div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary text-center sm:text-left">
                            {title}
                        </h1>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors text-sm sm:text-base">
                        <span>{isExpanded ? collapse_word : expand_word}</span>
                        {isExpanded ? (
                            <HugeiconsIcon icon={ArrowUp01Icon} className="w-5 h-5 sm:w-6 sm:h-6" />
                        ) : (
                            <HugeiconsIcon icon={ArrowDown01Icon} className="w-5 h-5 sm:w-6 sm:h-6" />
                        )}
                    </div>
                </div>
            </div>

            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-none opacity-100 p-4 sm:p-6' : 'max-h-0 opacity-0'}`}>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6 sm:mt-8 mb-8 sm:mb-12">
                    <button
                        onClick={startDemo}
                        disabled={isPlaying}
                        className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 btn-color text-white rounded-lg disabled:opacity-50 transition-all duration-300 cursor-pointer"
                    >
                        <HugeiconsIcon icon={PlayIcon} className="w-4 h-4" />
                        {isPlaying ? playing_word : play_demo}
                    </button>
                    <button
                        onClick={resetDemo}
                        className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 cursor-pointer"
                    >
                        <HugeiconsIcon icon={Rotate01Icon} className="w-4 h-4" />
                        {reset_word}
                    </button>
                    <div className="flex items-center gap-2 text-sm sm:text-base">
                        <label className="font-medium text-primary">K Value:</label>
                        <select
                            value={selectedK}
                            onChange={(e) => setSelectedK(Number(e.target.value))}
                            className="px-2 sm:px-3 py-1 border rounded-md text-black"
                        >
                            <option value={1}>1</option>
                            <option value={3}>3</option>
                            <option value={5}>5</option>
                            <option value={7}>7</option>
                        </select>
                    </div>
                </div>

                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-wrap justify-between gap-2 sm:gap-4 mb-4">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className={`flex items-center gap-2 p-3 rounded-lg transition-all text-gray-500 ${index <= currentStep
                                    ? 'light-btn-bg secondary-text'
                                    : 'bg-gray-100 text-black'
                                    }`}
                            >
                                <div className={`p-1 rounded-full ${index <= currentStep ? 'btn-color text-white' : 'bg-gray-300'
                                    }`}>
                                    {icons[step.id]}
                                </div>
                                <div className="text-xs hidden md:block">
                                    {step.title}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center p-3 sm:p-4 btn-color rounded-lg">
                        <p className="text-sm sm:text-lg text-white font-bold">{steps[currentStep]?.description}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1  gap-6 sm:gap-8">

                    <div className="btn-color p-4 sm:p-6 rounded-lg">
                        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-secondary">{data_vis}</h3>
                        <div className="relative w-full h-64 sm:h-80 md:h-96 bg-white border-2 border-gray-200 rounded overflow-hidden">
                            {[...Array(9)].map((_, i) => (
                                <div key={`h-${i}`} className="absolute w-full border-t border-gray-100" style={{ top: `${((i + 1) / 10) * 100}%` }} />
                            ))}
                            {[...Array(9)].map((_, i) => (
                                <div key={`v-${i}`} className="absolute h-full border-l border-gray-100" style={{ left: `${((i + 1) / 10) * 100}%` }} />
                            ))}

                            {datasetPoints.map((point) => (
                                <div
                                    key={point.id}
                                    className={`absolute w-3 sm:w-4 h-3 sm:h-4 rounded-full transform -translate-x-1.5 -translate-y-1.5 sm:-translate-x-2 sm:-translate-y-2 transition-all duration-500 ${getPointColor(point, currentStep)}`}
                                    style={{
                                        left: `${(point.features[0] / 10) * 100}%`,
                                        top: `${(1 - point.features[1] / 10) * 100}%`
                                    }}
                                >
                                    {currentStep >= 2 && (
                                        <div className="absolute -top-5 sm:-top-6 -left-2 text-[10px] sm:text-xs bg-white px-1 rounded shadow">
                                            {pointsWithDistances.find(p => p.id === point.id)?.distance?.toFixed(1)}
                                        </div>
                                    )}
                                </div>
                            ))}

                            <div
                                className="absolute w-5 sm:w-6 h-5 sm:h-6 bg-yellow-500 border-2 sm:border-4 border-yellow-600 rounded-full transform -translate-x-2.5 -translate-y-2.5 sm:-translate-x-3 sm:-translate-y-3"
                                style={{
                                    left: `${(inputPoint.features[0] / 10) * 100}%`,
                                    top: `${(1 - inputPoint.features[1] / 10) * 100}%`
                                }}
                            />

                            {currentStep >= 2 && (
                                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                    {kNeighbors.slice(0, selectedK).map(point => (
                                        <line
                                            key={`line-${point.id}`}
                                            className="stroke-green-500 stroke-2 opacity-50"
                                            x1={`${(inputPoint.features[0] / 10) * 100}%`}
                                            y1={`${(1 - inputPoint.features[1] / 10) * 100}%`}
                                            x2={`${(point.features[0] / 10) * 100}%`}
                                            y2={`${(1 - point.features[1] / 10) * 100}%`}
                                        />
                                    ))}
                                </svg>
                            )}
                        </div>
                        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-4 text-xs sm:text-sm">
                            <div className="flex items-center gap-1 sm:gap-2"><div className="w-3 sm:w-4 h-3 sm:h-4 bg-pink-500 rounded-full"></div><span className='text-secondary'>Class A</span></div>
                            <div className="flex items-center gap-1 sm:gap-2"><div className="w-3 sm:w-4 h-3 sm:h-4 bg-red-500 rounded-full"></div><span className='text-secondary'>Class B</span></div>
                            <div className="flex items-center gap-1 sm:gap-2"><div className="w-3 sm:w-4 h-3 sm:h-4 bg-yellow-500 rounded-full"></div><span className='text-secondary'>Input</span></div>
                            <div className="flex items-center gap-1 sm:gap-2"><div className="w-3 sm:w-4 h-3 sm:h-4 bg-green-500 rounded-full"></div><span className='text-secondary'>K-Neighbors</span></div>
                        </div>
                    </div>

                    <div className="btn-color p-4 sm:p-6 rounded-lg overflow-x-auto">
                        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-secondary">{algorithm_details}</h3>
                        {currentStep === 0 && <h1 className="text-secondary text-sm sm:text-base"><strong>{details_placeholder}</strong></h1>}
                        {currentStep >= 1 && (
                            <div className="mb-4 sm:mb-6 text-gray-700">
                                <h4 className="font-medium text-secondary mb-2">{distance_calc}</h4>
                                <div className="bg-white rounded p-2 sm:p-3 max-h-32 sm:max-h-40 overflow-y-auto text-xs sm:text-sm">
                                    <div className="font-mono">
                                        <div className="mb-2">{distance_formula}</div>
                                        <div className="mb-3 text-center bg-blue-50 p-2 rounded">√((x₁-x₂)² + (y₁-y₂)²)</div>
                                        {currentStep >= 2 && pointsWithDistances.map((point) => (
                                            <div key={point.id} className="mb-1">Point {point.id}: {point.distance.toFixed(2)}</div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        {currentStep >= 3 && (
                            <div className="mb-4 sm:mb-6">
                                <h4 className="font-medium text-secondary mb-2">{sorted_by_distance}</h4>
                                <div className="bg-white rounded p-2 sm:p-3 text-xs sm:text-sm">
                                    {pointsWithDistances.slice(0, 5).map((point, index) => (
                                        <div key={point.id} className={`flex justify-between py-1 ${index < selectedK ? 'font-bold text-green-600' : 'text-gray-600'}`}>
                                            <span>Point {point.id} (Class {point.target})</span>
                                            <span>{point.distance.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {currentStep >= 4 && (
                            <>
                                <div className="mb-4 sm:mb-6">
                                    <h4 className="font-medium text-secondary mb-2">K={selectedK} {nearest_neighbors}</h4>
                                    <div className="bg-white rounded p-2 sm:p-3 text-xs sm:text-sm">
                                        {kNeighbors.slice(0, selectedK).map(point => (
                                            <div key={point.id} className="flex justify-between py-1 text-green-600 font-medium">
                                                <span>Point {point.id} (Class {point.target})</span>
                                                <span>{point.distance.toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium text-secondary mb-2">{classification_results}</h4>
                                    <div className="bg-white rounded p-2 sm:p-3 text-xs sm:text-sm">
                                        <div className="mb-2 text-gray-700">
                                            <strong>{vote_count}</strong>
                                            {Object.entries(prediction).map(([cls, count]) => (
                                                <div key={cls} className="ml-4 ltr">{class_word} {cls}: {count} {vote_word}{count > 1 ? 's' : ''}</div>
                                            ))}
                                        </div>
                                        <div className="text-sm sm:text-lg font-bold text-green-600">{predicted_class} {finalPrediction}</div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="mt-6 sm:mt-8 btn-color p-4 sm:p-6 rounded-lg overflow-x-auto">
                    <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-secondary">{core_algorithm_steps}</h3>
                    <div className="bg-gray-900 text-green-400 p-3 sm:p-4 rounded font-mono text-xs sm:text-sm overflow-x-auto ltr">
                        <div className={`mb-2 ${locale == "ar" ? "rtl" : "ltr"}`}>{knn_algorithm}</div>
                        <div className={`${currentStep >= 1 ? 'text-yellow-300' : 'text-gray-600'}`}>1. distances = compute_distances(input_point, dataset)</div>
                        <div className={`${currentStep >= 2 ? 'text-yellow-300' : 'text-gray-600'}`}>2. distances.sort(key=lambda x: x["distance"])</div>
                        <div className={`${currentStep >= 3 ? 'text-yellow-300' : 'text-gray-600'}`}>3. k_neighbors = distances[:K]</div>
                        <div className={`${currentStep >= 4 ? 'text-yellow-300' : 'text-gray-600'}`}>4. prediction = majority_vote(k_neighbors)</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KNNHowItWorks;
