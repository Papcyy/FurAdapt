import React, { useState, useEffect, useRef } from "react";
import img1 from '../../assets/1.jpg';
import img2 from '../../assets/2.jpg';
import img3 from '../../assets/3.jpg';
import img4 from '../../assets/4.jpg';
import img5 from '../../assets/5.jpg';

const petImages = [
  { src: img1, alt: 'Adoptable pet 1' },
  { src: img2, alt: 'Adoptable pet 2' },
  { src: img3, alt: 'Adoptable pet 3' },
  { src: img4, alt: 'Adoptable pet 4' },
  { src: img5, alt: 'Adoptable pet 5' },
];

const Dashboard = ({ petsCount = 0, analytics = {} }) => {

  const [currentIdx, setCurrentIdx] = useState(0);
  const [modalImg, setModalImg] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setCurrentIdx((prev) => (prev === petImages.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearTimeout(timeoutRef.current);
  }, [currentIdx]);

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev === 0 ? petImages.length - 1 : prev - 1));
  };
  const handleNext = () => {
    setCurrentIdx((prev) => (prev === petImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4">
      <h2 className="text-4xl font-bold text-blue-700 mb-8 text-center">Dashboard</h2>
      {/* Carousel of Available Pets */}
      <div className="flex flex-col items-center mb-8">
        <h3 className="text-[#2563eb] mb-4 text-2xl font-extrabold text-center tracking-tight drop-shadow-lg">
          <span className="inline-block bg-[#4e8cff] bg-clip-text text-transparent">
            Meet Some of Our Available  Pets
          </span>
        </h3>
        {/* Modal for image popup */}
        {modalImg && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setModalImg(null)}>
            <div className="bg-white rounded-2xl shadow-xl p-4 max-w-[90vw] max-h-[90vh] flex flex-col items-center" onClick={e => e.stopPropagation()}>
              <img src={modalImg.src} alt={modalImg.alt} className="max-h-[70vh] max-w-full rounded-xl mb-2" />
              <button className="mt-2 px-6 py-2 bg-[#4e8cff] text-white rounded-full font-semibold hover:bg-[#2563eb] transition" onClick={() => setModalImg(null)}>Close</button>
            </div>
          </div>
        )}
        <div className="relative flex items-center justify-center h-56 w-full max-w-md">
          <button onClick={handlePrev} className="absolute left-0 z-20 bg-white/80 hover:bg-blue-100 text-blue-600 rounded-full p-2 shadow transition-all -translate-x-1/2">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <div className="relative w-full flex items-center justify-center">
            <div className="flex w-full justify-center items-center relative h-full">
              {[-1, 0, 1].map(offset => {
                let idx = (currentIdx + offset + petImages.length) % petImages.length;
                let base = "absolute transition-all duration-700 ease-in-out flex-shrink-0 bg-white rounded-3xl shadow-2xl border border-[#e0e7ef] overflow-hidden cursor-pointer";
                let position = offset === 0 ? "left-1/2 -translate-x-1/2" : offset === -1 ? "left-0 -translate-x-1/4" : "right-0 translate-x-1/4";
                let size = offset === 0 ? "w-40 h-48 z-20 scale-110 ring-4 ring-[#4e8cff] shadow-2xl" : "w-24 h-32 z-10 opacity-50 blur-[2px]";
                return (
                  <div
                    key={idx}
                    className={`${base} ${size} ${position}`}
                    style={{
                      pointerEvents: offset === 0 ? 'auto' : 'none',
                      background: "#f8fafc",
                      boxShadow: offset === 0 ? "0 8px 32px 0 rgba(78,140,255,0.18)" : "0 2px 8px 0 rgba(0,0,0,0.07)"
                    }}
                    title="Click to enlarge"
                    onClick={() => setModalImg(petImages[idx])}
                  >
                    <img src={petImages[idx].src} alt={petImages[idx].alt} className="w-full h-full object-cover aspect-[4/5] rounded-3xl transition-transform duration-300" style={{ background: "#f8fafc", objectPosition: "center center" }} />
                  </div>
                );
              })}
            </div>
          </div>
          <button onClick={handleNext} className="absolute right-0 z-20 bg-white/80 hover:bg-blue-100 text-blue-600 rounded-full p-2 shadow transition-all translate-x-1/2">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
        <div className="flex justify-center mt-4 gap-2">
          {petImages.map((_, idx) => (
            <button
              key={idx}
              className={`w-3 h-3 rounded-full border-2 shadow ${idx === currentIdx ? 'bg-gradient-to-r from-[#4e8cff] to-[#ffb84e] border-[#4e8cff]' : 'bg-[#cbd5e1] border-[#e0e7ef]'}`}
              onClick={() => setCurrentIdx(idx)}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-center mb-8">
        {/* Total Pets Available */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
          <div className="flex items-center justify-center bg-blue-100 rounded-full p-4 mb-4">
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
              <path
                d="M12 21c-4.97 0-9-3.134-9-7 0-2.21 1.79-4 4-4 .34 0 .67.04.99.11C8.36 8.45 10.07 7 12 7s3.64 1.45 4.01 3.11c.32-.07.65-.11.99-.11 2.21 0 4 1.79 4 4 0 3.866-4.03 7-9 7z"
                fill="#1976d2"
              />
              <circle cx="8.5" cy="10.5" r="1.5" fill="#1976d2" />
              <circle cx="15.5" cy="10.5" r="1.5" fill="#1976d2" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-blue-700">{petsCount}</div>
          <div className="text-gray-500">Total Pets Available</div>
        </div>
      </div>

      {/* User Activity Summary Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
        <div className="text-lg font-semibold text-blue-700 mb-4">User Activity Summary</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Adoptions */}
          <div className="flex items-center bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-center bg-blue-100 rounded-full p-4 mr-4">
              <svg width="30" height="30" fill="none" viewBox="0 0 24 24">
                <path
                  d="M12 2a10 10 0 100 20 10 10 0 000-20zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"
                  fill="#1976d2"
                />
              </svg>
            </div>
            <div>
              <div className="text-xl font-bold text-blue-700">{analytics.totalAdoptions ?? 0}</div>
              <div className="text-gray-500">Total Adoptions</div>
            </div>
          </div>

          {/* Total Requests */}
          <div className="flex items-center bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center justify-center bg-yellow-100 rounded-full p-4 mr-4">
              <svg width="30" height="30" fill="none" viewBox="0 0 24 24">
                <path
                  d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                  fill="#f59e0b"
                />
              </svg>
            </div>
            <div>
              <div className="text-xl font-bold text-yellow-600">{analytics.totalRequests ?? 0}</div>
              <div className="text-gray-500">Total Requests</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;