import * as React from 'react';
import { useState } from 'react';
import { useAppStore } from '../hooks/useAppStore';
import { mockCompanies } from '../lib/data';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Plus, Trash2, Download, ExternalLink, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Lists() {
  const { lists, addList, deleteList, removeCompanyFromList } = useAppStore();
  const [newListName, setNewListName] = useState('');
  const navigate = useNavigate();

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      addList(newListName.trim());
      setNewListName('');
    }
  };

  const handleExport = (listId: string, format: 'json' | 'csv') => {
    const list = lists.find(l => l.id === listId);
    if (!list) return;

    const companies = list.companyIds.map(id => mockCompanies.find(c => c.id === id)).filter(Boolean);

    if (format === 'json') {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(companies, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `${list.name}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } else {
      const headers = ['Name', 'URL', 'Industry', 'Stage', 'Location'];
      const csvContent = [
        headers.join(','),
        ...companies.map(c => [c?.name, c?.url, c?.industry, c?.stage, `"${c?.location}"`].join(','))
      ].join('\n');

      const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `${list.name}.csv`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Your Lists</h1>
        <p className="text-slate-500 mt-1 text-sm md:text-base">Organize and export your startup discoveries.</p>
      </div>

      <form onSubmit={handleCreateList} className="flex flex-col sm:flex-row gap-3 max-w-md">
        <Input
          placeholder="New list name..."
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" className="gap-2 w-full sm:w-auto shadow-sm">
          <Plus className="w-4 h-4" />
          Create
        </Button>
      </form>

      <div className="grid grid-cols-1 gap-6">
        {lists.length === 0 ? (
          <div className="text-center py-16 bg-slate-50/50 rounded-2xl border border-slate-200 border-dashed">
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Plus className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">You haven't created any lists yet.</p>
              <p className="text-sm text-slate-400 mt-1">Create a list above to start organizing companies.</p>
            </div>
          </div>
        ) : (
          lists.map(list => (
            <div key={list.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50/80 gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{list.name}</h2>
                  <p className="text-sm text-slate-500 mt-1 font-medium">{list.companyIds.length} companies</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                  <Button variant="outline" size="sm" onClick={() => handleExport(list.id, 'csv')} className="gap-2 shrink-0">
                    <Download className="w-4 h-4" /> CSV
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleExport(list.id, 'json')} className="gap-2 shrink-0">
                    <Download className="w-4 h-4" /> JSON
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteList(list.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0 ml-auto sm:ml-0">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="divide-y divide-slate-100">
                {list.companyIds.length === 0 ? (
                  <div className="p-8 text-center text-sm text-slate-500 bg-slate-50/30">
                    No companies in this list yet. Go to <button onClick={() => navigate('/companies')} className="text-indigo-600 font-medium hover:underline">Discovery</button> to add some.
                  </div>
                ) : (
                  list.companyIds.map(companyId => {
                    const company = mockCompanies.find(c => c.id === companyId);
                    if (!company) return null;
                    return (
                      <div key={companyId} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50/80 transition-colors group gap-4">
                        <div className="flex items-center gap-4">
                          <div className="hidden sm:flex w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 items-center justify-center shrink-0">
                            <Building2 className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                            <button onClick={() => navigate(`/companies/${company.id}`)} className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors text-left">
                              {company.name}
                            </button>
                            <div className="flex items-center gap-2 mt-1.5">
                              <Badge variant="secondary" className="text-[10px] px-2 py-0 bg-slate-100 text-slate-700">{company.industry}</Badge>
                              <Badge variant="outline" className="text-[10px] px-2 py-0 border-slate-200 text-slate-600">{company.stage}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity justify-end">
                          <a href={company.url} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-slate-900 transition-colors bg-white sm:bg-transparent rounded-md border border-slate-200 sm:border-transparent">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <button onClick={() => removeCompanyFromList(list.id, company.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors bg-white sm:bg-transparent rounded-md border border-slate-200 sm:border-transparent">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
