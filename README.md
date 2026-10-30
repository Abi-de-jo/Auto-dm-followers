<div align="center">
  <br />
  <h1>⚡ AutoDM Followers — Free Instagram DM Automation Engine</h1>
  <p><strong>A high-performance, open Instagram automation engine built directly on Meta's Official Graph API.</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/Next.js-App_Router-black?style=flat&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/Meta_Graph_API-Official-blue?style=flat&logo=meta" alt="Meta Graph API" />
    <img src="https://img.shields.io/badge/PostgreSQL-Database-green?style=flat&logo=postgresql" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/AES--256--GCM-Encrypted-emerald?style=flat" alt="AES-256" />
    <img src="https://img.shields.io/badge/License-MIT-emerald?style=flat" alt="MIT License" />
  </p>
</div>

<br />

---

## 🚀 Overview

**AutoDM Followers** is a lightweight, high-performance Instagram automation platform designed for creators, builders, and developers who want to engage followers automatically without expensive third-party tools.

All you need is to connect your Instagram account and set your keywords. The engine handles comment-to-DM routing, lead capturing, and automated resource dispatching on autopilot.

### Features:

- 💬 **Comment-to-DM Engine**: Automatically triggers private DMs when followers type your keyword on Reels or Posts.
- 📱 **Story Mention Responders**: Detects when followers tag you in their Story and sends them a thank-you message or gift.
- 📥 **Lead Capture**: Captures follower emails directly in chat and syncs them to your database with CSV export.
- 🛡️ **Built-in Safe Rate Pacing**: Human pacing jitter (1.2s to 2.8s) and hourly limits are enabled by default to prevent spam flags and maintain account health.

---

## 🛠️ Quick Start

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/Auto-dm-followers.git
cd Auto-dm-followers
pnpm install # or npm install / bun install
```

### 2. Configure Environment Variables

Copy the example environment configuration:

```bash
cp .env.example .env
```

Fill in your database URL and Meta Developer App credentials from [developers.facebook.com](https://developers.facebook.com).

### 3. Initialize Database

```bash
pnpm db:push
```

### 4. Run Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000` to launch the platform.

---

## 🔒 Security & Privacy

- All OAuth tokens and refresh tokens are encrypted at rest using AES-256-GCM.
- Connects exclusively through Meta's Official Instagram Graph API.
- Zero unofficial browser extensions, scrapers, or password sharing required.

---

## 📄 License

MIT License. Free to use, customize, and self-host.
