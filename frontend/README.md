# 📝 Notes App - Frontend

Modern React-based frontend for real-time collaborative note-taking application.

## 🛠️ Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Real-time:** Socket.io Client
- **Styling:** Tailwind CSS
- **State Management:** React Context API

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running

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
   VITE_API_URL=http://localhost:4000/api
   VITE_SOCKET_URL=http://localhost:4000
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

   App will run on: `http://localhost:5173`

## 📂 Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── activity/
│   │   │   └── ActivityLog.jsx
│   │   ├── collaborators/
│   │   │   ├── AddCollaborator.jsx
│   │   │   └── CollaboratorList.jsx
│   │   ├── notes/
│   │   │   └── NoteCard.jsx
│   │   ├── shared/
│   │   │   ├── Navbar.jsx
│   │   │   └── ShareLinkModal.jsx
│   │   └── PrivateRoute.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── SocketContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useSocket.js
│   ├── pages/
│   │   ├── DashboardPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── NoteDetailPage.jsx
│   │   ├── RegisterPage.jsx
│   │   └── SharedNotePage.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   └── noteService.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🎨 Features

### Authentication
- ✅ User registration
- ✅ Login/Logout
- ✅ JWT token management
- ✅ Protected routes

### Notes Management
- ✅ Create notes
- ✅ Edit notes (real-time)
- ✅ Delete notes (owner only)
- ✅ Search notes
- ✅ View note list

### Collaboration
- ✅ Add collaborators by email
- ✅ Assign roles (Editor/Viewer)
- ✅ Real-time editing
- ✅ Remove collaborators
- ✅ Update collaborator roles

### Additional Features
- ✅ Activity logging
- ✅ Public share links
- ✅ Permission-based UI
- ✅ Role badges
- ✅ Auto-save (debounced)

## 🔄 Real-Time Features

### Socket.io Integration

The app uses Socket.io for real-time collaboration:

1. **Join Note Room:** When opening a note
2. **Live Updates:** Changes sync across all users
3. **Auto-reconnect:** Handles connection drops
4. **User Indicators:** Shows who last updated

```javascript
// Example: Real-time note update
socket.emit('note:update', {
  noteId: 'uuid',
  title: 'New Title',
  content: 'New Content'
});
```

## 🎯 User Flows

### Registration Flow
```
Register Page → Enter email/password → Auto-login → Dashboard
```

### Note Creation Flow
```
Dashboard → Click "New Note" → Fill form → Note Detail Page
```

### Collaboration Flow
```
Note Detail → Click "Collaborators" → Add by email → Assign role
→ Collaborator receives access → Can view/edit based on role
```

### Share Link Flow
```
Note Detail → Click "Share" → Generate link → Copy → Share publicly
→ Anyone with link can view (read-only)
```

## 🔐 Permission System

### User Roles (Note-level)

| Role | Can View | Can Edit | Can Delete | Can Add Collaborators | Can Share |
|------|----------|----------|------------|----------------------|-----------|
| **Owner** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Editor** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Viewer** | ✅ | ❌ | ❌ | ❌ | ❌ |

### UI Behavior

- **Viewers:** Disabled inputs, read-only mode, info banner
- **Editors:** Can edit but no admin controls
- **Owners:** Full control with all buttons enabled

## 🧪 Testing the App

### Quick Test Flow

1. **Register two users:**
   - User A: `alice@test.com`
   - User B: `bob@test.com`

2. **Create note as Alice:**
   - Login as Alice
   - Create note "Team Meeting Notes"

3. **Add Bob as collaborator:**
   - Click "Collaborators"
   - Enter `bob@test.com`
   - Select "Editor"
   - Click "Add"

4. **Test real-time editing:**
   - Open note in two browser windows
   - Login as Alice in Window 1
   - Login as Bob in Window 2
   - Both open same note
   - Type in one window
   - See changes in other window instantly!

5. **Test permissions:**
   - Change Bob's role to "Viewer"
   - Bob can no longer edit
   - See permission error on focus

## 🔧 Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🌍 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:4000/api` |
| `VITE_SOCKET_URL` | Socket.io server URL | `http://localhost:4000` |

## 🎨 Styling

### Tailwind CSS

Custom configuration includes:

- **Colors:** Indigo theme for primary actions
- **Typography:** System fonts for optimal readability
- **Components:** Reusable button/input classes
- **Responsive:** Mobile-first with breakpoints

### Color Scheme

- **Primary:** Indigo (`bg-indigo-600`)
- **Success:** Green (`bg-green-100`)
- **Warning:** Yellow (`bg-yellow-50`)
- **Error:** Red (`bg-red-50`)
- **Neutral:** Gray scale

## 📱 Responsive Design

Basic responsive support included:

- **Mobile:** Single column layouts
- **Tablet:** 2-column grids  
- **Desktop:** 3-column grids

## 🐛 Common Issues

### API Connection Error
```bash
# Check backend is running
curl http://localhost:4000/api

# Verify VITE_API_URL in .env
VITE_API_URL=http://localhost:4000/api
```

### Socket Connection Failed
```bash
# Check VITE_SOCKET_URL
VITE_SOCKET_URL=http://localhost:4000

# Check CORS settings in backend
```

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📝 Notes

- Auto-save debounced to 1 second
- Real-time updates require both users online
- JWT token stored in HTTP-only cookie
- Session expires after 24 hours

## 🚀 Deployment

### Recommended Platforms

- **Frontend:** Vercel, Netlify, Cloudflare Pages

### Production Checklist

- [ ] Update `VITE_API_URL` to production backend
- [ ] Update `VITE_SOCKET_URL` to production backend
- [ ] Run `npm run build`
- [ ] Test all features in production
- [ ] Enable HTTPS
- [ ] Setup error monitoring

## 📄 License

MIT

## 👨‍💻 Author

Built as a full-stack developer interview assignment.