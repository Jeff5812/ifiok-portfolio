# Ifiok Columba — Portfolio (v1)

Next.js 14 + TypeScript + Tailwind + Framer Motion. Dark theme, pink→orange
brand gradient, monospace headline — matches the reference design. IC
monogram logo instead of any third-party logo.

## What's in this version

- **Hero** — headline, tools row, animated floating icons (no external logos).
- **Projects** — one detailed block per project (problem / solution / stack /
  outcome) with a screenshot slot. Drop an image at
  `public/projects/<slug>.png` (see `src/content/projects.ts` for slugs) and
  add an `<img src="/projects/<slug>.png" ... />` in `ProjectsSection.tsx`
  where the placeholder currently sits.
- **Skills, About, Contact** — simple, editable sections.
- **IC Assistant chatbot** (bottom-right) — three flows:
  1. **See what I've built** — briefly explains each project's problem,
     solution, and stack, pulled straight from `src/content/projects.ts`.
  2. **Try the Lab Follow-Up demo** — walks a visitor through the *exact*
     fields from your real n8n Lab Result Registration form trigger, then
     shows the same critical/routine branching + escalation logic the real
     workflow uses. It's a sandboxed replay: nothing is emailed or written to
     your database.
  3. **Book a call** ("Let's Work Together" everywhere opens this) — collects
     name, email, project type, and a summary. If you set
     `NEXT_PUBLIC_BOOKING_WEBHOOK_URL` (see `.env.example`) to a real n8n
     webhook URL, submissions POST there so you actually receive them —
     otherwise it still shows a confirmation but sends nowhere.

## Editing content

Everything you'll want to change lives in two places:

- `src/content/projects.ts` — the four project write-ups. Three are
  currently placeholders based on your screenshot's card copy — swap in
  the real problem/solution/outcome for Micro-Lending, WhatsApp Assistant,
  and Smart Email Automation when you have them.
- `src/components/Hero.tsx` — swap the "Your photo goes here" box for your
  actual headshot once you drop it at `public/portrait.jpg`.

## Status on the 4 projects

- **Clinic Lab Result Follow-Up & Escalation System** — real case study + chatbot demo, built from your actual n8n workflow.
- **Autonomous Micro-Lending Collection System** — real case study + chatbot demo (risk-tier scoring), built from your actual n8n workflow.
- **WhatsApp AI Assistant** and **Smart Email Automation** — still placeholders based on your screenshot's card copy. Send those workflows over when ready for the same treatment.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build   # production build (already verified working)
npm run start   # serve the production build on port 3000
```

---

## Deploying to your Hostinger VPS (step by step)

This assumes a fresh Ubuntu VPS from Hostinger and that you've never done
this before. Do these in order.

### 1. Connect to the VPS

In hPanel → VPS → your server, grab the IP address, then from your own
computer's terminal:

```bash
ssh root@YOUR_SERVER_IP
```

Enter the password Hostinger gave you (or your SSH key passphrase if you
set one up).

### 2. Update the server and install Node.js

```bash
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs git nginx
node -v   # should print v20.x
```

### 3. Create a non-root user (recommended, one-time)

```bash
adduser ifiok
usermod -aG sudo ifiok
su - ifiok
```

Do everything from here on as this user, not root.

### 4. Get your code onto the server

Push this project to a GitHub repo first (from your own machine), then:

```bash
cd ~
git clone https://github.com/<your-username>/<your-repo>.git portfolio
cd portfolio
npm install
```

If you set `NEXT_PUBLIC_BOOKING_WEBHOOK_URL`, create the env file now:

```bash
cp .env.example .env.local
nano .env.local   # paste your real n8n webhook URL, save with Ctrl+O then Ctrl+X
```

### 5. Build and run it with PM2 (keeps it alive after you disconnect)

```bash
npm run build
sudo npm install -g pm2
pm2 start npm --name "portfolio" -- start
pm2 save
pm2 startup   # run the command it prints — this makes it survive reboots
```

Your site is now running on `http://YOUR_SERVER_IP:3000` — check it works
before moving on.

### 6. Point Nginx at it (so it's on port 80, not :3000)

```bash
sudo nano /etc/nginx/sites-available/portfolio
```

Paste this (replace `yourdomain.com`):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Then:

```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t          # should say "syntax is ok"
sudo systemctl restart nginx
```

### 7. Point your domain at the VPS

In your domain registrar (or Hostinger's DNS if you bought the domain
there), add an **A record**: `@` → `YOUR_SERVER_IP`, and another A record
`www` → `YOUR_SERVER_IP`. DNS can take up to a few hours to propagate.

### 8. Add free HTTPS with Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts (enter your email, agree to terms). Certbot edits your
Nginx config and sets up auto-renewal.

### 9. Deploying updates later

```bash
cd ~/portfolio
git pull
npm install
npm run build
pm2 restart portfolio
```

That's the whole loop — edit locally, push to GitHub, `git pull` + rebuild
+ `pm2 restart` on the server.

### Troubleshooting

- `pm2 logs portfolio` — see runtime errors.
- `sudo systemctl status nginx` — check Nginx is running.
- `sudo nginx -t` — check for config typos before restarting.
- If the domain shows a Hostinger "parked" page, DNS hasn't propagated yet
  or the A record is wrong.
