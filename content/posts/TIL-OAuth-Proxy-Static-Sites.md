---
title: "TIL: OAuth for Static Sites (Without Losing Your Mind)"
date: 2026-01-05T23:00:00-05:00
github_issue: 11
draft: false
tags:
  - oauth
  - cloudflare-workers
  - static-sites
  - TIL
---

Static sites are great until you need users to log in. Then you're suddenly reading OAuth specs at 2am, questioning your life choices, and wondering if maybe you should just use a "real" backend after all.

Good news: you don't need a server. You need about 50 lines of code and a Cloudflare Worker.

## The Problem

I wanted my static site tools to authenticate with GitHub so they could read and write Gists. OAuth requires a server-side component to exchange authorization codes for tokens - the client secret can't live in browser JavaScript (unless you enjoy getting hacked).

## The Solution

[Simon Willison figured this out](https://til.simonwillison.net/cloudflare/workers-github-oauth) and I shamelessly copied his approach. A tiny Cloudflare Worker acts as an OAuth proxy:

1. User clicks "Sign in with GitHub"
2. Worker redirects to GitHub's OAuth page
3. User approves, GitHub redirects back with a code
4. Worker exchanges the code for a token (this is the server-side bit)
5. Worker redirects to your static site with the token in the URL fragment

The token goes in the URL *fragment* (`#token=xyz`), not the query string. Fragments never get sent to servers - they stay entirely client-side. Your static site grabs the token, stores it in localStorage, and clears the URL. Done.

Cloudflare Workers run at the edge with a generous free tier. Deploy with `wrangler deploy` and forget about it. No containers, no scaling, no ops. [My implementation is on GitHub](https://github.com/ianphil/tools/tree/master/cloudflare/github-oauth).

## The Catch

This stores the token in localStorage, so any JavaScript on your domain can access it. For personal tools, that's fine. For a real product with real users, you'd want HttpOnly cookies, token rotation, the whole parade.

But for scratching your own itch? Ship it.