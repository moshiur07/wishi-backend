# Wishi Backend 🎁

Wishi is a modern social wishlist platform that simplifies gift-giving through curated wishlists, occasion tracking, and a social "honor system" for contributions.

## 🚀 Features

- **Modular Architecture**: Scalable folder structure (Controller-Service-Route pattern).
- **Advanced Wishlist Management**: 
  - CRUD operations with WAN/NEED categorization.
  - Linked to specific user Occasions (Birthdays, Weddings, etc.).
  - Pinned items for profile highlights.
- **Honor System Contributions**:
  - Log gifts given to friends (manual tracking MVP).
  - Funding progress bars and analytics for each item.
- **Robust Authentication**: Powered by `Better Auth` with support for social providers (Google, Facebook).
- **Profile Management**: Customizable public profiles with unique usernames and social links.
- **AI Integration**: Claude-powered gift suggestion engine (MVP).
- **Enterprise-ready Error Handling**: Custom AppError class and specialized Prisma error interceptor.
- **Production Ready**: Security headers via `Helmet`, `CORS` configuration, and request validation using `Zod`.

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (Prisma ORM)
- **Auth**: Better Auth
- **Validation**: Zod
- **Utilities**: Bcrypt, Cookie-parser, Helmet, CORS

## 🏃 Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm (recommended)
- PostgreSQL database

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/wishi-backend.git
   cd wishi-backend
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Set up environment variables**:
   Copy `.env.example` to `.env` and fill in your credentials.
   ```bash
   cp .env.example .env
   ```

4. **Run Database Migrations**:
   ```bash
   pnpm prisma migrate dev
   ```

5. **Seed Admin User**:
   ```bash
   npx tsx src/app/DB/seedAdmin.ts
   ```

### Running the App

- **Development Mode**:
  ```bash
  pnpm dev
  ```
- **Build**:
  ```bash
  pnpm build
  ```
- **Production Start**:
  ```bash
  pnpm start
  ```

## 📡 API Endpoints

| Module | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | ANY | `/api/auth/*` | Better Auth handlers |
| **User** | GET | `/api/user/me` | Get own profile |
| **User** | PATCH | `/api/user/me` | Update profile |
| **User** | GET | `/api/user/dashboard-stats` | Get dashboard summary |
| **Wishlist** | GET | `/api/wishlist` | Get my wish items (Paginated) |
| **Wishlist** | POST | `/api/wishlist` | Create wish item |
| **Wishlist** | GET | `/api/wishlist/public/:username` | Public view (Paginated) |
| **Occasion** | GET | `/api/occasions` | List my occasions |
| **Contribution**| POST | `/api/contributions` | Record a contribution |
| **AI** | POST | `/api/ai/suggestions` | Get AI gift suggestions |

## 📁 Project Structure

```text
src/
├── app/
│   ├── modules/          # Feature-based modules
│   │   ├── wishlist/
│   │   ├── user/
│   │   ├── occasion/
│   │   └── contribution/
│   ├── middleware/       # Global middlewares
│   ├── utils/            # Reusable utilities
│   └── lib/              # Library instances (Prisma, Auth)
├── config/               # Environment & Global config
├── server.ts             # Entry point
└── app.ts                # App configuration
```

## 🛡 Security

- **Helmet**: Secures the app by setting various HTTP headers.
- **CORS**: Configurable origin for frontend communication.
- **Zod**: Runtime schema validation for all incoming requests.
- **Global Error Handler**: Standardized error responses without leaking internal stack traces in production.

## 📄 License

This project is licensed under the ISC License.
