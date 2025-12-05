import Layout from "../components/Layout";
import { fishList } from "../data/fish";
import { loadCaught } from "../../storage";
import { FishCard } from "../components/FishCard";
import { useEffect, useState } from "react";

export default function CollectionPage() {
  const [caughtIds, setCaughtIds] = useState<string[]>([]);
  useEffect(() => setCaughtIds(loadCaught()), []);

  const caughtFish = fishList.filter((f) => caughtIds.includes(f.id));

  return (
    <Layout>
      <h1 className="text-3xl font-black text-sky-800 mb-4">Caught Fish</h1>
      <p className="text-slate-600 mb-6">Your growing collection from all adventures.</p>
      <div className="grid gap-4">
        {caughtFish.length === 0 && <div className="text-slate-500">No fish yet. Cast away!</div>}
        {caughtFish.map((fish) => (
          <FishCard key={fish.id} fish={fish} caught />
        ))}
      </div>
    </Layout>
  );
}