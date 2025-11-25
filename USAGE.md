# How to Use SpiceJax Command Center with n8n

## 🎯 Simple Concept

**Frontend** (Next.js) → **Generic API Route** → **n8n Workflows**

You call ANY n8n workflow by its webhook path. No predefined endpoints needed!

---

## 🚀 Quick Start

### 1. Create a Webhook in n8n

1. Open n8n at http://localhost:5678
2. Create a new workflow
3. Add a **Webhook** node
4. Set the path (e.g., `dashboard` or `spicejax/dashboard`)
5. Add your logic (Function, Database, API calls, etc.)
6. Add **Respond to Webhook** node at the end
7. **Activate** the workflow

### 2. Call it from Your Frontend

```typescript
import { useN8N } from '@/hooks/useN8N';

function MyComponent() {
  // Call the webhook at: http://localhost:5678/webhook/dashboard
  const { data, loading, error } = useN8N('dashboard');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{JSON.stringify(data)}</div>;
}
```

That's it! No API routes to create, no configuration needed.

---

## 📚 Examples

### Example 1: Fetch Dashboard Data

**n8n Workflow:**
- Webhook path: `dashboard`
- Returns: Dashboard data

**Frontend:**
```typescript
const { data } = useN8N('dashboard');
// Calls: /api/n8n/dashboard → http://localhost:5678/webhook/dashboard
```

### Example 2: Get Content List

**n8n Workflow:**
- Webhook path: `content/list`
- Returns: Array of content items

**Frontend:**
```typescript
const { data } = useN8N('content/list');
// Calls: /api/n8n/content/list → http://localhost:5678/webhook/content/list
```

### Example 3: Create New Content (POST)

**n8n Workflow:**
- Webhook path: `content/create`
- Method: POST
- Accepts: { title, body, platform }

**Frontend:**
```typescript
const { mutate, loading } = useN8NMutation('content/create');

const handleCreate = async () => {
  const result = await mutate({
    title: 'New Blog Post',
    body: 'Content here...',
    platform: 'Blog'
  });
  
  console.log('Created:', result);
};
```

### Example 4: Update Content (PUT)

**Frontend:**
```typescript
const { mutate } = useN8NMutation('content/update', 'PUT');

await mutate({
  id: 123,
  title: 'Updated Title'
});
```

### Example 5: Delete Content (DELETE)

**Frontend:**
```typescript
const { mutate } = useN8NMutation('content/delete', 'DELETE');

await mutate({ id: 123 });
```

### Example 6: Auto-refresh Data

```typescript
// Refresh data every 30 seconds
const { data } = useN8N('dashboard', { 
  refreshInterval: 30000 
});
```

### Example 7: Manual Refetch

```typescript
const { data, refetch } = useN8N('dashboard');

// Later, manually refresh
const handleRefresh = () => {
  refetch();
};
```

---

## 🏗️ n8n Workflow Structure

### Basic GET Workflow

```
┌─────────────┐      ┌──────────────┐      ┌─────────────────────┐
│   Webhook   │ ───▶ │   Function   │ ───▶ │ Respond to Webhook  │
│  (GET)      │      │  (Your logic)│      │                     │
└─────────────┘      └──────────────┘      └─────────────────────┘
```

**Example Function Node:**
```javascript
return [
  {
    json: {
      schedule: [
        { time: "9:00 AM", task: "Task 1", status: "upcoming" }
      ],
      metrics: [
        { label: "Views", value: "1,234", change: "+10%" }
      ]
    }
  }
];
```

### POST Workflow (with Database)

```
┌─────────────┐      ┌───────────┐      ┌──────────┐      ┌─────────────────────┐
│   Webhook   │ ───▶ │  Postgres │ ───▶ │ Function │ ───▶ │ Respond to Webhook  │
│  (POST)     │      │  (INSERT) │      │ (Format) │      │                     │
└─────────────┘      └───────────┘      └──────────┘      └─────────────────────┘
```

### Advanced: Connect Multiple Services

```
┌──────────────┐     ┌────────────────┐     ┌──────────┐
│   Webhook    │ ──▶ │ Google Sheets  │ ──▶ │          │
└──────────────┘     └────────────────┘     │          │
                                             │ Merge    │ ──▶ Respond
                     ┌────────────────┐     │          │
                  ──▶│   Airtable     │ ──▶ │          │
                     └────────────────┘     └──────────┘
```

---

## 🎨 Real World Usage

### Dashboard Page

```typescript
"use client";
import { useN8N } from '@/hooks/useN8N';

export default function Dashboard() {
  const { data, loading, error } = useN8N('dashboard');
  
  return (
    <div>
      <h1>Dashboard</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && (
        <>
          <Schedule items={data.schedule} />
          <Metrics data={data.metrics} />
        </>
      )}
    </div>
  );
}
```

### Content Management

```typescript
"use client";
import { useN8N, useN8NMutation } from '@/hooks/useN8N';

export default function ContentManager() {
  const { data: content, refetch } = useN8N('content/list');
  const { mutate: createContent } = useN8NMutation('content/create');
  const { mutate: deleteContent } = useN8NMutation('content/delete', 'DELETE');
  
  const handleCreate = async (formData) => {
    await createContent(formData);
    refetch(); // Refresh the list
  };
  
  const handleDelete = async (id) => {
    await deleteContent({ id });
    refetch();
  };
  
  return (
    <div>
      {content?.map(item => (
        <div key={item.id}>
          <h3>{item.title}</h3>
          <button onClick={() => handleDelete(item.id)}>Delete</button>
        </div>
      ))}
      <CreateForm onSubmit={handleCreate} />
    </div>
  );
}
```

---

## 🔥 Pro Tips

### 1. Organize Your Webhooks

Use paths with structure:
- `dashboard` - Main dashboard
- `content/list` - Get content
- `content/create` - Create content
- `content/update` - Update content
- `analytics/metrics` - Get metrics
- `calendar/events` - Get events

### 2. Standard Response Format

Keep your n8n responses consistent:

```json
{
  "success": true,
  "data": { ... },
  "message": "Success"
}
```

Or for lists:
```json
[
  { "id": 1, "title": "Item 1" },
  { "id": 2, "title": "Item 2" }
]
```

### 3. Error Handling in n8n

Add an **Error Trigger** node to catch failures:

```javascript
// In Respond to Webhook after error
return [
  {
    json: {
      success: false,
      error: "Something went wrong",
      message: $error.message
    }
  }
];
```

### 4. Add Query Parameters

```typescript
// Frontend
const { data } = useN8N('content/list?status=published&limit=10');

// n8n can access these in $request.query
```

### 5. Authentication (if needed)

```typescript
// Add headers to the API route
// In app/api/n8n/[...path]/route.ts, add:
headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer your-token'
}
```

---

## 📦 What's Included

```
Frontend Hook → Next.js API Route → n8n Webhook
     ↓                ↓                   ↓
  useN8N()    /api/n8n/[...path]   /webhook/your-path
```

**Files:**
- `hooks/useN8N.ts` - React hooks for fetching data
- `app/api/n8n/[...path]/route.ts` - Generic proxy to n8n
- `lib/n8n.ts` - Utility functions (optional)

**No configuration needed!** Just create webhooks in n8n and call them.

---

## 🌶️ You're Ready!

1. Create webhook in n8n
2. Call it with `useN8N('webhook-name')`
3. Done!

n8n is your backend. Build any workflow you want! 🚀

