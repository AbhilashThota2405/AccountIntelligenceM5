# Account Intelligence — Implementation Plan

### Part of: Revenue Intelligence Platform | Codename: Antigravity

---

## Overview

Account Intelligence is the account management layer of the Revenue Intelligence platform. It pulls CRM data (HubSpot) into a centralized board, layers AI-generated insights on top, and allows selective write-back to CRM from the UI.

**Demo flow:**

> CRM (HubSpot) → Sync to Supabase → Board UI → Edit → Write-back to HubSpot (selective fields only)

---

## Tech Stack

| Layer           | Technology            | Role                                         |
| --------------- | --------------------- | -------------------------------------------- |
| Frontend        | Next.js 14 + React    | Board UI, account panel, admin controls      |
| Primary Backend | NestJS                | HubSpot sync, REST API, CRM write-back       |
| AI Backend      | FastAPI               | Brief generation, Ask Anything (placeholder) |
| Database        | Supabase (PostgreSQL) | App data store, schema migrations            |
| CRM             | HubSpot               | Source of truth for account data             |

---

## Repository Structure

```
antigravity/
├── apps/
│   ├── web/                    # Next.js frontend
│   ├── api/                    # NestJS backend
│   └── ai-service/             # FastAPI AI service
├── packages/
│   └── shared-types/           # Shared TypeScript types
└── docker-compose.yml
```

---

## Phase 0 — Environment Setup

### 0.1 Environment Variables

**apps/api/.env**

```env
SUPABASE_URL=<your-supabase-url>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
HUBSPOT_ACCESS_TOKEN=<your-private-app-token>
AI_SERVICE_URL=http://localhost:8000
PORT=3001
```

**apps/web/.env.local**

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

**apps/ai-service/.env**

```env
SUPABASE_URL=<your-supabase-url>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
GROQ_API_KEY=<your-groq-api-key>
```

---

## Phase 1 — Database Schema

THIS IS THE SQL SCHEMA FOR THE DATABASE. NO NEED TO RUN THIS BECAUSE IT HAS ALREADY BEEN SET UP BY LOKESH

### Full Schema

```sql
-- Accounts (synced from HubSpot Companies)
create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  hubspot_id text unique not null,
  name text not null,
  arr numeric(12,2),
  segment text check (segment in ('Enterprise', 'Mid-Market', 'SMB')),
  region text,
  health_score integer check (health_score between 0 and 100),
  stage text check (stage in ('Active', 'At-Risk', 'New', 'Churned')),
  renewal_date date,
  contract_start date,
  next_qbr_date date,
  owner_name text,
  owner_email text,
  industry text,
  last_synced_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Contacts (synced from HubSpot Contacts)
create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  hubspot_id text unique not null,
  account_id uuid references public.accounts(id) on delete cascade,
  name text,
  title text,
  email text,
  is_primary boolean default false,
  created_at timestamptz default now()
);

-- Deals (synced from HubSpot Deals)
create table public.deals (
  id uuid primary key default gen_random_uuid(),
  hubspot_id text unique not null,
  account_id uuid references public.accounts(id) on delete cascade,
  name text,
  value numeric(12,2),
  stage text,
  close_date date,
  created_at timestamptz default now()
);

-- Transcripts (seeded directly to DB)
create table public.transcripts (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references public.accounts(id) on delete cascade,
  title text,
  content text,
  call_date timestamptz,
  participants text[],
  created_at timestamptz default now()
);

-- Activity log (app-native engagement tracking)
create table public.activities (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references public.accounts(id) on delete cascade,
  type text check (type in ('call', 'email', 'meeting', 'login')),
  description text,
  activity_date timestamptz,
  created_by text,
  created_at timestamptz default now()
);

-- AI briefs (pre-generated, stored output)
create table public.briefs (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references public.accounts(id) on delete cascade,
  content text,
  generated_at timestamptz default now()
);

-- Notes (rep-written, app-native)
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references public.accounts(id) on delete cascade,
  content text,
  created_by text,
  created_at timestamptz default now()
);

-- To-dos (task layer, app-native)
create table public.todos (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references public.accounts(id) on delete cascade,
  title text not null,
  is_done boolean default false,
  due_date date,
  assigned_to text,
  created_at timestamptz default now()
);

-- Boards (multi-board support per org)
create table public.boards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  config jsonb default '{}',
  created_by text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Board tabs (each board has multiple tabs with filter config)
create table public.board_tabs (
  id uuid primary key default gen_random_uuid(),
  board_id uuid references public.boards(id) on delete cascade,
  name text not null,
  filter_config jsonb not null default '{}',
  sort_order integer default 0,
  created_at timestamptz default now()
);
```

