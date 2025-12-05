export type Region = "taiwan" | "indonesia" | "japan" | "norway" | "finland" | "america";

export interface Fish {
  id: string;
  name: string;
  region: Region;
  rarity: "common" | "uncommon" | "rare" | "legendary";
  image: string; // URL or imported asset
}