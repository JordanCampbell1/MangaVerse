from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Dict, List, Optional
import httpx
import os

# Initialize the router
from app_state import get_async_client

from pyinstrument import Profiler

profiler = Profiler()

from database import get_db
from schemas import (
    MangaBase,
    MangaDetail,
    Chapter,
    MangaChapterView,
    ChapterImageResponse,
    MangaSearchResult,
    MangaBasicInfo,
)


router = APIRouter(prefix="/api/manga", tags=["mangas"])

BASE_URL = os.getenv("BASE_API_URL", "https://api.mangadex.org")
UPLOAD_BASE_URL = os.getenv("BASE_API_UPLOAD_URL", "https://uploads.mangadex.org")


@router.get("/", response_model=list[MangaBase])
async def fetch_manga(async_client: httpx.AsyncClient = Depends(get_async_client)):
    profiler.start()

    response = await async_client.get(
        f"{BASE_URL}/manga",
        params={
            "includes[]": "cover_art",
            "availableTranslatedLanguage[]": "en",
            "limit": 20,
        },
    )
    response.raise_for_status()
    manga_list = response.json()["data"]

    result = []
    for manga in manga_list:
        cover_rel = next(
            (rel for rel in manga["relationships"] if rel["type"] == "cover_art"), None
        )
        cover_url = (
            f"{UPLOAD_BASE_URL}/covers/{manga['id']}/{cover_rel['attributes']['fileName']}.256.jpg"
            if cover_rel
            else "https://via.placeholder.com/256x350?text=No+Image"
        )
        result.append(
            MangaBase(
                id=manga["id"],
                title=manga["attributes"]["title"].get("en", "Untitled"),
                imageURL=cover_url,
            )
        )

    profiler.stop()
    print(profiler.output_text(unicode=True, color=True))
    return result


@router.get("/tags", response_model=Dict[str, str])
async def fetch_tags(async_client: httpx.AsyncClient = Depends(get_async_client)):
    url = "https://api.mangadex.org/manga/tag"

    response = await async_client.get(url)
    response.raise_for_status()
    tag_data = response.json()["data"]

    tag_map = {
        tag["attributes"]["name"]["en"].lower(): tag["id"]
        for tag in tag_data
        if "en" in tag["attributes"]["name"]
    }
    return tag_map


