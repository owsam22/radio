import { useEffect, useCallback, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import StationCard from "./components/StationCard";
import { SkeletonGrid } from "./components/SkeletonCard";
import Player from "./components/Player";
import { usePlayer } from "./hooks/usePlayer";
import { useFavorites, useRecentlyPlayed } from "./hooks/useFavorites";
import {
  fetchIndianStations,
  fetchTopStations,
  searchStations,
  searchIndianStations,
  fetchStationsByTag,
  fetchIndianStationsByTag,
  fetchStationByUuid,
  type Station,
} from "./services/radioApi";

type View = "home" | "favorites";

export default function App() {
  const [view, setView] = useState<View>("home");
  const [activeCategory, setActiveCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [stations, setStations] = useState<Station[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobilePlayerOpen, setMobilePlayerOpen] = useState(false);
  const [region, setRegion] = useState<"indian" | "global">("indian");
  const [theme, setTheme] = useState<"dark" | "light">("light");

  const player = usePlayer();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { addRecent } = useRecentlyPlayed();

  const fetchStations = useCallback(async () => {
    setIsFetching(true);
    setFetchError(null);
    try {
      let results: Station[];
      if (searchQuery.trim()) {
        results = region === "indian" 
          ? await searchIndianStations(searchQuery.trim())
          : await searchStations(searchQuery.trim());
      } else if (activeCategory) {
        results = region === "indian"
          ? await fetchIndianStationsByTag(activeCategory)
          : await fetchStationsByTag(activeCategory);
      } else {
        results = region === "indian" 
          ? await fetchIndianStations()
          : await fetchTopStations();
      }

      const seen = new Set<string>();
      const unique = results.filter((s) => {
        if (seen.has(s.stationuuid)) return false;
        seen.add(s.stationuuid);
        return true;
      });
      setStations(unique);
    } catch {
      setFetchError("Failed to load stations. Check your connection and try again.");
      setStations([]);
    } finally {
      setIsFetching(false);
    }
  }, [searchQuery, activeCategory, region]);

  useEffect(() => { fetchStations(); }, [fetchStations]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim()) setActiveCategory("");
  }, []);

  const handleSelectCategory = useCallback((tag: string) => {
    setActiveCategory((prev) => (prev === tag ? "" : tag));
    setSearchQuery("");
    setView("home");
    setSidebarOpen(false);
  }, []);

  const handleShowFavorites = useCallback(() => {
    setView("favorites");
    setActiveCategory("");
    setSearchQuery("");
    setSidebarOpen(false);
  }, []);

  const handleShowHome = useCallback(() => {
    setView("home");
    setActiveCategory("");
    setSearchQuery("");
    setSidebarOpen(false);
  }, []);

  const handlePlay = useCallback((station: Station) => {
    player.playStation(station);
    addRecent(station);
  }, [player, addRecent]);

  const handleNext = useCallback(() => {
    if (!player.currentStation || stations.length === 0) return;
    const currentIndex = stations.findIndex(s => s.stationuuid === player.currentStation?.stationuuid);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % stations.length;
    handlePlay(stations[nextIndex]);
  }, [player.currentStation, stations, handlePlay]);

  const handlePrevious = useCallback(() => {
    if (!player.currentStation || stations.length === 0) return;
    const currentIndex = stations.findIndex(s => s.stationuuid === player.currentStation?.stationuuid);
    if (currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + stations.length) % stations.length;
    handlePlay(stations[prevIndex]);
  }, [player.currentStation, stations, handlePlay]);

  const displayedStations = useMemo(() => {
    if (view === "favorites") return favorites;
    return stations;
  }, [view, favorites, stations]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stationUuid = params.get("station");
    if (stationUuid) {
      fetchStationByUuid(stationUuid)
        .then((stations) => {
          if (stations && stations.length > 0) {
            handlePlay(stations[0]);
          }
        })
        .catch((err) => console.error("Failed to load shared station", err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="body-wrapper" className={sidebarOpen ? "menu-open" : ""}>
      
      {/* SIDEBAR OVERLAY (mobile) */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? "visible" : ""}`} 
        id="overlay" 
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* SIDEBAR */}
      <Sidebar
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        favoritesCount={favorites.length}
        onShowFavorites={handleShowFavorites}
        onShowHome={handleShowHome}
        currentView={view}
        onSearch={handleSearch}
        searchQuery={searchQuery}
        onClose={() => setSidebarOpen(false)}
        isMobile={sidebarOpen}
        region={region}
        onSelectRegion={setRegion}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* MAIN CONTENT */}
      <div className="main-content">
        {/* TOPBAR */}
        <div className="topbar">
          <div className="topbar-left">
            <button className="mobile-menu-btn" id="mobileMenuBtn" onClick={() => setSidebarOpen(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <span className="page-title">{view === "favorites" ? "Your Favourites" : region === "indian" ? "Indian Stations" : "Global Stations"}</span>
          </div>
          <div className="topbar-right">
             <button className="theme-btn" id="themeBtn" onClick={toggleTheme} title="Toggle theme">
              {theme === "dark" ? (
                <svg id="themeIconDark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg id="themeIconLight" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="content-area">
          {/* MOBILE SEARCH BAR */}
          <div className="mobile-search-area">
             <div className="search-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Search stations..." 
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
          </div>

          {/* HERO */}
          {view === "home" && !searchQuery && !activeCategory && (
            <div className="hero">
              <div className="hero-glow"></div>
              <div className="hero-glow2"></div>
              
              {/* Retro Radio Background Image */}
              <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '45%', zIndex: 0 }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, var(--bg2) 0%, transparent 40%)', zIndex: 1 }}></div>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg2) 0%, transparent 20%)', zIndex: 1 }}></div>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, var(--bg2) 0%, transparent 20%)', zIndex: 1 }}></div>
                <img src="https://images.unsplash.com/photo-1593697821252-0c9137d9fc45?w=800&auto=format&fit=crop&q=80" alt="Retro Radio" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
              </div>

              <div style={{ position: 'relative', zIndex: 2 }}>
                <div className="live-badge">
                  <span className="live-dot"></span> Live Broadcasting
                </div>
                <h1>Stream Radio, Anywhere.</h1>
                <p>From Bollywood hits to Berlin techno — thousands of live stations, zero interruptions.</p>
                <div className="hero-stats">
                <div className="stat"><span className="stat-val">12K+</span><span className="stat-lbl">Stations</span></div>
                <div className="stat"><span className="stat-val">180+</span><span className="stat-lbl">Countries</span></div>
                <div className="stat"><span className="stat-val">2.4M</span><span className="stat-lbl">Listeners</span></div>
                <div className="stat"><span className="stat-val">FREE</span><span className="stat-lbl">Always</span></div>
                  </div>
              </div>
            </div>
          )}

          {/* STATIONS */}
          <div className="station-wrap">
            <div className="station-header">
              <span className="section-title">
                {searchQuery ? `Results for "${searchQuery}"` : activeCategory ? activeCategory.toUpperCase() : region === "indian" ? "Trending in India" : "Global Top Hits"}
              </span>
              <div className="toggle-pill">
                <div 
                  className={`tgl ${region === "indian" ? "active" : ""}`} 
                  onClick={() => setRegion("indian")}
                >
                  India
                </div>
                <div 
                  className={`tgl ${region === "global" ? "active" : ""}`} 
                  onClick={() => setRegion("global")}
                >
                  Global
                </div>
              </div>
            </div>
            
            <div className="stations-grid" id="stationsGrid">
              {isFetching ? (
                <SkeletonGrid count={12} />
              ) : fetchError ? (
                <div style={{ padding: '20px', color: 'var(--accent)' }}>{fetchError}</div>
              ) : displayedStations.length === 0 ? (
                <div style={{ padding: '20px', color: 'var(--txt3)' }}>No stations found</div>
              ) : (
                displayedStations.map((station) => (
                  <StationCard
                    key={station.stationuuid}
                    station={station}
                    isPlaying={player.currentStation?.stationuuid === station.stationuuid && player.isPlaying}
                    isFavorite={isFavorite(station.stationuuid)}
                    onPlay={handlePlay}
                    onToggleFavorite={toggleFavorite}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PLAYER PANEL (Desktop) */}
      <Player
        currentStation={player.currentStation}
        isPlaying={player.isPlaying}
        volume={player.volume}
        isLoading={player.isLoading}
        hasError={player.hasError}
        onVolumeChange={player.setVolume}
        onTogglePlayPause={player.togglePlayPause}
        onStop={player.stop}
        isFavorite={player.currentStation ? isFavorite(player.currentStation.stationuuid) : false}
        onToggleFavorite={() => player.currentStation && toggleFavorite(player.currentStation)}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />

      {/* MOBILE PLAYER BAR */}
      {player.currentStation && (
        <div className="mobile-player" onClick={() => setMobilePlayerOpen(true)}>
          <div className="mp-thumb" style={{ background: 'var(--bg3)', color: 'var(--txt2)' }}>
            <img 
              src={player.currentStation.favicon || `https://ui-avatars.com/api/?name=${encodeURIComponent(player.currentStation.name)}&background=1A1A1A&color=fff&size=64`} 
              alt="" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '11px' }}
            />
          </div>
          <div className="mp-info">
            <div className="mp-name">{player.currentStation.name}</div>
            <div className="mp-sub">{player.isPlaying ? "Playing Now" : "Paused"}</div>
          </div>
          <div className="mp-controls">
            <button className="mp-btn mp-play" onClick={(e) => { e.stopPropagation(); player.togglePlayPause(); }}>
              {player.isPlaying ? (
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px' }}>
                  <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px' }}>
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}

      {/* MOBILE FULLSCREEN PLAYER */}
      {mobilePlayerOpen && (
        <div className="mobile-player-overlay" style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'var(--bg)' }}>
           <Player
              currentStation={player.currentStation}
              isPlaying={player.isPlaying}
              volume={player.volume}
              isLoading={player.isLoading}
              hasError={player.hasError}
              onVolumeChange={player.setVolume}
              onTogglePlayPause={player.togglePlayPause}
              onStop={() => { player.stop(); setMobilePlayerOpen(false); }}
              isFavorite={player.currentStation ? isFavorite(player.currentStation.stationuuid) : false}
              onToggleFavorite={() => player.currentStation && toggleFavorite(player.currentStation)}
              mobileFullscreen
              onCollapse={() => setMobilePlayerOpen(false)}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
        </div>
      )}

    </div>
  );
}
