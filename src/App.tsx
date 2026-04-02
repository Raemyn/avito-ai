import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdsListPage from './components/ads/AdsListPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/ads" element={<AdsListPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;