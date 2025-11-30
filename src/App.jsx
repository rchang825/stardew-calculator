import React from 'react';
import { Routes, Route, useLocation, useNavigate, } from 'react-router-dom';
import Nav from './components/Nav';
import Home from './pages/Home';
import QuantityNeededCalculator from './pages/QuantityNeededCalculator';
import CropProfitsCalculator from './pages/CropProfitsCalculator';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const getView = () => {
    if (location.pathname === '/quantity-needed') return 'quantity-needed';
    return 'home';
  };
  const view = getView();
  return (
    <div>
      <h1>Stardew Calculator</h1>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quantity-needed" element={<QuantityNeededCalculator />} />
        <Route path="/crop-profits" element={<CropProfitsCalculator />} />
      </Routes>
    </div>
  );
}

export default App;