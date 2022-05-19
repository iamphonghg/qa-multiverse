import React from 'react';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes
} from 'react-router-dom';
import WebLayout from './WebLayout';

export default function AppFrame() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WebLayout />} />
      </Routes>
    </Router>
  );
}
