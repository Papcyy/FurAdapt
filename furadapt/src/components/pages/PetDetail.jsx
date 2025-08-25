import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { petsAPI, adoptionAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { Heart, MapPin, Calendar, ArrowLeft, Share2, MessageCircle } from 'lucide-react';

const PetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdoptionModal, setShowAdoptionModal] = useState(false);
  const [submittingRequest, setSubmittingRequest] = useState(false);

  useEffect(() => {
    fetchPetDetails();
  }, [id]);

  const fetchPetDetails = async () => {
    try {
      setLoading(true);
      const response = await petsAPI.getPet(id);
      setPet(response.data);
    } catch (error) {
      toast.error('Failed to fetch pet details');
      navigate('/home');
    } finally {
      setLoading(false);
    }
  };

  const handleAdoptionRequest = async (applicationData) => {
    try {
      setSubmittingRequest(true);
      await adoptionAPI.createRequest({
        petId: pet._id,
        applicationData
      });
      toast.success('Adoption request submitted successfully! You can view your request status in the Adoption Request section.');
      setShowAdoptionModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit adoption request');
    } finally {
      setSubmittingRequest(false);
    }
  };

  const handleContactOwner = () => {
    console.log('Contact owner clicked, pet data:', pet);
    console.log('Pet addedBy:', pet?.addedBy);
    if (pet?.addedBy?._id) {
      console.log('Navigating to chat with user:', pet.addedBy._id);
      navigate(`/chat/${pet.addedBy._id}`);
    } else {
      console.error('No pet owner found to contact');
      toast.error('Unable to contact pet owner - no owner information available');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4e8cff] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#4e8cff] text-lg font-semibold">Loading pet details...</p>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Pet not found</h2>
          <button
            onClick={() => navigate('/home')}
            className="px-6 py-3 bg-[#4e8cff] text-white rounded-lg hover:bg-[#2563eb] transition"
          >
            Go Back to Home
          </button>
        </div>
      </div>
    );
  }

  const imageUrl = pet.images && pet.images.length > 0 
    ? (pet.images[0].startsWith('http') 
       ? pet.images[0] 
       : `http://localhost:5001${pet.images[0]}`)
    : '/api/placeholder/600/400';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 text-[#4e8cff] hover:text-[#2563eb] transition"
          >
            <ArrowLeft size={20} />
            Back to Pet Listings
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="relative">
              <img
                src={imageUrl}
                alt={pet.name}
                className="w-full h-96 lg:h-full object-cover"
                onError={(e) => {
                  e.target.src = '/api/placeholder/600/400';
                }}
              />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  pet.status === 'available' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {pet.status === 'available' ? 'Available' : 'Pending'}
                </span>
              </div>
            </div>

            {/* Details Section */}
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">{pet.name}</h1>
                  <p className="text-xl text-gray-600">
                    {pet.breed} • {pet.age} {pet.ageUnit} • {pet.gender}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-[#4e8cff]">${pet.adoptionFee}</div>
                  <div className="text-sm text-gray-500">Adoption Fee</div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Species</div>
                  <div className="font-semibold capitalize">{pet.species}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Size</div>
                  <div className="font-semibold capitalize">{pet.size}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Color</div>
                  <div className="font-semibold">{pet.color}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Location</div>
                  <div className="font-semibold flex items-center">
                    <MapPin size={14} className="mr-1" />
                    {pet.location?.city}, {pet.location?.state}
                  </div>
                </div>
              </div>

              {/* Health Status */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Health Status</h3>
                <div className="flex flex-wrap gap-2">
                  {pet.healthStatus?.vaccinated && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      Vaccinated
                    </span>
                  )}
                  {pet.healthStatus?.spayedNeutered && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                      Spayed/Neutered
                    </span>
                  )}
                  {pet.healthStatus?.healthIssues && (
                    <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                      Health Issues
                    </span>
                  )}
                </div>
                {pet.healthStatus?.healthIssues && (
                  <p className="text-sm text-gray-600 mt-2">{pet.healthStatus.healthIssues}</p>
                )}
              </div>

              {/* Good With */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Good With</h3>
                <div className="flex flex-wrap gap-2">
                  {pet.goodWith?.children && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      Children
                    </span>
                  )}
                  {pet.goodWith?.dogs && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      Dogs
                    </span>
                  )}
                  {pet.goodWith?.cats && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      Cats
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3">About {pet.name}</h3>
                <p className="text-gray-700 leading-relaxed">{pet.description}</p>
                {pet.specialNeeds && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">Special Needs</h4>
                    <p className="text-yellow-700">{pet.specialNeeds}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {pet.status === 'available' && (
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowAdoptionModal(true)}
                    className="flex-1 bg-[#4e8cff] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2563eb] transition flex items-center justify-center gap-2"
                  >
                    <Heart size={20} />
                    Adopt {pet.name}
                  </button>
                  <button
                    onClick={handleContactOwner}
                    className="px-6 py-3 border border-[#4e8cff] text-[#4e8cff] rounded-lg font-semibold hover:bg-[#4e8cff] hover:text-white transition flex items-center gap-2"
                  >
                    <MessageCircle size={20} />
                    Contact
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Adoption Request Modal */}
      {showAdoptionModal && (
        <AdoptionRequestModal
          pet={pet}
          onClose={() => setShowAdoptionModal(false)}
          onSubmit={handleAdoptionRequest}
          loading={submittingRequest}
        />
      )}
    </div>
  );
};

