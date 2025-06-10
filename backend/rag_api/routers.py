from .utils.logging_utils import log_prompt
from fastapi import APIRouter, Query
from fastapi.responses import StreamingResponse
from .main import client, model

import httpx
import asyncio
import json
import time
import os

COLLECTION_NAME = "manga"

# Configurable endpoints and keys
OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "llama3:8b"

OPENROUTER_URL = os.getenv(
    "AI_API_URL", "https://api.openrouter.ai/v1/chat/completions"
)
OPENROUTER_API_KEY = os.getenv("AI_API_KEY")
OPENROUTER_MODEL = os.getenv("AI_MODEL")

router = APIRouter(prefix="/api/ai", tags=["RAG API"])

### PROMPT GENERATOR ###


def build_prompt(query: str, results: list[dict]) -> str:
    context = "\n\n".join(
        [
            f"""Manga #{i+1}
                Title: {r.payload.get('title', 'N/A')}
                Alternative Titles: {', '.join(r.payload.get('alt_titles', [])) or 'N/A'}
                Genres: {', '.join(r.payload.get('tags', [])) or 'N/A'}
                Description: {r.payload.get('description', 'No description available.')}
            """
            for i, r in enumerate(results)
        ]
    )

    prompt = f"""
        You are an expert manga recommendation assistant trained to help users find manga based on preferences, genres, or descriptions.

        Use the following list of manga and their metadata to answer the user's question. Rely only on the information provided in the context.

        When referring to a manga in your response:
        - Always use the **main title**, and if any English alternate titles are available, include the most relevant one **in brackets** right after the main title (e.g., *Shingeki no Kyojin [Attack on Titan]*).
        - If no English alternate title is available, just use the main title.

        If a direct or inferred answer is not possible based on the provided data, respond with: "I don't have enough information to answer that."

        Context:
        {context}

        User Question: {query}

        Answer:"""
    return prompt.strip()


### STREAM FUNCTIONS ###


async def stream_openrouter_response(prompt: str):
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }

    body = {
        "model": OPENROUTER_MODEL,
        "messages": [{"role": "user", "content": [{"type": "text", "text": prompt}]}],
        "stream": True,
    }

    async with httpx.AsyncClient(timeout=None) as client:
        try:

            async with client.stream(
                "POST", OPENROUTER_URL, headers=headers, json=body
            ) as response:
                response.raise_for_status()

                async for line in response.aiter_lines():
                    if line.strip().startswith("data: "):
                        data = line.strip().removeprefix("data: ")
                        if data == "[DONE]":
                            break
                        try:
                            chunk = json.loads(data)
                            delta = chunk["choices"][0]["delta"]
                            yield delta.get("content", "")
                            await asyncio.sleep(0)
                        except (KeyError, json.JSONDecodeError):
                            continue
        except Exception as e:
            print(f"⚠️ OpenRouter failed: {e}")
            raise


async def stream_ollama_response(prompt: str, model: str = OLLAMA_MODEL):
    headers = {"Content-Type": "application/json"}
    payload = {"model": model, "prompt": prompt, "stream": True}

    async with httpx.AsyncClient(timeout=None) as client:
        start_time = time.perf_counter()
        async with client.stream(
            "POST", OLLAMA_URL, json=payload, headers=headers
        ) as response:
            first_token_time = None

            async for line in response.aiter_lines():
                if line.strip():
                    try:
                        data = json.loads(line)
                        token = data.get("response", "")

                        if first_token_time is None:
                            first_token_time = time.perf_counter()
                            elapsed = first_token_time - start_time
                            print(
                                f"⏱️ Time to first token (Ollama): {elapsed:.2f} seconds"
                            )

                        yield token
                        await asyncio.sleep(0)
                    except json.JSONDecodeError:
                        continue


async def get_best_stream(prompt: str):
    try:
        return stream_openrouter_response(prompt)
    except Exception:
        print("🔁 Falling back to Ollama.")
        return stream_ollama_response(prompt)


### MAIN SEARCH ENDPOINT ###


@router.get("/search")
async def search_manga(
    query: str = Query(..., description="User's question about manga"), top_k: int = 15
):
    total_start = time.time()

    # Step 1: Embed the query
    t0 = time.time()
    query_vector = model.encode(query).tolist()
    print(f"⏱️ Step 1 (Embedding): {time.time() - t0:.2f}s")

    # Step 2: Perform vector search in Qdrant
    t1 = time.time()
    results = client.search(
        collection_name=COLLECTION_NAME, query_vector=query_vector, limit=top_k
    )
    print(f"⏱️ Step 2 (Vector search): {time.time() - t1:.2f}s")

    if not results:
        return {"error": "No relevant manga found."}

    # Step 3: Build prompt
    t2 = time.time()
    prompt = build_prompt(query, results)
    log_prompt(prompt, query)
    print(f"⏱️ Step 3 (Build prompt): {time.time() - t2:.2f}s")

    # Step 4: Stream response
    t3 = time.time()
    response_stream = await get_best_stream(prompt)
    print(f"⏱️ Step 4 (Prepare stream): {time.time() - t3:.2f}s")

    print(f"✅ Total time: {time.time() - total_start:.2f}s")
    return StreamingResponse(response_stream, media_type="text/plain")