# Simulated tag map (in reality, you'd cache this or load it from a DB/API)
tag_map = {
    "oneshot": "0234a31e-a729-4e28-9d6a-3f87c4966b9e",
    "thriller": "07251805-a27e-4d59-b488-f0bfbec15168",
    "award winning": "0a39b5a1-b235-4886-a747-1d05d216532d",
    "reincarnation": "0bc90acb-ccc1-44ca-a34a-b9f3a73259d0",
    "sci-fi": "256c8bd9-4904-4360-bf4f-508a76d67183",
    "time travel": "292e862b-2d17-4062-90a2-0356caa4ae27",
    "genderswap": "2bd2e8d0-f146-434a-9b51-fc9ff2c5fe6a",
    "loli": "2d1f5d56-a1e5-4d0d-a961-2193588b08ec",
    "traditional games": "31932a7e-5b8e-49a6-9f12-2afa39dc544c",
    "official colored": "320831a8-4026-470b-94f6-8353740e6f04",
    "historical": "33771934-028e-4cb3-8744-691e866a923e",
    "monsters": "36fd93ea-e8b8-445e-b836-358f02b3d33d",
    "action": "391b0423-d847-456f-aff0-8b0cfc03066b",
    "demons": "39730448-9a5f-48a2-85b0-a70db87b1233",
    "psychological": "3b60b75c-a2d7-4860-ab56-05f391bb889c",
    "ghosts": "3bb26d85-09d5-4d2e-880c-c34b974339e9",
    "animals": "3de8c75d-8ee3-48ff-98ee-e20a65c86451",
    "long strip": "3e2b8dae-350e-4ab8-a8ce-016e844b9f0d",
    "romance": "423e2eae-a7a2-4a8b-ac03-a8351462d71d",
    "ninja": "489dd859-9b61-4c37-af75-5b18e88daafc",
    "comedy": "4d32cc48-9f00-4cca-9b5a-a839f0764984",
    "mecha": "50880a9d-5440-4732-9afb-8f457127e836",
    "anthology": "51d83883-4103-437c-b4b1-731cb73d786c",
    "boys' love": "5920b825-4181-4a17-beeb-9918b0ff7a30",
    "incest": "5bd0e105-4481-44ca-b6e7-7544da56b1a3",
    "crime": "5ca48985-9a9d-4bd8-be29-80dc0303db72",
    "survival": "5fff9cde-849c-4d78-aab0-0d52b2ee1d25",
    "zombies": "631ef465-9aba-4afb-b0fc-ea10efe274a8",
    "reverse harem": "65761a2a-415e-47f3-bef2-a9dababba7a6",
    "sports": "69964a64-2f90-4d33-beeb-f3ed2875eb4c",
    "superhero": "7064a261-a137-4d3a-8848-2d385de3a99c",
    "martial arts": "799c202e-7daa-44eb-9cf7-8a3c0441531e",
    "fan colored": "7b2ce280-79ef-4c09-9b58-12b7c23a9b78",
    "samurai": "81183756-1453-4c81-aa9e-f6e1b63be016",
    "magical girls": "81c836c9-914a-4eca-981a-560dad663e73",
    "mafia": "85daba54-a71c-4554-8a28-9901a8b0afad",
    "adventure": "87cc87cd-a395-47af-b27a-93258283bbc6",
    "self-published": "891cf039-b895-47f0-9229-bef4c96eccd4",
    "virtual reality": "8c86611e-fab7-4986-9dec-d1a2f44acdd5",
    "office workers": "92d6d951-ca5e-429c-ac78-451071cbf064",
    "video games": "9438db5a-7e2a-4ac0-b39e-e0d95a34b8a8",
    "post-apocalyptic": "9467335a-1b83-4497-9231-765337a00b96",
    "sexual violence": "97893a4c-12af-4dac-b6be-0dffb353568e",
    "crossdressing": "9ab53f92-3eed-4e9b-903a-917c86035ee3",
    "magic": "a1f53773-c69a-4ce5-8cab-fffcd90b1565",
    "girls' love": "a3c67850-4684-404e-9b7f-c69850ee5da6",
    "harem": "aafb99c1-7f60-43fa-b75f-fc9502ce29c7",
    "military": "ac72833b-c4e9-4878-b9db-6c8a4a99444a",
    "wuxia": "acc803a4-c95a-4c22-86fc-eb6b582d82a2",
    "isekai": "ace04997-f6bd-436e-b261-779182193d3d",
    "4-koma": "b11fda93-8f1d-4bef-b2ed-8803d3733170",
    "doujinshi": "b13b2a48-c720-44a9-9c77-39c9979373fb",
    "philosophical": "b1e97889-25b4-4258-b28b-cd7f4d28ea9b",
    "gore": "b29d6a3d-1569-4e7a-8caf-7557bc92cd5d",
    "drama": "b9af3a63-f058-46de-a9a0-e0c13906197a",
    "medical": "c8cbe35b-1b2b-4a3f-9c37-db84c4514856",
    "school life": "caaa44eb-cd40-4177-b930-79d3ef2afe87",
    "horror": "cdad7e68-1419-41dd-bdce-27753074a640",
    "fantasy": "cdc58593-87dd-415e-bbc0-2ec27bf404cc",
    "villainess": "d14322ac-4d6f-4e9b-afd9-629d5f4d8a41",
    "vampires": "d7d1730f-6eb0-4ba6-9437-602cac38664c",
    "delinquents": "da2d50ca-3018-4cc0-ac7a-6b7d472a29ea",
    "monster girls": "dd1f77c5-dea9-4e2b-97ae-224af09caf99",
    "shota": "ddefd648-5140-4e5f-ba18-4eca4071d19b",
    "police": "df33b754-73a3-4c54-80e6-1a74a8058539",
    "web comic": "e197df38-d0e7-43b5-9b09-2842d0c326dd",
    "slice of life": "e5301a23-ebd9-49dd-a0cb-2add944c7fe9",
    "aliens": "e64f6742-c834-471d-8d72-dd51fc02b835",
    "cooking": "ea2bc92d-1c26-4930-9b7c-d5c0dc1b6869",
    "supernatural": "eabc5b4c-6aff-42f3-b657-3e90cbd00b75",
    "mystery": "ee968100-4191-4968-93d3-f82d72be7e46",
    "adaptation": "f4122d1c-3b44-44d0-9936-ff7502c39ad3",
    "music": "f42fbf9e-188a-447b-9fdc-f19dc1e4d685",
    "full color": "f5ba408b-0e7a-484d-8d49-4e9125ac96de",
    "tragedy": "f8f62932-27da-4fe4-8ee1-6779a8c5edba",
    "gyaru": "fad12b5e-68ba-460e-b933-9ae8318f5b65",
}


