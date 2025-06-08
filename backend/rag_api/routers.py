from .utils.logging_utils import log_prompt
from fastapi import APIRouter, Query
from fastapi.responses import StreamingResponse

from .main import client, model
import httpx
import asyncio
import json
import time


COLLECTION_NAME = "manga"
OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "llama3:8b"


router = APIRouter(prefix="/api/ai", tags=["RAG API"])


###HELPER FUNCTIONS###
###
###


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


async def ollama_stream(prompt: str, model: str = OLLAMA_MODEL):
    headers = {"Content-Type": "application/json"}
    payload = {"model": model, "prompt": prompt, "stream": True}

    async with httpx.AsyncClient(timeout=None) as client:
        start_time = time.perf_counter()  # ⏱️ Start timer before sending request
        async with client.stream(
            "POST", OLLAMA_URL, json=payload, headers=headers
        ) as response:

            first_token_time = None

            async for line in response.aiter_lines():
                if line.strip():
                    try:
                        data = json.loads(line)
                        token = data.get("response", "")

                        # ⏱️ Measure time to first token
                        if first_token_time is None:
                            first_token_time = time.perf_counter()
                            elapsed = first_token_time - start_time
                            print(f"⏱️ Time to first token: {elapsed:.2f} seconds")

                        yield token
                        await asyncio.sleep(0)
                    except json.JSONDecodeError:
                        continue


###
###
###


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

    # Step 3: Build prompt for Ollama from results
    t2 = time.time()
    prompt = build_prompt(query, results)

    log_prompt(prompt, query)

    print(f"⏱️ Step 3 (Build prompt): {time.time() - t2:.2f}s")

    # Step 4: Get LLM response (streamed, so we only log time taken to prepare it)
    t3 = time.time()
    response = StreamingResponse(ollama_stream(prompt), media_type="text/plain")
    print(f"⏱️ Step 4 (Prepare stream): {time.time() - t3:.2f}s")

    print(f"✅ Total time: {time.time() - total_start:.2f}s")
    return response
