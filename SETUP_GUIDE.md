# HiddenLink Setup Instructions

## 1. Enable Required APIs
Please visit these links and click **"ENABLE"** for each one in your `hiddenlink` project:
- **Cloud Resource Manager API**: https://console.developers.google.com/apis/api/cloudresourcemanager.googleapis.com/overview?project=hiddenlink
- **Cloud Functions API**: https://console.developers.google.com/apis/api/cloudfunctions.googleapis.com/overview?project=hiddenlink
- **Cloud Build API**: https://console.developers.google.com/apis/api/cloudbuild.googleapis.com/overview?project=hiddenlink
- **Artifact Registry API**: https://console.developers.google.com/apis/api/artifactregistry.googleapis.com/overview?project=hiddenlink
- **Cloud Run API**: https://console.developers.google.com/apis/api/run.googleapis.com/overview?project=hiddenlink

## 2. Check Service Account Roles
Ensure `max-hiddenlink-builder@hiddenlink.iam.gserviceaccount.com` has these roles in **IAM & Admin**:
- `Editor` (Fastest for MVP)
- OR specifically: `Cloud Functions Developer`, `Cloud Build Editor`, `Artifact Registry Administrator`, `Service Account User`.

Once these are enabled, let me know and I will deploy the first "Stealth Engine" function!
