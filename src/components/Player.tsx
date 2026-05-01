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
}: PlayerProps) {
  const isEmpty = !currentStation;
  const avatarUrl = (name: string) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4F46E5&color=fff&size=512`;

  const content = (
    <div className={`flex flex-col h-full ${mobileFullscreen ? "p-6 pt-4" : "p-7"}`}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-7">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isPlaying ? "bg-green-400 animate-pulse" : "bg-text-dim/20"}`} />
          <span className="text-[10px] font-bold text-text-dim/50 uppercase tracking-[0.25em]">
            {isEmpty ? "No station" : isPlaying ? "Live Now" : "Paused"}
          </span>
        </div>
        {!isEmpty && (
          <button
            onClick={onStop}
            className="w-8 h-8 rounded-full bg-border/30 flex items-center justify-center text-text-dim/50 hover:text-danger hover:bg-danger/10 transition-all"
            title="Stop"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* ── Cover Art ── */}
      <div className={`relative w-full aspect-square rounded-3xl overflow-hidden mb-7 flex-shrink-0 ${
        isEmpty ? "bg-[#F0F2F8]" : "shadow-2xl shadow-accent/15"
      }`}>
        {isEmpty ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#F0F2F8] to-[#E8EBF5]">
            <div className="w-16 h-16 rounded-2xl bg-white/60 flex items-center justify-center shadow-sm">
              <svg className="w-8 h-8 text-accent/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <p className="text-[11px] font-semibold text-text-dim/40 uppercase tracking-widest">Select a station</p>
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            {/* Station name on art */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-white font-heading text-sm font-bold leading-tight line-clamp-2 drop-shadow">
                {currentStation.name}
              </p>
            </div>
          </>
        )}
        {/* Loading spinner */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center">
            <div className="w-10 h-10 border-[3px] border-white/25 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* ── Station Info ── */}
      <div className="text-center mb-7 flex-shrink-0">
        {isEmpty ? (
          <p className="text-sm text-text-dim/30">Browse stations and pick one to start</p>
        ) : (
          <>
            <div className="flex items-center justify-center gap-2 flex-wrap mb-1.5">
              <span className="text-[10px] font-bold bg-accent/10 text-accent px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {currentStation.country || "Global"}
              </span>
              {currentStation.language && (
                <span className="text-[10px] font-bold bg-border/60 text-text-dim px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {currentStation.language}
                </span>
              )}
              {(currentStation.bitrate ?? 0) > 0 && (
                <span className="text-[10px] font-bold bg-border/60 text-text-dim px-2.5 py-0.5 rounded-full tracking-wider">
                  {currentStation.bitrate}kbps
                </span>
              )}
            </div>
            {/* Waveform animation when playing */}
            {isPlaying && (
              <div className="flex items-end justify-center gap-[3px] h-5 mt-3">
                {[0.4, 0.8, 0.5, 1, 0.6, 0.9, 0.4].map((h, i) => (
                  <div
                    key={i}
                    className="w-[3px] bg-accent rounded-full"
                    style={{
                      height: `${h * 100}%`,
                      animation: `waveform 0.8s ease-in-out infinite alternate`,
                      animationDelay: `${i * 0.11}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Controls ── */}
      <div className="flex items-center justify-center gap-5 mb-8 flex-shrink-0">
        {/* Favorite */}
        <button
          onClick={isEmpty ? undefined : onToggleFavorite}
          disabled={isEmpty}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${
            isEmpty ? "text-text-dim/15 cursor-not-allowed bg-transparent"
            : isFavorite ? "bg-red-50 text-red-500 shadow-sm"
            : "bg-white border border-border/60 text-text-dim hover:text-red-500 hover:border-red-200 shadow-sm"
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Play / Pause */}
        <button
          onClick={isEmpty ? undefined : onTogglePlayPause}
          disabled={isEmpty}
          aria-label={isPlaying ? "Pause" : "Play"}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
            isEmpty ? "bg-[#F0F2F8] text-text-dim/20 cursor-not-allowed"
            : isPlaying ? "bg-accent text-white shadow-lg shadow-accent/30 hover:scale-105 active:scale-95"
            : "bg-white border-2 border-accent/30 text-accent shadow-lg hover:bg-accent hover:text-white hover:scale-105 active:scale-95"
          }`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-current/25 border-t-current rounded-full animate-spin" />
          ) : isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
          ) : (
            <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          )}
        </button>

        {/* Mute */}
        <button
          onClick={() => onVolumeChange(volume > 0 ? 0 : 0.8)}
          disabled={isEmpty}
          title={volume === 0 ? "Unmute" : "Mute"}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 bg-white border border-border/60 shadow-sm ${
            isEmpty ? "text-text-dim/15 cursor-not-allowed"
            : volume === 0 ? "text-accent border-accent/30"
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072M12 6v12M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>
      </div>

      {/* ── Volume Slider ── */}
      <div className="mb-8 flex-shrink-0">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[10px] font-semibold text-text-dim/40 uppercase tracking-wider">Volume</span>
          <span className="text-[11px] font-bold text-accent">{Math.round(volume * 100)}%</span>
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
        <div className="flex flex-wrap gap-1.5 mb-6">
          {currentStation.tags.split(',').slice(0, 4).filter(Boolean).map((tag, i) => (
            <span key={i} className="text-[9px] font-bold uppercase tracking-wider text-text-dim/50 bg-white border border-border/50 rounded-full px-2.5 py-1">
              {tag.trim()}
            </span>
          ))}
        </div>
      )}

      {/* ── Footer ── */}
      <div className="mt-auto pt-5 border-t border-border/30 text-center">
        <p className="text-[9px] text-text-dim/25 uppercase tracking-widest font-bold">EasyRadio · 2026</p>
      </div>
    </div>
  );

  if (mobileFullscreen) {
    return <div className="flex flex-col h-full overflow-y-auto">{content}</div>;
  }

  return (
    <aside className="hidden xl:flex flex-col w-[22rem] flex-shrink-0 bg-white h-full border-l border-border/30 overflow-y-auto">
      {content}
    </aside>
  );
}
