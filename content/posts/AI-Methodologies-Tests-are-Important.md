---
title: "AI Methodologies: Tests are Important"
date: 2026-01-08T11:50:00-05:00
github_issue: 8
draft: false
tags:
  - ai
---

## **A Practical Method: Build Verification Into the Loop**

Agent output is a first draft, not a conclusion. In many cases, the fastest way to trust it is to attach clear acceptance criteria and have the agent produce evidence: lint results, tests, and targeted checks. This approach keeps iteration cheap, makes failures obvious, and preserves human accountability with artifacts you can review.

**Habits:**

- Add explicit **acceptance criteria** to agent prompts (inputs, expected behavior, and “done” conditions).    
- Require the agent to run **linters/formatters** and report results (or explain constraints when it can’t).
- Make **unit tests** the default for logic changes; have the agent add or update tests alongside code.
- For behavior that spans components, use **integration or end-to-end checks** where useful (smoke tests beat vibes).
- Ask for a short **verification summary**: what was tested, what passed/failed, and what remains unverified.
- Keep **cost bounds**: cap iterations/compute, and escalate to human review when the loop isn’t converging.