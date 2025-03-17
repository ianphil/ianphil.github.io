+++
date = '2025-03-16T22:25:25-04:00'
draft = false
title = 'Parsing Code With LLMs'
+++

## My Notes

Today, I spent the day exploring how to parse code, process it with a Large Language Model (LLM), and apply the resulting edits back to the codebase. It’s a fascinating problem with multiple approaches, and I enjoyed digging into the different methodologies.

## Brainstorming and Initial Research

Before writing any code, I explored various ideas and brainstormed solutions using AI assistants like ChatGPT, Grok, and Claude. This helped me clarify the problem space and evaluate different potential solutions before diving into implementation.

## Experimenting with Code Parsing

To get a better grasp of the problem, I worked on several experiments:

1. **[RoslynCallGraph](https://github.com/ianphil/RoslynCallGraph)**  
   This project uses the .NET Compiler Platform (Roslyn) to analyze C# projects and construct a call graph. It helps developers understand dependencies between methods and visualize method interactions within their codebase.

2. **[Codex](https://github.com/ianphil/codex)**  
   A Python-based tool that integrates with LLMs to apply code changes based on natural language descriptions. This experiment helped me understand how to bridge human intent with automated code modifications.

3. **[Codex Parsing](https://github.com/ianphil/codex-parsing)**  
   A tutorial and experimental project that utilizes [Tree-sitter](https://github.com/tree-sitter/py-tree-sitter) to extract and manipulate parts of Python code. I worked on extracting the `greet` method using Tree-sitter to explore how it can help traverse and query the code graph.

## Investigating Aider’s Approach

Next, I explored how [Aider](https://github.com/Aider-AI/aider) applies LLMs to edit code. Unlike my initial approach, Aider doesn’t focus on Abstract Syntax Trees (ASTs) or code graphs. Instead, it prompts the LLM to return both the original code and the modified version, allowing it to perform find-and-replace operations on the files.

To understand Aider’s evolution, I examined:
- Old commits to track its development history
- The current codebase to understand its core functionalities
- Documentation to see what options are available
- Previous pull requests to analyze design choices made over time

### Key Findings:

- **Edit Format Documentation:** [Aider Edit Formats](https://github.com/Aider-AI/aider/blob/main/aider/website/docs/more/edit-formats.md)
- **Code Structure:**
  - Aider has **coders** and **prompts**, aligning with the edit formats described in the documentation.
  - Example: `udiff` format is implemented in [udiff_coder.py](https://github.com/Aider-AI/aider/blob/main/aider/coders/udiff_coder.py)
  - The best editor format is selected dynamically: [model selection logic](https://github.com/Aider-AI/aider/blob/4f4b10fd868680e0b87511d4bcf755f198089e8d/aider/models.py#L321)
  - Early implementation of `editblock_coder`: [editblock_coder.py](https://github.com/Aider-AI/aider/blob/070f0a29195078c514ad1fcb2928c87a68daae52/aider/coders/editblock_coder.py#L154)

## Reflections and Next Steps

This exploration gave me a clearer understanding of different approaches to code parsing and modification using LLMs. The contrast between AST-based approaches (like Tree-sitter and Roslyn) and text-diff-based approaches (like Aider) highlights the trade-offs between precision and flexibility.

Moving forward, I plan to:
- Experiment with integrating both AST-based and LLM-based approaches for hybrid solutions.
- Explore how well different LLMs handle structured vs. unstructured code modifications.
- Continue refining `Codex` to handle more complex code transformations.

This was an exciting deep dive, and I’m looking forward to the next steps in building smarter, more adaptable code editing tools!
