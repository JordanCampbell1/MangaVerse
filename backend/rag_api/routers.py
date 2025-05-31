from fastapi import APIRouter, Query
from fastapi.responses import StreamingResponse

from .main import client, model
import httpx
import asyncio
import json

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
            f"Title: {r.payload.get('title')}\nDescription: {r.payload.get('description')}"
            for r in results
        ]
    )

    prompt = f"""
You are a helpful manga recommendation assistant. Use the context below to answer the user's question.
If the answer is not directly present in the manga descriptions, say you don't have enough information.

Context:
{context}

User Question: {query}
Answer:"""
    return prompt.strip()


async def ollama_stream(prompt: str, model: str = OLLAMA_MODEL):
    headers = {"Content-Type": "application/json"}
    payload = {"model": model, "prompt": prompt, "stream": True}

    async with httpx.AsyncClient(timeout=None) as client:
        async with client.stream(
            "POST", OLLAMA_URL, json=payload, headers=headers
        ) as response:
            async for line in response.aiter_lines():
                if line.strip():
                    try:
                        data = json.loads(line)
                        token = data.get("response", "")
                        yield token
                        await asyncio.sleep(0)  # Yield control to event loop
                    except json.JSONDecodeError:
                        continue


###
###
###


@router.get("/search")
async def search_manga(
    query: str = Query(..., description="User's question about manga"), top_k: int = 5
):
    # Step 1: Embed the query
    query_vector = model.encode(query).tolist()

    # Step 2: Perform vector search in Qdrant
    results = client.search(
        collection_name=COLLECTION_NAME, query_vector=query_vector, limit=top_k
    )

    if not results:
        return {"error": "No relevant manga found."}

    # Step 3: Build prompt for Ollama from results
    prompt = build_prompt(query, results)

    # Step 4: Get LLM response
    return StreamingResponse(ollama_stream(prompt), media_type="text/plain")
