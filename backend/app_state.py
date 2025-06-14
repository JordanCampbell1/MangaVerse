from fastapi import Request
import httpx


def get_async_client(request: Request) -> httpx.AsyncClient:
    return request.app.state.async_client
