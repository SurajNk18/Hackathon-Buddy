import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Sparkles, Heart, Code2, ShieldCheck, Zap } from "lucide-react";
import "./Footer.css";

function Footer() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/" || location.pathname === "/login" || location.pathname === "/create-profile";

  if (isAuthPage) {
    return null;
  }

  return (
    <footer className="global-footer">
      <div className="footer-container">
        {/* Top Footer */}
        <div className="footer-top-grid">
          {/* Brand Info */}
          <div className="footer-brand-col">
            <div className="footer-brand">
              <div className="footer-brand-icon">🚀</div>
              <div className="footer-brand-name">
                HACKATHON<span>BUDDY</span>
              </div>
            </div>
            <p className="footer-desc">
              The all-in-one AI platform for hackers. Match with compatible teammates, build projects, track deadlines, and supercharge your hackathon performance.
            </p>
            <div className="footer-badge">
              <Sparkles size={14} />
              <span>AI-Powered Collaboration</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links-col">
            <h4>Workspace Modules</h4>
            <ul>
              <li><Link to="/dashboard">Dashboard Overview</Link></li>
              <li><Link to="/hackathons">Explore Hackathons</Link></li>
              <li><Link to="/teams">Teammate Matching</Link></li>
              <li><Link to="/ai-hub">AI Innovation Hub</Link></li>
              <li><Link to="/projects">Project Workspace</Link></li>
            </ul>
          </div>

          {/* Collaboration */}
          <div className="footer-links-col">
            <h4>Collaboration</h4>
            <ul>
              <li><Link to="/chat">Real-time Team Chat</Link></li>
              <li><Link to="/notifications">Activity Center</Link></li>
              <li><Link to="/profile">Developer Profile</Link></li>
              <li><Link to="/teams">Skill Gap Analyzer</Link></li>
              <li><Link to="/ai-hub">Project Idea Generator</Link></li>
            </ul>
          </div>

          {/* System & Status */}
          <div className="footer-status-col">
            <h4>System Status</h4>
            <div className="status-indicator-card">
              <div className="status-pulse-dot" />
              <div>
                <strong>All Systems Operational</strong>
                <small>Matching Engine: Active (v2.4)</small>
              </div>
            </div>
            <div className="status-tags">
              <span><ShieldCheck size={14} /> Local State Sync</span>
              <span><Zap size={14} /> React 19 Fast Engine</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p>© 2026 HackathonBuddy. Crafted for Hackers & Builders worldwide.</p>
          <div className="footer-bottom-links">
            <span>Made with <Heart size={13} className="heart-icon" /> by Developers</span>
            <span>•</span>
            <span><Code2 size={13} /> Open Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
