import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Companies } from './pages/Companies';
import { CompanyDetail } from './pages/CompanyDetail';
import { Lists } from './pages/Lists';
import { SavedSearches } from './pages/SavedSearches';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/companies" replace />} />
          <Route path="companies" element={<Companies />} />
          <Route path="companies/:id" element={<CompanyDetail />} />
          <Route path="lists" element={<Lists />} />
          <Route path="saved" element={<SavedSearches />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
