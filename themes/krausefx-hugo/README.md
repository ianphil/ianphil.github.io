# KrauseFx-style Hugo Theme

A clean, minimal blog theme with a right sidebar, inspired by [krausefx.com](https://krausefx.com). Ported from the original Jekyll site to Hugo.

## Features

- Right sidebar with profile photo, bio, and social links
- GitHub-style markdown rendering (headings, code blocks, blockquotes)
- Responsive — sidebar collapses on mobile
- Pagination
- RSS feed
- Optional newsletter subscription form
- GitHub-style syntax highlighting
- Clean typography using system fonts

## Installation

### As a git submodule (recommended)

```bash
cd your-hugo-site
git submodule add https://github.com/ianphil/krausefx-hugo.git themes/krausefx-hugo
```

### Manual

Clone or download this repo into your `themes/` directory:

```bash
git clone https://github.com/ianphil/krausefx-hugo.git themes/krausefx-hugo
```

## Configuration

Copy `exampleSite/hugo.toml` to your site root and customize. Key settings:

```toml
theme = "krausefx-hugo"

[params.sidebar]
  name = "Your Name"
  bio = 'Your tagline<br/>Second line'
  avatar = "/images/profile.jpg"
  aboutLink = "/about/"

[params.social]
  github = "yourusername"
  twitter = "yourhandle"
```

## Content Structure

Posts go in `content/posts/`:

```
content/
├── posts/
│   ├── my-first-post.md
│   └── another-post.md
├── about/
│   └── _index.md
└── _index.md
```

## Creating Posts

```bash
hugo new posts/my-post.md
```

## License

MIT
