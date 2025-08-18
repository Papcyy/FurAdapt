import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo1.png';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirm) {
      alert('Passwords do not match!');
      return;
    }
    // TODO: Add registration logic here
    alert(`Registered:\nName: ${name}\nEmail: ${email}`);
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
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#ffb84e] to-[#ff9800] hover:from-[#ff9800] hover:to-[#ffb84e] text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg transition-all duration-200 transform hover:scale-105 tracking-wide"
          >
            Sign Up
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