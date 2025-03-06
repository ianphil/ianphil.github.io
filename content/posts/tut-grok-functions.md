+++
date = '2025-03-05T22:40:59-05:00'
title = 'Tutorial - Grok Functions'
+++
# Fun Tutorial: Using Grok's Function Calling Feature via the API with Python and UV

In this tutorial, you'll learn how to use Grok's function calling feature via its API in a Python project. We'll use **UV**, a fast Python package manager, to set up and manage the project. By the end, you'll have a simple, interactive script that lets Grok flip a virtual coin and respond with the result—all while having a bit of fun!

---

## Prerequisites

Before we start, make sure you have the following:

- **UV Installed**: UV is a speedy alternative to pip. If you don’t have it yet, install it by following the [official installation guide](https://docs.astral.sh/uv/getting-started/installation/).
- **Grok API Key**: You’ll need an API key from xAI to access Grok’s API. Here’s how to get one:
  1. Go to [ide.x.ai](https://ide.x.ai).
  2. Log in with your X account.
  3. Click the profile icon in the top right corner and select **"API Keys"**.
  4. Click **"Create API Key"** and follow the prompts to generate and copy your key.

---

## Step 1: Set Up Your Project with UV

UV simplifies project initialization and dependency management. Let’s create a new project.

1. Open your terminal and run:
   ```bash
   uv init grok_function_calling
   ```
   This command creates a directory called `grok_function_calling` with a basic project structure, including a `pyproject.toml` file and a `.python-version` file.

2. Navigate into your project directory:
   ```bash
   cd grok_function_calling
   ```

---

## Step 2: Add Dependencies with UV

We’ll need two Python packages for this tutorial:
- **`openai`**: This library lets us interact with Grok’s API (yes, it’s compatible!).
- **`python-dotenv`**: This helps us load the API key securely from a `.env` file.

Add these dependencies using UV:
```bash
uv add openai python-dotenv
```
UV will update your `pyproject.toml` file and install the packages into a project-specific virtual environment.

---

## Step 3: Set Up Your API Key

To keep your API key secure, store it in a `.env` file instead of hardcoding it.

1. Create a file named `.env` in your project directory.
2. Add your API key to it like this:
   ```
   XAI_API_KEY=your_api_key_here
   ```
   Replace `your_api_key_here` with the key you got from xAI.

---

## Step 4: Write the Python Code

Now, let’s write a script that uses Grok’s function calling feature to flip a virtual coin. We’ll define a function that Grok can call and handle its response.

1. Create a file named `main.py` in your project directory.
2. Add the following code to `main.py`:

   ```python
   import os
   import random
   import json
   from dotenv import load_dotenv
   from openai import OpenAI

   # Load the API key from the .env file
   load_dotenv()
   XAI_API_KEY = os.getenv("XAI_API_KEY")

   # Initialize the OpenAI client with Grok's API base URL
   client = OpenAI(
       api_key=XAI_API_KEY,
       base_url="https://api.x.ai/v1",
   )

   # Define the coin flip function
   def flip_coin():
       return random.choice(["heads", "tails"])

   # Define the tool (function) for Grok to call
   tools = [
       {
           "type": "function",
           "function": {
               "name": "flip_coin",
               "description": "Flip a coin and return heads or tails",
               "parameters": {
                   "type": "object",
                   "properties": {}
               }
           }
       }
   ]

   # Set up the initial conversation
   messages = [
       {"role": "system", "content": "You are Grok, a helpful assistant."},
       {"role": "user", "content": "Flip a coin"}
   ]

   # Make the first API call to Grok
   completion = client.chat.completions.create(
       model="grok-beta",
       messages=messages,
       tools=tools,
   )

   # Get Grok's response
   response_message = completion.choices[0].message

   # Check if Grok wants to call the flip_coin function
   if response_message.tool_calls:
       tool_call = response_message.tool_calls[0]
       function_name = tool_call.function.name
       if function_name == "flip_coin":
           # Execute the function
           result = flip_coin()
           # Update the message history
           messages.append(response_message)
           messages.append({
               "role": "tool",
               "content": result,
               "tool_call_id": tool_call.id
           })
           # Make a second API call to get Grok's final response
           final_completion = client.chat.completions.create(
               model="grok-beta",
               messages=messages,
           )
           final_response = final_completion.choices[0].message.content
           print(final_response)
       else:
           print("Unknown function called")
   else:
       # If no function is called, print Grok’s direct response
       print(response_message.content)
   ```

### What’s Happening in the Code?

- **API Key Setup**: We load the API key from the `.env` file using `python-dotenv`.
- **Client Initialization**: We set up the `openai` client with xAI’s base URL (`https://api.x.ai/v1`) and your API key.
- **Function Definition**: The `flip_coin` function randomly returns "heads" or "tails."
- **Tool Definition**: We tell Grok about our `flip_coin` function using a JSON-like structure, so it knows when to call it.
- **API Call #1**: We ask Grok to "Flip a coin" and provide the tool. Grok decides whether to call `flip_coin`.
- **Function Handling**: If Grok requests the function, we run it, send the result back, and make a second API call.
- **Response**: Grok uses the coin flip result (e.g., "heads") to craft a fun, final response.

---

## Step 5: Run Your Script with UV

UV makes running your script a breeze by automatically using the project’s virtual environment.

1. In your terminal, run:
   ```bash
   uv run main.py
   ```

2. You’ll see a response from Grok, something like:
   ```
   The coin landed on heads!
   ```
   (The result will be random—heads or tails—each time you run it!)

---

## How It Works

- **Function Calling**: Grok’s API lets it call external functions you define. When you say "Flip a coin," it recognizes that it can use the `flip_coin` function.
- **Tool Definition**: The `tools` list describes available functions, including their names, purposes, and parameters (none in this case).
- **Two-Step Interaction**:
  1. The first API call checks if Grok wants to use a function.
  2. If it does, we run the function locally, send the result back, and get Grok’s final response in a second call.

This process mimics real-world scenarios where an AI might call a weather API, calculator, or other tools based on user input.

---

## Bonus: Make It Interactive

Want to keep the fun going? Modify `main.py` to take user input in a loop. Replace the code after the tool definition with this:

```python
while True:
    user_input = input("You: ")
    if user_input.lower() in ["exit", "quit"]:
        break
    messages = [
        {"role": "system", "content": "You are Grok, a helpful assistant."},
        {"role": "user", "content": user_input}
    ]
    completion = client.chat.completions.create(
        model="grok-beta",
        messages=messages,
        tools=tools,
    )
    response_message = completion.choices[0].message
    if response_message.tool_calls:
        tool_call = response_message.tool_calls[0]
        function_name = tool_call.function.name
        if function_name == "flip_coin":
            result = flip_coin()
            messages.append(response_message)
            messages.append({
                "role": "tool",
                "content": result,
                "tool_call_id": tool_call.id
            })
            final_completion = client.chat.completions.create(
                model="grok-beta",
                messages=messages,
            )
            final_response = final_completion.choices[0].message.content
            print(final_response)
        else:
            print("Unknown function called")
    else:
        print(response_message.content)
```

Now, run it again with `uv run main.py`, and you can keep chatting with Grok—ask it to flip a coin as many times as you like or try other questions!

---

## Conclusion

Congrats! You’ve built a fun Python project that uses Grok’s function calling feature via its API, all managed with UV. You’ve learned how to:
- Set up a project with UV.
- Define a function for Grok to call.
- Interact with the API to process user requests and function results.

Feel free to expand this by adding more functions—like a joke generator or a random number picker—to see what else Grok can do. With UV keeping your dependencies in check, you’re ready to explore even more exciting projects. Happy coding!