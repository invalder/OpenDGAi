import React from 'react';
import { ScanResult } from '../types';

interface ScanResultViewProps {
  result: ScanResult;
}

const ScanResultView: React.FC<ScanResultViewProps> = ({ result }) => {
  return (
    <div className="bg-white p-6 rounded shadow mt-4">
      <h2 className="text-xl font-bold mb-4">Scan Results</h2>
      <div className="flex items-center mb-4">
        <span className="text-gray-700 mr-2">Risk Score:</span>
        <span className={`text-2xl font-bold ${
          result.riskScore > 75 ? 'text-red-600' :
          result.riskScore > 50 ? 'text-orange-500' : 'text-green-600'
        }`}>
          {result.riskScore}/100
        </span>
      </div>

      <h3 className="font-semibold mb-2">Findings</h3>
      <ul className="divide-y divide-gray-200">
        {result.findings.map((finding, index) => (
          <li key={index} className="py-2 flex justify-between">
            <span>{finding.type}</span>
            <span className="font-mono bg-gray-100 px-2 rounded">{finding.count} instances</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScanResultView;
