from rag_api.utils.qdrant_check import get_qdrant_client
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
import torch
import os

# Initialize Qdrant and embedding model

QDRANT_HOST_URL = os.getenv("QDRANT_HOST_URL", "localhost")
QDRANT_PORT = os.getenv("QDRANT_PORT", 6999)
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY", None)

client = get_qdrant_client(
    QDRANT_HOST_URL, QDRANT_API_KEY
)  # This function should be defined in utils/qdrant_check.py

# collection = client.get_or_create_collection("manga")

# Enable GPU support if available
device = "cuda" if torch.cuda.is_available() else "cpu"

print(f"\n[INFO] CUDA Available: {torch.cuda.is_available()}")
if device == "cuda":
    print(
        f"[INFO] Using GPU: {torch.cuda.get_device_name(torch.cuda.current_device())}"
    )
else:
    print("[INFO] Using CPU")

model = SentenceTransformer(
    "all-MiniLM-L6-v2", device=device
)  # This is a lightweight model suitable for many tasks => all-MiniLM-L6-v2

# Print layer devices (for debugging)
for name, param in model.named_parameters():
    print(f"[DEBUG] Layer: {name} | Device: {param.device}")
    break  # Remove break if you want all layers


# | Model                                     | Dimension | Why It’s Good for Manga                                                                                                                                 |
# | ----------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
# | `intfloat/e5-large`                       | 1024      | Trained on diverse web data with instructions; **excellent at matching titles with descriptions and thematic queries** (e.g., “overpowered MC, comedy”) |
# | `sentence-transformers/all-mpnet-base-v2` | 768       | One of the **most accurate** general-purpose models for English. Very strong at paraphrase and thematic similarity                                      |
# | `BAAI/bge-large-en`                       | 1024      | Tuned specifically for **dense retrieval**; excellent at short and long-form matching, ideal for search use cases                                       |
# | `mixedbread-ai/mxbai-embed-large-v1`      | 1024      | Strong open-domain retrieval model with emerging popularity in vector search                                                                            |
