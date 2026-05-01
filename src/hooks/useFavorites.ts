import { useState, useCallback, useEffect } from "react";
import type { Station } from "../services/radioApi";

const FAVORITES_KEY = "swar-favorites";
const RECENTS_KEY = "swar-recently-played";
const MAX_RECENTS = 10;

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Station[]>(() =>
    loadFromStorage<Station[]>(FAVORITES_KEY, [])
  );

  useEffect(() => {
    saveToStorage(FAVORITES_KEY, favorites);
  }, [favorites]);

  const isFavorite = useCallback(
    (stationuuid: string) => favorites.some((s) => s.stationuuid === stationuuid),
    [favorites]
  );

  const addFavorite = useCallback((station: Station) => {
    setFavorites((prev) => {
      if (prev.some((s) => s.stationuuid === station.stationuuid)) return prev;
      return [station, ...prev];
    });
  }, []);

  const removeFavorite = useCallback((stationuuid: string) => {
    setFavorites((prev) => prev.filter((s) => s.stationuuid !== stationuuid));
  }, []);

  const toggleFavorite = useCallback(
    (station: Station) => {
      if (isFavorite(station.stationuuid)) {
        removeFavorite(station.stationuuid);
      } else {
        addFavorite(station);
      }
    },
    [isFavorite, addFavorite, removeFavorite]
  );

  return { favorites, isFavorite, addFavorite, removeFavorite, toggleFavorite };
}

export function useRecentlyPlayed() {
  const [recents, setRecents] = useState<Station[]>(() =>
    loadFromStorage<Station[]>(RECENTS_KEY, [])
  );

  useEffect(() => {
    saveToStorage(RECENTS_KEY, recents);
  }, [recents]);

  const addRecent = useCallback((station: Station) => {
    setRecents((prev) => {
      const filtered = prev.filter((s) => s.stationuuid !== station.stationuuid);
      return [station, ...filtered].slice(0, MAX_RECENTS);
    });
  }, []);

  return { recents, addRecent };
}
