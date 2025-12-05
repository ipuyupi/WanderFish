import { Routes, Route, Navigate } from "react-router-dom";
import FishPage from "./pages/FishPage";
import CollectionPage from "./pages/CollectionPage";
import MissingPage from "./pages/MissingPage";
import RegionsPage from "./pages/RegionsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/fish" replace />} />
      <Route path="/fish" element={<FishPage />} />
      <Route path="/collection" element={<CollectionPage />} />
      <Route path="/missing" element={<MissingPage />} />
      <Route path="/regions" element={<RegionsPage />} />
    </Routes>
  );
}