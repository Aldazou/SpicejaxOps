# n8n Setup Guide for SpiceJax Command Center

## Prerequisites

- n8n installed and running locally (default: `http://localhost:5678`)
- Basic understanding of n8n workflows and webhooks

## Quick Start

### 1. Configure Environment Variables

Copy `.env.local` and update with your n8n settings:

```bash
N8N_BASE_URL=http://localhost:5678
N8N_API_KEY=your_api_key_here  # Optional, if using API authentication
```

### 2. Create n8n Webhooks

Create the following webhook workflows in n8n:

#### Dashboard Data (`spicejax/dashboard`)
**Webhook URL:** `http://localhost:5678/webhook/spicejax/dashboard`

**Expected Response Format:**
```json
{
  "schedule": [
    {
      "time": "9:00 AM",
      "task": "Instagram Reel - Nashville Heat Wave",
      "status": "upcoming"
    }
  ],
  "approvals": [
    {
      "title": "Blog Post Title",
      "type": "Content",
      "daysWaiting": 2
    }
  ],
  "contentIdeas": [
    {
      "title": "Content Idea",
      "category": "Recipe"
    }
  ],
  "metrics": [
    {
      "label": "Content Published",
      "value": "12",
      "change": "+3"
    }
  ]
}
```

#### Schedule Data (`spicejax/schedule`)
**Webhook URL:** `http://localhost:5678/webhook/spicejax/schedule`

**Expected Response Format:**
```json
[
  {
    "time": "9:00 AM",
    "task": "Task description",
    "status": "upcoming|completed|in-progress"
  }
]
```

#### Content List (`spicejax/content`)
**Webhook URL:** `http://localhost:5678/webhook/spicejax/content`

**Expected Response Format:**
```json
[
  {
    "id": "1",
    "title": "Content Title",
    "status": "Draft|In Review|Published",
    "platform": "Instagram|Blog|Email|TikTok",
    "dueDate": "Nov 20, 2025",
    "type": "Social Post|Article|Video"
  }
]
```

#### Calendar Events (`spicejax/calendar`)
**Webhook URL:** `http://localhost:5678/webhook/spicejax/calendar`

**Expected Response Format:**
```json
[
  {
    "date": "Nov 18",
    "time": "9:00 AM",
    "title": "Event Title",
    "type": "Social Media|Blog|Email|Campaign"
  }
]
```

#### Strategy/KPIs (`spicejax/strategy/kpis`)
**Webhook URL:** `http://localhost:5678/webhook/spicejax/strategy/kpis`

**Expected Response Format:**
```json
{
  "kpis": [
    {
      "metric": "Website Traffic",
      "current": "12,453",
      "target": "15,000",
      "progress": 83
    }
  ],
  "campaigns": [
    {
      "name": "Campaign Name",
      "status": "Active|Planning",
      "budget": "$5,000",
      "spent": "$3,200",
      "roi": "+145%"
    }
  ]
}
```

## Workflow Examples

### Basic Webhook Workflow in n8n

1. **Webhook Trigger Node**
   - Method: GET
   - Path: `spicejax/dashboard`
   - Response: "Using 'Respond to Webhook' Node"

2. **Function Node** (Process your data)
   ```javascript
   return [
     {
       json: {
         schedule: [
           {
             time: "9:00 AM",
             task: "Morning standup",
             status: "upcoming"
           }
         ],
         approvals: [],
         contentIdeas: [],
         metrics: []
       }
     }
   ];
   ```

3. **Respond to Webhook Node**
   - Response: `{{ $json }}`

### Connecting to External Services

You can connect n8n to:
- **Google Calendar** - for schedule data
- **Notion/Airtable** - for content management
- **Google Sheets** - for metrics tracking
- **Social Media APIs** - Instagram, TikTok, etc.
- **Email Services** - Gmail, SendGrid for email campaigns
- **Analytics** - Google Analytics, Mixpanel

## Testing Your Setup

1. Start your n8n instance:
   ```bash
   n8n start
   ```

2. Create a test webhook at `http://localhost:5678/webhook/spicejax/dashboard`

3. Test it with curl:
   ```bash
   curl http://localhost:5678/webhook/spicejax/dashboard
   ```

4. Start your Next.js app:
   ```bash
   npm run dev
   ```

5. Visit `http://localhost:3000/dashboard`

## Available API Endpoints

The Command Center includes these API routes:

- `GET /api/dashboard` - Dashboard overview data
- `GET /api/schedule` - Today's schedule
- `GET /api/content` - Content list
- `POST /api/content` - Create new content
- `GET /api/calendar` - Calendar events
- `GET /api/strategy` - KPIs and campaigns

## Troubleshooting

### Connection Errors

If you see "Connection Error":
1. Ensure n8n is running: `n8n start`
2. Check the URL in `.env.local`
3. Verify webhooks are created in n8n
4. Check n8n logs for errors

### CORS Issues

If running into CORS issues, add to your n8n settings:
```bash
N8N_CORS_ALLOW_ALL=true
```

### Empty Data

If data is empty but no errors:
1. Check webhook response format matches expected structure
2. Look at browser console for data structure
3. Verify n8n workflow is active

## Example n8n Workflow Templates

Check the `/n8n-workflows` folder for example JSON templates you can import into n8n:
- `dashboard-workflow.json` - Complete dashboard data workflow
- `content-management.json` - Content CRUD operations
- `calendar-sync.json` - Calendar integration example

## Next Steps

1. Set up your n8n workflows
2. Connect to your actual data sources
3. Customize the data formats to match your needs
4. Add authentication if needed
5. Deploy to production

## Need Help?

- n8n Documentation: https://docs.n8n.io/
- n8n Community: https://community.n8n.io/
- Next.js API Routes: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

