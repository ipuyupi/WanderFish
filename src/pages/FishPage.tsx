import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import { fishList } from "../data/fish";
import type { Fish, Region } from "../../types";
import { addCaught, loadRegion, saveRegion } from "../../storage";

type Phase = "idle" | "casting" | "waiting" | "hook" | "caught" | "escaped";

const regions: { id: Region; name: string; blurb: string }[] = [
  { id: "taiwan", name: "Taiwan", blurb: "Warm currents and reef friends." },
  { id: "indonesia", name: "Indonesia", blurb: "Tropical reefs, bright colors." },
  { id: "japan", name: "Japan", blurb: "Temperate waters, coastal gems." },
  { id: "norway", name: "Norway", blurb: "Cold fjords with hearty fish." },
  { id: "finland", name: "Finland", blurb: "Lakes and northern rivers." },
  { id: "america", name: "America", blurb: "From coasts to great lakes." },
];

// Scenery mapping for each region
const regionScenery: Record<Region, string> = {
  taiwan: "/regions/taiwan.jpg",
  indonesia: "/regions/indonesia.jpg",
  japan: "/regions/japan.jpg",
  norway: "/regions/norway.jpg",
  finland: "/regions/finland.jpg",
  america: "/regions/america.jpg",
};

export default function FishPage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [escapeTimer, setEscapeTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [countdown, setCountdown] = useState<number>(3);
  const [currentFish, setCurrentFish] = useState<Fish | null>(null);
  const [region, setRegion] = useState<Region | null>(null);

  useEffect(() => {
    setRegion(loadRegion());
  }, []);

  // Handle countdown timer when fish is on hook
  useEffect(() => {
    if (phase === "hook") {
      setCountdown(3);
      // Start countdown interval
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Start escape timer (3 seconds)
      const escape = setTimeout(() => {
        if (timer) clearTimeout(timer);
        setTimer(null);
        setPhase("escaped");
        clearInterval(countdownInterval);
      }, 3000);

      setEscapeTimer(escape);

      return () => {
        clearInterval(countdownInterval);
        clearTimeout(escape);
      };
    } else {
      setCountdown(3);
    }
  }, [phase]);

    // Auto-reset to idle after showing escaped message
    useEffect(() => {
      if (phase === "escaped") {
        const resetTimer = setTimeout(() => {
          resetToIdle();
        }, 3000); // Show message for 2 seconds, then reset
  
        return () => clearTimeout(resetTimer);
      }
    }, [phase]);

  const pool = useMemo(() => {
    if (!region) return fishList;
    return fishList.filter((f) => f.region === region);
  }, [region]);

  function chooseRegion(selectedRegion: Region) {
    setRegion(selectedRegion);
    saveRegion(selectedRegion);
  }

  function cast() {
    if (phase !== "idle") return;
    setCurrentFish(null);
    setPhase("casting");
    // After casting animation (800ms), move to waiting
    setTimeout(() => {
      setPhase("waiting");
      const delay = 1000 + Math.random() * 4000;
      const t = setTimeout(() => setPhase("hook"), delay);
      setTimer(t);
    }, 800);
  }

  function reel() {
    if (phase !== "hook") return;
    // Clear escape timer if user reels in time
    if (escapeTimer) {
      clearTimeout(escapeTimer);
      setEscapeTimer(null);
    }
    const fish = pool[Math.floor(Math.random() * pool.length)];
    setCurrentFish(fish);
    addCaught(fish);
    setPhase("caught");
  }

  function closeCaught() {
    if (timer) clearTimeout(timer);
    if (escapeTimer) clearTimeout(escapeTimer);
    setTimer(null);
    setEscapeTimer(null);
    setPhase("idle");
    setCurrentFish(null);
    setCountdown(3);
  }

  function resetToIdle() {
    if (timer) clearTimeout(timer);
    if (escapeTimer) clearTimeout(escapeTimer);
    setTimer(null);
    setEscapeTimer(null);
    setPhase("idle");
    setCurrentFish(null);
    setCountdown(3);
  }

  function handleAction() {
    if (phase === "idle") {
      cast();
    } else if (phase === "hook") {
      reel();
    }
  }

  return (
    <Layout>
      <section
        className={`rounded-3xl p-8 shadow-sm border ${
          region
            ? "relative min-h-[600px] bg-cover bg-center bg-no-repeat flex flex-col"
            : "bg-white/70 border-slate-100"
        }`}
        style={
          region
            ? {
                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.2)), url(${regionScenery[region]})`,
              }
            : undefined
        }
        onClick={phase === "caught" ? closeCaught : undefined}
      >
        {/* Current Region Badge - Show at top left when region is selected */}
        {region && (
          <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md">
            <span className="text-xs text-sky-700 font-medium">Current region:</span>
            <span className="text-xs text-sky-800 font-bold capitalize px-2 py-0.5 bg-sky-100 rounded-full">
              {region}
            </span>
          </div>
        )}

        {/* Hero Title Section - Only show when NO region is selected */}
        {!region && (
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-blue-500 to-cyan-500 mb-4 tracking-tight">
              Go Fish!
            </h1>
            <p className="text-lg md:text-xl text-slate-700 font-medium max-w-2xl mx-auto leading-relaxed">
              Cast your line, wait for a bite, then reel in.{" "}
              <span className="text-sky-600 font-semibold">Please choose a region</span> to get started!
            </p>
          </div>
        )}

        {/* Show Region Selection when no region is selected */}
        {!region ? (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Choose Your Fishing Region</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {regions.map((r) => (
                <button
                  key={r.id}
                  onClick={() => chooseRegion(r.id)}
                  className="p-5 rounded-2xl text-left bg-gradient-to-br from-white to-sky-50 border-2 border-sky-200 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 hover:scale-105 active:scale-95"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xl font-bold text-sky-800">{r.name}</div>
                    <span className="text-2xl">🌊</span>
                  </div>
                  <div className="text-slate-600 text-sm">{r.blurb}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Status Area - Centered */}
            <div className="flex-1 flex items-center justify-center mt-6">
              {phase === "idle" && (
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-black blink-text shine-text">Ready to cast!</p>
                </div>
              )}
              {phase === "casting" && <CastingAnimation />}
              {phase === "waiting" && <StatusCard title="Waiting..." body="Hold on, the fish are nibbling." pulse />}
              {phase === "hook" && (
                <StatusCard
                  title="Fish on the hook!"
                  body={`Reel in ${countdown} second${countdown !== 1 ? "s" : ""} or it will escape!`}
                  highlight
                />
              )}
              {phase === "escaped" && (
                <StatusCard
                  title="Fish ran away!"
                  body="The fish escaped. Try casting again!"
                  highlight
                />
              )}
              {phase === "caught" && currentFish && (
                <div className="px-6 py-4 rounded-xl border text-center max-w-md bg-amber-50 border-amber-200 text-amber-800">
                  <div className="text-base font-bold mb-3">You caught: {currentFish.name}</div>
                  <div className="mb-3">
                    <img src={currentFish.image} alt={currentFish.name} className="w-full rounded-xl shadow-md" />
                  </div>
                  <p className="text-xs text-amber-700">Press anywhere to close</p>
                </div>
              )}
            </div>

            {/* Single Toggle Button - Bottom Center */}
            <div className="flex justify-center mt-auto pt-6">
              <button
                onClick={handleAction}
                disabled={phase !== "idle" && phase !== "hook"}
                className={`px-8 py-4 rounded-2xl text-white font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 ${
                  phase === "hook"
                    ? "bg-gradient-to-r from-emerald-600 to-green-600"
                    : "bg-gradient-to-r from-sky-600 to-blue-600"
                }`}
              >
                {phase === "hook" ? "⚡ Reel!" : "🎣 Cast"}
              </button>
            </div>
          </>
        )}
      </section>
    </Layout>
  );
}

function CastingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative w-64 h-48 flex items-end justify-center">
        {/* Fishing pole */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 origin-bottom fishing-pole">
          <svg width="8" height="120" className="fishing-rod">
            <rect width="8" height="120" fill="#8B4513" rx="2" />
          </svg>
        </div>
        {/* Fishing line */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 fishing-line">
          <svg width="2" height="100" className="line">
            <line x1="1" y1="0" x2="1" y2="100" stroke="#666" strokeWidth="2" />
          </svg>
        </div>
        {/* Hook/bait */}
        <div className="absolute fishing-hook">
          <svg width="12" height="12" viewBox="0 0 12 12">
            <circle cx="6" cy="6" r="4" fill="#FFD700" />
          </svg>
        </div>
      </div>
      <StatusCard title="Casting..." body="Your line is flying through the air!" />
    </div>
  );
}

function StatusCard({
  title,
  body,
  pulse,
  highlight,
}: {
  title: string;
  body: string;
  pulse?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={`px-6 py-3 rounded-xl border text-center max-w-xs ${
        highlight ? "bg-amber-50 border-amber-200 text-amber-800" : "bg-slate-50 border-slate-200"
      } ${pulse ? "animate-pulse" : ""}`}
    >
      <div className="text-base font-bold">{title}</div>
      <div className="text-sm text-slate-600 mt-1">{body}</div>
    </div>
  );
}