import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { petsAPI, adoptionAPI, analyticsAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  Check, 
  X, 
  Filter,
  Search,
  BarChart3,
  Users,
  Heart,
  Calendar
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [analytics, setAnalytics] = useState(null);
  const [pets, setPets] = useState([]);
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/home');
      return;
    }
    
    if (activeTab === 'dashboard') {
      fetchAnalytics();
    } else if (activeTab === 'pets') {
      fetchPets();
    } else if (activeTab === 'requests') {
      fetchAdoptionRequests();
    }
  }, [activeTab, user, navigate]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getDashboard();
      setAnalytics(response.data);
    } catch (error) {
      toast.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await petsAPI.getAllPets({ limit: 50 });
      setPets(response.data.pets);
    } catch (error) {
      toast.error('Failed to fetch pets');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdoptionRequests = async () => {
    try {
      setLoading(true);
      const response = await adoptionAPI.getRequests({ limit: 50 });
      setAdoptionRequests(response.data.requests);
    } catch (error) {
      toast.error('Failed to fetch adoption requests');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestStatusUpdate = async (requestId, status, notes = '') => {
    try {
      await adoptionAPI.updateRequestStatus(requestId, { status, adminNotes: notes });
      toast.success(`Request ${status} successfully`);
      fetchAdoptionRequests();
    } catch (error) {
      toast.error(`Failed to ${status} request`);
    }
  };

  const handleDeletePet = async (petId) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        await petsAPI.deletePet(petId);
        toast.success('Pet deleted successfully');
        fetchPets();
      } catch (error) {
        toast.error('Failed to delete pet');
      }
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'pets', label: 'Manage Pets', icon: Heart },
    { id: 'requests', label: 'Adoption Requests', icon: Users },
    { id: 'add-pet', label: 'Add Pet', icon: Plus }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your pet adoption system</p>
            </div>
            <button
              onClick={() => navigate('/home')}
              className="px-4 py-2 bg-[#4e8cff] text-white rounded-lg hover:bg-[#2563eb] transition"
            >
              Back to Site
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                    activeTab === tab.id
                      ? 'bg-[#4e8cff] text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'dashboard' && (
          <DashboardOverview analytics={analytics} loading={loading} />
        )}
        {activeTab === 'pets' && (
          <PetManagement pets={pets} loading={loading} onDelete={handleDeletePet} onRefresh={fetchPets} />
        )}
        {activeTab === 'requests' && (
          <AdoptionRequestManagement 
            requests={adoptionRequests} 
            loading={loading} 
            onStatusUpdate={handleRequestStatusUpdate}
          />
        )}
        {activeTab === 'add-pet' && (
          <AddPetForm onSuccess={fetchPets} />
        )}
      </div>
    </div>
  );
};

