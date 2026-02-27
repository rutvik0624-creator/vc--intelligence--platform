import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { mockCompanies } from '../lib/data';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Search, SlidersHorizontal, ArrowUpDown, BookmarkPlus, Building2 } from 'lucide-react';
import { useAppStore } from '../hooks/useAppStore';

export function Companies() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { saveSearch } = useAppStore();
  
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [industryFilter, setIndustryFilter] = useState(searchParams.get('industry') || '');
  const [stageFilter, setStageFilter] = useState(searchParams.get('stage') || '');
  const [locationFilter, setLocationFilter] = useState(searchParams.get('location') || '');
  
  const [sortConfig, setSortConfig] = useState<{ key: keyof typeof mockCompanies[0]; direction: 'asc' | 'desc' } | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (industryFilter) params.set('industry', industryFilter);
    if (stageFilter) params.set('stage', stageFilter);
    if (locationFilter) params.set('location', locationFilter);
    setSearchParams(params, { replace: true });
  }, [query, industryFilter, stageFilter, locationFilter, setSearchParams]);

  const industries = Array.from(new Set(mockCompanies.map(c => c.industry)));
  const stages = Array.from(new Set(mockCompanies.map(c => c.stage)));
  const locations = Array.from(new Set(mockCompanies.map(c => c.location)));

  const filteredCompanies = useMemo(() => {
    let filtered = mockCompanies.filter(c => {
      const matchesQuery = c.name.toLowerCase().includes(query.toLowerCase()) || c.description.toLowerCase().includes(query.toLowerCase());
      const matchesIndustry = industryFilter ? c.industry === industryFilter : true;
      const matchesStage = stageFilter ? c.stage === stageFilter : true;
      const matchesLocation = locationFilter ? c.location === locationFilter : true;
      return matchesQuery && matchesIndustry && matchesStage && matchesLocation;
    });

    if (sortConfig) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [query, industryFilter, stageFilter, locationFilter, sortConfig]);

  const paginatedCompanies = filteredCompanies.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);

  const handleSort = (key: keyof typeof mockCompanies[0]) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSaveSearch = () => {
    const name = prompt('Enter a name for this search:');
    if (name) {
      saveSearch({ name, query, industry: industryFilter, stage: stageFilter, location: locationFilter });
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Discovery</h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">Find and filter through the startup database.</p>
        </div>
        <Button onClick={handleSaveSearch} variant="outline" className="gap-2 w-full sm:w-auto shadow-sm">
          <BookmarkPlus className="w-4 h-4" />
          Save Search
        </Button>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center bg-white p-2 md:p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search companies or descriptions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 border-none shadow-none focus-visible:ring-0 text-base bg-transparent"
          />
        </div>
        <div className="h-[1px] w-full lg:h-8 lg:w-[1px] bg-slate-200" />
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 px-2 pb-2 lg:px-0 lg:pb-0">
          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
          >
            <option value="">All Industries</option>
            {industries.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
          >
            <option value="">All Stages</option>
            {stages.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
          >
            <option value="">All Locations</option>
            {locations.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap md:whitespace-normal">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 border-b border-slate-200">
              <tr>
                <th className="px-4 md:px-6 py-4 font-semibold cursor-pointer hover:text-slate-900 transition-colors" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1.5">Company <ArrowUpDown className="w-3.5 h-3.5" /></div>
                </th>
                <th className="px-4 md:px-6 py-4 font-semibold cursor-pointer hover:text-slate-900 transition-colors" onClick={() => handleSort('industry')}>
                  <div className="flex items-center gap-1.5">Industry <ArrowUpDown className="w-3.5 h-3.5" /></div>
                </th>
                <th className="px-4 md:px-6 py-4 font-semibold cursor-pointer hover:text-slate-900 transition-colors" onClick={() => handleSort('stage')}>
                  <div className="flex items-center gap-1.5">Stage <ArrowUpDown className="w-3.5 h-3.5" /></div>
                </th>
                <th className="px-4 md:px-6 py-4 font-semibold cursor-pointer hover:text-slate-900 transition-colors hidden sm:table-cell" onClick={() => handleSort('location')}>
                  <div className="flex items-center gap-1.5">Location <ArrowUpDown className="w-3.5 h-3.5" /></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedCompanies.map((company) => (
                <tr
                  key={company.id}
                  onClick={() => navigate(`/companies/${company.id}`)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                >
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="hidden md:flex w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{company.name}</div>
                        <div className="text-slate-500 text-xs mt-1 truncate max-w-[200px] md:max-w-[300px]">{company.description}</div>
                        <div className="text-slate-400 text-xs mt-0.5 sm:hidden">{company.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4"><Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">{company.industry}</Badge></td>
                  <td className="px-4 md:px-6 py-4"><Badge variant="outline" className="border-slate-200 text-slate-600">{company.stage}</Badge></td>
                  <td className="px-4 md:px-6 py-4 text-slate-600 hidden sm:table-cell">{company.location}</td>
                </tr>
              ))}
              {paginatedCompanies.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-slate-500 bg-slate-50/50">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="w-8 h-8 text-slate-300 mb-3" />
                      <p className="text-base font-medium text-slate-900">No companies found</p>
                      <p className="text-sm mt-1">Try adjusting your filters or search query.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 md:px-6 py-4 border-t border-slate-200 bg-slate-50/80 gap-4">
            <div className="text-sm text-slate-500">
              Showing <span className="font-medium text-slate-900">{(page - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-slate-900">{Math.min(page * itemsPerPage, filteredCompanies.length)}</span> of <span className="font-medium text-slate-900">{filteredCompanies.length}</span> results
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex-1 sm:flex-none"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex-1 sm:flex-none"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
