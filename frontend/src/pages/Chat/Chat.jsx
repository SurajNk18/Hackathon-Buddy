import React, { useMemo, useState } from "react";
import { Send, Search, CheckCheck, Paperclip, Smile, MoreVertical, Phone, Video, Users as UsersIcon, X } from "lucide-react";
import { useApp } from "../../context/AppContext";
import "./Chat.css";

const initialConversations = [
  {
    id: 1,
    name: "AI Study Assistant",
    short: "AI",
    preview: "Rohan: Authentication API endpoints are ready for testing.",
    time: "09:18 PM",
    unread: 2,
    color: "purple",
    members: ["Sanika", "Priya", "Rohan", "Aman"]
  },
  {
    id: 2,
    name: "CodeCrafters Squad",
    short: "CC",
    preview: "Priya: I updated the responsive Figma layout.",
    time: "08:42 PM",
    unread: 0,
    color: "blue",
    members: ["Sanika", "Priya", "Rohan", "Aman"]
  },
  {
    id: 3,
    name: "Priya Singh",
    short: "P",
    preview: "Can you check the login page styles?",
    time: "07:30 PM",
    unread: 1,
    color: "pink",
    members: ["Sanika", "Priya"]
  },
  {
    id: 4,
    name: "Rohan Mehta",
    short: "R",
    preview: "Database migration script is finished.",
    time: "Yesterday",
    unread: 0,
    color: "navy",
    members: ["Sanika", "Rohan"]
  },
  {
    id: 5,
    name: "Aman Khan",
    short: "A",
    preview: "Model test accuracy reached 94%.",
    time: "Yesterday",
    unread: 0,
    color: "green",
    members: ["Sanika", "Aman"]
  },
];

const initialChatMessages = {
  1: [
    {
      id: 1,
      sender: "Rohan Mehta",
      short: "R",
      type: "received",
      text: "Authentication API is ready. I have completed the login and registration endpoints.",
      time: "09:10 PM",
    },
    {
      id: 2,
      sender: "You",
      short: "S",
      type: "sent",
      text: "Awesome! I am connecting it with the frontend state and responsive forms.",
      time: "09:12 PM",
    },
    {
      id: 3,
      sender: "Priya Singh",
      short: "P",
      type: "received",
      text: "I pushed the updated dashboard components. Please test on mobile breakpoints when possible!",
      time: "09:15 PM",
    },
    {
      id: 4,
      sender: "Rohan Mehta",
      short: "R",
      type: "received",
      text: "Authentication API endpoints are ready for testing.",
      time: "09:18 PM",
    },
  ],
  2: [
    {
      id: 101,
      sender: "Aman Khan",
      short: "A",
      type: "received",
      text: "Our team submission deadline is in 48 hours. Let's make sure our demo video is recorded early.",
      time: "08:30 PM"
    },
    {
      id: 102,
      sender: "Priya Singh",
      short: "P",
      type: "received",
      text: "Priya: I updated the responsive Figma layout.",
      time: "08:42 PM"
    }
  ]
};

