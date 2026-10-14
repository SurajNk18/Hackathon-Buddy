import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck, Trash2, Search, ArrowRight, Check } from "lucide-react";
import { useApp } from "../../context/AppContext";
import "./Notifications.css";

function Notifications() {
  const navigate = useNavigate();
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    clearAllNotifications,
  } = useApp();

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const unreadCount = notifications.filter((n) => n.unread).length;

  const tabs = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread" },
    { id: "hackathon", label: "Hackathons" },
    { id: "team", label: "Teams" },
    { id: "project", label: "Projects" },
  ];

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        n.title.toLowerCase().includes(q) ||
        n.message.toLowerCase().includes(q);

      let matchesTab = true;
      if (activeTab === "unread") {
        matchesTab = n.unread;
      } else if (["hackathon", "team", "project"].includes(activeTab)) {
        matchesTab = n.type === activeTab;
      }

      return matchesSearch && matchesTab;
    });
  }, [notifications, activeTab, search]);

  const handleActionClick = (notification) => {
    markNotificationRead(notification.id);
    if (notification.route) {
      navigate(notification.route);
    }
  };

  return (
    <div className="notifications-page">
      {/* HEADER */}
      <div className="notifications-header">
        <div>
          <div className="notifications-kicker">ACTIVITY CENTER</div>
          <h1>Notifications</h1>
          <p>Real-time updates on team invitations, hackathon registrations, and sprint milestones.</p>
        </div>

        <div className="notification-header-actions">
          <button
            className="secondary-action"
            onClick={markAllNotificationsRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck size={16} /> Mark all as read
          </button>

          <button
            className="danger-action"
            onClick={clearAllNotifications}
            disabled={notifications.length === 0}
          >
            <Trash2 size={16} /> Clear all
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="notification-summary">
        <div className="summary-card">
          <div className="summary-icon purple">🔔</div>
          <div>
            <strong>{notifications.length}</strong>
            <span>Total updates</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon blue">●</div>
          <div>
            <strong>{unreadCount}</strong>
            <span>Unread messages</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon green">✓</div>
          <div>
            <strong>{notifications.length - unreadCount}</strong>
            <span>Reviewed activity</span>
          </div>
        </div>
      </div>

      {/* TOOLBAR & LIST */}
      <section className="notifications-container">
        <div className="notification-toolbar">
          <div className="notification-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search notifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")} className="clear-search">
                ×
              </button>
            )}
          </div>

          <div className="notification-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={activeTab === tab.id ? "active" : ""}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
                {tab.id === "unread" && unreadCount > 0 && <span>{unreadCount}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* NOTIFICATIONS LIST */}
        <div className="notification-list">
          {filteredNotifications.length === 0 ? (
            <div className="empty-notifications">
              <div className="empty-icon">🔔</div>
              <h3>No notifications found</h3>
              <p>{search ? "Try searching with different keywords." : "You're all caught up!"}</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <article
                className={`notification-item ${notif.unread ? "unread" : ""}`}
                key={notif.id}
                onClick={() => handleActionClick(notif)}
              >
                <div className={`notification-icon ${notif.type}`}>
                  {notif.icon || "🔔"}
                </div>

                <div className="notification-content">
                  <div className="notification-title-row">
                    <h3>{notif.title}</h3>
                    {notif.unread && <span className="unread-dot" />}
                  </div>
                  <p>{notif.message}</p>
                  <div className="notification-meta">
                    <span>{notif.time}</span>
                    <span className="notification-type">{notif.type}</span>
                  </div>
                </div>

                <div className="notification-actions">
                  {notif.action && (
                    <button
                      className="notification-action"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleActionClick(notif);
                      }}
                    >
                      {notif.action}
                      <ArrowRight size={14} />
                    </button>
                  )}

                  {notif.unread && (
                    <button
                      className="mark-read"
                      title="Mark as read"
                      onClick={(e) => {
                        e.stopPropagation();
                        markNotificationRead(notif.id);
                      }}
                    >
                      <Check size={14} />
                    </button>
                  )}

                  <button
                    className="delete-notification"
                    title="Delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.id);
                    }}
                  >
                    ×
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default Notifications;