---
title: "AI Methodologies: Create a Library"
date: 2026-01-06T11:50:00-05:00
draft: false
tags:
  - ai
---
## **A Practical Method: Build a Verified Template Library**

When a task repeats, you can capture the pattern as a template that produces a solid first draft. Templates make expectations explicit: inputs, constraints, checks, and what “done” looks like. The goal is not to automate judgment, it’s to reduce rework and make outcomes easier to verify. Over time, the library becomes a shared baseline that teams can use and improve when appropriate.

**Habits:**

- Identify one recurring task and draft a template that includes **inputs, constraints, and expected outputs**.
- Add **verification steps** to every template (tests, linters, acceptance criteria, security checks, diff review).
- Include **failure modes and stop conditions** (when to escalate, when human review is required).
- Run the template on a small, real example and record **evidence** (links to PRs, test results, logs).
- Version templates like code: review changes, track owners, and retire templates that drift or don’t pay off.
- Refine templates based on outcomes: what broke, what was ambiguous, what checks caught issues.