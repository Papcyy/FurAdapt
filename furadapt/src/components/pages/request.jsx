import React, { useState, useEffect } from "react";
import { adoptionAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { Calendar, MapPin, Heart, Clock, RefreshCw } from 'lucide-react';

const Request = () => {
  const { user } = useAuth();
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalRequest, setModalRequest] = useState(null);

  useEffect(() => {
    fetchAdoptionRequests();
  }, []);

  const fetchAdoptionRequests = async () => {
    try {
      setLoading(true);
      const response = await adoptionAPI.getRequests();
      setAdoptionRequests(response.data.requests || response.data);
    } catch (error) {
      toast.error('Failed to fetch adoption requests');
      console.error('Error fetching adoption requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-600 text-lg font-semibold">Loading adoption requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700">My Adoption Requests</h1>
          <button
            onClick={fetchAdoptionRequests}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Modal for request details */}
        {modalRequest && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setModalRequest(null)}>
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-[90vw] max-h-[90vh] overflow-y-auto relative animate-fadeIn" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setModalRequest(null)}
                className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 text-2xl font-bold"
                aria-label="Close"
              >
                &times;
              </button>
              
              <div className="flex flex-col md:flex-row gap-6">
                {/* Pet Info */}
                <div className="flex-shrink-0">
                  <img 
                    src={modalRequest.pet?.images?.[0] ? 
                      (modalRequest.pet.images[0].startsWith('http') ? 
                        modalRequest.pet.images[0] : 
                        `http://localhost:5001${modalRequest.pet.images[0]}`) : 
                      '/api/placeholder/300/300'} 
                    alt={modalRequest.pet?.name} 
                    className="w-64 h-64 object-cover rounded-lg border-4 border-blue-100" 
                  />
                </div>
                
                {/* Request Details */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-blue-800 mb-2">{modalRequest.pet?.name}</h2>
                  <p className="text-gray-600 mb-4">{modalRequest.pet?.breed} • {modalRequest.pet?.species}</p>
                  
                  <div className="mb-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(modalRequest.status)}`}>
                      {modalRequest.status?.charAt(0).toUpperCase() + modalRequest.status?.slice(1)}
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Submitted: {formatDate(modalRequest.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Adoption Fee: ${modalRequest.pet?.adoptionFee || 0}</span>
                    </div>
                  </div>
                  
                  {/* Application Data */}
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Application Details</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Living Space:</span> {modalRequest.applicationData?.livingSpace}</p>
                      <p><span className="font-medium">Experience:</span> {modalRequest.applicationData?.experience}</p>
                      <p><span className="font-medium">Work Schedule:</span> {modalRequest.applicationData?.workSchedule}</p>
                      <p><span className="font-medium">Reason:</span> {modalRequest.applicationData?.reason}</p>
                    </div>
                  </div>
                  
                  {modalRequest.adminNotes && (
                    <div className="border-t pt-4 mt-4">
                      <h3 className="font-semibold text-gray-800 mb-2">Admin Notes</h3>
                      <p className="text-sm text-gray-600">{modalRequest.adminNotes}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <button 
                className="mt-6 px-8 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition w-full md:w-auto" 
                onClick={() => setModalRequest(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {adoptionRequests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adoptionRequests.map((request) => (
              <div
                key={request._id}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-1 flex flex-col cursor-pointer"
                onClick={() => setModalRequest(request)}
              >
                <div className="relative w-full h-48">
                  <img
                    src={request.pet?.images?.[0] ? 
                      (request.pet.images[0].startsWith('http') ? 
                        request.pet.images[0] : 
                        `http://localhost:5001${request.pet.images[0]}`) : 
                      '/api/placeholder/300/200'}
                    alt={request.pet?.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div className="p-5 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{request.pet?.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {request.pet?.breed} • {request.pet?.species}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-xs text-gray-500">Submitted {formatDate(request.createdAt)}</span>
                  </div>
                  
                  <div className="mt-auto">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                      {request.status?.charAt(0).toUpperCase() + request.status?.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mb-4">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-600 mb-2">No adoption requests yet.</p>
              <p className="text-gray-500">When you apply for pet adoption, your requests will appear here.</p>
            </div>
          </div>
        )}
      </div>
      <style>{`
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