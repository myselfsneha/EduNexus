# 🎓 EduNexus — College Management System

EduNexus is a full-stack college management application built to bring common academic administration tasks into one responsive interface. It includes separate admin and student experiences, backed by a Node.js/Express API and MySQL database.

## 🚀 Live application

- **Frontend:** https://edu-nexus-lilac.vercel.app/
- **Backend service:** https://edunexus-backend-ps02.onrender.com
- **Repository:** https://github.com/myselfsneha/EduNexus

> The backend base URL may not display a page at its root path. Use the deployed frontend to access the application.

## ✨ Features

### Authentication and access
- User registration and login
- JWT-based authentication
- Role-protected application routes

### Admin and academic administration
- Student record management (create, view, update, delete)
- Attendance management
- Fee record and payment-status management
- Course management
- Faculty directory and management
- **Timetable management:** schedule classes by course, subject, faculty, day, time, and classroom
- Timetable editing and deletion
- Scheduling-conflict validation in the timetable workflow
- Dashboard summaries and charts

### Student experience
- Student dashboard and profile
- Attendance progress
- Notifications and personal task management
- Dark-mode support

### Interface
- Responsive React interface
- React Router navigation
- Tailwind CSS styling
- Dashboard charts and visual summaries

*Available actions depend on the signed-in user's role and the data configured in the database.*

## 🧰 Technology stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, Vite, React Router, Axios, Tailwind CSS, React Icons |
| Backend | Node.js, Express, JWT, bcryptjs |
| Database | MySQL with mysql2 |
| Hosting | Vercel (frontend), Render (backend) |

## 📁 Project structure

```text
EduNexus/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   └── server.js
├── frontend/
│   └── EduNexus/
│       └── src/
│           ├── components/
│           ├── context/
│           └── pages/
├── docs/
├── EduNexus.png
└── README.md
```

## 💻 Run locally

### Requirements
- Node.js and npm
- A MySQL database
- Git

### 1. Clone the repository

```bash
git clone https://github.com/myselfsneha/EduNexus.git
cd EduNexus
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Create a local `.env` file with the database and authentication settings required by the backend configuration. Use your own local credentials; **never commit `.env` or production secrets**.

Start the API:

```bash
npm run dev
```

Or run the production start script:

```bash
npm start
```

### 3. Configure and run the frontend

In a separate terminal:

```bash
cd frontend/EduNexus
npm install
npm run dev
```

Create or update the frontend API base URL configuration for your local backend if needed. For a production build:

```bash
npm run build
```

## 🔐 Security notes

- Keep database passwords, JWT secrets, and other credentials in environment variables.
- Do not commit `.env` files or access tokens.
- Keep administrative API routes protected and validate permissions on the server, not only in the UI.

## 👥 Team

- Sneha Singh
- Tirthi Jhamar
- Oshi Kanungo
- Shivani Parmar
- Khushi Rathod

## 🔮 Potential future improvements

- Email and in-app notification workflows
- PDF report generation and richer exports
- Expanded student performance analytics
- Profile picture and cloud file storage
- Real-time dashboard updates

## 📄 License

This project was developed for educational and learning purposes. A separate license file should be added if a specific open-source license is selected.
