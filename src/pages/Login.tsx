import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore, UserRole } from '../hooks/useAppStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, Lock, Mail, ArrowRight, Building2, User } from 'lucide-react';
import { cn } from '../lib/utils';

const ADMIN_CREDENTIALS = [
  { email: 'admin1@vc.com', password: 'adminpassword1' },
  { email: 'admin2@vc.com', password: 'adminpassword2' }
];

const ANALYST_CREDENTIALS = [
  { email: 'analyst1@vc.com', password: 'analystpassword1' },
  { email: 'analyst2@vc.com', password: 'analystpassword2' },
  { email: 'analyst3@vc.com', password: 'analystpassword3' }
];

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [publicRole, setPublicRole] = useState<'company' | 'user'>('company');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAppStore();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      
      const isAdmin = ADMIN_CREDENTIALS.find(c => c.email === email && c.password === password);
      const isAnalyst = ANALYST_CREDENTIALS.find(c => c.email === email && c.password === password);

      if (isAdmin) {
        login(email, 'admin');
        navigate('/analytics');
        return;
      }
      
      if (isAnalyst) {
        login(email, 'analyst');
        navigate('/analytics');
        return;
      }

      const isKnownAdminEmail = ADMIN_CREDENTIALS.some(c => c.email === email);
      const isKnownAnalystEmail = ANALYST_CREDENTIALS.some(c => c.email === email);

      if (isKnownAdminEmail || isKnownAnalystEmail) {
        setError('Invalid password for internal account.');
        return;
      }

      // Public login
      login(email || `${publicRole}@example.com`, publicRole);
      if (publicRole === 'company') {
        navigate('/my-profile');
      } else {
        navigate('/companies');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left side - Branding */}
      <div className="hidden lg:flex flex-1 flex-col justify-between bg-indigo-600 p-12 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="currentColor" strokeWidth="2" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/20">
              <Search className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">VC Intel</h1>
          </div>
          
          <div className="space-y-6 max-w-md">
            <h2 className="text-4xl font-bold leading-tight">
              Thesis-driven startup discovery.
            </h2>
            <p className="text-indigo-100 text-lg leading-relaxed">
              Access real-time market signals, AI-powered enrichment, and organize your deal flow pipeline in one unified platform.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-indigo-200 text-sm font-medium">
          <span>Enterprise Grade</span>
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          <span>Role-Based Access</span>
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          <span>AI Powered</span>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-16">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-6">
              <div className="bg-indigo-600 p-3 rounded-xl shadow-sm shadow-indigo-200">
                <Search className="w-6 h-6 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</h2>
            <p className="text-slate-500 mt-2">Sign in to your VC Intel account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Public Role Selector */}
            <div className="bg-slate-100 p-1 rounded-lg flex">
              <button
                type="button"
                onClick={() => setPublicRole('company')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-all",
                  publicRole === 'company' 
                    ? "bg-white text-indigo-600 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                <Building2 className="w-4 h-4" />
                Company
              </button>
              <button
                type="button"
                onClick={() => setPublicRole('user')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-all",
                  publicRole === 'user' 
                    ? "bg-white text-indigo-600 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                <User className="w-4 h-4" />
                User
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 block">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    type="email"
                    required
                    placeholder={publicRole === 'company' ? "founder@startup.com" : "user@example.com"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 bg-white border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700 block">Password</label>
                  <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={cn(
                      "pl-10 h-11 bg-white border-slate-200 focus:border-indigo-500 focus:ring-indigo-500",
                      error && "border-red-500 focus:border-red-500 focus:ring-red-500"
                    )}
                  />
                </div>
                {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign in <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
