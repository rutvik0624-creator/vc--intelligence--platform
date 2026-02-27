import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Building2, List, Search, Bookmark, Menu, X, BarChart3, LogOut, Shield, LineChart, User, FileSpreadsheet } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAppStore } from "../../hooks/useAppStore";

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAppStore();
  const navigate = useNavigate();

  const navItems = [
    { to: "/analytics", icon: BarChart3, label: "Analytics Dashboard", roles: ['admin', 'analyst', 'company', 'user'] },
    { to: "/companies", icon: Building2, label: "Companies", roles: ['admin', 'analyst', 'company', 'user'] },
    { to: "/lists", icon: List, label: "Lists", roles: ['admin'] },
    { to: "/saved", icon: Bookmark, label: "Saved Searches", roles: ['admin'] },
    { to: "/spreadsheet", icon: FileSpreadsheet, label: "Master Database", roles: ['admin'] },
    { to: "/my-profile", icon: User, label: "My Profile", roles: ['company', 'user'] },
  ].filter(item => item.roles.includes(user?.role || 'user'));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 z-30 absolute top-0 w-full shadow-sm">
        <h1 className="text-lg font-bold tracking-tight flex items-center gap-2 text-slate-900">
          <div className="bg-indigo-600 p-1 rounded-md">
            <Search className="w-4 h-4 text-white" />
          </div>
          VC Intel
        </h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-20 w-52 md:w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0 shadow-xl md:shadow-none",
          isSidebarOpen ? "translate-x-0 pt-16 md:pt-0" : "-translate-x-full"
        )}
      >
        <div className="hidden md:flex p-6 items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-sm shadow-indigo-200">
            <Search className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            VC Intel
          </h1>
        </div>
        
        <nav className="flex-1 px-4 py-4 md:py-0 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100/50"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )
              }
            >
              <item.icon className={cn("w-4 h-4", "opacity-80")} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-sm font-bold text-indigo-700 shadow-inner">
                {user?.role === 'admin' ? <Shield className="w-4 h-4" /> : user?.role === 'analyst' ? <LineChart className="w-4 h-4" /> : user?.role === 'company' ? <Building2 className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div>
                <div className="text-sm font-medium text-slate-700 capitalize">{user?.role || 'User'}</div>
                <div className="text-xs text-slate-500 truncate max-w-[100px]">{user?.email || 'user@vc.com'}</div>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/30 z-10 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto w-full pt-16 md:pt-0 bg-gradient-to-br from-slate-50 to-slate-100/80 flex flex-col">
        <div className="flex-1">
          <Outlet />
        </div>
        <footer className="py-4 text-center text-sm text-slate-500 border-t border-slate-200/60 bg-slate-50/50">
          Built by Rutvik
        </footer>
      </main>
    </div>
  );
}
