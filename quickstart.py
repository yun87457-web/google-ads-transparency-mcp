#!/usr/bin/env python3
import os, sys, json, urllib.request, urllib.parse

key = os.environ.get("RAPIDAPI_KEY")
if not key:
    sys.exit("Set RAPIDAPI_KEY first (free tier: https://rapidapi.com/HYunLe/api/google-ads-transparency-creative-spy)")
query = sys.argv[1] if len(sys.argv) > 1 else "shopify.com"
url = "https://google-ads-transparency-creative-spy.p.rapidapi.com/search?" + urllib.parse.urlencode({"query": query, "maxResults": 5})
req = urllib.request.Request(url, headers={"x-rapidapi-key": key, "x-rapidapi-host": "google-ads-transparency-creative-spy.p.rapidapi.com"})
with urllib.request.urlopen(req, timeout=20) as r:
    print(json.dumps(json.loads(r.read().decode()), indent=2))
