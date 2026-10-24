import React from 'react';
import { Users, UserCheck, Clock, Award, Search, X, Filter, ArrowUpDown } from 'lucide-react';
import { CheckInStats } from '../types';

interface StatsOverviewProps {
  stats: CheckInStats;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: 'ALL' | 'PRESENT' | 'PENDING';
  onStatusFilterChange: (filter: 'ALL' | 'PRESENT' | 'PENDING') => void;
  sortBy: 'slot' | 'name' | 'id' | 'checkInTime';
  onSortChange: (sort: 'slot' | 'name' | 'id' | 'checkInTime') => void;
  viewMode: 'cards' | 'table';
  onViewModeChange: (mode: 'cards' | 'table') => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  stats,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Registered */}
        <div className="cyber-panel rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-purple-500/40 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-600/10 rounded-full blur-2xl -mr-6 -mt-6 group-hover:bg-purple-600/20 transition-all" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display">
              Registered Teams
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black font-heading text-white">
              {stats.total}
            </span>
            <span className="text-xs text-slate-400 font-medium">teams in roster</span>
          </div>
          <div className="mt-2 text-xs text-purple-300/80 font-mono">
            Target: 12 Tournament Slots
          </div>
        </div>

        {/* Present Teams */}
        <div className="cyber-panel rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-emerald-500/40 transition-all border-emerald-500/20">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-600/10 rounded-full blur-2xl -mr-6 -mt-6 group-hover:bg-emerald-600/20 transition-all" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-display">
              Teams Present
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black font-heading text-emerald-400">
              {stats.present}
            </span>
            <span className="text-xs text-emerald-300/70 font-medium">checked in</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span className="text-emerald-400 font-semibold">{stats.photoVerifiedCount} photo</span>
            <span>•</span>
            <span className="text-slate-400">{stats.manualCount} manual</span>
          </div>
        </div>

        {/* Pending Teams */}
        <div className="cyber-panel rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-amber-500/40 transition-all border-amber-500/20">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-600/10 rounded-full blur-2xl -mr-6 -mt-6 group-hover:bg-amber-600/20 transition-all" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-display">
              Teams Pending
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black font-heading text-amber-400">
              {stats.pending}
            </span>
            <span className="text-xs text-amber-300/70 font-medium">awaiting arrival</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 font-mono">
            {stats.pending > 0 ? 'Desk ready to check in' : 'All teams checked in!'}
          </div>
        </div>

        {/* Attendance Percentage */}
        <div className="cyber-panel rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-cyan-500/40 transition-all border-cyan-500/20">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-600/10 rounded-full blur-2xl -mr-6 -mt-6 group-hover:bg-cyan-600/20 transition-all" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-display">
              Attendance Rate
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black font-heading text-cyan-400">
              {stats.percentage}%
            </span>
            <span className="text-xs text-slate-400 font-medium">of lobby</span>
          </div>
          <div className="mt-2 text-xs text-cyan-300/80 font-mono">
            {stats.percentage === 100 ? 'Lobby 100% Ready!' : `${stats.pending} remaining`}
          </div>
        </div>

      </div>

      {/* Attendance Progress Bar */}
      <div className="cyber-panel rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-display uppercase tracking-wider">Tournament Lobby Readiness</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {stats.present} / {stats.total} Teams
            </span>
          </div>
          <span className="font-heading font-black text-cyan-400 text-base">{stats.percentage}%</span>
        </div>

        {/* Outer bar */}
        <div className="h-4 bg-[#0a0d18] rounded-full p-0.5 border border-purple-500/20 overflow-hidden relative">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-600 via-cyan-500 to-emerald-400 transition-all duration-700 ease-out relative"
            style={{ width: `${stats.percentage}%` }}
          >
            {/* Shimmer light */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-pulse" />
          </div>
        </div>

        {/* Milestone labels */}
        <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-1.5 px-0.5">
          <span>0% Check-in Open</span>
          <span>50% Min Quorum</span>
          <span>75% Seeding Locked</span>
          <span className={stats.percentage === 100 ? 'text-emerald-400 font-bold' : ''}>
            100% Match Ready
          </span>
        </div>
      </div>

      {/* Search, Filter, Sort Controls Bar */}
      <div className="cyber-panel rounded-2xl p-3 sm:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by team name, team ID (IGN-01), or leader..."
            className="w-full bg-[#090b16] border border-slate-700/80 rounded-xl pl-10 pr-9 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Status Filter Tabs */}
          <div className="flex items-center bg-[#090b16] p-1 rounded-xl border border-slate-700/80">
            <button
              onClick={() => onStatusFilterChange('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'ALL'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => onStatusFilterChange('PRESENT')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'PRESENT'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              Present ({stats.present})
            </button>
            <button
              onClick={() => onStatusFilterChange('PENDING')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'PENDING'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-amber-400'
              }`}
            >
              Pending ({stats.pending})
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#090b16] px-3 py-1.5 rounded-xl border border-slate-700/80">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as 'slot' | 'name' | 'id' | 'checkInTime')}
              aria-label="Sort teams by"
              className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="slot" className="bg-slate-900 text-white">Sort: Slot Number</option>
              <option value="name" className="bg-slate-900 text-white">Sort: Team Name</option>
              <option value="id" className="bg-slate-900 text-white">Sort: Team ID</option>
              <option value="checkInTime" className="bg-slate-900 text-white">Sort: Check-In Time</option>
            </select>
          </div>

          {/* View Mode Toggle (Cards vs Table) */}
          <div className="flex items-center bg-[#090b16] p-1 rounded-xl border border-slate-700/80">
            <button
              onClick={() => onViewModeChange('cards')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'cards'
                  ? 'bg-purple-600/80 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Card View (Great for quick photo check-in)"
            >
              Cards
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'table'
                  ? 'bg-purple-600/80 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Table View (Compact for bulk inspection)"
            >
              Table
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