const DashboardOverview = ({ analytics, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-[#4e8cff] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!analytics) return null;

  const stats = [
    {
      title: 'Total Pets',
      value: analytics.overview.totalPets,
      color: 'bg-blue-500',
      icon: Heart
    },
    {
      title: 'Available Pets',
      value: analytics.overview.availablePets,
      color: 'bg-green-500',
      icon: Heart
    },
    {
      title: 'Adopted Pets',
      value: analytics.overview.adoptedPets,
      color: 'bg-purple-500',
      icon: Heart
    },
    {
      title: 'Pending Requests',
      value: analytics.overview.pendingRequests,
      color: 'bg-orange-500',
      icon: Users
    },
    {
      title: 'Total Users',
      value: analytics.overview.totalUsers,
      color: 'bg-pink-500',
      icon: Users
    },
    {
      title: 'Adoption Rate',
      value: `${analytics.overview.adoptionRate}%`,
      color: 'bg-indigo-500',
      icon: BarChart3
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Adoptions</h3>
          </div>
          <div className="p-6">
            {analytics.recent.adoptions.length === 0 ? (
              <p className="text-gray-500">No recent adoptions</p>
            ) : (
              <div className="space-y-4">
                {analytics.recent.adoptions.map((adoption) => (
                  <div key={adoption._id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{adoption.name}</p>
                      <p className="text-sm text-gray-600">
                        Adopted by {adoption.adoptedBy?.name}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(adoption.adoptedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Requests</h3>
          </div>
          <div className="p-6">
            {analytics.recent.requests.length === 0 ? (
              <p className="text-gray-500">No recent requests</p>
            ) : (
              <div className="space-y-4">
                {analytics.recent.requests.map((request) => (
                  <div key={request._id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{request.pet?.name}</p>
                      <p className="text-sm text-gray-600">
                        By {request.adopter?.name}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      request.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : request.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PetManagement = ({ pets, loading, onDelete, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredPets = pets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pet.breed.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || pet.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-[#4e8cff] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search pets..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4e8cff]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4e8cff]"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="pending">Pending</option>
            <option value="adopted">Adopted</option>
          </select>
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-[#4e8cff] text-white rounded-lg hover:bg-[#2563eb] transition"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Pets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPets.map((pet) => (
          <PetCard key={pet._id} pet={pet} onDelete={onDelete} />
        ))}
      </div>

      {filteredPets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No pets found</p>
        </div>
      )}
    </div>
  );
};

const PetCard = ({ pet, onDelete }) => {
  const navigate = useNavigate();
  const imageUrl = pet.images?.[0]?.startsWith('http') 
    ? pet.images[0] 
    : `http://localhost:5000${pet.images?.[0] || ''}`;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <img
        src={imageUrl}
        alt={pet.name}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.target.src = '/api/placeholder/300/200';
        }}
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{pet.name}</h3>
          <span className={`px-2 py-1 text-xs rounded-full ${
            pet.status === 'available' 
              ? 'bg-green-100 text-green-800'
              : pet.status === 'pending'
              ? 'bg-orange-100 text-orange-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {pet.status}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-4">
          {pet.breed} • {pet.age} {pet.ageUnit} • ${pet.adoptionFee}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/pet/${pet._id}`)}
            className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-1"
          >
            <Eye size={16} />
            View
          </button>
          <button
            onClick={() => onDelete(pet._id)}
            className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const AdoptionRequestManagement = ({ requests, loading, onStatusUpdate }) => {
  const [selectedRequest, setSelectedRequest] = useState(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-[#4e8cff] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Adopter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((request) => (
                <tr key={request._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={request.pet?.images?.[0]?.startsWith('http') 
                          ? request.pet.images[0] 
                          : `http://localhost:5000${request.pet?.images?.[0] || ''}`}
                        alt={request.pet?.name}
                        className="h-10 w-10 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = '/api/placeholder/40/40';
                        }}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {request.pet?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {request.pet?.breed}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {request.adopter?.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {request.adopter?.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      request.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : request.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : request.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="text-[#4e8cff] hover:text-[#2563eb]"
                      >
                        <Eye size={16} />
                      </button>
                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => onStatusUpdate(request._id, 'approved')}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => onStatusUpdate(request._id, 'rejected')}
                            className="text-red-600 hover:text-red-900"
                          >
                            <X size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onStatusUpdate={onStatusUpdate}
        />
      )}
    </div>
  );
};

const RequestDetailModal = ({ request, onClose, onStatusUpdate }) => {
  const [adminNotes, setAdminNotes] = useState(request.adminNotes || '');

  const handleStatusUpdate = (status) => {
    onStatusUpdate(request._id, status, adminNotes);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Adoption Request Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
              ×
            </button>
          </div>

          <div className="space-y-6">
            {/* Pet and Adopter Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Pet Information</h3>
                <p><strong>Name:</strong> {request.pet?.name}</p>
                <p><strong>Breed:</strong> {request.pet?.breed}</p>
                <p><strong>Fee:</strong> ${request.pet?.adoptionFee}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Adopter Information</h3>
                <p><strong>Name:</strong> {request.adopter?.name}</p>
                <p><strong>Email:</strong> {request.adopter?.email}</p>
                <p><strong>Phone:</strong> {request.adopter?.phone}</p>
              </div>
            </div>

            {/* Application Details */}
            <div>
              <h3 className="font-semibold mb-2">Application Details</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p><strong>Living Space:</strong> {request.applicationData?.livingSpace}</p>
                <p><strong>Has Yard:</strong> {request.applicationData?.hasYard ? 'Yes' : 'No'}</p>
                <p><strong>Has Other Pets:</strong> {request.applicationData?.hasOtherPets ? 'Yes' : 'No'}</p>
                <p><strong>Has Children:</strong> {request.applicationData?.hasChildren ? 'Yes' : 'No'}</p>
                <p><strong>Experience:</strong> {request.applicationData?.experience}</p>
                <p><strong>Reason:</strong> {request.applicationData?.reason}</p>
                <p><strong>Work Schedule:</strong> {request.applicationData?.workSchedule}</p>
              </div>
            </div>

            {/* Admin Notes */}
            <div>
              <label className="block font-semibold mb-2">Admin Notes</label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows="4"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add notes about this request..."
              />
            </div>

            {/* Actions */}
            {request.status === 'pending' && (
              <div className="flex gap-4">
                <button
                  onClick={() => handleStatusUpdate('approved')}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Approve Request
                </button>
                <button
                  onClick={() => handleStatusUpdate('rejected')}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Reject Request
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AddPetForm = ({ onSuccess }) => {
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
    adoptionFee: '',
    location: {
      city: '',
      state: ''
    },
    healthStatus: {
      vaccinated: false,
      spayedNeutered: false,
      healthIssues: ''
    },
    goodWith: {
      children: false,
      dogs: false,
      cats: false
    },
    specialNeeds: ''
  });
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (images.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    try {
      setSubmitting(true);
      const petData = {
        ...formData,
        images: Array.from(images)
      };

      await petsAPI.createPet(petData);
      toast.success('Pet added successfully!');
      
      // Reset form
      setFormData({
        name: '',
        species: 'dog',
        breed: '',
        age: '',
        ageUnit: 'years',
        gender: 'male',
        size: 'medium',
        color: '',
        description: '',
        adoptionFee: '',
        location: { city: '', state: '' },
        healthStatus: { vaccinated: false, spayedNeutered: false, healthIssues: '' },
        goodWith: { children: false, dogs: false, cats: false },
        specialNeeds: ''
      });
      setImages([]);
      
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add pet');
    } finally {
      setSubmitting(false);
    }
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
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Add New Pet</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pet Name *
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4e8cff]"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Species *
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4e8cff]"
              value={formData.species}
              onChange={(e) => handleChange('species', e.target.value)}
              required
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Breed *
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4e8cff]"
              value={formData.breed}
              onChange={(e) => handleChange('breed', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age *
              </label>
              <input
                type="number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4e8cff]"
                value={formData.age}
                onChange={(e) => handleChange('age', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age Unit
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4e8cff]"
                value={formData.ageUnit}
                onChange={(e) => handleChange('ageUnit', e.target.value)}
              >
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender *
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4e8cff]"
              value={formData.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              required
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Size *
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4e8cff]"
              value={formData.size}
              onChange={(e) => handleChange('size', e.target.value)}
              required
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="extra-large">Extra Large</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color *
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4e8cff]"
              value={formData.color}
              onChange={(e) => handleChange('color', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adoption Fee *
            </label>
            <input
              type="number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4e8cff]"
              value={formData.adoptionFee}
              onChange={(e) => handleChange('adoptionFee', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4e8cff]"
              value={formData.location.city}
              onChange={(e) => handleChange('location.city', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State *
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4e8cff]"
              value={formData.location.state}
              onChange={(e) => handleChange('location.state', e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4e8cff]"
            rows="4"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Images *
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4e8cff]"
            onChange={(e) => setImages(e.target.files)}
            required
          />
          <p className="text-sm text-gray-500 mt-1">Select one or more images</p>
        </div>

        {/* Health Status */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Health Status</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={formData.healthStatus.vaccinated}
                onChange={(e) => handleChange('healthStatus.vaccinated', e.target.checked)}
              />
              Vaccinated
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={formData.healthStatus.spayedNeutered}
                onChange={(e) => handleChange('healthStatus.spayedNeutered', e.target.checked)}
              />
              Spayed/Neutered
            </label>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Health Issues
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4e8cff]"
                rows="2"
                value={formData.healthStatus.healthIssues}
                onChange={(e) => handleChange('healthStatus.healthIssues', e.target.value)}
                placeholder="Any health issues or special medical needs..."
              />
            </div>
          </div>
        </div>

        {/* Good With */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Good With</h3>
          <div className="grid grid-cols-3 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={formData.goodWith.children}
                onChange={(e) => handleChange('goodWith.children', e.target.checked)}
              />
              Children
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={formData.goodWith.dogs}
                onChange={(e) => handleChange('goodWith.dogs', e.target.checked)}
              />
              Dogs
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={formData.goodWith.cats}
                onChange={(e) => handleChange('goodWith.cats', e.target.checked)}
              />
              Cats
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Special Needs
          </label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4e8cff]"
            rows="3"
            value={formData.specialNeeds}
            onChange={(e) => handleChange('specialNeeds', e.target.value)}
            placeholder="Any special care requirements..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 bg-[#4e8cff] text-white rounded-lg hover:bg-[#2563eb] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Adding Pet...
              </div>
            ) : (
              'Add Pet'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminDashboard;
