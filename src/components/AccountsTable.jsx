import React from 'react';
import { 
  AlertCircle, Phone, Mail, Users, MessageSquare, CheckSquare, 
  BookOpen, Clock, FileText, ChevronDown 
} from 'lucide-react';

export default function AccountsTable({
  sortedAccounts,
  visibleColumns,
  customColumns,
  customColumnValues,
  setCustomColumnValues,
  handleSort,
  sortField,
  sortAsc,
  formatVal,
  activeCurrency,
  handleOpenNoteModal,
  setSelectedAccountId,
  setDrawerOpen,
  clearAllFilters,
  viewedARR,
  viewedDeals,
  viewedDealsCount
}) {

  const getFallbackActivities = (acc) => {
    const hash = acc.id ? acc.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) : acc.name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const pool = [
      { type: 'call', color: 'var(--act-call)', icon: Phone, tooltip: 'Outbound Call completed' },
      { type: 'email', color: 'var(--gong-purple-accent)', icon: Mail, tooltip: 'Outbound Email sent' },
      { type: 'meeting', color: 'var(--color-yellow)', icon: Users, tooltip: 'QBR Meeting completed' },
      { type: 'chat', color: 'var(--color-green)', icon: MessageSquare, tooltip: 'Sponsor chat message sent' },
      { type: 'task', color: 'var(--color-blue)', icon: CheckSquare, tooltip: 'Action item completed' },
      { type: 'brief', color: 'var(--act-your)', icon: BookOpen, tooltip: 'AI Business Brief updated' },
      { type: 'system', color: 'var(--act-other)', icon: Clock, tooltip: 'Platform heartbeat checked' }
    ];
    
    const count = 3 + (hash % 3); // 3 to 5
    const selected = [];
    for (let i = 0; i < count; i++) {
      const item = pool[(hash + i * 2) % pool.length];
      selected.push({
        id: `fallback-${i}-${hash}`,
        ...item
      });
    }
    return selected;
  };

  return (
    <div className="gong-table-container">
      {sortedAccounts.length === 0 ? (
        <div className="empty-state">
          <AlertCircle size={48} className="empty-state-icon" />
          <h3 className="empty-state-title">No Accounts Found</h3>
          <p className="empty-state-desc">Try resetting your filters or search query to find more accounts.</p>
          <button className="btn btn-primary mt-4" onClick={clearAllFilters}>Reset Filters</button>
        </div>
      ) : (
        <table className="gong-table">
          <thead>
            <tr>
              {visibleColumns.companyName && (
                <th className="sortable" onClick={() => handleSort('name')}>
                  Company Name {sortField === 'name' ? (sortAsc ? '↑' : '↓') : ''}
                </th>
              )}
              {visibleColumns.arr && (
                <th className="sortable" onClick={() => handleSort('arr')}>
                  Exit ARR (Revenue) {sortField === 'arr' ? (sortAsc ? '↑' : '↓') : ''}
                </th>
              )}
              {visibleColumns.contacts && (
                <th className="sortable text-center" onClick={() => handleSort('contacts_count')}>
                  Contacts {sortField === 'contacts_count' ? (sortAsc ? '↑' : '↓') : ''}
                </th>
              )}
              {visibleColumns.activity && <th>Recent Activity</th>}
              {visibleColumns.lastActivity && (
                <th className="sortable" onClick={() => handleSort('last_activity_days')}>
                  Last Activity {sortField === 'last_activity_days' ? (sortAsc ? '↑' : '↓') : ''}
                </th>
              )}
              {visibleColumns.managerNote && <th>Manager Notes</th>}
              {visibleColumns.openDeals && (
                <th className="sortable" onClick={() => handleSort('open_deals_value')}>
                  Open Deals {sortField === 'open_deals_value' ? (sortAsc ? '↑' : '↓') : ''}
                </th>
              )}
              {visibleColumns.renewalDate && (
                <th className="sortable" onClick={() => handleSort('renewal_date')}>
                  Renewal Date {sortField === 'renewal_date' ? (sortAsc ? '↑' : '↓') : ''}
                </th>
              )}
              {/* Render Custom Columns Headers */}
              {customColumns.filter(c => c.visible).map(col => (
                <th key={col.id} style={{ minWidth: '150px' }}>
                  <div className="flex items-center gap-1" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>{col.name}</span>
                    <span className="text-[9px] bg-blue-100 text-blue-800 font-semibold px-1 py-0.5 rounded" style={{ backgroundColor: '#dbeafe', color: '#1e40af', padding: '1px 4px', borderRadius: '4px', textTransform: 'none', letterSpacing: '0' }}>Local</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Totals Row */}
            <tr className="totals-row">
              {visibleColumns.companyName && <td>Totals</td>}
              {visibleColumns.arr && <td className="cell-arr">{formatVal(viewedARR)}</td>}
              {visibleColumns.contacts && <td className="text-center">-</td>}
              {visibleColumns.activity && <td>-</td>}
              {visibleColumns.lastActivity && <td>-</td>}
              {visibleColumns.managerNote && <td>-</td>}
              {visibleColumns.openDeals && <td className="cell-arr">{formatVal(viewedDeals)} ({viewedDealsCount})</td>}
              {visibleColumns.renewalDate && <td>-</td>}
              {/* Render Custom Columns Totals */}
              {customColumns.filter(c => c.visible).map(col => (
                <td key={col.id} className="text-center">-</td>
              ))}
            </tr>

            {/* Account Rows */}
            {sortedAccounts.map((account) => {
              // Calculate engagement level color dot
              let dotColor = "var(--color-green)";
              if (account.last_activity_days > 30) dotColor = "var(--color-red)";
              else if (account.last_activity_days > 7) dotColor = "var(--color-yellow)";

              return (
                <tr key={account.id}>
                  {/* Company Name */}
                  {visibleColumns.companyName && (
                    <td 
                      className="cell-company"
                      onClick={() => {
                        setSelectedAccountId(account.id);
                        setDrawerOpen(true);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor }}></span>
                        {account.name}
                      </div>
                    </td>
                  )}

                  {/* ARR (Revenue) */}
                  {visibleColumns.arr && (
                    <td className="cell-arr">
                      {formatVal(account.arr)}
                    </td>
                  )}

                  {/* Contacts */}
                  {visibleColumns.contacts && (
                    <td className="cell-contacts">
                      {account.contacts_count}
                    </td>
                  )}

                  {/* Activity Spark Timeline */}
                  {visibleColumns.activity && (
                    <td>
                      <div className="activity-spark-container">
                        <div className="activity-spark-line"></div>
                        <div className="activity-spark-dots">
                          {account.activities && account.activities.length > 0 ? (
                            account.activities.slice(0, 6).map((act, index) => {
                              const lowerType = (act.type || "").toLowerCase();
                              const isCall = lowerType.includes("call");
                              const isMail = lowerType.includes("mail") || lowerType.includes("email");
                              const isMeet = lowerType.includes("meet") || lowerType.includes("person") || lowerType.includes("meeting") || lowerType.includes("qbr");
                              const isChat = lowerType.includes("chat") || lowerType.includes("message") || lowerType.includes("slack") || lowerType.includes("comment");
                              const isTask = lowerType.includes("task") || lowerType.includes("todo") || lowerType.includes("action");
                              const isDoc = lowerType.includes("document") || lowerType.includes("note") || lowerType.includes("brief") || lowerType.includes("file");
                              
                              const isHighEngagement = account.health_score >= 80;
                              
                              let dotColor = "var(--act-other)";
                              let Icon = Clock;
                              
                              if (isCall) { dotColor = "var(--act-call)"; Icon = Phone; }
                              else if (isMail) { dotColor = "var(--gong-purple-accent)"; Icon = Mail; }
                              else if (isMeet) { dotColor = "var(--color-yellow)"; Icon = Users; }
                              else if (isChat) { dotColor = "var(--color-green)"; Icon = MessageSquare; }
                              else if (isTask) { dotColor = "var(--color-blue)"; Icon = CheckSquare; }
                              else if (isDoc) { dotColor = "var(--act-your)"; Icon = BookOpen; }
                              
                              return (
                                <div 
                                  key={act.id || index}
                                  className="activity-dot tooltip" 
                                  style={{
                                    backgroundColor: dotColor,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    width: isCall && isHighEngagement ? '18px' : '12px',
                                    height: isCall && isHighEngagement ? '18px' : '12px',
                                    borderRadius: '50%',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: isCall && isHighEngagement ? '0 0 12px rgba(244, 63, 94, 0.8)' : 'none',
                                    transform: isCall && isHighEngagement ? 'scale(1.4)' : 'scale(1)',
                                    border: '1.5px solid white',
                                    zIndex: isCall && isHighEngagement ? 5 : 1
                                  }} 
                                  data-tooltip={`${act.date || 'Recent'} (${act.type}): ${act.description}`}
                                >
                                  <Icon size={isCall && isHighEngagement ? 8 : 6} color="white" />
                                </div>
                              );
                            })
                          ) : (
                            getFallbackActivities(account).map((item) => (
                              <div 
                                key={item.id}
                                className="activity-dot tooltip"
                                style={{
                                  backgroundColor: item.color,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  width: '12px',
                                  height: '12px',
                                  borderRadius: '50%',
                                  border: '1.5px solid white',
                                  zIndex: 1,
                                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                }}
                                data-tooltip={item.tooltip}
                              >
                                <item.icon size={6} color="white" />
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </td>
                  )}

                  {/* Last Activity */}
                  {visibleColumns.lastActivity && (
                    <td>
                      {account.last_activity_days === 0 ? "Today" :
                       account.last_activity_days === 1 ? "Yesterday" : 
                       `${account.last_activity_days} days ago`}
                    </td>
                  )}

                  {/* Manager Notes */}
                  {visibleColumns.managerNote && (
                    <td 
                      style={{ minWidth: '180px', cursor: 'pointer' }}
                      onClick={() => handleOpenNoteModal(account.id, account.manager_note)}
                    >
                      <div className="flex items-center justify-between gap-2 p-1.5 rounded hover:bg-slate-50 transition border border-transparent hover:border-slate-200">
                        <span className="text-xs text-slate-700 truncate block max-w-[150px]">
                          {account.manager_note ? account.manager_note : (
                            <span className="text-slate-400 italic">Click to add notes...</span>
                          )}
                        </span>
                        <FileText size={12} className="text-slate-400 shrink-0" />
                      </div>
                    </td>
                  )}

                  {/* Open Deals */}
                  {visibleColumns.openDeals && (
                    <td className="cell-arr">
                      {formatVal(account.open_deals_value)} ({account.open_deals_count})
                    </td>
                  )}

                  {/* Renewal Date */}
                  {visibleColumns.renewalDate && (
                    <td className="text-gray-500">
                      {new Date(account.renewal_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                  )}

                  {/* Render Custom Columns Cells */}
                  {customColumns.filter(c => c.visible).map(col => {
                    const val = (customColumnValues[account.id] && customColumnValues[account.id][col.id]) !== undefined
                      ? customColumnValues[account.id][col.id]
                      : "";
                    
                    return (
                      <td key={col.id} style={{ minWidth: '150px' }}>
                        {col.type === 'checkbox' ? (
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <input 
                              type="checkbox"
                              className="popover-checkbox"
                              style={{ margin: 0, cursor: 'pointer', width: '16px', height: '16px' }}
                              checked={val === true || val === "true"}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setCustomColumnValues(prev => ({
                                  ...prev,
                                  [account.id]: {
                                    ...(prev[account.id] || {}),
                                    [col.id]: checked
                                  }
                                }));
                              }}
                            />
                          </div>
                        ) : col.type === 'number' ? (
                          <input 
                            type="number"
                            className="manager-note-input"
                            style={{ textAlign: 'right' }}
                            value={val}
                            placeholder="0.00"
                            onChange={(e) => {
                              const num = e.target.value;
                              setCustomColumnValues(prev => ({
                                ...prev,
                                  [account.id]: {
                                    ...(prev[account.id] || {}),
                                    [col.id]: num
                                  }
                              }));
                            }}
                          />
                        ) : col.type === 'select' ? (
                          <div className="select-wrapper" style={{ margin: 0, width: '100%' }}>
                            <select 
                              className="gong-select"
                              style={{ padding: '4px 20px 4px 8px', fontSize: '11px', height: '26px', margin: 0, width: '100%', borderRadius: '4px' }}
                              value={val}
                              onChange={(e) => {
                                const selectedVal = e.target.value;
                                setCustomColumnValues(prev => ({
                                  ...prev,
                                  [account.id]: {
                                    ...(prev[account.id] || {}),
                                    [col.id]: selectedVal
                                  }
                                }));
                              }}
                            >
                              <option value="">Select...</option>
                              {(col.options || []).map((opt, idx) => (
                                <option key={idx} value={opt}>{opt}</option>
                              ))}
                            </select>
                            <ChevronDown size={10} className="dropdown-arrow" style={{ right: '8px' }} />
                          </div>
                        ) : (
                          <input 
                            type="text"
                            className="manager-note-input"
                            value={val}
                            placeholder="Type notes..."
                            onChange={(e) => {
                              const text = e.target.value;
                              setCustomColumnValues(prev => ({
                                ...prev,
                                [account.id]: {
                                  ...(prev[account.id] || {}),
                                  [col.id]: text
                                }
                              }));
                            }}
                          />
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
