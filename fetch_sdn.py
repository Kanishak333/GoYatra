import urllib.request
import re
import ssl
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "https://www.makemytrip.com/hotels/sukh_durga_niwas-details-udaipur.html"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req, context=ctx).read().decode('utf-8')
    match = re.search(r'https://r1imghtlak\.mmtcdn\.com/[^"\'\s]+\.jpg', html)
    if match:
        print(f"Found URL: {match.group(0)}")
    else:
        print("No image found")
except Exception as e:
    print("Error:", e)
