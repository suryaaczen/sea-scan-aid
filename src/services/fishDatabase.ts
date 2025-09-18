import { FishIdentification } from '@/components/FishResults';

// Local storage service for offline functionality
class FishDatabase {
  private readonly STORAGE_KEY = 'aquaid_fish_records';

  // Save fish identification results
  async saveResults(results: FishIdentification[]): Promise<void> {
    try {
      const existingData = this.getAllResults();
      const newData = [...existingData, ...results];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newData));
      console.log('Results saved successfully');
    } catch (error) {
      console.error('Error saving results:', error);
      throw new Error('Failed to save results');
    }
  }

  // Get all saved results
  getAllResults(): FishIdentification[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return [];
      
      return JSON.parse(data).map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }));
    } catch (error) {
      console.error('Error loading results:', error);
      return [];
    }
  }

  // Get results by date range
  getResultsByDateRange(startDate: Date, endDate: Date): FishIdentification[] {
    const allResults = this.getAllResults();
    return allResults.filter(result => 
      result.timestamp >= startDate && result.timestamp <= endDate
    );
  }

  // Get results by species
  getResultsBySpecies(species: string): FishIdentification[] {
    const allResults = this.getAllResults();
    return allResults.filter(result => 
      result.species.toLowerCase().includes(species.toLowerCase())
    );
  }

  // Delete a result by ID
  async deleteResult(id: string): Promise<void> {
    try {
      const allResults = this.getAllResults();
      const filteredResults = allResults.filter(result => result.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredResults));
    } catch (error) {
      console.error('Error deleting result:', error);
      throw new Error('Failed to delete result');
    }
  }

  // Clear all results
  async clearAllResults(): Promise<void> {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing results:', error);
      throw new Error('Failed to clear results');
    }
  }

  // Get statistics
  getStatistics() {
    const results = this.getAllResults();
    
    if (results.length === 0) {
      return {
        totalCaptures: 0,
        totalFish: 0,
        totalWeight: 0,
        speciesCount: 0,
        avgHealthScore: 0
      };
    }

    const totalFish = results.reduce((sum, r) => sum + r.count, 0);
    const totalWeight = results.reduce((sum, r) => sum + r.estimatedWeight, 0);
    const avgHealthScore = results.reduce((sum, r) => sum + r.healthScore, 0) / results.length;
    const uniqueSpecies = new Set(results.map(r => r.species));

    return {
      totalCaptures: results.length,
      totalFish,
      totalWeight,
      speciesCount: uniqueSpecies.size,
      avgHealthScore
    };
  }
}

export const fishDatabase = new FishDatabase();