@router.get("/filter", response_model=List[MangaBase])
async def fetch_filtered_manga(
    categories: List[str] = Query(...),
    async_client: httpx.AsyncClient = Depends(get_async_client),
):
    tag_ids = [
        tag_map.get(category.lower())
        for category in categories
        if tag_map.get(category.lower())
    ]

    if not tag_ids:
        return []

    url = "https://api.mangadex.org/manga"
    params = {
        "includedTags[]": tag_ids,
        "limit": 12,
        "includes[]": "cover_art",
    }

    response = await async_client.get(url, params=params)
    response.raise_for_status()
    manga_data = response.json()["data"]

    result = []
    for manga in manga_data:
        title = manga["attributes"]["title"].get("en", "Untitled")
        cover_rel = next(
            (rel for rel in manga["relationships"] if rel["type"] == "cover_art"), None
        )
        cover_url = (
            f"{UPLOAD_BASE_URL}/covers/{manga['id']}/{cover_rel['attributes']['fileName']}.256.jpg"
            if cover_rel
            else "https://via.placeholder.com/256x350?text=No+Image"
        )

        result.append(MangaBase(id=manga["id"], title=title, imageURL=cover_url))

    return result


@router.get("/detail", response_model=MangaDetail)
async def fetch_manga_detail(
    id: str = Query(..., description="MangaDex manga ID"),
    async_client: httpx.AsyncClient = Depends(get_async_client),
):

    try:
        # Fetch manga details
        manga_resp = await async_client.get(
            f"{BASE_URL}/manga/{id}",
            params={
                "includes[]": "cover_art",
                "availableTranslatedLanguage[]": "en",
            },
        )
        manga_resp.raise_for_status()
        manga = manga_resp.json()["data"]

        # print(manga)  # Debugging line to check the manga data structure

        # Parse title and description
        title = manga["attributes"]["title"].get("en", "Untitled")
        description = manga["attributes"].get("description", {}).get("en")

        # Extract year and genres
        year = manga["attributes"].get("year")
        genres = [
            tag["attributes"]["name"].get("en")
            for tag in manga["attributes"].get("tags", [])
            if tag["attributes"].get("group") == "genre"
        ]

        # print(f"Manga: {title}")
        # print(f"Description: {description}")

        # Find cover image
        cover_rel = next(
            (rel for rel in manga["relationships"] if rel["type"] == "cover_art"),
            None,
        )

        # print(
        #     f"Cover relationship: {cover_rel}"
        # )  # Debugging line to check cover relationship

        # print(
        #     f"Cover file name: {cover_rel['attributes']['fileName'] if cover_rel else 'None'}"
        # )

        cover_url = (
            f"{UPLOAD_BASE_URL}/covers/{id}/{cover_rel['attributes']['fileName']}.256.jpg"
            if cover_rel
            else "https://via.placeholder.com/256x350?text=No+Image"
        )

        # print(f"Cover URL: {cover_url}")  # Debugging line to check the cover URL

        # Fetch chapters
        chapters_resp = await async_client.get(
            f"{BASE_URL}/manga/{id}/feed",
            params={"translatedLanguage[]": "en", "order[chapter]": "asc"},
        )
        chapters_resp.raise_for_status()
        chapter_data = chapters_resp.json()["data"]

        # print(chapter_data)  # Debugging line to check the chapter data structure

        # Sort and format chapters
        formatted_chapters = []
        for chapter in chapter_data:
            attrs = chapter["attributes"]
            formatted_chapters.append(
                Chapter(
                    id=chapter["id"],
                    chapter=attrs.get("chapter"),
                    title=attrs.get("title"),
                )
            )

        # # Sort manually if needed (though API returns sorted by default)
        # formatted_chapters.sort(
        #     key=lambda c: (
        #         float(c.chapter)
        #         if c.chapter and c.chapter.replace(".", "", 1).isdigit()
        #         else float("inf")
        #     )
        # )

        return MangaDetail(
            id=id,
            title=title,
            description=description,
            imageURL=cover_url,
            chapters=formatted_chapters,
            year=year,
            genres=genres,
        )

    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail="Failed to fetch manga or chapters",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/read", response_model=MangaChapterView)
