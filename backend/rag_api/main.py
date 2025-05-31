from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient

# Initialize Qdrant and embedding model

client = QdrantClient(host="localhost", port=6999)

# collection = client.get_or_create_collection("manga")
model = SentenceTransformer("all-MiniLM-L6-v2")


# | Model                                     | Dimension | Why It’s Good for Manga                                                                                                                                 |
# | ----------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
# | `intfloat/e5-large`                       | 1024      | Trained on diverse web data with instructions; **excellent at matching titles with descriptions and thematic queries** (e.g., “overpowered MC, comedy”) |
# | `sentence-transformers/all-mpnet-base-v2` | 768       | One of the **most accurate** general-purpose models for English. Very strong at paraphrase and thematic similarity                                      |
# | `BAAI/bge-large-en`                       | 1024      | Tuned specifically for **dense retrieval**; excellent at short and long-form matching, ideal for search use cases                                       |
# | `mixedbread-ai/mxbai-embed-large-v1`      | 1024      | Strong open-domain retrieval model with emerging popularity in vector search                                                                            |
