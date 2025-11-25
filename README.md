# 🌶️ SpiceJax Command Center

**Bold Global Seasonings. No Fillers. Just Flavor.**

A modern marketing HQ dashboard for [SpiceJax Seasonings](https://spicejaxseasonings.com/), built with Next.js 14 and Tailwind CSS. Chef-crafted seasonings from Miami, FL.

## Features

- **📊 Dashboard**: Real-time overview of marketing activities with key metrics
  - Today's Schedule with product launches and campaigns
  - Pending Approvals for content and recipes
  - Content Generator with AI-powered suggestions
  - Weekly Strategy metrics and bundle performance
- **✍️ Content Hub**: Manage and create marketing content across platforms
  - Track posts for Nashville Heat Wave, Birria Fiesta, and all products
  - Recipe content templates
  - Multi-platform scheduling (Instagram, TikTok, Blog, Email)
- **📅 Calendar**: Plan and schedule marketing campaigns and posts
- **📚 Library**: Digital asset management for product photography and media
- **🎯 Strategy**: Track KPIs, campaigns, and quarterly objectives
  - Monitor bundle performance (Heat Lover's Trio, BBQ Rub Set, etc.)
  - Campaign ROI tracking
  - Product-specific insights
- **💬 Chat Assistant**: Floating AI assistant (UI ready, functionality coming soon)

## SpiceJax Product Line

The dashboard includes data for all SpiceJax products:
- **Birria Fiesta Taco Blend** - Authentic Mexican seasoning
- **Nashville Heat Wave** - Fiery hot chicken spice blend
- **Honey Chipotle BBQ Rub** - Sweet & smoky grilling spice
- **Smoky Honey Habanero Rub** - Fiery sweet BBQ seasoning
- **Shichimi Togarashi Fusion** - Japanese seven-spice blend

Plus product bundles:
- Heat Lover's Trio
- Grill Master Trio
- Sweet Heat & Smoke Duo
- Global Flavors Duo
- The Complete Collection

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Icons**: Emoji-based for quick setup

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- n8n running locally (or remote instance)

### Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Configure n8n connection:**
```bash
cp .env.local.example .env.local
```
Edit `.env.local` with your n8n URL (default: `http://localhost:5678`)

3. **Start n8n** (if not running):
```bash
n8n start
# OR with Docker: docker run -it --rm -p 5678:5678 n8nio/n8n
```

4. **Import example workflow:**
   - Open n8n at http://localhost:5678
   - Import `n8n-workflows/dashboard-example.json`
   - Activate the workflow

5. **Run the dashboard:**
```bash
npm run dev
```

6. **Open** [http://localhost:3000](http://localhost:3000)

📖 **See `QUICKSTART.md` for detailed setup instructions**

## Project Structure

```
SpiceJaxOps/
├── app/
│   ├── api/                 # Next.js API routes (n8n connectors)
│   │   ├── dashboard/       # Dashboard data endpoint
│   │   ├── content/         # Content management endpoints
│   │   ├── schedule/        # Schedule data endpoint
│   │   └── health/          # Health check endpoint
│   ├── dashboard/           # Main dashboard page
│   ├── content/             # Content management page
│   ├── calendar/            # Calendar page
│   ├── library/             # Media library page
│   ├── strategy/            # Strategy & metrics page
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home (redirects to dashboard)
├── components/              # Reusable components
│   ├── MainLayout.tsx       # Main layout wrapper
│   ├── Sidebar.tsx          # Navigation sidebar
│   ├── Header.tsx           # Top header
│   ├── DashboardCard.tsx    # Card component
│   └── ChatAssistant.tsx    # Floating chat widget
├── hooks/
│   └── useN8N.ts            # Custom hook for n8n data fetching
├── lib/
│   ├── n8n.ts               # n8n API client
│   └── products.ts          # SpiceJax product data
├── n8n-workflows/           # Example n8n workflow templates
│   └── dashboard-example.json
├── .env.local               # Environment variables (create from .env.local.example)
└── tailwind.config.ts       # Tailwind configuration
```

## Available Routes

- `/dashboard` - Main marketing dashboard
- `/content` - Content management hub
- `/calendar` - Content calendar and scheduling
- `/library` - Media and document library
- `/strategy` - Marketing strategy and KPIs

## Customization

### Brand Colors

The app uses SpiceJax's warm, bold color palette defined in `tailwind.config.ts`:

- Primary: Orange/Spice tones (#f39e04 and variations) matching the website
- Accent: Complementary warm colors inspired by spices
- Custom gradient backgrounds throughout

### Product Data

Product information is centralized in `lib/products.ts` and includes:
- All 5 signature SpiceJax blends
- Product bundles and collections
- Current promotions (e.g., discount code TD555777)
- Brand messaging and USPs

### Mock Data

All data is currently mocked within the page components. Replace with API calls to your n8n workflows:

```typescript
// Example: Replace mock data with API call
const response = await fetch('/api/n8n/dashboard-data');
const data = await response.json();
```

## Integration with n8n

**n8n is your backend!** This dashboard connects directly to ANY n8n workflow you create.

### How it works:
1. Create a webhook in n8n (e.g., path: `dashboard`)
2. Call it from frontend: `useN8N('dashboard')`
3. Done! ✨

**Example:**
```typescript
// Get data
const { data, loading, error } = useN8N('my-workflow');

// Create data
const { mutate } = useN8NMutation('create-item');
await mutate({ name: 'New Item' });
```

No predefined API routes. No configuration. Call any workflow by its webhook path.

📖 **See `USAGE.md` for complete guide**

## Future Enhancements

- [ ] Authentication system for team members
- [ ] Real API integration with n8n workflows
- [ ] Functional Chat Assistant with AI for content generation
- [ ] File upload for product photography in media library
- [ ] Advanced analytics for product performance
- [ ] Real-time notifications for approvals and schedule
- [ ] Multi-user collaboration features
- [ ] Recipe database integration
- [ ] Customer review management
- [ ] Social media post scheduling automation

## Build for Production

```bash
npm run build
npm start
```

## About SpiceJax

**SpiceJax Seasonings** - Crafted for flavor lovers, by flavor lovers. 

We blend bold spices inspired by global traditions and modern kitchens. Whether you're firing up the grill, spicing up a weeknight meal, or exploring new flavors, our handcrafted seasonings bring the heat, the sweet, and everything in between.

📍 Miami, FL, USA  
📧 spicejaxseasonings@gmail.com  
🌐 [spicejaxseasonings.com](https://spicejaxseasonings.com/)

---

Built with ❤️ for SpiceJax Marketing Team | © 2025 SpiceJax Seasonings - Made by Social360

