# HiddenLink (Stealth QR) - Technical Status

## 1. Backend Infrastructure (Deployed)
The core API is now live on Google Cloud.

- **Cloud Function Name:** `generate-stealth-link`
- **Region:** `australia-southeast1` (Sydney)
- **Endpoint:** `https://australia-southeast1-hiddenlink.cloudfunctions.net/generate-stealth-link`

## 2. API Usage
To generate a stealth logo, send a POST request with the following JSON:
```json
{
  "logo": "BASE64_ENCODED_IMAGE",
  "url": "https://your-target-link.com",
  "strength": 0.2
}
```

## 3. Implementation Details
- **Error Correction:** Hardcoded to `Level H` (30%) to ensure scannability on curved surfaces (cars) and low-light conditions.
- **Stealth Logic:** Currently using an alpha-blending steganography method. 
- **Next Stage Upgrade:** Wire this function to a Stable Diffusion API to achieve the "Brushed Metal" / "Pro 3D" textures.

---
**Status:** BACKEND LIVE 🟢
