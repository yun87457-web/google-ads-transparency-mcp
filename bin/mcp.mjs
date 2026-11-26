#!/usr/bin/env node
/**
 * AdPulse — Google Ads Transparency MCP Server (Zero-Dependency Node.js 18+ MCP stdio Server)
 *
 * Run locally via:
 *   npx -y github:yun87457-web/google-ads-transparency-mcp
 *
 * Authentication (choose one):
 *   - APIFY_TOKEN   (Apify Standby Streamable HTTP MCP backend — Free tier available)
 *   - RAPIDAPI_KEY  (RapidAPI REST backend — Free Basic plan available)
 */
import readline from "node:readline";

const SERVER_NAME = "adpulse-google-ads-transparency-mcp";
const SERVER_VERSION = "1.1.2";
const APIFY_MCP_URL = process.env.MCP_ENDPOINT_OVERRIDE || "https://spiky-closet--google-ads-transparency-scraper.apify.actor/mcp";
const APIFY_URL = "https://apify.com/spiky_closet/google-ads-transparency-scraper";
const RAPIDAPI_URL = "https://rapidapi.com/HYunLe/api/google-ads-transparency-creative-spy";
const RAPIDAPI_HOST = "google-ads-transparency-creative-spy.p.rapidapi.com";
const REST_BASE_URL = process.env.REST_BASE_OVERRIDE || `https://${RAPIDAPI_HOST}`;
const TOOLS = [
  {
    "description": "Search active and historical ads from the Google Ads Transparency Center in real time (<300ms). Accepts a domain ('shopify.com', 'm\u00fcller.de'), brand name ('Shopify', '\uc0bc\uc131\uc804\uc790'), advertiser ID ('AR...'), or pasted Google Ads Transparency URL. Supports server-side filtering by country/EU macro, creative format, Google platform (YOUTUBE, SEARCH, SHOPPING, MAPS, PLAY), ad-copy keyword, sort order, political archive, and date window. Returns ISO-8601 UTC dates, exact format, verified legal entity name + rebrand history, ad account/adGroup clustering IDs, optional structured ad copy (adHeadline, adDescription, destinationUrl), and EU DSA reach, targeting, fundedBy end-payer, AI synthetic-media disclosure, and Google Ad Grants status.",
    "inputSchema": {
      "properties": {
        "adTextKeyword": {
          "description": "Optional server-side keyword filter matched against ad copy.",
          "type": "string"
        },
        "dateRangePreset": {
          "description": "Optional relative date window preset (ignored when startDate/endDate are provided).",
          "enum": [
            "ANYTIME",
            "TODAY",
            "YESTERDAY",
            "LAST_7_DAYS",
            "LAST_14_DAYS",
            "LAST_30_DAYS",
            "LAST_90_DAYS",
            "LAST_365_DAYS",
            "THIS_MONTH",
            "THIS_YEAR",
            "CUSTOM"
          ],
          "type": "string"
        },
        "endDate": {
          "description": "Optional end date filter (YYYY-MM-DD, inclusive).",
          "type": "string"
        },
        "format": {
          "description": "Filter by creative format. Defaults to ALL.",
          "enum": [
            "ALL",
            "TEXT",
            "IMAGE",
            "VIDEO"
          ],
          "type": "string"
        },
        "includeAdText": {
          "description": "Set true to extract structured adHeadline, adDescription, adTextLines, YouTube video IDs, and unwrapped destinationUrl from dynamic preview scripts.",
          "type": "boolean"
        },
        "includeDetails": {
          "description": "Set true to include A/B creative variations, per-country dates, EU DSA impression bounds & audience targeting, fundedBy end-payer, AI synthetic media disclosure, and Google Grants flag.",
          "type": "boolean"
        },
        "maxAdvertisersPerQuery": {
          "description": "For brand keyword queries, expand up to N matching regional advertiser entities (1-20, default 5).",
          "type": "integer"
        },
        "maxResults": {
          "description": "Maximum number of creatives to return (1-200, default 20).",
          "type": "integer"
        },
        "platforms": {
          "description": "Optional Google surfaces to filter by (e.g. ['YOUTUBE', 'SEARCH']).",
          "items": {
            "enum": [
              "YOUTUBE",
              "SEARCH",
              "SHOPPING",
              "MAPS",
              "PLAY"
            ],
            "type": "string"
          },
          "type": "array"
        },
        "politicalAds": {
          "description": "Set true to query Google's 7-year Political & Election Ads archive (includes spend bounds and age/gender/geo targeting).",
          "type": "boolean"
        },
        "query": {
          "description": "Domain ('stripe.com'), work email ('ceo@stripe.com'), brand name ('Stripe'), advertiser ID ('AR16951989901585285121'), AR.../CR... shorthand, or full adstransparency.google.com URL.",
          "type": "string"
        },
        "region": {
          "description": "Optional ISO-3166-1 alpha-2 country code ('US', 'GB', 'DE', 'TR', 'KR'), macro ('EU', 'EEA', 'EEA+TR'), English/Unicode country name ('Germany', 'T\u00fcrkiye'), or 'ANYWHERE'. Unlike Google's official BigQuery dataset (EEA + T\u00fcrkiye only), this RPC engine supports US and 220+ global markets.",
          "type": "string"
        },
        "sortBy": {
          "description": "Optional server-side sort order (use IMPRESSIONS in EU/EEA for highest-reach creatives or LAST_ACTIVITY_DATE for newest).",
          "enum": [
            "DEFAULT",
            "LAST_ACTIVITY_DATE",
            "IMPRESSIONS",
            "REVENUE"
          ],
          "type": "string"
        },
        "startDate": {
          "description": "Optional start date filter (YYYY-MM-DD, inclusive).",
          "type": "string"
        }
      },
      "required": [
        "query"
      ],
      "type": "object"
    },
    "name": "search_google_ads",
    "rapidapi": {
      "method": "POST",
      "path": "/search"
    }
  },
  {
    "description": "Batch B2B ad-spend signal checker: test up to 100 domains or brand names in parallel and return one structured row per company indicating whether it is actively running Google Ads, approximate ad count bounds (approxAdCountLow/High), verified legal entity name, primary advertiserId + advertisersObserved, country, latest ad timestamp, and ad formats observed.",
    "inputSchema": {
      "properties": {
        "dateRangePreset": {
          "description": "Optional relative date window preset (ignored when startDate/endDate are provided).",
          "enum": [
            "ANYTIME",
            "TODAY",
            "YESTERDAY",
            "LAST_7_DAYS",
            "LAST_14_DAYS",
            "LAST_30_DAYS",
            "LAST_90_DAYS",
            "LAST_365_DAYS",
            "THIS_MONTH",
            "THIS_YEAR",
            "CUSTOM"
          ],
          "type": "string"
        },
        "domains": {
          "description": "List of company domains (e.g. ['hubspot.com', 'linear.app']), website URLs, or work emails ('ceo@hubspot.com') to check for active Google Ads.",
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        "endDate": {
          "description": "Optional end date filter (YYYY-MM-DD).",
          "type": "string"
        },
        "format": {
          "description": "Optional creative format filter.",
          "enum": [
            "ALL",
            "TEXT",
            "IMAGE",
            "VIDEO"
          ],
          "type": "string"
        },
        "platforms": {
          "description": "Optional Google surfaces filter.",
          "items": {
            "enum": [
              "YOUTUBE",
              "SEARCH",
              "SHOPPING",
              "MAPS",
              "PLAY"
            ],
            "type": "string"
          },
          "type": "array"
        },
        "politicalAds": {
          "description": "Optional flag to screen against the Political & Election Ads archive.",
          "type": "boolean"
        },
        "region": {
          "description": "Optional ISO-3166-1 alpha-2 country filter ('US', 'DE', 'EU'), country name, or 'ANYWHERE'.",
          "type": "string"
        },
        "startDate": {
          "description": "Optional start date filter (YYYY-MM-DD).",
          "type": "string"
        }
      },
      "required": [
        "domains"
      ],
      "type": "object"
    },
    "name": "check_domains_running_ads",
    "rapidapi": {
      "method": "POST",
      "path": "/screen"
    }
  },
  {
    "description": "Fetch full A/B variations, verified legal advertiser info, optional structured ad copy, and country-by-country EU DSA reach & targeting breakdown for a single Google Ads creative by URL or advertiserId + creativeId.",
    "inputSchema": {
      "properties": {
        "advertiserId": {
          "description": "Google Ads Advertiser ID starting with 'AR' (used with creativeId if creativeUrl is omitted).",
          "type": "string"
        },
        "creativeId": {
          "description": "Google Ads Creative ID starting with 'CR' (used with advertiserId if creativeUrl is omitted).",
          "type": "string"
        },
        "creativeUrl": {
          "description": "Full creative URL (https://adstransparency.google.com/advertiser/AR.../creative/CR...).",
          "type": "string"
        },
        "includeAdText": {
          "description": "Set true to extract structured adHeadline, adDescription, adTextLines, and unwrapped destinationUrl.",
          "type": "boolean"
        },
        "politicalAds": {
          "description": "Set true when looking up a creative in the Political & Election Ads archive.",
          "type": "boolean"
        }
      },
      "type": "object"
    },
    "name": "get_google_ad_creative",
    "rapidapi": {
      "method": "POST",
      "path": "/search"
    }
  }
];

const TRIAL_URL = "https://adpulse-trial.mcp-edge-trial.workers.dev";
const FETCH_TIMEOUT_MS = 45000;

function writeMsg(msg) {
  process.stdout.write(JSON.stringify(msg) + "\n");
}

async function proxyApifyMcp(payload, token) {
  const res = await fetch(APIFY_MCP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json, text/event-stream",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Apify MCP HTTP ${res.status}: ${text.slice(0, 300)}`);
  }
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("text/event-stream")) {
    const lines = text.split(/\r?\n/).filter((l) => l.startsWith("data:"));
    for (let i = lines.length - 1; i >= 0; i--) {
      const raw = lines[i].slice(5).trim();
      if (raw && raw !== "[DONE]") {
        try { return JSON.parse(raw); } catch {}
      }
    }
    throw new Error("Empty SSE response from Apify MCP endpoint");
  }
  return JSON.parse(text);
}

