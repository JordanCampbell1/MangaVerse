from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient

# Initialize Qdrant and embedding model

client = QdrantClient(host="localhost", port=6999)

# collection = client.get_or_create_collection("manga")
model = SentenceTransformer("all-MiniLM-L6-v2")
