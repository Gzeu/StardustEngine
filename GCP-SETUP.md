# Google Cloud Platform (GCP) Setup Guide
## StardustEngine Backend Deployment on Cloud Run

This guide walks through setting up your Python FastAPI backend on Google Cloud Run with automatic deployments from GitHub.

### Prerequisites
- Google Cloud Account (create at https://cloud.google.com)
- `gcloud` CLI installed locally
- Docker installed (for local testing)
- GitHub account with access to StardustEngine repo

### Step 1: Install Google Cloud CLI

```bash
# On Windows (using PowerShell as Administrator):
cd $env:TEMP
(New-Object System.Net.ServicePointManager).SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor [System.Net.SecurityProtocolType]::Tls12
$ProgressPreference = 'SilentlyContinue'; Invoke-WebRequest https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe -OutFile $env:TEMP\GoogleCloudSDKInstaller.exe; & $env:TEMP\GoogleCloudSDKInstaller.exe

# Or download manually from: https://cloud.google.com/sdk/docs/install
```

After installation:
```bash
gcloud init
```

### Step 2: Create GCP Project

```bash
# Login to your Google Account
gcloud auth login

# Create a new project
PROJECT_ID="stardust-engine-prod"
gcloud projects create $PROJECT_ID --name="StardustEngine Backend"

# Set as current project
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

### Step 3: Configure Cloud Run Service Account

```bash
# Create service account for Cloud Run
SERVICE_ACCOUNT="stardust-cloud-run"
gcloud iam service-accounts create $SERVICE_ACCOUNT \
  --display-name="StardustEngine Cloud Run Service"

# Grant necessary permissions
PROJECT_ID=$(gcloud config get-value project)
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.invoker"
```

### Step 4: Deploy Backend to Cloud Run (Manual)

```bash
# From the root of StardustEngine repo:
cd api

# Deploy directly from source
SERVICE_NAME="stardust-api"
REGION="europe-west1"  # or your preferred region

gcloud run deploy $SERVICE_NAME \
  --source . \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --timeout 3600s \
  --max-instances 100 \
  --service-account=$SERVICE_ACCOUNT@$PROJECT_ID.iam.gserviceaccount.com
```

After deployment, you'll get a URL like:
```
https://stardust-api-xxxxx.a.run.app
```

### Step 5: Set Environment Variables

If your API needs environment variables (database URLs, API keys, etc.):

```bash
gcloud run services update $SERVICE_NAME \
  --region $REGION \
  --set-env-vars KEY1=value1,KEY2=value2
```

### Step 6: Setup Automatic GitHub Deployments

For automatic deployments when you push to GitHub, create a GitHub Actions workflow file at `.github/workflows/deploy-cloud-run.yml` (see `GITHUB-ACTIONS-DEPLOY.yml` in this repo).

### Step 7: Configure Frontend (Vercel) Environment

In your Vercel project settings, add:
```
NEXT_PUBLIC_API_URL=https://stardust-api-xxxxx.a.run.app
```

Replace the URL with your actual Cloud Run service URL.

### Monitoring & Logs

```bash
# View recent logs
gcloud run services describe $SERVICE_NAME --region $REGION

# Stream live logs
gcloud run services logs read $SERVICE_NAME --region $REGION --limit 50 --follow

# View in Cloud Console:
# https://console.cloud.google.com/run
```

### Cost Estimation

Cloud Run free tier includes:
- 2 million requests/month
- 400,000 GB-seconds/month (compute)
- 1 GB outbound data/month

After that:
- $0.00002400 per request
- $0.00001667 per GB-second

### Troubleshooting

**Port Issues:**
Make sure your FastAPI app binds to `0.0.0.0:8080` (already configured in the Dockerfile).

**Authentication Errors:**
```bash
# Re-authenticate
gcloud auth application-default login
```

**Build Failures:**
Check the build logs:
```bash
gcloud builds log $(gcloud builds list --limit=1 --format='value(ID)')
```

### Next Steps

1. Deploy your frontend to Vercel
2. Configure CORS on your FastAPI backend if needed
3. Set up monitoring alerts in Cloud Console
4. Configure custom domain (optional)
