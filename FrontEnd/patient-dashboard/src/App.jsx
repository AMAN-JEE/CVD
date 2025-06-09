import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Stage1 from './components/Stage1.jsx';
import Stage2 from './components/Stage2.jsx';
import Stage3 from './components/Stage3.jsx';
import './css/Stage1.css'; // css for stage-1 code
import './css/Stage2.css'; // css for stage-2 code
import './css/Stage3.css'; // css for stage-3 code

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Stage1 />} />
        <Route path="/patient/info" element={<Stage1 />} />
        <Route path="/sensor/data" element={<Stage2 />} />
        <Route path="/patient/predict" element={<Stage3 />} />
      </Routes>
    </Router>
  );
}

export default App;
