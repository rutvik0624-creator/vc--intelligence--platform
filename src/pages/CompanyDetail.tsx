import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockCompanies } from '../lib/data';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { ArrowLeft, ExternalLink, Sparkles, BookmarkPlus, Check, AlertCircle, Building2 } from 'lucide-react';
import { useAppStore } from '../hooks/useAppStore';

interface EnrichmentData {
  summary: string;
  descriptionBullets: string[];
  keywords: string[];
  signals: string[];
  sources: { url: string; timestamp: string }[];
}

export function CompanyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const company = mockCompanies.find(c => c.id === id);
  const { notes, updateNote, lists, addCompanyToList } = useAppStore();

  const [noteText, setNoteText] = useState(notes[id || ''] || '');
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichmentData, setEnrichmentData] = useState<EnrichmentData | null>(null);
  const [enrichError, setEnrichError] = useState<string | null>(null);
  const [showListDropdown, setShowListDropdown] = useState(false);

  useEffect(() => {
    if (id && notes[id]) {
      setNoteText(notes[id]);
    }
  }, [id, notes]);

  if (!company) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-semibold text-slate-900">Company not found</h2>
        <Button onClick={() => navigate('/companies')} variant="outline" className="mt-4">
          Back to Directory
        </Button>
      </div>
    );
  }

  const handleSaveNote = () => {
    updateNote(company.id, noteText);
  };

  const handleEnrich = async () => {
    setIsEnriching(true);
    setEnrichError(null);
    try {
      const response = await fetch('/api/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: company.url, companyId: company.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to enrich data');
      }

      const data = await response.json();
      setEnrichmentData(data);
    } catch (error) {
      setEnrichError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsEnriching(false);
    }
  };

  const handleAddToList = (listId: string) => {
    addCompanyToList(listId, company.id);
    setShowListDropdown(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 md:space-y-8">
      <button
        onClick={() => navigate('/companies')}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Companies
      </button>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-white border border-slate-200 items-center justify-center shrink-0 shadow-sm">
            <Building2 className="w-8 h-8 text-slate-400" />
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">{company.name}</h1>
              <Badge variant="secondary" className="text-sm px-3 py-1 bg-slate-100 text-slate-700">{company.stage}</Badge>
            </div>
            <a
              href={company.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 mt-2 text-sm font-medium transition-colors w-fit"
            >
              {company.url.replace('https://', '')}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <div className="flex items-center gap-3 mt-4 text-sm text-slate-600 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-slate-900">Industry:</span> {company.industry}
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block" />
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-slate-900">Location:</span> {company.location}
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block" />
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-slate-900">Founded:</span> {company.founded}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 relative w-full md:w-auto">
          <Button
            onClick={handleEnrich}
            disabled={isEnriching}
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex-1 md:flex-none"
          >
            {isEnriching ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {isEnriching ? 'Enriching...' : 'Live Enrich'}
          </Button>
          
          <div className="relative flex-1 md:flex-none">
            <Button
              variant="outline"
              className="gap-2 w-full shadow-sm"
              onClick={() => setShowListDropdown(!showListDropdown)}
            >
              <BookmarkPlus className="w-4 h-4" />
              Save
            </Button>
            
            {showListDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-10 py-1">
                {lists.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-slate-500 text-center">
                    No lists created yet.
                    <button onClick={() => navigate('/lists')} className="text-indigo-600 hover:underline block mt-1">
                      Create one
                    </button>
                  </div>
                ) : (
                  lists.map(list => {
                    const isAdded = list.companyIds.includes(company.id);
                    return (
                      <button
                        key={list.id}
                        onClick={() => handleAddToList(list.id)}
                        disabled={isAdded}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="truncate">{list.name}</span>
                        {isAdded && <Check className="w-4 h-4 text-emerald-600" />}
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          {/* Overview Section */}
          <section className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Overview</h2>
            <p className="text-slate-700 leading-relaxed">{company.description}</p>
          </section>

          {/* Enrichment Results */}
          {(isEnriching || enrichmentData || enrichError) && (
            <section className="bg-white p-5 md:p-6 rounded-2xl border border-indigo-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-slate-900">AI Intelligence</h2>
              </div>

              {isEnriching ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </div>
              ) : enrichError ? (
                <div className="flex items-start gap-3 p-4 bg-red-50 text-red-800 rounded-xl border border-red-100">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Enrichment Failed</h3>
                    <p className="text-sm mt-1 opacity-90">{enrichError}</p>
                  </div>
                </div>
              ) : enrichmentData ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Executive Summary</h3>
                    <p className="text-slate-900 leading-relaxed font-medium">{enrichmentData.summary}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Key Value Proposition</h3>
                    <ul className="space-y-2.5">
                      {enrichmentData.descriptionBullets.map((bullet, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                          <span className="leading-relaxed">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Market Signals</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {enrichmentData.signals.map((signal, i) => (
                        <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-800 font-medium">
                          {signal}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {enrichmentData.keywords.map((kw, i) => (
                        <Badge key={i} variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-transparent">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-1.5">
                      <span>Data extracted from <a href={enrichmentData.sources[0].url} className="underline hover:text-slate-600">{enrichmentData.sources[0].url}</a></span>
                      <span className="hidden sm:inline">•</span>
                      <span>{new Date(enrichmentData.sources[0].timestamp).toLocaleString()}</span>
                    </p>
                  </div>
                </div>
              ) : null}
            </section>
          )}
        </div>

        <div className="space-y-6 lg:space-y-8">
          {/* Notes Section */}
          <section className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[400px]">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Internal Notes</h2>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add your thesis, meeting notes, or thoughts here..."
              className="flex-1 w-full resize-none rounded-xl border border-slate-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-4 bg-slate-50/50"
            />
            <Button onClick={handleSaveNote} className="w-full shadow-sm">
              Save Notes
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
}
