import { useLocale } from '@/app/lib/i18n_context';
import useTranslation from '@/app/lib/useTranslation';
import React, { useEffect } from 'react';

export default function NaiveBayesVisualizer({ result }) {
    const classes = result?.probs ? Object.keys(result.probs) : [];
    const probabilities = result?.probs ? Object.values(result.probs) : [];

    const maxProbIndex = probabilities.indexOf(Math.max(...probabilities));

    const locale = useLocale()
    const translation = useTranslation(locale)
    const no_data = translation.naive_bayes_visualizer.no_data
    const results_visualization = translation.naive_bayes_visualizer.results_visualization
    const predicted_class = translation.naive_bayes_visualizer.predicted_class
    const probability_distribution = translation.naive_bayes_visualizer.probability_distribution
    const summary_word = translation.naive_bayes_visualizer.summary
    const total_classes = translation.naive_bayes_visualizer.total_classes
    const confidence_word = translation.naive_bayes_visualizer.no_data

    useEffect(() => {
        console.log("result from NaiveBayesVisualizer:", result)
    }, [])
    const colors = [
        '#84CC16',  // lime
        '#EF4444', // red
        '#8B5CF6', // purple
        '#10B981', // green
        '#F59E0B', // amber
        '#EC4899', // pink
        '#06B6D4', // cyan
        '#3B82F6', // blue
    ];

    if (!result?.probs || classes.length === 0) {
        console.log("result.probs:", result.probs)
        console.log("classes.length:", classes.length)

        return (
            <div className="p-6 bg-gray-50 rounded-lg">
                <p className="text-gray-600">{no_data}</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg mt-12 btn-color">
            <h2 className="text-2xl font-bold text-secondary mb-6">{results_visualization}</h2>

            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">{predicted_class}</h3>
                <p className="text-2xl font-bold text-blue-600">
                    {classes[maxProbIndex]} ({(probabilities[maxProbIndex] * 100).toFixed(1)}%)
                </p>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-secondary mb-4">{probability_distribution}</h3>

                {classes.map((className, index) => {
                    const probability = probabilities[index];
                    const percentage = (probability * 100).toFixed(1);
                    const barWidth = probability * 100;
                    const isMax = index === maxProbIndex;

                    return (
                        <div key={className} className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className={`font-medium text-secondary`}>
                                    {className}
                                </span>
                                <span className={`text-sm font-semibold text-secondary`}>
                                    {percentage}%
                                </span>
                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2 ${isMax ? 'bg-blue-500' : 'bg-gray-400'
                                        }`}
                                    style={{
                                        width: `${barWidth}%`,
                                        backgroundColor: colors[index % colors.length],
                                        opacity: isMax ? 1 : 0.7
                                    }}
                                >
                                    {barWidth > 20 && (
                                        <span className="text-secondary text-sm font-medium">
                                            {percentage}%
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Summary Stats */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">{summary_word}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                        <span className="font-medium">{total_classes}</span> {classes.length}
                    </div>
                    <div>
                        <span className="font-medium">{confidence_word}</span> {(Math.max(...probabilities) * 100).toFixed(1)}%
                    </div>
                </div>
            </div>
        </div>
    );
};
