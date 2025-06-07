import os
from datetime import datetime


def log_prompt(prompt: str, query: str):
    # Ensure the log directory exists
    os.makedirs("prompt_logs", exist_ok=True)

    # Sanitize and create a timestamped filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    safe_query = query.replace(" ", "_").replace("/", "_")[:50]  # limit filename length
    filename = f"prompt_logs/{timestamp}_{safe_query}.txt"

    # Write the prompt to the file
    with open(filename, "w", encoding="utf-8") as f:
        f.write(prompt)
