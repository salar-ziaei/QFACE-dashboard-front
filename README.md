---

## 📄 `QFACE-dashboard-front/README.md`

```markdown
# QFACE Dashboard Frontend

A modern React dashboard for the QFACE face recognition system. It provides a clean UI to monitor recognitions, manage faces and users, view door logs, and control settings.

## Features

- **Tab‑based interface** – All Logs, Recognised, Unrecognised, Door Logs, Faces, Trained Data, Users, Settings, Log Files, Profile.
- **Real‑time statistics** – Total, Recognised, Unrecognised, Unique People.
- **Pagination** – Logs are loaded in pages of 50.
- **Auto‑refresh** – Logs refresh every 3 seconds, stats every 5 seconds.
- **Admin‑only sections** – User management, face management, trained data, log files.
- **Mobile‑responsive** – Works on desktop and mobile devices.
- **API integration** – All requests go through the main server proxy (port 8080).

## Requirements

- Node.js 18+
- npm or yarn

## Installation

```bash
git clone https://github.com/salar-ziaei/QFACE-dashboard-front.git
cd QFACE-dashboard-front
npm install
Development
bash
npm run dev
The dashboard will be available at http://localhost:5173 (by default). Ensure the QFACE Server is running.

Build for Production
bash
npm run build
The built assets will be in the dist/ folder. You can serve them with any static server (e.g., serve -s dist).

Configuration
Create a .env file (based on .env.example):

env
VITE_API_URL=http://localhost:8080
The dashboard will use this URL to proxy all API requests.

Usage
Ensure the QFACE Server (main server) is running on the port specified in VITE_API_URL.

Open the dashboard in your browser.

Log in with your credentials (default: admin / admin123 – change immediately).

Navigate through the tabs to manage your system.

License
This project is licensed under the MIT License – see the LICENSE file for details.