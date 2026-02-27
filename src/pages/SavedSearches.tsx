import { useAppStore } from '../hooks/useAppStore';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Trash2, Play, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function SavedSearches() {
  const { savedSearches, deleteSearch } = useAppStore();
  const navigate = useNavigate();

  const handleRunSearch = (search: typeof savedSearches[0]) => {
    const params = new URLSearchParams();
    if (search.query) params.set('q', search.query);
    if (search.industry) params.set('industry', search.industry);
    if (search.stage) params.set('stage', search.stage);
    if (search.location) params.set('location', search.location);
    
    navigate(`/companies?${params.toString()}`);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Saved Searches</h1>
        <p className="text-slate-500 mt-1 text-sm md:text-base">Quickly access your frequent discovery queries.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedSearches.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-slate-50/50 rounded-2xl border border-slate-200 border-dashed">
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Bookmark className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">You haven't saved any searches yet.</p>
              <Button variant="outline" className="mt-4 shadow-sm" onClick={() => navigate('/companies')}>
                Go to Discovery
              </Button>
            </div>
          </div>
        ) : (
          savedSearches.map(search => (
            <div key={search.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col hover:border-slate-300 transition-colors group">
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-lg">{search.name}</h3>
                <button
                  onClick={() => deleteSearch(search.id)}
                  className="text-slate-400 hover:text-red-600 transition-colors p-1.5 rounded-md hover:bg-red-50 opacity-0 group-hover:opacity-100 focus:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 space-y-4 mb-6">
                {search.query && (
                  <div className="text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-slate-500 mr-2">Query:</span>
                    <span className="font-semibold text-slate-900">"{search.query}"</span>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {search.industry && <Badge variant="secondary" className="bg-slate-100 text-slate-700">Industry: {search.industry}</Badge>}
                  {search.stage && <Badge variant="outline" className="border-slate-200 text-slate-600">Stage: {search.stage}</Badge>}
                  {search.location && <Badge variant="outline" className="border-slate-200 text-slate-600">Location: {search.location}</Badge>}
                </div>
                {!search.query && !search.industry && !search.stage && !search.location && (
                  <div className="text-sm text-slate-500 italic p-3 bg-slate-50 rounded-lg border border-slate-100">No filters applied</div>
                )}
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                <span className="text-xs font-medium text-slate-400">
                  {new Date(search.createdAt).toLocaleDateString()}
                </span>
                <Button onClick={() => handleRunSearch(search)} size="sm" className="gap-2 shadow-sm">
                  <Play className="w-3.5 h-3.5" />
                  Run Search
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
