<div align="center">

# QFACE Dashboard

### Modern Administration Interface for QFACE

A responsive web application for managing users, cameras, face recognition, system settings, and real-time monitoring.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)]()
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)]()
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white)]()
[![AGPLv3](https://img.shields.io/badge/License-AGPLv3-red)]()

<img src="docs/dashboard.png" width="100%">

**QFACE Dashboard provides a modern interface for managing every aspect of the QFACE platform, from camera deployment to live recognition events and system administration.**

</div>

---

# Features

## Live Monitoring

- Real-time recognition events
- Live camera status
- Online/offline device monitoring
- Instant notifications
- WebSocket updates
- System health overview

---

## User Management

- Create users
- Edit user profiles
- Delete users
- Role management
- Permission control
- Secure authentication

---

## Person Management

- Register people
- Edit information
- Face enrollment
- Search identities
- Remove enrolled faces
- Recognition history

---

## Camera Management

- Register cameras
- Edit camera configuration
- Enable or disable devices
- Connection monitoring
- Status indicators
- Multi-camera support

---

## Administration

- System configuration
- Recognition settings
- Device settings
- Security settings
- Logging
- Audit history

---

# Technology Stack

| Category | Technology |
|----------|------------|
| Framework | React |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Routing | React Router |
| HTTP Client | Axios |
| State Management | React Context |
| Icons | Lucide React |
| Real-time | WebSocket |

---

# Screens

The dashboard includes dedicated pages for:

- Login
- Dashboard Overview
- Cameras
- Persons
- Users
- Recognition Events
- Settings
- Logs
- Profile

---

# Architecture

```
                QFACE Dashboard
                       │
              REST API / WebSocket
                       │
                QFACE Server
                       │
     Face Recognition & Database
                       │
             Connected Clients
```

---

# Project Structure

```
QFACE-dashboard-front
│
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── styles/
│   └── utils/
│
├── package.json
├── vite.config.js
└── README.md
```

---

# Installation

Clone the repository.

```bash
git clone https://github.com/salar-ziaei/QFACE-dashboard-front

cd QFACE-dashboard-front
```

Install dependencies.

```bash
npm install
```

---

# Development

Start the development server.

```bash
npm run dev
```

The dashboard will be available at:

```
http://localhost:5173
```

---

# Production Build

Build the application.

```bash
npm run build
```

Preview the production build.

```bash
npm run preview
```

---

# Configuration

Configure the frontend to communicate with your QFACE Server.

Typical settings include:

- API URL
- WebSocket URL
- Authentication
- Environment variables
- Application title

---

# Authentication

The dashboard supports secure authentication through the QFACE Server.

Features include:

- JWT authentication
- Session management
- Protected routes
- Automatic token refresh
- Role-based access

---

# Real-Time Updates

Using WebSockets, the dashboard receives live events without requiring page refreshes.

Examples include:

- Face recognized
- Camera connected
- Camera disconnected
- User updates
- System alerts
- Recognition notifications

---

# Responsive Design

Optimized for:

- Desktop
- Laptop
- Tablet

---

# Screenshots

## Dashboard

![](docs/dashboard.png)

---

## Live Recognition

![](docs/recognition.png)

---

## Camera Management

![](docs/cameras.png)

---

## Person Management

![](docs/persons.png)

---

## User Management

![](docs/users.png)

---

## Settings

![](docs/settings.png)

---

## Logs

![](docs/logs.png)

---

# Integration

The dashboard works together with:

| Component | Purpose |
|-----------|---------|
| QFACE Server | Backend API |
| QFACE Client | Camera communication |
| WebSocket Server | Live events |

---

# Browser Support

- Chrome
- Edge
- Firefox
- Safari

---

# Roadmap

- [x] Dashboard Overview
- [x] User Management
- [x] Person Management
- [x] Camera Management
- [x] Real-time Notifications
- [x] Authentication
- [ ] Dark Mode
- [ ] Multi-language Support
- [ ] Advanced Analytics
- [ ] Dashboard Widgets
- [ ] Export Reports
- [ ] Mobile Responsive Improvements

---

# Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push the branch.
5. Open a Pull Request.

---

# License

Licensed under the **GNU Affero General Public License v3.0 (AGPLv3).**

Commercial licensing is available for organizations requiring proprietary use.

---

<div align="center">

### Part of the QFACE Ecosystem

⭐ If this project helps you, consider giving it a star.

</div>
