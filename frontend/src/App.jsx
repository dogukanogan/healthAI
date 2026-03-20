import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Registration from './pages/Registration';
import PeopleList from './pages/PeopleList';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <div className="nav-brand">Person Manager</div>
          <div className="nav-links">
            <Link to="/" className="nav-link">Register</Link>
            <Link to="/people" className="nav-link">People List</Link>
          </div>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Registration />} />
            <Route path="/people" element={<PeopleList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
