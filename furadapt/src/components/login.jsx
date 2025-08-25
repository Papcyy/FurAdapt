import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import logo from '../assets/logo1.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/home';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await login({ email, password });
    
    if (result.success) {
      toast.success('Login successful!');
      navigate(from, { replace: true });
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e3f0ff] via-[#f8fafc] to-[#fff7e6]">
      <div className="bg-white/95 px-8 py-12 rounded-3xl shadow-2xl w-full max-w-md border border-[#e0e7ef] relative">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="FurAdapt Logo" className="w-20 h-20 rounded-full shadow-lg border-4 border-[#4e8cff] bg-white -mt-16 mb-2" />
          <h2 className="text-[#4e8cff] text-3xl font-extrabold text-center drop-shadow-sm">Login to FurAdapt</h2>
          <p className="text-[#2563eb] text-sm mt-1 mb-2 opacity-80">Welcome back! Please sign in to continue.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[#4e8cff] font-semibold mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 rounded-lg border border-[#e0e7ef] focus:outline-none focus:ring-2 focus:ring-[#4e8cff] bg-[#f8fafc] placeholder-[#b6c7e3] transition"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
              placeholder="you@email.com"
              disabled={loading}
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
              placeholder="••••••••"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#ffb84e] to-[#ff9800] hover:from-[#ff9800] hover:to-[#ffb84e] text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg transition-all duration-200 transform hover:scale-105 tracking-wide disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Logging in...
              </div>
            ) : (
              'Log In'
            )}
          </button>
        </form>
        <div className="mt-6 flex flex-col items-center gap-2">
          <p className="text-[#4e8cff] text-sm">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="font-bold underline hover:text-[#ff9800] transition">Register</Link>
          </p>
          <Link to="/" className="text-[#4e8cff] font-semibold underline hover:text-[#ff9800] transition text-sm">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;