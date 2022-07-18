import React from 'react';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes
} from 'react-router-dom';
import Homepage from '../pages/Homepage';
import WebLayout from './WebLayout';
import FullPageSpinner from '../pages/FullPageSpinner';
import { useAuth } from '../contexts/AuthContext';
import LogIn from '../pages/LogIn';
import SignUp from '../pages/SignUp';
import CreatePost from '../pages/CreatePost';
import DetailPost from '../pages/DetailPost';

export default function AppFrame() {
  const { authenticated, initializing } = useAuth();

  return initializing ? (
    <FullPageSpinner />
  ) : (
    <Router>
      <Routes>
        <Route path="/" element={<WebLayout />}>
          <Route index element={<Homepage />} />
          <Route
            path="/login"
            element={
              authenticated ? <Navigate to="/" replace /> : <LogIn />
            }
          />
          <Route
            path="/register"
            element={
              authenticated ? <Navigate to="/" replace /> : <SignUp />
            }
          />
          <Route
            path="/create"
            element={
              !authenticated ? (
                <Navigate to="/login" replace />
              ) : (
                <CreatePost />
              )
            }
          />
          <Route path="/posts/:id" element={<DetailPost />} />
        </Route>
      </Routes>
    </Router>
  );
}
