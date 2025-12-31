import React, { useState } from 'react';
import { DatasetService } from '../services/datasetService';
import { useNavigate } from 'react-router-dom';
import { Visibility } from '../types';

const DatasetForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    owner: '',
    visibility: 'public' as Visibility,
    format: 'csv' as 'csv' | 'json' | 'xml'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await DatasetService.create({
      ...formData,
      pdpaStatus: 'pending',
    });
    navigate('/datasets');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Register Dataset</h1>
      <form onSubmit={handleSubmit} className="max-w-lg bg-white p-6 rounded shadow">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
          <input
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Owner</label>
          <input
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.owner}
            onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Visibility</label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.visibility}
            onChange={(e) => setFormData({ ...formData, visibility: e.target.value as Visibility })}
          >
            <option value="public">Public</option>
            <option value="restricted">Restricted</option>
            <option value="confidential">Confidential</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default DatasetForm;
