import Layout from "../components/Layout";
import type { Region } from "../../types";
import { loadRegion, saveRegion } from "../../storage";
import { useEffect, useState } from "react";
import clsx from "classnames";

const regions: { id: Region; name: string; blurb: string }[] = [
  { id: "taiwan", name: "Taiwan", blurb: "Warm currents and reef friends." },
  { id: "indonesia", name: "Indonesia", blurb: "Tropical reefs, bright colors." },
  { id: "japan", name: "Japan", blurb: "Temperate waters, coastal gems." },
  { id: "norway", name: "Norway", blurb: "Cold fjords with hearty fish." },
  { id: "finland", name: "Finland", blurb: "Lakes and northern rivers." },
  { id: "america", name: "America", blurb: "From coasts to great lakes." },
];

export default function RegionsPage() {
  const [active, setActive] = useState<Region | null>(null);
  useEffect(() => setActive(loadRegion()), []);

  function choose(region: Region) {
    setActive(region);
    saveRegion(region);
  }

  return (
    <Layout>
      <h1 className="text-3xl font-black text-sky-800 mb-4">Choose Region</h1>
      <p className="text-slate-600 mb-6">Pick your fishing spot. This narrows the fish pool on the Fish page.</p>
      <div className="grid md:grid-cols-2 gap-4">
        {regions.map((r) => (
          <button
            key={r.id}
            onClick={() => choose(r.id)}
            className={clsx(
              "p-4 rounded-2xl text-left bg-white border shadow-sm transition hover:-translate-y-0.5",
              active === r.id ? "border-sky-400 shadow-sky-100 ring-2 ring-sky-100" : "border-slate-100"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold text-sky-800">{r.name}</div>
              {active === r.id && <span className="text-xs px-2 py-1 rounded-full bg-sky-100 text-sky-700">Active</span>}
            </div>
            <div className="text-slate-600 text-sm mt-1">{r.blurb}</div>
          </button>
        ))}
      </div>
    
    </Layout>
  );
}