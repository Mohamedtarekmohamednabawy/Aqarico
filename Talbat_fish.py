"""
Talabat Egypt - All Restaurants scraper
----------------------------------------
Scrapes the "All Restaurants" listing pages on talabat.com/egypt/restaurants
and saves restaurant name, cuisine/category tags, and profile URL to an Excel file.

Install dependencies first:
    pip install requests beautifulsoup4 pandas openpyxl

Usage:
    python talabat_scraper.py
"""

import time
import re
import requests
from bs4 import BeautifulSoup
import pandas as pd

BASE_URL = "https://www.talabat.com/egypt/restaurants"
START_PAGE = 1
END_PAGE = 709         
OUTPUT_FILE = "talabat_egypt_restaurants_Marketopia.xlsx"
REQUEST_DELAY = 1.5    

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}
EXCLUDE_PATTERNS = [
    "/egypt/restaurants",
    "/egypt/cuisine",
    "/egypt/cuisines",
    "/egypt/city",
    "/egypt/all-areas",
    "/egypt/terms",
    "/egypt/faq",
    "/egypt/privacy",
    "/egypt/contact-us",
    "/egypt/sitemap",
    "/ar/egypt",
]


def is_restaurant_link(href: str) -> bool:
    if not href or "talabat.com/egypt/" not in href:
        return False
    if any(p in href for p in EXCLUDE_PATTERNS):
        return False
    # restaurant slugs look like /egypt/<slug> (single path segment after /egypt/)
    path = href.split("talabat.com")[-1]
    parts = [p for p in path.strip("/").split("/") if p]
    return len(parts) == 2 and parts[0] == "egypt"


def parse_page(html: str):
    soup = BeautifulSoup(html, "html.parser")
    results = []
    seen_urls = set()

    for a in soup.find_all("a", href=True):
        href = a["href"]
        if not href.startswith("http"):
            href = "https://www.talabat.com" + href

        if not is_restaurant_link(href):
            continue
        if href in seen_urls:
            continue

        text = a.get_text(separator="|", strip=True)
        if not text:
            continue

        # The visible text usually looks like "Restaurant NameCuisine1,Cuisine2"
        # Try to split name from cuisine list using capital-letter-run heuristics,
        # falling back to storing the whole string as name if it fails.
        name = text
        cuisine = ""
        match = re.match(r"^(.*?)((?:[A-Z][a-zA-Z& ']*,)+[A-Z][a-zA-Z& ']*)$", text)
        if match:
            name = match.group(1).strip()
            cuisine = match.group(2).strip()

        seen_urls.add(href)
        results.append({"Name": name, "Cuisine": cuisine, "URL": href})

    return results


def scrape():
    all_restaurants = []
    session = requests.Session()
    session.headers.update(HEADERS)

    for page in range(START_PAGE, END_PAGE + 1):
        url = f"{BASE_URL}?page={page}"
        print(f"Fetching page {page}: {url}")
        try:
            resp = session.get(url, timeout=20)
            resp.raise_for_status()
        except requests.RequestException as e:
            print(f"  Failed to fetch page {page}: {e}")
            continue

        page_results = parse_page(resp.text)
        print(f"  Found {len(page_results)} restaurants")

        if not page_results:
            print("  No restaurants found - stopping early (may be last page or blocked).")
            break

        all_restaurants.extend(page_results)
        time.sleep(REQUEST_DELAY)

    # Deduplicate by URL
    df = pd.DataFrame(all_restaurants).drop_duplicates(subset="URL").reset_index(drop=True)
    df.index += 1
    df.index.name = "No."

    df.to_excel(OUTPUT_FILE, sheet_name="Restaurants")
    print(f"\nSaved {len(df)} unique restaurants to {OUTPUT_FILE}")


if __name__ == "__main__":
    scrape()