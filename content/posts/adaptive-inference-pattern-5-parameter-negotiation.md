+++
date = '2026-01-09'
draft = false
title = 'Adaptive Inference Pattern: Tool Parameter Negotiation'
+++
## Tool Parameter Negotiation – Asking the Right Questions

Sometimes the AI needs to ask you for more details. **Tool Parameter Negotiation** is the process that allows the agent to figure out what additional information it needs. Here's how you can do it in Python:

```python
class ParameterNegotiator:
    async def resolve_parameters(self, intent: dict, required_params: list, context_memory: ContextMemory) -> dict:
        # Identify missing parameters based on confidence levels
        missing_params = [
            param for param in required_params
            if param not in intent['parameters'] or intent['parameters'][param]['confidence'] < 0.8
        ]

        if not missing_params:
            params = {name: data['value'] for name, data in intent['parameters'].items()}
            return {'resolved': True, 'params': params}

        # Try to infer missing parameters from context
        inferred_params = self.infer_from_context(missing_params, context_memory)
        still_missing = [param for param in missing_params if param not in inferred_params]

        if still_missing:
            follow_up_question = self.generate_parameter_question(still_missing, intent['tool_name'])
            return {'resolved': False, 'followUpQuestion': follow_up_question}

        # Combine provided and inferred parameters
        params = {name: data['value'] for name, data in intent['parameters'].items() if data['confidence'] >= 0.8}
        params.update(inferred_params)
        return {'resolved': True, 'params': params}

    def infer_from_context(self, missing_params: list, context_memory: ContextMemory) -> dict:
        # Placeholder: try to fill in missing parameters based on previous context
        return {}

    def generate_parameter_question(self, missing_params: list, tool_name: str) -> str:
        return f"Could you please provide more details for {', '.join(missing_params)} for {tool_name}?"
```

This negotiation process ensures that the agent only moves forward when it has enough confidence in the parameters it's using. It's like asking clarifying questions in a conversation—pretty handy, right?
