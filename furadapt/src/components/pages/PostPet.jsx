import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { petsAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import { ArrowLeft, Upload, X, Plus, Loader } from 'lucide-react';

const PostPet = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    species: 'dog',
    breed: '',
    age: '',
    ageUnit: 'years',
    gender: 'male',
    size: 'medium',
    color: '',
    description: '',
    images: [],
    location: {
      city: '',
      state: ''
    },
    healthStatus: {
      vaccinated: false,
      spayedNeutered: false,
      healthIssues: ''
    },
    adoptionFee: '',
    specialNeeds: '',
    goodWith: {
      children: false,
      dogs: false,
      cats: false
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + formData.images.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    // Validate file sizes
    const invalidFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      toast.error('Each image must be less than 5MB');
      return;
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));

    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreview(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    try {
      setLoading(true);
      await petsAPI.createPet(formData);
      toast.success('Pet posted successfully!');
      navigate('/home');
    } catch (error) {
      console.error('Error posting pet:', error);
      toast.error(error.response?.data?.message || 'Failed to post pet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Post a Pet for Adoption</h1>
          <p className="text-gray-600">Help a furry friend find their forever home</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-8">
          
          {/* Images Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Upload size={20} className="text-blue-500" />
              Pet Images *
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {imagePreview.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-40 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              {formData.images.length < 5 && (
                <label className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                  <Plus size={32} className="text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Add Image</span>
                  <span className="text-xs text-gray-400 mt-1">{formData.images.length}/5</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pet Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Max"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Species *</label>
                <select
                  name="species"
                  value={formData.species}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="bird">Bird</option>
                  <option value="rabbit">Rabbit</option>
                  <option value="hamster">Hamster</option>
                  <option value="fish">Fish</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Breed *</label>
                <input
                  type="text"
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Golden Retriever"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color *</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Golden"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    min="0"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 2"
                  />
                  <select
                    name="ageUnit"
                    value={formData.ageUnit}
                    onChange={handleChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size *</label>
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="extra-large">Extra Large</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adoption Fee *</label>
                <input
                  type="number"
                  name="adoptionFee"
                  value={formData.adoptionFee}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 150"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Location</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Los Angeles"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                <input
                  type="text"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., California"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
              maxLength="1000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Tell us about this pet's personality, habits, and any other important information..."
            />
            <p className="text-sm text-gray-500 mt-1">{formData.description.length}/1000 characters</p>
          </div>

          {/* Health Status */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Health Information</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="healthStatus.vaccinated"
                  checked={formData.healthStatus.vaccinated}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">Vaccinated</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="healthStatus.spayedNeutered"
                  checked={formData.healthStatus.spayedNeutered}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">Spayed/Neutered</span>
              </label>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Health Issues (if any)</label>
                <textarea
                  name="healthStatus.healthIssues"
                  value={formData.healthStatus.healthIssues}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Describe any health conditions or special medical needs..."
                />
              </div>
            </div>
          </div>

          {/* Special Needs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Special Needs</label>
            <textarea
              name="specialNeeds"
              value={formData.specialNeeds}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Any special care requirements, dietary restrictions, etc..."
            />
          </div>

          {/* Good With */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Good With</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="goodWith.children"
                  checked={formData.goodWith.children}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">Children</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="goodWith.dogs"
                  checked={formData.goodWith.dogs}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">Dogs</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="goodWith.cats"
                  checked={formData.goodWith.cats}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">Cats</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Posting...
                </>
              ) : (
                'Post Pet for Adoption'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostPet;
