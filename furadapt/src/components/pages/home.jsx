import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Sidenav from "./sidenav";
import Dashboard from "./dashboard";
import PetListing from "./petlisting.jsx";
import AboutUs from "./aboutus"; // Import the AboutUs component
import Request from "./request"; // Import the Request component
import Profile from "./profile"; // Import the Profile component

const SectionContent = ({ page, adoptedPets, onAdoptPet }) => {
  const navigate = useNavigate();
  
  switch (page) {
    case "Dashboard":
      return <Dashboard petsCount={42} analytics={{ adoptionsThisMonth: 12, pendingRequests: 5, totalUsers: 120 }} />;
    case "Pet Listing":
      return <PetListing onAdopt={onAdoptPet} adoptedPets={adoptedPets} />;
    case "Adoption Request":
      return <Request adoptedPets={adoptedPets} />;
    case "Chat":
      // Navigate to the dedicated chat page
      navigate('/chat');
      return null;
    case "Profile":
      return <Profile />;
    case "About Us":
      return <AboutUs />; // Render the AboutUs component
    default:
      return null;
  }
};

const SIDENAV_WIDTH = 260;

const Home = () => {
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adoptedPets, setAdoptedPets] = useState([]); // State to track adopted pets

  const handleAdoptPet = (pet) => {
    setAdoptedPets((prev) => [...prev, pet]); // Add the adopted pet to the state
  };

  return (
    <div style={{ background: "#f4f6fb", height: "100vh", overflow: "hidden", display: "flex" }}>
      {/* Sidebar */}
      {sidebarOpen && (
        <div
          style={{
            width: SIDENAV_WIDTH,
            minWidth: SIDENAV_WIDTH,
            maxWidth: SIDENAV_WIDTH,
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            zIndex: 1001,
            boxShadow: "0 2px 8px rgba(25,118,210,0.08)",
            transition: "left 0.25s",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Sidenav
            currentPage={currentPage}
            onNavigate={setCurrentPage}
            onHide={() => setSidebarOpen(false)}
          />
        </div>
      )}
      {/* Main Content */}
      <main
        style={{
          flex: 1,
          padding: "40px 5vw",
          position: "relative",
          minHeight: 0,
          transition: "margin-left 0.25s",
          marginLeft: sidebarOpen ? SIDENAV_WIDTH : 0,
          width: "100%",
          maxWidth: "100vw",
          overflowY: "auto",
          height: "100vh",
        }}
      >
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              position: "absolute",
              left: 20,
              top: 20,
              zIndex: 1002,
              background: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "8px 14px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 18,
              boxShadow: "0 2px 8px rgba(25,118,210,0.08)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
            aria-label="Show sidebar"
          >
            {/* Hamburger icon */}
            <span style={{ display: "inline-block", width: 24, height: 24, position: "relative" }}>
              <span style={{
                display: "block",
                height: 3,
                width: 22,
                background: "#fff",
                borderRadius: 2,
                position: "absolute",
                top: 3,
                left: 1,
                transition: "all 0.2s"
              }} />
              <span style={{
                display: "block",
                height: 3,
                width: 22,
                background: "#fff",
                borderRadius: 2,
                position: "absolute",
                top: 10,
                left: 1,
                transition: "all 0.2s"
              }} />
              <span style={{
                display: "block",
                height: 3,
                width: 22,
                background: "#fff",
                borderRadius: 2,
                position: "absolute",
                top: 17,
                left: 1,
                transition: "all 0.2s"
              }} />
            </span>
            Menu
          </button>
        )}
        <SectionContent page={currentPage} adoptedPets={adoptedPets} onAdoptPet={handleAdoptPet} />
      </main>
    </div>
  );
};

export default Home;