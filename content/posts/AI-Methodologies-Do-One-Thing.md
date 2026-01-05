---
title: "AI Methodologies: Do One Thing"
date: 2026-01-02T10:00:00-05:00
github_issue: 5
draft: false
tags:
  - ai
---

## **A Practical Method: Keep Agents Narrow, Make Results Verifiable**

When an agent is asked to do everything, it usually does nothing particularly well. A small, purpose-built agent with a focused prompt can produce a cleaner first draft, with clearer assumptions and fewer hidden side-quests. In many cases, splitting work by purpose makes it easier to apply constraints, verify results, and hold the system accountable. Use this when the workflow has distinct steps with different inputs, tools, or risk.

**Habits:**

- Define each agent’s job in one sentence (inputs, output shape, and what “done” means).
- Keep prompts scoped to one outcome; push unrelated context into a separate step or agent.
- Add explicit constraints (allowed tools, boundaries, and “must not” rules) in the prompt.
- Require a verification step: checks or validation criteria before accepting output.
- Version prompts (change notes, owners, and rollback when a prompt regresses).
- Track per-agent quality (success rate, common failure modes) and iterate intentionally.