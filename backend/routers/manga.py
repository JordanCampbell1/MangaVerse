from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from database import get_db
from models import Manga
from schemas import MangaCreate, MangaRead

router = APIRouter(prefix="/api/manga", tags=["mangas"])


@router.get(
    "/",
)
async def read_mangas(db: AsyncSession = Depends(get_db)):
    pass
