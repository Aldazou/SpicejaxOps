# SpiceJax Command Center - Quick Start Guide

## 🚀 Get Started in 3 Minutes

**Simple concept:** Call ANY n8n workflow directly from your frontend. No setup needed!

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up n8n Connection

Create `.env.local` in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
N8N_BASE_URL=http://localhost:5678
```

### 3. Start n8n (if not running)

```bash
# If you have n8n installed globally
n8n start

# OR with npx
npx n8n

# OR with Docker
docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n
```

### 4. Import Example Workflow to n8n

1. Open n8n at `http://localhost:5678`
2. Click "Add Workflow"
3. Click the three dots (⋮) in top right → "Import from File"
4. Import `n8n-workflows/dashboard-example.json`
5. Click "Save" and "Activate" the workflow

### 5. Start the Dashboard

```bash
npm run dev
```

Visit: **http://localhost:3000/dashboard**

---

## ✅ What You Should See

- Dashboard loads without errors
- If n8n is running: Data from your webhook appears
- If n8n is not running: You'll see a connection error with instructions

---

## 🔧 Next Steps

### How It Works

**You create ANY webhook in n8n** → **Call it from frontend with `useN8N('webhook-name')`**

That's it! No predefined endpoints. No configuration. Just create webhooks and call them.

**Example:**

1. Create n8n webhook at path: `my-workflow`
2. In your React component:
```typescript
const { data } = useN8N('my-workflow');
```

Done! 🎉

### Real Examples

**Get Dashboard Data:**
```typescript
const { data } = useN8N('dashboard');
```

**Get Content List:**
```typescript
const { data } = useN8N('content/list');
```

**Create Content:**
```typescript
const { mutate } = useN8NMutation('content/create');
await mutate({ title: 'New Post', body: '...' });
```

**Auto-refresh every 30s:**
```typescript
const { data } = useN8N('dashboard', { refreshInterval: 30000 });
```

See `USAGE.md` for complete documentation!

---

## 🆘 Troubleshooting

### "Connection Error" on Dashboard

**Problem:** Dashboard shows connection error

**Solution:**
1. Check n8n is running: visit `http://localhost:5678`
2. Verify webhook exists: `http://localhost:5678/webhook/spicejax/dashboard`
3. Check `.env.local` has correct URL
4. Restart Next.js: `npm run dev`

### n8n Webhook Returns 404

**Problem:** Webhook URL gives 404

**Solution:**
1. Make sure workflow is **activated** (toggle on top right)
2. Check webhook path matches: `spicejax/dashboard`
3. Webhook method should be `GET`

### Empty Data

**Problem:** Dashboard loads but shows empty cards

**Solution:**
1. Test webhook directly in browser: `http://localhost:5678/webhook/spicejax/dashboard`
2. Check n8n workflow execution log for errors
3. Verify response format matches expected structure (see `N8N_SETUP.md`)

### CORS Errors

**Problem:** Browser console shows CORS errors

**Solution:**
Add to your n8n environment or start with:
```bash
N8N_CORS_ALLOW_ALL=true n8n start
```

---

## 📚 Learn More

- **Full Setup Guide:** `N8N_SETUP.md`
- **n8n Documentation:** https://docs.n8n.io/
- **Example Workflows:** `/n8n-workflows/` folder

---

## 🌶️ Happy Cooking with SpiceJax!

Your marketing command center is ready to go. Connect your favorite tools and automate your workflow!

