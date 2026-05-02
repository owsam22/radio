import { useEffect, useCallback, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import StationCard from "./components/StationCard";
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


  const player = usePlayer();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { recents, addRecent } = useRecentlyPlayed();

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

  const displayedStations = useMemo(() => {
    if (view === "favorites") return favorites;
    return stations;
  }, [view, favorites, stations]);

  const pageTitle = useMemo(() => {
    if (view === "favorites") return "Your Favorites";
    if (searchQuery) return `Results for "${searchQuery}"`;
    if (activeCategory) return activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1);
    return region === "indian" ? "Popular Indian Stations" : "Global Top Stations";

  }, [view, searchQuery, activeCategory]);

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden text-[#1A1A1A] flex-col lg:flex-row">

      {/* ── Mobile Top Header ── */}
      <header className="lg:hidden flex items-center justify-center px-4 py-6 bg-white border-b border-border/30 z-30 flex-shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
            <svg className="w-[18px] h-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <h1 className="font-heading text-xl font-bold text-text-primary tracking-tight">EasyRadio</h1>
        </div>
      </header>

      {/* ── Mobile Sidebar Drawer ── */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex"
          onClick={() => setSidebarOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          {/* Drawer */}
          <div
            className="relative w-72 h-full bg-white shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
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
              isMobile
            />
          </div>
        </div>
      )}

      {/* ── Desktop Left Sidebar ── */}
      <Sidebar
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        favoritesCount={favorites.length}
        onShowFavorites={handleShowFavorites}
        onShowHome={handleShowHome}
        currentView={view}
        onSearch={handleSearch}
        searchQuery={searchQuery}
      />

      {/* ── Main Content ── */}
      <main className="flex-1 min-w-0 bg-white overflow-y-auto pb-28 lg:pb-0 relative custom-scrollbar">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6 sm:py-8">

          {/* Sticky Search Bar Header */}
          <div className="sticky top-0 z-20 -mx-4 sm:-mx-8 px-4 sm:px-8 py-4 bg-white/80 backdrop-blur-md border-b border-border/10 mb-8 sm:mb-12">
            <div className="relative flex items-center group w-full max-w-4xl mx-auto">
              <div className="absolute left-5 sm:left-7 pointer-events-none text-accent/40 group-focus-within:text-accent group-focus-within:scale-110 transition-all duration-500">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search stations, genres..."
                className="w-full bg-surface-light/50 border border-border/40 rounded-2xl sm:rounded-full pl-14 sm:pl-18 pr-12 sm:pr-16 py-4 sm:py-5 text-base sm:text-xl font-semibold text-text-primary placeholder:text-text-dim/40 outline-none transition-all duration-500 hover:bg-white hover:border-accent/30 focus:bg-white focus:border-accent/50 focus:ring-8 focus:ring-accent/5 shadow-sm focus:shadow-xl"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearch("")}
                  className="absolute right-4 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center text-text-dim/40 hover:text-danger hover:bg-danger/5 transition-all duration-300 shadow-sm"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>


          {/* Hero Banner */}
          {view === "home" && !searchQuery && !activeCategory && (
            <div className="relative rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden mb-12 sm:mb-20 group cursor-pointer aspect-[16/10] sm:aspect-[21/9] shadow-2xl shadow-accent/10 border border-white/20">
              <img
                src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=2070"
                alt="Featured stations"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] group-hover:backdrop-blur-none transition-all duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              
              {/* Music Visualizer GIF */}
              <div className="absolute top-8 right-8 sm:top-12 sm:right-12 w-20 h-20 sm:w-32 sm:h-32 opacity-80 mix-blend-screen pointer-events-none group-hover:scale-110 transition-transform duration-700">
                <img 
                  src="https://i.pinimg.com/originals/a8/17/f2/a817f27f252c3e43c78181468b85b1e5.gif" 
                  alt="" 
                  className="w-full h-full object-contain filter hue-rotate-[240deg]" 
                />
              </div>

              <div className="relative h-full flex flex-col items-center justify-center text-center px-6 sm:px-12 gap-5 sm:gap-8">
                <div className="flex flex-col items-center gap-2 sm:gap-3">
                  <span className="text-[10px] sm:text-[13px] font-black text-accent-secondary uppercase tracking-[0.6em] drop-shadow-lg animate-fade-in-up">Live Now</span>
                  <div className="h-1 w-12 bg-accent rounded-full animate-pulse" />
                </div>
                
                <h2 className="font-heading text-4xl sm:text-7xl font-bold text-white tracking-tight leading-[1.1] drop-shadow-2xl max-w-4xl">
                  Listen to the <span className="text-accent-secondary">vibe</span> of India
                </h2>
                
                <p className="text-white/70 text-sm sm:text-lg max-w-xl font-medium leading-relaxed drop-shadow-md">
                  Discover thousands of live radio stations from every corner of the country.
                </p>

                <div className="pt-4 sm:pt-6">
                  <button
                    onClick={() => document.getElementById("station-grid")?.scrollIntoView({ behavior: 'smooth' })}
                    className="group/btn relative inline-flex items-center gap-3 bg-gradient-to-r from-accent to-accent-secondary text-white px-10 sm:px-16 py-4.5 sm:py-6 rounded-full text-base sm:text-xl font-black shadow-[0_20px_50px_rgba(79,70,229,0.4)] hover:shadow-[0_25px_60px_rgba(79,70,229,0.6)] hover:scale-105 active:scale-95 transition-all duration-500 animate-pulse-soft"
                  >
                    <span>Browse Stations</span>
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 transform group-hover/btn:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Region Toggle */}
          {view === "home" && !searchQuery && !activeCategory && (
            <div className="flex justify-center mb-10">
              <div className="inline-flex bg-surface-light p-1 rounded-2xl border border-border/40 shadow-sm">
                <button
                  onClick={() => setRegion("indian")}
                  className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${
                    region === "indian" 
                      ? "bg-white text-accent shadow-md scale-[1.02]" 
                      : "text-text-dim/60 hover:text-text-primary"
                  }`}
                >
                  Indian
                </button>
                <button
                  onClick={() => setRegion("global")}
                  className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${
                    region === "global" 
                      ? "bg-white text-accent shadow-md scale-[1.02]" 
                      : "text-text-dim/60 hover:text-text-primary"
                  }`}
                >
                  Global
                </button>
              </div>
            </div>
          )}



          {/* Section Header */}
          <div id="station-grid" className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
              {pageTitle}
            </h2>
            {!isFetching && !fetchError && (
              <span className="text-xs text-text-dim/50 font-medium">
                {displayedStations.length} stations
              </span>
            )}
          </div>

          {/* Error State */}
          {fetchError && (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-danger/5 rounded-2xl border border-danger/20 mb-6">
              <svg className="w-10 h-10 text-danger/40 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm font-bold text-danger/70 mb-1">Connection Error</p>
              <p className="text-xs text-text-muted mb-5">{fetchError}</p>
              <button
                onClick={fetchStations}
                className="px-6 py-2.5 bg-accent text-white rounded-full text-sm font-bold hover:bg-accent-dim transition-all shadow-sm"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Station Grid */}
          {!fetchError && (
            isFetching ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="h-[72px] bg-[#F8F9FA] rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : displayedStations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-14 h-14 rounded-full bg-[#F8F9FA] flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-text-dim/25" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-text-primary mb-1">No stations found</h3>
                <p className="text-sm text-text-muted mb-6">Try a different search or browse genres.</p>
                <button
                  onClick={handleShowHome}
                  className="px-6 py-2.5 bg-accent/10 text-accent rounded-full text-sm font-bold hover:bg-accent hover:text-white transition-all"
                >
                  Back to Home
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 pb-4">
                {displayedStations.map((station) => (
                  <StationCard
                    key={station.stationuuid}
                    station={station}
                    isPlaying={player.currentStation?.stationuuid === station.stationuuid && player.isPlaying}
                    isFavorite={isFavorite(station.stationuuid)}
                    onPlay={handlePlay}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            )
          )}

          {/* Recently Played */}
          {!isFetching && !fetchError && view === "home" && !searchQuery && !activeCategory && recents.length > 0 && (
            <div className="mt-10 pb-4">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="font-heading text-lg font-bold text-text-primary">Recently Played</h3>
                <div className="flex-1 h-px bg-border/40" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {recents.slice(0, 6).map((station) => (
                  <StationCard
                    key={`recent-${station.stationuuid}`}
                    station={station}
                    isPlaying={player.currentStation?.stationuuid === station.stationuuid && player.isPlaying}
                    isFavorite={isFavorite(station.stationuuid)}
                    onPlay={handlePlay}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Desktop Right Player ── */}
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
      />

      {/* ── Mobile Fullscreen Player (Smooth Transition) ── */}
      <div 
        className={`lg:hidden fixed inset-0 z-50 transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${
          mobilePlayerOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
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
        />
      </div>

      {/* ── Mobile Mini Player Bar ── */}
      {player.currentStation && !mobilePlayerOpen && (
        <div 
          className="lg:hidden fixed bottom-16 left-0 right-0 z-40 animate-fade-in-up"
          style={{ animationDuration: '0.4s' }}
        >
          <div
            className="bg-white/95 backdrop-blur-xl border-t border-border/30 px-4 py-2.5 flex items-center gap-3 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] cursor-pointer"
            onClick={() => setMobilePlayerOpen(true)}
          >
            <div className="w-10 h-10 rounded-lg overflow-hidden shadow-md flex-shrink-0 relative">
              <img
                src={player.currentStation.favicon || `https://ui-avatars.com/api/?name=${encodeURIComponent(player.currentStation.name)}&background=4F46E5&color=fff&size=128`}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(player.currentStation!.name)}&background=4F46E5&color=fff&size=128`; }}
              />
              {player.isPlaying && (
                <div className="absolute inset-0 bg-accent/20 flex items-center justify-center">
                   <div className="flex gap-[2px] h-3 items-end">
                      {[0.4, 0.9, 0.5, 1].map((h, i) => (
                        <div key={i} className="w-[2px] bg-white rounded-full animate-[waveform_0.6s_ease-in-out_infinite_alternate]" style={{ height: `${h*100}%`, animationDelay: `${i*0.1}s` }} />
                      ))}
                   </div>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-text-primary truncate uppercase tracking-tight">{player.currentStation.name}</p>
              <p className="text-[10px] font-bold text-accent truncate uppercase tracking-widest">{player.isPlaying ? "Live Now" : "Paused"}</p>
            </div>
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={player.togglePlayPause}
                className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center shadow-lg shadow-accent/20"
              >
                {player.isPlaying
                  ? <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                  : <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Bottom Nav ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-border/40 flex items-center h-16">
        <button
          onClick={handleShowHome}
          className={`flex-1 flex flex-col items-center gap-0.5 transition-colors ${view === "home" ? "text-accent" : "text-text-dim/50"}`}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[9px] font-bold uppercase tracking-wide">Home</span>
        </button>
        <button
          onClick={handleShowFavorites}
          className={`flex-1 flex flex-col items-center gap-0.5 transition-colors ${view === "favorites" ? "text-accent" : "text-text-dim/50"}`}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span className="text-[9px] font-bold uppercase tracking-wide">Saved</span>
        </button>
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex-1 flex flex-col items-center gap-0.5 text-text-dim/50"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="text-[9px] font-bold uppercase tracking-wide">Menu</span>
        </button>
      </nav>
    </div>
  );
}

