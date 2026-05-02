import React from "react";

interface SidebarProps {
  activeCategory: string;
  onSelectCategory: (tag: string) => void;
  favoritesCount: number;
  onShowFavorites: () => void;
  onShowHome: () => void;
  currentView: "home" | "favorites";
  onSearch: (q: string) => void;
  searchQuery: string;
  onClose?: () => void;
  isMobile?: boolean;
  region: "indian" | "global";
  onSelectRegion: (region: "indian" | "global") => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

export default function Sidebar({
  activeCategory,
  onSelectCategory,
  favoritesCount,
  onShowFavorites,
  onShowHome,
  currentView,
  onSearch,
  searchQuery,
  onClose,
  isMobile,
  region,
  onSelectRegion,
  theme,
  onToggleTheme,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleNavClick = (view: "home" | "favorites" | string) => {
    if (view === "home") {
      onShowHome();
    } else if (view === "favorites") {
      onShowFavorites();
    } else {
      onSelectCategory(view);
    }
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""} ${isMobile ? "mobile-open" : ""}`} id="sidebar">
      <div className="sidebar-top">
        <div className="logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.55a11 11 0 0 1 14.08 0" />
              <path d="M1.42 9a16 16 0 0 1 21.16 0" />
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
              <circle cx="12" cy="20" r="1" fill="white" stroke="none" />
              <line x1="12" y1="20" x2="12" y2="17" />
            </svg>
          </div>
          {!isCollapsed && <span className="logo-text">easy<span>radio</span></span>}
        </div>
        {!isMobile ? (
          <button className="sidebar-toggle-btn" onClick={toggleSidebar} title="Toggle sidebar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        ) : (
          <button className="sidebar-toggle-btn" onClick={onClose} title="Close sidebar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      <div className="search-wrap">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input 
            type="text" 
            placeholder={isCollapsed ? "" : "Search stations..."} 
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>

      <nav className="nav-section">
        {!isCollapsed && <div className="nav-group-label">Region</div>}
        
        <div 
          className={`nav-item ${region === "indian" && currentView === "home" && !activeCategory ? "active" : ""}`} 
          onClick={() => { onSelectRegion("indian"); handleNavClick("home"); }}
          title="Indian Stations"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          {!isCollapsed && <span className="nav-item-text">India</span>}
        </div>

        <div 
          className={`nav-item ${region === "global" && currentView === "home" && !activeCategory ? "active" : ""}`} 
          onClick={() => { onSelectRegion("global"); handleNavClick("home"); }}
          title="Global Stations"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          {!isCollapsed && <span className="nav-item-text">Global</span>}
        </div>

        {!isCollapsed && <div className="nav-group-label">Library</div>}
        
        <div 
          className={`nav-item ${currentView === "favorites" ? "active" : ""}`} 
          onClick={() => handleNavClick("favorites")}
          title="Favourites"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          {!isCollapsed && (
            <>
              <span className="nav-item-text">Favourites</span>
              {favoritesCount > 0 && <span className="badge">{favoritesCount}</span>}
            </>
          )}
        </div>

        {!isCollapsed && <div className="nav-group-label">Genres</div>}
        
        <div 
          className={`nav-item ${activeCategory === "bollywood" ? "active" : ""}`} 
          onClick={() => handleNavClick("bollywood")}
          title="Bollywood"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
          </svg>
          {!isCollapsed && <span className="nav-item-text">Bollywood</span>}
        </div>

        <div 
          className={`nav-item ${activeCategory === "news" ? "active" : ""}`} 
          onClick={() => handleNavClick("news")}
          title="News"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="2" /><circle cx="12" cy="12" r="6" strokeDasharray="2 2" />
            <circle cx="12" cy="12" r="10" />
          </svg>
          {!isCollapsed && <span className="nav-item-text">News</span>}
        </div>

        <div 
          className={`nav-item ${activeCategory === "classical" ? "active" : ""}`} 
          onClick={() => handleNavClick("classical")}
          title="Classical"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          {!isCollapsed && <span className="nav-item-text">Classical</span>}
        </div>

        {!isCollapsed && (
          <>
            <div className="nav-group-label">Account</div>
            <div className="nav-item" onClick={onToggleTheme} title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}>
              {theme === "dark" ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
              <span className="nav-item-text">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </div>
            <div className="nav-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
              </svg>
              <span className="nav-item-text">Settings</span>
            </div>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        {!isCollapsed && <div className="footer-title">@owsam22</div>}
        <div className="social-links">
          <a className="social-btn" href="https://github.com/owsam22" target="_blank" title="GitHub">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
          {!isCollapsed && (
            <>
              <a className="social-btn" href="https://instagram.com/owsam22" target="_blank" title="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4.5" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a className="social-btn" href="https://linkedin.com/in/owsam22" target="_blank" title="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </>
          )}
        </div>
        {!isCollapsed && <div className="footer-handle">Built with ♥ by owsam22</div>}
      </div>
    </aside>
  );
}
