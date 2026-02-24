---
title: "TIL: Building a Skill Marketplace"
date: 2026-01-03T15:45:38-05:00
draft: false
tags:
  - llm-generated
  - TIL
  - skills
  - ai
  - testing
---

I built a skill and a skill marketplace today. It only took 12 iterations, three test projects, and one existential crisis about what "markdown format" actually means.

## It Started With a Problem (As It Always Does)

I have this product at work. It's fine. It works. But it was built before anyone thought AI agents would be poking around in our codebases, so its observability is... not great. Imagine trying to debug something while blindfolded. That's what agents experience when they work with it.

So I decided to fix that. Step one: better tests. Not just any tests... tests that an AI could actually use to figure out what went wrong and fix it autonomously.

Related: [Verification is Important](/posts/ai-methodologies-verification-is-important/)

## Down the Rabbit Hole

I was doom-scrolling X when I stumbled across [Simon Willison](https://x.com/simonw/status/2007133682008764853) talking about how he ported an HTML5 parser from Python to JavaScript. In 4.5 hours. With an AI. Using 9,200 test runs.

Let that sink in. 9,200 autonomous test runs. The AI just kept running tests, seeing failures, fixing code, and repeating until everything passed. No human babysitting required.

Then I found [Charlie Marsh](https://x.com/charliermarsh/status/2007117912801427905) from Astral (the `uv` people) talking about their testing approach. They have this thing called [ty_test](https://raw.githubusercontent.com/astral-sh/ruff/refs/heads/main/crates/ty_test/README.md) where tests are written in markdown. Not as documentation that happens to have code snippets... actual executable tests that happen to be readable.

Here's an [example](https://raw.githubusercontent.com/astral-sh/ruff/refs/heads/main/crates/ty_python_semantic/resources/mdtest/typed_dict.md) if you want to see what that looks like.

## The Lightbulb Moment

The insight is embarrassingly simple: **tests are the oracle**.

When you have comprehensive tests, an AI agent can just loop: run tests → see failures → fix code → repeat. No separate spec document. No hand-holding. The tests tell the agent exactly what's wrong and what "correct" looks like.

The format looks like this:

```python
result = convert(100, "c", "f")  # expect: 212.0
convert(-500, "c", "f")  # error: [below-absolute-zero]
```

Prose explains what's happening. Code demonstrates it. Comments are the assertions. It's documentation and tests in one file. Revolutionary? Maybe not. But definitely useful.

## Twelve Rounds of "This Still Doesn't Work"

So I tried to write a prompt that would generate these literate tests. How hard could it be?

Very. Very hard.

The first version was too vague. The AI just wrote normal tests with slightly better comments.

The second version I rewrote completely after actually understanding the Ruff pattern. Better, but still missing pieces.

By version four, I realized I needed this to work for multiple languages... Python, Bash, PowerShell, C#, Rust. Each handles errors differently. Python throws exceptions. Rust returns Results. Bash just gives you exit codes and hopes for the best.

Then came the feedback rounds. Turns out "tests should have intent" means nothing if you don't explain that agents will literally cheat if you don't tell them *why* a test matters. Without context, an AI will happily hardcode `if input == -40: return -40` instead of actually implementing the formula.

I added a runner contract (how tests execute), an assertion spec (exact syntax), matchers for floating-point nonsense (`approx()`, `contains()`, `matches()`), block semantics, setup conventions, and about a dozen other things I thought were obvious but apparently weren't.

Twelve iterations. Twelve.

## The Moment of Truth (And Failure)

Finally, I packaged everything into a skill and put it in my [marketplace](https://github.com/ianphil/my-skills):

```
my-skills/
├── .claude-plugin/
└── skills/
    └── literate-tests/
        ├── SKILL.md
        └── scripts/  (runners for 7 languages)
```

Then I tried to use it.

The AI produced a pytest file.

A perfectly normal, completely useless pytest file. Not markdown. Not a custom runner. Just... pytest. The exact thing I explicitly did not want.

Turns out "markdown format" to an AI means "write about markdown" not "create markdown files." And "custom test runner" apparently means "use the test runner you already know."

So I added a section called "What This Pattern Produces" that literally spells out: you are creating TWO things... a `.md` file AND a `run_tests.py` script. NOT pytest. NOT jest. NOT xunit.

Sometimes you have to treat language models like they're very smart toddlers.

## Proof It Actually Works

To validate the skill wasn't garbage, I built [packet-groper](https://github.com/ipdelete/packet-groper)... a network scanner that finds live hosts on your subnet. Three sessions:

| Session | What Happened |
|---------|---------------|
| 143846 | Set up project, wrote failing tests (TDD red phase) |
| 145016 | Pivoted to literate testing, created markdown tests + runner |
| 153336 | Implemented the scanner, all 16 tests pass |

The result? A CLI that scans ~1000 hosts in 15 seconds using 100 concurrent workers. Built almost entirely through the test-driven loop I'd been trying to enable.

## What I Actually Learned

**Tests are the oracle.** Give an agent good tests and it can work autonomously. Give it bad tests and you'll spend more time fixing the fixes than just writing the code yourself.

**Intent matters.** If you don't explain *why* something should work a certain way, the AI will find creative shortcuts that technically pass but completely miss the point.

**Be painfully explicit about deliverables.** "Use markdown format" is not the same as "create a file called `tests.md`." Assume the AI will find the most convenient interpretation of your instructions, and that interpretation is probably wrong.

**Iteration is the job.** Twelve rounds felt like a lot. But each round fixed real problems I couldn't have anticipated. The prompt that finally worked looks nothing like the one I started with.

**Validate on real projects.** packet-groper exists because I needed to know the skill actually worked, not just that it looked like it would work.

Now if you'll excuse me, I need to go add more explicit instructions to my other prompts. Apparently none of them are clear enough either.