function Chat() {
  const { currentUser, teamMembers } = useApp();
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedChatId, setSelectedChatId] = useState(1);
  const [messagesByChat, setMessagesByChat] = useState(initialChatMessages);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [inputText, setInputText] = useState("");
  const [showRightSidebar, setShowRightSidebar] = useState(false);

  const activeChat = conversations.find((c) => c.id === selectedChatId) || conversations[0];
  const messages = messagesByChat[selectedChatId] || [];

  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      const q = search.toLowerCase();
      const matchSearch = c.name.toLowerCase().includes(q) || c.preview.toLowerCase().includes(q);
      const matchTab =
        activeTab === "All" ||
        (activeTab === "Unread" && c.unread > 0) ||
        (activeTab === "Teams" && c.members.length > 2);
      return matchSearch && matchTab;
    });
  }, [conversations, search, activeTab]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: "You",
      short: currentUser?.firstName?.charAt(0) || "U",
      type: "sent",
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessagesByChat((prev) => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), newMsg],
    }));

    // Update preview
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedChatId
          ? { ...c, preview: `You: ${inputText.trim()}`, time: "Just now" }
          : c
      )
    );

    setInputText("");

    // Simulate quick auto-reply after 1.5s
    setTimeout(() => {
      const autoReply = {
        id: Date.now() + 1,
        sender: activeChat.name.includes("Priya") ? "Priya Singh" : "Rohan Mehta",
        short: activeChat.name.includes("Priya") ? "P" : "R",
        type: "received",
        text: "Got it! Looking great, I'll review and test right away.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessagesByChat((prev) => ({
        ...prev,
        [selectedChatId]: [...(prev[selectedChatId] || []), autoReply],
      }));
    }, 1200);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-page">
      {/* LEFT CONVERSATIONS LIST */}
      <aside className="chat-sidebar">
        <div className="sidebar-header">
          <div>
            <div className="section-kicker">COLLABORATION</div>
            <h1>Messages</h1>
          </div>
        </div>

        <div className="conversation-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="chat-tabs">
          {["All", "Unread", "Teams"].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="conversation-list">
          {filteredConversations.map((c) => (
            <button
              key={c.id}
              className={`conversation-item ${selectedChatId === c.id ? "selected" : ""}`}
              onClick={() => {
                setSelectedChatId(c.id);
                // Mark unread as read
                setConversations((prev) =>
                  prev.map((conv) => (conv.id === c.id ? { ...conv, unread: 0 } : conv))
                );
              }}
            >
              <div className={`conversation-avatar ${c.color}`}>
                {c.short}
                <span className="online-dot" />
              </div>

              <div className="conversation-content">
                <div className="conversation-top">
                  <strong>{c.name}</strong>
                  <span>{c.time}</span>
                </div>
                <div className="conversation-bottom">
                  <p>{c.preview}</p>
                  {c.unread > 0 && <span className="unread-count">{c.unread}</span>}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">{currentUser?.firstName?.charAt(0) || "S"}</div>
          <div>
            <strong>{currentUser?.fullName}</strong>
            <span>Active in Workspace</span>
          </div>
          <span className="user-online">●</span>
        </div>
      </aside>

      {/* CENTER CHAT MAIN */}
      <main className="chat-main">
        {/* HEADER */}
        <header className="chat-header">
          <div className="chat-title-area">
            <div className="large-chat-avatar">
              {activeChat?.short || "AI"}
              <span className="online-dot" />
            </div>
            <div>
              <h2>{activeChat?.name || "Chat"}</h2>
              <span>👥 {activeChat?.members?.length || 4} Squad Members</span>
            </div>
          </div>

          <div className="chat-header-actions">
            <button
              onClick={() => setShowRightSidebar(!showRightSidebar)}
              title="Toggle Project Info"
            >
              <UsersIcon size={18} />
            </button>
          </div>
        </header>

        {/* MESSAGES LIST */}
        <section className="messages-area">
          <div className="project-banner">
            <div className="project-banner-icon">#</div>
            <div className="project-banner-content">
              <strong>{activeChat?.name}</strong>
              <span>Encrypted Hackathon Team Channel</span>
            </div>
          </div>

          <div className="today-divider">
            <span />
            <b>TODAY</b>
            <span />
          </div>

          <div className="messages-list">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`message-row ${m.type === "sent" ? "sent-row" : "received-row"}`}
              >
                {m.type === "received" && (
                  <div className="message-avatar">{m.short}</div>
                )}
                <div className="message-block">
                  <span className="message-sender">{m.sender}</span>
                  <div className={`message-bubble ${m.type === "sent" ? "sent-bubble" : "received-bubble"}`}>
                    {m.text}
                  </div>
                  <div className={`message-time ${m.type === "sent" ? "sent-time" : ""}`}>
                    {m.time}
                    {m.type === "sent" && <CheckCheck size={14} style={{ color: "#38bdf8", marginLeft: "4px" }} />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* COMPOSER */}
        <div className="chat-composer-wrapper">
          <div className="composer">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${activeChat?.name}...`}
              rows="1"
            />

            <button
              className="send-btn"
              onClick={handleSendMessage}
              title="Send message"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </main>

      {/* RIGHT SIDEBAR (PROJECT & SQUAD DETAILS) */}
      <aside className={`project-sidebar ${showRightSidebar ? "open" : ""}`}>
        <div className="project-sidebar-header">
          <span>PROJECT WORKSPACE</span>
        </div>

        <div className="project-icon">&lt;/&gt;</div>
        <h2>{activeChat?.name}</h2>
        <p>Live collaborative room for sprint execution.</p>

        <div className="project-divider" />

        <section className="project-section">
          <div className="section-title-row">
            <h3>Squad Members</h3>
            <span>{teamMembers.length}</span>
          </div>

          <div className="members-list">
            {teamMembers.map((member) => (
              <div className="member-item" key={member.id}>
                <div className="member-avatar">
                  {member.letter || member.name.charAt(0)}
                  <span className="member-online" />
                </div>
                <div>
                  <strong>{member.name}</strong>
                  <span>{member.role}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}

export default Chat;