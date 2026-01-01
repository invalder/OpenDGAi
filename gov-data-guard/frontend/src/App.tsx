import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import DatasetList from './pages/DatasetList';
import DatasetForm from './pages/DatasetForm';
import CKANImport from './pages/CKANImport';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 flex">
          {/* Sidebar */}
          <nav className="w-64 bg-gray-800 text-white p-6">
            <h1 className="text-xl font-bold mb-8">GovData Guard</h1>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="block hover:text-gray-300">Dashboard</Link>
              </li>
              <li>
                <Link to="/datasets" className="block hover:text-gray-300">Datasets</Link>
              </li>
              <li>
                <Link to="/datasets/new" className="block hover:text-gray-300">New Dataset</Link>
              </li>
              <li>
                <Link to="/ckan-import" className="block hover:text-gray-300">CKAN Import</Link>
              </li>
            </ul>
          </nav>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/datasets" element={<DatasetList />} />
              <Route path="/datasets/new" element={<DatasetForm />} />
              <Route path="/ckan-import" element={<CKANImport />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
