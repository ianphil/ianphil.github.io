+++
date = '2025-12-26'
draft = false
title = 'Adaptive Inference Pattern: Contextual Memory'
+++
## Contextual Memory with Temporal Awareness

A conversation isn't just a single message—it's a series of interactions. **Contextual Memory** lets our AI agent remember past interactions and use that history to make better decisions. Here's the Python version of a context memory system:

```python
import time

class ContextMemory:
    def __init__(self):
        self.short_term_memory = []  # List of recent interactions
        self.long_term_memory = {}   # High-confidence, longer-lasting info

    def add_user_input(self, user_input: str):
        self.short_term_memory.append({
            'type': 'user_input',
            'content': user_input,
            'timestamp': time.time()
        })
        self.prune_short_term_memory()

    def add_tool_results(self, results: list):
        for result in results:
            self.short_term_memory.append({
                'type': 'tool_result',
                'content': result,
                'timestamp': time.time()
            })
            # Store results with high confidence in long-term memory
            if result.get('success') and result['metadata']['confidence'] > 0.9:
                key = f"{'-'.join(result['metadata']['attributions'])}-{time.time()}"
                self.long_term_memory[key] = result['data']

    def get_context(self) -> list:
        # For simplicity, we return the short-term memory.
        # In a real scenario, you might weight items based on recency and relevance.
        return self.short_term_memory

    def prune_short_term_memory(self):
        MAX_STM_SIZE = 20
        if len(self.short_term_memory) > MAX_STM_SIZE:
            self.short_term_memory = self.short_term_memory[-MAX_STM_SIZE:]
```

This memory system helps keep conversations coherent and ensures that valuable information isn't lost over time—even if it's just been spoken.
