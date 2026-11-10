<div align="center">
  <br />
  <h1>⚙️ AutoDM Followers</h1>
  <p><strong>Free Instagram Auto-Reply &amp; Auto-DM Automation — built on Meta's Official API.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-App_Router-black?style=flat&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/Meta_Graph_API-Official-blue?style=flat&logo=meta" alt="Meta Graph API" />
    <img src="https://img.shields.io/badge/Neon_PostgreSQL-Database-00e599?style=flat&logo=neondb&logoColor=white" alt="Neon" />
    <img src="https://img.shields.io/badge/Deploy-Vercel-black?style=flat&logo=vercel" alt="Vercel" />
    <img src="https://img.shields.io/badge/License-MIT-emerald?style=flat" alt="MIT License" />
  </p>
</div>

<br />

> 💡 **New to code? No problem.**
> This guide is written for **complete beginners** — every step is spelled out.
> Follow it top-to-bottom and your app will be live on the internet in about **20 minutes**.

---

## 📖 Table of Contents

| # | Section | What you'll do |
|---|---------|----------------|
| 1 | [What does this app do?](#-what-does-this-app-do) | Understand the project |
| 2 | [What you need before starting](#-what-you-need-before-starting) | Get your account & tools ready |
| 3 | [Step 1 — Download the project](#step-1--download-the-project) | Clone the repo |
| 4 | [Step 2 — Install dependencies](#step-2--install-dependencies) | Install packages |
| 5 | [Step 3 — Get your FREE Neon database](#step-3--get-your-free-neon-database) | Create Neon DB & copy the connection string |
| 6 | [Step 4 — Set up your secret keys (.env)](#step-4--set-up-your-secret-keys-env) | Fill in environment variables |
| 7 | [Step 5 — Create the database tables](#step-5--create-the-database-tables) | Run `pnpm db:push` |
| 8 | [Step 6 — Run the app on your computer](#step-6--run-the-app-on-your-computer) | Run locally |
| 9 | [Step 7 — Put it online FREE with Vercel](#step-7--put-it-online-free-with-vercel) | Deploy to Vercel |
| 10 | [Privacy Policy & Terms pages](#-privacy-policy--terms-pages-required-by-meta) | Add your privacy/terms URLs |
| 11 | [Troubleshooting](#-troubleshooting-common-problems) | Fix common errors |
| 12 | [Security](#-security-highlights) | How your data is protected |

---

## 💬 What does this app do?

**AutoDM Followers** automatically sends Instagram Direct Messages (DMs) to your followers — for free — using **Meta's Official API** (no bots, no hacks, no account bans).

Here's how it works in plain English:

- 🔑 Someone comments your **keyword** (e.g. `"LINK"`) on your Reel or Post
- ⚡ The app instantly detects the comment
- 📩 It sends that person a **private DM** with your link, file, coupon, or message
- 📧 If you ask for it, the app also captures their **email address** into your lead list (CSV export included)
- 🛡️ Messages are sent slowly like a real human (1.2s–2.8s random delays) so Instagram never flags you

You can also auto-thank followers who **mention you in their Story**.

---

## ✅ What you need before starting

Get these 4 free things first. (Click each link to sign up — takes a few minutes.)

| # | What | Why | Get it free at |
|---|------|-----|----------------|
| 1 | **A computer with Node.js 18+** | Runs the app | nodejs.org (pick the "LTS" version) |
| 2 | **A Neon database account** | Stores your users, leads, automations | https://neon.tech |
| 3 | **A Vercel account** | Puts your app online for free | https://vercel.com |
| 4 | **A Meta Developer App** | Lets Meta approve your Instagram auto-messages | https://developers.facebook.com |

> ⚠️ **Important:** Meta requires an approved Developer App (and typically a business verification) before auto-DMs switch from test to live mode. Until then, you can still build and test everything locally using mock mode (`MOCK_INSTAGRAM_SEND=true`, explained in Step 4) to see the whole flow working end-to-end.

---

# 🚀 Full Setup Guide (Beginner-Friendly)

---

## Step 1 — Download the project

Open your terminal (or VS Code → Terminal → New Terminal) and copy-paste:

```bash
git clone https://github.com/Abi-de-jo/Auto-dm-followers.git
cd Auto-dm-followers
```

> 💡 **What just happened?** You downloaded a copy of the project and stepped inside its folder.

**Don't want to use the terminal at all?** Click the green **`<> Code`** button on the GitHub page → **"Download ZIP"** → unzip it → open the folder in VS Code. That's fine too.

---

## Step 2 — Install dependencies

Install all the building blocks the app needs (this downloads ~500MB, only needed once):

```bash
pnpm install
```

> 💡 Don't have `pnpm`? Run `npm install -g pnpm` once, **or** just use `npm install` instead — both work.
>
> 💡 **What is this?** Like downloading all the LEGO pieces before you build. You never have to do it again on your computer.

---

## Step 3 — Get your FREE Neon database

Neon is a **cloud database** (your app's memory). The free tier is genuinely free — no credit card.

### 🟩 How to get your Neon connection string

1. **Go to** → https://neon.tech → click **"Sign Up"** → sign in with Google or GitHub (easiest option).
2. On the dashboard, click the big **"Create project"** button.
3. **Project name:** type `autodm` → click **"Create project"**.
4. Neon now creates a database and — 🎉 — **automatically shows a popup titled "Connect to your database"**.
5. Choose **"With ORM" → Prisma** (our app uses Prisma) or just pick **"Connection string"**.
6. **Copy the long string. It looks like this:**

```text
postgresql://alex:AbC123xyz@ep-curly-sun-abc123.us-east-2.aws.neon.tech/neondb?sslmode=require
```

That string is called your **`DATABASE_URL`** — save it somewhere private (a password manager or a temporary `.txt` file). It is simply your database's address + username + password packed into one line.

> 🔐 **Security rule #1:** Never share this string, never screenshot it, never commit it to GitHub. Anyone who has it can read and delete all your data.

### Where the string goes

It gets pasted into a file you'll create in the next step, and later into Vercel's settings. That's its only job.

> 💡 **Which string to use on Vercel?** Neon gives you two: a **pooled** one (contains `-pooler` in the address) and a **direct** one. Use the **pooled** one for the app on Vercel (better for serverless), and the **direct** string if `db:push` complains. In practice both usually work.

---

## Step 4 — Set up your secret keys (.env)

Create your local settings file by copying the built-in template:

```bash
cp .env.example .env
```

Now open the `.env` file in your editor and fill it in. Here's **every variable explained in plain English:**

<details open>
<summary><strong>🔐 Click to expand: every .env variable explained</strong></summary>

| Variable | What it means | What to put here |
|----------|---------------|------------------|
| `DATABASE_URL` | Where your database lives | **Paste your Neon connection string** from Step 3 |
| `NEXTAUTH_URL` | Your app's address | `http://localhost:3000` for local testing. **On Vercel:** `https://your-app-name.vercel.app` |
| `NEXTAUTH_SECRET` | Random security key for login sessions | Run `openssl rand -base64 32` in the terminal and paste the output |
| `NEXT_PUBLIC_APP_URL` | Same as NEXTAUTH_URL, but public | Same value as above |
| `INSTAGRAM_APP_ID` + `INSTAGRAM_APP_SECRET` | Your Meta app's ID + password | From https://developers.facebook.com → your app → **App Settings → Basic** |
| `INSTAGRAM_CLIENT_ID` / `INSTAGRAM_CLIENT_SECRET` | Same values, different name | Same as above |
| `META_APP_SECRET` | Same as `INSTAGRAM_APP_SECRET` | Same as above |
| `VERIFY_TOKEN` | A password Meta uses to "handshake" with your webhook | Make up any long random word, e.g. `my-secret-verify-token-2024` — then use the **same exact string** in your Meta App Dashboard webhook settings |
| `TOKEN_ENCRYPTION_KEY` | Encrypts Instagram tokens stored in your DB | Run `openssl rand -hex 32` in the terminal and paste the output |
| `HOURLY_REPLY_LIMIT` | Max DMs per hour (anti-ban pacing) | Leave the default `60` |
| `MOCK_INSTAGRAM_SEND` | Test mode toggle | `true` = send fake messages while testing locally (great for first run). `false` = real messages |
| `BREVO_API_KEY` | Optional: sends emails through Brevo | Leave empty if you don't need email |
| `BREVO_SENDER_EMAIL` / `BREVO_SENDER_NAME` | Optional: who the email comes from | Leave empty if you don't need email |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` | Optional: alternative to Brevo | Leave empty if you don't need email |
| `CRON_SECRET` | Protects scheduled background jobs | Run `openssl rand -hex 32` once locally |

</details>

> 💡 **On Windows and `openssl` doesn't work?** Generate a random key at https://www.random.org/strings/ or run this instead:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

---

## Step 5 — Create the database tables

Tell your Neon database to create all the tables the app needs (users, leads, automations, messages...):

```bash
pnpm db:push
```

> ✅ **Success looks like:** a message ending with "…Your database is now in sync with your schema" and "Generate client" — nothing was created in your app folder; it all happened inside Neon in the cloud.
>
> 💡 Run this again any time you update the database schema (`prisma/schema.prisma`) — it re-syncs forever, no migrations needed.

**Want to *see* your database?** Run `pnpm db:studio` — it opens a live visual spreadsheet of everything in Neon at `http://localhost:5555`.

---

## Step 6 — Run the app on your computer

```bash
pnpm dev
```

Then open your browser at:

```text
http://localhost:3000
```

🎉 You should see the AutoDM homepage.

> ⛔ To stop the app: press `Ctrl + C` in the terminal.
> 🔁 Whenever you come back to work on it, just run `pnpm dev` again.

---

## Step 7 — Put it online FREE with Vercel

Vercel (made by the same people who made Next.js) hosts your app on the internet — free.

### 7.1 Push your code to GitHub

Your clone lives on your computer only. Vercel deploys **from GitHub**, so upload it:

1. Create a new **empty private repo** at https://github.com/new — name it anything (e.g. `my-autodm`), do **not** add a README.
2. In your project terminal, run these 5 commands exactly:

```bash
git remote rename origin upstream
git remote add origin https://github.com/YOUR-USERNAME/my-autodm.git
git add -A
git commit -m "Initial commit"
git push -u origin main
```

3. **Check that `.env` is NOT uploaded.** It contains your database password. It should already be excluded by `.gitignore` — if a red banner on GitHub shows `.env` committed, delete the file from GitHub immediately and re-generate your keys.

### 7.2 Connect it to Vercel

1. Go to https://vercel.com → **Sign in with GitHub** (same account).
2. Click **"Add New…" → "Project"** → find your `my-autodm` repo → **"Import"**.
3. Vercel auto-detects Next.js — don't change framework or build settings.
4. Open the **"Environment Variables"** section. Copy **every key–value pair** from your local `.env` file here, one by one. **Change two of them for the live app:**

| Variable | Local (Step 4) | Vercel — change to |
|----------|-----------------|--------------------|
| `NEXTAUTH_URL` | `http://localhost:3000` | `https://my-autodm.vercel.app` (your real URL) |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | `https://my-autodm.vercel.app` (your real URL) |

> 💡 Vercel shows you the final URL on the next screen — exact address may be `my-autodm-xxxx.vercel.app`. Use whatever it shows (you can also add your own custom domain later in Vercel's **Settings → Domains**, then update these two vars to your domain).

5. Click **"Deploy"** and wait ~2 minutes. Your app goes live. 🚀
6. **Return later:** whenever your app has code changes you want live, run `git push` from your project folder — Vercel redeploys automatically on every push.

### ✅ Post-deploy checklist

- [ ] App loads at `https://my-autodm.vercel.app`
- [ ] Login works (Google sign-in) — if Google login fails, your Google OAuth app's redirect URIs must include your Vercel URL
- [ ] Data saves into the **same Neon database** used locally (check with `pnpm db:studio` — it reads the live Neon DB, both point to it)
- [ ] Meta webhook points to `https://my-autodm.vercel.app/api/webhooks/instagram` with your `VERIFY_TOKEN`

---

## 🔒 Privacy Policy & Terms pages (required by Meta)

Meta **requires** every app to publicly serve a **Privacy Policy URL**, **Terms of Service URL**, and a **Data Deletion callback URL** in App Settings → Basic. Add them before requesting permissions from your followers.

| Page | Where it lives | What to enter in Meta's App Settings → Basic |
|------|----------------|---------------------------------------------|
| Privacy Policy | Host your own page (e.g. a simple `/privacy-policy` page, Notion, or free policy generators) | `https://my-autodm.vercel.app/privacy-policy` |
| Terms of Service | Host your own page | `https://my-autodm.vercel.app/terms-of-service` |
| Data Deletion callback URL | Built-in route in this project | `https://my-autodm.vercel.app/api/webhooks/meta-compliance/data-deletion` |
| Data Deletion instructions URL | Any public page explaining how followers delete their data (your Privacy Policy can host this section) | Same as your Privacy Policy URL |

> 📌 The app already ships with two Meta compliance endpoints out-of-the-box:
> - `…/api/webhooks/meta-compliance/data-deletion`
> - `…/api/webhooks/meta-compliance/deauthorize`
>
> So the hard part is done — you only need the two text pages (Privacy & Terms). Easiest options: a Notion page → "Publish to the web" → use that public URL, or a free generator such as Termly / Iubenda, or upload a simple HTML page to this app.

> 📝 What should a Privacy Policy for this app say? Briefly: your app stores the user's Meta/Instagram tokens (encrypted at rest with AES-256-GCM), stores leads that messaged the keyword (name, email if provided), stores messages sent, does not sell data to third parties, and followers can request deletion via the Meta data-deletion callback. Terms: the app is provided "as-is", you must comply with Meta platform rules, and it is free software with no paid service promises.

---

## 🐛 Troubleshooting (common problems)

| 💢 Problem | 💡 Fix |
|------------|--------|
| `P1001: Can't reach database server` | Wrong `DATABASE_URL`. Re-copy the Neon string — it must start with `postgresql://` and end with `?sslmode=require` |
| `pnpm: command not found` | `npm install -g pnpm` and retry |
| `NEXTAUTH_URL is not defined` | It's missing from `.env` locally / missing from Vercel variables |
| Login redirects to `localhost` in production | Your `NEXTAUTH_URL` + `NEXT_PUBLIC_APP_URL` on Vercel still say `localhost` — change them to your Vercel URL |
| Google login fails (`redirect_uri_mismatch`) | In your Meta/Google auth provider's dashboard, add `https://my-autodm.vercel.app/api/auth/callback/…` to allowed redirect URIs |
| Webhook verification fails in Meta dashboard | The Verify Token in Meta must **exactly match** your `VERIFY_TOKEN`, and the Callback URL must be `https://…/api/webhooks/instagram` |
| `db:push` fails with a "pooler" error | Use Neon's **direct (non-pooled)** connection string for the push, then done — the app can keep using the pooled one |
| Rate limit / sporadic 500 on Vercel, but works locally | Confirm Vercel variables `.env` matches; run `vercel logs` or check the Vercel dashboard → Deployments → Runtime Logs |

Everything else: open a GitHub Issue in this repo → https://github.com/Abi-de-jo/Auto-dm-followers/issues

---

## 🛡️ Security highlights

- 🔐 **AES-256-GCM encryption at rest** — every Instagram token stored in your database is encrypted with `TOKEN_ENCRYPTION_KEY`. Leaked database = still unusable tokens.
- ✅ **Meta's Official Graph API only** — zero unofficial scrapers, browser extensions or password sharing. Your account stays safe under Meta's rules.
- 🕰️ **Human-like pacing built-in** — randomized 1.2s–2.8s jitter between messages, hourly caps (`HOURLY_REPLY_LIMIT`), automatic slow-down, prevents rate-limit flags.
- 🌍 **Passwordless, Google sign-in** — users never sign up with a password in this app; sessions are secured by `NEXTAUTH_SECRET`.

---

## 📄 License

**MIT** — free to use, customize, fork and self-host forever. If it made your life easier, ⭐ star the repo!

<div align="center">
<p><sub>Built with ❤️ and Next.js · Powered by <a href="https://neon.tech">Neon</a> Postgres · Hosted on <a href="https://vercel.com">Vercel</a></sub></p>
</div>
