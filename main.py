import functions_framework
import base64
import json
import io
import qrcode
from PIL import Image

@functions_framework.http
def generate_stealth_link(request):
    # Set CORS headers for the preflight request
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    request_json = request.get_json(silent=True)
    if not request_json or 'logo' not in request_json or 'url' not in request_json:
        return (json.dumps({"error": "Missing logo or url"}), 400, headers)

    logo_base64 = request_json['logo']
    target_url = request_json['url']
    strength = request_json.get('strength', 0.2)

    try:
        # 1. Create high-error-correction QR
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=4,
        )
        qr.add_data(target_url)
        qr.make(fit=True)
        qr_img = qr.make_image(fill_color="black", back_color="white").convert('RGBA')

        # 2. Process Logo
        logo_data = base64.b64decode(logo_base64)
        logo = Image.open(io.BytesIO(logo_data)).convert('RGBA')
        
        # 3. Align QR to Logo
        qr_img = qr_img.resize(logo.size, Image.Resampling.LANCZOS)
        
        # 4. Apply Stealth Blend (POC implementation)
        blended = Image.blend(logo, qr_img, alpha=strength)
        
        # 5. Return as Base64
        buffered = io.BytesIO()
        blended.save(buffered, format="PNG")
        result_base64 = base64.b64encode(buffered.getvalue()).decode()

        return (json.dumps({
            "status": "success",
            "stealthUrl": f"data:image/png;base64,{result_base64}",
            "message": "Stealth Logo Generated successfully (POC Mode)"
        }), 200, headers)

    except Exception as e:
        return (json.dumps({"error": str(e)}), 500, headers)
