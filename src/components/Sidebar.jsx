import React from 'react';
import { 
  Sparkles, User, Phone, MessageSquare, TrendingUp, Briefcase, 
  BookOpen, Clock, Plus, HelpCircle, Settings 
} from 'lucide-react';

export default function Sidebar({
  filteredAccountsCount,
  boards,
  activeBoardId,
  setActiveBoardId,
  handleCreateBoard,
  handleDuplicateBoard,
  handleDeleteBoard,
  triggerToast
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Sparkles size={14} color="white" />
        </div>
        <span className="sidebar-logo-text" style={{ fontSize: '13px', letterSpacing: '0.5px' }}>R-Intelligence</span>
      </div>

      <nav className="sidebar-menu">
        <div className="sidebar-item" onClick={() => triggerToast("Navigating to Home...")}>
          <User size={16} />
          <span>Home</span>
        </div>
        <div className="sidebar-item" onClick={() => triggerToast("Opening Engage playbooks...")}>
          <Phone size={16} />
          <span>Engage</span>
        </div>
        <div className="sidebar-item" onClick={() => triggerToast("Loading Conversations feed...")}>
          <MessageSquare size={16} />
          <span>Conversations</span>
        </div>
        
        {/* Active section */}
        <div className="sidebar-item active">
          <TrendingUp size={16} />
          <span>Revenue</span>
        </div>
        <div className="sidebar-submenu">
          <div className="sidebar-subitem active">
            <span>Accounts</span>
            <span className="metric-count">{filteredAccountsCount}</span>
          </div>
          <div className="sidebar-subitem" onClick={() => triggerToast("Loading deals Pipeline...")}>
            <span>Deals</span>
          </div>
          <div className="sidebar-subitem" onClick={() => triggerToast("Navigating to Forecast projections...")}>
            <span>Forecast</span>
          </div>
          <div className="sidebar-subitem" onClick={() => triggerToast("Loading Revenue Analytics dashboard...")}>
            <span>Analytics</span>
          </div>
        </div>

        <div className="sidebar-item" onClick={() => triggerToast("Opening Coaching dashboard...")}>
          <Briefcase size={16} />
          <span>Coaching</span>
        </div>
        <div className="sidebar-item" onClick={() => triggerToast("Opening Insights analytics...")}>
          <BookOpen size={16} />
          <span>Insights</span>
        </div>
        <div className="sidebar-item" onClick={() => triggerToast("Opening Communications activity feed...")}>
          <Clock size={16} />
          <span>Activity</span>
        </div>
      </nav>

      {/* Board Switcher Admin Tools in Sidebar */}
      <div className="px-4 py-3 border-t border-purple-950 flex flex-col gap-2">
        <span className="text-[10px] uppercase tracking-wider text-purple-400 font-bold">Admin Board Controls</span>
        <div className="flex gap-1" style={{ display: 'flex', gap: '4px' }}>
          <button className="btn btn-primary btn-pill py-1 text-[11px] flex-1" style={{ flex: 1 }} onClick={handleCreateBoard}>
            <Plus size={10} /> Board
          </button>
          <button className="btn btn-pill py-1 text-[11px] flex-1 bg-purple-950 text-white" style={{ flex: 1 }} onClick={handleDuplicateBoard}>
            Duplicate
          </button>
        </div>
        <button className="btn btn-danger-soft btn-pill py-1 text-[11px] w-full" onClick={handleDeleteBoard}>
          Delete Current Board
        </button>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-footer-link" onClick={() => triggerToast("Codename Antigravity - R-Intelligence Revenue Intelligence Dashboard v1.1")}>
          <HelpCircle size={14} />
          <span>About this page</span>
        </div>
        <div className="sidebar-footer-link" onClick={() => triggerToast("Loading system workspace console...")}>
          <Settings size={14} />
          <span>Company settings</span>
        </div>
      </div>
    </aside>
  );
}
