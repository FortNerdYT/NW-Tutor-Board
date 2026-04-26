# Tutor Board

A modern web application where teachers can post requests for student help (tutoring, lab assistance, organization, etc.), and students can browse and respond.

## Features

- **Authentication**: Google OAuth with domain restriction (@nw.sparcc.org only)
- **Teacher Functionality**: Create, edit, and delete help requests
- **Student Functionality**: Browse, filter, and respond to requests
- **Role-based Access**: Separate interfaces for teachers and students
- **Contact System**: Built-in mailto integration for easy communication

## Tech Stack

- **Frontend**: React + Tailwind CSS + React Router
- **Backend**: Node.js + Express
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Google OAuth
- **Hosting**: Vercel (frontend) + Railway/Render (backend)

## Setup Instructions

### Prerequisites

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Create a Google Cloud project with OAuth credentials
3. Install Node.js (v18+)

### Environment Variables

Create `.env` files in both `backend/` and `frontend/`:

**Backend (.env):**
```
PORT=5000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Database Setup

Run the SQL schema in Supabase SQL Editor:
```sql
-- See backend/supabase-schema.sql
```

### Installation

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running the App

```bash
# Development (runs both frontend and backend)
npm run dev

# Production
npm run build
npm start
```

## Project Structure

```
tutor-board/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── server.js
│   ├── package.json
│   └── supabase-schema.sql
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.jsx
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## Deployment

### Frontend (Vercel)
1. Connect GitHub repository
2. Set environment variables
3. Deploy

### Backend (Railway/Render)
1. Connect GitHub repository
2. Set environment variables
4. Deploy

## License

MIT
