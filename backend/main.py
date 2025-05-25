from fastapi import FastAPI
import logging
import uvicorn
from routers.manga import router as mangaRouter
from database import engine
from sqlalchemy import text
from contextlib import asynccontextmanager

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

app.include_router(mangaRouter)


@app.get("/")
async def root():
    return {"message": "Hello World"}


# --- Run server ---
if __name__ == "__main__":
    logger.info("Starting Uvicorn server...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
