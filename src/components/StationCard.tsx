import type { Station } from "../services/radioApi";

interface StationCardProps {
  station: Station;
  isPlaying: boolean;
  isFavorite: boolean;
  onPlay: (station: Station) => void;
  onToggleFavorite: (station: Station) => void;
}

export default function StationCard({ station, isPlaying, isFavorite, onPlay, onToggleFavorite }: StationCardProps) {
  return (
    <div 
      className="group bg-white border border-border/40 rounded-2xl p-3 flex items-center gap-4 hover:border-accent/40 hover:shadow-card transition-all duration-300"
      onClick={() => onPlay(station)}
    >
      {/* Favicon / Placeholder */}
      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#F3F4F6] flex-shrink-0 relative shadow-sm border border-border/30">
        <img
          src={station.favicon || `https://ui-avatars.com/api/?name=${encodeURIComponent(station.name)}&background=4F46E5&color=fff&size=128`}
          alt=""
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(station.name)}&background=4F46E5&color=fff&size=128`;
          }}
        />
        {isPlaying && (
          <div className="absolute inset-0 bg-accent/20 flex items-center justify-center backdrop-blur-[1px]">
             <div className="flex gap-[2px] h-3 items-end">
                {[0.4, 0.9, 0.5, 1].map((h, i) => (
                  <div key={i} className="w-[2px] bg-white rounded-full animate-[waveform_0.6s_ease-in-out_infinite_alternate]" style={{ height: `${h*100}%`, animationDelay: `${i*0.1}s` }} />
                ))}
             </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-text-primary truncate uppercase tracking-tight group-hover:text-accent transition-colors">
          {station.name}
        </h3>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? "bg-accent animate-pulse" : "bg-text-dim/30"}`} />
          <p className="text-[10px] font-bold text-text-dim truncate uppercase tracking-widest">
            {station.tags.split(',')[0] || 'Radio'} • {station.country}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(station);
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isFavorite ? "text-danger bg-danger/10" : "text-text-dim hover:text-danger hover:bg-danger/5"
          }`}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <svg className={`w-4.5 h-4.5 ${isFavorite ? "fill-current" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        <button
          className={`w-8 h-8 rounded-full flex items-center justify-center bg-accent text-white shadow-lg shadow-accent/20 transition-transform active:scale-90`}
        >
          <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
