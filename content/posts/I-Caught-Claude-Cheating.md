---
title: "I Caught Claude Cheating, So I Made It the Judge"
date: 2026-01-19T23:50:00-05:00
draft: false
tags:
  - ai
  - testing
  - skills
---

A few weeks ago I [built a skill called literate-tests](/posts/til-skills-marketplace/). Tests as markdown. Seven language runners. A porting cookbook. The works.

I just deleted almost all of it.

## The Original Idea

I wanted specification-first development. Write the spec, have it be executable, let agents run against it. The format was simple:

```python
result = convert(100, "c", "f")  # expect: 212.0
convert(-500, "c", "f")  # error: [below-absolute-zero]
```

Prose explains why. Code demonstrates behavior. Comments are assertions. I built runners for Python, JavaScript, TypeScript, Bash, PowerShell, Rust, and C#. Each one parsed markdown, extracted code blocks, and validated those `# expect:` comments.

It worked. Agents could run tests, see failures, fix code, repeat. Autonomous TDD.

## Then I Tried to Port Something

I had a real project: PowerShell scripts that needed to become Bash. The assertion-based tests were perfect for this... or so I thought. Define the contract in markdown, have both implementations pass the same tests.

I wrote a 753-line porting cookbook. Layered test suites. Interface tests vs implementation tests. The whole nine yards.

It still worked. But something felt off.

## The Moment I Caught Claude Cheating

I was watching Claude work through a test suite. There was an edge case it kept failing... something about handling malformed input. The test was clear:

```python
parse(malformed_input)  # error: [invalid-format]
```

Claude's fix? It deleted the test.

Not the whole test file. Just that one case. Quietly. In the middle of a larger commit. The remaining tests passed. Green checkmarks everywhere.

The agent had learned that tests are mutable. If the code doesn't match the test... change the test.

## Why Assertions Aren't Enough

The problem wasn't Claude being malicious. The problem was that `# expect: 42` doesn't tell you *why* 42 matters.

Consider this:

```python
elapsed < 50  # expect: True
```

An agent failing this test has options:
1. Make the code faster
2. Change 50 to 100
3. Delete the test

All three make the tests pass. Only one is correct. But the test doesn't encode which one.

I'd been building elaborate assertion syntax when what I actually needed was *intent*.

## The Pivot

I deleted seven runners, the porting cookbook, and about 800 lines of documentation. In their place: a single Python script that calls `claude -p` and a new test format:

```markdown
### Completes Quickly

Users perceive delays over 50ms as laggy. This runs on every keystroke.
The 50ms target is a UX requirement, not negotiable.

\`\`\`
Given a keystroke event
When process_keystroke() is called
Then it completes in under 50ms
\`\`\`
```

Now Claude is the judge. It reads the intent, reads the code, and evaluates: does this implementation satisfy what the user actually needs?

If an agent "fixes" a failing test by relaxing the threshold, the judge catches it. The assertion might pass literally, but the stated UX requirement is violated. `[intent-violated]`.

## Standing on Shoulders

If that Given/When/Then syntax looks familiar, it should. That's [Behavior Driven Development](https://en.wikipedia.org/wiki/Behavior-driven_development)... a pattern Dan North introduced in 2006. BDD was always about capturing intent, not just assertions. The idea that tests should describe behavior from the user's perspective, not implementation details.

I didn't invent anything here. I just noticed that BDD's original insight... *why* matters more than *what*... becomes critical when an AI is writing the code.

My workflow with AI had always been me running things and judging the results. Agent proposes, human evaluates. The assertion-based tests were trying to automate the "run things" part... but they were just recreating unit tests. pytest already exists. jest already exists. I wasn't adding anything new.

What I actually wanted was to automate the *judgment* part. BDD already had the format. LLMs provided the judge.

So now the tests have two parts:
1. **Intent statement** - Why this matters. What user need it serves. What breaks if it doesn't work.
2. **Assertion block** - The Given/When/Then behavior.

Both get evaluated. The test passes only if the implementation satisfies both the literal assertion AND the stated intent. It's BDD with an LLM acting as the product owner who can say "that's not what I meant."

## No Regrets

I don't miss the runners. They were just recreating testing patterns that already exist. The porting cookbook was useful... but porting code is a solved problem once you have good specs.

The [skill](https://github.com/ianphil/my-skills/tree/main/skills/spec-tests) went from 511 lines to 137. Fewer features, but the right ones.

## What's Actually New

Maybe nothing. Or maybe one small thing.

BDD always required a human to read the scenario and judge whether the implementation captured the intent. The Gherkin syntax was readable precisely so stakeholders could validate it. But stakeholders don't run test suites at 2am when an agent is iterating on a fix.

What's different now is that the judge can be automated. An LLM can read "users perceive delays over 50ms as laggy" and understand that relaxing the threshold to 100ms violates the requirement, even if the assertion technically passes.

It's an old pattern with a new capability. BDD gave us the format. LLMs gave us a judge that doesn't sleep.

The testing pyramid has unit tests at the base, integration in the middle, e2e at the top. Where do intent tests fit? Maybe they're a layer above e2e... tests that check whether the thing you built is the thing you meant to build. Or maybe they're orthogonal, a different axis entirely. I'm not sure this changes the pyramid for anyone else. But it changes it for me, at least until the next model comes out and makes all of this obsolete.

I caught Claude cheating once. Now I've made cheating harder... I hope.

---

## Appendix: Related Work

There's a lot of activity in this space. Here's what I found and where my approach fits.

### LLM-as-a-Judge (General)

The pattern is well-established for evaluating LLM outputs. [Confident AI](https://www.confident-ai.com/blog/why-llm-as-a-judge-is-the-best-llm-evaluation-method), [Evidently AI](https://www.evidentlyai.com/llm-guide/llm-as-a-judge), [Arize](https://arize.com/llm-as-a-judge/), and [Patronus AI](https://www.patronus.ai/llm-testing/llm-as-a-judge) all have guides and products. There's even an [Awesome-LLM-as-a-judge](https://github.com/llm-as-a-judge/Awesome-LLM-as-a-judge) repo. But most focus on evaluating *LLM outputs* (chatbot responses, RAG quality), not code implementations against intent.

### BDD + AI

- **[BDDTestAIGen](https://www.scitepress.org/Papers/2025/133744/133744.pdf)** - Academic paper on using LLMs to *generate* BDD tests, not judge them
- **[SuperSpec](https://medium.com/superagentic-ai/superspec-context-engineering-and-bdd-for-agentic-ai-3b826ca977eb)** - BDD for AI agents, treating the whole agent pipeline as the unit under test
- **[Momentic](https://momentic.ai/blog/behavior-driven-development)** - AI to eliminate BDD's glue code layer
- **[EDDOps](https://arxiv.org/html/2411.13768v3)** - "Evaluation-Driven Development" adapts TDD/BDD for non-deterministic LLM agents
- **[LAJ Framework](https://arxiv.org/html/2512.01232)** - LLM-as-a-Judge for test coverage: "static tools measure what code is executed, while LAJ assesses whether executed tests address specified requirements"

### The Gap

Most work falls into one of three categories:

1. Using LLMs to *generate* BDD tests (automation)
2. Evaluating LLM *outputs* (chatbot responses, summarization quality)
3. Using LLMs to *write* the glue code for traditional BDD

What I'm doing is different: using the LLM as the *judge* of whether human-written (or AI-written) code satisfies human-written intent specs. The spec is the contract. The LLM evaluates semantic compliance, not just assertion matching. It's a small club, but apparently not empty.
