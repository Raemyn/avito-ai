import { Routes, Route, Navigate } from "react-router-dom";
import AdsListPage from "./components/list/AdsListPage";
import AdViewPage from "./components/card/AdViewPage";
import AdEditPage from "./components/edit/AdEditPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/ads" />} />
      <Route path="/ads" element={<AdsListPage />} />
      <Route path="/ads/:id" element={<AdViewPage />} />
      <Route path="/ads/:id/edit" element={<AdEditPage />} />
    </Routes>
  );
}

export default App;