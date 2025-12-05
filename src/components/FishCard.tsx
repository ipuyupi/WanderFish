import type{ Fish } from "../../types";
import clsx from "classnames";

const rarityColors: Record<Fish["rarity"], string> = {
  common: "bg-emerald-100 text-emerald-700",
  uncommon: "bg-lime-100 text-lime-700",
  rare: "bg-sky-100 text-sky-700",
  legendary: "bg-amber-100 text-amber-700",
};

export function FishCard({ fish, caught }: { fish: Fish; caught?: boolean }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3 flex gap-3 items-center">
      <div className="w-20 h-20 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden">
        <img src={fish.image} alt={fish.name} className="w-full h-full object-contain" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <div className="text-lg font-bold text-slate-800">{fish.name}</div>
          <span className={clsx("px-2 py-1 rounded-full text-xs font-semibold", rarityColors[fish.rarity])}>
            {fish.rarity}
          </span>
        </div>
        <div className="text-sm text-slate-500 capitalize">Region: {fish.region}</div>
        {caught !== undefined && (
          <div className={clsx("text-xs mt-1 font-semibold", caught ? "text-emerald-600" : "text-rose-500")}>
            {caught ? "Caught" : "Not caught yet"}
          </div>
        )}
      </div>
    </div>
  );
}