#  URL Shortener Service

A lightweight, secure, and production-ready **URL shortening service** built with **Node.js**, **Express**, **TypeScript**, **PostgreSQL**, and **Redis**. The service allows users to shorten URLs, handle redirections, and includes essential security and monitoring features suitable for real-world deployment.

##  Tech Stack

- **Node.js** + **Express** – Core HTTP server
- **TypeScript** – Type safety and cleaner development
- **PostgreSQL** – Persistent storage for URLs
- **Redis** – Caching layer for fast URL lookups and rate limiting
- **Winston** – Structured logging with support for rotation and external platforms
- **Postman** – For testing endpoints during development

##  Features

-  **URL Shortening** – Create unique short codes mapped to original URLs
-  **URL Sanitization** – Prevent injection of malicious URLs
-  **Private IP Blocking** – Block URLs pointing to internal/private networks
-  **Rate Limiting** – Protect against abuse using Redis
-  **Request Logging** – Detailed access logs for observability
-  **Production-Ready Logging** – Supports log rotation or external platforms like Logtail, Papertrail, ELK, Loki
-  **Redirect Endpoint** – Fast URL lookup via Redis cache before falling back to PostgreSQL

##  Project Structure

```
.
├── src
│   ├── config/         # Redis, database, logger configurations
│   ├── middleware/     # Rate limiting, sanitization, IP blocking
│   ├── routes/         # API endpoints (shorten, redirect, etc.)
│   ├── utils/          # Helper functions
│   └── index.ts        # Main server entry point
├── package.json
├── tsconfig.json
└── README.md
```

##  Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/carlkiptoo/UrlShortner.git
cd url-shortener
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file:

```env
PORT=3000


PGHOST=localhost
PGUSER=***********
PGPASSWORD=**********
PGDATABASE=*********
PGPORT=5432

# Redis
REDIS_URL=redis://localhost:6379

```

### 4. Create the Database Table

Run this in your PostgreSQL instance:

```sql
CREATE TABLE IF NOT EXISTS urls (
  id SERIAL PRIMARY KEY,
  long_url TEXT NOT NULL,
  short_code TEXT UNIQUE NOT NULL
);
```

### 5. Start Redis

```bash
redis-server
```

### 6. Run the Server

```bash
npm run dev
```

##  API Endpoints

###  Shorten a URL

**POST** `/shorten`

**Request Body:**
```json
{
  "url": "https://example.com/some/long/path"
}
```

**Response:**
```json
{
  "shortCode": "abc123",
  "shortUrl": "http://localhost:3000/abc123"
}
```

###  Redirect

**GET** `/:shortCode`

Redirects to the original URL if it exists, otherwise returns a 404.

##  Logging & Monitoring

- All incoming requests and internal operations are logged using **Winston**.
- For production, configure logs to:
  - Write to rotating files, or
  - Send to external platforms (e.g., Logtail, Papertrail, ELK, Loki).

##  Deployment

You can deploy this service to any Node.js-compatible platform such as:

- **Render**
- **Railway**
- **Fly.io**
- **VPS / Docker containers**

> **Note:** If deploying to Render, HTTPS is automatically handled by the platform.

## License

Open Source

---
