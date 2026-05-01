import { useState, useRef, useCallback, useEffect } from "react";
import type { Station } from "../services/radioApi";

export function usePlayer() {
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.75);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "none";
    audio.volume = volume;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
      audio.load();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update volume on audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const playStation = useCallback(
    (station: Station) => {
      const audio = audioRef.current;
      if (!audio) return;

      // If same station, just toggle play/pause
      if (currentStation?.stationuuid === station.stationuuid) {
        if (isPlaying) {
          audio.pause();
          setIsPlaying(false);
        } else {
          audio.play().catch(() => setHasError(true));
          setIsPlaying(true);
        }
        return;
      }

      // New station
      setHasError(false);
      setIsLoading(true);
      setIsPlaying(false);

      const streamUrl = station.url_resolved || station.url;
      audio.src = streamUrl;
      audio.load();

      const onCanPlay = () => {
        setIsLoading(false);
        setIsPlaying(true);
        setHasError(false);
        audio.play().catch(() => {
          setHasError(true);
          setIsPlaying(false);
          setIsLoading(false);
        });
        audio.removeEventListener("canplay", onCanPlay);
      };

      const onError = () => {
        setIsLoading(false);
        setIsPlaying(false);
        setHasError(true);
        audio.removeEventListener("canplay", onCanPlay);
        audio.removeEventListener("error", onError);
      };

      audio.addEventListener("canplay", onCanPlay);
      audio.addEventListener("error", onError);

      setCurrentStation(station);
    },
    [currentStation, isPlaying]
  );

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentStation) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      setHasError(false);
      audio.play().then(() => {
        setIsPlaying(true);
        setIsLoading(false);
      }).catch(() => {
        setHasError(true);
        setIsLoading(false);
      });
    }
  }, [currentStation, isPlaying]);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.src = "";
    setIsPlaying(false);
    setIsLoading(false);
    setHasError(false);
    setCurrentStation(null);
  }, []);

  return {
    currentStation,
    isPlaying,
    volume,
    isLoading,
    hasError,
    setVolume,
    playStation,
    togglePlayPause,
    stop,
  };
}
