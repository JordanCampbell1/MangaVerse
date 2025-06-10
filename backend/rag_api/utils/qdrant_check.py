from qdrant_client import QdrantClient
import os


def get_qdrant_client(url, api_key, host="localhost", port=6999):
    """Initialize a Qdrant client with fallback to local instance.
    Args:
        host (str): Hostname for local Qdrant instance.
        port (int): Port for local Qdrant instance.
        url (str): URL for Qdrant Cloud instance.
        api_key (str): API key for Qdrant Cloud.
    Returns:
        QdrantClient: Configured Qdrant client instance.
    """
    try:
        # Attempt cloud connection
        cloud_url = url
        cloud_key = api_key

        if cloud_url and cloud_key:
            client = QdrantClient(url=cloud_url, api_key=cloud_key)
            # Optionally, ping the server to verify the connection
            client.get_collections()
            print("[INFO] Connected to Qdrant Cloud")
            return client
        else:
            raise ValueError("[ERROR] Missing cloud credentials")

    except Exception as e:
        print(f"[ERROR] Falling back to localhost due to error: {e}")
        # Fallback to local instance (default port is 6333)
        return QdrantClient(host=host, port=port)
