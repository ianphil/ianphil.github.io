# Blog Analytics Options Research

Summary of analytics options for a Hugo blog hosted on GitHub Pages.

## Current Setup

- **Static Site Generator**: Hugo v0.144.2
- **Theme**: no-style-please (minimalist)
- **Hosting**: GitHub Pages
- **Current Analytics**: None

## Analytics Options Explored

### Standard Privacy-Friendly Options

| Service | Cost | Notes |
|---------|------|-------|
| [Counter.dev](https://counter.dev/) | Free | Open source, self-hostable, lightweight |
| [GoatCounter](https://www.goatcounter.com/) | Free (non-commercial) | SQLite-based, simple self-host |
| [Plausible](https://plausible.io/) | $9/mo | Privacy-focused, no cookies |
| [Counterscale](https://counterscale.dev/) | Free | Runs on Cloudflare Workers free tier |
| [Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/) | Free | Requires Cloudflare |
| [hitscounter.dev](https://hitscounter.dev/) | Free | Self-hostable badge counter |

### GitHub-Native Storage Options

#### Simon Willison's Cloudflare Worker + Gist Approach

Uses a Cloudflare Worker to handle GitHub OAuth, storing tokens in localStorage, enabling client-side JS to save data directly to GitHub Gists.

**Resources:**
- [TIL: GitHub OAuth for static sites](https://til.simonwillison.net/cloudflare/workers-github-oauth)
- [Worker code on GitHub](https://github.com/simonw/tools/blob/main/cloudflare-workers/github-auth.js)
- [tools.simonwillison.net](https://tools.simonwillison.net/) - live example

**Requirements:**
- Cloudflare account (free)
- Cloudflare Workers (free tier: 100k requests/day)
- GitHub OAuth App (free)
- Must be on your own domain (can't reuse Simon's setup due to localStorage domain scoping)

#### JSONGist.io

- [JSONGist.io](https://jsongist.io/) - Uses GitHub Gists as JSON storage via API
- Requires sign-in with GitHub
- Hosted service (dependency on their API server)

### Azure-Based Options

**Azure Static Web Apps** has built-in GitHub authentication on the free tier:
- [Azure Static Web Apps Authentication Docs](https://learn.microsoft.com/en-us/azure/static-web-apps/authentication-authorization)
- Pre-configured providers: GitHub, Microsoft Entra ID
- No extra configuration needed for basic auth

**Azure Functions** free tier:
- 1 million executions/month free
- Can serve as OAuth proxy or tracking endpoint

### GitHub Actions Pipeline Approach (No OAuth)

Avoids client-side OAuth entirely:

```
[Tracking pixel on free service] → [Logs hits to temp storage]
                                           ↓
                              [Scheduled GitHub Action]
                                           ↓
                    [Action commits stats.json to repo]
```

**Components:**
1. Tracking pixel hosted on Azure Functions or Cloudflare Worker
2. Temporary storage (Azure Table Storage, Cloudflare KV)
3. Scheduled GitHub Action pulls data and commits to repo
4. Final analytics data lives in repo as JSON (version controlled)

## Key Considerations

- **Domain scoping**: localStorage tokens are domain-specific; can't reuse another site's OAuth setup
- **GitHub secrets**: Write-only from Actions; can't be read by client-side code
- **Public Gists**: Can be read without auth, but writing requires a token

## Related Resources

- [GitHub: Analytics for GitHub Pages Discussion](https://github.com/orgs/community/discussions/31474)
- [Counter.dev GitHub Repo](https://github.com/ihucos/counter.dev)
- [GoatCounter GitHub Repo](https://github.com/arp242/goatcounter)
- [gr2m/cloudflare-worker-github-oauth-login](https://github.com/gr2m/cloudflare-worker-github-oauth-login)
