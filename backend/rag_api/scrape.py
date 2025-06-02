import asyncio  # Allows running code concurrently using coroutines
import aiohttp  # Async HTTP client to make web requests
import random  # Used to add small, random delays between requests
import json  # For saving the final data as a .json file

# 📌 API endpoint and configuration
API_URL = "https://api.mangadex.org/manga"
TOTAL = 51737  # Total number of manga (you got this from the API)
LIMIT = 100  # Max number of manga the API returns per request
CONCURRENT_REQUESTS = (
    10  # Number of requests to make at the same time (avoid overloading the server)
)


# 🧱 Fetches one page (100 manga) at a time using aiohttp
async def fetch_page(session, offset):
    # offset = where in the list to start (e.g. 0, 100, 200, etc.)
    params = {"availableTranslatedLanguage[]": "en", "limit": LIMIT, "offset": offset}

    # 🤖 Wait a short time before sending the request to look more "human"
    await asyncio.sleep(random.uniform(0.5, 1.5))

    async with session.get(API_URL, params=params) as response:
        if response.status == 200:
            # Parse JSON, and return only the "data" field (which is a list of manga)
            json_data = await response.json()
            return json_data.get("data", [])
        else:
            print(f"❌ Failed at offset {offset}, status code: {response.status}")
            return []


# 📦 This function coordinates the full scraping process
async def scrape_all_manga_async(output_file="mangadex_manga_list.json"):
    offsets = list(range(0, TOTAL, LIMIT))  # [0, 100, 200, ..., 51700]
    all_manga = []  # Where we store the manga results

    async with aiohttp.ClientSession() as session:
        semaphore = asyncio.Semaphore(CONCURRENT_REQUESTS)  # Limit concurrent requests

        # Helper function that respects the semaphore
        async def sem_fetch(offset):
            async with semaphore:
                return await fetch_page(session, offset)

        # 🔁 Build a list of all the tasks (one per offset)
        tasks = [sem_fetch(offset) for offset in offsets]

        # 📦 Run the tasks as they complete (not necessarily in order)
        for future in asyncio.as_completed(tasks):
            result = await future
            all_manga.extend(result)
            print(f"✅ Fetched batch — Total manga collected: {len(all_manga)}")

    # 💾 Save the collected manga to a JSON file
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(all_manga, f, ensure_ascii=False, indent=2)

    print(f"\n🎉 Done! Total manga scraped: {len(all_manga)}. Saved to: {output_file}")


# 🚀 Start the script
if __name__ == "__main__":
    asyncio.run(scrape_all_manga_async())
