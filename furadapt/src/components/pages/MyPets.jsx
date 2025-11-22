import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { petsAPI, adoptionAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import { Edit, Trash2, Eye, Clock, CheckCircle, XCircle, Plus, Loader } from 'lucide-react';

const MyPets = () => {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pets'); // 'pets' or 'requests'
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [petsRes, requestsRes] = await Promise.all([
        petsAPI.getMyPets(),
        adoptionAPI.getMyPetsRequests()
      ]);
      setPets(petsRes.data.pets || []);
      setRequests(requestsRes.data.requests || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (petId) => {
    if (!window.confirm('Are you sure you want to delete this pet listing?')) {
      return;
    }

    try {
      await petsAPI.deletePet(petId);
      toast.success('Pet listing deleted successfully');
      setPets(pets.filter(pet => pet._id !== petId));
    } catch (error) {
      console.error('Error deleting pet:', error);
      toast.error(error.response?.data?.message || 'Failed to delete pet');
    }
  };

  const handleRequestAction = async (requestId, action) => {
    const actionText = action === 'approve' ? 'approve' : 'reject';
    if (!window.confirm(`Are you sure you want to ${actionText} this adoption request?`)) {
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, [requestId]: true }));
      await adoptionAPI.ownerAction(requestId, { action });
      toast.success(`Request ${actionText}d successfully`);
      fetchData();
    } catch (error) {
      console.error(`Error ${actionText}ing request:`, error);
      toast.error(error.response?.data?.message || `Failed to ${actionText} request`);
    } finally {
      setActionLoading(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const handleCompleteAdoption = async (requestId) => {
    if (!window.confirm('Mark this adoption as completed? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, [requestId]: true }));
      await adoptionAPI.completeAdoption(requestId);
      toast.success('Adoption marked as completed!');
      fetchData();
    } catch (error) {
      console.error('Error completing adoption:', error);
      toast.error(error.response?.data?.message || 'Failed to complete adoption');
    } finally {
      setActionLoading(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      available: 'bg-green-100 text-green-700 border-green-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      adopted: 'bg-blue-100 text-blue-700 border-blue-200',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getRequestStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      approved: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-red-100 text-red-700 border-red-200',
      completed: 'bg-blue-100 text-blue-700 border-blue-200',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader className="animate-spin text-blue-600" size={32} />
          <span className="text-lg font-medium text-gray-700">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Pets Dashboard</h1>
            <p className="text-gray-600">Manage your pet listings and adoption requests</p>
          </div>
          <button
            onClick={() => navigate('/post-pet')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Plus size={20} />
            Post New Pet
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6 p-1 inline-flex gap-1">
          <button
            onClick={() => setActiveTab('pets')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === 'pets'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            My Pets ({pets.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === 'requests'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            Adoption Requests ({requests.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'pets' ? (
          <div>
            {pets.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus size={40} className="text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Pets Posted Yet</h3>
                <p className="text-gray-600 mb-6">Start by posting your first pet for adoption</p>
                <button
                  onClick={() => navigate('/post-pet')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg"
                >
                  Post Pet
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pets.map((pet) => (
                  <div key={pet._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative h-48">
                      <img
                        src={`http://localhost:5001${pet.images[0]}`}
                        alt={pet.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                        }}
                      />
                      <div className="absolute top-3 right-3">
                        {getStatusBadge(pet.status)}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{pet.name}</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {pet.breed} • {pet.age} {pet.ageUnit} • {pet.gender}
                      </p>
                      <p className="text-gray-700 mb-4 line-clamp-2">{pet.description}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/pet/${pet._id}`)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <Eye size={16} />
                          View
                        </button>
                        <button
                          onClick={() => navigate(`/edit-pet/${pet._id}`)}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                          disabled={pet.status === 'adopted'}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(pet._id)}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          disabled={pet.status === 'adopted'}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {requests.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock size={40} className="text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Adoption Requests Yet</h3>
                <p className="text-gray-600">Requests for your pets will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request._id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Pet Image */}
                      <div className="lg:w-48 h-48 flex-shrink-0">
                        <img
                          src={`http://localhost:5001${request.pet?.images?.[0]}`}
                          alt={request.pet?.name}
                          className="w-full h-full object-cover rounded-xl"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
                          }}
                        />
                      </div>

                      {/* Request Details */}
                      <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-1">{request.pet?.name}</h3>
                            <p className="text-gray-600">{request.pet?.breed} • {request.pet?.species}</p>
                          </div>
                          {getRequestStatusBadge(request.status)}
                        </div>

                        <div className="border-t pt-4">
                          <h4 className="font-semibold text-gray-800 mb-2">Applicant Information</h4>
                          <div className="grid md:grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-gray-600">Name:</span>
                              <span className="ml-2 font-medium">{request.adopter?.name}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Email:</span>
                              <span className="ml-2 font-medium">{request.adopter?.email}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Phone:</span>
                              <span className="ml-2 font-medium">{request.adopter?.phone || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Living Space:</span>
                              <span className="ml-2 font-medium capitalize">{request.applicationData?.livingSpace}</span>
                            </div>
                          </div>
                        </div>

                        <div className="border-t pt-4">
                          <h4 className="font-semibold text-gray-800 mb-2">Reason for Adoption</h4>
                          <p className="text-gray-700 text-sm">{request.applicationData?.reason}</p>
                        </div>

                        {/* Action Buttons */}
                        {request.status === 'pending' && (
                          <div className="flex gap-3 pt-4 border-t">
                            <button
                              onClick={() => handleRequestAction(request._id, 'approve')}
                              disabled={actionLoading[request._id]}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <CheckCircle size={18} />
                              {actionLoading[request._id] ? 'Processing...' : 'Approve'}
                            </button>
                            <button
                              onClick={() => handleRequestAction(request._id, 'reject')}
                              disabled={actionLoading[request._id]}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <XCircle size={18} />
                              {actionLoading[request._id] ? 'Processing...' : 'Reject'}
                            </button>
                          </div>
                        )}

                        {request.status === 'approved' && (
                          <div className="pt-4 border-t">
                            <button
                              onClick={() => handleCompleteAdoption(request._id)}
                              disabled={actionLoading[request._id]}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <CheckCircle size={18} />
                              {actionLoading[request._id] ? 'Processing...' : 'Mark as Completed'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPets;
