import React from 'react';
import { Building2, Globe, Mail, MapPin } from 'lucide-react';
import { useAppStore } from '../hooks/useAppStore';
import { Button } from '../components/ui/button';

export function MyProfile() {
  const { user } = useAppStore();

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Company Profile</h1>
        <p className="text-slate-500 mt-1 text-sm md:text-base">Manage your startup's public information and visibility.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100 shadow-sm">
            <Building2 className="w-10 h-10 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Your Startup Inc.</h2>
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {user?.email}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> San Francisco, CA</span>
            </div>
          </div>
        </div>

        <div className="space-y-6 pt-6 border-t border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Company Name</label>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-medium">
                Your Startup Inc.
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Website</label>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-medium flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-400" />
                https://yourstartup.com
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Industry</label>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-medium">
                Artificial Intelligence
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Stage</label>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-medium">
                Seed
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Company Description</label>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 leading-relaxed text-sm">
              We are building the next generation of AI-powered tools for enterprise teams. Our platform integrates seamlessly with existing workflows to automate repetitive tasks and surface actionable insights.
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
              Request Profile Update
            </Button>
            <Button variant="outline" className="w-full sm:w-auto shadow-sm">
              View Public Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
