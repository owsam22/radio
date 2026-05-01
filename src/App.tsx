import { useEffect, useCallback, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import StationCard from "./components/StationCard";
import Player from "./components/Player";
import { usePlayer } from "./hooks/usePlayer";
import { useFavorites, useRecentlyPlayed } from "./hooks/useFavorites";
import {
  fetchIndianStations,
  searchIndianStations,
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

  const player = usePlayer();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { recents, addRecent } = useRecentlyPlayed();

  // Fetch stations based on context
  const fetchStations = useCallback(async () => {
    setIsFetching(true);
    setFetchError(null);

    try {
      let results: Station[];

      if (searchQuery.trim()) {
        results = await searchIndianStations(searchQuery.trim());
      } else if (activeCategory) {
        results = await fetchIndianStationsByTag(activeCategory);
      } else {
        results = await fetchIndianStations();
      }

      // Dedupe by uuid
      const seen = new Set<string>();
      const unique = results.filter((s) => {
        if (seen.has(s.stationuuid)) return false;
        seen.add(s.stationuuid);
        return true;
      });

      setStations(unique);
    } catch {
      setFetchError("Failed to load stations. Please try again.");
      setStations([]);
    } finally {
      setIsFetching(false);
    }
  }, [searchQuery, activeCategory]);

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setActiveCategory("");
    }
  }, []);

  const handleSelectCategory = useCallback((tag: string) => {
    setActiveCategory((prev) => (prev === tag ? "" : tag));
    setSearchQuery("");
    setView("home");
  }, []);

  const handleShowFavorites = useCallback(() => {
    setView("favorites");
    setActiveCategory("");
    setSearchQuery("");
  }, []);

  const handleShowHome = useCallback(() => {
    setView("home");
    setActiveCategory("");
    setSearchQuery("");
  }, []);

  const handlePlay = useCallback(
    (station: Station) => {
      player.playStation(station);
      addRecent(station);
    },
    [player, addRecent]
  );

  // Determine displayed stations
  const displayedStations = useMemo(() => {
    if (view === "favorites") return favorites;
    return stations;
  }, [view, favorites, stations]);

  // Page title
  const pageTitle = useMemo(() => {
    if (view === "favorites") return "Your Favorites";
    if (searchQuery) return `Search: "${searchQuery}"`;
    if (activeCategory) return activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1);
    return "Popular Indian Stations";
  }, [view, searchQuery, activeCategory]);

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden text-[#1A1A1A] flex-col lg:flex-row">
      {/* Mobile Top Header */}
      <div className="lg:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-border/40 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
            <span className="font-heading text-bg text-sm font-bold">S</span>
          </div>
          <h1 className="font-heading text-lg font-bold text-text-primary tracking-tight">Swar Luxe</h1>
        </div>
        <button onClick={handleShowFavorites} className="p-2 rounded-full hover:bg-surface-light text-text-dim relative">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
           {favorites.length > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-accent border-2 border-white rounded-full" />}
        </button>
      </div>

      {/* Left Sidebar (Desktop) */}
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

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-white shadow-[0_0_40px_rgba(0,0,0,0.03)] z-10 relative overflow-y-auto custom-scrollbar pb-32 lg:pb-0">
        <div className="max-w-5xl mx-auto w-full px-6 sm:px-8 py-6 sm:py-10">
          {/* Mobile Search Bar (desktop search is in sidebar) */}
          <div className="lg:hidden mb-6">
            <div className="relative flex items-center group">
              <svg className="absolute left-3.5 w-4 h-4 text-text-dim/50 group-focus-within:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search stations..."
                className="w-full bg-surface-light border border-border/50 rounded-xl pl-10 pr-9 py-3 text-sm text-text-primary placeholder:text-text-dim/40 outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/10 transition-all"
              />
              {searchQuery && (
                <button onClick={() => handleSearch('')} className="absolute right-3 text-text-dim/50 hover:text-danger transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
          </div>

          {/* Hero Section */}
          {view === "home" && !searchQuery && !activeCategory && (
            <div className="relative rounded-3xl sm:rounded-[2.5rem] overflow-hidden mb-8 sm:mb-12 group cursor-pointer aspect-[16/9] sm:aspect-[21/9]">
               <img 
                 src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=2070" 
                 alt="Featured" 
                 className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
               />
               <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
               <div className="relative h-full flex flex-col justify-center px-8 sm:px-12 space-y-2 sm:space-y-4">
                  <span className="text-[9px] sm:text-[10px] font-bold text-accent-secondary uppercase tracking-[0.4em]">Featured Collection</span>
                  <h2 className="font-heading text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">Browse top Indian stations</h2>
                  <div className="flex items-center gap-4 sm:gap-6 pt-2 sm:pt-4">
                    <button 
                      onClick={() => document.getElementById('station-grid')?.scrollIntoView({ behavior: 'smooth' })}
                      className="bg-accent text-bg px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-bold shadow-lg hover:bg-accent-dim transition-all"
                    >
                      View Stations
                    </button>
                    <p className="hidden sm:block text-white/60 text-xs italic">Curated by our broadcast experts</p>
                  </div>
               </div>
            </div>
          )}

          {/* Header Title */}
          <div id="station-grid" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              {pageTitle}
            </h2>
            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
               <button className="whitespace-nowrap px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold bg-surface-light text-text-muted hover:bg-accent/10 hover:text-accent transition-all">Featured</button>
               <button className="whitespace-nowrap px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold bg-surface-light text-text-muted hover:bg-accent/10 hover:text-accent transition-all">Top Click</button>
               <button className="whitespace-nowrap px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold bg-surface-light text-text-muted hover:bg-accent/10 hover:text-accent transition-all">Highest Voted</button>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="mt-4 sm:mt-8">
            {isFetching ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="h-20 bg-surface-light rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : displayedStations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 sm:py-32 text-center">
                <div className="w-16 h-16 rounded-full bg-surface-light flex items-center justify-center mb-6 text-text-dim/20">
                   <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-text-primary">No signal detected</h3>
                <p className="text-sm text-text-muted mt-2 mb-8">Try adjusting your search or browse categories.</p>
                <button 
                  onClick={handleShowHome}
                  className="px-8 py-3 bg-accent/10 text-accent rounded-full text-sm font-bold hover:bg-accent hover:text-bg transition-all"
                >
                  Return to Home
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-4 pb-12 sm:pb-20">
                {displayedStations.map((station) => (
                  <div key={station.stationuuid}>
                    <StationCard
                      station={station}
                      isPlaying={player.currentStation?.stationuuid === station.stationuuid && player.isPlaying}
                      isFavorite={isFavorite(station.stationuuid)}
                      onPlay={handlePlay}
                      onToggleFavorite={toggleFavorite}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Right Sidebar - Now Playing (Desktop) */}
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

      {/* Mobile Mini Player */}
      {player.currentStation && (
        <div className="lg:hidden fixed bottom-16 left-0 right-0 z-40 px-4 pb-4">
          <div className="bg-white/95 backdrop-blur-xl border border-border/40 rounded-2xl p-3 shadow-2xl flex items-center gap-4 animate-fade-in-up">
            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
               <img 
                 src={player.currentStation.favicon || `https://ui-avatars.com/api/?name=${encodeURIComponent(player.currentStation.name)}&background=random&color=fff&size=128`}
                 alt=""
                 className="w-full h-full object-cover"
               />
            </div>
            <div className="flex-1 min-w-0">
               <h4 className="text-xs font-bold text-text-primary truncate">{player.currentStation.name}</h4>
               <p className="text-[10px] text-text-dim/60 truncate uppercase tracking-widest">{player.currentStation.country || "Global"}</p>
            </div>
            <div className="flex items-center gap-2">
               <button 
                 onClick={player.togglePlayPause}
                 className="w-10 h-10 rounded-full bg-accent/5 text-accent flex items-center justify-center"
               >
                  {player.isPlaying ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                  ) : (
                    <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  )}
               </button>
               <button 
                 onClick={player.stop}
                 className="w-10 h-10 rounded-full hover:bg-danger/5 text-text-dim hover:text-danger flex items-center justify-center transition-colors"
               >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-border/40 flex items-center justify-around py-2 h-16">
        <button
          onClick={handleShowHome}
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${view === "home" ? "text-accent" : "text-text-dim"}`}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          <span className="text-[9px] font-bold uppercase">Home</span>
        </button>
        <button
          onClick={handleShowFavorites}
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${view === "favorites" ? "text-accent" : "text-text-dim"}`}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          <span className="text-[9px] font-bold uppercase">Saved</span>
        </button>
      </nav>
    </div>
  );
}
