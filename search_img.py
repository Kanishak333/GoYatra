import urllib.request
import re
import ssl
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "https://html.duckduckgo.com/html/?q=Hotel+Angan+Udaipur+tripadvisor"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req, context=ctx).read().decode('utf-8')
    match = re.search(r'https://dynamic-media-cdn\.tripadvisor\.com/media/photo-o/[^"\'\s]+\.jpg', html)
    if match:
        img_url = match.group(0)
        print(f"Found URL: {img_url}")
        urllib.request.urlretrieve(img_url, "public/angan.jpg")
    else:
        print("No image found on tripadvisor search")
except Exception as e:
    print("Error:", e)
