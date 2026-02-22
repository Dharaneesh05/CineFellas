# Movie Recommendation System

A full-stack movie recommendation system with user authentication, wishlist management, and personalized recommendations.

## Project Structure

This project is organized into two main directories:

```
.
├── frontend/          # Next.js frontend application
├── backend/           # Express.js backend API
└── README.md          # This file
```

## Quick Start

### Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with required environment variables (see backend/README.md)

4. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:3000` (or your configured port).

### Frontend

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`.

## Tech Stack

### Frontend
- Next.js 15
- React 19
- Tailwind CSS
- shadcn/ui components

### Backend
- Express.js
- MongoDB
- JWT Authentication
- Nodemailer

## Features

- User authentication (register, login, password reset)
- Movie browsing and search
- Personalized movie recommendations
- Wishlist management
- User preferences and settings

## Documentation

For detailed information about each part of the application:
- [Frontend README](frontend/README.md)
- [Backend README](backend/README.md)
