import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import LandingPage from './components/landingpage.jsx'
import Login from './components/login.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/signup.jsx'
import Home from './components/pages/home.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PetDetail from './components/pages/PetDetail.jsx';
import Chat from './components/pages/Chat.jsx';
import PostPet from './components/pages/PostPet.jsx';
import MyPets from './components/pages/MyPets.jsx';
import Profile from './components/pages/profile.jsx';
import Dashboard from './components/pages/dashboard.jsx';
import PetListing from './components/pages/petlisting.jsx';
import Request from './components/pages/request.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/pet/:id" element={
            <ProtectedRoute>
              <PetDetail />
            </ProtectedRoute>
          } />
          <Route path="/post-pet" element={
            <ProtectedRoute adminOnly={true}>
              <PostPet />
            </ProtectedRoute>
          } />
          <Route path="/my-pets" element={
            <ProtectedRoute adminOnly={true}>
              <MyPets />
            </ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          } />
          <Route path="/chat/:userId" element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/pets" element={
            <ProtectedRoute>
              <PetListing />
            </ProtectedRoute>
          } />
          <Route path="/requests" element={
            <ProtectedRoute>
              <Request />
            </ProtectedRoute>
          } />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Router>
    </AuthProvider>
  );
}

export default App;