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
  mobileFullscreen?: boolean;
  onCollapse?: () => void;
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
  mobileFullscreen = false,
  onCollapse,
}: PlayerProps) {
  const isEmpty = !currentStation;
  const avatarUrl = (name: string) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4F46E5&color=fff&size=512`;

  const content = (
    <div className={`flex flex-col h-full ${mobileFullscreen ? "p-6 pt-4" : "p-8"}`}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8">
        {mobileFullscreen && onCollapse ? (
          <button
            onClick={onCollapse}
            className="w-10 h-10 rounded-full bg-surface-light flex items-center justify-center text-text-primary hover:bg-accent/10 hover:text-accent transition-all"
            title="Minimize"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <span className={`w-2 h-2 rounded-full ${isPlaying ? "bg-accent animate-pulse" : "bg-text-dim/20"}`} />
            <span className="text-[10px] font-bold text-text-dim/60 uppercase tracking-[0.2em]">
              {isEmpty ? "Offline" : isPlaying ? "Live Now" : "Standby"}
            </span>
          </div>
        )}

        {!isEmpty && (
          <button
            onClick={onStop}
            className="w-10 h-10 rounded-xl bg-surface-light flex items-center justify-center text-text-dim/50 hover:text-danger hover:bg-danger/5 transition-all border border-border/40"
            title="Stop Playback"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* ── Cover Art ── */}
      <div className={`relative w-full aspect-square rounded-[2rem] overflow-hidden mb-9 flex-shrink-0 transition-all duration-500 ${
        isEmpty ? "bg-[#F3F4F6] border-2 border-dashed border-border/60" : "shadow-2xl border border-border/40"
      }`}>
        {isEmpty ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4">
            <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center shadow-md">
              <svg className="w-10 h-10 text-accent/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <p className="text-[10px] font-bold text-text-dim/40 uppercase tracking-[0.1em]">Pick a station</p>
          </div>
        ) : (
          <>
            <img
              src={currentStation.favicon || avatarUrl(currentStation.name)}
              alt={currentStation.name}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = avatarUrl(currentStation.name); }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            {/* Station name on art */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <p className="text-white text-[10px] font-bold uppercase tracking-widest opacity-90">Broadcasting</p>
              </div>
              <p className="text-white font-heading text-xl font-bold leading-tight line-clamp-2">
                {currentStation.name}
              </p>
            </div>
          </>
        )}
        {/* Loading spinner */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
            <div className="w-12 h-12 border-[3px] border-accent/20 border-t-accent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* ── Station Info ── */}
      <div className="text-center mb-8 flex-shrink-0">
        {isEmpty ? (
          <p className="text-xs text-text-muted/60 leading-relaxed max-w-[200px] mx-auto">Explore thousands of live Indian radio stations instantly.</p>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2.5 flex-wrap">
              <span className="text-[10px] font-bold bg-accent/5 text-accent px-3 py-1 rounded-lg uppercase tracking-wider border border-accent/10">
                {currentStation.country || "Global"}
              </span>
              {currentStation.language && (
                <span className="text-[10px] font-bold bg-surface-light text-text-muted px-3 py-1 rounded-lg uppercase tracking-wider border border-border/40">
                  {currentStation.language}
                </span>
              )}
              {(currentStation.bitrate ?? 0) > 0 && (
                <span className="text-[10px] font-semibold bg-surface-light text-text-dim px-3 py-1 rounded-lg tracking-wider border border-border/40">
                  {currentStation.bitrate} kbps
                </span>
              )}
            </div>
            {/* Waveform animation when playing */}
            {isPlaying && (
              <div className="flex items-end justify-center gap-[3px] h-5 mt-4">
                {[0.4, 0.8, 0.5, 1, 0.6, 0.9, 0.4, 0.7].map((h, i) => (
                  <div
                    key={i}
                    className="w-[2.5px] bg-accent rounded-full"
                    style={{
                      height: `${h * 100}%`,
                      animation: `waveform 0.8s ease-in-out infinite alternate`,
                      animationDelay: `${i * 0.08}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Controls ── */}
      <div className="flex items-center justify-center gap-6 mb-10 flex-shrink-0">
        {/* Favorite */}
        <button
          onClick={isEmpty ? undefined : onToggleFavorite}
          disabled={isEmpty}
          title={isFavorite ? "Remove from Library" : "Save to Library"}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 border ${
            isEmpty ? "text-text-dim/10 border-transparent cursor-not-allowed"
            : isFavorite ? "bg-danger/10 text-danger border-danger/20 shadow-md"
            : "bg-white border-border/40 text-text-muted hover:text-accent hover:border-accent/40 shadow-sm"
          }`}
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Play / Pause */}
        <button
          onClick={isEmpty ? undefined : onTogglePlayPause}
          disabled={isEmpty}
          aria-label={isPlaying ? "Pause" : "Play"}
          className={`w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all duration-500 ${
            isEmpty ? "bg-surface-light text-text-dim/20 cursor-not-allowed border border-border/30"
            : isPlaying 
              ? "bg-accent text-white shadow-xl shadow-accent/20 hover:scale-105 active:scale-95" 
              : "bg-white border-2 border-accent/40 text-accent shadow-lg hover:bg-accent hover:text-white hover:scale-105 active:scale-95"
          }`}
        >
          {isLoading ? (
            <div className="w-7 h-7 border-[3px] border-current/25 border-t-current rounded-full animate-spin" />
          ) : isPlaying ? (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
          ) : (
            <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          )}
        </button>

        {/* Mute */}
        <button
          onClick={() => onVolumeChange(volume > 0 ? 0 : 0.8)}
          disabled={isEmpty}
          title={volume === 0 ? "Unmute" : "Mute"}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 bg-white border border-border/40 shadow-sm ${
            isEmpty ? "text-text-dim/10 cursor-not-allowed"
            : volume === 0 ? "text-accent border-accent/40 bg-accent/5"
            : "text-text-muted hover:text-accent hover:border-accent/40"
          }`}
        >
          {volume === 0 ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.536 8.464a5 5 0 010 7.072M12 6v12M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>
      </div>

      {/* ── Volume Slider ── */}
      <div className="mb-10 flex-shrink-0 px-2">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold text-text-dim/50 uppercase tracking-[0.1em]">Volume</span>
          <span className="text-[11px] font-bold text-accent tabular-nums tracking-wider">{Math.round(volume * 100)}%</span>
        </div>
        <input
          type="range" min="0" max="1" step="0.01"
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="w-full accent-accent cursor-pointer"
          disabled={isEmpty}
          aria-label="Volume"
        />
      </div>

      {/* ── Tags ── */}
      {!isEmpty && currentStation.tags && (
        <div className="flex flex-wrap gap-2 mb-8">
          {currentStation.tags.split(',').slice(0, 4).filter(Boolean).map((tag, i) => (
            <span key={i} className="text-[9px] font-bold uppercase tracking-widest text-text-dim/50 bg-surface-light border border-border/40 rounded-full px-3 py-1.5 transition-colors hover:text-accent hover:border-accent/20">
              #{tag.trim()}
            </span>
          ))}
        </div>
      )}

      {/* ── Footer ── */}
      <div className="mt-auto pt-6 border-t border-border/30 text-center">
        <p className="text-[9px] text-text-dim/40 uppercase tracking-[0.2em] font-bold italic mb-1">Live Indian Network</p>
        <p className="text-[8px] text-text-dim/20 uppercase tracking-[0.1em] font-bold">Standard Stream · Radio Browser API</p>
      </div>
    </div>
  );

  if (mobileFullscreen) {
    return <div className="flex flex-col h-full overflow-y-auto bg-white">{content}</div>;
  }

  return (
    <aside className="hidden xl:flex flex-col w-[22rem] flex-shrink-0 bg-white h-full border-l border-border/40 overflow-y-auto shadow-sm z-10">
      {content}
    </aside>
  );
}

