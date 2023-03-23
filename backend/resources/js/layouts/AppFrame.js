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
import { useUserAuth } from '../contexts/UserAuthContext';
import LogIn from '../pages/LogIn';
import SignUp from '../pages/SignUp';
import CreatePost from '../pages/CreatePost';
import DetailPost from '../pages/DetailPost';
import ManagePosts from '../pages/ManagePosts';
import ProfilePage from '../pages/ProfilePage';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import AdminLogIn from '../pages/AdminLogIn';
import Users from '../pages/Users';
import HomeDashboard from '../pages/HomeDashboard';
import DashboardLayout from './DashboardLayout';
import Posts from '../pages/Posts';
import Reports from '../pages/Reports';
import Notifications from '../pages/Notifications';

export default function AppFrame() {
  const {
    authenticated: userAuthenticated,
    initializing: userInitializing
  } = useUserAuth();

  const {
    authenticated: adminAuthenticated,
    initializing: adminInitializing
  } = useAdminAuth();

  return userInitializing || adminInitializing ? (
    <FullPageSpinner />
  ) : (
    <Router>
      <Routes>
        <Route path="/" element={<WebLayout />}>
          <Route index element={<Homepage />} />
          <Route
            path="/login"
            element={
              userAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <LogIn />
              )
            }
          />
          <Route
            path="/register"
            element={
              userAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <SignUp />
              )
            }
          />
          <Route
            path="/create"
            element={
              !userAuthenticated ? (
                <Navigate to="/login" replace />
              ) : (
                <CreatePost />
              )
            }
          />
          <Route
            path="manage-posts"
            element={
              userAuthenticated ? (
                <ManagePosts />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/posts/:verse/:id" element={<DetailPost />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
        </Route>

        <Route
          path="/admin/login"
          element={
            adminAuthenticated ? (
              <Navigate to="/admin" replace />
            ) : (
              <AdminLogIn />
            )
          }
        />
        <Route
          path="/admin"
          element={
            adminAuthenticated ? (
              <DashboardLayout />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        >
          <Route
            index
            element={
              !adminAuthenticated ? (
                <Navigate to="/admin/login" replace />
              ) : (
                <HomeDashboard />
              )
            }
          />

          <Route
            path="users"
            element={
              !adminAuthenticated ? (
                <Navigate to="/admin/login" replace />
              ) : (
                <Users />
              )
            }
          />
          <Route
            path="posts"
            element={
              !adminAuthenticated ? (
                <Navigate to="/admin/login" replace />
              ) : (
                <Posts />
              )
            }
          />
          <Route
            path="reports"
            element={
              !adminAuthenticated ? (
                <Navigate to="/admin/login" replace />
              ) : (
                <Reports />
              )
            }
          />
          <Route
            path="notifications"
            element={
              !adminAuthenticated ? (
                <Navigate to="/admin/login" replace />
              ) : (
                <Notifications />
              )
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}
