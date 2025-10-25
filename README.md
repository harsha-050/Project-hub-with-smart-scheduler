# Project Hub with Smart Scheduler

A full-stack project management application with intelligent task scheduling capabilities. Manage projects, create tasks, and leverage AI-powered scheduling to optimize your workflow.

## 🌐 Live Demo

**Frontend:** [https://harsha-050.github.io/Project-hub-with-smart-scheduler/](https://harsha-050.github.io/Project-hub-with-smart-scheduler/)

**APIs:**
- Project Manager API: [https://project-manager-api-3i10.onrender.com](https://project-manager-api-3i10.onrender.com)
- Smart Scheduler API: [https://smart-scheduler-api-rbgq.onrender.com](https://smart-scheduler-api-rbgq.onrender.com)

## ✨ Features

- 🔐 **User Authentication** - Secure registration and login with JWT tokens
- 📊 **Project Management** - Create and manage multiple projects
- ✅ **Task Management** - Add, edit, and track tasks with due dates
- 🧠 **Smart Scheduling** - AI-powered task scheduling using topological sorting
- 📈 **Dependency Management** - Handle task dependencies automatically
- 🎯 **Priority Optimization** - Tasks ordered by due date and estimated hours
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **GitHub Pages** - Hosting

### Backend APIs

#### Project Manager API (ASP.NET Core)
- **.NET 8.0** - Framework
- **Entity Framework Core** - ORM
- **SQLite** - Database
- **JWT Authentication** - Security
- **Swagger** - API documentation
- **Docker** - Containerization
- **Render** - Hosting

#### Smart Scheduler API (Node.js)
- **Express.js** - Web framework
- **Node.js** - Runtime
- **Topological Sort Algorithm** - Task scheduling
- **Render** - Hosting

## 🚀 Getting Started

### Prerequisites
- Node.js v16 or higher
- .NET SDK 8.0
- Git

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/harsha-050/Project-hub-with-smart-scheduler.git
cd Project-hub-with-smart-scheduler
```

2. **Setup Frontend**
```bash
cd client
npm install
npm run dev
```
Frontend will run at `http://localhost:5173`

3. **Setup Node.js API**
```bash
# In project root
npm install
npm start
```
API will run at `http://localhost:3000`

4. **Setup ASP.NET API**
```bash
cd backend
dotnet restore
dotnet run
```
API will run at `http://localhost:5000`

## 📁 Project Structure

```
Project-hub-with-smart-scheduler/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── api/              # API client
│   │   └── context/          # React context
│   ├── public/
│   └── package.json
├── backend/                   # ASP.NET Core API
│   ├── Controllers/          # API endpoints
│   ├── Models/               # Data models
│   ├── Services/             # Business logic
│   ├── Data/                 # Database context
│   └── Dockerfile
├── server.js                  # Node.js API
├── package.json
└── README.md
```

## 🔧 Environment Variables

### Frontend (.env.production)
```env
VITE_PM_API_URL=https://project-manager-api-3i10.onrender.com/api
VITE_SCHEDULER_API_URL=https://smart-scheduler-api-rbgq.onrender.com
```

### Node.js API
```env
PORT=3000
FRONTEND_URL=https://harsha-050.github.io
```

### ASP.NET API
```env
ASPNETCORE_URLS=http://0.0.0.0:10000
AllowedOrigins__0=https://harsha-050.github.io
Jwt__Key=YourSecretKeyHere
Jwt__Issuer=ProjectManagerAPI
Jwt__Audience=ProjectManagerClient
```

## 📡 API Endpoints

### Project Manager API
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `GET /api/projects/{id}` - Get project details
- `DELETE /api/projects/{id}` - Delete project
- `POST /api/tasks/projects/{id}/tasks` - Create task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

### Smart Scheduler API
- `GET /api/health` - Health check
- `POST /api/v1/projects/{id}/schedule` - Generate optimized task schedule

## 🧮 Smart Scheduling Algorithm

The scheduler uses a **topological sorting algorithm** to:
1. Analyze task dependencies
2. Order tasks based on prerequisites
3. Prioritize by due date and estimated hours
4. Detect circular dependencies
5. Generate optimal execution order

## 🚢 Deployment

### Frontend (GitHub Pages)
Automatically deployed via GitHub Actions on push to `main` branch.

### Backend APIs (Render)
Both APIs are containerized and deployed on Render with automatic deployments.

## 👤 Author

**Harsha**
- GitHub: [@harsha-050](https://github.com/harsha-050)