---

## Phase 2 — NestJS Backend (apps/api)

### 2.1 Module Structure

```
apps/api/src/
├── hubspot/
│   ├── hubspot.module.ts
│   ├── hubspot.service.ts       # HubSpot API client
│   └── hubspot-sync.service.ts  # Pull from HubSpot → upsert to Supabase
├── accounts/
│   ├── accounts.module.ts
│   ├── accounts.controller.ts   # GET /accounts, PATCH /accounts/:id
│   └── accounts.service.ts
├── boards/
│   ├── boards.module.ts
│   ├── boards.controller.ts     # CRUD for boards + tabs
│   └── boards.service.ts
├── activities/
│   └── ...
├── supabase/
│   ├── supabase.module.ts
│   └── supabase.service.ts      # Shared Supabase client
└── main.ts
```

### 2.2 HubSpot Sync Flow

**hubspot-sync.service.ts — what it does:**

1. Calls `GET https://api.hubapi.com/crm/v3/objects/companies?properties=name,annualrevenue,account_segment,health_score,renewal_date,next_qbr_date,industry`
2. For each company, upserts into `public.accounts` using `hubspot_id` as the conflict key
3. Same for contacts and deals
4. Records `last_synced_at` timestamp

**Trigger options (pick one for demo):**

- Manual: `POST /sync/trigger` — call this once at demo start
- Cron: run every 5 minutes via `@nestjs/schedule`

### 2.3 Key API Endpoints

#### Accounts

```
GET    /accounts                  → list all accounts (with filters: segment, tab logic, owner)
GET    /accounts/:id              → single account with contacts, deals, activities
PATCH  /accounts/:id              → update write-back fields + sync to HubSpot
POST   /sync/trigger              → manual HubSpot sync
```

#### Boards

```
GET    /boards                    → list all boards
POST   /boards                    → create board
PUT    /boards/:id                → update board
DELETE /boards/:id                → delete board
POST   /boards/:id/duplicate      → duplicate board
GET    /boards/:id/tabs           → get tabs for board
POST   /boards/:id/tabs           → create tab
PATCH  /boards/:id/tabs/:tabId    → update tab filter config
```

#### Supporting

```
GET    /accounts/:id/activities   → activity timeline
GET    /accounts/:id/briefs       → AI brief
GET    /accounts/:id/notes        → notes
POST   /accounts/:id/notes        → create note
GET    /accounts/:id/todos        → to-dos
PATCH  /accounts/:id/todos/:tid   → update to-do
```

### 2.4 Write-Back Fields (CRM ↔ DB)

Only these fields write back to HubSpot when edited on the board:

| Field         | HubSpot Property |
| ------------- | ---------------- |
| health_score  | health_score     |
| renewal_date  | renewal_date     |
| next_qbr_date | next_qbr_date    |
| arr           | annualrevenue    |

Everything else (notes, todos, briefs, activity log) is app-native — no write-back.

### 2.5 Tab Filter Logic

Each board tab stores a `filter_config` JSON in `board_tabs`. Example configs:

```json
// Needs Engagement
{
  "health_score": { "max": 45 },
  "last_activity_days": { "min": 30 }
}

// Renewing Soon
{
  "renewal_date": { "within_days": 60 }
}

// Strategic
{
  "health_score": { "min": 65 },
  "arr": { "min": 150000 }
}
```

