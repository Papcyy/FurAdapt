import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { petsAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import { Heart, MapPin, Calendar, Search, Filter, X } from 'lucide-react';

const PetListing = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    species: '',
    size: '',
    age: '',
    location: '',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPets: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchPets();
  }, [filters, pagination.currentPage]);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: 12,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        )
      };

      const response = await petsAPI.getAllPets(params);
      setPets(response.data.pets);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        totalPets: response.data.totalPets
      });
    } catch (error) {
      toast.error('Failed to fetch pets');
      console.error('Error fetching pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      species: '',
      size: '',
      age: '',
      location: '',
      search: ''
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handlePetClick = (petId) => {
    navigate(`/pet/${petId}`);
  };

  if (loading && pets.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4e8cff] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#4e8cff] text-lg font-semibold">Loading pets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-[#4e8cff] mb-2">Adoptable Pets</h2>
          <p className="text-gray-600">
            {pagination.totalPets} {pagination.totalPets === 1 ? 'pet' : 'pets'} available for adoption
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-[#4e8cff] text-white rounded-lg hover:bg-[#2563eb] transition"
        >
          <Filter size={20} />
          Filters
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search pets by name, breed, or description..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4e8cff] focus:border-transparent"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Species</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4e8cff]"
                  value={filters.species}
                  onChange={(e) => handleFilterChange('species', e.target.value)}
                >
                  <option value="">All Species</option>
                  <option value="dog">Dogs</option>
                  <option value="cat">Cats</option>
                  <option value="bird">Birds</option>
                  <option value="rabbit">Rabbits</option>
                  <option value="hamster">Hamsters</option>
                  <option value="fish">Fish</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4e8cff]"
                  value={filters.size}
                  onChange={(e) => handleFilterChange('size', e.target.value)}
                >
                  <option value="">All Sizes</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="extra-large">Extra Large</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4e8cff]"
                  value={filters.age}
                  onChange={(e) => handleFilterChange('age', e.target.value)}
                >
                  <option value="">All Ages</option>
                  <option value="0-1">0-1 years</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-7">3-7 years</option>
                  <option value="7-12">7-12 years</option>
                  <option value="12">12+ years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  placeholder="City or State"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4e8cff]"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition"
              >
                <X size={16} />
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pet Grid */}
      {pets.length === 0 && !loading ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Heart size={64} className="mx-auto mb-4" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No pets found</h3>
          <p className="text-gray-500">Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pets.map((pet) => (
            <PetCard
              key={pet._id}
              pet={pet}
              onClick={() => handlePetClick(pet._id)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-lg transition ${
                  page === pagination.currentPage
                    ? 'bg-[#4e8cff] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const PetCard = ({ pet, onClick }) => {
  const imageUrl = pet.images && pet.images.length > 0 
    ? (pet.images[0].startsWith('http') 
       ? pet.images[0] 
       : `http://localhost:5001${pet.images[0]}`)
    : '/api/placeholder/300/200';

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition hover:scale-105 hover:shadow-xl"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={pet.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/api/placeholder/300/200';
          }}
        />
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            pet.status === 'available' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-orange-100 text-orange-800'
          }`}>
            {pet.status === 'available' ? 'Available' : 'Pending'}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-800">{pet.name}</h3>
          <span className="text-lg font-bold text-[#4e8cff]">${pet.adoptionFee}</span>
        </div>

        <p className="text-gray-600 mb-2">
          {pet.breed} • {pet.age} {pet.ageUnit} • {pet.gender}
        </p>

        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPin size={14} className="mr-1" />
          {pet.location?.city}, {pet.location?.state}
        </div>

        <p className="text-gray-600 text-sm line-clamp-2">
          {pet.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-1">
          {pet.healthStatus?.vaccinated && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Vaccinated
            </span>
          )}
          {pet.healthStatus?.spayedNeutered && (
            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
              Spayed/Neutered
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PetListing;