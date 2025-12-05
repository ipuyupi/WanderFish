import type { Fish, Region } from "./types";

const CAUGHT_KEY = "wanderfish:caught";
const REGION_KEY = "wanderfish:region";

export function loadCaught(): string[] {
  const raw = localStorage.getItem(CAUGHT_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveCaught(ids: string[]) {
  localStorage.setItem(CAUGHT_KEY, JSON.stringify(ids));
}

export function loadRegion(): Region | null {
  const raw = localStorage.getItem(REGION_KEY);
  return raw ? (raw as Region) : null;
}

export function saveRegion(region: Region) {
  localStorage.setItem(REGION_KEY, region);
}

export function addCaught(fish: Fish) {
  const current = new Set(loadCaught());
  current.add(fish.id);
  saveCaught([...current]);
}