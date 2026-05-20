import React from 'react';
import { Plus, Users, Calendar, Edit, Trash2, X } from 'lucide-react';

export default function FiltersToolbar({
  filtersHidden,
  teamFilter,
  setTeamFilter,
  periodFilter,
  setPeriodFilter,
  filterMenuOpen,
  setFilterMenuOpen,
  addAdvancedFilter,
  advancedFilters,
  removeAdvancedFilter,
  clearAllFilters,
  setAddColumnModalOpen,
  columnPopoverOpen,
  setColumnPopoverOpen,
  visibleColumns,
  setVisibleColumns,
  customColumns,
  setCustomColumns,
  setCustomColumnValues,
  triggerToast
}) {
  return (
    <section className={`toolbar ${filtersHidden ? 'filters-hidden' : ''}`}>
      <div className="toolbar-row">
        <div className="toolbar-left">
          {/* Team dropdown filter */}
          <div className="select-wrapper">
            <select 
              className="gong-select"
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
            >
              <option value="all">Team: All members</option>
              <option value="rep">Sales Representative</option>
              <option value="manager">Sales Manager</option>
              <option value="admin">Admin</option>
            </select>
            <Users size={13} className="dropdown-arrow" />
          </div>

          {/* Period dropdown filter */}
          <div className="select-wrapper">
            <select 
              className="gong-select"
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
            >
              <option value="all">Period: All time</option>
              <option value="last_30">Last 30 days</option>
              <option value="this_month">This month</option>
              <option value="last_quarter">Last quarter</option>
            </select>
            <Calendar size={13} className="dropdown-arrow" />
          </div>

          {/* "+ Add Filter" Custom dropdown */}
          <div className="popover-container">
            <button 
              className={`btn btn-primary ${filterMenuOpen ? 'btn-active' : ''}`}
              onClick={() => setFilterMenuOpen(!filterMenuOpen)}
            >
              <Plus size={14} />
              <span>Add filter</span>
            </button>
            
            {filterMenuOpen && (
              <div className="popover-card" style={{ right: 'auto', left: 0, width: '280px', zIndex: '99' }}>
                <div className="popover-title">Select Filter Criteria</div>
                <div className="popover-list">
                  <div className="text-xs font-bold text-purple-600 mt-1 uppercase">CRM Field Wise</div>
                  <button 
                    className="btn btn-link text-left" 
                    onClick={() => addAdvancedFilter('segment', 'Enterprise', 'Segment: Enterprise')}
                  >
                    🏢 Segment: Enterprise
                  </button>
                  <button 
                    className="btn btn-link text-left" 
                    onClick={() => addAdvancedFilter('segment', 'Mid-Market', 'Segment: Mid-Market')}
                  >
                    🏢 Segment: Mid-Market
                  </button>
                  <button 
                    className="btn btn-link text-left" 
                    onClick={() => addAdvancedFilter('segment', 'SMB', 'Segment: SMB')}
                  >
                    🏢 Segment: SMB
                  </button>
                  
                  <div className="text-xs font-bold text-purple-600 mt-2 uppercase">Account Type Wise (Stage)</div>
                  <button 
                    className="btn btn-link text-left" 
                    onClick={() => addAdvancedFilter('stage', 'Active', 'Stage: Active')}
                  >
                    🟢 Stage: Active
                  </button>
                  <button 
                    className="btn btn-link text-left" 
                    onClick={() => addAdvancedFilter('stage', 'At-Risk', 'Stage: At-Risk')}
                  >
                    🟡 Stage: At-Risk
                  </button>
                  <button 
                    className="btn btn-link text-left" 
                    onClick={() => addAdvancedFilter('stage', 'Churned', 'Stage: Churned')}
                  >
                    🔴 Stage: Churned
                  </button>

                  <div className="text-xs font-bold text-purple-600 mt-2 uppercase">Aggregate Wise</div>
                  <button 
                    className="btn btn-link text-left" 
                    onClick={() => addAdvancedFilter('health_low', '45', 'Health < 45 (At Risk)')}
                  >
                    ❤️ Health &lt; 45
                  </button>
                  <button 
                    className="btn btn-link text-left" 
                    onClick={() => addAdvancedFilter('health_high', '70', 'Health > 70 (Excellent)')}
                  >
                    💚 Health &gt; 70
                  </button>
                  <button 
                    className="btn btn-link text-left" 
                    onClick={() => addAdvancedFilter('arr_100', '100000', 'ARR >= $100k')}
                  >
                    💵 ARR &gt;= $100k
                  </button>
                  <button 
                    className="btn btn-link text-left" 
                    onClick={() => addAdvancedFilter('arr_300', '300000', 'ARR >= $300k')}
                  >
                    💵 ARR &gt;= $300k
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="toolbar-right" style={{ display: 'flex', gap: '8px' }}>
          {/* Add Custom Column Button */}
          <button 
            className="btn btn-primary hover-scale"
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            onClick={() => setAddColumnModalOpen(true)}
          >
            <Plus size={14} />
            <span>Add Column</span>
          </button>

          {/* Columns config edit selector */}
          <div className="popover-container">
            <button 
              className="btn hover-scale"
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              onClick={() => setColumnPopoverOpen(!columnPopoverOpen)}
            >
              <Edit size={14} />
              <span>Edit Columns</span>
            </button>

            {columnPopoverOpen && (
              <div className="popover-card" style={{ zIndex: '99', width: '260px' }}>
                <div className="popover-title">Manage Columns</div>
                <div className="popover-list" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                  <div className="text-xs font-bold text-purple-600 uppercase">Standard Columns</div>
                  <label className="popover-item">
                    <input 
                      type="checkbox" 
                      className="popover-checkbox" 
                      checked={visibleColumns.companyName}
                      onChange={(e) => setVisibleColumns(prev => ({ ...prev, companyName: e.target.checked }))}
                    />
                    <span>Company Name</span>
                  </label>
                  <label className="popover-item">
                    <input 
                      type="checkbox" 
                      className="popover-checkbox" 
                      checked={visibleColumns.arr}
                      onChange={(e) => setVisibleColumns(prev => ({ ...prev, arr: e.target.checked }))}
                    />
                    <span>Exit ARR</span>
                  </label>
                  <label className="popover-item">
                    <input 
                      type="checkbox" 
                      className="popover-checkbox" 
                      checked={visibleColumns.contacts}
                      onChange={(e) => setVisibleColumns(prev => ({ ...prev, contacts: e.target.checked }))}
                    />
                    <span>HubSpot Contacts</span>
                  </label>
                  <label className="popover-item">
                    <input 
                      type="checkbox" 
                      className="popover-checkbox" 
                      checked={visibleColumns.healthScore}
                      onChange={(e) => setVisibleColumns(prev => ({ ...prev, healthScore: e.target.checked }))}
                    />
                    <span>Health Score</span>
                  </label>
                  <label className="popover-item">
                    <input 
                      type="checkbox" 
                      className="popover-checkbox" 
                      checked={visibleColumns.stage}
                      onChange={(e) => setVisibleColumns(prev => ({ ...prev, stage: e.target.checked }))}
                    />
                    <span>Stage</span>
                  </label>
                  <label className="popover-item">
                    <input 
                      type="checkbox" 
                      className="popover-checkbox" 
                      checked={visibleColumns.lastActivity}
                      onChange={(e) => setVisibleColumns(prev => ({ ...prev, lastActivity: e.target.checked }))}
                    />
                    <span>Last Activity</span>
                  </label>
                  <label className="popover-item">
                    <input 
                      type="checkbox" 
                      className="popover-checkbox" 
                      checked={visibleColumns.managerNote}
                      onChange={(e) => setVisibleColumns(prev => ({ ...prev, managerNote: e.target.checked }))}
                    />
                    <span>Manager Notes</span>
                  </label>
                  <label className="popover-item">
                    <input 
                      type="checkbox" 
                      className="popover-checkbox" 
                      checked={visibleColumns.openDeals}
                      onChange={(e) => setVisibleColumns(prev => ({ ...prev, openDeals: e.target.checked }))}
                    />
                    <span>Open Deals</span>
                  </label>
                  <label className="popover-item">
                    <input 
                      type="checkbox" 
                      className="popover-checkbox" 
                      checked={visibleColumns.renewalDate}
                      onChange={(e) => setVisibleColumns(prev => ({ ...prev, renewalDate: e.target.checked }))}
                    />
                    <span>Renewal Date</span>
                  </label>

                  {/* Custom Columns section */}
                  {customColumns.length > 0 && (
                    <>
                      <div className="text-xs font-bold text-purple-600 mt-2 uppercase border-t pt-2" style={{ borderTop: '1px solid var(--gong-border)', paddingTop: '8px', marginTop: '8px' }}>Custom Columns</div>
                      {customColumns.map(col => (
                        <div className="popover-item" key={col.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                          <label className="flex items-center gap-2 cursor-pointer" style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                            <input 
                              type="checkbox" 
                              className="popover-checkbox" 
                              checked={col.visible}
                              onChange={(e) => {
                                setCustomColumns(prev => prev.map(c => c.id === col.id ? { ...c, visible: e.target.checked } : c));
                              }}
                            />
                            <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '120px' }}>{col.name}</span>
                          </label>
                          <button 
                            className="icon-btn text-red-500 hover:text-red-700" 
                            style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0, border: 'none', background: 'transparent', borderRadius: '4px', transition: 'all 0.2s' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              if (confirm(`Delete custom column "${col.name}"? This will delete all user analysis values entered in it.`)) {
                                setCustomColumns(prev => prev.filter(c => c.id !== col.id));
                                setCustomColumnValues(prev => {
                                  const updated = { ...prev };
                                  Object.keys(updated).forEach(accId => {
                                    if (updated[accId]) {
                                      const copy = { ...updated[accId] };
                                      delete copy[col.id];
                                      updated[accId] = copy;
                                    }
                                  });
                                  return updated;
                                });
                                triggerToast(`Deleted custom column "${col.name}"`);
                              }
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Applied Filters Tags */}
      {advancedFilters.length > 0 && (
        <div className="toolbar-tags" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
          {advancedFilters.map((f, i) => (
            <div key={i} className="filter-tag" style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--gong-purple-muted)', color: 'var(--gong-purple-accent)', fontSize: '11px', padding: '3px 8px', borderRadius: '12px' }}>
              <span>{f.label}</span>
              <X 
                size={10} 
                className="cursor-pointer text-purple-600 hover:text-purple-800" 
                onClick={() => removeAdvancedFilter(i)} 
              />
            </div>
          ))}
          <button 
            className="btn btn-link text-[11px] py-0 text-red-500 hover:text-red-700" 
            onClick={clearAllFilters}
          >
            Clear all
          </button>
        </div>
      )}
    </section>
  );
}
