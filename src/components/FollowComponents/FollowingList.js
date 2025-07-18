import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getFollowingAccounts } from "../../feature/followingAccounts/followingAccountSlice";
import FollowingAccountItem from "./FollowingAccountItem";
import { Users } from "lucide-react";

function FollowingList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const storeFollowingAccounts = useSelector(
    (state) => state.followingAccountReducer.followingAccounts
  );
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    if (localStorage.getItem("psnToken") === null) {
      navigate("/unauthorized");
    }
    
    dispatch(getFollowingAccounts());
    
    // Animation effect
    const timer = setTimeout(() => {
      setAnimationProgress(100);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'white',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem 1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '1152px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          marginBottom: '2rem',
          opacity: animationProgress / 100,
          transform: `translateY(${(1 - animationProgress / 100) * 50}px)`,
          transition: 'transform 1s, opacity 1s'
        }}>
          <div style={{
            backgroundColor: '#063970',
            padding: '0.75rem',
            borderRadius: '0.75rem',
            marginRight: '1rem'
          }}>
            <Users size={40} style={{ color: '#FFFFFF' }} />
          </div>
          <h1 style={{
            fontSize: '2.5rem',
            color:'#063970',
            fontWeight: 'bold',
            letterSpacing: '-0.025em'
          }}>Following List</h1>
        </div>

        {/* Following accounts content */}
        <div style={{ 
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '0.5rem',
          backdropFilter: 'blur(4px)',
          padding: '1.5rem',
          opacity: animationProgress / 100,
          transform: `translateY(${(1 - animationProgress / 100) * 30}px)`,
          transition: 'transform 1s, opacity 1s',
          transitionDelay: '0.4s'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: '0 0.5rem'
          }}>
            <tbody>
              {storeFollowingAccounts ? (
                storeFollowingAccounts.map((followingAccount) => {
                  return (
                    <FollowingAccountItem
                      key={followingAccount.id}
                      id={followingAccount.id}
                      firstName={followingAccount.firstName}
                      lastName={followingAccount.lastName}
                    />
                  );
                })
              ) : (
                <tr>
                  <td colSpan="3" style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: 'black'
                  }}>
                    No accounts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FollowingList;