The accounts service reads this config and builds the appropriate Supabase query.

---

## Phase 3 — FastAPI AI Service (apps/ai-service)

### 3.1 Structure

```
apps/ai-service/
├── main.py
├── routes/
│   ├── briefs.py         # POST /briefs/generate
│   └── ask.py            # POST /ask  ← placeholder only
├── services/
│   └── brief_generator.py
└── requirements.txt
```

### 3.2 Endpoints

#### Brief Generation

```
POST /briefs/generate
Body: { "account_id": "uuid" }

Flow:
1. Fetch account data from Supabase (CRM fields + transcripts)
2. Call Groq API (model: llama-3.3-70b-versatile) with a structured prompt
3. Store result in public.briefs
4. Return brief content
```

**Prompt structure:**

```
You are a CSM intelligence assistant. Generate a concise account brief (150–200 words) for:

Account: {name} | ARR: ${arr} | Segment: {segment} | Health: {health_score}/100
Recent transcripts: {transcript_content}

Cover: relationship status, key risks or opportunities, recommended next action.
```

#### Ask Anything (Placeholder)

```
POST /ask
Body: { "account_id": "uuid", "query": "string" }
Response: { "answer": "This feature is coming soon." }
```

This is wired up in the UI to show the input box and response area, but always returns the placeholder. No AI call needed.

### 3.3 Brief Seeding (for demo stability)

Don't generate briefs live during the demo. Instead, run a seeder:

```bash
# Seed all 15 account briefs before the demo
python seed_briefs.py
```

This calls `/briefs/generate` for each account and stores results. During the demo, the UI just fetches from `public.briefs` — no live generation needed.

---

## Phase 4 — Next.js Frontend (apps/web)

### 4.1 Page Structure

```
apps/web/
├── app/
│   ├── board/
│   │   └── [boardId]/
│   │       └── page.tsx          # Main board view
│   ├── admin/
│   │   └── boards/
│   │       └── page.tsx          # Admin: manage boards
│   └── layout.tsx
├── components/
│   ├── board/
│   │   ├── AccountBoard.tsx       # Top-level board container
│   │   ├── BoardTabs.tsx          # Tab switcher with counts + ARR
│   │   ├── AccountTable.tsx       # Account rows with columns
│   │   ├── AccountRow.tsx         # Single row with inline edit
│   │   ├── ColumnConfig.tsx       # Column visibility/order toggle
│   │   └── FilterBar.tsx          # Team member / date filters
│   ├── panel/
│   │   ├── AccountPanel.tsx       # Slide-out panel container
│   │   ├── PanelOverview.tsx      # Overview tab
│   │   ├── PanelActivity.tsx      # Activity timeline (21 days)
│   │   ├── PanelBriefs.tsx        # AI brief display
│   │   ├── PanelTodos.tsx         # To-do list
│   │   ├── PanelNotes.tsx         # Notes
│   │   ├── PanelCRM.tsx           # CRM fields (editable)
│   │   └── AskAnything.tsx        # Placeholder NL query input
│   └── admin/
│       ├── BoardManager.tsx       # Create/edit/delete/duplicate boards
│       └── TabConfigurator.tsx    # Configure tabs per board
```

### 4.2 Board UI — What Each Part Displays

| Component             | Data Source         | Edit? | Write-back to CRM? |
| --------------------- | ------------------- | ----- | ------------------ |
| Account name          | Supabase            | No    | No                 |
| ARR                   | Supabase (HubSpot)  | Yes   | Yes                |
| Health Score          | Supabase (HubSpot)  | Yes   | Yes                |
| Renewal Date          | Supabase (HubSpot)  | Yes   | Yes                |
| Segment / Region      | Supabase (HubSpot)  | No    | No                 |
| Engagement indicator  | Activities table    | No    | No                 |
| Tab count + ARR total | Computed from query | No    | No                 |

### 4.3 Account Panel Tabs

