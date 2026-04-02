import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/ads" element={<div>Список объявлений</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;