const AdoptionRequestModal = ({ pet, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    livingSpace: 'house',
    hasYard: false,
    hasOtherPets: false,
    otherPetsDetails: '',
    hasChildren: false,
    childrenAges: '',
    experience: '',
    reason: '',
    workSchedule: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Adoption Application for {pet.name}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Living Situation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Living Space *
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4e8cff]"
                value={formData.livingSpace}
                onChange={(e) => handleChange('livingSpace', e.target.value)}
                required
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="farm">Farm</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={formData.hasYard}
                  onChange={(e) => handleChange('hasYard', e.target.checked)}
                />
                I have a yard
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={formData.hasOtherPets}
                  onChange={(e) => handleChange('hasOtherPets', e.target.checked)}
                />
                I have other pets
              </label>
            </div>

            {formData.hasOtherPets && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tell us about your other pets
                </label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4e8cff]"
                  rows="3"
                  value={formData.otherPetsDetails}
                  onChange={(e) => handleChange('otherPetsDetails', e.target.value)}
                  placeholder="Types, breeds, ages, temperament..."
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={formData.hasChildren}
                  onChange={(e) => handleChange('hasChildren', e.target.checked)}
                />
                I have children
              </label>
            </div>

            {formData.hasChildren && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ages of children
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4e8cff]"
                  value={formData.childrenAges}
                  onChange={(e) => handleChange('childrenAges', e.target.value)}
                  placeholder="e.g., 5, 8, 12"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pet Experience *
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4e8cff]"
                rows="3"
                value={formData.experience}
                onChange={(e) => handleChange('experience', e.target.value)}
                placeholder="Tell us about your experience with pets..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Why do you want to adopt {pet.name}? *
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4e8cff]"
                rows="3"
                value={formData.reason}
                onChange={(e) => handleChange('reason', e.target.value)}
                placeholder="What draws you to this pet?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Schedule *
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4e8cff]"
                value={formData.workSchedule}
                onChange={(e) => handleChange('workSchedule', e.target.value)}
                placeholder="e.g., 9-5 weekdays, remote work, etc."
                required
              />
            </div>

            {/* Emergency Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4e8cff]"
                    value={formData.emergencyContact.name}
                    onChange={(e) => handleChange('emergencyContact.name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4e8cff]"
                    value={formData.emergencyContact.phone}
                    onChange={(e) => handleChange('emergencyContact.phone', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relationship *
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4e8cff]"
                    value={formData.emergencyContact.relationship}
                    onChange={(e) => handleChange('emergencyContact.relationship', e.target.value)}
                    placeholder="e.g., Friend, Family"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-[#4e8cff] text-white rounded-lg font-semibold hover:bg-[#2563eb] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PetDetail;
