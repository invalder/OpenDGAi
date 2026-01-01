import { DatasetService } from './datasetService';
import { Dataset } from '../types';
import {
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

// Mock Firebase functions
jest.mock('firebase/firestore', () => ({
    collection: jest.fn(),
    doc: jest.fn(),
    getDocs: jest.fn(),
    getDoc: jest.fn(),
    addDoc: jest.fn(),
    updateDoc: jest.fn(),
    deleteDoc: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    Timestamp: {
        now: jest.fn(() => ({ toDate: () => new Date('2025-01-01T00:00:00.000Z') }))
    }
}));

jest.mock('firebase/functions', () => ({
    httpsCallable: jest.fn()
}));

jest.mock('../config/firebase', () => ({
    db: {},
    functions: {}
}));

const mockDataset: Omit<Dataset, 'id' | 'createdAt' | 'updatedAt'> = {
  title: 'Test Dataset',
  description: 'A test dataset',
  owner: 'Test Owner',
  format: 'csv',
  // license: 'MIT', // not in type def
  // updateFrequency: 'daily', // not in type def
  // tags: ['test'], // not in type def
  visibility: 'public',
  pdpaStatus: 'pending',
  metadata: {
      // title: 'Test Dataset', // not in type def
      // description: 'A test dataset', // not in type def
      keywords: ['test'],
      publisher: 'Test Owner',
      issued: '2025-01-01',
      modified: '2025-01-01',
      // distribution: [], // not in type def
      license: 'MIT',
      // theme: 'Test' // not in type def
  }
};

describe('DatasetService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a dataset', async () => {
    (addDoc as jest.Mock).mockResolvedValue({ id: 'new-id' });

    const created = await DatasetService.create(mockDataset);

    expect(addDoc).toHaveBeenCalled();
    expect(created.id).toBe('new-id');
    expect(created.title).toBe(mockDataset.title);
  });

  it('should retrieve all datasets', async () => {
    const mockData = {
        ...mockDataset,
        createdAt: { toDate: () => new Date() },
        updatedAt: { toDate: () => new Date() }
    };
    (getDocs as jest.Mock).mockResolvedValue({
      docs: [
        {
            id: '1',
            data: () => mockData
        }
      ]
    });

    const all = await DatasetService.getAll();
    expect(getDocs).toHaveBeenCalled();
    expect(all.length).toBe(1);
    expect(all[0].id).toBe('1');
  });

  it('should retrieve a dataset by ID', async () => {
    const mockData = {
        ...mockDataset,
        createdAt: { toDate: () => new Date() },
        updatedAt: { toDate: () => new Date() }
    };
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      id: '1',
      data: () => mockData
    });

    const found = await DatasetService.getById('1');
    expect(getDoc).toHaveBeenCalled();
    expect(found).toBeDefined();
    expect(found?.id).toBe('1');
  });

  it('should return undefined if dataset not found', async () => {
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => false
    });

    const found = await DatasetService.getById('999');
    expect(found).toBeUndefined();
  });

  it('should update a dataset', async () => {
    const mockData = {
        ...mockDataset,
        title: 'Updated Title',
        createdAt: { toDate: () => new Date() },
        updatedAt: { toDate: () => new Date() }
    };

    // First call (update)
    (updateDoc as jest.Mock).mockResolvedValue(undefined);
    // Second call (getById inside update)
    (getDoc as jest.Mock).mockResolvedValue({
        exists: () => true,
        id: '1',
        data: () => mockData
    });

    const updated = await DatasetService.update('1', { title: 'Updated Title' });
    expect(updateDoc).toHaveBeenCalled();
    expect(updated?.title).toBe('Updated Title');
  });

  it('should delete a dataset', async () => {
    (deleteDoc as jest.Mock).mockResolvedValue(undefined);

    const success = await DatasetService.delete('1');
    expect(deleteDoc).toHaveBeenCalled();
    expect(success).toBe(true);
  });

  it('should trigger cloud function scan', async () => {
      const mockScanFn = jest.fn().mockResolvedValue({
          data: { riskScore: 10, findings: [] }
      });
      (httpsCallable as jest.Mock).mockReturnValue(mockScanFn);

      const result = await DatasetService.scanDataset('1', []);
      expect(httpsCallable).toHaveBeenCalled();
      expect(mockScanFn).toHaveBeenCalledWith({ datasetId: '1', data: [] });
      expect(result.riskScore).toBe(10);
  });
});
