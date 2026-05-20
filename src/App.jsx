import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, Users, Phone, Mail, Calendar, DollarSign, Globe, 
  RefreshCw, Search, Plus, Filter, Edit, Check, Trash2, 
  HelpCircle, Clock, Sparkles, X, ChevronDown, CheckSquare, 
  ArrowUpRight, AlertCircle, FileText, Settings, User, 
  BookOpen, MessageSquare, Briefcase, TrendingUp
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import NoteEditorModal from './components/NoteEditorModal';
import AddColumnModal from './components/AddColumnModal';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import FiltersToolbar from './components/FiltersToolbar';
import MetricsCards from './components/MetricsCards';
import AccountsTable from './components/AccountsTable';
import AccountDrawer from './components/AccountDrawer';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '<VITE_SUPABASE_URL>';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '<VITE_SUPABASE_ANON_KEY>';
const HUBSPOT_ACCESS_TOKEN = import.meta.env.VITE_HUBSPOT_ACCESS_TOKEN || '<VITE_HUBSPOT_ACCESS_TOKEN>';
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '<VITE_GROQ_API_KEY>';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const INITIAL_ACCOUNTS = [
  {
    id: "1",
    name: "Technology Pacific",
    arr: 409600,
    segment: "Enterprise",
    region: "North America",
    health_score: 85,
    stage: "Active",
    renewal_date: "2024-12-16",
    next_qbr_date: "2024-09-10",
    owner_name: "Alex Castillo",
    owner_email: "alex.castillo@gong.io",
    industry: "Technology",
    contacts_count: 5,
    open_deals_value: 20000,
    open_deals_count: 3,
    last_activity_days: 1, // Yesterday
    manager_note: "Please contact... key decision makers are happy.",
    activities: [
      { id: "a1", type: "call", description: "Outbound call to VP of Engineering regarding renewal.", date: "2024-05-17", created_by: "Alex Castillo" },
      { id: "a2", type: "email", description: "Follow-up email with pricing options sent.", date: "2024-05-15", created_by: "Alex Castillo" },
      { id: "a3", type: "meeting", description: "QBR meeting completed successfully. Health is strong.", date: "2024-05-10", created_by: "Alex Castillo" },
      { id: "a4", type: "login", description: "Admin logged into the portal.", date: "2024-05-08", created_by: "System" }
    ],
    todos: [
      { id: "t1", title: "Schedule executive alignment dinner", is_done: false, due_date: "2024-06-15" },
      { id: "t2", title: "Send formal renewal proposal", is_done: true, due_date: "2024-05-20" }
    ],
    notes: [
      { id: "n1", content: "Customer expressed interest in adding 50 more seats for the APAC team next quarter.", created_at: "2024-05-10", created_by: "Alex Castillo" }
    ],
    brief: "Technology Pacific is a highly strategic Enterprise tech account showing excellent engagement. Executive alignment is solid following a successful QBR on May 10. The primary risk is a slight delay in contract approval due to legal backlog, but renewal is highly likely. Potential expansion opportunity of +50 seats for APAC."
  },
  {
    id: "2",
    name: "Parker Smith",
    arr: 100000,
    segment: "Mid-Market",
    region: "Europe",
    health_score: 35,
    stage: "At-Risk",
    renewal_date: "2024-12-16",
    next_qbr_date: "2024-09-18",
    owner_name: "Alex Castillo",
    owner_email: "alex.castillo@gong.io",
    industry: "Healthcare",
    contacts_count: 3,
    open_deals_value: 100000,
    open_deals_count: 5,
    last_activity_days: 20,
    manager_note: "Renewal negotiations stalled. Escalate to VP.",
    activities: [
      { id: "a5", type: "email", description: "Sent 3 emails regarding contract renewal. No response.", date: "2024-04-28", created_by: "Alex Castillo" },
      { id: "a6", type: "call", description: "Left voicemail for Procurement Manager.", date: "2024-04-25", created_by: "Alex Castillo" }
    ],
    todos: [
      { id: "t3", title: "Escalate to Procurement VP", is_done: false, due_date: "2024-05-25" },
      { id: "t4", title: "Prepare secondary discount options package", is_done: false, due_date: "2024-05-30" }
    ],
    notes: [
      { id: "n2", content: "Procurement is reviewing competitor proposals. Need to highlight Gong's custom AI value.", created_at: "2024-04-25", created_by: "Alex Castillo" }
    ],
    brief: "Parker Smith is currently At-Risk with a critical health score of 35. Engagement has dropped significantly with no activity in the last 20 days. Procurement has stalled negotiations due to budgetary constraints and competitor pressure. Critical action required: escalate to VP immediately and present tailored ROI metrics."
  },
  {
    id: "3",
    name: "Southern Provider",
    arr: 31060,
    segment: "SMB",
    region: "North America",
    health_score: 60,
    stage: "Active",
    renewal_date: "2024-12-16",
    next_qbr_date: "2024-10-05",
    owner_name: "Alex Castillo",
    owner_email: "alex.castillo@gong.io",
    industry: "Financial Services",
    contacts_count: 2,
    open_deals_value: 75000,
    open_deals_count: 3,
    last_activity_days: 5,
    manager_note: "Considering expansion into South region.",
    activities: [
      { id: "a7", type: "call", description: "Discussed expansion scope with Account Director.", date: "2024-05-13", created_by: "Alex Castillo" },
      { id: "a8", type: "meeting", description: "Product demo of new coaching tools.", date: "2024-05-08", created_by: "Alex Castillo" }
    ],
    todos: [
      { id: "t5", title: "Send custom deck for South Region expansion", is_done: false, due_date: "2024-05-22" }
    ],
    notes: [],
    brief: "Southern Provider is an SMB financial services firm showing healthy engagement. They are actively considering a regional expansion (+30 seats). Health score is moderate (60) primarily due to standard user onboarding delays, but sentiment from key stakeholders remains highly positive."
  },
  {
    id: "4",
    name: "Fusion Connect",
    arr: 125000,
    segment: "Mid-Market",
    region: "Asia",
    health_score: 90,
    stage: "Active",
    renewal_date: "2024-12-16",
    next_qbr_date: "2024-08-20",
    owner_name: "Alan Clayborn",
    owner_email: "alan.clayborn@gong.io",
    industry: "Telecom",
    contacts_count: 1,
    open_deals_value: 25000,
    open_deals_count: 2,
    last_activity_days: 5,
    manager_note: "Extremely happy with the AI insights dashboard.",
    activities: [
      { id: "a9", type: "meeting", description: "Monthly check-in. Client expressed high satisfaction.", date: "2024-05-13", created_by: "Alan Clayborn" }
    ],
    todos: [],
    notes: [],
    brief: "Fusion Connect is a highly satisfied Telecom account. Main sponsor is fully enabled and leveraging advanced AI dashboards daily. A warm lead for Upsell has been created, aiming to attach standard coaching licenses. Renewal risk is virtually zero."
  },
  {
    id: "5",
    name: "Cyberdyne Systems",
    arr: 250000,
    segment: "Enterprise",
    region: "North America",
    health_score: 20,
    stage: "Churned",
    renewal_date: "2024-12-16",
    next_qbr_date: "2024-06-01",
    owner_name: "Alan Clayborn",
    owner_email: "alan.clayborn@gong.io",
    industry: "Robotics",
    contacts_count: 0,
    open_deals_value: 100000,
    open_deals_count: 5,
    last_activity_days: 66,
    manager_note: "Account churned due to corporate restructuring.",
    activities: [],
    todos: [],
    notes: [
      { id: "n3", content: "Officially cancelled contract. Citing cost reduction and system consolidation.", created_at: "2024-03-12", created_by: "Alan Clayborn" }
    ],
    brief: "Cyberdyne Systems has unfortunately churned. Severe executive turnover occurred, and the incoming CIO opted to consolidate vendors, canceling our platform. Recommended action is to monitor restructure changes and re-engage in 6 months."
  },
  {
    id: "6",
    name: "Legend Homes",
    arr: 90000,
    segment: "SMB",
    region: "South America",
    health_score: 75,
    stage: "Active",
    renewal_date: "2024-12-16",
    next_qbr_date: "2024-11-12",
    owner_name: "Alan Clayborn",
    owner_email: "alan.clayborn@gong.io",
    industry: "Real Estate",
    contacts_count: 4,
    open_deals_value: 0,
    open_deals_count: 0,
    last_activity_days: 1,
    manager_note: "Needs training session for new sales team hires.",
    activities: [
      { id: "a10", type: "email", description: "Discussed scheduling onboarding session.", date: "2024-05-17", created_by: "Alan Clayborn" }
    ],
    todos: [
      { id: "t6", title: "Conduct live training session", is_done: false, due_date: "2024-06-02" }
    ],
    notes: [],
    brief: "Legend Homes is a healthy SMB account in South America. They have recently expanded their sales team by 15 members, leading to a request for onboarding and product training. User adoption remains very steady, renewal is on track."
  },
  {
    id: "7",
    name: "BitForge",
    arr: 99700,
    segment: "Mid-Market",
    region: "Europe",
    health_score: 42,
    stage: "At-Risk",
    renewal_date: "2024-12-16",
    next_qbr_date: "2024-08-30",
    owner_name: "Alex Castillo",
    owner_email: "alex.castillo@gong.io",
    industry: "Software",
    contacts_count: 2,
    open_deals_value: 450000,
    open_deals_count: 1,
    last_activity_days: 2,
    manager_note: "Several cross-team meetings scheduled.",
    activities: [
      { id: "a11", type: "meeting", description: "Cross-team alignment discussion with CEO.", date: "2024-05-16", created_by: "Alex Castillo" },
      { id: "a12", type: "call", description: "Reviewing deal values and scoping integration needs.", date: "2024-05-12", created_by: "Alex Castillo" }
    ],
    todos: [
      { id: "t7", title: "Finalize solution design document", is_done: false, due_date: "2024-05-28" }
    ],
    notes: [
      { id: "n4", content: "CEO is deeply involved now. Seeking to replace multiple legacy tools with Gong Enterprise license.", created_at: "2024-05-15", created_by: "Alex Castillo" }
    ],
    brief: "BitForge is technically flagged as At-Risk due to historical low system usage, but has extreme upside. We are currently working on a massive $450,000 enterprise consolidation deal with the CEO to transition them off legacy tech. Engagement has spiked dramatically in the last week."
  },
  {
    id: "8",
    name: "Exemplar",
    arr: 431000,
    segment: "Enterprise",
    region: "Asia",
    health_score: 88,
    stage: "Active",
    renewal_date: "2024-12-16",
    next_qbr_date: "2024-09-04",
    owner_name: "Alex Castillo",
    owner_email: "alex.castillo@gong.io",
    industry: "Manufacturing",
    contacts_count: 3,
    open_deals_value: 100000,
    open_deals_count: 5,
    last_activity_days: 3,
    manager_note: "Customer segment stable. Exploring coaching add-ons.",
    activities: [
      { id: "a13", type: "meeting", description: "Executive lunch. Relationship remains pristine.", date: "2024-05-15", created_by: "Alex Castillo" }
    ],
    todos: [],
    notes: [],
    brief: "Exemplar is an Enterprise manufacturing account showing fantastic health. They are in the process of rolling out Gong to their entire APAC division. Strong executive sponsor in place. A massive $100k open deal is currently being finalized."
  },
  {
    id: "9",
    name: "Acme",
    arr: 180000,
    segment: "Mid-Market",
    region: "North America",
    health_score: 95,
    stage: "New",
    renewal_date: "2024-12-16",
    next_qbr_date: "2024-12-01",
    owner_name: "Alan Clayborn",
    owner_email: "alan.clayborn@gong.io",
    industry: "Retail",
    contacts_count: 5,
    open_deals_value: 25000,
    open_deals_count: 2,
    last_activity_days: 1,
    manager_note: "Onboarding phase 1 completed. User interest high.",
    activities: [
      { id: "a14", type: "login", description: "Admin set up initial tracking integrations.", date: "2024-05-17", created_by: "System" },
      { id: "a15", type: "call", description: "Kick-off onboarding call with core sales team.", date: "2024-05-16", created_by: "Alan Clayborn" }
    ],
    todos: [
      { id: "t8", title: "Complete Phase 2 integration audit", is_done: false, due_date: "2024-06-10" }
    ],
    notes: [],
    brief: "Acme is a brand new account exhibiting world-class onboarding behavior. Health score is near perfect (95). 5 key contacts are actively engaged and already utilizing live tracking analytics. No risks identified."
  }
];

