# Bible API Endpoints

## Translations
- `GET /` - List all available translations

## Books
- `GET /:translationCode` - List all books in a specific translation

## Chapters
- `GET /:translationCode/:bookID` - List all chapters in a specific book

## Verses
- `GET /:translationCode/:bookID/:chapterNumber` - Get all verses from a specific chapter
- `GET /:translationCode/:bookID/:chapterNumber/:verseNumber` - Get a specific verse
- `GET /:translationCode/randomverse` - Get a random verse from the entire Bible
  - Optional query parameters:
    - `testament` - Filter by testament (new/old)
    - `bookID` - Filter by specific book

## Search
- `GET /search` - Search verses in the Bible
  - Required query parameters:
    - `q` - Search term
  - Optional query parameters:
    - `translation` - Filter by translation code
    - `exact` - Enable exact match (true/false)
    - `operator` - Logical operator for multiple terms (and/or)
    - `limit` - Maximum number of results (default: 50)
