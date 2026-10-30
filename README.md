# PromptForge

PromptForge turns a short visual idea into three category-aware image-generation prompts using Google Gemini, Groq, and Cohere. It generates prompts only; it does not generate images.

## Features

- Rule-based automatic detection plus manual selection across 25 image categories
- Three distinct, category-aware strategies: CINEMATIC / REALISTIC, CREATIVE / ARTISTIC, and PROFESSIONAL / COMMERCIAL
- Parallel backend requests; each provider result is reported independently
- Before/after comparison, copy, regenerate, and provider status cards
- API keys stay on the backend

## Project structure

```text
PromptForge/
├── backend/
│   ├── src/
│   │   ├── promptTemplates.js
│   │   └── promptTemplates.test.js
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
├── deployment/
│   ├── cloudwatch-logs.json
│   ├── nginx-promptforge.conf
│   └── pm2-promptforge.config.js
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── .env.example
├── .gitignore
└── README.md
```

## Supported image categories

Realistic photography; portrait and headshot photography; cinematic photography; fashion photography; product photography; food photography; wedding photography; nature and wildlife; landscape photography; architecture and interior design; anime and manga; cartoon and illustration; 3D art and rendering; fantasy and sci-fi art; digital painting and sketches; logo and branding; posters and banners; YouTube thumbnails; social media designs; advertisements; infographics; book and album covers; icons and stickers; automotive photography; educational illustrations.

Category detection uses category-specific text cues. The selector can override automatic detection. If no specific cues are present, detection defaults to realistic photography.

## Requirements

- Node.js 24 LTS or later and npm
- API keys for any provider you want to use; all three are needed for a full three-provider demonstration

## Local setup (Windows PowerShell)

Run these commands from the existing project folder:

```powershell
cd "C:\Users\UDAY SAI REDDY\Desktop\PromptForge"
Copy-Item .env.example .env
notepad .env
```

Set real keys in the root `.env` file:

```env
GEMINI_API_KEY=your_google_gemini_api_key
GROQ_API_KEY=your_groq_api_key
COHERE_API_KEY=your_cohere_api_key
PORT=5000
```

Do not commit `.env`. It is ignored by `.gitignore`.

Install dependencies from the two project folders:

```powershell
cd "C:\Users\UDAY SAI REDDY\Desktop\PromptForge\backend"
npm ci
cd "C:\Users\UDAY SAI REDDY\Desktop\PromptForge\frontend"
npm ci
```

Run backend and frontend in separate PowerShell terminals:

```powershell
cd "C:\Users\UDAY SAI REDDY\Desktop\PromptForge\backend"
npm run dev
```

```powershell
cd "C:\Users\UDAY SAI REDDY\Desktop\PromptForge\frontend"
npm run dev
```

Open <http://localhost:5173>. The backend health endpoint is <http://localhost:5000/api/health>.

## Local validation commands

Run the prompt-engine tests:

```powershell
cd "C:\Users\UDAY SAI REDDY\Desktop\PromptForge\backend"
npm test
node --check server.js
```

Build the production frontend:

```powershell
cd "C:\Users\UDAY SAI REDDY\Desktop\PromptForge\frontend"
npm run build
```

Check backend health:

```powershell
Invoke-RestMethod http://localhost:5000/api/health
```

With valid credentials, submit ideas in the UI and confirm the three generated prompts. Provider calls and account quota are not validated by these local build/test commands.

## AWS EC2 Ubuntu deployment

The following assumes an Ubuntu EC2 instance, a GitHub repository URL, SSH access, and an EC2 instance profile with `CloudWatchAgentServerPolicy`. Configure the EC2 security group to allow SSH (22) from your IP and HTTP (80) from users; add HTTPS (443) when TLS is configured. Do not expose port 5000 publicly.

### 1. Install Node.js, Nginx, Git, and PM2

Connect to the instance, then run:

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg nginx git
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
sudo chmod a+r /etc/apt/keyrings/nodesource.gpg
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_24.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list
sudo apt update
sudo apt install -y nodejs
sudo npm install --global pm2
node --version
npm --version
```

### 2. Clone and configure the project

Replace the repository URL with your actual GitHub URL. Run as the normal `ubuntu` user:

```bash
sudo mkdir -p /var/www/PromptForge
sudo chown ubuntu:ubuntu /var/www/PromptForge
git clone https://github.com/udayreddytetali/PromptForge.git /var/www/PromptForge
cd /var/www/PromptForge
cp .env.example .env
chmod 600 .env
nano .env
```

Add your real keys to `.env`:

```env
GEMINI_API_KEY=your_google_gemini_api_key
GROQ_API_KEY=your_groq_api_key
COHERE_API_KEY=your_cohere_api_key
PORT=5000
NODE_ENV=production
```

Install from lockfiles, run tests, and build:

```bash
cd /var/www/PromptForge/backend
npm ci
npm test
node --check server.js
cd /var/www/PromptForge/frontend
npm ci
npm run build
```

### 3. Start the backend with PM2

PM2 logs are collected from `/var/log/promptforge`, so create the directory and make it writable by `ubuntu` first:

```bash
sudo mkdir -p /var/log/promptforge
sudo chown ubuntu:ubuntu /var/log/promptforge
cd /var/www/PromptForge
pm2 start deployment/pm2-promptforge.config.js
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu
pm2 save
pm2 status
curl --fail http://127.0.0.1:5000/api/health
```

### 4. Configure Nginx

The supplied Nginx config serves `frontend/dist` and proxies `/api/` to the local backend:

```bash
sudo cp /var/www/PromptForge/deployment/nginx-promptforge.conf /etc/nginx/sites-available/promptforge
sudo ln -sfn /etc/nginx/sites-available/promptforge /etc/nginx/sites-enabled/promptforge
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl enable --now nginx
sudo systemctl reload nginx
curl --fail http://127.0.0.1/api/health
```

The config uses `server_name _` for an IP-based demonstration. For a domain, replace `_` in `/etc/nginx/sites-available/promptforge` with the domain name, point its DNS A record at the EC2 public IP, then validate and reload Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Configure CloudWatch application logs

Attach the `CloudWatchAgentServerPolicy` IAM policy to the EC2 instance role before starting the agent. Then install and start the CloudWatch Agent:

```bash
sudo wget https://amazoncloudwatch-agent.s3.amazonaws.com/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb -O /tmp/amazon-cloudwatch-agent.deb
sudo dpkg -i -E /tmp/amazon-cloudwatch-agent.deb
sudo install -D -o root -g root -m 0644 /var/www/PromptForge/deployment/cloudwatch-logs.json /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json -s
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a status
```

The agent sends PM2 stdout and stderr logs to the `/promptforge/backend` CloudWatch Logs group. Review agent status and logs in the CloudWatch console. EC2 must have outbound HTTPS access to AWS endpoints.

### 6. Verify deployment

```bash
pm2 status
sudo systemctl status nginx --no-pager
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a status
curl --fail http://127.0.0.1/api/health
```

Open the EC2 public IP or configured domain in a browser. Use valid API keys and provider account quota to test live generation.

## Important verification limitation

Automated tests validate category detection, strategies, backend parsing, and the frontend production build. Live calls to Gemini, Groq, and Cohere require real credentials and provider quota. PromptForge reports each provider result independently, but without valid keys no successful provider output can be confirmed.
