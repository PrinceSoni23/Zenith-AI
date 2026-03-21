"use client";

import { useState } from "react";
import { Bell, CheckCircle, AlertCircle, Award, Clock } from "lucide-react";
import toast from "react-hot-toast";

interface Notification {
  id: string;
  type: "achievement" | "alert" | "update" | "reminder";
  childName: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "achievement",
    childName: "Sarah",
    title: "Milestone Achieved!",
    message: "Completed 7-day learning streak in Mathematics",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: "2",
    type: "alert",
    childName: "John",
    title: "Performance Drop Alert",
    message: "Science scores have decreased by 15% this week",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: "3",
    type: "update",
    childName: "Sarah",
    title: "Weekly Report Ready",
    message: "Your weekly learning report is now available",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: "4",
    type: "reminder",
    childName: "John",
    title: "Study Reminder",
    message: "John hasn't studied for 3 days. Time for a learning session!",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: "5",
    type: "achievement",
    childName: "John",
    title: "Subject Mastery",
    message: "Achieved 90% mastery in Algebra topics",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    read: true,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<
    "all" | "unread" | "achievement" | "alert"
  >("all");

  const getFilteredNotifications = () => {
    return notifications.filter(notif => {
      if (filter === "unread") return !notif.read;
      if (filter === "achievement") return notif.type === "achievement";
      if (filter === "alert") return notif.type === "alert";
      return true;
    });
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n)),
    );
    toast.success("Marked as read");
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success("Notification deleted");
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "achievement":
        return <Award className="w-5 h-5 text-yellow-500" />;
      case "alert":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "update":
        return <Bell className="w-5 h-5 text-blue-500" />;
      case "reminder":
        return <Clock className="w-5 h-5 text-purple-500" />;
    }
  };

  const getTypeColor = (type: Notification["type"]) => {
    switch (type) {
      case "achievement":
        return "bg-yellow-100 dark:bg-yellow-500/10 text-yellow-800 dark:text-yellow-400";
      case "alert":
        return "bg-red-100 dark:bg-red-500/10 text-red-800 dark:text-red-400";
      case "update":
        return "bg-blue-100 dark:bg-blue-500/10 text-blue-800 dark:text-blue-400";
      case "reminder":
        return "bg-purple-100 dark:bg-purple-500/10 text-purple-800 dark:text-purple-400";
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Bell className="w-8 h-8 text-purple-500" />
            Notifications
          </h1>
          {unreadCount > 0 && (
            <span className="inline-block px-3 py-1 rounded-full bg-red-500 text-white text-sm font-semibold">
              {unreadCount} New
            </span>
          )}
        </div>
        <p className="text-slate-600 dark:text-slate-400">
          Stay updated on your children's learning journey
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(["all", "unread", "achievement", "alert"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                filter === f
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="px-4 py-2 rounded-lg bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 font-semibold hover:bg-green-200 dark:hover:bg-green-500/20 transition-all"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border-l-4 transition-all ${
                notification.read
                  ? "bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                  : "bg-blue-50 dark:bg-blue-500/5 border-blue-400 dark:border-blue-500 shadow-md"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`mt-1 p-2 rounded-lg ${getTypeColor(
                    notification.type,
                  )}`}
                >
                  {getIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-900 dark:text-slate-100">
                          {notification.title}
                        </h3>
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-400">
                          {notification.childName}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        {notification.message}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-all"
                      title="Mark as read"
                    >
                      <CheckCircle className="w-5 h-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-500/10 rounded-lg transition-all"
                    title="Delete"
                  >
                    <span className="text-slate-400 hover:text-red-600 dark:hover:text-red-400">
                      ×
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 mx-auto mb-3 text-slate-400 dark:text-slate-600" />
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              No notifications yet
            </p>
            <p className="text-slate-500 dark:text-slate-500 text-sm">
              You'll get notified when there's something new about your
              children's learning
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
