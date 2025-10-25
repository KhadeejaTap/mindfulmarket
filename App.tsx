
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ProductInputForm from './components/ProductInputForm';
import ResultsDisplay from './components/ResultsDisplay';
import { AnalysisResult } from './types';
import { analyzeProduct } from './services/geminiService';
import { browserStorage } from './services/browserStorage';


const App: React.FC = () => {
  const [productDescription, setProductDescription] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!productDescription.trim()) return;
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      let result;
      
      try {
        // Try to get from browser storage first
        const existingAnswer = await browserStorage.getAnswer(productDescription);
        if (existingAnswer) {
          console.log("Found cached analysis");
          result = JSON.parse(existingAnswer);
        }
      } catch (dbError) {
        console.warn('Storage error:', dbError);
        // Continue to API call if storage fails
      }

      if (!result) {
        // Make API call if no cached result
        result = await analyzeProduct(productDescription);
        try {
          // Try to save to browser storage
          await browserStorage.saveQuery(
            productDescription, 
            JSON.stringify(result)
          );
        } catch (saveError) {
          console.warn('Failed to save to storage:', saveError);
        }
      }

      setAnalysisResult(result);
    } catch (err) {
      console.error('Error during analysis:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsLoading(false);
    }
  }, [productDescription]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductInputForm
          productDescription={productDescription}
          setProductDescription={setProductDescription}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
        />
        {error && (
            <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        )}

        {analysisResult && <ResultsDisplay result={analysisResult} />}
        
        {!isLoading && !analysisResult && !error && (
            <div className="mt-6 text-center text-gray-500 bg-white p-10 rounded-lg shadow-md">
                <h2 className="text-xl font-medium text-gray-700">Ready to Analyze</h2>
                <p className="mt-2">Enter a product above to see its environmental impact assessment.</p>
            </div>
        )}
      </main>
    </div>
  );
};

export default App;
