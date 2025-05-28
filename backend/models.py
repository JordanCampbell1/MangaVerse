from sqlalchemy import Column, Integer, String
from database import Base


class Manga(Base):
    __tablename__ = "mangas"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    imageURL = Column(String, index=True)
    # add your other columns here
