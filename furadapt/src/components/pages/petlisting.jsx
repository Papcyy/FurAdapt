import { useState } from "react";

// Example pet data (replace with real data or fetch from API)
const pets = [
  {
    id: 1,
    name: "Bella",
    type: "Dog",
    breed: "Labrador Retriever",
    size: "Large",
    age: 2,
    gender: "Female",
    image: "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=facearea&w=400&h=400&q=80",
    description: "Friendly and energetic, loves to play fetch.",
    tags: ["Friendly", "Energetic", "Playful"],
  },
  {
    id: 2,
    name: "Milo",
    type: "Cat",
    breed: "Siamese",
    size: "Small",
    age: 1,
    gender: "Male",
    image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=facearea&w=400&h=400&q=80",
    description: "Calm and affectionate, perfect lap cat.",
    tags: ["Calm", "Affectionate", "Lap Cat"],
  },
  {
    id: 3,
    name: "Luna",
    type: "Dog",
    breed: "Beagle",
    size: "Medium",
    age: 3,
    gender: "Female",
    image: "https://images.unsplash.com/photo-1518715308788-3005759c61d3?auto=format&fit=facearea&w=400&h=400&q=80",
    description: "Loves walks and cuddles, great with kids.",
    tags: ["Kid-Friendly", "Cuddly", "Active"],
  },
  {
    id: 4,
    name: "Oliver",
    type: "Cat",
    breed: "Maine Coon",
    size: "Large",
    age: 4,
    gender: "Male",
    image: "https://images.unsplash.com/photo-1518715308788-3005759c61d3?auto=format&fit=facearea&w=400&h=400&q=80",
    description: "Gentle giant, very playful and social.",
    tags: ["Gentle", "Playful", "Social"],
  },
  {
    id: 5,
    name: "Charlie",
    type: "Dog",
    breed: "Golden Retriever",
    size: "Large",
    age: 5,
    gender: "Male",
    image: "https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=facearea&w=400&h=400&q=80",
    description: "Loyal and friendly, loves outdoor adventures.",
    tags: ["Loyal", "Friendly", "Adventurous"],
  },
  {
    id: 6,
    name: "Daisy",
    type: "Cat",
    breed: "Persian",
    size: "Medium",
    age: 2,
    gender: "Female",
    image: "https://images.unsplash.com/photo-1592194996308-7b43878e4f0c?auto=format&fit=facearea&w=400&h=400&q=80",
    description: "Elegant and calm, enjoys quiet environments.",
    tags: ["Elegant", "Calm", "Quiet"],
  },
  {
    id: 7,
    name: "Max",
    type: "Dog",
    breed: "German Shepherd",
    size: "Large",
    age: 6,
    gender: "Male",
    image: "https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=facearea&w=400&h=400&q=80",
    description: "Protective and intelligent, great for families.",
    tags: ["Protective", "Intelligent", "Family-Friendly"],
  },
  {
    id: 8,
    name: "Lily",
    type: "Cat",
    breed: "Bengal",
    size: "Small",
    age: 3,
    gender: "Female",
    image: "https://images.unsplash.com/photo-1592194996308-7b43878e4f0c?auto=format&fit=facearea&w=400&h=400&q=80",
    description: "Playful and curious, loves to explore.",
    tags: ["Playful", "Curious", "Explorer"],
  },
];

const fallbackImage = "/api/placeholder/400/400?text=No+Image"; // Fallback image with placeholder

