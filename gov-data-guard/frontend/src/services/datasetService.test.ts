import { DatasetService } from './datasetService';
import { Dataset } from '../types';

describe('DatasetService', () => {
  const mockDataset: Omit<Dataset, 'id' | 'createdAt' | 'updatedAt'> = {
    title: 'Test Dataset',
    description: 'A test dataset',
    owner: 'Test Agency',
    visibility: 'public',
    pdpaStatus: 'pending',
    format: 'csv'
  };

  it('should create a dataset', async () => {
    const created = await DatasetService.create(mockDataset);
    expect(created.id).toBeDefined();
    expect(created.title).toBe(mockDataset.title);
    expect(created.createdAt).toBeDefined();
  });

  it('should retrieve all datasets', async () => {
    await DatasetService.create(mockDataset);
    const all = await DatasetService.getAll();
    expect(all.length).toBeGreaterThan(0);
  });

  it('should retrieve a dataset by ID', async () => {
    const created = await DatasetService.create(mockDataset);
    const found = await DatasetService.getById(created.id);
    expect(found).toEqual(created);
  });

  it('should update a dataset', async () => {
    const created = await DatasetService.create(mockDataset);
    const updated = await DatasetService.update(created.id, { title: 'Updated Title' });
    expect(updated?.title).toBe('Updated Title');
    expect(updated?.updatedAt).not.toBe(created.updatedAt);
  });

  it('should delete a dataset', async () => {
    const created = await DatasetService.create(mockDataset);
    const success = await DatasetService.delete(created.id);
    expect(success).toBe(true);
    const found = await DatasetService.getById(created.id);
    expect(found).toBeUndefined();
  });

  it('should save and retrieve scan results', async () => {
    const created = await DatasetService.create(mockDataset);
    const scanResult = {
      datasetId: created.id,
      riskScore: 50,
      findings: [{ type: 'Email', count: 5 }],
      scannedAt: new Date().toISOString()
    };

    await DatasetService.saveScanResult(scanResult);
    const retrieved = await DatasetService.getScanResult(created.id);
    expect(retrieved).toEqual(scanResult);
  });
});