async def read_manga_chapter(
    mangaID: str = Query(..., description="MangaDex manga ID"),
    chapter_index: int = Query(0, description="Index of the chapter to view"),
    async_client: httpx.AsyncClient = Depends(get_async_client),
):

    try:
        # Get manga details
        manga_resp = await async_client.get(
            f"{BASE_URL}/manga/{mangaID}",
            params={
                "includes[]": "cover_art",
            },
        )
        manga_resp.raise_for_status()
        manga_data = manga_resp.json()["data"]
        manga_title = manga_data["attributes"]["title"].get("en", "Untitled")

        # Get cover image
        cover_rel = next(
            (rel for rel in manga_data["relationships"] if rel["type"] == "cover_art"),
            None,
        )
        cover_image = (
            f"{UPLOAD_BASE_URL}/covers/{mangaID}/{cover_rel['attributes']['fileName']}.256.jpg"
            if cover_rel
            else "https://via.placeholder.com/256x350?text=No+Image"
        )

        # Get chapters
        chapters_resp = await async_client.get(
            f"{BASE_URL}/manga/{mangaID}/feed",
            params={"translatedLanguage[]": "en"},
        )
        chapters = chapters_resp.json()["data"]

        # Filter and sort chapters
        valid_chapters = [
            ch
            for ch in chapters
            if ch["attributes"].get("chapter")
            and not is_nan(ch["attributes"]["chapter"])
        ]
        valid_chapters.sort(key=lambda ch: float(ch["attributes"]["chapter"]))

        if not valid_chapters:
            raise HTTPException(status_code=404, detail="No valid chapters found.")

        if chapter_index >= len(valid_chapters):
            raise HTTPException(status_code=400, detail="Chapter index out of range.")

        selected_chapter = valid_chapters[chapter_index]
        chapter_id = selected_chapter["id"]
        chapter_number = selected_chapter["attributes"]["chapter"]

        title_data = selected_chapter["attributes"].get("title")
        chapter_title = (
            title_data.get("en")
            if isinstance(title_data, dict) and "en" in title_data
            else "No Title"
        )

        # Get image filenames
        at_home_resp = await async_client.get(f"{BASE_URL}/at-home/server/{chapter_id}")
        chapter_info = at_home_resp.json()["chapter"]
        hash_val = chapter_info["hash"]
        image_filenames = chapter_info["data"]

        image_urls = [
            f"{UPLOAD_BASE_URL}/data/{hash_val}/{filename}"
            for filename in image_filenames
        ]

        return MangaChapterView(
            mangaID=mangaID,
            mangaTitle=manga_title,
            coverImage=cover_image,
            selectedChapter=ChapterImageResponse(
                id=chapter_id,
                title=chapter_title,
                chapterNumber=chapter_number,
                imageURLs=image_urls,
            ),
        )

    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail="Manga or chapter fetch failed",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def is_nan(value: str) -> bool:
    try:
        float(value)
        return False
    except (TypeError, ValueError):
        return True


