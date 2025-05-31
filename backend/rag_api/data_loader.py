from qdrant_client.http.models import PointStruct, VectorParams, Distance
import json
from tqdm import tqdm

from main import client, model  # Assuming client is defined in main.py

collection_name = "manga"

# Create collection
client.recreate_collection(
    collection_name=collection_name,
    vectors_config=VectorParams(size=384, distance=Distance.COSINE),
)

# Load from JSON
with open("manga.json", "r", encoding="utf-8") as f:
    mangas = json.load(f)

points = []
for manga in tqdm(mangas, desc="Inserting Manga Into Qdrant"):
    # Skip if manga has no description or title
    desc = manga.get("attributes", {}).get("description", {}).get("en")
    title = manga.get("attributes", {}).get("title", {}).get("en")
    if not desc or not title:
        continue

    vector = model.encode(desc).tolist()
    points.append(
        PointStruct(
            id=manga["id"], vector=vector, payload={"title": title, "description": desc}
        )
    )

client.upsert(collection_name=collection_name, points=points)
