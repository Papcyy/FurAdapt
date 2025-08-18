import React from 'react';
import { Heart, PawPrint, Users, Home, Shield } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-indigo-50 w-full h-full flex flex-col">
      {/* Title centered at top */}
      <div className="text-center pt-8 pb-6">
        <h1 className="text-3xl font-bold text-blue-600 relative z-10">
          About FurAdapt
        </h1>
        <div className="h-1 w-32 bg-blue-400 mx-auto rounded-full mt-1"></div>
      </div>
      
      {/* Main content container */}
      <div className="flex-grow flex flex-col px-8 pb-8">
        {/* Welcome section - blue left border */}
        <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden border-l-4 border-blue-500">
          <div className="p-6 flex items-start">
            <div className="mr-4 text-blue-600">
              <Heart size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-blue-700 mb-2">Welcome to FurAdapt</h2>
              <p className="text-gray-700">
                We are dedicated to connecting loving families with pets in need of a 
                home. Our mission is to ensure every animal finds a safe and caring 
                environment where they can thrive and become a cherished member of their new family.
              </p>
            </div>
          </div>
        </div>

        {/* Two-column layout for middle sections */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Power of Adoption */}
          <div className="bg-blue-50 rounded-xl p-5">
            <div className="flex justify-center mb-3 text-blue-600">
              <PawPrint size={28} />
            </div>
            <h3 className="text-lg font-bold text-blue-700 text-center mb-2">
              The Power of Adoption
            </h3>
            <p className="text-gray-700 text-center">
              We believe in the transformative power of adoption and the joy that pets bring to our lives. Each adoption creates a lasting bond.
            </p>
          </div>
          
          {/* Our Team */}
          <div className="bg-blue-50 rounded-xl p-5">
            <div className="flex justify-center mb-3 text-blue-600">
              <Users size={28} />
            </div>
            <h3 className="text-lg font-bold text-blue-700 text-center mb-2">
              Our Dedicated Team
            </h3>
            <p className="text-gray-700 text-center">
              Our team works tirelessly to provide resources, support, and guidance to make the adoption process seamless.
            </p>
          </div>
        </div>
        
        {/* Our Commitment section */}
        <div className="bg-indigo-50 rounded-xl mb-6 border-l-4 border-indigo-500 overflow-hidden">
          <div className="p-5">
            <div className="flex items-center mb-4">
              <Shield className="text-indigo-600 mr-3" size={24} />
              <h3 className="text-lg font-bold text-indigo-700">Our Commitment</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <div className="bg-indigo-100 p-1 rounded-full mr-3">
                  <PawPrint className="text-indigo-600" size={16} />
                </div>
                <p className="text-gray-700">Thorough screening process</p>
              </div>
              <div className="flex items-center">
                <div className="bg-indigo-100 p-1 rounded-full mr-3">
                  <PawPrint className="text-indigo-600" size={16} />
                </div>
                <p className="text-gray-700">Complete health checks</p>
              </div>
              <div className="flex items-center">
                <div className="bg-indigo-100 p-1 rounded-full mr-3">
                  <PawPrint className="text-indigo-600" size={16} />
                </div>
                <p className="text-gray-700">Post-adoption support</p>
              </div>
              <div className="flex items-center">
                <div className="bg-indigo-100 p-1 rounded-full mr-3">
                  <PawPrint className="text-indigo-600" size={16} />
                </div>
                <p className="text-gray-700">Community education</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Thank you section */}
        <div className="bg-blue-50 rounded-xl p-6 text-center mb-6">
          <div className="flex justify-center mb-3">
            <Home className="text-blue-600" size={28} />
          </div>
          <p className="text-lg font-medium text-gray-800 mb-2">
            Thank you for choosing <span className="font-bold text-blue-700">FurAdapt</span>.
          </p>
          <p className="text-gray-700 mb-4">
            Together, we can make a difference in the lives of animals and their future families.
          </p>
        </div>
        
        {/* CTA Button */}
        <div className="text-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-md transition-all duration-300 flex items-center mx-auto">
            <Heart className="mr-2" size={20} />
            <span>Start Your Adoption Journey</span>
          </button>
        </div>
      </div>
      
      {/* Decorative footer paw prints */}
      <div className="flex justify-between px-8 py-2 opacity-20">
        <PawPrint className="text-blue-400" size={14} />
        <PawPrint className="text-blue-500" size={12} />
        <PawPrint className="text-indigo-400" size={16} />
        <PawPrint className="text-blue-400" size={13} />
        <PawPrint className="text-indigo-500" size={15} />
        <PawPrint className="text-blue-600" size={14} />
      </div>
    </div>
  );
};
;

export default AboutUs;