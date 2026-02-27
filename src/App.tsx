import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Companies } from './pages/Companies';
import { CompanyDetail } from './pages/CompanyDetail';
import { Lists } from './pages/Lists';
import { SavedSearches } from './pages/SavedSearches';
import { Login } from './pages/Login';
import { Analytics } from './pages/Analytics';
import { useAppStore, UserRole } from './hooks/useAppStore';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: UserRole[] }) {
  const { user } = useAppStore();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/analytics" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/analytics" replace />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="companies" element={<Companies />} />
          <Route path="companies/:id" element={<CompanyDetail />} />
          <Route 
            path="lists" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Lists />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="saved" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <SavedSearches />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
