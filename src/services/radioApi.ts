const BASE_URL = "https://de1.api.radio-browser.info/json";

export interface Station {
  stationuuid: string;
  name: string;
  url: string;
  url_resolved: string;
  homepage: string;
  favicon: string;
  tags: string;
  country: string;
  state: string;
  language: string;
  languagecodes: string;
  codec: string;
  bitrate: number;
  votes: number;
  clickcount: number;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function fetchIndianStations(): Promise<Station[]> {
  return fetchJson<Station[]>(`${BASE_URL}/stations/bycountry/India`);
}

export async function searchStations(query: string): Promise<Station[]> {
  return fetchJson<Station[]>(
    `${BASE_URL}/stations/search?name=${encodeURIComponent(query)}&limit=60`
  );
}

export async function searchIndianStations(query: string): Promise<Station[]> {
  return fetchJson<Station[]>(
    `${BASE_URL}/stations/search?name=${encodeURIComponent(query)}&countrycode=IN&limit=60`
  );
}

export async function fetchStationsByTag(tag: string): Promise<Station[]> {
  return fetchJson<Station[]>(
    `${BASE_URL}/stations/bytag/${encodeURIComponent(tag)}?limit=60`
  );
}

export async function fetchIndianStationsByTag(tag: string): Promise<Station[]> {
  return fetchJson<Station[]>(
    `${BASE_URL}/stations/search?tag=${encodeURIComponent(tag)}&countrycode=IN&limit=60`
  );
}

export async function fetchStationsByLanguage(language: string): Promise<Station[]> {
  return fetchJson<Station[]>(
    `${BASE_URL}/stations/bylanguage/${encodeURIComponent(language)}?limit=60`
  );
}
