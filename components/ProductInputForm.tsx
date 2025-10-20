
import React from 'react';

interface ProductInputFormProps {
  productDescription: string;
  setProductDescription: (description: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

const ProductInputForm: React.FC<ProductInputFormProps> = ({
  productDescription,
  setProductDescription,
  onAnalyze,
  isLoading,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit}>
        <label htmlFor="product-description" className="block text-sm font-medium text-gray-700 mb-2">
          Enter a Product Name or Description
        </label>
        <textarea
          id="product-description"
          rows={4}
          className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 transition duration-150 ease-in-out"
          placeholder="e.g., 'A pair of blue denim jeans', 'Organic cotton t-shirt', 'Latest smartphone model'"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          disabled={isLoading}
        />
        <div className="mt-4">
          <button
            type="submit"
            disabled={isLoading || !productDescription.trim()}
            className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-150 ease-in-out"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
                'Analyze Impact'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductInputForm;
