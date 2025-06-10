from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import logging
import uvicorn
from routers.manga import router as mangaRouter
from rag_api.routers import router as AIRouter
from database import engine
from sqlalchemy import text
from contextlib import asynccontextmanager

import os

# Configure logging centrally
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] [%(name)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup code here

    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        print("✅ Database connection successful!")
    except Exception as e:
        print(f"❌ Database connection failed: {e}")

    yield  # control returns here after startup, before shutdown

    # Shutdown code here (optional)
    # e.g., close connections, cleanup
    logger.info("Shutting down Mangaverse FastAPI REST API Server...")


app = FastAPI(lifespan=lifespan)

# Allow requests from your frontend
origins = [
    "http://localhost:5173",  # Vite
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # or ["*"] for all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(mangaRouter)
app.include_router(AIRouter)


@app.get("/")
async def root():
    return {"message": "Hello World"}


# --- Run server ---
if __name__ == "__main__":
    logger.info("Starting Uvicorn server...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
