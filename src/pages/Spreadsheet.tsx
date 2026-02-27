import React, { useState } from 'react';
import { FileSpreadsheet, Download, Plus, Filter, Search, ArrowUpDown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const INITIAL_DATA = [
  { id: 1, company: 'Stripe', industry: 'Fintech', stage: 'Public', funding: '$8.7B', valuation: '$65B', status: 'Tracking' },
  { id: 2, company: 'SpaceX', industry: 'Aerospace', stage: 'Late Stage', funding: '$9.8B', valuation: '$150B', status: 'Portfolio' },
  { id: 3, company: 'OpenAI', industry: 'AI', stage: 'Late Stage', funding: '$11.3B', valuation: '$86B', status: 'Passed' },
  { id: 4, company: 'Anthropic', industry: 'AI', stage: 'Series C', funding: '$1.5B', valuation: '$4.1B', status: 'Active' },
  { id: 5, company: 'Rippling', industry: 'HR Tech', stage: 'Series E', funding: '$1.2B', valuation: '$11.2B', status: 'Tracking' },
  { id: 6, company: 'Databricks', industry: 'Data', stage: 'Late Stage', funding: '$3.5B', valuation: '$43B', status: 'Portfolio' },
  { id: 7, company: 'Canva', industry: 'Design', stage: 'Late Stage', funding: '$572M', valuation: '$26B', status: 'Tracking' },
  { id: 8, company: 'Plaid', industry: 'Fintech', stage: 'Series D', funding: '$734M', valuation: '$13.4B', status: 'Passed' },
];

export function Spreadsheet() {
  const [data, setData] = useState(INITIAL_DATA);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(row => 
    Object.values(row).some(val => 
      val.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-6 h-[calc(100vh-4rem)] md:h-screen flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-8 h-8 text-emerald-600" />
            Master Database
          </h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">Admin spreadsheet view of all tracked companies.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="shadow-sm hidden sm:flex">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" className="shadow-sm hidden sm:flex">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Row
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center gap-4 shrink-0 bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search across all columns..." 
              className="pl-9 h-9 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-6 py-3 font-medium border-b border-slate-200 border-r">
                  <div className="flex items-center justify-between cursor-pointer hover:text-slate-900">
                    ID <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3 font-medium border-b border-slate-200 border-r">
                  <div className="flex items-center justify-between cursor-pointer hover:text-slate-900">
                    Company <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3 font-medium border-b border-slate-200 border-r">
                  <div className="flex items-center justify-between cursor-pointer hover:text-slate-900">
                    Industry <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3 font-medium border-b border-slate-200 border-r">
                  <div className="flex items-center justify-between cursor-pointer hover:text-slate-900">
                    Stage <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3 font-medium border-b border-slate-200 border-r">
                  <div className="flex items-center justify-between cursor-pointer hover:text-slate-900">
                    Total Funding <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3 font-medium border-b border-slate-200 border-r">
                  <div className="flex items-center justify-between cursor-pointer hover:text-slate-900">
                    Valuation <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3 font-medium border-b border-slate-200">
                  <div className="flex items-center justify-between cursor-pointer hover:text-slate-900">
                    Status <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-3 border-r border-slate-200 text-slate-500">{row.id}</td>
                  <td className="px-6 py-3 border-r border-slate-200 font-medium text-slate-900">{row.company}</td>
                  <td className="px-6 py-3 border-r border-slate-200 text-slate-600">{row.industry}</td>
                  <td className="px-6 py-3 border-r border-slate-200 text-slate-600">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
                      {row.stage}
                    </span>
                  </td>
                  <td className="px-6 py-3 border-r border-slate-200 text-slate-600 font-mono">{row.funding}</td>
                  <td className="px-6 py-3 border-r border-slate-200 text-slate-600 font-mono">{row.valuation}</td>
                  <td className="px-6 py-3 text-slate-600">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      row.status === 'Portfolio' ? 'bg-emerald-100 text-emerald-800' :
                      row.status === 'Active' ? 'bg-blue-100 text-blue-800' :
                      row.status === 'Passed' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-xs text-slate-500 flex justify-between items-center shrink-0">
          <span>{filteredData.length} rows</span>
          <span>Last synced: Just now</span>
        </div>
      </div>
    </div>
  );
}
