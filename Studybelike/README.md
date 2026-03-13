# StudyBeLike - Educational Website

A complete educational website for engineering and school study materials, featuring notes, tutorials, PDFs, and videos. Inspired by LastMinuteEngineering.tech but as an original implementation.

## 🏗️ Project Structure

```
studybelike
├── backend/
│   ├── models/
│   │   ├── Article.js
│   │   ├── Course.js
│   │   ├── Note.js
│   │   ├── PaymentSettings.js
│   │   └── User.js
│   ├── routes/
│   │   ├── articles.js
│   │   ├── courses.js
│   │   ├── notes.js
│   │   ├── payment.js
│   │   └── users.js
│   ├── server.js
│   └── package.json
└── frontend/
    ├── components/
    ├── pages/
    │   ├── index.js
    │   ├── subjects.js
    │   ├── notes.js
    │   ├── courses.js
    │   ├── payment.js
    │   ├── article/[slug].js
    │   ├── courses/[slug].js
    │   ├── login.js
    │   └── upload.js
    └── styles/
```

## 🚀 Features

1. **Homepage** - Hero section, search bar, popular subjects, latest notes
2. **Subjects Page** - Browse by Electronics, Arduino, Sensors, IoT, Computer Science, Programming
3. **Tutorial Articles** - Full markdown, code blocks, PDF download
4. **Notes Download** - Search/filter notes by subject
5. **Courses** - Video courses with categories, levels, pricing
6. **Course Detail** - Full curriculum, enrollment
7. **Payment System** - UPI/QR, PayPal, Bank Transfer
8. **Login System** - Register, login, JWT auth
9. **Admin Upload** - Articles, notes, courses, payment settings
10. **Dark Mode Toggle**
11. **Breadcrumb Navigation**

## 📋 Prerequisites

- Node.js (v18+)
- MongoDB Atlas account

## 🔧 Installation

### Backend Setup
```bash
cd studybelike/backend
npm install
```

Create `.env`:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Start backend:
```bash
npm start
```

### Frontend Setup
```bash
cd studybelike/frontend
npm install
npm run dev
```

Frontend runs on http://localhost:3000

## 🌍 Deployment

### Backend - Render
1. Create Render account
2. New Web Service → Connect GitHub
3. Build: `npm install`, Start: `npm start`
4. Add env vars: MONGODB_URI, JWT_SECRET

### Frontend - Vercel
1. Import GitHub repo
2. Framework: Next.js
3. Add env: NEXT_PUBLIC_API_URL=your_backend_url

### Database - MongoDB Atlas
1. Create cluster (free)
2. Create user
3. Network Access: 0.0.0.0/0

## 🎨 Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas

---

Made with ❤️ by StudyBeLike

