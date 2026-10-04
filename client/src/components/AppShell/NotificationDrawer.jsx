import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Bell, CheckCheck, X, Sparkles, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

export default function NotificationDrawer({ isOpen, onClose, onRefreshCount }) {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications || []);
      if (onRefreshCount) onRefreshCount(res.data.unreadCount || 0);
    } catch (err) {
      console.warn('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const handleMarkAllRead = async () => {
    try {
      await api.post('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      if (onRefreshCount) onRefreshCount(0);
    } catch (err) {
      console.warn('Failed to mark read');
    }
  };

  const handleNotificationClick = (notif) => {
    if (notif.link) {
      router.push(notif.link);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200 transition-colors">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">System Notifications</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Agent timeline events & updates</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={handleMarkAllRead}
              className="p-1.5 rounded-lg text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Mark all as read"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <Sparkles className="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto" />
              <p className="text-xs text-slate-600 dark:text-slate-400">No new notifications.</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">New recommendation results will appear here in real time.</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const isSuccess = notif.type === 'success';
              const isWarn = notif.type === 'warning';
              return (
                <div
                  key={notif._id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3 rounded-xl border transition cursor-pointer ${
                    notif.isRead
                      ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                      : 'bg-emerald-50/60 dark:bg-slate-800/90 border-emerald-500/30 hover:border-emerald-500/60 shadow-sm'
                  }`}
                >
                  <div className="flex items-start space-x-2.5">
                    <div className="mt-0.5">
                      {isSuccess ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      ) : isWarn ? (
                        <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                      ) : (
                        <Info className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-200">{notif.title}</p>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500">
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{notif.message}</p>
                      {notif.link && (
                        <span className="inline-block mt-1.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                          View Report &rarr;
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-[10px] text-slate-500 dark:text-slate-500">Real-time alerts connected via WebSocket</p>
        </div>
      </div>
    </>
  );
}

