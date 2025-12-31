import { Dataset, ScanResult } from '../types';

// Mock storage
let datasets: Dataset[] = [];
let scanResults: Record<string, ScanResult> = {};

export const DatasetService = {
  // Simulate fetching all datasets
  getAll: async (): Promise<Dataset[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...datasets]), 500);
    });
  },

  // Simulate fetching a single dataset
  getById: async (id: string): Promise<Dataset | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(datasets.find(d => d.id === id)), 300);
    });
  },

  // Simulate creating a dataset
  create: async (dataset: Omit<Dataset, 'id' | 'createdAt' | 'updatedAt'>): Promise<Dataset> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newDataset: Dataset = {
          ...dataset,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        datasets.push(newDataset);
        resolve(newDataset);
      }, 500);
    });
  },

  // Simulate updating a dataset
  update: async (id: string, updates: Partial<Dataset>): Promise<Dataset | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = datasets.findIndex(d => d.id === id);
        if (index === -1) {
          resolve(null);
          return;
        }
        datasets[index] = { ...datasets[index], ...updates, updatedAt: new Date().toISOString() };
        resolve(datasets[index]);
      }, 500);
    });
  },

  // Simulate deleting a dataset
  delete: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const initialLength = datasets.length;
        datasets = datasets.filter(d => d.id !== id);
        resolve(datasets.length < initialLength);
      }, 500);
    });
  },

  // Simulate saving scan results
  saveScanResult: async (result: ScanResult): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        scanResults[result.datasetId] = result;
        resolve();
      }, 300);
    });
  },

  // Simulate getting scan results
  getScanResult: async (datasetId: string): Promise<ScanResult | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(scanResults[datasetId]);
      }, 300);
    });
  }
};
