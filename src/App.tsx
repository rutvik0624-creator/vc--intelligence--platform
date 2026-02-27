import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Companies } from './pages/Companies';
import { CompanyDetail } from './pages/CompanyDetail';
import { Lists } from './pages/Lists';
import { SavedSearches } from './pages/SavedSearches';
import { Login } from './pages/Login';
import { Analytics } from './pages/Analytics';
import { MyProfile } from './pages/MyProfile';
import { Spreadsheet } from './pages/Spreadsheet';
import { useAppStore, UserRole } from './hooks/useAppStore';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: UserRole[] }) {
  const { user } = useAppStore();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'company') return <Navigate to="/my-profile" replace />;
    if (user.role === 'user') return <Navigate to="/companies" replace />;
    return <Navigate to="/analytics" replace />;
  }
  return <>{children}</>;
}

function IndexRedirect() {
  const { user } = useAppStore();
  if (user?.role === 'company') return <Navigate to="/my-profile" replace />;
  if (user?.role === 'user') return <Navigate to="/companies" replace />;
  return <Navigate to="/analytics" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<IndexRedirect />} />
          <Route 
            path="analytics" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'analyst', 'company', 'user']}>
                <Analytics />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="companies" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'analyst', 'company', 'user']}>
                <Companies />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="companies/:id" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'analyst', 'company', 'user']}>
                <CompanyDetail />
              </ProtectedRoute>
            } 
          />
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
          <Route 
            path="spreadsheet" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Spreadsheet />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="my-profile" 
            element={
              <ProtectedRoute allowedRoles={['company', 'user']}>
                <MyProfile />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
