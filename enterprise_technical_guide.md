# 📘 Enterprise B2B SaaS Technical Blueprint & Contribution Walkthrough

This document outlines the architectural changes, code contributions, and technical designs built for the **Account Intelligence platform**. It serves as a comprehensive system guide and contribution reference.

---

## 📂 Modular Enterprise File Structure

We transitioned the project from a flat file structure into a scalable, industry-standard modular folder layout. This isolates core views, modular components, helper hooks, and stylesheets cleanly:

```text
account_intelligence_M5/
├── package.json
├── index.html
├── vite.config.js
├── src/
│   ├── main.jsx                 # Virtual DOM rendering controller
│   ├── App.jsx                  # High-fidelity dashboard controller & state router
│   ├── index.css                # Premium HSL color tokens, animations & Glassmorphism styles
│   └── components/              # Modularized UI Components
│       ├── NoteEditorModal.jsx  # Spacious Manager Notes modal popup
│       └── AddColumnModal.jsx   # Custom Columns creation modal popup
```

---

## 🛠️ Core Features Architecture & Code References

### 1. Live Groq Llama-3-70b AI Engine (`src/App.jsx` -> `handleGenerateBrief`)
This feature compiles detailed C-level executive account summaries by constructing a strict system context prompt from the current database records and calling Groq's high-speed API:

*   **File Location**: `src/App.jsx`
*   **Key Function**: `handleGenerateBrief()`
*   **How it Works**:
    1.  Reads the company's active state details (`arr`, `health_score`, `stage`, `industry`, `open_deals_value`, etc.).
    2.  Pipes the parameters into a strictly structured, no-fluff prompt payload enforcing markdown bullet points matching B2B categories.
    3.  Transfers the payload to the Llama-3-70b engine on Groq utilizing a secure auth header.
    4.  Caches the response instantly inside the state (`setSelectedAccount`), updates Supabase's `briefs` table for other managers, and fallbacks cleanly to a local engine if a rate limit occurs.

```javascript
// Reference Logic Snippet inside App.jsx
const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${GROQ_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "llama3-70b-8192",
    messages: [
      { role: "system", content: "You are an elite B2B Strategic Sales Advisor compiling C-Level briefs. Return ONLY raw bullet points." },
      { role: "user", content: `Generate brief for ${selectedAccount.name} with ARR ${selectedAccount.arr}...` }
    ]
  })
});
```

---

### 2. Supabase CRM & Metrics Synchronization (`src/App.jsx` -> `fetchDatabaseData`)
Synchronizes workspace metrics, synced HubSpot contacts, pipeline opportunities, user analysis columns, and history logs into a single centralized database fetch:

*   **File Location**: `src/App.jsx`
*   **Key Function**: `fetchDatabaseData()`
*   **How it Works**:
    1.  Fires highly optimized batch queries to Supabase tables (`accounts`, `contacts`, `deals`, `notes`, `todos`, `briefs`).
    2.  Filters and maps arrays dynamically to populate individual company profiles.
    3.  Pipes raw values to formatted currencies and health scoring rules.

```javascript
// Reference State Sync Logic inside fetchDatabaseData
const { data: dbBriefs } = await supabase.from('briefs').select('*');
const accBrief = (dbBriefs || []).find(b => b.account_id === acc.id);
return {
  ...acc,
  brief: accBrief ? accBrief.content : "Click 'Generate C-Level Brief' to compile Llama-3 insights...",
  contacts: accContacts.map(c => ({ id: c.id, name: c.name, title: c.title, email: c.email })),
  notes: accNotes.map(n => ({ id: n.id, content: n.content, created_by: n.created_by }))
};
```

---

### 3. Enriched Outbound Communication Timeline (`src/App.jsx` -> `Activity Timeline`)
Renders all historical CRM interactions as multi-colored, highly legible timeline events based on the communication medium:

*   **File Location**: `src/App.jsx` (Timeline rendering) & `src/index.css` (Touchpoint styling)
*   **Key Mechanics**:
    *   **Phone Calls** (`Phone` icon): Uses `var(--act-call)` (Vibrant red theme).
    *   **Outbound Emails** (`Mail` icon): Uses `var(--gong-purple-accent)` (Vibrant blue-purple theme).
    *   **QBR Meetings** (`Users` icon): Uses `var(--color-yellow)` (Vibrant yellow theme).
    *   **Slack Chats** (`MessageSquare` icon): Uses `var(--color-green)` (Vibrant green theme).
    *   **CSM Action Items** (`CheckSquare` icon): Uses `var(--color-blue)` (Vibrant cyan-blue theme).

---

### 4. Spacious Notes Modal Editor (`src/components/NoteEditorModal.jsx`)
Resolves narrow table input constraints by providing a spacious, centered editor modal designed for typing detailed B2B executive notes:

*   **File Location**: `src/components/NoteEditorModal.jsx` (Component) & `src/App.jsx` (State integration)
*   **Key Mechanics**:
    *   Exposes a spacious, responsive `<textarea>` styled with glassmorphism.
    *   Auto-selects active account data and updates only when clicking **Save Changes**, preventing hundreds of keystroke Supabase network requests!
    *   Updates both the main dashboard table preview cell and Supabase history seamlessly.

---

### 5. Local Custom Column Builders (`src/components/AddColumnModal.jsx`)
Enables managers to extend their account analysis dashboards locally (storing columns dynamically in `localStorage`) without cluttering main database schemas:

*   **File Location**: `src/components/AddColumnModal.jsx` (Component) & `src/App.jsx` (Column deletion handles)
*   **Key Mechanics**:
    *   Provides inputs for column name, select options, and type (text, checkbox, select dropdown, numbers).
    *   Includes event-decoupled deletion logic (`e.stopPropagation()` / `e.preventDefault()`) ensuring popovers remain open and no bubble-click side-effects occur.
