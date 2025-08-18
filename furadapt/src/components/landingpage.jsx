import React, { useState, useEffect, useRef } from 'react';
import logo from '../assets/logo1.png';
import { Link } from 'react-router-dom';

import img1 from '../assets/1.jpg';
import img2 from '../assets/2.jpg';
import img3 from '../assets/3.jpg';
import img4 from '../assets/4.jpg';
import img5 from '../assets/5.jpg';

const petImages = [
  { src: img1, alt: 'Adoptable pet 1' },
  { src: img2, alt: 'Adoptable pet 2' },
  { src: img3, alt: 'Adoptable pet 3' },
  { src: img4, alt: 'Adoptable pet 4' },
  { src: img5, alt: 'Adoptable pet 5' },
];

const LandingPage = () => {
  const [modalImg, setModalImg] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [slideDirection, setSlideDirection] = useState('right');
  const timeoutRef = useRef(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setSlideDirection('right');
      setCurrentIdx((prev) => (prev === petImages.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearTimeout(timeoutRef.current);
  }, [currentIdx]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gradient-to-br from-[#e3f0ff] via-[#f8fafc] to-[#fff7e6] font-sans relative">
      {modalImg && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setModalImg(null)}>
          <div className="bg-white rounded-2xl shadow-xl p-4 max-w-[90vw] max-h-[90vh] flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <img src={modalImg.src} alt={modalImg.alt} className="max-h-[70vh] max-w-full rounded-xl mb-2" />
            <button className="mt-2 px-6 py-2 bg-[#4e8cff] text-white rounded-full font-semibold hover:bg-[#2563eb] transition" onClick={() => setModalImg(null)}>Close</button>
          </div>
        </div>
      )}

      <div className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ backgroundImage: `url(${logo})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: '100vw 200vh', marginTop: '7vh', opacity: 0.20 }} />

      <div className="relative z-10 h-full flex flex-col">
        <header className="bg-[#4e8cff] text-white py-2 text-center shadow-lg rounded-b-3xl">
          <h1 className="text-[3rem] tracking-widest font-extrabold drop-shadow-lg">FurAdopt</h1>
          <p className="mt-2 text-[1.2rem] font-light opacity-90">Your trusted pet adoption hub</p>
        </header>

        <main className="flex-1 flex flex-col items-center justify-start px-4 py-6 overflow-y-auto">
          <div className="flex flex-col md:flex-row gap-10 w-full max-w-[1800px] mx-auto h-[calc(100vh-220px)]">
            <section className="flex-[2] flex flex-col items-center justify-center mb-10 md:mb-0">
              <h3 className="text-[#2563eb] mb-8 text-4xl font-extrabold text-center tracking-tight drop-shadow-lg">
                <span className="inline-block bg-[#4e8cff] bg-clip-text text-transparent">
                  Meet Some of Our Pets
                </span>
              </h3>
              <div className="relative flex items-center justify-center h-[40rem] md:h-[48rem]">
                <div className="relative w-full flex items-center justify-center">
                  <div className="flex w-full justify-center items-center relative h-full">
                    {[-1, 0, 1].map(offset => {
                      let idx = (currentIdx + offset + petImages.length) % petImages.length;
                      let base = "absolute transition-all duration-700 ease-in-out flex-shrink-0 bg-white rounded-3xl shadow-2xl border border-[#e0e7ef] overflow-hidden cursor-pointer";
                      let position = offset === 0 ? "left-1/2 -translate-x-1/2" : offset === -1 ? "left-0 -translate-x-1/4" : "right-0 translate-x-1/4";
                      let size = offset === 0 ? "w-[28rem] h-[38rem] z-20 scale-110 ring-4 ring-[#4e8cff] shadow-2xl" : "w-72 h-[28rem] z-10 opacity-50 blur-[2px]";

                      return (
                        <div
                          key={idx}
                          className={`${base} ${size} ${position} group hover:ring-8 hover:ring-[#ffb84e]/60`}
                          style={{
                            pointerEvents: offset === 0 ? 'auto' : 'none',
                            background: "#f8fafc",
                            boxShadow: offset === 0 ? "0 8px 32px 0 rgba(78,140,255,0.18)" : "0 2px 8px 0 rgba(0,0,0,0.07)"
                          }}
                          onClick={() => setModalImg(petImages[idx])}
                          title="Click to enlarge"
                        >
                          <img src={petImages[idx].src} alt={petImages[idx].alt} className="w-full h-full object-cover aspect-[4/5] rounded-3xl transition-transform duration-300 group-hover:scale-105" style={{ background: "#f8fafc", objectPosition: "center center" }} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-8 gap-4">
                {petImages.map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-5 h-5 rounded-full border-2 shadow ${idx === currentIdx ? 'bg-gradient-to-r from-[#4e8cff] to-[#ffb84e] border-[#4e8cff]' : 'bg-[#cbd5e1] border-[#e0e7ef]'}`}
                    onClick={() => setCurrentIdx(idx)}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>
            </section>

            <div className="flex-[1.5] flex flex-col gap-10 justify-center">
              <section className="bg-white/90 px-12 py-12 rounded-3xl shadow-2xl text-center border border-[#e0e7ef]">
                <h2 className="text-[#4e8cff] mb-4 text-4xl font-bold">Find Your New Best Friend</h2>
                <p className="text-[#333] mb-8 text-xl">
                  Browse hundreds of pets looking for a loving home. <span className="font-semibold text-[#ff9800]">Adopt, don't shop!</span>
                </p>
                <Link
                  to="/login"
                  className="inline-block bg-gradient-to-r from-[#ffb84e] to-[#ff9800] hover:from-[#ff9800] hover:to-[#ffb84e] text-white px-10 py-4 rounded-full text-xl font-bold shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  View Adoptable Pets
                </Link>
              </section>
              <div className="flex flex-col md:flex-row gap-8 w-full">
                <section className="flex-1 bg-[#f0f4fa]/80 px-8 py-8 rounded-2xl text-left border border-[#e0e7ef] shadow">
                  <h3 className="text-[#4e8cff] mb-4 text-2xl font-semibold">How It Works</h3>
                  <ol className="list-decimal list-inside text-[#444] space-y-2 text-lg">
                    <li>Browse available pets</li>
                    <li>Apply for adoption</li>
                    <li>Meet your new companion</li>
                  </ol>
                </section>
                <section className="flex-1 bg-[#f0f4fa]/80 px-8 py-8 rounded-2xl text-left border border-[#e0e7ef] shadow">
                  <h3 className="text-[#4e8cff] mb-4 text-2xl font-semibold">Why FurAdopt?</h3>
                  <ul className="list-disc list-inside text-[#444] space-y-2 text-lg">
                    <li>Trusted adoption platform</li>
                    <li>Easy and secure adoption process</li>
                    <li>Support for new pet parents</li>
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </main>

        <footer className="bg-[#eaf1fb] text-[#4e8cff] text-center py-3 text-sm border-t border-[#dbeafe] shadow-inner rounded-t-2xl">
          <p className="opacity-80">&copy; {new Date().getFullYear()} FurAdopt "The Homeless Dog Shelter". All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;