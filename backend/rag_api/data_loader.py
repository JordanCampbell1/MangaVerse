from qdrant_client.http.models import PointStruct, VectorParams, Distance
import json
from tqdm import tqdm
from qdrant_client.http.exceptions import UnexpectedResponse

from main import client, model

collection_name = "manga"

# Check if collection exists and create if not
if not client.collection_exists(collection_name=collection_name):
    client.create_collection(
        collection_name=collection_name,
        vectors_config=VectorParams(size=384, distance=Distance.COSINE),
    )
else:
    # Optional: clear existing points if you want to reset
    client.delete_collection(collection_name=collection_name)
    client.create_collection(
        collection_name=collection_name,
        vectors_config=VectorParams(size=384, distance=Distance.COSINE),
    )

# Load from JSON
with open("manga.json", "r", encoding="utf-8") as f:
    mangas = json.load(f)

descs, ids, titles = [], [], []

for manga in mangas:
    desc = manga.get("attributes", {}).get("description", {}).get("en")
    title = manga.get("attributes", {}).get("title", {}).get("en")
    if not desc or not title:
        continue

    descs.append(desc)
    ids.append(manga["id"])
    titles.append(title)

# Batch encode
print(f"Encoding {len(descs)} descriptions in batches...")
vectors = model.encode(descs, batch_size=32, show_progress_bar=True)

points = [
    PointStruct(
        id=ids[i],
        vector=vectors[i].tolist(),
        payload={"title": titles[i], "description": descs[i]},
    )
    for i in range(len(ids))
]

print(f"Upserting {len(points)} points to Qdrant...")
client.upsert(collection_name=collection_name, points=points)
print("Data loading complete.")
# # Handle potential errors during upsert
# try:
#     client.upsert(collection_name=collection_name, points=points)
# except UnexpectedResponse as e:
#     print(f"Error during upsert: {e}")
# # Ensure the collection is ready for use
# if not client.collection_exists(collection_name=collection_name):
#     print(f"Collection {collection_name} was not created successfully.")
# else:
#     print(f"Collection {collection_name} is ready with {len(points)} points.")
# # Ensure the collection is ready for use
# # Ensure the collection is ready for use
# # Ensure the collection is ready for use
# # Ensure the collection is ready for use
