import { searchDatasets, mapCKANToDataset, CKANDataset } from './ckanService';

const fetchMock = jest.fn();
window.fetch = fetchMock;

describe('ckanService', () => {
  const mockCKANUrl = 'https://data.go.th';

  beforeEach(() => {
    fetchMock.mockClear();
  });

  describe('searchDatasets', () => {
    it('should return a list of datasets', async () => {
      const mockResponse = {
        success: true,
        result: {
          results: [
            { id: '1', title: 'Test Dataset' }
          ]
        }
      };

      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      const results = await searchDatasets('health', mockCKANUrl);
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Test Dataset');
      expect(fetchMock).toHaveBeenCalledWith(`${mockCKANUrl}/api/3/action/package_search?q=health`);
    });

    it('should throw an error if API call fails', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        statusText: 'Not Found'
      });

      await expect(searchDatasets('health', mockCKANUrl)).rejects.toThrow('CKAN API Error: Not Found');
    });
  });

  describe('mapCKANToDataset', () => {
    it('should correctly map CKAN fields to Dataset fields', () => {
      const mockCKANDataset: CKANDataset = {
        id: 'ckan-123',
        title: 'Thai Population',
        notes: 'Population data',
        url: 'http://example.com',
        organization: { title: 'Nso' },
        metadata_created: '2023-01-01',
        metadata_modified: '2023-02-01',
        license_title: 'Open Data',
        tags: [{ name: 'stats' }],
        resources: [
          { id: 'res-1', format: 'CSV', url: 'http://example.com/data.csv', name: 'data.csv' }
        ]
      };

      const result = mapCKANToDataset(mockCKANDataset, mockCKANUrl);

      expect(result.ckanId).toBe('ckan-123');
      expect(result.title).toBe('Thai Population');
      expect(result.metadata?.publisher).toBe('Nso');
      expect(result.format).toBe('csv');
      expect(result.fileUrl).toBe('http://example.com/data.csv');
    });
  });
});
