import type { Station } from "../services/radioApi";

interface StationCardProps {
  station: Station;
  isPlaying: boolean;
  isFavorite: boolean;
  onPlay: (station: Station) => void;
  onToggleFavorite: (station: Station) => void;
}

export default function StationCard({ station, isPlaying, isFavorite, onPlay, onToggleFavorite }: StationCardProps) {
  const genre = station.tags.split(',')[0] || 'Radio';

  return (
    <div 
      className={`station-card ${isPlaying ? "playing" : ""}`}
      onClick={() => onPlay(station)}
    >
      <div 
        className="station-thumb"
        style={{ 
          background: `linear-gradient(135deg, var(--bg3), var(--bg4))`,
          color: 'var(--txt2)'
        }}
      >
        <img
          src={station.favicon || `https://ui-avatars.com/api/?name=${encodeURIComponent(station.name)}&background=1A1A1A&color=fff&size=128`}
          alt=""
          className="w-full h-full object-cover rounded-[11px]"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(station.name)}&background=1A1A1A&color=fff&size=128`;
          }}
        />
      </div>
      
      <div className="station-info">
        <div className="station-name">{station.name}</div>
        <div className="station-meta">
          <span className="station-genre">{genre}</span>
          <span className="station-freq-badge">{(station.bitrate ?? 0) > 0 ? `${station.bitrate}K` : "FM"}</span>
        </div>
      </div>

      <div className="station-right">
        <button 
          className={`card-fav-btn ${isFavorite ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(station);
          }}
        >
          <svg viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        {isPlaying ? (
          <div className="eq-bars">
            <div className="eq-bar"></div>
            <div className="eq-bar"></div>
            <div className="eq-bar"></div>
            <div className="eq-bar"></div>
          </div>
        ) : (
          <div className="live-indicator">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20v-8m-4 8v-4m8 4v-6" />
            </svg>
            LIVE
          </div>
        )}
      </div>
    </div>
  );
}