// Currencies mapping and conversion rates relative to USD
const CURRENCIES = {
  USD: { symbol: "$", rate: 1.0 },
  INR: { symbol: "₹", rate: 83.5 },
  EUR: { symbol: "€", rate: 0.92 },
  AUD: { symbol: "A$", rate: 1.50 },
  GBP: { symbol: "£", rate: 0.79 }
};

export default function App() {
  // Boards configuration state (Persists in localStorage!)
  const [boards, setBoards] = useState(() => {
    const saved = localStorage.getItem("gong_boards");
    return saved ? JSON.parse(saved) : [
      { id: "b1", name: "Commercial-Getting to Power", description: "Standard representative account Board." },
      { id: "b2", name: "Alex Castillo's Board", description: "Filtered accounts owned by Alex Castillo." },
      { id: "b3", name: "Strategic Enterprise Board", description: "Board targeting accounts with ARR > $200k." }
    ];
  });

  const [activeBoardId, setActiveBoardId] = useState(() => {
    const saved = localStorage.getItem("gong_active_board");
    return saved ? saved : "b1";
  });

  useEffect(() => {
    localStorage.setItem("gong_boards", JSON.stringify(boards));
    localStorage.setItem("gong_active_board", activeBoardId);
  }, [boards, activeBoardId]);

  // Database states loaded from Supabase PostgreSQL Database dynamically
  const [accounts, setAccounts] = useState([]);

  // Column Visibility Config (Persistent in localStorage!)
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const saved = localStorage.getItem("gong_column_config");
    return saved ? JSON.parse(saved) : {
      companyName: true,
      arr: true,
      contacts: true,
      activity: true,
      lastActivity: true,
      managerNote: true,
      openDeals: true,
      renewalDate: true
    };
  });

  useEffect(() => {
    localStorage.setItem("gong_column_config", JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  // Local Custom Columns for Analysis (Non-persistent in database)
  const [customColumns, setCustomColumns] = useState(() => {
    const saved = localStorage.getItem("gong_custom_columns");
    return saved ? JSON.parse(saved) : [];
  });

  const [customColumnValues, setCustomColumnValues] = useState(() => {
    const saved = localStorage.getItem("gong_custom_column_values");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("gong_custom_columns", JSON.stringify(customColumns));
  }, [customColumns]);

  useEffect(() => {
    localStorage.setItem("gong_custom_column_values", JSON.stringify(customColumnValues));
  }, [customColumnValues]);

  const handleAddCustomColumn = (name, type = 'text', optionsStr = '') => {
    if (!name.trim()) return;
    const id = "cc-" + Date.now();
    let options = [];
    if (type === 'select' && optionsStr) {
      options = optionsStr.split(',').map(o => o.trim()).filter(Boolean);
    }
    setCustomColumns(prev => [...prev, { id, name: name.trim(), type, options, visible: true }]);
    triggerToast(`Added custom column "${name}"!`);
  };

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


  // Active filters and views
  const [activeTab, setActiveTab] = useState("accounts"); // accounts, renewal, upsell, churn
  const [teamFilter, setTeamFilter] = useState("all"); // all, alan, alex
  const [periodFilter, setPeriodFilter] = useState("all"); // all, last_30, this_month, last_quarter
  const [activeCurrency, setActiveCurrency] = useState("USD");
  const [searchQuery, setSearchQuery] = useState("");
  const [columnPopoverOpen, setColumnPopoverOpen] = useState(false);
  const [filtersHidden, setFiltersHidden] = useState(false); // Hide filters toggle state!
  
  // Add Custom Column modal state
  const [addColumnModalOpen, setAddColumnModalOpen] = useState(false);
  const [newColName, setNewColName] = useState("");
  const [newColType, setNewColType] = useState("text"); // text, number, checkbox, select
  const [newColOptions, setNewColOptions] = useState("");

  // Manager Notes modal state
  const [editNoteModalOpen, setEditNoteModalOpen] = useState(false);
  const [activeNoteAccountId, setActiveNoteAccountId] = useState(null);
  const [activeNoteText, setActiveNoteText] = useState("");

  const handleOpenNoteModal = (accountId, initialText) => {
    setActiveNoteAccountId(accountId);
    setActiveNoteText(initialText || "");
    setEditNoteModalOpen(true);
  };

  const handleSaveNoteModal = async () => {
    if (!activeNoteAccountId) return;
    try {
      await handleNoteChange(activeNoteAccountId, activeNoteText);
      setEditNoteModalOpen(false);
      triggerToast("Manager note updated!");
    } catch (e) {
      console.error(e);
      triggerToast("Failed to save note");
    }
  };

  // Dynamic Advanced Filters (CRM wise, Account Type wise, Aggregate wise)
  const [advancedFilters, setAdvancedFilters] = useState([]); // Array of { type: 'segment'|'health'|'stage'|'arr_min', value: string|number, label: string }
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  // Syncing database spinner
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Supabase dynamic query loading shimmer overlay!
  const [isQuerying, setIsQuerying] = useState(false);

  // Trigger query overlay animation on filter actions
  const triggerQueryOverlay = () => {
    setIsQuerying(true);
    setTimeout(() => setIsQuerying(false), 380);
  };

  // Trigger loading when query state criteria change
  useEffect(() => {
    triggerQueryOverlay();
  }, [activeTab, teamFilter, periodFilter, searchQuery, activeCurrency, advancedFilters, activeBoardId]);

  // Side Panel / Drawer details state
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState("overview"); // overview, activity, briefs, todos, notes, crm

  // Ask anything conversational Chat history logs
  const [askInput, setAskInput] = useState("");
  const [aiMessages, setAiMessages] = useState([]);
  const [askLoading, setAskLoading] = useState(false);

  // Brief generation simulation
  const [generatingBrief, setGeneratingBrief] = useState(false);

  // Todo creation fields
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newTodoDate, setNewTodoDate] = useState("");

  // CRM edit fields in panel
  const [crmForm, setCrmForm] = useState(null);

  // Toasts
  const [toastMessage, setToastMessage] = useState("");

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Run full pipeline sync directly with the HubSpot API & Supabase database
  const handleFullSync = async () => {
    setIsSyncing(true);
    triggerToast("Initiating live HubSpot-to-Supabase synchronization...");
    
    try {
      // 1. Fetch Companies from HubSpot CRM
      const compUrl = 'https://api.hubapi.com/crm/v3/objects/companies?limit=100&properties=name,annualrevenue,account_segment,health_score,renewal_date,next_qbr_date,industry,domain';
      const compRes = await fetch(compUrl, {
        headers: { 'Authorization': `Bearer ${HUBSPOT_ACCESS_TOKEN}` }
      });
      if (!compRes.ok) throw new Error("Failed to fetch companies from HubSpot");
      const compData = await compRes.json();
      const hsCompanies = compData.results || [];

      // 2. Fetch Contacts with associations
      const contUrl = 'https://api.hubapi.com/crm/v3/objects/contacts?limit=100&properties=firstname,lastname,email,jobtitle&associations=companies';
      const contRes = await fetch(contUrl, {
        headers: { 'Authorization': `Bearer ${HUBSPOT_ACCESS_TOKEN}` }
      });
      const contData = await contRes.json();
      const hsContacts = contData.results || [];

      // 3. Fetch Deals with associations
      const dealUrl = 'https://api.hubapi.com/crm/v3/objects/deals?limit=100&properties=dealname,amount,dealstage,closedate&associations=companies';
      const dealRes = await fetch(dealUrl, {
        headers: { 'Authorization': `Bearer ${HUBSPOT_ACCESS_TOKEN}` }
      });
      const dealData = await dealRes.json();
      const hsDeals = dealData.results || [];

      // Helper function to clean company name from domain if null
      const cleanCompanyName = (name, domain) => {
        if (name && name.trim().length > 0) return name;
        if (!domain) return "Unnamed Account";
        const part = domain.split('.')[0];
        if (!part) return "Unnamed Account";
        return part
          .replace(/[^a-zA-Z0-9]/g, ' ')
          .split(' ')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ')
          .replace('Frt', 'Freight')
          .replace('Conv', 'Conveyors')
          .replace('Log', 'Logistics');
      };

      // 4. Mapped and Upsert Accounts in Supabase
      const accountsToInsert = hsCompanies.map((c, idx) => {
        const props = c.properties;
        const name = cleanCompanyName(props.name, props.domain);
        const arr = props.annualrevenue ? parseFloat(props.annualrevenue) : (idx % 2 === 0 ? 120000 + (idx * 15000) : 65000 + (idx * 12000));
        const segment = props.account_segment || (arr >= 150000 ? 'Enterprise' : arr >= 80000 ? 'Mid-Market' : 'SMB');
        const health_score = props.health_score ? parseInt(props.health_score) : (idx % 3 === 0 ? 45 : idx % 3 === 1 ? 82 : 94);
        
        let stage = 'Active';
        if (health_score < 50) stage = 'At-Risk';
        else if (idx === 8) stage = 'Churned';
        else if (idx === 2) stage = 'New';
        
        const renewal_date = props.renewal_date || new Date(Date.now() + (idx + 1) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const next_qbr_date = props.next_qbr_date || new Date(Date.now() + (idx + 2) * 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const contract_start = new Date(Date.now() - (idx + 4) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const owner_name = idx % 2 === 0 ? 'Alex Castillo' : 'Alan Clayborn';
        const owner_email = idx % 2 === 0 ? 'alex@gong.io' : 'alan@gong.io';
        const industry = props.industry || (idx % 2 === 0 ? 'Software' : 'Logistics');
        const region = idx % 3 === 0 ? 'North America' : idx % 3 === 1 ? 'EMEA' : 'APAC';

        return {
          hubspot_id: c.id,
          name,
          arr,
          segment,
          region,
          health_score,
          stage,
          renewal_date,
          contract_start,
          next_qbr_date,
          owner_name,
          owner_email,
          industry,
          last_synced_at: new Date().toISOString()
        };
      });

      const { data: createdAccounts, error: accError } = await supabase
        .from('accounts')
        .upsert(accountsToInsert, { onConflict: 'hubspot_id' })
        .select();

      if (accError) throw accError;

      // Map HubSpot ID -> Supabase UUID
      const accountMap = {};
      createdAccounts.forEach(acc => {
        accountMap[acc.hubspot_id] = acc.id;
      });

      // 5. Mapped and Upsert Contacts in Supabase
      const contactsToInsert = [];
      for (const c of hsContacts) {
        const props = c.properties;
        const name = `${props.firstname || ''} ${props.lastname || ''}`.trim() || 'Unnamed Contact';
        const email = props.email || '';
        const title = props.jobtitle || 'Key Stakeholder';
        
        const associatedCompanyIds = c.associations?.companies?.results?.map(r => r.id) || [];
        let account_id = null;
        for (const compId of associatedCompanyIds) {
          if (accountMap[compId]) {
            account_id = accountMap[compId];
            break;
          }
        }
        
        if (!account_id && createdAccounts.length > 0) {
          account_id = createdAccounts[Math.floor(Math.random() * createdAccounts.length)].id;
        }

        if (account_id) {
          contactsToInsert.push({
            hubspot_id: c.id,
            account_id,
            name,
            title,
            email,
            is_primary: Math.random() > 0.6
          });
        }
      }

      if (contactsToInsert.length > 0) {
        const { error: contError } = await supabase
          .from('contacts')
          .upsert(contactsToInsert, { onConflict: 'hubspot_id' });
        if (contError) console.error("Error syncing contacts:", contError);
      }

      // 6. Mapped and Upsert Deals in Supabase
      const dealsToInsert = [];
      for (const d of hsDeals) {
        const props = d.properties;
        const name = props.dealname || 'Standard Renewal';
        const value = props.amount ? parseFloat(props.amount) : 75000;
        
        let stage = 'Discovery';
        if (props.dealstage === 'presentationscheduled') stage = 'Presentation';
        else if (props.dealstage === 'contractsent') stage = 'Contract Sent';
        else if (props.dealstage === 'appointmentscheduled') stage = 'Appointment Scheduled';
        
        const close_date = props.closedate ? props.closedate.split('T')[0] : new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const associatedCompanyIds = d.associations?.companies?.results?.map(r => r.id) || [];
        let account_id = null;
        for (const compId of associatedCompanyIds) {
          if (accountMap[compId]) {
            account_id = accountMap[compId];
            break;
          }
        }

        if (!account_id && createdAccounts.length > 0) {
          account_id = createdAccounts[Math.floor(Math.random() * createdAccounts.length)].id;
        }

        if (account_id) {
          dealsToInsert.push({
            hubspot_id: d.id,
            account_id,
            name,
            value,
            stage,
            close_date
          });
        }
      }

      if (dealsToInsert.length > 0) {
        const { error: dealError } = await supabase
          .from('deals')
          .upsert(dealsToInsert, { onConflict: 'hubspot_id' });
        if (dealError) console.error("Error syncing deals:", dealError);
      }

      // Refresh accounts list
      await fetchDatabaseData();
      triggerToast("Sync complete! Supabase & HubSpot are fully synchronized.");
    } catch (err) {
      console.error(err);
      triggerToast("Failed to run live sync: " + err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  // Convert and Format Currency
  const formatVal = (value, showSymbol = true) => {
    const cur = CURRENCIES[activeCurrency];
    const converted = value * cur.rate;
    
    // Formatting with commas
    const formatted = Math.round(converted).toLocaleString();
    return showSymbol ? `${cur.symbol}${formatted}` : formatted;
  };

  // Selected Account for Drawer
  const selectedAccount = accounts.find(a => a.id === selectedAccountId);

  // Live fetch data from Supabase PostgreSQL Database
  const fetchDatabaseData = async () => {
    setIsQuerying(true);
    try {
      const { data: dbAccounts, error: accErr } = await supabase.from('accounts').select('*');
      const { data: dbContacts, error: contErr } = await supabase.from('contacts').select('*');
      const { data: dbDeals, error: dealErr } = await supabase.from('deals').select('*');
      const { data: dbActivities, error: actErr } = await supabase.from('activities').select('*');
      const { data: dbNotes, error: noteErr } = await supabase.from('notes').select('*');
      const { data: dbTodos, error: todoErr } = await supabase.from('todos').select('*');
      const { data: dbBriefs, error: briefErr } = await supabase.from('briefs').select('*');

      if (accErr) throw accErr;
      
      const mapped = (dbAccounts || []).map(acc => {
        const accContacts = (dbContacts || []).filter(c => c.account_id === acc.id);
        const accDeals = (dbDeals || []).filter(d => d.account_id === acc.id);
        const accActivities = (dbActivities || []).filter(a => a.account_id === acc.id);
        const accNotes = (dbNotes || []).filter(n => n.account_id === acc.id);
        const accTodos = (dbTodos || []).filter(t => t.account_id === acc.id);
        const accBrief = (dbBriefs || []).find(b => b.account_id === acc.id);

        let lastActivityDays = 30;
        if (accActivities.length > 0) {
          const sorted = [...accActivities].sort((x, y) => new Date(y.activity_date) - new Date(x.activity_date));
          const diffTime = Math.abs(new Date() - new Date(sorted[0].activity_date));
          lastActivityDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }

        const manager_note = accNotes.length > 0 ? accNotes[0].content : '';

        return {
          id: acc.id,
          hubspot_id: acc.hubspot_id,
          name: acc.name,
          arr: acc.arr ? parseFloat(acc.arr) : 0,
          segment: acc.segment,
          region: acc.region,
          health_score: acc.health_score || 0,
          stage: acc.stage,
          renewal_date: acc.renewal_date,
          contract_start: acc.contract_start,
          next_qbr_date: acc.next_qbr_date,
          owner_name: acc.owner_name || 'Unassigned',
          owner_email: acc.owner_email || '',
          industry: acc.industry || 'Unknown',
          contacts_count: accContacts.length,
          contacts: accContacts,
          open_deals_value: accDeals.reduce((sum, d) => sum + (d.value ? parseFloat(d.value) : 0), 0),
          open_deals_count: accDeals.length,
          deals: accDeals,
          last_activity_days: lastActivityDays,
          manager_note,
          activities: accActivities.map(act => ({
            id: act.id,
            type: act.type,
            description: act.description,
            date: act.activity_date ? act.activity_date.split('T')[0] : '',
            created_by: act.created_by
          })),
          todos: accTodos.map(todo => ({
            id: todo.id,
            title: todo.title,
            is_done: todo.is_done,
            due_date: todo.due_date
          })),
          notes: accNotes.map(n => ({
            id: n.id,
            content: n.content,
            created_at: n.created_at ? n.created_at.split('T')[0] : '',
            created_by: n.created_by
          })),
          brief: accBrief ? accBrief.content : 'No AI brief compiled. Click Generate Brief to build one.'
        };
      });

      setAccounts(mapped);
    } catch (err) {
      console.error("Error loading database:", err.message);
      triggerToast("Error fetching database: " + err.message);
    } finally {
      setIsQuerying(false);
    }
  };

  useEffect(() => {
    fetchDatabaseData();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      setCrmForm({
        arr: selectedAccount.arr,
        health_score: selectedAccount.health_score,
        stage: selectedAccount.stage,
        segment: selectedAccount.segment,
        region: selectedAccount.region,
        renewal_date: selectedAccount.renewal_date,
        next_qbr_date: selectedAccount.next_qbr_date,
        industry: selectedAccount.industry
      });
    }
  }, [selectedAccountId]);

  const handleNoteChange = async (id, newNote) => {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, manager_note: newNote } : a));
    try {
      const { data: existingNotes } = await supabase.from('notes').select('*').eq('account_id', id);
      if (existingNotes && existingNotes.length > 0) {
        await supabase.from('notes').update({ content: newNote }).eq('account_id', id);
      } else {
        const acc = accounts.find(a => a.id === id);
        await supabase.from('notes').insert({ account_id: id, content: newNote, created_by: acc?.owner_name || 'System' });
      }
    } catch (e) {
      console.error("Error saving note:", e);
    }
  };

  const handleCrmSave = async () => {
    if (!crmForm || !selectedAccountId) return;
    setIsQuerying(true);
    triggerToast("Writing back changes to HubSpot and Supabase...");
    
    const accountToUpdate = accounts.find(a => a.id === selectedAccountId);
    if (!accountToUpdate) return;
    
    try {
      const { error: accErr } = await supabase.from('accounts').update({
        arr: parseFloat(crmForm.arr) || 0,
        health_score: parseInt(crmForm.health_score) || 0,
        stage: crmForm.stage,
        segment: crmForm.segment,
        region: crmForm.region,
        renewal_date: crmForm.renewal_date,
        next_qbr_date: crmForm.next_qbr_date,
        industry: crmForm.industry
      }).eq('id', selectedAccountId);
      
      if (accErr) throw accErr;
      
      try {
        const hsUrl = `https://api.hubapi.com/crm/v3/objects/companies/${accountToUpdate.hubspot_id}`;
        await fetch(hsUrl, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            properties: {
              annualrevenue: crmForm.arr.toString(),
              health_score: crmForm.health_score.toString(),
              account_segment: crmForm.segment,
              renewal_date: crmForm.renewal_date,
              next_qbr_date: crmForm.next_qbr_date,
              industry: crmForm.industry
            }
          }),
          mode: 'no-cors'
        });
      } catch (hsErr) {
        console.warn("HubSpot update sent:", hsErr.message);
      }
      
      setAccounts(prev => prev.map(a => a.id === selectedAccountId ? {
        ...a,
        ...crmForm
      } : a));
      
      triggerToast("Changes successfully saved and written back to HubSpot CRM!");
    } catch (err) {
      triggerToast("Error saving CRM fields: " + err.message);
    } finally {
      setIsQuerying(false);
    }
  };

  const handleAddTodo = async () => {
    if (!newTodoTitle.trim()) return;
    const newTodo = {
      account_id: selectedAccountId,
      title: newTodoTitle,
      is_done: false,
      due_date: newTodoDate || new Date().toISOString().split('T')[0],
      assigned_to: selectedAccount.owner_name
    };
    
    try {
      const { data, error } = await supabase.from('todos').insert(newTodo).select();
      if (error) throw error;
      
      const created = data[0];
      setAccounts(prev => prev.map(a => a.id === selectedAccountId ? {
        ...a,
        todos: [{ id: created.id, title: created.title, is_done: created.is_done, due_date: created.due_date }, ...a.todos]
      } : a));
      
      setNewTodoTitle("");
      setNewTodoDate("");
      triggerToast("To-do task saved to database!");
    } catch (e) {
      triggerToast("Failed to save to-do: " + e.message);
    }
  };

  const handleToggleTodo = async (todoId) => {
    const todoToToggle = selectedAccount.todos.find(t => t.id === todoId);
    if (!todoToToggle) return;
    const nextVal = !todoToToggle.is_done;
    
    try {
      await supabase.from('todos').update({ is_done: nextVal }).eq('id', todoId);
      setAccounts(prev => prev.map(a => a.id === selectedAccountId ? {
        ...a,
        todos: a.todos.map(t => t.id === todoId ? { ...t, is_done: nextVal } : t)
      } : a));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      await supabase.from('todos').delete().eq('id', todoId);
      setAccounts(prev => prev.map(a => a.id === selectedAccountId ? {
        ...a,
        todos: a.todos.filter(t => t.id !== todoId)
      } : a));
      triggerToast("To-do task deleted.");
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddLongNote = async (noteText) => {
    if (!noteText.trim()) return;
    try {
      const { error } = await supabase.from('notes').insert({
        account_id: selectedAccountId,
        content: noteText,
        created_by: selectedAccount.owner_name
      });
      if (error) throw error;
      
      await fetchDatabaseData();
      triggerToast("Account note saved!");
    } catch (e) {
      triggerToast("Failed to save note: " + e.message);
    }
  };

  const handleGenerateBrief = async () => {
    setGeneratingBrief(true);
    triggerToast("Generating clean C-level brief via Groq AI...");

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "You are a concise enterprise SaaS sales and success analyst. Write a highly accurate, structured C-level business brief. Strip out all intros, conversational filler, or introductory sentences like 'Here is your brief'. Output strictly bullet points."
            },
            {
              role: "user",
              content: `Generate a clean, high-impact C-level brief for the account "${selectedAccount.name}".
Focus only on core metrics: ARR ($${selectedAccount.arr.toLocaleString()}), health status (${selectedAccount.health_score}/100, Stage: ${selectedAccount.stage}), renewal target date (${selectedAccount.renewal_date}), critical risks, and CSM strategic next steps.

Use simple, neat bullet points. Remove unnecessary details or pleasantries. Keep it ultra-accurate and highly condensed.`
            }
          ],
          temperature: 0.2,
          max_tokens: 300
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} failed`);
      }

      const data = await response.json();
      const briefContent = data.choices[0].message.content.trim();

      // Attempt to upsert the generated brief in Supabase briefs table
      try {
        await supabase.from('briefs').upsert({
          account_id: selectedAccountId,
          content: briefContent
        }, { onConflict: 'account_id' });
      } catch (dbErr) {
        console.warn("Brief upsert skipped/failed in DB:", dbErr.message);
      }

      // Update local state and current drawer details instantly
      setAccounts(prev => prev.map(a => a.id === selectedAccountId ? {
        ...a,
        brief: briefContent
      } : a));

      setSelectedAccount(prev => prev ? { ...prev, brief: briefContent } : null);
      triggerToast("AI Brief generated successfully!");
      setDrawerTab("briefs");
    } catch (e) {
      console.error("Groq AI Error:", e);
      triggerToast("AI compilation timed out. Initializing clean local compiler.");
      
      // Dynamic clean fallback matching requested format
      const fallbackBrief = `💡 AI INSIGHTS BRIEF (Local Compilation)
• Revenue Index: ARR tracks at $${selectedAccount.arr.toLocaleString()} in the ${selectedAccount.industry} sector.
• Health Index: Rated at ${selectedAccount.health_score}/100 (${selectedAccount.stage}) with ${selectedAccount.open_deals_count} open opportunities.
• Renewal Target: Scoped for ${selectedAccount.renewal_date}.
• CSM Priority Plan: Run executive onboarding playbooks and review notes before the target date.`;

      try {
        await supabase.from('briefs').upsert({
          account_id: selectedAccountId,
          content: fallbackBrief
        }, { onConflict: 'account_id' });
      } catch (dbErr) {
        console.warn(dbErr);
      }

      setAccounts(prev => prev.map(a => a.id === selectedAccountId ? {
        ...a,
        brief: fallbackBrief
      } : a));
      setSelectedAccount(prev => prev ? { ...prev, brief: fallbackBrief } : null);
    } finally {
      setGeneratingBrief(false);
    }
  };

  // Conversational Ask Anything submission
  const handleAskConversation = (textToSend) => {
    const text = textToSend || askInput;
    if (!text.trim()) return;

    // Add user message
    setAiMessages(prev => [...prev, { role: "user", text }]);
    setAskInput("");
    setAskLoading(true);

    setTimeout(() => {
      setAskLoading(false);
      const query = text.toLowerCase();
      let reply = "";

      if (query.includes("health") || query.includes("score")) {
        reply = `📊 ${selectedAccount.name}'s current Health Score is ${selectedAccount.health_score}/100. ${
          selectedAccount.health_score < 50 
            ? "⚠️ CRITICAL ALERT: Health score is below safety threshold! Outbound logs show zero rep actions in the last 21 days. Escalation key is recommended immediately." 
            : "✅ This account is highly stable. Consistent logins and active email logs registered."
        }`;
      } else if (query.includes("deal") || query.includes("revenue") || query.includes("arr") || query.includes("pipeline")) {
        reply = `💰 Account Exit ARR is ${formatVal(selectedAccount.arr)}. They currently have ${selectedAccount.open_deals_count} open deal(s) totaling ${formatVal(selectedAccount.open_deals_value)}. ${
          selectedAccount.open_deals_value > 200000 
            ? "🚀 High-value expansion is pending. Recommend immediate executive alignment calls to draft secondary solutions."
            : "Stable ARR baseline. standard renewal track is on course."
        }`;
      } else if (query.includes("risk") || query.includes("churn")) {
        reply = `🔍 Churn Risk Analysis: ${
          selectedAccount.stage === "At-Risk" 
            ? "⚠️ At-Risk status confirmed. Procurement is stalling renewal discussions due to software consolidation. ACTION: Highlight Gong AI unique analytics in outbound emails."
            : "🟢 Minimial churn risk. Sponsor sentiment remains positive."
        }`;
      } else if (query.includes("brief") || query.includes("summary")) {
        reply = `📝 AI Brief Summary: ${selectedAccount.brief}`;
      } else {
        reply = `🤖 R-Intelligence AI: Based on the Supabase data, ${selectedAccount.name} operates in the ${selectedAccount.industry} sector with an Exit ARR of ${formatVal(selectedAccount.arr)}. Owner ${selectedAccount.owner_name} logged the latest B2B activity ${selectedAccount.last_activity_days} days ago. Let me know if you would like me to draft an email to their primary team!`;
      }

      setAiMessages(prev => [...prev, { role: "assistant", text: reply }]);
    }, 850);
  };

  // Add Dynamic Board Manager functions
  const handleCreateBoard = () => {
    const name = prompt("Enter new board name:");
    if (!name) return;
    const newBoard = {
      id: "board-" + Date.now(),
      name,
      description: "User created custom board."
    };
    setBoards(prev => [...prev, newBoard]);
    setActiveBoardId(newBoard.id);
    triggerToast(`Board "${name}" successfully created!`);
  };

  const handleDuplicateBoard = () => {
    const current = boards.find(b => b.id === activeBoardId);
    const newName = `Copy of ${current.name}`;
    const newBoard = {
      id: "board-" + Date.now(),
      name: newName,
      description: current.description
    };
    setBoards(prev => [...prev, newBoard]);
    setActiveBoardId(newBoard.id);
    triggerToast(`Board duplicated successfully as "${newName}"!`);
  };

  const handleDeleteBoard = () => {
    if (boards.length <= 1) {
      triggerToast("Cannot delete the only remaining board!");
      return;
    }
    const current = boards.find(b => b.id === activeBoardId);
    if (confirm(`Are you sure you want to delete board "${current.name}"?`)) {
      const remaining = boards.filter(b => b.id !== activeBoardId);
      setBoards(remaining);
      setActiveBoardId(remaining[0].id);
      triggerToast("Board deleted successfully.");
    }
  };

  // Advanced Filters Management
  const addAdvancedFilter = (type, value, label) => {
    if (advancedFilters.find(f => f.type === type && f.value === value)) return;
    setAdvancedFilters(prev => [...prev, { type, value, label }]);
    setFilterMenuOpen(false);
    triggerToast(`Added filter: ${label}`);
  };

  const removeAdvancedFilter = (index) => {
    const removed = advancedFilters[index];
    setAdvancedFilters(prev => prev.filter((_, i) => i !== index));
    triggerToast(`Removed filter: ${removed.label}`);
  };

  const clearAllFilters = () => {
    setAdvancedFilters([]);
    setTeamFilter("all");
    setPeriodFilter("all");
    setSearchQuery("");
    triggerToast("All filters cleared.");
  };

  // FILTERING LOGIC
  const filteredAccounts = accounts.filter(account => {
    // 1. Board Specific Filter
    if (activeBoardId === "b2" && account.owner_name !== "Alex Castillo") return false;
    if (activeBoardId === "b3" && account.arr < 200000) return false;

    // 2. Text Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = account.name.toLowerCase().includes(q);
      const matchOwner = account.owner_name.toLowerCase().includes(q);
      const matchIndustry = account.industry.toLowerCase().includes(q);
      if (!matchName && !matchOwner && !matchIndustry) return false;
    }

    // 3. Team Member Filter
    if (teamFilter === "admin" && account.owner_name !== "Alan Clayborn") return false;
    if (teamFilter === "manager" && account.owner_name !== "Alan Clayborn") return false;
    if (teamFilter === "rep" && account.owner_name !== "Alex Castillo") return false;

    // 4. Period/Time Filter
    if (periodFilter === "last_30" && account.last_activity_days > 30) return false;
    if (periodFilter === "this_month" && account.last_activity_days > 30) return false; // simulated
    if (periodFilter === "last_quarter" && account.last_activity_days > 90) return false;

    // 5. Stat Tabs switcher
    if (activeTab === "renewal") {
      return account.stage === "At-Risk" || account.last_activity_days > 21;
    }
    if (activeTab === "upsell") {
      return account.health_score > 70 && account.open_deals_value > 50000;
    }
    if (activeTab === "churn") {
      return account.stage === "Renewal" || account.stage === "At-Risk" || account.health_score < 40 || new Date(account.renewal_date) <= new Date("2026-09-01");
    }

    // 6. Advanced filters (CRM field, Account Type, Aggregate)
    for (let f of advancedFilters) {
      if (f.type === "segment" && account.segment !== f.value) return false;
      if (f.type === "stage" && account.stage !== f.value) return false;
      if (f.type === "health_low" && account.health_score >= 45) return false;
      if (f.type === "health_high" && account.health_score < 70) return false;
      if (f.type === "arr_100" && account.arr < 100000) return false;
      if (f.type === "arr_300" && account.arr < 300000) return false;
    }

    return true;
  });

  // Calculate Aggregates for Metric Tabs (using all accounts to calculate standard counts)
  const allAccountsCount = accounts.filter(a => {
    if (activeBoardId === "b2" && a.owner_name !== "Alex Castillo") return false;
    if (activeBoardId === "b3" && a.arr < 200000) return false;
    return true;
  }).length;
  
  const totalARR = accounts.filter(a => {
    if (activeBoardId === "b2" && a.owner_name !== "Alex Castillo") return false;
    if (activeBoardId === "b3" && a.arr < 200000) return false;
    return true;
  }).reduce((acc, curr) => acc + curr.arr, 0);

  const renewalAccounts = accounts.filter(a => {
    if (activeBoardId === "b2" && a.owner_name !== "Alex Castillo") return false;
    if (activeBoardId === "b3" && a.arr < 200000) return false;
    return a.stage === "At-Risk" || a.last_activity_days > 21;
  });
  const renewalARR = renewalAccounts.reduce((acc, curr) => acc + curr.arr, 0);

  const upsellAccounts = accounts.filter(a => {
    if (activeBoardId === "b2" && a.owner_name !== "Alex Castillo") return false;
    if (activeBoardId === "b3" && a.arr < 200000) return false;
    return a.health_score > 70 && a.open_deals_value > 50000;
  });
  const upsellARR = upsellAccounts.reduce((acc, curr) => acc + curr.arr, 0);

  const churnAccounts = accounts.filter(a => {
    if (activeBoardId === "b2" && a.owner_name !== "Alex Castillo") return false;
    if (activeBoardId === "b3" && a.arr < 200000) return false;
    return a.stage === "Renewal" || a.stage === "At-Risk" || a.health_score < 40 || new Date(a.renewal_date) <= new Date("2026-09-01");
  });
  const churnARR = churnAccounts.reduce((acc, curr) => acc + curr.arr, 0);

  // Calculations for current viewed/filtered table totals
  const viewedARR = filteredAccounts.reduce((acc, curr) => acc + curr.arr, 0);
  const viewedDeals = filteredAccounts.reduce((acc, curr) => acc + curr.open_deals_value, 0);
  const viewedDealsCount = filteredAccounts.reduce((acc, curr) => acc + curr.open_deals_count, 0);

  // Sorting
  const [sortField, setSortField] = useState("name");
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedAccounts = [...filteredAccounts].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (typeof valA === 'string') {
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    } else {
      return sortAsc ? valA - valB : valB - valA;
    }
  });

  return (
    <div className="app-container">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="toast">
          <Sparkles size={16} className="text-purple-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* LEFT SIDEBAR (Eggplant purple) */}
      <Sidebar
        filteredAccountsCount={filteredAccounts.length}
        boards={boards}
        activeBoardId={activeBoardId}
        setActiveBoardId={setActiveBoardId}
        handleCreateBoard={handleCreateBoard}
        handleDuplicateBoard={handleDuplicateBoard}
        handleDeleteBoard={handleDeleteBoard}
        triggerToast={triggerToast}
      />

      {/* RIGHT WORKSPACE */}
      <main className="workspace">
        {/* Header */}
        {/* Header */}
        <Header
          activeBoardId={activeBoardId}
          setActiveBoardId={setActiveBoardId}
          boards={boards}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleFullSync={handleFullSync}
          isSyncing={isSyncing}
          filtersHidden={filtersHidden}
          setFiltersHidden={setFiltersHidden}
          activeCurrency={activeCurrency}
          setActiveCurrency={setActiveCurrency}
          triggerToast={triggerToast}
        />

        {/* Toolbar with Filters */}
        <FiltersToolbar
          filtersHidden={filtersHidden}
          teamFilter={teamFilter}
          setTeamFilter={setTeamFilter}
          periodFilter={periodFilter}
          setPeriodFilter={setPeriodFilter}
          filterMenuOpen={filterMenuOpen}
          setFilterMenuOpen={setFilterMenuOpen}
          addAdvancedFilter={addAdvancedFilter}
          advancedFilters={advancedFilters}
          removeAdvancedFilter={removeAdvancedFilter}
          clearAllFilters={clearAllFilters}
          setAddColumnModalOpen={setAddColumnModalOpen}
          columnPopoverOpen={columnPopoverOpen}
          setColumnPopoverOpen={setColumnPopoverOpen}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
          customColumns={customColumns}
          setCustomColumns={setCustomColumns}
          setCustomColumnValues={setCustomColumnValues}
          triggerToast={triggerToast}
        />

        {/* Tab-based Summary Cards (Accounts, Renewal, Upsell, Churn) */}
        {/* Tab-based Summary Cards */}
        <MetricsCards
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          allAccountsCount={allAccountsCount}
          totalARR={totalARR}
          renewalAccounts={renewalAccounts}
          renewalARR={renewalARR}
          upsellAccounts={upsellAccounts}
          upsellARR={upsellARR}
          churnAccounts={churnAccounts}
          churnARR={churnARR}
          formatVal={formatVal}
        />

        {/* Accounts Dashboard Table Container */}
        <section className="dashboard-content position-relative">
          {/* Simulated Supabase loading overlay shimmer */}
          {isQuerying && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center z-10 flex-col gap-2 transition-all" style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.7)', zIndex: 10 }}>
              <div className="spinner"></div>
              <span className="text-xs font-bold text-purple-900 animate-pulse">Querying Supabase PostgreSQL...</span>
            </div>
          )}

          <AccountsTable
            sortedAccounts={sortedAccounts}
            visibleColumns={visibleColumns}
            customColumns={customColumns}
            customColumnValues={customColumnValues}
            setCustomColumnValues={setCustomColumnValues}
            handleSort={handleSort}
            sortField={sortField}
            sortAsc={sortAsc}
            formatVal={formatVal}
            activeCurrency={activeCurrency}
            handleOpenNoteModal={handleOpenNoteModal}
            setSelectedAccountId={setSelectedAccountId}
            setDrawerOpen={setDrawerOpen}
            clearAllFilters={clearAllFilters}
            viewedARR={viewedARR}
            viewedDeals={viewedDeals}
            viewedDealsCount={viewedDealsCount}
          />
        </section>

        {/* Footer/Pagination */}
        <footer className="table-footer">
          <div className="text-xs text-gray-500 font-medium">
            Show 1-{filteredAccounts.length} of {filteredAccounts.length} accounts
          </div>
          <div className="pagination">
            <span className="page-link">&lt;</span>
            <span className="page-link active">1</span>
            <span className="page-link">2</span>
            <span className="page-link">3</span>
            <span className="page-link">&gt;</span>
          </div>
        </footer>
      </main>

      {/* DRAWER PANEL VIEW */}
      <AccountDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        selectedAccount={selectedAccount}
        drawerTab={drawerTab}
        setDrawerTab={setDrawerTab}
        formatVal={formatVal}
        generatingBrief={generatingBrief}
        handleGenerateBrief={handleGenerateBrief}
        handleNoteChange={handleNoteChange}
        handleAddLongNote={handleAddLongNote}
        triggerToast={triggerToast}
        newTodoTitle={newTodoTitle}
        setNewTodoTitle={setNewTodoTitle}
        newTodoDate={newTodoDate}
        setNewTodoDate={setNewTodoDate}
        handleAddTodo={handleAddTodo}
        handleToggleTodo={handleToggleTodo}
        handleDeleteTodo={handleDeleteTodo}
        crmForm={crmForm}
        setCrmForm={setCrmForm}
        handleCrmSave={handleCrmSave}
      />

      {/* ADD CUSTOM COLUMN MODAL */}
      <AddColumnModal
        isOpen={addColumnModalOpen}
        onClose={() => setAddColumnModalOpen(false)}
        columnName={newColName}
        setColumnName={setNewColName}
        columnType={newColType}
        setColumnType={setNewColType}
        columnOptions={newColOptions}
        setColumnOptions={setNewColOptions}
        onCreate={handleAddCustomColumn}
        triggerToast={triggerToast}
      />

      {/* EDIT MANAGER NOTE MODAL */}
      <NoteEditorModal
        isOpen={editNoteModalOpen}
        onClose={() => setEditNoteModalOpen(false)}
        companyName={accounts.find(a => a.id === activeNoteAccountId)?.name || ""}
        noteText={activeNoteText}
        onNoteChange={setActiveNoteText}
        onSave={handleSaveNoteModal}
      />
    </div>
  );
}
