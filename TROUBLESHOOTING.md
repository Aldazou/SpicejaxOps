# Troubleshooting Guide

## ❌ "Failed to fetch" Error

This is the most common issue! It means your browser can't reach n8n.

### Solution 1: Enable CORS in n8n (Easiest)

**Stop n8n and restart with CORS enabled:**

```bash
N8N_CORS_ALLOW_ALL=true n8n start
```

**Or set it permanently:**

1. Edit (or create) `~/.n8n/.env`
2. Add this line:
   ```
   N8N_CORS_ALLOW_ALL=true
   ```
3. Restart n8n

### Solution 2: Use Docker with CORS

```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -e N8N_CORS_ALLOW_ALL=true \
  n8nio/n8n
```

### Why This Happens

Browsers block requests to different origins (CORS policy). Since your dashboard runs on `localhost:3000` and n8n on `localhost:5678`, they're different origins.

---

## 🔍 Other Common Issues

### Issue: "n8n is not running"

**Check if n8n is running:**
```bash
# Visit this in your browser:
http://localhost:5678
```

**Start n8n:**
```bash
n8n start
```

**Check if something else is using port 5678:**
```bash
lsof -i :5678
```

---

### Issue: "Connection refused"

**Cause:** n8n isn't running or is on a different port.

**Solution:**
1. Make sure n8n is running: `n8n start`
2. Check which port n8n is using (default is 5678)
3. Update your Settings page to match

---

### Issue: Wrong n8n URL

**Common mistakes:**
- ❌ `https://localhost:5678` (should be http for local)
- ❌ `http://localhost:5678/` (no trailing slash)
- ❌ `localhost:5678` (missing http://)

**Correct formats:**
- ✅ `http://localhost:5678`
- ✅ `https://n8n.yourdomain.com`

---

### Issue: Webhook returns 404

**Cause:** Webhook doesn't exist or workflow isn't activated.

**Solution:**
1. Open n8n interface
2. Check your workflow is **Activated** (toggle in top-right)
3. Verify webhook path matches what you're calling
4. Test webhook directly: `http://localhost:5678/webhook/your-path`

---

### Issue: n8n works in browser but not in dashboard

**Cause:** CORS is not enabled.

**Solution:** See "Failed to fetch" fix above.

---

## 🧪 Testing Your Setup

### 1. Test n8n is running

Open browser: `http://localhost:5678`
- ✅ Should see n8n login/interface
- ❌ "Can't reach" = n8n not running

### 2. Test n8n health endpoint

Open browser: `http://localhost:5678/healthz`
- ✅ Should see: `{"status":"ok"}`
- ❌ Error = n8n not responding

### 3. Test a webhook

Create a simple workflow in n8n:
1. Add Webhook node (path: `test`)
2. Add Respond to Webhook node
3. Connect them
4. Activate workflow
5. Test: `http://localhost:5678/webhook/test`
   - Should see a response (even if empty JSON `{}`)

### 4. Test from dashboard

In your dashboard:
```typescript
const { data, error } = useN8N('test');
console.log('Data:', data);
console.log('Error:', error);
```

---

## 🐛 Debug Mode

### Check Browser Console

1. Open dashboard in browser
2. Press F12 (Developer Tools)
3. Go to "Console" tab
4. Look for errors (red text)
5. Common errors and what they mean:

**"Failed to fetch"**
→ CORS issue or n8n not running

**"404 Not Found"**
→ Webhook path doesn't exist

**"net::ERR_CONNECTION_REFUSED"**
→ n8n is not running

**"CORS policy"**
→ CORS not enabled in n8n

### Check Network Tab

1. F12 → Network tab
2. Try connecting to n8n
3. Look for requests to `localhost:5678`
4. Click on the request to see details

---

## 💡 Quick Checklist

Before asking for help, verify:

- [ ] n8n is running (`http://localhost:5678` works in browser)
- [ ] CORS is enabled (`N8N_CORS_ALLOW_ALL=true`)
- [ ] n8n URL in Settings is correct (no trailing slash)
- [ ] Webhook path matches exactly
- [ ] Workflow is activated in n8n (toggle is ON)
- [ ] Browser console shows no CORS errors

---

## 🚀 Production Setup

### Using a Remote n8n Instance

**Example: n8n on VPS/Cloud**

1. Go to Settings
2. Set n8n URL: `https://n8n.yourdomain.com`
3. Add API key if required
4. Save and test

**Make sure:**
- Use HTTPS for remote instances
- CORS is configured on your n8n server
- Firewall allows connections

### Using n8n Cloud

1. Go to Settings
2. Set n8n URL: `https://your-workspace.app.n8n.cloud`
3. Add API key from n8n Cloud dashboard
4. Save and test

---

## 📞 Still Having Issues?

1. Check n8n logs:
   ```bash
   # If running in terminal, logs appear there
   # Or check ~/.n8n/logs/
   ```

2. Verify n8n version:
   ```bash
   n8n --version
   ```

3. Try the Test Connection page:
   `/test-connection` in your dashboard

4. Check if other webhooks work:
   `http://localhost:5678/webhook/test` in browser

---

## ✅ Success Checklist

When everything works:
- ✅ Settings page shows "Connected successfully"
- ✅ Dashboard loads without errors
- ✅ Webhooks return data
- ✅ No CORS errors in browser console
- ✅ Test webhook works in browser

Happy automating! 🌶️

