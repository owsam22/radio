import type { Station } from "../services/radioApi";

interface PlayerProps {
  currentStation: Station | null;
  isPlaying: boolean;
  volume: number;
  isLoading: boolean;
  hasError: boolean;
  onVolumeChange: (v: number) => void;
  onTogglePlayPause: () => void;
  onStop: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function Player({
  currentStation,
  isPlaying,
  volume,
  isLoading,
  onVolumeChange,
  onTogglePlayPause,
  onStop,
  isFavorite,
  onToggleFavorite,
}: PlayerProps) {
  const isEmpty = !currentStation;

  return (
    <aside className="hidden xl:flex flex-col w-80 flex-shrink-0 bg-[#F8F9FA] h-full border-l border-border/40 overflow-y-auto">
      <div className="flex flex-col h-full p-8">

        {/* Top Row: Label + Stop */}
        <div className="flex items-center justify-between mb-8">
          <span className="text-[9px] font-bold text-text-dim/50 uppercase tracking-[0.3em]">Now Playing</span>
          {!isEmpty && (
            <button
              onClick={onStop}
              className="w-8 h-8 rounded-full bg-white border border-border/50 flex items-center justify-center text-text-dim/60 hover:text-danger hover:border-danger/40 hover:bg-danger/5 transition-all shadow-sm"
              title="Stop & disconnect"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Cover Art */}
        <div className="relative w-full aspect-square rounded-[1.75rem] overflow-hidden shadow-2xl mb-7 group bg-surface-light">
          {isEmpty ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3">
              <svg className="w-16 h-16 text-text-dim/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <p className="text-[10px] font-bold text-text-dim/25 uppercase tracking-widest">Select a station</p>
            </div>
          ) : (
            <>
              <img
                src={currentStation.favicon || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentStation.name)}&background=8B5E3C&color=fff&size=512`}
                alt={currentStation.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentStation.name)}&background=8B5E3C&color=fff&size=512`;
                }}
              />
              {/* Animated Live Badge */}
              <div className="absolute top-4 left-4">
                <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? "bg-green-400 animate-pulse" : "bg-white/40"}`} />
                  <span className="text-[9px] font-bold text-white uppercase tracking-widest">{isPlaying ? "Live" : "Paused"}</span>
                </div>
              </div>
            </>
          )}
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center">
              <div className="w-10 h-10 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Station Info */}
        <div className="text-center mb-7 min-h-[4rem] flex flex-col items-center justify-center">
          {isEmpty ? (
            <p className="text-sm text-text-dim/30 font-medium">No station selected</p>
          ) : (
            <>
              <h3 className="font-heading text-xl font-bold text-text-primary tracking-tight leading-tight line-clamp-2 mb-1.5">
                {currentStation.name}
              </h3>
              <div className="flex items-center gap-2 text-[11px] text-text-dim/60 font-bold uppercase tracking-widest">
                <span>{currentStation.country || "Global"}</span>
                {currentStation.language && (
                  <>
                    <span className="text-text-dim/20">•</span>
                    <span>{currentStation.language}</span>
                  </>
                )}
                {(currentStation.bitrate ?? 0) > 0 && (
                  <>
                    <span className="text-text-dim/20">•</span>
                    <span>{currentStation.bitrate}k</span>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Main Playback Controls */}
        <div className="flex items-center justify-center gap-6 mb-8">
          {/* Favorite Button */}
          <button
            onClick={isEmpty ? undefined : onToggleFavorite}
            disabled={isEmpty}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
              isEmpty
                ? "text-text-dim/15 cursor-not-allowed"
                : isFavorite
                  ? "bg-danger/10 text-danger border border-danger/20"
                  : "bg-white border border-border/50 text-text-dim hover:text-danger hover:border-danger/30 hover:bg-danger/5 shadow-sm"
            }`}
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill={isFavorite ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          {/* Play / Pause Button */}
          <button
            onClick={isEmpty ? undefined : onTogglePlayPause}
            disabled={isEmpty}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
              isEmpty
                ? "bg-surface-light text-text-dim/15 cursor-not-allowed"
                : isPlaying
                  ? "bg-accent text-white shadow-accent/30 hover:scale-105"
                  : "bg-white text-accent border-2 border-accent/30 hover:bg-accent hover:text-white hover:scale-105"
            }`}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-current/30 border-t-current rounded-full animate-spin" />
            ) : isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
            ) : (
              <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            )}
          </button>

          {/* Volume Mute Toggle */}
          <button
            onClick={() => onVolumeChange(volume > 0 ? 0 : 0.8)}
            disabled={isEmpty}
            title={volume === 0 ? "Unmute" : "Mute"}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 bg-white border border-border/50 shadow-sm ${
              isEmpty
                ? "text-text-dim/15 cursor-not-allowed"
                : "text-text-dim hover:text-accent hover:border-accent/30"
            }`}
          >
            {volume === 0 ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072M12 6v12m0 0l-3.536-3.536M12 18l3.536-3.536M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>
        </div>

        {/* Volume Slider */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-text-dim/40">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
            </div>
            <span className="text-[10px] font-bold text-accent">{Math.round(volume * 100)}%</span>
            <div className="flex items-center gap-1.5 text-text-dim/40">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-full accent-accent cursor-pointer"
            disabled={isEmpty}
            aria-label="Volume"
          />
        </div>

        {/* Tags / Info strip */}
        {!isEmpty && currentStation.tags && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-1.5">
              {currentStation.tags.split(',').slice(0, 4).filter(Boolean).map((tag, i) => (
                <span key={i} className="text-[9px] font-bold uppercase tracking-wider text-text-dim/50 bg-white border border-border/40 rounded-full px-2.5 py-1">
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-6 border-t border-border/40 text-center">
          <p className="text-[9px] text-text-dim/25 uppercase tracking-widest font-bold">Swar Luxe Radio · 2026</p>
        </div>
      </div>
    </aside>
  );
}
