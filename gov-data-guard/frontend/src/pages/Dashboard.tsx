import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

const data = [
  { name: 'Public', value: 400 },
  { name: 'Restricted', value: 300 },
  { name: 'Confidential', value: 300 },
];

const riskData = [
  { name: 'Low', value: 20 },
  { name: 'Medium', value: 15 },
  { name: 'High', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard: React.FC = () => {
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("GovData Guard - Compliance Report", 20, 20);

    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);

    doc.setFontSize(14);
    doc.text("Dataset Visibility", 20, 50);
    doc.setFontSize(12);
    data.forEach((item, index) => {
        doc.text(`${item.name}: ${item.value}`, 20, 60 + (index * 6));
    });

    doc.setFontSize(14);
    doc.text("Risk Distribution", 20, 90);
    doc.setFontSize(12);
    riskData.forEach((item, index) => {
        doc.text(`${item.name}: ${item.value}`, 20, 100 + (index * 6));
    });

    doc.save("compliance-report.pdf");
  };

  const exportExcel = () => {
    const wsData = [
        ...data.map(d => ({ Category: 'Visibility', Name: d.name, Value: d.value })),
        ...riskData.map(d => ({ Category: 'Risk', Name: d.name, Value: d.value }))
    ];
    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Dashboard Data");
    XLSX.writeFile(wb, "compliance-report.xlsx");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="space-x-4">
          <button
            onClick={exportPDF}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Export PDF
          </button>
          <button
            onClick={exportExcel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Export Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl mb-4">Dataset Visibility</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl mb-4">Risk Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {riskData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
