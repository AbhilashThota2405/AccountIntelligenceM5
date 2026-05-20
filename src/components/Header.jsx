import React from 'react';
import { ChevronDown, Search, X, RefreshCw, Globe } from 'lucide-react';

export default function Header({
  activeBoardId,
  setActiveBoardId,
  boards,
  searchQuery,
  setSearchQuery,
  handleFullSync,
  isSyncing,
  filtersHidden,
  setFiltersHidden,
  activeCurrency,
  setActiveCurrency,
  triggerToast
}) {
  return (
    <header className="header">
      <div className="header-left">
        <div className="header-title-container">
          <span className="header-pretitle">Active Board view</span>
          {/* Dynamic Board Switcher */}
          <div className="select-wrapper">
            <select 
              className="gong-select text-lg font-bold border-none p-0 pr-6 bg-transparent"
              value={activeBoardId}
              onChange={(e) => setActiveBoardId(e.target.value)}
              style={{ fontSize: '18px', fontWeight: '700', border: 'none', boxShadow: 'none' }}
            >
              {boards.map(b => (
                <option value={b.id} key={b.id}>🏢 {b.name}</option>
              ))}
            </select>
            <ChevronDown size={14} className="dropdown-arrow" />
          </div>
        </div>
      </div>

      <div className="header-right">
        {/* Search */}
        <div className="search-bar">
          <Search size={14} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Search account, owner, industry..." 
            className="search-input" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && <X size={14} className="text-gray-400 cursor-pointer" onClick={() => setSearchQuery("")} />}
        </div>

        {/* Sync button */}
        <button 
          className={`btn tooltip ${isSyncing ? 'btn-active' : ''}`} 
          onClick={handleFullSync}
          data-tooltip="Pull latest HubSpot & Supabase changes"
          disabled={isSyncing}
        >
          <RefreshCw size={14} className={isSyncing ? 'spin' : ''} />
          <span>{isSyncing ? "Syncing..." : "Sync Database"}</span>
        </button>

        {/* Hide Filters Button */}
        <button 
          className={`btn ${filtersHidden ? 'btn-active' : ''}`} 
          onClick={() => setFiltersHidden(!filtersHidden)}
        >
          {filtersHidden ? "Show filters" : "Hide filters"}
        </button>

        {/* Currency selector toggle */}
        <div className="select-wrapper">
          <select 
            className="gong-select" 
            value={activeCurrency} 
            onChange={(e) => setActiveCurrency(e.target.value)}
          >
            <option value="USD">USD ($)</option>
            <option value="INR">INR (₹)</option>
            <option value="EUR">EUR (€)</option>
            <option value="AUD">AUD (A$)</option>
            <option value="GBP">GBP (£)</option>
          </select>
          <Globe size={13} className="dropdown-arrow" />
        </div>

        <div className="avatar" onClick={() => triggerToast("Loading user profile context...")}>CM</div>
      </div>
    </header>
  );
}
