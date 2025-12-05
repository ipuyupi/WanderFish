import Layout from "../components/Layout";
import { fishList } from "../data/fish";
import { loadCaught } from "../../storage";
import { FishCard } from "../components/FishCard";
import { useEffect, useState } from "react";

export default function MissingPage() {
  const [caughtIds, setCaughtIds] = useState<string[]>([]);
  useEffect(() => setCaughtIds(loadCaught()), []);

  const missing = fishList.filter((f) => !caughtIds.includes(f.id));

  return (
    <Layout>
      <h1 className="text-3xl font-black text-sky-800 mb-4">Missing Fish</h1>
      <p className="text-slate-600 mb-6">Keep exploring regions to complete your Poké— uh, fishdex.</p>
      <div className="grid gap-4">
        {missing.length === 0 && <div className="text-emerald-600 font-semibold">You caught them all!</div>}
        {missing.map((fish) => (
          <FishCard key={fish.id} fish={fish} caught={false} />
        ))}
      </div>
    </Layout>
  );
}