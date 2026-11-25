![Cover](./cover.png)

# Google Ads Transparency & Creative Spy — REST API & MCP Server

[![Google Ads Transparency MCP connector](https://glama.ai/mcp/connectors/io.github.yun87457-web/google-ads-transparency-mcp/badges/score.svg)](https://glama.ai/mcp/connectors/io.github.yun87457-web/google-ads-transparency-mcp)
[![Listed on mcpservers.org](https://mcpservers.org/badge.svg)](https://mcpservers.org/servers/yun87457-web/google-ads-transparency-mcp)

Query active Google Search, YouTube, and Display ad creatives, formats, advertiser details, and EU DSA reach/impression bounds by domain or advertiser name — without headless browsers or proxies.

### Official BigQuery Dataset vs. Live Transparency Center RPC
Google publishes an official public BigQuery dataset (`bigquery-public-data.google_ads_transparency_center`), which is a great free option for bulk historical SQL analysis — **but its commercial ad coverage is limited to the EEA (30 countries) and Türkiye** (plus political ads):

| Capability | Official Google BigQuery Dataset | This Live RPC Engine (`v1.4.2`) |
|---|---|---|
| **US, UK, CA, AU, JP, KR & `220+` Global Commercial Ads** | ❌ Not included (EEA + Türkiye only) | ✅ **Full worldwide coverage (`US`, `GB`, `CA`, `JP`, `KR`, `ANYWHERE`)** |
| **EEA (30) + Türkiye (`TR`) Regulatory Disclosure Scope** | ✅ Official bulk historical SQL | ✅ **Real-time via `region: "EEA+TR"`, `"EU"`, `"EEA"`, or `"Türkiye"`** |
| **Same-Day Launches & Structured Search Copy / Landing URLs** | ❌ Snapshot lag, unparsed preview JS | ✅ **Real-time (`<300ms`) + `adHeadline`/`adDescription`/`destinationUrl`** |
| **Bulk Multi-TB Historical SQL (EEA + Türkiye)** | ✅ Use BigQuery directly! | ⚠️ Built for targeted domain/competitor & AI agent MCP workflows |

### Explicit Recency Windows & CRM Match Confidence (`v1.4.2`)
- **No ambiguous "active" counts:** `screeningMode: true` (`check_domains_running_ads` / `POST /screen`) emits `dateWindowApplied` (`ANYTIME`, `LAST_30_DAYS (...)`, or `YYYY-MM-DD..YYYY-MM-DD`), `countScope` (`indexed_creatives_in_window`), `daysSinceLastShown`, and `activityStatus` (`active_7d` | `recent_30d` | `historical` | `none`) so downstream CRMs distinguish ads served this week from archived creatives.
- **CRM match confidence before writing records:** Every screening row includes `matchConfidence` (`high` | `medium` | `low`), `matchConfidenceScore` (`0.00–1.00`), `matchReason` (e.g. `direct_domain_verified_single_entity`, `direct_domain_verified_multi_entity`, `brand_subsidiary_word_boundary_verified`), `primaryAdvertiserShare`, and the full `advertisersObserved` breakdown when a domain has multiple regional subsidiaries (e.g., `Notion Labs, Inc.` + `Notion Labs Japan`).

## Access Channels

- **Apify Store (Batch + Standby + Free Tier):** https://apify.com/spiky_closet/google-ads-transparency-scraper
- **RapidAPI Hub (REST API, Free Basic Plan):** https://rapidapi.com/HYunLe/api/google-ads-transparency-creative-spy
- **Official MCP Registry:** `io.github.yun87457-web/google-ads-transparency-mcp`

## Verified Performance (50-Domain Batch Benchmark)

- **50-domain ad-spend screening (`screeningMode: true`):** `2.47 s` runtime, `8.8 MB` peak RAM, `0` errors across US, DE, FR, KR, and JP advertisers.

## MCP Tools (Streamable HTTP)

Endpoint: `https://spiky-closet--google-ads-transparency-scraper.apify.actor/mcp`

| Tool | Description |
|---|---|
| `search_google_ads` | Retrieve active ad creatives by domain, advertiser name, region (`US`, `DE`, `FR`, `KR`, `JP`, `ALL`), format, or date range. |
| `check_domains_running_ads` | Batch screen a list of domains for verified Google Ads advertiser status and active creative counts. |
| `get_google_ad_creative` | Fetch detailed metadata, EU DSA reach bounds, and extracted ad copy for a specific creative ID. |

## Claude Desktop / Cursor MCP Configuration

```json
{
  "mcpServers": {
    "google-ads-transparency": {
      "url": "https://spiky-closet--google-ads-transparency-scraper.apify.actor/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_APIFY_TOKEN"
      }
    }
  }
}
```

## REST Quick Start (cURL)

```bash
curl -sG "https://google-ads-transparency-creative-spy.p.rapidapi.com/search" \
  --data-urlencode "query=zalando.de" \
  --data-urlencode "region=DE" \
  --data-urlencode "maxResults=5" \
  -H "x-rapidapi-key: YOUR_RAPIDAPI_KEY" \
  -H "x-rapidapi-host: google-ads-transparency-creative-spy.p.rapidapi.com"
```

## Free n8n Workflow Template

Import the ready-to-run workflow (**Weekly Competitor Google Ads & EU DSA Creative Monitor**): [`n8n-template.json`](./n8n-template.json)

1. Download [`n8n-template.json`](./n8n-template.json) and click **Import from File** in n8n.
2. Add a Generic Header Auth credential (`x-rapidapi-key`) using your free RapidAPI key.
3. Replace the sample domain list and connect your Slack channel.

## Ready-to-Run Presets (Apify Public Tasks)
- [Google Ads Competitor Creative & Ad Copy Tracker](https://apify.com/spiky_closet/google-ads-transparency-scraper/examples/google-ads-competitor-creative-tracker)
- [EU DSA Google Ads Reach, Targeting & Payer Extractor](https://apify.com/spiky_closet/google-ads-transparency-scraper/examples/eu-dsa-google-ads-reach-extractor)
- [B2B Domain Google Ads Spend Signal Checker (Bulk)](https://apify.com/spiky_closet/google-ads-transparency-scraper/examples/b2b-domain-google-ads-spend-checker)
## Live Interactive Top-100 Benchmark (Nov 2026)

Explore our live open dataset of **100 major SaaS, AI & DTC brands** screened via Google Ads Transparency Center (`22.46s` total batch runtime, `0` errors):
- **Interactive Web Explorer:** https://yun87457-web.github.io/google-ads-transparency-mcp/
- **Open Downloads (MIT):** [`benchmarks/top-100-nov-2026.csv`](./benchmarks/top-100-nov-2026.csv) · [`benchmarks/top-100-nov-2026.json`](./benchmarks/top-100-nov-2026.json)
- **Key Findings:** `97%` active verified Google advertisers, `72%` running YouTube `VIDEO` ads, led by Shopify (`70k–80k` active creatives) and GoDaddy (`60k–70k`).

## Install & Run Locally (Stdio MCP Server — Zero Dependencies)

Run directly in Claude Desktop, Cursor, Windsurf, or Cline using Node.js 18+ (supports either `APIFY_TOKEN` or `RAPIDAPI_KEY`):

```bash
npx -y github:yun87457-web/google-ads-transparency-mcp
```

```json
{
  "mcpServers": {
    "google-ads-transparency": {
      "command": "npx",
      "args": ["-y", "github:yun87457-web/google-ads-transparency-mcp"],
      "env": { "RAPIDAPI_KEY": "YOUR_FREE_RAPIDAPI_KEY" }
    }
  }
}
```

## No-Code Recipes (n8n, Make.com & Clay)

- **n8n Workflow JSON:** [`n8n-template.json`](./n8n-template.json) (and community node scaffold in [`n8n-community-node/`](./n8n-community-node/))
- **Clay HTTP Enrichment:** [`integrations/clay-http-enrichment.json`](./integrations/clay-http-enrichment.json)
- **Make.com HTTP Module:** [`integrations/make-http-module.json`](./integrations/make-http-module.json)
