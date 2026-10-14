import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Trophy,
  User,
  Hand,
} from "lucide-react";

function Navbar() {
  return (
    <nav className="navbar">

      {/* Logo */}
      <div className="logo">
        <div className="logo-icon">
          🚀
        </div>

        <span>HACKATHON BUDDY</span>
      </div>


      {/* Navigation */}
      <div className="nav-links">

        <a href="#" className="nav-link active">
          <LayoutDashboard size={15} />
          Dashboard
        </a>

        <a href="#" className="nav-link">
          <Users size={15} />
          Matching
        </a>

        <a href="#" className="nav-link">
          <FolderKanban size={15} />
          Projects
        </a>

        <a href="#" className="nav-link">
          <Trophy size={15} />
          Hackathons
        </a>

        <a href="#" className="nav-link">
          <User size={15} />
          Profile
        </a>

      </div>


      {/* User */}
      <div className="user-section">

        <div className="user-info">
          <strong>Sanika Pandhare</strong>
          <span>FULL STACK</span>
        </div>

        <div className="avatar">
          sp
        </div>

        <div className="wave">
          <Hand size={16} />
        </div>

      </div>

    </nav>
  );
}

export default Navbar;