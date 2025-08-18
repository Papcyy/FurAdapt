import React from "react";

const Request = ({ adoptedPets }) => {
  return (
    <div className="px-4 sm:px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">Adoption Requests</h1>

        {adoptedPets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {adoptedPets.map((pet) => (
              <div
                key={pet.id}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-1 flex flex-col"
              >
                <div className="relative w-full h-48">
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
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {pet.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
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
    </div>
  );
};

export default Request;