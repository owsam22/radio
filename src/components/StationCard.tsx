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
