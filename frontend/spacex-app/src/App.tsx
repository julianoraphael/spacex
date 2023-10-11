import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SpaceXPage from './components/SpaceXPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SpaceXPage />} />
        {/* Outras rotas */}
      </Routes>
    </Router>
  );
}

export default App;
