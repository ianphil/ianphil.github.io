# Copilot Instructions

## Build & Preview

```bash
# Local dev server (Hugo Extended required)
hugo server -D

# Production build (matches CI)
hugo --gc --minify
```

CI uses Hugo **0.144.2** Extended (`hugo_extended`). Config must stay compatible with that version — notably, use `[pagination] pagerSize` not the deprecated `paginate` key.

## Architecture

This is a Hugo static blog deployed to GitHub Pages at `https://blog.ianp.io/`.

- **Theme**: `krausefx-hugo` lives directly in `themes/krausefx-hugo/` (not a git submodule). It has a right sidebar with profile/bio/social links, GitHub-style heading rendering, and responsive layout.
- **Site overrides**: `layouts/partials/` contains overrides that take precedence over theme templates. The `analytics.html` partial (val.run tracking pixel) and `footer.html` are site-level overrides — preserve them when modifying the theme.
- **Content structure**: Posts go in `content/posts/`, standalone pages in `content/page/` (e.g., About is at `content/page/about.md` → `/page/about/`).
- **Scheduled posts**: Use `draft: false` with a future `date` in front matter. The CI workflow runs a daily 6AM UTC cron rebuild to publish them.

## Conventions

### Post front matter

```yaml
---
title: "Post Title"
date: 2026-01-01T10:00:00-05:00
draft: false
tags:
  - ai
  - tools
---
```

Posts use YAML front matter with kebab-case filenames. The `content/_templates/post.md` is an Obsidian Templater template (ignored by Hugo via `ignoreFiles`).

### Deployment

Push to `master` triggers GitHub Actions build + deploy. There is no staging branch or PR-based preview — commits to master go straight to production.
