import React, { useRef, useState, useEffect } from "react";
import { Mail, MapPin, Calendar, Edit, Camera, Phone, Save, X, Loader } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../utils/api";

export default function Profile() {
  const { user: authUser, updateProfile } = useAuth();
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await authAPI.getProfile();
        const userData = response.data;
        
        // Transform backend data to match frontend expectations
        const transformedUser = {
          fullName: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address ? 
            (typeof userData.address === 'string' ? userData.address : 
             `${userData.address.street || ''} ${userData.address.city || ''} ${userData.address.state || ''} ${userData.address.zipCode || ''}`.trim()) : '',
          role: userData.role === 'admin' ? 'Administrator' : 'Pet Lover',
          bio: userData.bio || 'No bio available yet.',
          image: userData.profileImage ? `http://localhost:5001${userData.profileImage}` : 'https://via.placeholder.com/150',
          joinDate: new Date(userData.createdAt).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long' 
          }),
          stats: {
            petsAdopted: userData.adoptedPets?.length || 0
          }
        };
        
        setUser(transformedUser);
        setProfileImage(transformedUser.image);
        setEditData(transformedUser);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data. Please make sure you are logged in.');
        
        // If unauthorized, redirect to login
        if (err.response?.status === 401) {
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have an authenticated user or token
    const token = localStorage.getItem('token');
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
      setError('Please log in to view your profile.');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    }
  }, []);

  const handleProfilePictureUpdate = (event) => {
    const file = event.target.files[0]; 
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      setSelectedFile(file);
      setEditData((prev) => ({ ...prev, profileImage: file }));
      setError('');
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setEditData({...user});
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setEditData({...user});
    setProfileImage(user.image);
    setSelectedFile(null);
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      // Prepare data for backend
      let updateData;
      
      if (selectedFile) {
        // If there's a file upload, use FormData
        updateData = new FormData();
        updateData.append('name', editData.fullName);
        updateData.append('email', editData.email);
        updateData.append('phone', editData.phone || '');
        updateData.append('address', editData.address || '');
        updateData.append('bio', editData.bio || '');
        updateData.append('profileImage', selectedFile);
      } else {
        // If no file upload, use regular object
        updateData = {
          name: editData.fullName,
          email: editData.email,
          phone: editData.phone,
          address: editData.address,
          bio: editData.bio,
        };
      }

      // Call the updateProfile function from AuthContext
      const result = await updateProfile(updateData);

      if (result.success) {
        // Fetch updated profile data to ensure consistency
        const response = await authAPI.getProfile();
        const userData = response.data;
        
        // Transform backend data to match frontend expectations
        const transformedUser = {
          fullName: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address ? 
            (typeof userData.address === 'string' ? userData.address : 
             `${userData.address.street || ''} ${userData.address.city || ''} ${userData.address.state || ''} ${userData.address.zipCode || ''}`.trim()) : '',
          role: userData.role === 'admin' ? 'Administrator' : 'Pet Lover',
          bio: userData.bio || 'No bio available yet.',
          image: userData.profileImage ? `http://localhost:5001${userData.profileImage}` : 'https://via.placeholder.com/150',
          joinDate: new Date(userData.createdAt).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long' 
          }),
          stats: {
            petsAdopted: userData.adoptedPets?.length || 0
          }
        };
        
        setUser(transformedUser);
        setProfileImage(transformedUser.image);
        setEditData(transformedUser);
        setSelectedFile(null);
        setIsEditing(false);
        setSuccess('Profile updated successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="bg-gradient-to-b min-h-screen p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader className="animate-spin" size={24} />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  // Show error if user data couldn't be loaded
  if (!user) {
    return (
      <div className="bg-gradient-to-b min-h-screen p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load profile data</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden transition-shadow hover:shadow-2xl">
        
        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-t-2xl">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-t-2xl">
            {error}
          </div>
        )}

        {/* Cover Photo & Actions Bar */}
        <div className="h-48 sm:h-56 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
          <button
            className="absolute right-4 top-4 bg-white/20 hover:bg-white/30 p-2.5 rounded-full backdrop-blur-sm transition-all hover:scale-105 focus:ring-2 focus:ring-white"
            aria-label="Edit cover photo"
            disabled
          >
            <Edit size={20} className="text-white" />
          </button>

          {/* Profile Picture */}
          <div className="absolute -bottom-12 left-8 sm:left-12">
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white p-1 shadow-lg">
                <img
                  src={profileImage}
                  alt={`${user.fullName}'s profile`}
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150';
                  }}
                />
              </div>
              {isEditing && (
                <button
                  className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-all hover:scale-110 group-hover:bg-blue-600"
                  aria-label="Update profile picture"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="px-8 pb-8 pt-16 sm:px-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="fullName"
                    value={editData.fullName || ''}
                    onChange={handleEditChange}
                    className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 border-b border-blue-200 focus:outline-none focus:border-blue-500 bg-white w-full"
                    placeholder="Enter your full name"
                  />
                  <input
                    type="text"
                    name="role"
                    value={editData.role || ''}
                    onChange={handleEditChange}
                    className="text-blue-500 font-medium border-b border-blue-100 focus:outline-none focus:border-blue-400 bg-white w-full"
                    placeholder="Enter your role"
                  />
                </>
              ) : (
                <>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">{user.fullName}</h1>
                  <p className="text-blue-500 font-medium">{user.role}</p>
                </>
              )}
            </div>

            {/* Quick Stats */}
            <div className="flex justify-center mt-4 sm:mt-0">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">{user.stats.petsAdopted}</p>
                <p className="text-sm text-gray-500">Pets Adopted</p>
              </div>
            </div>
          </div>

          {/* Bio */}
          {isEditing ? (
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                name="bio"
                value={editData.bio || ''}
                onChange={handleEditChange}
                className="text-gray-600 leading-relaxed border border-blue-200 rounded-lg p-3 w-full focus:outline-none focus:border-blue-400 bg-white resize-none transition-colors"
                rows={3}
                placeholder="Tell others about yourself..."
              />
            </div>
          ) : (
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Bio</h3>
              <p className="text-gray-600 leading-relaxed">{user.bio || 'No bio available yet.'}</p>
            </div>
          )}

          {/* User Details */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <MapPin size={20} className="mr-3 text-blue-500 flex-shrink-0" />
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={editData.address || ''}
                  onChange={handleEditChange}
                  className="text-gray-700 border-b border-blue-200 focus:outline-none focus:border-blue-400 bg-gray-50 w-full"
                  placeholder="Enter your address"
                />
              ) : (
                <span className="text-gray-700">{user.address || 'No address provided'}</span>
              )}
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Mail size={20} className="mr-3 text-blue-500 flex-shrink-0" />
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={editData.email || ''}
                  onChange={handleEditChange}
                  className="text-gray-700 border-b border-blue-200 focus:outline-none focus:border-blue-400 bg-gray-50 w-full"
                  placeholder="Enter your email"
                />
              ) : (
                <span className="text-gray-700">{user.email}</span>
              )}
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Phone size={20} className="mr-3 text-blue-500 flex-shrink-0" />
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={editData.phone || ''}
                  onChange={handleEditChange}
                  className="text-gray-700 border-b border-blue-200 focus:outline-none focus:border-blue-400 bg-gray-50 w-full"
                  placeholder="Enter your phone number"
                />
              ) : (
                <span className="text-gray-700">{user.phone || 'No phone number provided'}</span>
              )}
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Calendar size={20} className="mr-3 text-blue-500 flex-shrink-0" />
              <span className="text-gray-700">Member since {user.joinDate}</span>
            </div>
          </div>

          {/* Edit/Save/Cancel Buttons */}
          {isEditing ? (
            <div className="flex gap-4">
              <button
                className={`w-full sm:w-auto px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg shadow-sm transition-all hover:shadow-md focus:ring-2 focus:ring-green-300 focus:ring-offset-2 ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader className="animate-spin inline mr-2" size={16} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="inline mr-2" size={16} />
                    Save Changes
                  </>
                )}
              </button>
              <button
                className="w-full sm:w-auto px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg shadow-sm transition-all hover:shadow-md focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                onClick={handleCancel}
                disabled={saving}
              >
                <X className="inline mr-2" size={16} />
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="w-full sm:w-auto px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-sm transition-all hover:shadow-md focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
              onClick={handleEdit}
            >
              <Edit className="inline mr-2" size={16} />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleProfilePictureUpdate}
      />
    </div>
  );
}