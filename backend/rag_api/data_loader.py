from qdrant_client.http.models import PointStruct, VectorParams, Distance
import json
from tqdm import tqdm
from qdrant_client.http.exceptions import UnexpectedResponse

from main import client, model

collection_name = "manga"

# Create or recreate the collection
if client.collection_exists(collection_name=collection_name):
    client.delete_collection(collection_name=collection_name)

client.create_collection(
    collection_name=collection_name,
    vectors_config=VectorParams(size=384, distance=Distance.COSINE),
)

# Load manga data
with open("manga.json", "r", encoding="utf-8") as f:
    mangas = json.load(f)

descs, ids, titles, payloads = [], [], [], []

print("Extracting metadata from manga.json...")
for manga in tqdm(mangas, desc="Extracting"):
    attr = manga.get("attributes", {})
    desc = attr.get("description", {}).get("en")
    title = attr.get("title", {}).get("en")

    if not desc or not title:
        continue

    # Alternative titles
    alt_titles = [list(alt.values())[0] for alt in attr.get("altTitles", []) if alt]

    # Tags: genres, themes, formats
    tags = [
        tag["attributes"]["name"]["en"]
        for tag in attr.get("tags", [])
        if tag.get("attributes", {}).get("name", {}).get("en")
    ]
    tag_str = ", ".join(tags)

    # Metadata
    payload = {
        "id": manga["id"],
        "title": title,
        "description": desc,
        "alt_titles": alt_titles,
        "tags": tags,
        "tag_str": tag_str,
        "status": attr.get("status"),
        "year": attr.get("year"),
        "original_language": attr.get("originalLanguage"),
        "publication_demographic": attr.get("publicationDemographic"),
        "content_rating": attr.get("contentRating"),
        "url": attr.get("links", {}).get("raw"),
    }

    # Use enriched content for embedding
    enriched_input = f"{title}. {', '.join(alt_titles)}. {desc} Tags: {tag_str}."
    descs.append(enriched_input)
    ids.append(manga["id"])
    payloads.append(payload)
    titles.append(title)

# Encode enriched descriptions
print(f"\nEncoding {len(descs)} manga descriptions...")
vectors = model.encode(descs, batch_size=32, show_progress_bar=True)

# Build points
print("Preparing Qdrant points...")
points = [
    PointStruct(id=ids[i], vector=vectors[i].tolist(), payload=payloads[i])
    for i in tqdm(range(len(ids)), desc="Building Points")
]

# Upload to Qdrant
print(f"Upserting {len(points)} points to Qdrant...")
try:
    client.upsert(collection_name=collection_name, points=points)
    print("✅ Data loading complete.")
except UnexpectedResponse as e:
    print(f"❌ Error during upsert: {e}")
