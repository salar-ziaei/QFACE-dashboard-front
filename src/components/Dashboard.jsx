import { useState, useEffect } from "react";
import { api } from "../api";
import { toast, usePolling } from "../hooks";
import { ToastContainer, StatCard } from "../ui";

import LogsTab from "./tabs/LogsTab";
import StatsTab from "./tabs/StatsTab";
import CameraTab from "./tabs/CameraTab";
import FacesTab from "./tabs/FacesTab";
import TrainedDataTab from "./tabs/TrainedDataTab";
import DoorLogsTab from "./tabs/DoorLogsTab";
import UsersTab from "./tabs/UsersTab";
import SettingsTab from "./tabs/SettingsTab";
import LogFilesTab from "./tabs/LogFilesTab";
import ProfileTab from "./tabs/ProfileTab";

const TABS = (isAdmin) =>
  [
    { id: "all", label: "📋 All Logs", always: true },
    { id: "recognised", label: "✅ Recognised", always: true },
    { id: "unrecognised", label: "❌ Unrecognised", always: true },
    { id: "stats", label: "📊 Stats", always: true },
    { id: "camera", label: "📷 Camera", always: true },
    { id: "faces", label: "👤 Faces", always: true },
    { id: "trained", label: "📚 Trained Data", always: true },
    { id: "door", label: "🚪 Door Logs", always: true },
    { id: "users", label: "👥 Users", admin: true },
    { id: "settings", label: "⚙️ Settings", admin: true },
    { id: "logs", label: "📄 Log Files", admin: true },
    { id: "profile", label: "🔑 Profile", always: true },
  ].filter((t) => t.always || (t.admin && isAdmin));

export default function Dashboard({ isAdmin, username, onLogout }) {
  const [tab, setTab] = useState("all");
  const [stats, setStats] = useState(null);
  const [sideOpen, setSideOpen] = useState(false);
  const [autoOpen, setAutoOpen] = useState(true);
  const [autoOpenCanUpdate, setAutoOpenCanUpdate] = useState(false);

  const loadStats = async () => {
    const d = await api.stats();
    if (d) setStats(d);
  };

  const loadAO = async () => {
    const data = await api.getAO();
    const ao = data?.message;
    if (ao !== null && ao !== undefined) setAutoOpen(ao);
  }

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    const init = async () => {
      const data = await api.getAO();
      const ao = data?.message;
      if (ao !== undefined && ao !== null) {
        setAutoOpen(ao);
      }
      setAutoOpenCanUpdate(true); // allow future updates
    };
    init();
  }, []);

  useEffect(() => {
    if (autoOpenCanUpdate) {
      api.setAO(autoOpen);
    }
  }, [autoOpen]);
  usePolling(loadStats, 5000);
  usePolling(loadAO, 2000);

  const logout = async () => {
    await api.logout();
    onLogout();
  };

  const switchTab = (id) => {
    setTab(id);
    setSideOpen(false);
  };

  const renderTab = () => {
    switch (tab) {
      case "all":
        return <LogsTab type="all" isAdmin={isAdmin} />;
      case "recognised":
        return <LogsTab type="recognised" isAdmin={isAdmin} />;
      case "unrecognised":
        return <LogsTab type="unrecognised" isAdmin={isAdmin} />;
      case "stats":
        return <StatsTab />;
      case "camera":
        return <CameraTab />;
      case "faces":
        return <FacesTab isAdmin={isAdmin} />;
      case "trained":
        return <TrainedDataTab isAdmin={isAdmin} />;
      case "door":
        return <DoorLogsTab />;
      case "users":
        return <UsersTab />;
      case "settings":
        return <SettingsTab />;
      case "logs":
        return <LogFilesTab />;
      case "profile":
        return <ProfileTab username={username} isAdmin={isAdmin} />;
      default:
        return null;
    }
  };

  const tabs = TABS(isAdmin);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ToastContainer />

      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100"
              onClick={() => setSideOpen(!sideOpen)}
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <span className="font-bold text-gray-800 text-lg">🔐 QFACE</span>
          </div>

          {/* Stats header */}
          <div className="hidden sm:flex items-center gap-4 text-sm">
            <span className="text-gray-500">
              Total:{" "}
              <strong className="text-gray-800">{stats?.total || 0}</strong>
            </span>
            <span className="text-green-600">
              ✅ <strong>{stats?.recognised || 0}</strong>
            </span>
            <span className="text-red-500">
              ❌ <strong>{stats?.unrecognised || 0}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center justify-between gap-4 py-2">
              <span className="text-sm text-gray-700">Auto Open</span>
              <div
                onClick={() => setAutoOpen(!autoOpen)}
                className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors ${autoOpen ? "bg-indigo-500" : "bg-gray-300"}`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${autoOpen ? "translate-x-5" : "translate-x-0.5"}`}
                />
              </div>
            </label>
            <span className="hidden sm:inline text-sm text-gray-500">
              {username}
            </span>
            <button onClick={logout} className="btn-secondary btn-sm">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar overlay on mobile */}
        {sideOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/30 lg:hidden"
            onClick={() => setSideOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
          fixed lg:static z-20 top-14 bottom-0 left-0 w-56 bg-white border-r border-gray-200
          transform transition-transform duration-200 overflow-y-auto
          ${sideOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        >
          <nav className="p-2 space-y-0.5">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => switchTab(t.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                  ${
                    tab === t.id
                      ? "bg-indigo-50 text-indigo-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{renderTab()}</main>
      </div>
    </div>
  );
}
