import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Files, 
  TestTube, 
  Play, 
  Zap,
  Settings,
  User,
  Bell,
  Search,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

interface AppShellProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, color: 'from-blue-500 to-indigo-600' },
  { name: 'Files', href: '/files', icon: Files, color: 'from-emerald-500 to-teal-600' },
  { name: 'Test Cases', href: '/test-cases', icon: TestTube, color: 'from-purple-500 to-violet-600' },
  { name: 'Runs', href: '/runs', icon: Play, color: 'from-pink-500 to-rose-600' },
];

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-lg shadow-slate-900/5">
        <div className="px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all duration-200"
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    KS-QE Platform
                  </h1>
                  <p className="text-xs text-slate-500 font-medium">Quality Engineering Suite</p>
                </div>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search runs, files, or test cases..."
                  className="w-full pl-10 pr-4 py-2 bg-white/60 border border-white/20 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/30 backdrop-blur-sm transition-all duration-200"
                />
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-3">
              <button className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all duration-200">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all duration-200">
                <Settings className="h-5 w-5" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-violet-500 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Enhanced Sidebar */}
        <aside className={cn(
          "fixed lg:relative inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="h-full backdrop-blur-xl bg-white/70 border-r border-white/20 shadow-2xl">
            <div className="p-6 pt-8">
              {/* Navigation */}
              <div className="mb-8">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                  Navigation
                </h3>
                <nav className="space-y-2">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          "group flex items-center px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200",
                          isActive
                            ? `bg-gradient-to-r ${item.color} text-white shadow-lg transform scale-105`
                            : "text-slate-600 hover:text-slate-900 hover:bg-white/60 hover:shadow-md hover:scale-102"
                        )}
                      >
                        <div className={cn(
                          "p-2 rounded-xl mr-4 transition-all duration-200",
                          isActive 
                            ? "bg-white/20" 
                            : "bg-slate-100 group-hover:bg-slate-200"
                        )}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <span>{item.name}</span>
                        {isActive && (
                          <div className="ml-auto">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Quick Stats Card */}
              <div className="p-6 bg-gradient-to-br from-slate-50/80 to-blue-50/80 rounded-2xl border border-slate-200/50 shadow-sm backdrop-blur-sm">
                <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-medium">Active Runs</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-bold text-blue-600">3</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-medium">Coverage</span>
                    <span className="text-sm font-bold text-emerald-600">87.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-medium">Files</span>
                    <span className="text-sm font-bold text-purple-600">24</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-3">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full w-3/4 transition-all duration-500"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Enhanced Main Content */}
        <main className="flex-1 min-h-screen lg:ml-0">
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
