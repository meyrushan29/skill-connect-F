import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, MessageCircle, Home, Users, UserPlus, Search, ChevronRight } from "lucide-react";

// Import the three existing components
import FollowerList from "./FollowerList";
import FollowingList from "./FollowingList";
import AllAccounts from "./AllAccounts";

function SocialNetworkContainer() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("following");
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    if (localStorage.getItem("psnToken") === null) {
      navigate("/unauthorized");
    }
    
    // Animation effect
    const timer = setTimeout(() => {
      setAnimationProgress(100);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  const NavItem = ({ icon, label, isActive, onClick }) => (
    <div 
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0.75rem 1rem',
        borderRadius: '0.5rem',
        marginBottom: '0.5rem',
        cursor: 'pointer',
        backgroundColor: isActive ? '#E7F3FF' : 'transparent',
        color: isActive ? '#1877F2' : '#65676B',
        fontWeight: isActive ? 'bold' : 'normal',
        transition: 'all 0.2s ease',
        
      }}
    >
      {icon}
      <span style={{ marginLeft: '0.75rem' }}>{label}</span>
      {isActive && <ChevronRight size={16} style={{ marginLeft: 'auto' }} />}
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case "following":
        return (
          <div className="component-wrapper" style={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            borderRadius: '8px'
          }}>
            <FollowingList />
          </div>
        );
      case "followers":
        return (
          <div className="component-wrapper" style={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            borderRadius: '8px'
          }}>
            <FollowerList />
          </div>
        );
      case "discover":
        return (
          <div className="component-wrapper" style={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            borderRadius: '8px'
          }}>
            <AllAccounts />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F0F2F5',
      display: 'flex',
      flexDirection: 'column',
      border: '1.5px solid #063970',
      borderRadius:'2px'
    }}>
      {/* Header - Facebook style */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #E4E6EB',
        padding: '0.75rem 1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            backgroundColor: '#063970',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: '0.75rem'
          }}>
            <Users size={24} style={{ color: '#FFFFFF' }} />
          </div>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#063970',
          }}>Friends Connect</h1>
        </div>
      </div>

      <div style={{
        display: 'flex',
        flex: 1,
        padding: '1rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
      }}>
        {/* Left sidebar - Navigation */}
        <div style={{
          width: '280px',
          marginRight: '1rem',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          padding: '1rem',
          height: 'fit-content',
          position: 'sticky',
          top: '80px',
          opacity: animationProgress / 100,
          transform: `translateX(${(1 - animationProgress / 100) * -30}px)`,
          transition: 'transform 1s, opacity 1s'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: '#050505',
            marginBottom: '1rem',
            padding: '0.5rem 1rem'
          }}>
            Connections
          </h2>
          
          <NavItem 
            icon={<UserPlus size={20} />} 
            label="Following" 
            isActive={activeTab === "following"} 
            onClick={() => setActiveTab("following")} 
          />
          
          <NavItem 
            icon={<Users size={20} />} 
            label="Followers" 
            isActive={activeTab === "followers"} 
            onClick={() => setActiveTab("followers")} 
          />
          
          <NavItem 
            icon={<Search size={20} />} 
            label="Discover People" 
            isActive={activeTab === "discover"} 
            onClick={() => setActiveTab("discover")} 
          />
        </div>

        {/* Main content */}
        <div style={{
          flex: 1,
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          padding: '0',
          opacity: animationProgress / 100,
          transform: `translateY(${(1 - animationProgress / 100) * 30}px)`,
          transition: 'transform 1s, opacity 1s',
          transitionDelay: '0.3s',
          overflow: 'hidden'
        }}>
          {renderContent()}
        </div>
        
      </div>
    </div>
  );
}

export default SocialNetworkContainer;