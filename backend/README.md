# Movie Recommendation System - Backend

This is the backend API built with Express.js and MongoDB.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with the following variables:
```env
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
MONGODB_URI=mongodb://127.0.0.1:27017/movieReviewSystem
```

3. Run the development server:
```bash
npm run dev
# or
npm start
```

## Tech Stack

- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **Email**: Nodemailer

## Project Structure

- `server.js` - Main Express server
- `models/` - Mongoose schemas and models
- `lib/` - Utility functions

## API Endpoints

The backend provides API endpoints for:
- User authentication (register, login, password reset)
- User management
- Wishlist management
- OTP generation and verification

## Scripts

- `npm start` - Start server
- `npm run dev` - Start server with nodemon (auto-reload)
