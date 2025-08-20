import React, { useState } from "react";


const Request = ({ adoptedPets }) => {
  const [modalPet, setModalPet] = useState(null);

  // For demo, all requests are 'Pending'. You can extend this to support other statuses.
  const getRequestStatus = (pet) => pet.status || 'Pending';

  return (
    <div className="px-4 sm:px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">Adoption Requests</h1>

        {/* Modal for pet details */}
        {modalPet && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setModalPet(null)}>
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-[90vw] max-h-[90vh] flex flex-col items-center relative animate-fadeIn" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setModalPet(null)}
                className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 text-2xl font-bold"
                aria-label="Close"
              >
                &times;
              </button>
              <img src={modalPet.image} alt={modalPet.name} className="w-40 h-40 object-cover rounded-full border-4 border-blue-100 mb-4" />
              <div className="text-2xl font-bold text-blue-800 mb-1">{modalPet.name}</div>
              <div className="text-base text-gray-500 mb-2">{modalPet.breed} • {modalPet.type}</div>
              <div className="text-sm text-gray-600 mb-1">Size: {modalPet.size}</div>
              <div className="text-sm text-gray-600 mb-1">Age: {modalPet.age} {modalPet.age === 1 ? "year" : "years"}</div>
              <div className="text-sm text-gray-600 mb-1">Gender: {modalPet.gender}</div>
              <div className="text-gray-700 text-center mb-3">{modalPet.description}</div>
              <div className="flex flex-wrap gap-2 mt-2 mb-4">
                {modalPet.tags && modalPet.tags.map((tag, idx) => (
                  <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{tag}</span>
                ))}
              </div>
              <div className="mt-2 text-base font-semibold">
                Status: <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">{getRequestStatus(modalPet)}</span>
              </div>
              <button className="mt-6 px-8 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition" onClick={() => setModalPet(null)}>Close</button>
            </div>
          </div>
        )}

        {adoptedPets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {adoptedPets.map((pet) => (
              <div
                key={pet.id}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-1 flex flex-col"
              >
                <div className="relative w-full h-48 cursor-pointer" onClick={() => setModalPet(pet)}>
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div className="p-5 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{pet.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {pet.breed} • {pet.type}
                  </p>
                  <p className="text-gray-700 mb-4 line-clamp-3">{pet.description}</p>
                  <div className="flex flex-wrap gap-2 mt-auto mb-2">
                    {pet.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 text-sm font-semibold">
                    Status: <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">{getRequestStatus(pet)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No adoption requests yet.</p>
          </div>
        )}
      </div>
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeInModal 0.2s;
        }
        @keyframes fadeInModal {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Request;