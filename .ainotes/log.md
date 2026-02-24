# AI Notes — Log

## 2026-02-24
- theme: Switched from nostyleplease to krausefx-hugo theme; theme lives in themes/krausefx-hugo/ (not a git submodule)
- deployment: GitHub Actions workflow (.github/workflows/hugo.yaml) deploys on push to master + daily 6AM UTC cron for scheduled posts
- layouts: Site overrides analytics.html partial (val.run tracking pixel) — must be preserved across theme changes
- hugo: Hugo Extended required (theme uses CSS asset pipeline via resources.Get + minify + fingerprint)
- hugo: hugo server dies when run in non-interactive shells (no stdin); use Start-Process to keep it alive
- config: About page lives at content/page/about.md, not content/about.md — URLs are /page/about/
