from pydantic import BaseModel, HttpUrl
from typing import List, Optional


class MangaBase(BaseModel):
    id: str
    title: str
    imageURL: HttpUrl


class Chapter(BaseModel):
    id: str
    chapter: Optional[str]
    title: Optional[str]


class MangaDetail(BaseModel):
    id: str
    title: str
    description: Optional[str]
    imageURL: str
    chapters: List[Chapter]
    year: Optional[int] = None
    genres: List[str] = []


class ChapterImageResponse(BaseModel):
    id: str
    title: str
    imageURLs: List[str]
    chapterNumber: Optional[str]


class MangaChapterView(BaseModel):
    mangaID: str
    mangaTitle: str
    coverImage: str
    selectedChapter: ChapterImageResponse


class MangaSearchResult(BaseModel):
    id: str
    title: str
    description: str
    image: str


class MangaBasicInfo(BaseModel):
    id: str
    title: str
    imageUrl: Optional[str]
