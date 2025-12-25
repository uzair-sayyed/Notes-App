# 📝 Notes App - Backend API

RESTful API with real-time collaboration features for a collaborative note-taking application.

## 🛠️ Tech Stack

- **Runtime:** Node.js v18+
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Real-time:** Socket.io
- **Authentication:** JWT + bcryptjs
- **Validation:** Express middleware

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Setup Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables:**
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/notes_db"
   JWT_SECRET="your-super-secret-jwt-key-change-this"
   PORT=4000
   NODE_ENV=development
   ```

4. **Setup database:**
   ```bash
   # Create database
   createdb notes_db

   # Run migrations
   npx prisma migrate dev

   # Generate Prisma Client
   npx prisma generate
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

   Server will run on: `http://localhost:4000`

## 📂 Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── config/
│   │   └── db.js              # Prisma client instance
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── note.controller.js
│   │   ├── collaborator.controller.js
│   │   ├── share.controller.js
│   │   └── activity.controller.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── note.service.js
│   │   ├── collaborator.service.js
│   │   ├── share.service.js
│   │   └── activity.service.js
│   ├── middlewares/
│   │   └── auth.middleware.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── note.routes.js
│   │   ├── collaborator.routes.js
│   │   ├── share.routes.js
│   │   └── activity.routes.js
│   ├── socket/
│   │   └── socket.js           # Socket.io configuration
│   ├── utils/
│   │   └── jwt.js              # JWT helper functions
│   └── index.js                # Application entry point
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/logout` | Logout user | Yes |

**Register/Login Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "USER"
    },
    "token": "jwt-token"
  }
}
```

### Notes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/notes` | Get all user notes | Yes |
| POST | `/api/notes` | Create new note | Yes |
| GET | `/api/notes/:id` | Get note by ID | Yes |
| PUT | `/api/notes/:id` | Update note | Yes |
| DELETE | `/api/notes/:id` | Delete note | Yes |

**Create Note Request:**
```json
{
  "title": "My Note",
  "content": "Note content here"
}
```

### Collaborators

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/collaborators` | Add collaborator | Yes |
| GET | `/api/collaborators/:noteId` | Get collaborators | Yes |
| PUT | `/api/collaborators/:id/role` | Update role | Yes |
| DELETE | `/api/collaborators/:id` | Remove collaborator | Yes |

**Add Collaborator Request:**
```json
{
  "noteId": "note-uuid",
  "email": "collaborator@example.com",
  "role": "EDITOR"
}
```

### Share Links

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/share` | Create share link | Yes |
| GET | `/api/share/:token` | Access shared note | No |

### Activity Log

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/activity/:noteId` | Get activity log | Yes |

## 🔄 Socket.io Events

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `note:join` | `{ noteId }` | Join note room |
| `note:update` | `{ noteId, title, content }` | Update note in real-time |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `note:joined` | `{ noteId }` | Confirmation of joining room |
| `note:updated` | `{ noteId, title, content, updatedBy }` | Real-time note update |
| `note:error` | `error message` | Error notification |

## 🗄️ Database Schema

### Models

- **User** - User accounts
- **Note** - Notes with title and content
- **NoteCollaborator** - Note access permissions
- **ActivityLog** - Activity tracking
- **ShareLink** - Public share links

### Relationships

```
User (1) ─── owns ───→ (N) Note
User (1) ─── collaborates ───→ (N) NoteCollaborator
Note (1) ─── has ───→ (N) NoteCollaborator
Note (1) ─── has ───→ (N) ActivityLog
Note (1) ─── has ───→ (N) ShareLink
```

## 🔐 Authentication

Uses **JWT (JSON Web Token)** with HTTP-only cookies:

1. User registers/logs in
2. Server generates JWT token
3. Token stored in HTTP-only cookie
4. Client sends cookie with each request
5. Middleware verifies token

## 🧪 Testing with Postman/Thunder Client

### 1. Register User
```
POST http://localhost:4000/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "123456"
}
```

### 2. Login
```
POST http://localhost:4000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "123456"
}
```

### 3. Create Note (with cookie from login)
```
POST http://localhost:4000/api/notes
Content-Type: application/json
Cookie: token=<jwt-token>

{
  "title": "My First Note",
  "content": "This is the content"
}
```

## 🔧 Available Scripts

```bash
# Development with hot reload
npm run dev

# Production
npm start

# Database commands
npx prisma migrate dev        # Create and apply migrations
npx prisma generate           # Generate Prisma Client
npx prisma studio             # Open Prisma Studio (DB GUI)
npx prisma migrate reset      # Reset database (dev only)
```

## 🌍 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | Secret key for JWT signing | `your-secret-key-min-32-chars` |
| `PORT` | Server port | `4000` |
| `NODE_ENV` | Environment mode | `development` / `production` |

## 🐛 Common Issues

### Database Connection Error
```bash
# Check PostgreSQL is running
pg_isready

# Check connection string in .env
DATABASE_URL="postgresql://username:password@localhost:5432/notes_db"
```

### Migration Errors
```bash
# Reset database and rerun migrations
npx prisma migrate reset
npx prisma migrate dev
```

### Port Already in Use
```bash
# Kill process on port 4000
lsof -ti:4000 | xargs kill -9

# Or change PORT in .env
PORT=5000
```

## 📝 Notes

- Default user role: `USER`
- Collaborator roles: `EDITOR` (can edit) or `VIEWER` (read-only)
- JWT expires in 24 hours
- All passwords are hashed with bcrypt
- CORS enabled for `http://localhost:5173`

## 🚀 Deployment

### Recommended Platforms

- **Backend:** Railway, Render, Heroku
- **Database:** Railway PostgreSQL, Supabase, ElephantSQL

### Production Checklist

- [ ] Set strong `JWT_SECRET`
- [ ] Update CORS origins
- [ ] Enable SSL/HTTPS
- [ ] Set `NODE_ENV=production`
- [ ] Configure connection pooling
- [ ] Add rate limiting
- [ ] Setup logging service

## 📄 License

MIT

## 👨‍💻 Author

Built as a full-stack developer interview assignment.