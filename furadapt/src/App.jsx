import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import LandingPage from './components/landingpage.jsx'
import Login from './components/login.jsx' // <-- Import Login
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/signup.jsx' // <-- Import Signup
import Home from './components/pages/home.jsx'; // <-- Import Home

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} /> {/* Add this line */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} /> {/* Add this line */}
      </Routes>
    </Router>
  );
}

export default App;