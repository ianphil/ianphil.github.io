---
title: Privacy-Friendly Blog Analytics (Without Selling Your Soul to Google)
date: 2026-01-12T23:00:00-05:00
github_issue: 10
draft: false
tags:
  - tools
  - analytics
  - val-town
  - privacy
---

Google Analytics is free because you're the product. Your visitors are the product. Everyone's data gets hoovered up and fed into the advertising machine. For a personal blog that gets maybe dozens of readers, this feels... excessive.

I wanted to know which posts people actually read. That's it. Not their shoe size, not their political leanings, not enough data to build a psychological profile. Just page views.

## The Setup

[Val Town](https://val.town) provides free serverless functions with a built-in SQLite database. Perfect for a tiny analytics backend:

1. Blog page loads, fires a tracking beacon to Val Town
2. Val Town logs the hit (page path, referrer hostname, viewport width, parsed browser/OS)
3. Dashboard fetches aggregated stats via a `/stats` endpoint
4. Optionally sync to a GitHub Gist for archiving

The tracking beacon is an image request - no JavaScript library, no cookies, no fingerprinting. The "pixel" is a 1x1 transparent GIF that returns instantly.

## What Gets Collected

| Field | Why |
|-------|-----|
| Page path | Which posts are popular |
| Referrer hostname | Where traffic comes from |
| Browser/OS | Curiosity, mostly |
| Viewport width | Desktop vs mobile split |

## What Doesn't Get Collected

- IP addresses (not stored, not hashed, not touched)
- Cookies
- Anything that could identify a specific person

If you visit my blog, I know someone read the page. I don't know it was you. That's the point.

## The Dashboard

A single HTML file at [tools.ianp.io/analytics](https://tools.ianp.io/analytics) shows the last 30 days of stats. Sign in with GitHub to sync snapshots to a Gist for long-term storage (Val Town's free tier caps at 10MB, roughly 35k hits).

The OAuth flow uses the [Cloudflare Worker proxy](/posts/til-oauth-proxy-static-sites/) I wrote about earlier. Everything stays client-side except the token exchange.

## Tradeoffs

This setup won't tell you bounce rates, session duration, or conversion funnels. If you need that level of insight, you probably need a real analytics product.

But for "did anyone read my post about parsing code with LLMs?" - this works fine. And nobody's privacy got trampled in the process.