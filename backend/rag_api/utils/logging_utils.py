import os
import re
from datetime import datetime


def log_prompt(prompt: str, query: str):
    # Ensure the log directory exists
    os.makedirs("prompt_logs", exist_ok=True)

    # Sanitize and create a timestamped filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    # Remove or replace unsafe characters in the query for filename
    safe_query = re.sub(
        r'[<>:"/\\|?*\n\r\t]', "_", query
    )  # replace disallowed characters
    safe_query = safe_query.replace(" ", "_")[
        :50
    ]  # replace spaces and limit filename length

    filename = f"prompt_logs/{timestamp}_{safe_query}.txt"

    # Write the prompt to the file
    with open(filename, "w", encoding="utf-8") as f:
        f.write(prompt)
