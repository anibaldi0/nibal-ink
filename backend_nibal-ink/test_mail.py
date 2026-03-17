import os
import requests

# Meté tu key a mano para la prueba
API_KEY = "re_Xr3udPRN_F8jBXUUxyttGVMo44TK2fPnw"

resp = requests.post(
    "https://api.resend.com/emails",
    headers={
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    },
    json={
        "from": "noreply@nibal.ink",
        "to": "inbox.nibal.ink@gmail.com",
        "subject": "Test Directo API",
        "html": "<strong>Si esto llega, el problema es el SMTP, no el dominio.</strong>"
    }
)

print(f"Status Code: {resp.status_code}")
print(f"Response: {resp.text}")
