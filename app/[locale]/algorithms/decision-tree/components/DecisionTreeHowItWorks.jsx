import React, { useState, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Leaf01Icon, Tree07Icon, PlayIcon, Rotate01Icon, Calculator01Icon, ChartLineData02Icon, ArrowDown01Icon, ArrowUp01Icon, StructureCheckIcon } from '@hugeicons/core-free-icons';
import { useLocale } from '@/app/lib/i18n_context';
import useTranslation from '@/app/lib/useTranslation';

const DecisionTreeHowItWorks = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedNode, setSelectedNode] = useState(null);
    const locale = useLocale()
    const translation = useTranslation(locale)
    const steps = translation.dt_how_it_works.steps
    const title = translation.dt_how_it_works.title
    const collapse_word = translation.dt_how_it_works.collapse
    const expand_word = translation.dt_how_it_works.expand
    const playing_word = translation.dt_how_it_works.playing
    const play_demo = translation.dt_how_it_works.play_demo
    const reset_word = translation.dt_how_it_works.reset
    const dataset_and_calcs = translation.dt_how_it_works.dataset_and_calcs
    const sample_data = translation.dt_how_it_works.sample_data
    const target_entropy = translation.dt_how_it_works.target_entropy
    const entropy_formula = translation.dt_how_it_works.entropy_formula
    const IG = translation.dt_how_it_works.IG
    const dt_structure = translation.dt_how_it_works.dt_structure
    const tree_structure_placeholder = translation.dt_how_it_works.tree_structure_placeholder
    const dt_process = translation.dt_how_it_works.dt_process
    const algorithm_steps = translation.dt_how_it_works.algorithm_steps
    const entropy = translation.dt_how_it_works.entropy
    const information_gain = translation.dt_how_it_works.information_gain
    const recursive_building = translation.dt_how_it_works.recursive_building


    


    const sampleData = [
        { id: 1, outlook: 'Sunny', temperature: 'Hot', humidity: 'High', windy: 'False', play: 'No' },
        { id: 2, outlook: 'Sunny', temperature: 'Hot', humidity: 'High', windy: 'True', play: 'No' },
        { id: 3, outlook: 'Overcast', temperature: 'Hot', humidity: 'High', windy: 'False', play: 'Yes' },
        { id: 4, outlook: 'Rainy', temperature: 'Mild', humidity: 'High', windy: 'False', play: 'Yes' },
        { id: 5, outlook: 'Rainy', temperature: 'Cool', humidity: 'Normal', windy: 'False', play: 'Yes' },
        { id: 6, outlook: 'Rainy', temperature: 'Cool', humidity: 'Normal', windy: 'True', play: 'No' },
        { id: 7, outlook: 'Overcast', temperature: 'Cool', humidity: 'Normal', windy: 'True', play: 'Yes' },
        { id: 8, outlook: 'Sunny', temperature: 'Mild', humidity: 'High', windy: 'False', play: 'No' },
        { id: 9, outlook: 'Sunny', temperature: 'Cool', humidity: 'Normal', windy: 'False', play: 'Yes' },
        { id: 10, outlook: 'Rainy', temperature: 'Mild', humidity: 'Normal', windy: 'False', play: 'Yes' }
    ];

    const icons = {
        "step1": <HugeiconsIcon icon={Calculator01Icon} className="w-5 h-5" />,
        "step2": <HugeiconsIcon icon={ChartLineData02Icon} className="w-5 h-5" />,
        "step3": <HugeiconsIcon icon={Tree07Icon} className="w-5 h-5" />,
        "step4": <HugeiconsIcon icon={StructureCheckIcon} className="w-5 h-5" />,
        "step5": <HugeiconsIcon icon={Leaf01Icon} className="w-5 h-5" />,
    }

    const calculateEntropy = (data, attribute) => {
        const counts = {};
        data.forEach(item => {
            counts[item[attribute]] = (counts[item[attribute]] || 0) + 1;
        });

        const total = data.length;
        let entropy = 0;

        Object.values(counts).forEach(count => {
            const probability = count / total;
            if (probability > 0) {
                entropy -= probability * Math.log2(probability);
            }
        });

        return entropy;
    };

    const calculateInformationGain = (data, feature, target) => {
        const totalEntropy = calculateEntropy(data, target);
        const values = [...new Set(data.map(item => item[feature]))];

        let weightedEntropy = 0;
        values.forEach(value => {
            const subset = data.filter(item => item[feature] === value);
            const weight = subset.length / data.length;
            const subsetEntropy = calculateEntropy(subset, target);
            weightedEntropy += weight * subsetEntropy;
        });

        return totalEntropy - weightedEntropy;
    };

    const getInformationGains = (data) => {
        const features = ['outlook', 'temperature', 'humidity', 'windy'];
        const gains = {};

        features.forEach(feature => {
            gains[feature] = calculateInformationGain(data, feature, 'play');
        });

        return gains;
    };

    const buildTreeStructure = () => {
        const gains = getInformationGains(sampleData);
        const rootFeature = Object.keys(gains).reduce((a, b) => gains[a] > gains[b] ? a : b);

        const tree = {
            feature: rootFeature,
            entropy: calculateEntropy(sampleData, 'play'),
            samples: sampleData.length,
            children: {}
        };

        const rootValues = [...new Set(sampleData.map(item => item[rootFeature]))];

        rootValues.forEach(value => {
            const subset = sampleData.filter(item => item[rootFeature] === value);
            const subsetEntropy = calculateEntropy(subset, 'play');

            if (subsetEntropy === 0) {
                // Pure subset - leaf node
                tree.children[value] = {
                    isLeaf: true,
                    prediction: subset[0].play,
                    entropy: 0,
                    samples: subset.length
                };
            } else {
                // Need further splitting - simplified for demo
                const remainingFeatures = ['temperature', 'humidity', 'windy'].filter(f => f !== rootFeature);
                const subGains = {};
                remainingFeatures.forEach(feature => {
                    subGains[feature] = calculateInformationGain(subset, feature, 'play');
                });

                const bestSubFeature = Object.keys(subGains).reduce((a, b) =>
                    subGains[a] > subGains[b] ? a : b
                );

                tree.children[value] = {
                    feature: bestSubFeature,
                    entropy: subsetEntropy,
                    samples: subset.length,
                    isLeaf: false,
                    children: {}
                };
            }
        });

        return tree;
    };

    const treeStructure = buildTreeStructure();
    const informationGains = getInformationGains(sampleData);
    const targetEntropy = calculateEntropy(sampleData, 'play');

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
            }, 2500);
        }
        return () => clearInterval(interval);
    }, [isPlaying, steps.length]);

    const resetDemo = () => {
        setCurrentStep(0);
        setIsPlaying(false);
        setSelectedNode(null);
    };

    const startDemo = () => {
        setIsPlaying(true);
    };

    const TreeNode = ({ node, level = 0, parentValue = '', path = [] }) => {
        const nodeId = path.join('-') || 'root';
        const isSelected = selectedNode === nodeId;

        return (
            <div className="flex flex-col items-center">
                <div
                    className={`p-2 sm:p-3 rounded-lg border-2 cursor-pointer transition-all mb-1 sm:mb-2 ${isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : node.isLeaf
                            ? 'border-green-400 bg-green-50'
                            : 'border-gray-400 bg-white'
                        } ${level > 0 ? 'mt-2 sm:mt-4' : ''}`}
                    onClick={() => setSelectedNode(nodeId)}
                >
                    {parentValue && (
                        <div className="text-xs text-gray-600 mb-1">{parentValue}</div>
                    )}

                    {node.isLeaf ? (
                        <div className="text-center">
                            <HugeiconsIcon icon={Leaf01Icon} className="w-4 h-4 sm:w-6 sm:h-6 text-green-600 mx-auto mb-1" />
                            <div className="font-bold text-green-700 text-sm sm:text-base">{node.prediction}</div>
                            <div className="text-xs text-gray-600">
                                Samples: {node.samples}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <HugeiconsIcon icon={Tree07Icon} className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600 mx-auto mb-1" />
                            <div className="font-bold text-blue-700 text-sm sm:text-base">{node.feature}</div>
                            <div className="text-xs text-gray-600">
                                Entropy: {node.entropy.toFixed(3)}
                            </div>
                            <div className="text-xs text-gray-600">
                                Samples: {node.samples}
                            </div>
                        </div>
                    )}
                </div>

                {!node.isLeaf && node.children && Object.keys(node.children).length > 0 && (
                    <div className="flex justify-center space-x-2 sm:space-x-4 md:space-x-8">
                        {Object.entries(node.children).map(([value, childNode]) => (
                            <div key={value} className="flex flex-col items-center">
                                <div className="w-px h-4 sm:h-6 bg-gray-400"></div>
                                <TreeNode
                                    node={childNode}
                                    level={level + 1}
                                    parentValue={value}
                                    path={[...path, value]}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
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
                            <HugeiconsIcon icon={Tree07Icon} size={20} className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary text-center sm:text-left">
                                {title}
                            </h1>
                        </div>
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
                        <HugeiconsIcon icon={PlayIcon} className="w-3 h-3 sm:w-4 sm:h-4" />
                        {isPlaying ? playing_word : play_demo}
                    </button>

                    <button
                        onClick={resetDemo}
                        className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 cursor-pointer"
                    >
                        <HugeiconsIcon icon={Rotate01Icon} className="w-3 h-3 sm:w-4 sm:h-4" />
                        {reset_word}
                    </button>
                </div>

                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-wrap justify-between gap-2 sm:gap-4 mb-4">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className={`flex items-center flex-wrap max-sm:p-3 gap-1 p-2 rounded-lg transition-all text-gray-500 ${index <= currentStep
                                    ? 'light-btn-bg secondary-text'
                                    : 'bg-gray-100 text-black'
                                    }`}
                            >
                                <div className={`p-1 rounded-full ${index <= currentStep ? 'btn-color text-white' : 'bg-gray-300'
                                    }`}>
                                    {icons[step.id]}
                                </div>
                                <div className="text-xs hidden sm:block">
                                    {step.title}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center p-3 sm:p-4 btn-color rounded-lg">
                        <p className="text-sm sm:text-lg text-white font-bold">
                            {steps[currentStep]?.description}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:gap-8">
                    <div className="btn-color p-4 sm:p-6 rounded-lg">
                        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-secondary">{dataset_and_calcs}</h3>

                        <div className="mb-4 sm:mb-6">
                            <h4 className="font-medium text-secondary mb-2 text-sm sm:text-base">{sample_data}</h4>
                            <div className="bg-white rounded p-2 sm:p-3 max-h-32 sm:max-h-48 overflow-auto">
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr className="border-b text-gray-700">
                                            <th className="text-left p-1">Outlook</th>
                                            <th className="text-left p-1">Temp</th>
                                            <th className="text-left p-1">Humidity</th>
                                            <th className="text-left p-1">Windy</th>
                                            <th className="text-left p-1 font-bold text-red-600">Play</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sampleData.map(row => (
                                            <tr key={row.id} className="border-b text-xs text-gray-700">
                                                <td className="p-1">{row.outlook}</td>
                                                <td className="p-1">{row.temperature}</td>
                                                <td className="p-1">{row.humidity}</td>
                                                <td className="p-1">{row.windy}</td>
                                                <td className="p-1 font-bold">{row.play}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {currentStep >= 0 && (
                            <div className="mb-4 sm:mb-6">
                                <h4 className="font-medium text-secondary mb-2 text-sm sm:text-base">{target_entropy}</h4>
                                <div className="bg-white rounded p-2 sm:p-3 text-gray-700">
                                    <div className="text-xs sm:text-sm font-mono">
                                        <div className="mb-1 sm:mb-2">{entropy_formula}</div>
                                        <div className="mb-2 sm:mb-3 text-center bg-blue-50 p-1 sm:p-2 rounded text-xs">
                                            H(S) = -Sum p(i) * log2(p(i))
                                        </div>
                                        <div className="mb-1 sm:mb-2">
                                            Yes: 6 samples, No: 4 samples
                                        </div>
                                        <div className="mb-1 sm:mb-2">
                                            H(Play) = -((6/10)*log2(6/10) + (4/10)*log2(4/10))
                                        </div>
                                        <div className="font-bold text-blue-600">
                                            H(Play) = {targetEntropy.toFixed(3)} bits
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep >= 1 && (
                            <div className="mb-4 sm:mb-6">
                                <h4 className="font-medium text-secondary mb-2 text-sm sm:text-base">{IG}</h4>
                                <div className="bg-white rounded p-2 sm:p-3">
                                    <div className="text-xs sm:text-sm">
                                        <div className="mb-2 text-gray-600">IG(S, A) = H(S) - Sum |Sv|/|S| * H(Sv)</div>
                                        {Object.entries(informationGains)
                                            .sort(([, a], [, b]) => b - a)
                                            .map(([feature, gain]) => (
                                                <div key={feature} className={`flex justify-between py-1 ${currentStep >= 2 && feature === 'outlook' ? 'font-bold text-green-600' : 'text-gray-600'
                                                    }`}>
                                                    <span className="capitalize">{feature}:</span>
                                                    <span>{gain.toFixed(3)}</span>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tree Visualization */}
                    <div className="btn-color p-4 sm:p-6 rounded-lg">
                        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-secondary">{dt_structure}</h3>

                        {currentStep >= 2 && (
                            <div className="bg-white rounded p-3 sm:p-4 overflow-auto" style={{ minHeight: '300px' }}>
                                <TreeNode node={treeStructure} />
                            </div>
                        )}

                        {currentStep < 2 && (
                            <div className="bg-white rounded p-3 sm:p-4 flex items-center justify-center h-48 sm:h-64 text-gray-500">
                                <div className="text-center">
                                    <HugeiconsIcon icon={Tree07Icon} className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm sm:text-base">{tree_structure_placeholder}</p>
                                </div>
                            </div>
                        )}

                        {selectedNode && currentStep >= 2 && (
                            <div className="mt-3 sm:mt-4 bg-blue-50 rounded p-2 sm:p-3">
                                <h4 className="font-medium text-blue-700 mb-2 text-sm sm:text-base">Node Details</h4>
                                <div className="text-xs sm:text-sm">
                                    <p><strong>Selected:</strong> {selectedNode}</p>
                                    <p className="text-gray-600">{click_for_details}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 sm:mt-8 btn-color p-4 sm:p-6 rounded-lg">
                    <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-secondary">{dt_process}</h3>
                    <div className="bg-gray-900 text-green-400 p-3 sm:p-4 rounded font-mono text-xs sm:text-sm overflow-x-auto">
                        <div className="mb-2">{algorithm_steps}</div>
                        <div className={`${currentStep >= 0 ? 'text-yellow-300' : 'text-gray-600'}`}>
                            1. target_entropy = entropy(target_column)
                        </div>
                        <div className={`${currentStep >= 1 ? 'text-yellow-300' : 'text-gray-600'}`}>
                            2. information_gains = calculate_IG_for_all_features()
                        </div>
                        <div className={`${currentStep >= 2 ? 'text-yellow-300' : 'text-gray-600'}`}>
                            3. best_feature = max(information_gains, key=information_gains.get)
                        </div>
                        <div className={`${currentStep >= 3 ? 'text-yellow-300' : 'text-gray-600'}`}>
                            4. split_dataset_by_feature_values(best_feature)
                        </div>
                        <div className={`${currentStep >= 4 ? 'text-yellow-300' : 'text-gray-600'}`}>
                            5. for each subset: recursively_build_tree(subset)
                        </div>
                    </div>
                </div>

                {/* Key Concepts */}
                <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                        <h4 className="font-bold text-blue-700 mb-2 text-sm sm:text-base">{entropy.title}</h4>
                        <p className="text-xs sm:text-sm text-blue-600">
                            {entropy.definition}
                        </p>
                    </div>
                    <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                        <h4 className="font-bold text-green-700 mb-2 text-sm sm:text-base">{information_gain.title}</h4>
                        <p className="text-xs sm:text-sm text-green-600">
                            {information_gain.definition}
                        </p>
                    </div>
                    <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
                        <h4 className="font-bold text-purple-700 mb-2 text-sm sm:text-base">{recursive_building.title}</h4>
                        <p className="text-xs sm:text-sm text-purple-600">
                            {recursive_building.definition}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DecisionTreeHowItWorks;