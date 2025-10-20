
import React from 'react';
import { AnalysisResult, ImpactMetric } from '../types';
import ImpactChart from './ImpactChart';

interface ResultsDisplayProps {
  result: AnalysisResult;
}

const getScoreColor = (score: number): string => {
  if (score >= 75) return 'text-emerald-600 bg-emerald-100';
  if (score >= 40) return 'text-yellow-600 bg-yellow-100';
  return 'text-red-600 bg-red-100';
};

const getGradeColor = (grade: string): string => {
    const upperCaseGrade = grade.toUpperCase();
    if (upperCaseGrade.startsWith('A')) return 'text-emerald-600 bg-emerald-100';
    if (upperCaseGrade.startsWith('B')) return 'text-green-600 bg-green-100';
    if (upperCaseGrade.startsWith('C')) return 'text-yellow-600 bg-yellow-100';
    if (upperCaseGrade.startsWith('D')) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
}

const ScoreCard: React.FC<{ metric: ImpactMetric }> = ({ metric }) => (
    <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
            <h4 className="text-md font-semibold text-gray-800">{metric.metric}</h4>
            <span className={`px-3 py-1 text-sm font-bold rounded-full ${getScoreColor(metric.score)}`}>{metric.score}/100</span>
        </div>
        <p className="text-sm text-gray-600 mt-2">{metric.explanation}</p>
    </div>
);

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 flex flex-col items-center justify-center bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-600">Overall Score</h3>
                <p className={`text-7xl font-bold my-2 ${getGradeColor(result.overallScore).split(' ')[0]}`}>{result.overallScore}</p>
                <p className="text-center text-sm text-gray-500">An assessment of the product's total environmental footprint.</p>
            </div>
            <div className="md:col-span-2">
                <h3 className="text-xl font-semibold text-gray-800">Summary</h3>
                <p className="text-gray-600 mt-2">{result.summary}</p>
            </div>
        </div>

        <hr className="my-6" />

        <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Impact Breakdown</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {result.breakdown.map((metric, index) => (
                    <ScoreCard key={index} metric={metric} />
                ))}
            </div>
        </div>

        <hr className="my-6" />

        <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Visual Analysis</h3>
            <div className="h-80 bg-gray-50 p-4 rounded-lg">
                <ImpactChart data={result.breakdown} />
            </div>
        </div>

         <hr className="my-6" />

        <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Sustainable Alternatives</h3>
            <ul className="space-y-3">
                {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-600">{rec}</span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
  );
};

export default ResultsDisplay;
