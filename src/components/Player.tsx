import { useState } from "react";
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
  onNext?: () => void;
  onPrevious?: () => void;
}

export default function Player({
  currentStation,
  isPlaying,
  volume,
  isLoading,
  onVolumeChange,
  onTogglePlayPause,
  isFavorite,
  onToggleFavorite,
  mobileFullscreen = false,
  onCollapse,
  onNext,
  onPrevious,
}: PlayerProps) {
  const [isCopied, setIsCopied] = useState(false);
  
  const handleShare = async () => {
    if (!currentStation) return;
    const url = `${window.location.origin}${window.location.pathname}?station=${currentStation.stationuuid}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Listen to ${currentStation.name}`,
          text: `Check out this radio station: ${currentStation.name}`,
          url: url,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  };

  const isEmpty = !currentStation;
  const genre = currentStation?.tags.split(',')[0] || 'Radio';

  const content = (
    <>
      <div className="player-header">
        <span className="player-title-label">Now Playing</span>
        {!isEmpty && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="fav-btn" 
              onClick={handleShare}
              title="Share station"
            >
              {isCopied ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
              )}
            </button>
            <button 
              className={`fav-btn ${isFavorite ? "active" : ""}`} 
              onClick={onToggleFavorite}
              title="Add to favourites"
            >
              <svg viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="art-wrap">
        <div className="art-inner">
          <div className={`vinyl-outer ${!isPlaying ? "paused" : ""}`} id="vinyl">
            <div className="vinyl-center">
              <div className="vinyl-hole"></div>
            </div>
          </div>
        </div>
        {isPlaying && (
          <div className="waveform">
            <div className="wv"></div>
            <div className="wv"></div>
            <div className="wv"></div>
            <div className="wv"></div>
            <div className="wv"></div>
            <div className="wv"></div>
            <div className="wv"></div>
          </div>
        )}
      </div>

      <div className="now-info">
        <div className="now-name" id="nowName">{currentStation?.name || "No Station Selected"}</div>
        <div className="now-sub" id="nowSub">{isEmpty ? "Select a station to play" : `${currentStation.country || "Global"} · ${genre}`}</div>
        {!isEmpty && (
          <div className="now-lang-badge" id="nowLang">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            {currentStation.language || "Unknown"} · {genre}
          </div>
        )}
      </div>

      <div className="progress-section">
        <div className="progress-bar-wrap">
          <div className="progress-fill" style={{ width: isPlaying ? "100%" : "0%", transition: 'width 2s ease' }}></div>
          <div className="progress-thumb" style={{ left: isPlaying ? "100%" : "0%", transition: 'left 2s ease' }}></div>
        </div>
        <div className="time-row">
          <span>{isPlaying ? "LIVE" : "00:00"}</span>
          <span>{isPlaying ? "◉ ON AIR" : "OFFLINE"}</span>
        </div>
      </div>

      <div className="controls">
        <button className="ctrl" title="Previous" onClick={onPrevious}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="19 20 9 12 19 4 19 20" /><line x1="5" y1="19" x2="5" y2="5" />
          </svg>
        </button>
        <button 
          className={`ctrl play-ctrl`} 
          onClick={onTogglePlayPause}
          disabled={isEmpty || isLoading}
        >
          {isLoading ? (
             <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : isPlaying ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </button>
        <button className="ctrl" title="Next" onClick={onNext}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 4 15 12 5 20 5 4" /><line x1="19" y1="5" x2="19" y2="19" />
          </svg>
        </button>
      </div>

      <div className="volume-row">
        <div className="vol-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        </div>
        <div className="vol-track" onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          onVolumeChange(Math.max(0, Math.min(1, x / rect.width)));
        }}>
          <div className="vol-fill" style={{ width: `${volume * 100}%` }}></div>
        </div>
      </div>

      <div className="player-divider"></div>

      <div className="queue-label">Recently Played</div>
      {/* Example queue items could be added here if needed */}
    </>
  );

  if (mobileFullscreen) {
    return (
      <div className="mobile-player-fullscreen" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px' }}>
        <button onClick={onCollapse} className="ctrl" style={{ alignSelf: 'flex-start', marginBottom: '20px' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {content}
      </div>
    );
  }

  return (
    <div className="player-panel">
      {content}
    </div>
  );
}
