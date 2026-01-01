import { Dataset, DCATMetadata } from '../types';

export interface CKANDataset {
  id: string;
  title: string;
  notes: string;
  url: string;
  resources: CKANResource[];
  organization: {
    title: string;
  };
  metadata_created: string;
  metadata_modified: string;
  license_title: string;
  tags: { name: string }[];
}

export interface CKANResource {
  id: string;
  format: string;
  url: string;
  name: string;
}

export const searchDatasets = async (query: string, ckanUrl: string): Promise<CKANDataset[]> => {
  try {
    const response = await fetch(`${ckanUrl}/api/3/action/package_search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`CKAN API Error: ${response.statusText}`);
    }
    const data = await response.json();
    if (!data.success) {
        throw new Error('CKAN API returned failure');
    }
    return data.result.results;
  } catch (error) {
    console.error('Failed to search CKAN datasets:', error);
    throw error;
  }
};

export const mapCKANToDataset = (ckanData: CKANDataset, ckanBaseUrl: string): Partial<Dataset> => {
  // Find a suitable resource (CSV, JSON, XML)
  const resource = ckanData.resources.find(r =>
    ['csv', 'json', 'xml'].includes(r.format.toLowerCase())
  );

  const metadata: DCATMetadata = {
    publisher: ckanData.organization?.title,
    issued: ckanData.metadata_created,
    modified: ckanData.metadata_modified,
    license: ckanData.license_title,
    keywords: ckanData.tags?.map(t => t.name) || [],
  };

  return {
    title: ckanData.title,
    description: ckanData.notes,
    ckanId: ckanData.id,
    ckanUrl: ckanBaseUrl,
    metadata,
    fileUrl: resource?.url,
    format: resource?.format.toLowerCase() as any, // Cast to known format
    lastSynced: new Date().toISOString(),
    visibility: 'public', // Default for open data
    pdpaStatus: 'pending'
  };
};
