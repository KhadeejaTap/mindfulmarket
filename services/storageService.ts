// services/storageService.ts

import { AnalysisResult } from '../types'; // Assuming AnalysisResult is defined in types.ts

export interface StoredAnalysis {
  userInput: string;
  analysisResult: AnalysisResult;
  timestamp: Date;
}

export interface StorageService {
  getSimilarAnalysis(query: string): Promise<StoredAnalysis | null>;
  saveAnalysis(userInput: string, result: AnalysisResult): Promise<void>;
}

class InMemoryStorageService implements StorageService {
  private store: StoredAnalysis[] = [];

  async getSimilarAnalysis(query: string): Promise<StoredAnalysis | null> {
    // For a simple first test, we'll do a case-insensitive exact match
    const found = this.store.find(item => this.areInputsSimilar(item.userInput, query));
    return found || null;
  }

  async saveAnalysis(userInput: string, result: AnalysisResult): Promise<void> {
    // Before saving, check if an exact match already exists to avoid duplicates
    const existing = this.store.find(item => this.areInputsSimilar(item.userInput, userInput));
    if (existing) {
      // Optionally update timestamp or result if needed, or just skip
      console.log(`Analysis for "${userInput}" already exists. Skipping save.`);
      return;
    }
    this.store.push({ userInput, analysisResult: result, timestamp: new Date() });
    console.log(`Saved analysis for: "${userInput}"`);
  }

  // This function defines what "similar" means for your cache
  private areInputsSimilar(storedInput: string, newQuery: string): boolean {
    // Simple case-insensitive and trimmed exact match
    return storedInput.toLowerCase().trim() === newQuery.toLowerCase().trim();
  }
}

// Export an instance of the in-memory storage service for use throughout your application.
export const storageService: StorageService = new InMemoryStorageService();

