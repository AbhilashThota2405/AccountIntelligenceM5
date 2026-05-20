import React from 'react';
import { 
  X, Sparkles, Building2, Calendar, Users, User, Clock, Mail, 
  Phone, MessageSquare, CheckSquare, BookOpen, Trash2, DollarSign, 
  RefreshCw 
} from 'lucide-react';

export default function AccountDrawer({
  isOpen,
  onClose,
  selectedAccount,
  drawerTab,
  setDrawerTab,
  formatVal,
  generatingBrief,
  handleGenerateBrief,
  handleNoteChange,
  handleAddLongNote,
  triggerToast,
  newTodoTitle,
  setNewTodoTitle,
  newTodoDate,
  setNewTodoDate,
  handleAddTodo,
  handleToggleTodo,
  handleDeleteTodo,
  crmForm,
  setCrmForm,
  handleCrmSave
}) {
  if (!isOpen || !selectedAccount) return null;

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose}></div>
      <div className="drawer">
        {/* Drawer Premium Profile Banner */}
        <div className="drawer-profile-banner">
          <div className="drawer-banner-top">
            <div className="drawer-banner-left">
              <div className="drawer-company-badge">
                {selectedAccount.name ? selectedAccount.name.charAt(0) : "A"}
              </div>
              <div>
                <h2 className="drawer-company-name">{selectedAccount.name}</h2>
                <div className="drawer-meta-badges">
                  <span className="meta-badge connected">🟢 Sync: HubSpot Connected</span>
                  <span className="meta-badge">🌎 {selectedAccount.region}</span>
                  <span className="meta-badge">💼 {selectedAccount.industry}</span>
                </div>
              </div>
            </div>

            <div className="drawer-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {/* R-Intelligence AI search bar placeholder */}
              <div className="r-intelligence-search-bar">
                <Sparkles size={16} className="text-indigo-400 animate-pulse" />
                <input 
                  type="text" 
                  placeholder="Ask R Intelligence AI assistant anything..." 
                  disabled
                  style={{ cursor: 'not-allowed' }}
                />
                <div 
                  className="flex items-center gap-0.5 text-[9px] bg-white/10 px-1.5 py-0.5 rounded border border-white/10 text-white/40 font-mono"
                  style={{ userSelect: 'none', display: 'flex', gap: '2px' }}
                >
                  <span>⌘</span><span>K</span>
                </div>
              </div>

              {/* Close Button */}
              <button 
                className="drawer-close-btn-red" 
                onClick={onClose}
              >
                <X size={16} strokeWidth={3} />
              </button>
            </div>
          </div>

          {/* Banner Metrics Dashboard */}
          <div className="drawer-banner-metrics">
            <div className="banner-metric-item">
              <span className="banner-metric-label">Contract Value (ARR)</span>
              <span className="banner-metric-value">{formatVal(selectedAccount.arr)}</span>
            </div>
            <div className="banner-metric-item">
              <span className="banner-metric-label">Health Score</span>
              <span className="banner-metric-health" style={{
                color: selectedAccount.health_score >= 70 ? 'var(--color-green)' :
                       selectedAccount.health_score >= 45 ? 'var(--color-yellow)' : 'var(--color-red)'
              }}>
                ● {selectedAccount.health_score}/100
              </span>
            </div>
            <div className="banner-metric-item">
              <span className="banner-metric-label">Active Deal Pipeline</span>
              <span className="banner-metric-value">{formatVal(selectedAccount.open_deals_value)}</span>
            </div>
          </div>
        </div>

        {/* Drawer Tabs switchers */}
        <div className="drawer-tabs">
          <span 
            className={`drawer-tab ${drawerTab === "overview" ? "active" : ""}`}
            onClick={() => setDrawerTab("overview")}
          >
            Overview
          </span>
          <span 
            className={`drawer-tab ${drawerTab === "activity" ? "active" : ""}`}
            onClick={() => setDrawerTab("activity")}
          >
            Activity Timeline
          </span>
          <span 
            className={`drawer-tab ${drawerTab === "briefs" ? "active" : ""}`}
            onClick={() => setDrawerTab("briefs")}
          >
            AI Insights
          </span>
          <span 
            className={`drawer-tab ${drawerTab === "todos" ? "active" : ""}`}
            onClick={() => setDrawerTab("todos")}
          >
            To-dos ({selectedAccount.todos ? selectedAccount.todos.filter(t => !t.is_done).length : 0})
          </span>
          <span 
            className={`drawer-tab ${drawerTab === "notes" ? "active" : ""}`}
            onClick={() => setDrawerTab("notes")}
          >
            Notes
          </span>
          <span 
            className={`drawer-tab ${drawerTab === "crm" ? "active" : ""}`}
            onClick={() => setDrawerTab("crm")}
          >
            CRM Sync
          </span>
        </div>

        {/* Drawer Body container */}
        <div className="drawer-body">
          
          {/* TAB 1: OVERVIEW */}
          {drawerTab === "overview" && (
            <div className="overview-dashboard-grid">
              
              {/* Financial & Cycle Scorecard */}
              <div className="drawer-section">
                <div className="overview-card-header">
                  <div className="overview-card-title">
                    <Building2 size={14} className="text-purple-600" />
                    Account Life Cycle & Cycles
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase">CRM Sync Properties</span>
                </div>

                <div className="premium-metric-grid">
                  <div className="premium-metric-card">
                    <div className="premium-metric-icon"><Calendar size={16} /></div>
                    <div className="premium-metric-details">
                      <span className="data-label">Renewal Date</span>
                      <span className="data-value">
                        {selectedAccount.renewal_date ? new Date(selectedAccount.renewal_date).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        }) : 'Unscheduled'}
                      </span>
                    </div>
                  </div>

                  <div className="premium-metric-card">
                    <div className="premium-metric-icon"><Users size={16} /></div>
                    <div className="premium-metric-details">
                      <span className="data-label">Next QBR Cycle</span>
                      <span className="data-value">
                        {selectedAccount.next_qbr_date ? new Date(selectedAccount.next_qbr_date).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        }) : 'Unscheduled'}
                      </span>
                    </div>
                  </div>

                  <div className="premium-metric-card">
                    <div className="premium-metric-icon"><User size={16} /></div>
                    <div className="premium-metric-details">
                      <span className="data-label">Account CSM Owner</span>
                      <span className="data-value">{selectedAccount.owner_name}</span>
                    </div>
                  </div>

                  <div className="premium-metric-card">
                    <div className="premium-metric-icon"><Clock size={16} /></div>
                    <div className="premium-metric-details">
                      <span className="data-label">Account Phase</span>
                      <span className="data-value flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{
                          backgroundColor: selectedAccount.stage === 'Active' ? 'var(--color-green)' :
                                           selectedAccount.stage === 'At-Risk' ? 'var(--color-yellow)' : 'var(--color-red)'
                        }}></span>
                        {selectedAccount.stage}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Primary Stakeholders Sync from HubSpot */}
              <div className="drawer-section">
                <div className="overview-card-header">
                  <div className="overview-card-title">
                    <Users size={14} className="text-purple-600" />
                    HubSpot Synced Contacts
                  </div>
                  <span className="text-[10px] text-purple-700 font-bold uppercase">{selectedAccount.contacts?.length || 0} associated</span>
                </div>

                <div className="contacts-list">
                  {selectedAccount.contacts && selectedAccount.contacts.length > 0 ? (
                    selectedAccount.contacts.map((contact, idx) => (
                      <div className="contact-card" key={contact.id || idx}>
                        <div className="contact-info-block">
                          <div className="contact-avatar">
                            {contact.name ? contact.name.split(' ').map(n=>n[0]).join('') : "K"}
                          </div>
                          <div className="contact-details">
                            <div className="contact-name-row">
                              <span className="contact-name">{contact.name}</span>
                              {contact.is_primary && <span className="contact-badge">⭐ Sponsor</span>}
                            </div>
                            <span className="contact-title">{contact.title || 'Key Stakeholder'}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <a href={`mailto:${contact.email}`} className="contact-email">
                            <Mail size={11} /> {contact.email}
                          </a>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-xs italic p-2 text-center bg-gray-50 rounded">
                      No associated HubSpot contacts found for this company record.
                    </div>
                  )}
                </div>
              </div>

              {/* Open Opportunities Sync from HubSpot */}
              <div className="drawer-section">
                <div className="overview-card-header">
                  <div className="overview-card-title">
                    <DollarSign size={14} className="text-purple-600" />
                    CRM Open Opportunities
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold uppercase">{selectedAccount.deals?.length || 0} Deals</span>
                </div>

                <div className="opportunities-list">
                  {selectedAccount.deals && selectedAccount.deals.length > 0 ? (
                    selectedAccount.deals.map((deal, idx) => (
                      <div className="opportunity-card" key={deal.id || idx}>
                        <div className="opportunity-details">
                          <span className="opportunity-name">{deal.name}</span>
                          <span className="opportunity-sub">
                            Stage: <b className="text-purple-900">{deal.stage}</b> | Close: {deal.close_date ? new Date(deal.close_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Pending'}
                          </span>
                        </div>
                        <span className="opportunity-value">
                          {formatVal(deal.value)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-xs italic p-2 text-center bg-gray-50 rounded">
                      No open revenue opportunities currently mapped for this account.
                    </div>
                  )}
                </div>
              </div>

              {/* AI Insights Copilot & Revenue Assistance Suite */}
              <div className="ai-assistant-card flex flex-col gap-3" style={{ marginTop: '16px', display: 'flex', flexDirection: 'column' }}>
                <div className="flex items-center justify-between border-b pb-2 mb-1" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--gong-border)', paddingBottom: '8px' }}>
                  <div className="flex items-center gap-2 font-bold text-xs text-slate-800 uppercase tracking-wider" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '11px' }}>
                    <Sparkles size={14} className="text-blue-600 animate-pulse" />
                    AI Insights Copilot
                  </div>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full" style={{ fontSize: '10px', backgroundColor: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '12px' }}>ACTIVE</span>
                </div>

                <div className="flex flex-col gap-2" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div className="text-xs font-semibold text-slate-700" style={{ fontSize: '12px', fontWeight: '600', color: 'var(--gong-text-dark)' }}>💡 AI Insights Strategic Recommendations</div>
                  <div className="bg-white border border-slate-100 rounded-lg p-3 text-xs text-slate-600 leading-relaxed shadow-sm" style={{ backgroundColor: '#ffffff', border: '1px solid var(--gong-border)', borderRadius: '8px', padding: '12px', fontSize: '11px', lineHeight: '1.5', color: 'var(--gong-text-muted)' }}>
                    • <b>Sponsor Attrition Risk</b>: Outbound platform logins are stable. Recommend initiating the <i>CSM Executive Alignment playbook</i> to secure contract renewal.
                    <br/>
                    • <b>Outbound Action Play</b>: Next QBR is scheduled on {selectedAccount.next_qbr_date || 'Pending'}. Draft a strategic alignment email using the copilot below.
                  </div>
                </div>

                <div className="flex flex-col gap-1.5" style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider" style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '700', color: 'var(--gong-text-muted)' }}>AI Assistant Quick Tasks</div>
                  <div className="flex flex-wrap gap-1.5" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <button className="btn text-xs py-1 px-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md text-slate-700 transition" style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '6px' }} onClick={() => triggerToast("Drafting strategic QBR alignment email draft...")}>
                      Draft QBR Email
                    </button>
                    <button className="btn text-xs py-1 px-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md text-slate-700 transition" style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '6px' }} onClick={() => triggerToast("Scanning outbound call transcript risks...")}>
                      Analyze Call Risks
                    </button>
                    <button className="btn text-xs py-1 px-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md text-slate-700 transition" style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '6px' }} onClick={() => triggerToast("Simulating active renewals sentiment analysis...")}>
                      Predict Sentiment
                    </button>
                  </div>
                </div>

                <div className="border-t pt-3 mt-1 flex flex-col gap-2" style={{ borderTop: '1px solid var(--gong-border)', paddingTop: '12px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="text-xs text-slate-600" style={{ fontSize: '11px', color: 'var(--gong-text-muted)' }}>
                    Compile a structured C-level executive summary utilizing Groq Llama-3 Analysis:
                  </div>
                  <button 
                    className="btn btn-primary w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold"
                    style={{ backgroundColor: 'var(--gong-purple-accent)', borderColor: 'var(--gong-purple-accent)', display: 'flex', width: '100%', alignItems: 'center', justifycontent: 'center', gap: '6px', padding: '8px 12px' }}
                    onClick={handleGenerateBrief}
                    disabled={generatingBrief}
                  >
                    {generatingBrief ? (
                      <>
                        <span className="spinner"></span>
                        <span>Generating AI Brief...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={13} />
                        <span>Generate C-Level Brief</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACTIVITY TIMELINE */}
          {drawerTab === "activity" && (
            <div className="flex flex-col gap-4">
              <div className="drawer-section">
                <div className="section-title">
                  <Clock size={14} className="text-purple-600" />
                  COMMUNICATION TIMELINE (LAST 21 DAYS)
                </div>

                {(!selectedAccount.activities || selectedAccount.activities.length === 0) ? (
                  <div className="text-gray-500 text-sm italic">No recent log records. System was synced {selectedAccount.last_activity_days} days ago.</div>
                ) : (
                  <div className="timeline">
                    {selectedAccount.activities.map(act => {
                      const lowerType = (act.type || "").toLowerCase();
                      let IconComp = Clock;
                      let dotColor = "var(--act-other)";
                      let typeLabel = `⚡ Event: ${act.type || 'Activity'}`;

                      if (lowerType.includes("call")) {
                        IconComp = Phone;
                        dotColor = "var(--act-call)";
                        typeLabel = "📞 Phone Call";
                      } else if (lowerType.includes("mail") || lowerType.includes("email")) {
                        IconComp = Mail;
                        dotColor = "var(--gong-purple-accent)";
                        typeLabel = "✉️ Outbound Email";
                      } else if (lowerType.includes("meet") || lowerType.includes("person") || lowerType.includes("qbr")) {
                        IconComp = Users;
                        dotColor = "var(--color-yellow)";
                        typeLabel = "🤝 QBR Meeting";
                      } else if (lowerType.includes("chat") || lowerType.includes("message") || lowerType.includes("slack")) {
                        IconComp = MessageSquare;
                        dotColor = "var(--color-green)";
                        typeLabel = "💬 Slack / Chat Message";
                      } else if (lowerType.includes("task") || lowerType.includes("todo") || lowerType.includes("checklist")) {
                        IconComp = CheckSquare;
                        dotColor = "var(--color-blue)";
                        typeLabel = "☑️ CSM Action Item";
                      } else if (lowerType.includes("brief") || lowerType.includes("doc") || lowerType.includes("proposal")) {
                        IconComp = BookOpen;
                        dotColor = "var(--act-your)";
                        typeLabel = "📖 AI Brief Document";
                      }

                      return (
                        <div className="timeline-item" key={act.id} style={{ minHeight: '64px', marginBottom: '8px' }}>
                          <span className="timeline-dot" style={{ backgroundColor: dotColor }}>
                            <IconComp size={10} color="white" />
                          </span>
                          <div className="timeline-header">
                            <span className="timeline-type" style={{ fontWeight: '700' }}>
                              {typeLabel}
                            </span>
                            <span className="timeline-date">{act.date}</span>
                          </div>
                          <div className="timeline-desc" style={{ marginTop: '4px' }}>
                            {act.description}
                            <div className="text-[10px] text-gray-400 mt-1">Logged by: {act.created_by}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: AI BRIEFS */}
          {drawerTab === "briefs" && (
            <div className="flex flex-col gap-4">
              <div className="drawer-section">
                <div className="brief-header-row">
                  <div className="section-title mb-0">
                    <Sparkles size={14} className="text-purple-600" />
                    AI INSIGHTS EXECUTIVE BRIEF
                  </div>
                  <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">Groq AI Engine</span>
                </div>

                <div className="brief-content bg-purple-50 p-4 rounded-lg border border-purple-100 text-gray-800">
                  <div className="font-semibold text-purple-950 mb-2 flex items-center gap-2">
                    <BookOpen size={14} />
                    Relationship Status & Risk Analysis
                  </div>
                  <p className="mb-4 leading-relaxed">{selectedAccount.brief}</p>
                  
                  <div className="border-t border-purple-200 pt-3">
                    <div className="font-semibold text-purple-950 mb-2">Recommended CSM Next Steps:</div>
                    <ul className="text-xs flex flex-col gap-1">
                      <li className="brief-bullet">Double-check if HubSpot owner details match the incoming sync file.</li>
                      <li className="brief-bullet">Schedule custom stakeholder product onboarding training before renewal cutoff.</li>
                      <li className="brief-bullet">Align current open deal metrics with manager comments.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TO-DOS */}
          {drawerTab === "todos" && (
            <div className="flex flex-col gap-4">
              <div className="drawer-section">
                <div className="section-title">
                  <CheckSquare size={14} className="text-purple-600" />
                  Account Action checklist
                </div>

                <div className="todo-list">
                  {(!selectedAccount.todos || selectedAccount.todos.length === 0) ? (
                    <div className="text-gray-500 text-xs italic">No actions set for this account. Add a task below.</div>
                  ) : (
                    selectedAccount.todos.map(todo => (
                      <div className="todo-item" key={todo.id}>
                        <div className="todo-left">
                          <input 
                            type="checkbox" 
                            className="todo-checkbox" 
                            checked={todo.is_done}
                            onChange={() => handleToggleTodo(todo.id)}
                          />
                          <span className={`todo-text ${todo.is_done ? 'done' : ''}`}>
                            {todo.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="todo-due">Due: {todo.due_date}</span>
                          <button 
                            className="icon-btn hover:text-red-500 p-1"
                            style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                            onClick={() => handleDeleteTodo(todo.id)}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add action task form */}
                <div className="todo-add-form border-t border-gray-100 pt-4 mt-4">
                  <div className="flex flex-col gap-2 w-full">
                    <span className="text-xs font-semibold text-gray-500">Create new action:</span>
                    <div className="flex gap-2" style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="text" 
                        className="crm-input flex-1" 
                        style={{ flex: 1 }}
                        placeholder="Add new high-priority to-do..."
                        value={newTodoTitle}
                        onChange={(e) => setNewTodoTitle(e.target.value)}
                      />
                      <input 
                        type="date" 
                        className="crm-input"
                        value={newTodoDate}
                        onChange={(e) => setNewTodoDate(e.target.value)}
                      />
                      <button className="btn btn-primary" onClick={handleAddTodo}>
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MANAGER NOTES */}
          {drawerTab === "notes" && (
            <div className="flex flex-col gap-4">
              <div className="drawer-section">
                <div className="section-title">
                  <BookOpen size={14} className="text-purple-600" />
                  Long-form Account Notes
                </div>

                <div className="flex flex-col gap-3">
                  <textarea 
                    className="notes-textarea w-full"
                    placeholder="Type high-level notes or feedback here..."
                    value={selectedAccount.manager_note || ""}
                    onChange={(e) => handleNoteChange(selectedAccount.id, e.target.value)}
                  />
                  
                  <div className="flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="text-[10px] text-gray-400 font-semibold uppercase">⚡ Autosaves in background</span>
                    <button 
                      className="btn btn-primary"
                      style={{ backgroundColor: 'var(--gong-purple-accent)', borderColor: 'var(--gong-purple-accent)' }}
                      onClick={() => {
                        if (selectedAccount.manager_note?.trim()) {
                          handleAddLongNote(selectedAccount.manager_note);
                        } else {
                          triggerToast("Please write a note before updating!");
                        }
                      }}
                    >
                      Archive Current Note
                    </button>
                  </div>
                </div>

                {/* History notes logs */}
                {selectedAccount.notes && selectedAccount.notes.length > 0 && (
                  <div className="border-t border-gray-100 pt-4 mt-4">
                    <span className="text-xs font-semibold text-gray-500 block mb-2">Notes Archive:</span>
                    <div className="flex flex-col gap-3" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {selectedAccount.notes.map(n => (
                        <div className="bg-gray-50 p-3 rounded border border-gray-200 text-xs" key={n.id}>
                          <p className="text-gray-800 mb-1">{n.content}</p>
                          <div className="text-[10px] text-gray-400 text-right">By {n.created_by} on {n.created_at}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: CRM SYNC */}
          {drawerTab === "crm" && crmForm && (
            <div className="flex flex-col gap-4">
              <div className="drawer-section">
                <div className="section-title">
                  <RefreshCw size={14} className="text-purple-600" />
                  EDIT WORKSPACE & HUBSPOT CRM FIELDS
                </div>

                <div className="crm-fields-grid">
                  <div className="crm-field">
                    <label className="data-label">Company Name</label>
                    <input 
                      type="text" 
                      className="crm-input" 
                      value={crmForm.name}
                      onChange={(e) => setCrmForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div className="crm-field">
                    <label className="data-label">Exit ARR (Contract Value)</label>
                    <input 
                      type="number" 
                      className="crm-input" 
                      value={crmForm.arr}
                      onChange={(e) => setCrmForm(prev => ({ ...prev, arr: Number(e.target.value) }))}
                    />
                  </div>

                  <div className="crm-field">
                    <label className="data-label">HubSpot Health Score</label>
                    <input 
                      type="number" 
                      className="crm-input" 
                      value={crmForm.health_score}
                      onChange={(e) => setCrmForm(prev => ({ ...prev, health_score: Number(e.target.value) }))}
                    />
                  </div>

                  <div className="crm-field">
                    <label className="data-label">Region</label>
                    <input 
                      type="text" 
                      className="crm-input" 
                      value={crmForm.region}
                      onChange={(e) => setCrmForm(prev => ({ ...prev, region: e.target.value }))}
                    />
                  </div>

                  <div className="crm-field">
                    <label className="data-label">CSM Account Phase / Stage</label>
                    <select 
                      className="crm-input" 
                      value={crmForm.stage}
                      onChange={(e) => setCrmForm(prev => ({ ...prev, stage: e.target.value }))}
                    >
                      <option value="Active">🟢 Stage: Active</option>
                      <option value="At-Risk">🟡 Stage: At-Risk</option>
                      <option value="Churned">🔴 Stage: Churned</option>
                    </select>
                  </div>

                  <div className="crm-field">
                    <label className="data-label">Industry Classification</label>
                    <input 
                      type="text" 
                      className="crm-input" 
                      value={crmForm.industry}
                      onChange={(e) => setCrmForm(prev => ({ ...prev, industry: e.target.value }))}
                    />
                  </div>

                  <div className="crm-field">
                    <label className="data-label">Renewal Date</label>
                    <input 
                      type="date" 
                      className="crm-input" 
                      value={crmForm.renewal_date}
                      onChange={(e) => setCrmForm(prev => ({ ...prev, renewal_date: e.target.value }))}
                    />
                  </div>

                  <div className="crm-field">
                    <label className="data-label">Next QBR Date</label>
                    <input 
                      type="date" 
                      className="crm-input" 
                      value={crmForm.next_qbr_date}
                      onChange={(e) => setCrmForm(prev => ({ ...prev, next_qbr_date: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mt-6 flex justify-end gap-2" style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', borderTop: '1px solid var(--gong-border)', paddingTop: '12px' }}>
                  <button className="btn" onClick={onClose}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleCrmSave}>
                    Save & Write-back to CRM
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
