import { syncCKANHandler } from '../src/services/ckanSync';
import axios from 'axios';
import * as admin from 'firebase-admin';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  firestore: Object.assign(jest.fn(), {
    FieldValue: {
      serverTimestamp: jest.fn(),
    },
  }),
}));

describe('syncCKANHandler', () => {
  let batchMock: any;
  let collectionMock: any;
  let queryMock: any;
  let docMock: any;

  beforeEach(() => {
    jest.clearAllMocks();

    batchMock = {
      update: jest.fn(),
      set: jest.fn(),
      commit: jest.fn().mockResolvedValue(true),
    };

    docMock = {
        update: jest.fn(),
        set: jest.fn(),
    };

    queryMock = {
      limit: jest.fn().mockReturnThis(),
      get: jest.fn().mockResolvedValue({ empty: true, docs: [] }), // Default empty
    };

    collectionMock = {
      where: jest.fn(() => queryMock),
      doc: jest.fn(() => docMock), // For new dataset creation
    };

    const firestoreMock = {
      batch: jest.fn(() => batchMock),
      collection: jest.fn(() => collectionMock),
    };

    (admin.firestore as unknown as jest.Mock).mockReturnValue(firestoreMock);
  });

  it('should sync new datasets correctly', async () => {
    const ckanResponse = {
      data: {
        success: true,
        result: {
          results: [
            {
              id: 'test-dataset-1',
              title: 'Test Dataset 1',
              notes: 'Description 1',
              metadata_created: '2023-01-01',
              metadata_modified: '2023-01-02',
              license_title: 'License 1',
              organization: { title: 'Org 1' },
              tags: [{ name: 'tag1' }],
              resources: [
                { format: 'CSV', url: 'http://example.com/data.csv' },
              ],
            },
          ],
        },
      },
    };

    mockedAxios.get.mockResolvedValue(ckanResponse);

    // Default queryMock returns empty, so it goes to create new

    await syncCKANHandler({});

    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('package_search'));

    // Expect batch.set to be called for new dataset
    expect(batchMock.set).toHaveBeenCalledTimes(1);
    expect(batchMock.commit).toHaveBeenCalledTimes(1);
  });

  it('should update existing datasets correctly', async () => {
    const ckanResponse = {
      data: {
        success: true,
        result: {
          results: [
            {
              id: 'test-dataset-1',
              title: 'Test Dataset 1 Updated',
              notes: 'Description 1 Updated',
              resources: [
                 { format: 'CSV', url: 'http://example.com/data.csv' },
              ],
              metadata_created: '2023-01-01',
              metadata_modified: '2023-01-02',
              license_title: 'License 1',
              organization: { title: 'Org 1' },
              tags: [{ name: 'tag1' }],
            },
          ],
        },
      },
    };

    mockedAxios.get.mockResolvedValue(ckanResponse);

    // Mock firestore query to return existing doc
    const existingDoc = { ref: 'doc-ref' };
    queryMock.get.mockResolvedValue({ empty: false, docs: [existingDoc] });

    await syncCKANHandler({});

    expect(batchMock.update).toHaveBeenCalledTimes(1);
    expect(batchMock.update).toHaveBeenCalledWith('doc-ref', expect.objectContaining({
        title: 'Test Dataset 1 Updated'
    }));
    expect(batchMock.commit).toHaveBeenCalledTimes(1);
  });
});