async function callRapidApi(tool, args, key) {
  const cfg = tool.rapidapi;
  let url = `${REST_BASE_URL}${cfg.path}`;
  const headers = {
    "x-rapidapi-key": key,
    "x-rapidapi-host": RAPIDAPI_HOST
  };

  let payload = { ...(args || {}) };
  if (tool.name === "get_google_ad_creative") {
    if (payload.creativeUrl && !payload.startUrls) {
      payload.startUrls = [payload.creativeUrl];
      delete payload.creativeUrl;
    }
    payload.includeDetails = true;
  }

  const init = { method: cfg.method, headers, signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) };
  if (cfg.method === "GET") {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(payload)) {
      if (v !== undefined && v !== null) qs.set(k, String(v));
    }
    if ([...qs.keys()].length > 0) url += `?${qs.toString()}`;
  } else {
    headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(payload);
  }
  const res = await fetch(url, init);
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`RapidAPI HTTP ${res.status}: ${text.slice(0, 300)}`);
  }
  try {
    return JSON.stringify(JSON.parse(text), null, 2);
  } catch {
    return text;
  }
}

async function callZeroKeyTrial(toolName, args) {
  const res = await fetch(TRIAL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tool: toolName, arguments: args || {} }),
    signal: AbortSignal.timeout(30000)
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Free trial HTTP ${res.status}: ${text.slice(0, 300)}`);
  }
  try {
    return JSON.stringify(JSON.parse(text), null, 2);
  } catch {
    return text;
  }
}

async function handleRequest(msg) {
  const { id, method, params } = msg;
  const hasId = id !== undefined && id !== null;

  if (method === "initialize") {
    if (!hasId) return;
    return writeMsg({
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: params?.protocolVersion || "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: { name: SERVER_NAME, version: SERVER_VERSION }
      }
    });
  }

  if (method === "notifications/initialized" || method === "notifications/cancelled") {
    return;
  }

  if (method === "ping") {
    if (!hasId) return;
    return writeMsg({ jsonrpc: "2.0", id, result: {} });
  }

  if (method === "tools/list") {
    if (!hasId) return;
    const apifyToken = process.env.APIFY_TOKEN;
    if (apifyToken) {
      try {
        const remote = await proxyApifyMcp({ jsonrpc: "2.0", id, method: "tools/list", params: params || {} }, apifyToken);
        if (remote?.result?.tools) {
          return writeMsg({ jsonrpc: "2.0", id, result: remote.result });
        }
      } catch (err) {
        process.stderr.write(`[mcp] fallback to local schema: ${err.message}\n`);
      }
    }
    return writeMsg({
      jsonrpc: "2.0",
      id,
      result: {
        tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema }))
      }
    });
  }

  if (method === "tools/call") {
    if (!hasId) return;
    const toolName = params?.name;
    const args = params?.arguments || {};
    const apifyToken = process.env.APIFY_TOKEN;
    const rapidApiKey = process.env.RAPIDAPI_KEY;
    const tool = TOOLS.find((t) => t.name === toolName);
    if (!tool) {
      return writeMsg({
        jsonrpc: "2.0",
        id,
        result: {
          isError: true,
          content: [{ type: "text", text: `Unknown tool: ${toolName}. Available tools: ${TOOLS.map((t) => t.name).join(", ")}` }]
        }
      });
    }

    let apifyErr = null;
    if (apifyToken) {
      try {
        const remote = await proxyApifyMcp({ jsonrpc: "2.0", id, method: "tools/call", params }, apifyToken);
        if (remote?.result !== undefined) {
          return writeMsg({ jsonrpc: "2.0", id, result: remote.result });
        }
        if (remote?.error !== undefined) {
          return writeMsg({ jsonrpc: "2.0", id, error: remote.error });
        }
      } catch (err) {
        apifyErr = err;
        process.stderr.write(`[mcp] Apify call failed: ${err.message}\n`);
      }
    }

    if (rapidApiKey) {
      try {
        const out = await callRapidApi(tool, args, rapidApiKey);
        return writeMsg({
          jsonrpc: "2.0",
          id,
          result: { content: [{ type: "text", text: out }] }
        });
      } catch (err) {
        return writeMsg({
          jsonrpc: "2.0",
          id,
          result: {
            isError: true,
            content: [{ type: "text", text: `Error calling ${toolName}: ${err.message}` }]
          }
        });
      }
    }

    if (apifyErr) {
      return writeMsg({
        jsonrpc: "2.0",
        id,
        result: {
          isError: true,
          content: [{ type: "text", text: `Error calling ${toolName}: ${apifyErr.message}` }]
        }
      });
    }

    // Zero-key free trial mode (no APIFY_TOKEN or RAPIDAPI_KEY set)
    try {
      const trialOut = await callZeroKeyTrial(toolName, args);
      return writeMsg({
        jsonrpc: "2.0",
        id,
        result: { content: [{ type: "text", text: trialOut }] }
      });
    } catch (err) {
      return writeMsg({
        jsonrpc: "2.0",
        id,
        result: {
          isError: true,
          content: [{
            type: "text",
            text: `Free trial error (${err.message}). Set APIFY_TOKEN (${APIFY_URL}) or RAPIDAPI_KEY (${RAPIDAPI_URL}) for full access.`
          }]
        }
      });
    }
  }

  if (hasId) {
    writeMsg({
      jsonrpc: "2.0",
      id,
      error: { code: -32601, message: `Method not found: ${method}` }
    });
  }
}

const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
rl.on("line", (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  try {
    const msg = JSON.parse(trimmed);
    handleRequest(msg).catch((err) => {
      process.stderr.write(`[mcp] unhandled error: ${err.message}\n`);
    });
  } catch (err) {
    process.stderr.write(`[mcp] invalid JSON: ${err.message}\n`);
  }
});
