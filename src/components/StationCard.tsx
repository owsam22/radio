import type { Station } from "../services/radioApi";

interface StationCardProps {
  station: Station;
  isPlaying: boolean;
  isFavorite: boolean;
  onPlay: (station: Station) => void;
  onToggleFavorite: (station: Station) => void;
}

export default function StationCard({
  station,
  isPlaying,
  isFavorite,
  onPlay,
  onToggleFavorite,
}: StationCardProps) {
  return (
    <div 
      onClick={() => onPlay(station)}
      className={`group flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 cursor-pointer border border-transparent ${
        isPlaying 
          ? "bg-accent/5 border-accent/10 shadow-sm" 
          : "hover:bg-surface-light hover:shadow-md hover:border-border/40"
      }`}
    >
      {/* Icon / Cover Art Area */}
      <div className="relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden shadow-sm">
        <img 
          src={station.favicon || `https://ui-avatars.com/api/?name=${encodeURIComponent(station.name)}&background=random&color=fff&size=128`}
          alt=""
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
             (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(station.name)}&background=8B5E3C&color=fff&size=128`;
          }}
        />
        {isPlaying && (
          <div className="absolute inset-0 bg-accent/40 backdrop-blur-[2px] flex items-center justify-center">
            <div className="flex gap-1">
              <span className="w-1 h-3 bg-white rounded-full animate-[bounce_0.8s_infinite]" />
              <span className="w-1 h-4 bg-white rounded-full animate-[bounce_1s_infinite]" />
              <span className="w-1 h-2 bg-white rounded-full animate-[bounce_0.6s_infinite]" />
            </div>
          </div>
        )}
      </div>

      {/* Info Area */}
      <div className="flex-1 min-w-0">
        <h3 className={`font-bold text-sm truncate transition-colors duration-300 ${isPlaying ? "text-accent" : "text-text-primary"}`}>
          {station.name}
        </h3>
        <p className="text-[11px] text-text-dim/60 truncate uppercase tracking-wider font-medium mt-0.5">
          {station.country || "GLOBAL"} • {station.bitrate > 0 ? `${station.bitrate}K` : "HD"}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(station);
          }}
          className={`p-2 rounded-full transition-all ${
            isFavorite ? "text-danger" : "text-text-dim hover:text-accent hover:bg-white"
          }`}
        >
          <svg className={`h-4 w-4 ${isFavorite ? "fill-current" : "fill-none"}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
