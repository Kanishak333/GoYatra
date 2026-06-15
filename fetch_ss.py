import urllib.request
import re
import ssl
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "https://www.saffronstays.com/view/the-shikargarh-palace-heritage-estate-in-udaipur"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req, context=ctx).read().decode('utf-8')
    match = re.search(r'https://ik\.imagekit\.io/saffronstays/gallery/[^"\'\s]+\.jpg', html)
    if match:
        img_url = match.group(0)
        print(f"Found URL: {img_url}")
    else:
        print("No image found")
except Exception as e:
    print("Error:", e)
