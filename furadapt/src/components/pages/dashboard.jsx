import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { petsAPI } from "../../utils/api";
import { useNavigate } from "react-router-dom";

// Fallback images if no pets available
import img1 from '../../assets/1.jpg';
import img2 from '../../assets/2.jpg';
import img3 from '../../assets/3.jpg';
import img4 from '../../assets/4.jpg';
import img5 from '../../assets/5.jpg';

const fallbackImages = [
  { src: img1, alt: 'Adoptable pet 1', name: 'Looking for a home' },
  { src: img2, alt: 'Adoptable pet 2', name: 'Ready for adoption' },
  { src: img3, alt: 'Adoptable pet 3', name: 'Waiting for love' },
  { src: img4, alt: 'Adoptable pet 4', name: 'Find me a family' },
  { src: img5, alt: 'Adoptable pet 5', name: 'Adopt me today' },
];

const Dashboard = ({ petsCount = 42, analytics = {} }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [modalImg, setModalImg] = useState(null);
  const [petImages, setPetImages] = useState(fallbackImages);
  const [loading, setLoading] = useState(true);
  const timeoutRef = useRef(null);

  useEffect(() => {
    fetchAvailablePets();
  }, []);

  const fetchAvailablePets = async () => {
    try {
      setLoading(true);
      console.log('Fetching pets for carousel...');
      
      const response = await petsAPI.getAllPets({ limit: 5 });
      console.log('Pets API response:', response.data);
      
      if (response.data.pets && response.data.pets.length > 0) {
        console.log('Found pets:', response.data.pets.length);
        
        const petsWithImages = response.data.pets
          .filter(pet => {
            const hasImages = pet.images && pet.images.length > 0;
            console.log(`Pet ${pet.name} has images:`, hasImages, pet.images);
            return hasImages;
          })
          .slice(0, 5)
          .map(pet => {
            const imageUrl = pet.images[0].startsWith('http') 
              ? pet.images[0] 
              : `http://localhost:5001${pet.images[0]}`;
            console.log(`Pet ${pet.name} image URL:`, imageUrl);
            
            return {
              src: imageUrl,
              alt: `${pet.name} - ${pet.breed}`,
              name: pet.name,
              breed: pet.breed,
              id: pet._id
            };
          });
        
        console.log('Pets with images processed:', petsWithImages);
        
        if (petsWithImages.length > 0) {
          setPetImages(petsWithImages);
          console.log('Updated petImages state with real pets');
        } else {
          console.log('No pets with images found, keeping fallback images');
        }
      } else {
        console.log('No pets found in response');
      }
    } catch (error) {
      console.error('Error fetching pets:', error);
      // Keep fallback images if API fails
    } finally {
      setLoading(false);
    }
  };

  const handlePetClick = (pet) => {
    if (pet.id) {
      navigate(`/pet/${pet.id}`);
    } else {
      setModalImg(pet);
    }
  };

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
            Meet Some of Our Available Pets
          </span>
        </h3>

        {/* Modal for image popup */}
        {modalImg && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setModalImg(null)}>
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-[90vw] max-h-[90vh] flex flex-col items-center" onClick={e => e.stopPropagation()}>
              <img src={modalImg.src} alt={modalImg.alt} className="max-h-[60vh] max-w-full rounded-xl mb-4" />
              <div className="text-center mb-4">
                <h4 className="text-xl font-bold text-gray-800 mb-1">{modalImg.name}</h4>
                {modalImg.breed && (
                  <p className="text-gray-600">{modalImg.breed}</p>
                )}
              </div>
              <div className="flex gap-3">
                {modalImg.id && (
                  <button 
                    className="px-6 py-2 bg-[#4e8cff] text-white rounded-full font-semibold hover:bg-[#2563eb] transition" 
                    onClick={() => {
                      setModalImg(null);
                      navigate(`/pet/${modalImg.id}`);
                    }}
                  >
                    View Details
                  </button>
                )}
                <button 
                  className="px-6 py-2 bg-gray-500 text-white rounded-full font-semibold hover:bg-gray-600 transition" 
                  onClick={() => setModalImg(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="flex items-center justify-center h-56 w-full max-w-md">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-[#4e8cff] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#4e8cff] font-semibold">Loading available pets...</p>
            </div>
          </div>
        ) : (
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
                      title={offset === 0 ? "Click to view details" : ""}
                      onClick={() => offset === 0 && handlePetClick(petImages[idx])}
                    >
                      <img 
                        src={petImages[idx].src} 
                        alt={petImages[idx].alt} 
                        className="w-full h-full object-cover rounded-3xl transition-transform duration-300" 
                        style={{ 
                          background: "#f8fafc", 
                          objectPosition: "center center" 
                        }} 
                        onError={(e) => {
                          e.target.src = fallbackImages[idx % fallbackImages.length].src;
                        }}
                      />
                      {offset === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 rounded-b-3xl">
                          <p className="text-white text-sm font-semibold text-center truncate">
                            {petImages[idx].name}
                          </p>
                          {petImages[idx].breed && (
                            <p className="text-white/80 text-xs text-center truncate">
                              {petImages[idx].breed}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            <button onClick={handleNext} className="absolute right-0 z-20 bg-white/80 hover:bg-blue-100 text-blue-600 rounded-full p-2 shadow transition-all translate-x-1/2">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        )}
        
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

      {/* Total Pets Available */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
          <div className="flex items-center justify-center bg-blue-100 rounded-full p-4 mb-4">
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
              <path
                d="M12 21c-4.97 0-9-3.134-9-7 0-2.21 1.79-4 4-4 .34 0 .67.04.99.11C8.36 8.45 10.07 7 12 7s3.64 1.45 4.01 3.11c.32-.07.65-.11.99-.11 2.21 0 4 1.79 4 4 0 3.866-4.03 7-9 7z"
                fill="#1976d2"
              />
            </svg>
          </div>
          <div className="text-4xl font-bold text-blue-700 mb-2">{petImages.length}</div>
          <div className="text-gray-600">Pets Available for Adoption</div>
        </div>
      </div>

      {/* Quick Statistics */}
      <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
        <div className="text-lg font-semibold text-blue-700 mb-4">
          {user && user.role === 'admin' ? 'Admin Dashboard Summary' : 'Your Activity Summary'}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* My Pets - Only show for admin */}
          {user && user.role === 'admin' && (
            <div className="flex items-center bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-center bg-blue-500 rounded-full p-3 mr-4">
                <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-700">2</div>
                <div className="text-gray-500 text-sm">My Pets</div>
              </div>
            </div>
          )}

          {/* My Requests */}
          <div className="flex items-center bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-center bg-purple-500 rounded-full p-3 mr-4">
              <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-700">3</div>
              <div className="text-gray-500 text-sm">My Requests</div>
            </div>
          </div>

          {/* Pet Requests - Only show for admin */}
          {user && user.role === 'admin' && (
            <div className="flex items-center bg-orange-50 rounded-lg p-4">
              <div className="flex items-center justify-center bg-orange-500 rounded-full p-3 mr-4">
                <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-700">3</div>
                <div className="text-gray-500 text-sm">Pet Requests</div>
              </div>
            </div>
          )}

          {/* Total Available */}
          <div className="flex items-center bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-center bg-green-500 rounded-full p-3 mr-4">
              <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-700">1</div>
              <div className="text-gray-500 text-sm">Total Available</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;