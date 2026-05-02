import { useState } from "react";

const CATEGORIES = [
  { label: "Bollywood", tag: "bollywood", icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg> },
  { label: "News", tag: "news", icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg> },
  { label: "Regional", tag: "regional", icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  { label: "Devotional", tag: "devotional", icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> },
  { label: "Classical", tag: "classical", icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg> },
  { label: "Talk", tag: "talk", icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg> },
];

function Modal({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl p-7 w-full max-w-sm shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function SettingsModal({ onClose }: { onClose: () => void }) {
  const items = [
    { label: "Autoplay on select", desc: "Play station immediately on click", on: true },
    { label: "Remember last station", desc: "Resume playback on next visit", on: true },
    { label: "High quality stream", desc: "Prefer higher bitrate when available", on: false },
  ];
  return (
    <Modal onClose={onClose}>
      <div className="flex items-center justify-between mb-7">
        <h2 className="font-heading text-xl font-bold text-text-primary">Settings</h2>
        <button onClick={onClose} className="w-9 h-9 rounded-full bg-[#F3F4F6] flex items-center justify-center text-text-dim hover:text-danger transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      {items.map((s) => (
        <div key={s.label} className="flex items-center justify-between py-4 border-b border-border/30 last:border-0">
          <div>
            <p className="text-sm font-semibold text-text-primary">{s.label}</p>
            <p className="text-xs text-text-muted mt-0.5">{s.desc}</p>
          </div>
          <div className={`w-12 h-6 rounded-full flex items-center px-0.5 cursor-pointer transition-colors ${s.on ? "bg-accent" : "bg-border"}`}>
            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${s.on ? "translate-x-6" : "translate-x-0"}`} />
          </div>
        </div>
      ))}
    </Modal>
  );
}

function AboutModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal onClose={onClose}>
      <div className="flex justify-end mb-2">
        <button onClick={onClose} className="w-9 h-9 rounded-full bg-[#F3F4F6] flex items-center justify-center text-text-dim hover:text-danger transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-accent mx-auto flex items-center justify-center shadow-xl mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
        </div>
        <h3 className="font-heading text-xl font-bold mb-1 text-text-primary">EasyRadio</h3>
        <p className="text-xs text-accent font-bold uppercase tracking-widest mb-4">Classic · Curated · Live</p>
        <p className="text-sm text-text-muted leading-relaxed mb-5">Browse thousands of live Indian radio stations. Favorites saved locally — no login needed.</p>
        <p className="text-xs text-text-dim/50 mb-1">Powered by <span className="font-bold text-accent">radio-browser.info</span></p>
        <p className="text-[9px] text-text-dim/25 uppercase tracking-widest font-bold">Built by @owsam22 · v1.0.0</p>
      </div>
    </Modal>
  );
}

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
}

export default function Sidebar({
  activeCategory, onSelectCategory, favoritesCount,
  onShowFavorites, onShowHome, currentView,
  onSearch, searchQuery, onClose, isMobile,
}: SidebarProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const NavItem = ({
    label, icon, active, onClick, badge,
  }: { label: string; icon: React.ReactNode; active: boolean; onClick: () => void; badge?: number }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 ${
        active
          ? "bg-accent/[0.08] text-accent font-bold"
          : "text-text-muted hover:bg-black/[0.03] hover:text-text-primary font-medium"
      }`}
    >
      <span className={`flex-shrink-0 transition-colors ${active ? "text-accent" : "text-text-dim/40"}`}>{icon}</span>
      <span className="flex-1 text-left text-[15px]">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className={`text-[10px] min-w-[20px] h-5 px-1.5 rounded-full font-bold flex items-center justify-center transition-all ${
          active ? "bg-accent/15 text-accent" : "bg-border/80 text-text-dim"
        }`}>{badge}</span>
      )}
    </button>
  );

  const SectionLabel = ({ children }: { children: string }) => (
    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-dim/40 px-4 mb-1 mt-2">{children}</p>
  );

  return (
    <>
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}

      <aside className={`${isMobile ? "flex" : "hidden lg:flex"} flex-col w-[17rem] flex-shrink-0 h-full bg-[#F9F8F6] border-r border-border/25 z-20`}>

        {/* ── Top: Logo ── */}
        <div className="flex items-center justify-between px-6 pt-8 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-accent flex items-center justify-center shadow-lg shadow-accent/20 flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <div>
              <h1 className="font-heading text-[17px] font-bold text-text-primary leading-none tracking-tight">EasyRadio</h1>
              <span className="text-[9px] text-accent font-extrabold uppercase tracking-[0.18em]">Live Radio</span>
            </div>
          </div>
          {isMobile && onClose && (
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-text-dim hover:text-danger shadow-sm transition-colors border border-border/40">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>

        {/* ── Search Bar ── */}
        <div className="px-4 pb-6">
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-dim/35 group-focus-within:text-accent transition-colors">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search stations..."
              className="w-full bg-white border border-border/50 rounded-2xl pl-11 pr-9 py-[13px] text-[14px] text-text-primary placeholder:text-text-dim/35 outline-none focus:border-accent/40 focus:ring-[3px] focus:ring-accent/10 transition-all shadow-sm"
            />
            {searchQuery && (
              <button onClick={() => onSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dim/40 hover:text-danger transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
        </div>

        {/* ── Nav ── */}
        <div className="flex-1 overflow-y-auto px-3 space-y-6">

          <div>
            <SectionLabel>Library</SectionLabel>
            <NavItem label="Home" icon={<svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>} active={currentView === "home" && !searchQuery} onClick={onShowHome} />
            <NavItem label="Favorites" icon={<svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>} active={currentView === "favorites"} onClick={onShowFavorites} badge={favoritesCount} />
          </div>

          <div>
            <SectionLabel>Genres</SectionLabel>
            {CATEGORIES.map((c) => (
              <NavItem key={c.tag} label={c.label} icon={c.icon} active={activeCategory === c.tag} onClick={() => onSelectCategory(c.tag)} />
            ))}
          </div>

          <div>
            <SectionLabel>App</SectionLabel>
            <NavItem label="Settings" icon={<svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} active={false} onClick={() => setShowSettings(true)} />
            <NavItem label="About" icon={<svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} active={false} onClick={() => setShowAbout(true)} />
          </div>

        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-6 border-t border-border/25 bg-[#F9F8F6]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary leading-none">@owsam22</p>
              <p className="text-[11px] text-text-muted mt-0.5">Developer & Designer</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-4">
            {[
              { label: "Github", path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" },
              { label: "LinkedIn", path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
            ].map((s) => (
              <a key={s.label} href="#" className="w-9 h-9 rounded-xl bg-white border border-border/50 flex items-center justify-center text-text-dim hover:text-accent transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d={s.path} /></svg>
              </a>
            ))}
          </div>
          <p className="text-[9px] text-text-dim/25 font-bold uppercase tracking-[0.15em]">© 2026 EasyRadio</p>
        </div>

      </aside>
    </>
  );
}