@router.get("/search", response_model=List[MangaSearchResult])
async def search_manga(
    title: str = Query(..., min_length=3),
    async_client: httpx.AsyncClient = Depends(get_async_client),
):
    try:
        response = await async_client.get(
            f"{BASE_URL}/manga",
            params={
                "title": title,
                "includes[]": "cover_art",
                "availableTranslatedLanguage[]": "en",
            },
        )
        response.raise_for_status()
        manga_list = response.json()["data"]

        results = []
        for manga in manga_list:
            # Extract cover image
            cover = next(
                (r for r in manga["relationships"] if r["type"] == "cover_art"),
                None,
            )
            file_name = cover["attributes"]["fileName"] if cover else None

            # Safely extract title and description
            title_data = manga["attributes"].get("title", {})
            description_data = manga["attributes"].get("description", {})

            manga_title = title_data.get("en", "Untitled")
            manga_description = description_data.get("en", "")

            image_url = (
                f"{UPLOAD_BASE_URL}/covers/{manga['id']}/{file_name}.256.jpg"
                if file_name
                else "https://via.placeholder.com/256x350?text=No+Image"
            )

            results.append(
                MangaSearchResult(
                    id=manga["id"],
                    title=manga_title,
                    description=manga_description,
                    image=image_url,
                )
            )

        return results

    except httpx.HTTPError:
        raise HTTPException(
            status_code=502, detail="Failed to fetch manga data from MangaDex."
        )


@router.get("/search", response_model=List[MangaSearchResult])
async def search_manga(
    title: str = Query(..., min_length=3),
    async_client: httpx.AsyncClient = Depends(get_async_client),
):
    try:
        response = await async_client.get(
            f"{BASE_URL}/manga",
            params={
                "title": title,
                "includes[]": "cover_art",
                "availableTranslatedLanguage[]": "en",
            },
        )
        response.raise_for_status()
        manga_list = response.json()["data"]

        results = []
        for manga in manga_list:
            # Extract cover image
            cover = next(
                (r for r in manga["relationships"] if r["type"] == "cover_art"),
                None,
            )
            file_name = cover["attributes"]["fileName"] if cover else None

            # Safely extract title and description
            title_data = manga["attributes"].get("title", {})
            description_data = manga["attributes"].get("description", {})

            manga_title = title_data.get("en", "Untitled")
            manga_description = description_data.get("en", "")

            image_url = (
                f"{UPLOAD_BASE_URL}/covers/{manga['id']}/{file_name}.256.jpg"
                if file_name
                else "https://via.placeholder.com/256x350?text=No+Image"
            )

            results.append(
                MangaSearchResult(
                    id=manga["id"],
                    title=manga_title,
                    description=manga_description,
                    image=image_url,
                )
            )

        return results

    except httpx.HTTPError:
        raise HTTPException(
            status_code=502, detail="Failed to fetch manga data from MangaDex."
        )


@router.get("/latest", response_model=List[MangaBasicInfo])
async def get_latest_updated_manga(
    async_client: httpx.AsyncClient = Depends(get_async_client),
):
    try:
        response = await async_client.get(
            f"{BASE_URL}/manga",
            params={
                "limit": 20,
                "order[updatedAt]": "desc",
                "availableTranslatedLanguage[]": "en",
                "includes[]": "cover_art",
            },
        )
        response.raise_for_status()

        manga_list = response.json()["data"]
        result = []

        for manga in manga_list:
            title = manga["attributes"]["title"].get("en", "No Title")

            # Find cover_art relationship
            cover = next(
                (rel for rel in manga["relationships"] if rel["type"] == "cover_art"),
                None,
            )
            file_name = cover["attributes"]["fileName"] if cover else None

            image_url = (
                f"{UPLOAD_BASE_URL}/covers/{manga['id']}/{file_name}.256.jpg"
                if file_name
                else None
            )

            result.append(
                MangaBasicInfo(id=manga["id"], title=title, imageUrl=image_url)
            )

        return result

    except httpx.HTTPError:
        raise HTTPException(
            status_code=502,
            detail="Failed to fetch latest manga data from MangaDex.",
        )
