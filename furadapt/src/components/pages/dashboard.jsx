import React from "react";

const Dashboard = ({ petsCount = 0, analytics = {} }) => {
  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4">
      <h2 className="text-4xl font-bold text-blue-700 mb-8 text-center">Dashboard</h2>
      <div className="flex justify-center mb-8">
        {/* Total Pets Available */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
          <div className="flex items-center justify-center bg-blue-100 rounded-full p-4 mb-4">
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
              <path
                d="M12 21c-4.97 0-9-3.134-9-7 0-2.21 1.79-4 4-4 .34 0 .67.04.99.11C8.36 8.45 10.07 7 12 7s3.64 1.45 4.01 3.11c.32-.07.65-.11.99-.11 2.21 0 4 1.79 4 4 0 3.866-4.03 7-9 7z"
                fill="#1976d2"
              />
              <circle cx="8.5" cy="10.5" r="1.5" fill="#1976d2" />
              <circle cx="15.5" cy="10.5" r="1.5" fill="#1976d2" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-blue-700">{petsCount}</div>
          <div className="text-gray-500">Total Pets Available</div>
        </div>
      </div>

      {/* User Activity Summary Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
        <div className="text-lg font-semibold text-blue-700 mb-4">User Activity Summary</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Adoptions */}
          <div className="flex items-center bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-center bg-blue-100 rounded-full p-4 mr-4">
              <svg width="30" height="30" fill="none" viewBox="0 0 24 24">
                <path
                  d="M12 2a10 10 0 100 20 10 10 0 000-20zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"
                  fill="#1976d2"
                />
              </svg>
            </div>
            <div>
              <div className="text-xl font-bold text-blue-700">{analytics.totalAdoptions ?? 0}</div>
              <div className="text-gray-500">Total Adoptions</div>
            </div>
          </div>

          {/* Total Requests */}
          <div className="flex items-center bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center justify-center bg-yellow-100 rounded-full p-4 mr-4">
              <svg width="30" height="30" fill="none" viewBox="0 0 24 24">
                <path
                  d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                  fill="#f59e0b"
                />
              </svg>
            </div>
            <div>
              <div className="text-xl font-bold text-yellow-600">{analytics.totalRequests ?? 0}</div>
              <div className="text-gray-500">Total Requests</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;