const PetDetailsModal = ({ pet, onClose, onAdoptRequest }) => {
  if (!pet) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-40">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-7 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 text-2xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>
        <div className="flex flex-col items-center">
          <img
            src={pet.image || fallbackImage}
            alt={pet.name}
            className="w-32 h-32 object-cover rounded-full border-4 border-blue-100 mb-4"
          />
          <div className="text-2xl font-bold text-blue-800 mb-1">{pet.name}</div>
          <div className="text-base text-gray-500 mb-2">{pet.breed} • {pet.type}</div>
          <div className="text-sm text-gray-600 mb-1">Size: {pet.size}</div>
          <div className="text-sm text-gray-600 mb-1">Age: {pet.age} {pet.age === 1 ? "year" : "years"}</div>
          <div className="text-sm text-gray-600 mb-1">Gender: {pet.gender}</div>
          <div className="text-gray-700 text-center mb-3">{pet.description}</div>
          <div className="flex flex-wrap gap-2 mt-2">
            {pet.tags && pet.tags.map((tag, idx) => (
              <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        </div>
        <button
          onClick={() => onAdoptRequest(pet)}
          className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg transition-colors duration-200"
        >
          Submit Adoption Request
        </button>
        <button
          onClick={onClose}
          className="mt-2 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-5 py-2 rounded-lg transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const PetCard = ({ pet, onAdopt }) => {
  const [isHovered, setIsHovered] = useState(false);

  const typeColor = pet.type === "Dog" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700";

  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-1 flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-48">
        <img
          src={pet.image || fallbackImage}
          alt={pet.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out"
          style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-4 right-4">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${typeColor}`}>
            {pet.type}
          </span>
        </div>
      </div>

      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-gray-800">{pet.name}</h3>
          <span className="text-sm font-medium text-gray-500">
            {pet.age} {pet.age === 1 ? "yr" : "yrs"}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-2">{pet.breed} • {pet.gender} • {pet.size}</p>
        <p className="text-gray-700 mb-4 line-clamp-3">{pet.description}</p>
        <div className="flex flex-wrap gap-2 mt-auto mb-4">
          {pet.tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          onClick={() => onAdopt(pet)}
        >
          <span>Adopt {pet.name}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const PetListing = ({ onAdopt }) => {
  // Separate state for modal filter and applied filter
  const defaultFilter = {
    type: "all",
    size: "all",
    age: "all",
    gender: "all",
  };

  const [appliedFilter, setAppliedFilter] = useState(defaultFilter);
  const [modalFilter, setModalFilter] = useState(defaultFilter);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [adoptedPets, setAdoptedPets] = useState([]);

  // Filtering logic uses appliedFilter only
  const filteredPets = pets.filter((pet) => {
    const typeMatch = appliedFilter.type === "all" || pet.type.toLowerCase() === appliedFilter.type;
    const sizeMatch = appliedFilter.size === "all" || pet.size.toLowerCase() === appliedFilter.size;
    const genderMatch = appliedFilter.gender === "all" || pet.gender.toLowerCase() === appliedFilter.gender;
    const ageMatch =
      appliedFilter.age === "all" ||
      (appliedFilter.age === "young" && pet.age <= 2) ||
      (appliedFilter.age === "adult" && pet.age > 2 && pet.age <= 6) ||
      (appliedFilter.age === "senior" && pet.age > 6);
    return typeMatch && sizeMatch && genderMatch && ageMatch;
  });

  // When opening filter modal, sync modalFilter with appliedFilter
  const openFilterModal = () => {
    setModalFilter(appliedFilter);
    setShowFilters(true);
  };

  // When applying filter, set appliedFilter and close modal
  const applyFilters = () => {
    setAppliedFilter(modalFilter);
    setShowFilters(false);
  };

  // Reset filters to default
  const resetFilters = () => {
    setModalFilter(defaultFilter);
    setAppliedFilter(defaultFilter);
    setShowFilters(false);
  };

  // Handler for submitting adoption request
  const handleAdoptRequest = (pet) => {
    setAdoptedPets((prev) => [...prev, pet]);
    setSelectedPet(null);
    // Optionally, show a toast or message here
  };

  return (
    <div className="px-4 sm:px-6 py-12 relative">
      {/* Fixed Filter Button in the upper right */}
      <div className="fixed top-4 right-4 z-30">
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition"
          onClick={openFilterModal}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0013 13.414V19a1 1 0 01-1.447.894l-2-1A1 1 0 009 18v-4.586a1 1 0 00-.293-.707L2.293 6.707A1 1 0 012 6V4z" />
          </svg>
          Filter Pets
        </button>
      </div>

      <div className="max-w-6xl mx-auto mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPets.map((pet) => (
            <PetCard key={pet.id} pet={pet} onAdopt={() => setSelectedPet(pet)} />
          ))}
        </div>

        {filteredPets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No pets found with the selected filter.</p>
          </div>
        )}
      </div>

      {/* Filter Modal/Dropdown */}
      {showFilters && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-opacity-30">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg relative animate-fadeIn">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 text-2xl font-bold"
              onClick={() => setShowFilters(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold text-blue-700 mb-4">Filter Pets</h3>
            <div className="space-y-4">
              {/* Type */}
              <div>
                <label className="block font-medium mb-1">Type</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={modalFilter.type}
                  onChange={(e) => setModalFilter((f) => ({ ...f, type: e.target.value }))}
                >
                  <option value="all">All</option>
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                </select>
              </div>
              {/* Size */}
              <div>
                <label className="block font-medium mb-1">Size</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={modalFilter.size}
                  onChange={(e) => setModalFilter((f) => ({ ...f, size: e.target.value }))}
                >
                  <option value="all">All</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
              {/* Age */}
              <div>
                <label className="block font-medium mb-1">Age</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={modalFilter.age}
                  onChange={(e) => setModalFilter((f) => ({ ...f, age: e.target.value }))}
                >
                  <option value="all">All</option>
                  <option value="young">Young (≤2 yrs)</option>
                  <option value="adult">Adult (3-6 yrs)</option>
                  <option value="senior">Senior (7+ yrs)</option>
                </select>
              </div>
              {/* Gender */}
              <div>
                <label className="block font-medium mb-1">Gender</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={modalFilter.gender}
                  onChange={(e) => setModalFilter((f) => ({ ...f, gender: e.target.value }))}
                >
                  <option value="all">All</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                className="w-1/2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-lg transition mr-2"
                onClick={resetFilters}
              >
                Reset Filters
              </button>
              <button
                className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
                onClick={applyFilters}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      <PetDetailsModal
        pet={selectedPet}
        onClose={() => setSelectedPet(null)}
        onAdoptRequest={handleAdoptRequest}
      />

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

export default PetListing;