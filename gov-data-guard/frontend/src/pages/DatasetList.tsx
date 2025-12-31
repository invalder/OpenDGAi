import React, { useEffect, useState } from 'react';
import { Dataset } from '../types';
import { DatasetService } from '../services/datasetService';

const DatasetList: React.FC = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = async () => {
    setLoading(true);
    const data = await DatasetService.getAll();
    setDatasets(data);
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Datasets</h1>
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visibility</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {datasets.map((dataset) => (
              <tr key={dataset.id}>
                <td className="px-6 py-4 whitespace-nowrap">{dataset.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{dataset.owner}</td>
                <td className="px-6 py-4 whitespace-nowrap">{dataset.visibility}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    dataset.pdpaStatus === 'approved' ? 'bg-green-100 text-green-800' :
                    dataset.pdpaStatus === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {dataset.pdpaStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {datasets.length === 0 && <div className="p-4 text-center text-gray-500">No datasets found</div>}
      </div>
    </div>
  );
};

export default DatasetList;
