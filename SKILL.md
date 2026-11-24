---
name: google-ads-transparency
description: Query Google Ads Transparency Center creatives, ad copy, EU DSA reach & targeting, fundedBy payers, and bulk B2B domain ad-spend signals via zero-browser Go RPC API or Streamable HTTP MCP.
---

# Google Ads Transparency Skill (AdPulse)

Use this skill whenever the user asks to check whether a company or domain is actively running Google Ads, inspect competitor Search/Display/YouTube creatives, or extract EU Digital Services Act (DSA) reach and payer disclosures.

## Fast REST Endpoint (RapidAPI)
```bash
curl -sG "https://google-ads-transparency-creative-spy.p.rapidapi.com/search" \
  --data-urlencode "query=shopify.com" \
  --data-urlencode "region=US" \
  --data-urlencode "maxResults=10" \
  -H "x-rapidapi-key: $RAPIDAPI_KEY" \
  -H "x-rapidapi-host: google-ads-transparency-creative-spy.p.rapidapi.com"
```

## Bulk Domain Screening (`POST /screen`)
```bash
curl -s -X POST "https://google-ads-transparency-creative-spy.p.rapidapi.com/screen" \
  -H "Content-Type: application/json" \
  -H "x-rapidapi-key: $RAPIDAPI_KEY" \
  -H "x-rapidapi-host: google-ads-transparency-creative-spy.p.rapidapi.com" \
  -d '{"domains": ["shopify.com", "hubspot.com", "klaviyo.com", "linear.app"]}'
```

## Remote Streamable HTTP MCP (`mcp.json`)
```json
{
  "mcpServers": {
    "google-ads-transparency": {
      "url": "https://spiky-closet--google-ads-transparency-scraper.apify.actor/mcp",
      "headers": { "Authorization": "Bearer ${APIFY_TOKEN}" }
    }
  }
}
```
