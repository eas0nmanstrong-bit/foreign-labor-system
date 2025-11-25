import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

import ClientList from './pages/Client/ClientList';
import ClientForm from './pages/Client/ClientForm';
import ClientDetail from './pages/Client/ClientDetail';
import LaborList from './pages/Labor/LaborList';
import LaborForm from './pages/Labor/LaborForm';
import LaborDetail from './pages/Labor/LaborDetail';
import EmployeeList from './pages/Employee/EmployeeList';
import EmployeeForm from './pages/Employee/EmployeeForm';
import EmployeeDetail from './pages/Employee/EmployeeDetail';
import VendorList from './pages/Vendor/VendorList';
import VendorForm from './pages/Vendor/VendorForm';
import VendorDetail from './pages/Vendor/VendorDetail';

// Placeholder components
const AdminPanel = () => <h1 className="text-2xl font-bold">系統管理模組 (開發中)</h1>;

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />

            <Route path="labors" element={<LaborList />} />
            <Route path="labors/new" element={<LaborForm />} />
            <Route path="labors/:id" element={<LaborDetail />} />
            <Route path="labors/:id/edit" element={<LaborForm />} />

            <Route path="clients" element={<ClientList />} />
            <Route path="clients/new" element={<ClientForm />} />
            <Route path="clients/:id" element={<ClientDetail />} />
            <Route path="clients/:id/edit" element={<ClientForm />} />

            <Route path="employees" element={<EmployeeList />} />
            <Route path="employees/new" element={<EmployeeForm />} />
            <Route path="employees/:id" element={<EmployeeDetail />} />
            <Route path="employees/:id/edit" element={<EmployeeForm />} />

            <Route path="vendors" element={<VendorList />} />
            <Route path="vendors/new" element={<VendorForm />} />
            <Route path="vendors/:id" element={<VendorDetail />} />
            <Route path="vendors/:id/edit" element={<VendorForm />} />

            <Route path="admin" element={<AdminPanel />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
