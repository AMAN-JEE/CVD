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
        <Route path="/stage-1" element={<Stage1 />} />
        <Route path="/stage-2" element={<Stage2 />} />
        <Route path="/stage-3" element={<Stage3 />} />
      </Routes>
    </Router>
  );
}

export default App;
