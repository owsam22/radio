import { useState } from "react";

// SVG icons for each category
const CATEGORIES = [
  {
    label: "Bollywood",
    tag: "bollywood",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
      </svg>
    ),
  },
  {
    label: "News",
    tag: "news",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
  },
  {
    label: "Regional",
    tag: "regional",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "Devotional",
    tag: "devotional",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    label: "Classical",
    tag: "classical",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
  },
  {
    label: "Talk",
    tag: "talk",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
  },
];

interface SidebarProps {
  activeCategory: string;
  onSelectCategory: (tag: string) => void;
  favoritesCount: number;
  onShowFavorites: () => void;
  onShowHome: () => void;
  currentView: "home" | "favorites";
  onSearch: (query: string) => void;
  searchQuery: string;
}

// Settings Modal Component
function SettingsModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-2xl font-bold text-text-primary">Settings</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-surface-light flex items-center justify-center text-text-dim hover:text-danger transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between py-3 border-b border-border/40">
            <div>
              <p className="text-sm font-bold text-text-primary">Autoplay on select</p>
              <p className="text-xs text-text-muted mt-0.5">Automatically play station on click</p>
            </div>
            <div className="w-12 h-6 bg-accent rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
            </div>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border/40">
            <div>
              <p className="text-sm font-bold text-text-primary">Remember last station</p>
              <p className="text-xs text-text-muted mt-0.5">Resume on next visit</p>
            </div>
            <div className="w-12 h-6 bg-accent rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
            </div>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-bold text-text-primary">High quality stream</p>
              <p className="text-xs text-text-muted mt-0.5">Prefer higher bitrate when available</p>
            </div>
            <div className="w-12 h-6 bg-border/40 rounded-full relative cursor-pointer">
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
            </div>
          </div>
        </div>
        <p className="text-[10px] text-text-dim/40 mt-8 text-center uppercase tracking-widest">Settings are saved locally</p>
      </div>
    </div>
  );
}

// About Modal Component
function AboutModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-2xl font-bold text-text-primary">About</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-surface-light flex items-center justify-center text-text-dim hover:text-danger transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center shadow-xl shadow-accent/20">
            <span className="font-heading text-bg text-4xl font-bold">S</span>
          </div>
          <div>
            <h3 className="font-heading text-xl font-bold text-text-primary">Swar Luxe Radio</h3>
            <p className="text-xs text-accent font-bold tracking-widest uppercase mt-1">Classic • Curated • Live</p>
          </div>
          <p className="text-sm text-text-muted leading-relaxed max-w-xs">
            A premium Indian radio experience. Browse thousands of live stations — from Bollywood to Classical — and save your favorites.
          </p>
        </div>
        <div className="text-center space-y-1">
          <p className="text-xs text-text-dim/60">Powered by <span className="font-bold text-accent">radio-browser.info</span></p>
          <p className="text-[10px] text-text-dim/30 uppercase tracking-widest">© 2026 Swar Luxe · v1.0.0</p>
        </div>
      </div>
    </div>
  );
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
}: SidebarProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  return (
    <>
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}

      <aside className="hidden lg:flex flex-col w-72 flex-shrink-0 bg-[#F8F9FA] h-full border-r border-border/40 overflow-y-auto">
        <div className="flex flex-col h-full py-8 px-6">
          {/* Branding */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20 flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <div>
              <h1 className="font-heading text-lg font-bold text-text-primary tracking-tight leading-none">Swar Luxe</h1>
              <span className="text-[9px] text-accent font-bold tracking-widest uppercase">Classic Radio</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative flex items-center group">
              <svg className="absolute left-3.5 w-4 h-4 text-text-dim/50 group-focus-within:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Escape' && onSearch('')}
                placeholder="Search stations..."
                className="w-full bg-white border border-border/50 rounded-xl pl-10 pr-9 py-2.5 text-sm text-text-primary placeholder:text-text-dim/40 outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/10 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearch('')}
                  className="absolute right-3 text-text-dim/50 hover:text-danger transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
          </div>

          {/* Navigation Sections */}
          <div className="flex-1 space-y-7 overflow-y-auto">
            {/* My Stations */}
            <div>
              <p className="text-[9px] uppercase tracking-[0.25em] text-text-dim/50 mb-3 font-bold px-1">My Stations</p>
              <nav className="space-y-0.5">
                <button
                  onClick={onShowHome}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                    currentView === "home" && !searchQuery
                      ? "bg-white text-accent font-bold shadow-sm"
                      : "text-text-muted hover:bg-white/80 hover:text-text-primary"
                  }`}
                >
                  <svg className="w-4.5 h-4.5 flex-shrink-0" style={{width:'1.1rem',height:'1.1rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Home</span>
                </button>
                <button
                  onClick={onShowFavorites}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                    currentView === "favorites"
                      ? "bg-white text-accent font-bold shadow-sm"
                      : "text-text-muted hover:bg-white/80 hover:text-text-primary"
                  }`}
                >
                  <svg className="flex-shrink-0" style={{width:'1.1rem',height:'1.1rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>Favorites</span>
                  {favoritesCount > 0 && (
                    <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      currentView === "favorites" ? "bg-accent/10 text-accent" : "bg-border/60 text-text-dim"
                    }`}>
                      {favoritesCount}
                    </span>
                  )}
                </button>
              </nav>
            </div>

            {/* Genres */}
            <div>
              <p className="text-[9px] uppercase tracking-[0.25em] text-text-dim/50 mb-3 font-bold px-1">Genres</p>
              <nav className="space-y-0.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.tag}
                    onClick={() => onSelectCategory(cat.tag)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                      activeCategory === cat.tag
                        ? "bg-white text-accent font-bold shadow-sm"
                        : "text-text-muted hover:bg-white/80 hover:text-text-primary"
                    }`}
                  >
                    <span className={`flex-shrink-0 ${activeCategory === cat.tag ? "text-accent" : "text-text-dim/50"}`}>
                      {cat.icon}
                    </span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Menu */}
            <div>
              <p className="text-[9px] uppercase tracking-[0.25em] text-text-dim/50 mb-3 font-bold px-1">Menu</p>
              <nav className="space-y-0.5">
                <button
                  onClick={() => setShowSettings(true)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-muted hover:bg-white/80 hover:text-text-primary transition-all duration-200"
                >
                  <svg className="flex-shrink-0 text-text-dim/50" style={{width:'1.1rem',height:'1.1rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Settings</span>
                </button>
                <button
                  onClick={() => setShowAbout(true)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-muted hover:bg-white/80 hover:text-text-primary transition-all duration-200"
                >
                  <svg className="flex-shrink-0 text-text-dim/50" style={{width:'1.1rem',height:'1.1rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>About</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-6 mt-6 border-t border-border/40">
            <div className="flex items-center gap-3 mb-3">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-text-dim/30 hover:text-accent transition-colors" title="GitHub">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-text-dim/30 hover:text-accent transition-colors" title="Twitter / X">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="mailto:support@swarluxe.fm" className="text-text-dim/30 hover:text-accent transition-colors" title="Contact">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </a>
            </div>
            <p className="text-[9px] text-text-dim/30 uppercase tracking-widest font-bold">© 2026 Swar Luxe</p>
          </div>
        </div>
      </aside>
    </>
  );
}
