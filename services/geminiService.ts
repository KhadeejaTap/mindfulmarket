
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    overallScore: {
      type: Type.STRING,
      description: "A single letter grade from A+ to F representing the overall environmental impact. A+ is best, F is worst.",
    },
    summary: {
      type: Type.STRING,
      description: "A concise, two-sentence summary of the product's environmental impact.",
    },
    breakdown: {
      type: Type.ARRAY,
      description: "A breakdown of different environmental impact factors.",
      items: {
        type: Type.OBJECT,
        properties: {
          metric: {
            type: Type.STRING,
            description: "The name of the impact metric (e.g., 'Carbon Footprint', 'Water Usage', 'Material Sourcing', 'Waste Generation').",
          },
          score: {
            type: Type.INTEGER,
            description: "A score from 0 to 100 for this metric, where 100 is the best (lowest impact) and 0 is the worst (highest impact).",
          },
          explanation: {
            type: Type.STRING,
            description: "A brief, one-sentence explanation of the score and the factors that influenced it.",
          },
        },
        required: ["metric", "score", "explanation"],
      },
    },
    recommendations: {
        type: Type.ARRAY,
        description: "A list of 2-3 actionable recommendations for more sustainable alternatives or practices.",
        items: {
            type: Type.STRING
        }
    }
  },
  required: ["overallScore", "summary", "breakdown", "recommendations"],
};

export const analyzeProduct = async (productDescription: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the environmental impact of the following product. Provide a detailed assessment based on typical manufacturing processes, materials, and supply chains associated with such a product.

      Product Description: "${productDescription}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);

    // Basic validation
    if (!result.overallScore || !result.summary || !result.breakdown || !result.recommendations) {
        throw new Error("Invalid response structure from API");
    }
    
    return result as AnalysisResult;

  } catch (error) {
    console.error("Error analyzing product with Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to analyze product: ${error.message}`);
    }
    throw new Error("An unknown error occurred during product analysis.");
  }
};