| Tab      | Content                                          |
| -------- | ------------------------------------------------ |
| Overview | Key CRM stats, primary contact, deal info        |
| Activity | Timeline of calls/emails/meetings (last 21 days) |
| Briefs   | AI-generated account brief                       |
| To-dos   | Checklist, add/complete tasks                    |
| Notes    | Free-text notes, add new                         |
| CRM      | Editable CRM fields with save → write-back       |

### 4.4 Engagement Indicator Logic

```typescript
// Compute based on most recent activity date
const getEngagementLevel = (lastActivityDate: Date) => {
  const daysSince = differenceInDays(new Date(), lastActivityDate);
  if (daysSince <= 7) return "high"; // green dot
  if (daysSince <= 30) return "medium"; // yellow dot
  return "low"; // red dot
};
```

---

## Phase 5 — Seed Non-CRM Data

After HubSpot sync runs and accounts are in Supabase, seed the following directly into the DB:

### 5.1 Transcripts

Generate 2–3 per account using this prompt template in Claude/GPT:

```
Generate a realistic 350-word B2B call transcript between a CSM and the {title}
at {account_name}, a {industry} company. Health score is {health_score}/100.
Cover: recent support issues, renewal discussion, next steps.
Format as back-and-forth dialogue. Include date and participants.
```

Paste outputs into a `seed_transcripts.ts` script and run it.

### 5.2 Activities

Script-generate per account:

- At-Risk accounts: last activity 45–60 days ago, sparse entries
- Renewing Soon: activity 10–20 days ago, some calls
- Strategic: activity within 7 days, dense entries

### 5.3 Execution Order

```bash
# 1. Run HubSpot sync first
curl -X POST http://localhost:3001/sync/trigger

# 2. Seed transcripts
npx ts-node apps/api/src/seeds/seed_transcripts.ts

# 3. Seed activities
npx ts-node apps/api/src/seeds/seed_activities.ts

# 4. Generate and store briefs
python apps/ai-service/seed_briefs.py

# 5. Verify
# Check board: all 3 tabs populated, accounts show engagement indicators
```

---

## Phase 6 — Admin Controls

Accessible at `/admin/boards`. Functionality:

| Action              | Behavior                                                        |
| ------------------- | --------------------------------------------------------------- |
| Create board        | Name + description, creates default 3 tabs                      |
| Edit board          | Rename, update tab filter configs                               |
| Duplicate board     | Copies board + all tab configs                                  |
| Delete board        | Soft delete (keeps data)                                        |
| Permission profiles | Basic: owner-only, team, org-wide (stored in board config JSON) |

---

## Demo Script (What to Show)

1. **Open board** → 3 tabs visible, account counts and total ARR shown per tab
2. **Click "Needs Engagement" tab** → At-risk accounts with red engagement dots
3. **Inline edit health score** on one account → field updates, writes back to HubSpot
4. **Click an account row** → slide-out panel opens
5. **Panel: Overview tab** → ARR, contacts, deal stage
6. **Panel: Activity tab** → timeline of calls and emails
7. **Panel: Briefs tab** → AI-generated brief loads
8. **Panel: CRM tab** → edit renewal date → save → confirm it updated in HubSpot
9. **Panel: Ask Anything** → type a question → placeholder response shown
10. **Switch to Admin** → show board creation, tab config

---

## What's Frontend-Only (No Persistence)

- Column reordering/visibility toggle (React state only)
- Tab switching animation
- Ask Anything input/response (always placeholder)
- Hover states, expanded row previews

These look interactive but require no backend. Keeps the demo clean.

---

## Summary: What Writes Where

| Action             | Updates DB | Updates HubSpot |
| ------------------ | ---------- | --------------- |
| HubSpot sync       | ✅         | —               |
| Edit health score  | ✅         | ✅              |
| Edit ARR           | ✅         | ✅              |
| Edit renewal date  | ✅         | ✅              |
| Edit next QBR date | ✅         | ✅              |
| Add note           | ✅         | ❌              |
| Add to-do          | ✅         | ❌              |
| Generate brief     | ✅         | ❌              |
| Column config      | ❌         | ❌              |
| Ask Anything       | ❌         | ❌              |
