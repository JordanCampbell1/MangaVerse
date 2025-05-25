from pydantic import BaseModel


class MangaBase(BaseModel):
    title: str
    author: str


class MangaCreate(MangaBase):
    pass


class MangaRead(MangaBase):
    id: int

    class Config:
        orm_mode = True
