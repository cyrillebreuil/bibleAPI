# Bible API

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-blue)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📖 Overview

Bible API is a robust, RESTful service that provides programmatic access to the Holy Bible in multiple translations and languages. Built with Node.js and Express, this API delivers scripture verses, chapters, and books in JSON format, with features for searching, random verse generation, and comprehensive Bible navigation.

![Bible API Screenshot](https://via.placeholder.com/800x400?text=Bible+API+Visualization)

## ✨ Features

- **Multiple Translations**: Access the Bible in various languages and translations
- **Complete Bible Structure**: Navigate through all books, chapters, and verses
- **Search Functionality**: Find verses based on keywords with advanced filtering options
- **Random Verse Generator**: Retrieve random verses with optional filtering by testament or book
- **Performance Optimized**: Utilizing efficient database queries and caching strategies
- **Developer-Friendly**: Well-structured JSON responses with comprehensive documentation

## 🚀 API Endpoints

### Translations
- `GET /` - List all available translations with comprehensive statistics

### Books
- `GET /:translationCode` - Get all books in a specific translation with testament categorization

### Chapters
- `GET /:translationCode/:bookID` - List all chapters available in a specific book

### Verses
- `GET /:translationCode/:bookID/:chapterNumber` - Get all verses from a specific chapter
- `GET /:translationCode/:bookID/:chapterNumber/:verseNumber` - Get a specific verse
- `GET /:translationCode/randomverse` - Get a random verse with optional filtering by testament or book

### Search
- `GET /search` - Search verses throughout the Bible with multiple parameters:
  - `q` (required): Search term
  - `translation`: Filter by translation code
  - `exact`: Boolean for exact matching (default: false)
  - `operator`: Logical operator for multiple terms (and/or)
  - `limit`: Maximum number of results (default: 50)

## 🛠️ Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Testing**: Jest with SuperTest
- **Documentation**: Swagger/OpenAPI
- **Deployment**: Docker containerization

## 🏗️ Architecture

The API follows a clean architecture pattern with:

- **Models**: Sequelize models for Bible entities (Book, Chapter, Verse, Translation)
- **Controllers**: Logic for handling requests and responses
- **Middleware**: Error handling, rate limiting, and request validation
- **Routers**: Route definitions for all endpoints
- **Database**: Optimized schema design with appropriate indexes for fast querying

```
bibleAPI/
│
├── src/
│   ├── controllers/       # Request handlers organized by entity
│   ├── models/            # Database models and associations
│   ├── middleware/        # Express middleware (error handling, rate limiting)
│   ├── routers/           # API route definitions
│   ├── database/          # Database connection and configuration
│   └── tests/             # Test suite
│
├── docs/                  # API documentation
└── scripts/               # Utility scripts for database seeding, etc.
```

## 📊 Database Schema

The database is structured to efficiently store Bible translations with the following main entities:

- **Translations**: Different Bible versions and languages
- **Books**: All books of the Bible (Genesis, Exodus, etc.)
- **BookTranslations**: Book names in different translations
- **TestamentTranslations**: Testament names in different translations
- **Chapters**: All chapters across all books
- **Verses**: The actual scripture text linked to chapters and translations

## 🔧 Getting Started

### Prerequisites
- Node.js (v14+)
- PostgreSQL database

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/bibleAPI.git
cd bibleAPI
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your database credentials and other settings
```

4. Start the development server
```bash
npm run dev
```

### Database Setup

1. Create a PostgreSQL database
```bash
createdb bibleapi
```

2. Run migrations and seed data
```bash
npm run db:migrate
npm run db:seed
```

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run specific tests:
```bash
npm test -- src/tests/api.test.js
```

## 🚢 Deployment

### Using Docker

1. Build the Docker image
```bash
docker build -t bibleapi .
```

2. Run the container
```bash
docker run -p 3000:3000 -e PG_URL=your_connection_string bibleapi
```

### Traditional Deployment

1. Build for production
```bash
npm run build
```

2. Start the server
```bash
npm start
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgements

- Bible text data sources
- Open source libraries used in this project
- Contributors and maintainers

## ✅ Roadmap

- [ ] Add more translations
- [ ] Implement caching layer
- [ ] Create official client libraries
- [ ] Add authentication for premium features
- [ ] Develop contribution guidelines for community involvement

---

Created with ❤️ for developers and Bible enthusiasts alike.
