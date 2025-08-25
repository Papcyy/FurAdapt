import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import logo from '../assets/logo1.png';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState('user');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirm) {
      toast.error('Passwords do not match!');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long!');
      return;
    }

    const result = await register({ name, email, password, role });
    
    if (result.success) {
      toast.success('Registration successful!');
      navigate('/home');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e3f0ff] via-[#f8fafc] to-[#fff7e6]">
      <div className="bg-white/95 px-8 py-12 rounded-3xl shadow-2xl w-full max-w-md border border-[#e0e7ef] relative">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="FurAdapt Logo" className="w-20 h-20 rounded-full shadow-lg border-4 border-[#4e8cff] bg-white -mt-16 mb-2" />
          <h2 className="text-[#4e8cff] text-3xl font-extrabold text-center drop-shadow-sm">Sign Up for FurAdopt</h2>
          <p className="text-[#2563eb] text-sm mt-1 mb-2 opacity-80">Create your account to start adopting!</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[#4e8cff] font-semibold mb-1" htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              className="w-full px-4 py-2 rounded-lg border border-[#e0e7ef] focus:outline-none focus:ring-2 focus:ring-[#4e8cff] bg-[#f8fafc] placeholder-[#b6c7e3] transition"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              autoFocus
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block text-[#4e8cff] font-semibold mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 rounded-lg border border-[#e0e7ef] focus:outline-none focus:ring-2 focus:ring-[#4e8cff] bg-[#f8fafc] placeholder-[#b6c7e3] transition"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label className="block text-[#4e8cff] font-semibold mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2 rounded-lg border border-[#e0e7ef] focus:outline-none focus:ring-2 focus:ring-[#4e8cff] bg-[#f8fafc] placeholder-[#b6c7e3] transition"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Create a password"
            />
          </div>
          <div>
            <label className="block text-[#4e8cff] font-semibold mb-1" htmlFor="confirm">Confirm Password</label>
            <input
              id="confirm"
              type="password"
              className="w-full px-4 py-2 rounded-lg border border-[#e0e7ef] focus:outline-none focus:ring-2 focus:ring-[#4e8cff] bg-[#f8fafc] placeholder-[#b6c7e3] transition"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              placeholder="Repeat your password"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-[#4e8cff] font-semibold mb-1" htmlFor="role">Account Type</label>
            <select
              id="role"
              className="w-full px-4 py-2 rounded-lg border border-[#e0e7ef] focus:outline-none focus:ring-2 focus:ring-[#4e8cff] bg-[#f8fafc] transition"
              value={role}
              onChange={e => setRole(e.target.value)}
              disabled={loading}
            >
              <option value="user">Pet Adopter</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#ffb84e] to-[#ff9800] hover:from-[#ff9800] hover:to-[#ffb84e] text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg transition-all duration-200 transform hover:scale-105 tracking-wide disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating Account...
              </div>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>
        <div className="mt-6 flex flex-col items-center gap-2">
          <p className="text-[#4e8cff] text-sm">
            Already have an account?{' '}
            <Link to="/login" className="font-bold underline hover:text-[#ff9800] transition">Login</Link>
          </p>
          <Link to="/" className="text-[#4e8cff] font-semibold underline hover:text-[#ff9800] transition text-sm">
            &larr; Back to Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;