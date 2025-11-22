import React, { useRef, useState, useEffect } from "react";
import { Mail, MapPin, Calendar, Edit, Camera, Phone, Save, X, Loader, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../utils/api";

export default function Profile() {
  const { user: authUser, updateProfile } = useAuth();
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const profileFileInputRef = useRef(null);
  const coverFileInputRef = useRef(null);
  const [selectedProfileFile, setSelectedProfileFile] = useState(null);
  const [selectedCoverFile, setSelectedCoverFile] = useState(null);

  // Helper function to transform user data
  const transformUserData = (userData) => {
    return {
      fullName: userData.name || 'User',
      email: userData.email || '',
      phone: userData.phone || '',
      address: userData.address ? 
        (typeof userData.address === 'string' ? userData.address : 
         `${userData.address.street || ''} ${userData.address.city || ''} ${userData.address.state || ''} ${userData.address.zipCode || ''}`.trim()) : '',
      role: userData.role === 'admin' ? 'Administrator' : 'Pet Lover',
      bio: userData.bio || 'No bio available yet.',
      image: userData.profileImage ? `http://localhost:5001${userData.profileImage}` : 'https://via.placeholder.com/150',
      coverImage: userData.coverImage ? `http://localhost:5001${userData.coverImage}` : '',
      joinDate: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      }) : 'Recently',
      stats: {
        petsAdopted: userData.adoptedPets?.length || 0
      }
    };
  };

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError('');
        
        console.log('Fetching profile...');
        const response = await authAPI.getProfile();
        console.log('Profile response:', response);
        
        const userData = response.data;
        
        if (!userData) {
          // If no data from API but we have authUser from context, use that
          if (authUser) {
            console.log('Using authUser from context:', authUser);
            const transformedUser = transformUserData(authUser);
            setUser(transformedUser);
            setProfileImage(transformedUser.image);
            setCoverImage(transformedUser.coverImage);
            setEditData(transformedUser);
            return;
          }
          throw new Error('No user data received from server');
        }
        
        // Transform backend data to match frontend expectations
        const transformedUser = transformUserData(userData);
        
        console.log('Transformed user:', transformedUser);
        
        setUser(transformedUser);
        setProfileImage(transformedUser.image);
        setCoverImage(transformedUser.coverImage);
        setEditData(transformedUser);
      } catch (err) {
        console.error('Error fetching profile:', err);
        console.error('Error details:', err.response?.data || err.message);
        
        // Try to use authUser from context as fallback
        if (authUser) {
          console.log('API failed, using authUser from context as fallback');
          try {
            const transformedUser = transformUserData(authUser);
            setUser(transformedUser);
            setProfileImage(transformedUser.image);
            setCoverImage(transformedUser.coverImage);
            setEditData(transformedUser);
            setError(''); // Clear error since we have fallback data
            return;
          } catch (transformError) {
            console.error('Error transforming authUser:', transformError);
          }
        }
        
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load profile data';
        setError(errorMessage);
        
        // If unauthorized, redirect to login after a delay
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
    console.log('Token exists:', !!token);
    
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
      setSelectedProfileFile(file);
      setEditData((prev) => ({ ...prev, profileImage: file }));
      setError('');
    }
  };

  const handleCoverPhotoUpdate = (event) => {
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
      setCoverImage(imageUrl);
      setSelectedCoverFile(file);
      setEditData((prev) => ({ ...prev, coverImage: file }));
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
    setCoverImage(user.coverImage);
    setSelectedProfileFile(null);
    setSelectedCoverFile(null);
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
      
      if (selectedProfileFile || selectedCoverFile) {
        // If there's a file upload, use FormData
        updateData = new FormData();
        updateData.append('name', editData.fullName);
        updateData.append('email', editData.email);
        updateData.append('phone', editData.phone || '');
        updateData.append('address', editData.address || '');
        updateData.append('bio', editData.bio || '');
        if (selectedProfileFile) {
          updateData.append('profileImage', selectedProfileFile);
        }
        if (selectedCoverFile) {
          updateData.append('coverImage', selectedCoverFile);
        }
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
        const transformedUser = transformUserData(userData);
        
        setUser(transformedUser);
        setProfileImage(transformedUser.image);
        setCoverImage(transformedUser.coverImage);
        setEditData(transformedUser);
        setSelectedProfileFile(null);
        setSelectedCoverFile(null);
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
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
          <Loader className="animate-spin text-blue-600 mb-4" size={48} />
          <span className="text-lg font-medium text-gray-700">Loading profile...</span>
        </div>
      </div>
    );
  }

  // Show error if user data couldn't be loaded
  if (!user && error) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X size={32} className="text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Profile Load Error</h3>
          <p className="text-red-600 mb-6">{error}</p>
          <div className="flex gap-3">
            <button 
              onClick={() => window.location.reload()} 
              className="flex-1 px-4 py-2.5 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
            <button 
              onClick={() => window.location.href = '/home'} 
              className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              Go Home
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            If the problem persists, please try logging out and back in.
          </p>
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
        <div className="h-48 sm:h-64 relative overflow-hidden">
          {coverImage ? (
            <img
              src={coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600"></div>
          )}
          
          {/* Cover photo edit button */}
          {isEditing && (
            <button
              className="absolute right-4 top-4 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-lg transition-all hover:scale-105 focus:ring-2 focus:ring-blue-400"
              aria-label="Edit cover photo"
              onClick={() => coverFileInputRef.current?.click()}
            >
              <Camera size={20} className="text-blue-600" />
            </button>
          )}

          {/* Profile Picture */}
          <div className="absolute -bottom-16 left-8 sm:left-12">
            <div className="relative group">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white p-1.5 shadow-2xl ring-4 ring-white">
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
                  className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2.5 rounded-full shadow-lg transition-all hover:scale-110 focus:ring-2 focus:ring-blue-300"
                  aria-label="Update profile picture"
                  onClick={() => profileFileInputRef.current?.click()}
                >
                  <Camera size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="px-8 pb-8 pt-20 sm:px-12">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6">
            <div className="flex-1">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="fullName"
                    value={editData.fullName || ''}
                    onChange={handleEditChange}
                    className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 border-b-2 border-blue-200 focus:outline-none focus:border-blue-500 bg-transparent w-full transition-colors"
                    placeholder="Enter your full name"
                  />
                  <p className="text-blue-600 font-medium text-sm">{user.role}</p>
                </>
              ) : (
                <>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">{user.fullName}</h1>
                  <p className="text-blue-600 font-medium flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                    {user.role}
                  </p>
                </>
              )}
            </div>

            {/* Quick Stats */}
            <div className="flex gap-6 mt-4 sm:mt-0">
              <div className="text-center px-4 py-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                <p className="text-3xl font-bold text-blue-600">{user.stats.petsAdopted}</p>
                <p className="text-xs text-gray-600 font-medium mt-1">Pets Adopted</p>
              </div>
            </div>
          </div>

          {/* Bio */}
          {isEditing ? (
            <div className="mb-8 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-5">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Edit size={16} className="text-blue-500" />
                About Me
              </label>
              <textarea
                name="bio"
                value={editData.bio || ''}
                onChange={handleEditChange}
                className="text-gray-700 leading-relaxed border-2 border-blue-200 rounded-lg p-4 w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white resize-none transition-all"
                rows={4}
                placeholder="Tell others about yourself..."
              />
            </div>
          ) : (
            <div className="mb-8 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <User size={16} className="text-blue-500" />
                About Me
              </h3>
              <p className="text-gray-700 leading-relaxed">{user.bio || 'No bio available yet.'}</p>
            </div>
          )}

          {/* User Details */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group">
              <div className="p-2 bg-blue-50 rounded-lg mr-3 group-hover:bg-blue-100 transition-colors">
                <MapPin size={20} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={editData.address || ''}
                    onChange={handleEditChange}
                    className="text-gray-700 text-sm border-b-2 border-blue-200 focus:outline-none focus:border-blue-500 bg-transparent w-full transition-colors"
                    placeholder="Enter your address"
                  />
                ) : (
                  <>
                    <p className="text-xs text-gray-500 font-medium">Address</p>
                    <p className="text-sm text-gray-800 font-medium truncate">{user.address || 'No address provided'}</p>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group">
              <div className="p-2 bg-blue-50 rounded-lg mr-3 group-hover:bg-blue-100 transition-colors">
                <Mail size={20} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editData.email || ''}
                    onChange={handleEditChange}
                    className="text-gray-700 text-sm border-b-2 border-blue-200 focus:outline-none focus:border-blue-500 bg-transparent w-full transition-colors"
                    placeholder="Enter your email"
                  />
                ) : (
                  <>
                    <p className="text-xs text-gray-500 font-medium">Email</p>
                    <p className="text-sm text-gray-800 font-medium truncate">{user.email}</p>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group">
              <div className="p-2 bg-blue-50 rounded-lg mr-3 group-hover:bg-blue-100 transition-colors">
                <Phone size={20} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={editData.phone || ''}
                    onChange={handleEditChange}
                    className="text-gray-700 text-sm border-b-2 border-blue-200 focus:outline-none focus:border-blue-500 bg-transparent w-full transition-colors"
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <>
                    <p className="text-xs text-gray-500 font-medium">Phone</p>
                    <p className="text-sm text-gray-800 font-medium">{user.phone || 'No phone provided'}</p>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group">
              <div className="p-2 bg-blue-50 rounded-lg mr-3 group-hover:bg-blue-100 transition-colors">
                <Calendar size={20} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-medium">Member Since</p>
                <p className="text-sm text-gray-800 font-medium">{user.joinDate}</p>
              </div>
            </div>
          </div>

          {/* Edit/Save/Cancel Buttons */}
          {isEditing ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className={`flex-1 sm:flex-none px-8 py-3.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 focus:ring-4 focus:ring-green-300 focus:ring-offset-2 ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <span className="flex items-center justify-center">
                    <Loader className="animate-spin mr-2" size={18} />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Save className="mr-2" size={18} />
                    Save Changes
                  </span>
                )}
              </button>
              <button
                className="flex-1 sm:flex-none px-8 py-3.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 focus:ring-4 focus:ring-gray-300 focus:ring-offset-2"
                onClick={handleCancel}
                disabled={saving}
              >
                <span className="flex items-center justify-center">
                  <X className="mr-2" size={18} />
                  Cancel
                </span>
              </button>
            </div>
          ) : (
            <button
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 focus:ring-4 focus:ring-blue-300 focus:ring-offset-2"
              onClick={handleEdit}
            >
              <span className="flex items-center justify-center">
                <Edit className="mr-2" size={18} />
                Edit Profile
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        type="file"
        ref={profileFileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleProfilePictureUpdate}
      />
      <input
        type="file"
        ref={coverFileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleCoverPhotoUpdate}
      />
    </div>
  );
}