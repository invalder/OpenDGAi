import React, { useState } from 'react';
import { searchDatasets, mapCKANToDataset, CKANDataset } from '../services/ckanService';
import { createDataset } from '../services/datasetService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CKANImport: React.FC = () => {
  const [ckanUrl, setCkanUrl] = useState('https://data.go.th');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CKANDataset[]>([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await searchDatasets(query, ckanUrl);
      setResults(data);
    } catch (err) {
      setError('Failed to fetch datasets. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (ckanData: CKANDataset) => {
    if (!user) return;
    setImporting(ckanData.id);
    try {
      const dataset = mapCKANToDataset(ckanData, ckanUrl);
      // Ensure required fields are present
      if (!dataset.title || !dataset.description) {
        throw new Error('Missing required fields in CKAN dataset');
      }

      await createDataset({
        ...dataset,
        owner: user.uid,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      } as any); // Cast to any because createDataset might expect a full Dataset object minus id

      alert('Dataset imported successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Failed to import dataset.');
    } finally {
      setImporting(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Import from CKAN</h1>

      <form onSubmit={handleSearch} className="mb-8 p-4 bg-white rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">CKAN URL</label>
            <input
              type="text"
              value={ckanUrl}
              onChange={(e) => setCkanUrl(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="https://data.go.th"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Search Query</label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="e.g. health, population"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((item) => (
          <div key={item.id} className="p-4 border rounded shadow bg-white">
            <h3 className="font-bold text-lg mb-2 truncate" title={item.title}>{item.title}</h3>
            <p className="text-sm text-gray-600 mb-2 line-clamp-3">{item.notes}</p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                {item.resources.length} resources
              </span>
              <button
                onClick={() => handleImport(item)}
                disabled={!!importing}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
              >
                {importing === item.id ? 'Importing...' : 'Import'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {results.length === 0 && !loading && !error && (
        <p className="text-center text-gray-500">No results found. Try a different search.</p>
      )}
    </div>
  );
};

export default CKANImport;
