import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { useLocale } from '@/app/lib/i18n_context';
import useTranslation from '@/app/lib/useTranslation';

const DecisionTreeVisualizer = ({ tree }) => {
    const [expandedNodes, setExpandedNodes] = useState(new Set(['root']));
    const locale = useLocale()
    const translation = useTranslation(locale)
    const tree_placeholder = translation.decision_tree_visualizer.tree_placeholder
    const prediction_word = translation.decision_tree_visualizer.prediction
    const feature_word = translation.decision_tree_visualizer.feature
    const expand_all = translation.decision_tree_visualizer.expand_all
    const collapse_all = translation.decision_tree_visualizer.collapse_all
    const feature_node = translation.decision_tree_visualizer.feature_node
    const condition_word = translation.decision_tree_visualizer.condition
    const positive_word = translation.decision_tree_visualizer.positive
    const negative_word = translation.decision_tree_visualizer.negative

    const toggleNode = (nodeId) => {
        const newExpanded = new Set(expandedNodes);
        if (newExpanded.has(nodeId)) {
            newExpanded.delete(nodeId);
        } else {
            newExpanded.add(nodeId);
        }
        setExpandedNodes(newExpanded);
    };

    const expandAll = () => {
        const allNodes = new Set();
        const traverse = (node, path = '') => {
            if (typeof node === 'object' && node !== null && node.children) {
                allNodes.add(path);
                Object.keys(node.children).forEach((key) => {
                    if (
                        typeof node.children[key] === 'object' &&
                        node.children[key] !== null &&
                        node.children[key].feature
                    ) {
                        traverse(node.children[key], `${path}-${key}`);
                    }
                });
            }
        };
        traverse(tree, 'root');
        setExpandedNodes(allNodes);
    };

    const collapseAll = () => {
        setExpandedNodes(new Set());
    };

    const isLeafNode = (value) =>
        typeof value === 'string' || (typeof value === 'object' && value !== null && !value.feature);

    const getNodeColor = (value) => {
        if (isLeafNode(value)) {
            const prediction = typeof value === 'string' ? value : value.prediction;
            if (['Yes', 'yes', 'Positive'].includes(prediction)) {
                return 'bg-green-100 border-green-300 text-green-700';
            } else if (['No', 'no', 'Negative'].includes(prediction)) {
                return 'bg-red-100 border-red-300 text-red-700';
            } else {
                return 'bg-blue-100 border-blue-300 text-blue-700';
            }
        }
        return 'bg-gray-50 border-gray-300 text-gray-700';
    };

    const renderNode = (node, path = 'root') => {
        if (!node) return <div className="text-red-500 text-xs">{tree_placeholder}</div>;

        if (isLeafNode(node)) {
            const prediction = typeof node === 'string' ? node : node.prediction;
            return (
                <div className="flex items-center space-x-1 mb-2 sm:space-x-1">
                    <div className="w-1 h-6 bg-gray-300 sm:h-8"></div>
                    <div className={`px-2 py-1 rounded-md border text-xs sm:px-3 sm:py-2 sm:border-2 font-medium ${getNodeColor(node)}`}>
                        <div className="font-medium text-sm">{prediction_word}</div>
                        <div className="font-bold">{prediction}</div>
                    </div>
                </div>
            );
        }

        const nodeId = path;
        const isExpanded = expandedNodes.has(nodeId);
        const hasChildren = node.children && Object.keys(node.children).length > 0;

        return (
            <div className="mb-3">
                <div className="flex items-center space-x-1 mb-2">
                    {hasChildren && (
                        <button
                            onClick={() => toggleNode(nodeId)}
                            className="p-0.5 hover:bg-gray-100 rounded text-gray-600"
                        >
                            {isExpanded ? (
                                <HugeiconsIcon icon={ArrowDown01Icon} size={16} />
                            ) : (
                                <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                            )}
                        </button>
                    )}
                    {!hasChildren && <div className="w-4" />}

                    <div className={`px-2 py-1 sm:px-4 sm:py-3 sm:border-2 rounded-md border ${getNodeColor(node)} shadow-sm`}>
                        <div className="text-[11px] sm:test-sm text-gray-600">{feature_word}</div>
                        <div className="font-bold text-sm sm:text-lg">{node.feature}</div>
                    </div>
                </div>

                {hasChildren && isExpanded && (
                    <div className="ml-4 border-l border-gray-200 pl-2">
                        {Object.entries(node.children).map(([condition, childNode]) => (
                            <div key={`${path}-${condition}`} className="mb-3">
                                <div className="flex items-center mb-1">
                                    <div className="px-2 sm:px-3 sm:py-1 py-0.5 bg-yellow-100 border border-yellow-300 rounded-full text-yellow-800 text-[11px] sm:text-sm font-medium">
                                        {condition}
                                    </div>
                                </div>
                                <div className="ml-3">{renderNode(childNode, `${path}-${condition}`)}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-3 sm:p-4 card-bg">
            <div className="mb-3 flex flex-wrap items-center gap-2">
                <button
                    onClick={expandAll}
                    className="px-2 py-1 text-xs sm:text-sm btn-color text-white rounded-md"
                >
                    {expand_all}
                </button>
                <button
                    onClick={collapseAll}
                    className="px-2 py-1 text-xs sm:text-sm bg-secondary text-white rounded-md"
                >
                    {collapse_all}
                </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4 p-2 sm:p-3 card-bg rounded">
                <div className="flex items-center gap-1 text-xs">
                    <div className="w-3 h-3 card-bg border border-gray-300 rounded"></div>
                    {feature_node}
                </div>
                <div className="flex items-center gap-1 text-xs">
                    <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded-full"></div>
                    {condition_word}
                </div>
                <div className="flex items-center gap-1 text-xs">
                    <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                    {positive_word}
                </div>
                <div className="flex items-center gap-1 text-xs">
                    <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                    {negative_word}
                </div>
            </div>

            <div className="card-bg border border-gray-200 rounded-md p-3 overflow-x-auto">
                {renderNode(tree)}
            </div>
        </div>
    );
};

export default DecisionTreeVisualizer;
