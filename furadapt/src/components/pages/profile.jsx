import React, { useRef, useState } from "react";
import { Mail, MapPin, Calendar, Edit, Camera, Phone } from "lucide-react";

export default function Profile() {
  const user = {
    image: "/api/placeholder/400/400",
    fullName: "John Doe",
    address: "123 Main Street, Springfield, USA",
    email: "john.doe@example.com",
    joinDate: "January 2022",
    bio: "Frontend developer passionate about creating beautiful and functional user interfaces.",
    phone: "+1 (555) 123-4567",
    role: "Pet Foster Parent",
    stats: {
      petsAdopted: 12,
      yearsActive: 2
    }
  };

  const [profileImage, setProfileImage] = useState(user.image);
  const fileInputRef = useRef(null);

  const handleProfilePictureUpdate = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Create a URL for the selected image file
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      
      // Here you would typically upload the file to your server
      // Example:
      // const formData = new FormData();
      // formData.append('profilePicture', file);
      // await fetch('/api/update-profile-picture', {
      //   method: 'POST',
      //   body: formData
      // });
    }
  };

  return (
    <div className="bg-gradient-to-b min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden transition-shadow hover:shadow-2xl">
        {/* Cover Photo & Actions Bar */}
        <div className="h-48 sm:h-56 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
          <button 
            className="absolute right-4 top-4 bg-white/20 hover:bg-white/30 p-2.5 rounded-full backdrop-blur-sm transition-all hover:scale-105 focus:ring-2 focus:ring-white"
            aria-label="Edit cover photo"
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
                />
              </div>
              <button 
                className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-all hover:scale-110 group-hover:bg-blue-600"
                aria-label="Update profile picture"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera size={16} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Profile Content */}
        <div className="px-8 pb-8 pt-16 sm:px-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
                {user.fullName}
              </h1>
              <p className="text-blue-500 font-medium">{user.role}</p>
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
          <p className="text-gray-600 mb-8 leading-relaxed">{user.bio}</p>
          
          {/* User Details */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <MapPin size={20} className="mr-3 text-blue-500 flex-shrink-0" />
              <span className="text-gray-700">{user.address}</span>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Mail size={20} className="mr-3 text-blue-500 flex-shrink-0" />
              <span className="text-gray-700">{user.email}</span>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Phone size={20} className="mr-3 text-blue-500 flex-shrink-0" />
              <span className="text-gray-700">{user.phone}</span>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Calendar size={20} className="mr-3 text-blue-500 flex-shrink-0" />
              <span className="text-gray-700">Member since {user.joinDate}</span>
            </div>
          </div>
          
          {/* Edit Profile Button */}
          <button 
            className="w-full sm:w-auto px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-sm transition-all hover:shadow-md focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
          >
            Edit Profile
          </button>
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