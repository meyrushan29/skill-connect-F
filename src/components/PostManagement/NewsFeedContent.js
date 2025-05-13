import React, { useEffect, useState } from "react";
import PostCompose from "./PostCompose";
import PostItem from "./PostItem";
import SkillComparisonChart from "./SkillComparisonChart"; // Import our new component
import { Spinner } from "react-bootstrap";
import { getFollowingPosts } from "../../feature/followingPost/followingPostSlice";
import { useDispatch, useSelector } from "react-redux";
import { 
  Utensils, 
  PenLine, 
  X, 
  Sparkles, 
  Users, 
  Star, 
  Image, 
  Video, 
  Smile, 
  Calendar, 
  MapPin,
  MessageCircle,
  ChevronUp,
  ChevronDown,
  Minimize2,
  Maximize2,
  Power
} from 'lucide-react';
import ChatBot from "./ChatBot";

function NewsFeedContent() {
  const dispatch = useDispatch();
  const storeFollowingPosts = useSelector((state) => state.followingPostReducer.followingPosts);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [showPostCompose, setShowPostCompose] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatbotMinimized, setChatbotMinimized] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);

  useEffect(() => {
    dispatch(getFollowingPosts());
    
    // Animation effect
    const timer = setTimeout(() => {
      setAnimationProgress(100);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [dispatch]);

  const togglePostCompose = () => {
    setShowPostCompose(!showPostCompose);
  };

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
    setChatbotMinimized(false);
  };

  const toggleChatbotMinimize = () => {
    setChatbotMinimized(!chatbotMinimized);
  };

  const closeChatbot = () => {
    setShowChatbot(false);
    setChatbotMinimized(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      color: '#1c1e21',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '0',
      position: 'relative',
    }}>
      {/* Header Section */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        backgroundColor: 'white',
        borderBottom: '1px solid #dadde1',
        width: '100%',
        position: 'sticky',
        top: '0',
        zIndex: '1000',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div style={{
            backgroundColor: '#1877f2',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>
            <Sparkles size={24} color="white" />
          </div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1877f2',
            margin: 0,
            fontFamily: 'Helvetica, Arial, sans-serif',
          }}>Skill Connect</h1>
        </div>
        
        {/* Toggle Chat Button */}
        <button
          onClick={toggleChatbot}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '30px',
            backgroundColor: showChatbot ? '#1877f2' : '#f0f2f5',
            border: 'none',
            color: showChatbot ? 'white' : '#65676b',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          }}
          onMouseOver={(e) => {
            if (!showChatbot) {
              e.currentTarget.style.backgroundColor = '#e4e6eb';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
            }
          }}
          onMouseOut={(e) => {
            if (!showChatbot) {
              e.currentTarget.style.backgroundColor = '#f0f2f5';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
            }
          }}
        >
          <MessageCircle size={18} />
          <span>
            {showChatbot ? 'Close Chat' : 'Open Chat'}
          </span>
        </button>
      </div>

      {/* Main Content Container */}
      <div style={{
        width: '680px',
        maxWidth: '100%',
        padding: '20px',
        marginTop: '0',
      }}>
        {/* Skill Comparison Chart Component */}
        <SkillComparisonChart />
        
        {/* Create Post Section - Enhanced */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
        }}
        >
          <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: '#e3f2fd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Sparkles size={22} color="#1877f2" />
            </div>
            <button 
              onClick={togglePostCompose}
              style={{
                flex: 1,
                padding: '10px 16px',
                backgroundColor: '#f0f2f5',
                color: '#65676b',
                borderRadius: '50px',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.3s ease',
                fontWeight: '400',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#e4e6eb';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f2f5';
              }}
            >
             What skills do you have?
            </button>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid #e4e6eb', margin: '12px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-around', paddingTop: '4px' }}>
            <button
              onClick={togglePostCompose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'none',
                border: 'none',
                color: '#65676b',
                cursor: 'pointer',
                padding: '10px 16px',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                fontSize: '15px',
                fontWeight: '600',
                flex: 1,
                justifyContent: 'center',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f2f5';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Video size={24} color="#f3425f" />
              
            </button>
            <button
              onClick={togglePostCompose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'none',
                border: 'none',
                color: '#65676b',
                cursor: 'pointer',
                padding: '10px 16px',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                fontSize: '15px',
                fontWeight: '600',
                flex: 1,
                justifyContent: 'center',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f2f5';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Image size={24} color="#45bd62" />
              <span>Share Your Skill</span>
            </button>
            <button
              onClick={togglePostCompose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'none',
                border: 'none',
                color: '#65676b',
                cursor: 'pointer',
                padding: '10px 16px',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                fontSize: '15px',
                fontWeight: '600',
                flex: 1,
                justifyContent: 'center',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f2f5';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Smile size={24} color="#f7b928" />
            
            </button>
          </div>
        </div>

        {/* Posts Container */}
        <div>
          {storeFollowingPosts !== null ? (
            storeFollowingPosts.length > 0 ? (
              storeFollowingPosts.map((post, index) => (
                <div 
                  key={post.post.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    marginBottom: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                  }}
                >
                  <PostItem
                    postId={post.post.id}
                    userId={post.user.id}
                    firstName={post.user.firstName || ""}
                    lastName={post.user.lastName || ""}
                    content={post.post.content}
                    image={post.post.image}
                    images={post.post.images}
                    loveList={post.post.love}
                    shareList={post.post.share}
                    commentList={post.post.comment}
                    postDate={post.post.createdAt}
                    postType={post.post.postType}
                  />
                </div>
              ))
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '48px 24px',
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}>
                <div style={{
                  width: '96px',
                  height: '96px',
                  backgroundColor: '#e3f2fd',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <Users size={48} color="#1877f2" />
                </div>
                <h3 style={{ 
                  color: '#1c1e21', 
                  fontSize: '24px',
                  marginBottom: '8px', 
                  fontWeight: '700'
                }}>
                  No Posts Yet
                </h3>
                <p style={{ 
                  color: '#65676b', 
                  fontSize: '16px',
                  marginBottom: '24px', 
                  lineHeight: '1.5'
                }}>
                  When your friends share, you'll see their posts here
                </p>
                <button style={{
                  padding: '10px 32px',
                  backgroundColor: '#1877f2',
                  color: 'white',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s, transform 0.2s',
                  fontSize: '16px',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#166fe5';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#1877f2';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                >
                  Find People
                </button>
              </div>
            )
          ) : (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '48px',
            }}>
              <div style={{ 
                backgroundColor: 'white',
                padding: '32px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
              }}>
                <Spinner animation="border" style={{ color: '#1877f2', width: '32px', height: '32px' }} />
                <p style={{ margin: 0, color: '#65676b', fontSize: '16px' }}>Loading your feed...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Chatbot Container with Slide Animation */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 1100,
          opacity: showChatbot ? 1 : 0,
          transform: showChatbot ? 'translateY(0) scale(1)' : 'translateY(100%) scale(0.9)',
          transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          pointerEvents: showChatbot ? 'auto' : 'none',
        }}
      >
        <div 
          style={{
            width: '380px',
            height: chatbotMinimized ? 'auto' : '580px',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Enhanced Chatbot Header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e4e6eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #1877f2 0%, #0d66c7 100%)',
            color: 'white',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <MessageCircle size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
                  AI Assistant
                </h3>
                <span style={{ fontSize: '12px', opacity: 0.8 }}>
                  Online
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={toggleChatbotMinimize}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'white',
                  padding: '8px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {chatbotMinimized ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              <button
                onClick={closeChatbot}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'white',
                  padding: '8px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>
          
          {/* Chatbot Content */}
          {!chatbotMinimized && (
            <div style={{ 
              height: 'calc(580px - 68px)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <ChatBot />
            </div>
          )}
          
          {/* Minimized State */}
          {chatbotMinimized && (
            <div style={{
              padding: '20px',
              textAlign: 'center',
              color: '#65676b',
              backgroundColor: '#f8f9fa',
            }}>
              <p style={{ margin: 0, fontSize: '14px' }}>
                Click to expand chat
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Chat Button (when closed) */}
      {!showChatbot && (
        <button
          onClick={toggleChatbot}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#1877f2',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(24, 119, 242, 0.3)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.1) translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(24, 119, 242, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1) translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(24, 119, 242, 0.3)';
          }}
        >
          <MessageCircle size={28} />
        </button>
      )}
      
      {/* Post Compose Modal - Enhanced */}
      {showPostCompose && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          animation: 'fadeIn 0.3s ease-out',
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.16)',
            width: '680px',
            maxWidth: '95%',
            maxHeight: '90vh',
            overflow: 'hidden',
            position: 'relative',
            animation: 'slideInDown 0.3s ease-out',
          }}>
            <div style={{
              borderBottom: '1px solid #dadde1',
              padding: '20px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative'
            }}>
              <h3 style={{ 
                color: '#1c1e21', 
                margin: 0, 
                fontSize: '20px', 
                fontWeight: '700',
              }}>Create post</h3>
              <button 
                onClick={togglePostCompose}
                style={{
                  background: '#e4e6eb',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#4b4f56',
                  padding: '8px',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  right: '20px',
                  width: '36px',
                  height: '36px',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#dadde1';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#e4e6eb';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <X size={20} />
              </button>
            </div>
            <div style={{ 
              padding: '20px',
              overflowY: 'auto',
              maxHeight: 'calc(90vh - 72px)',
            }}>
              <PostCompose onPostComplete={togglePostCompose} />
            </div>
          </div>
        </div>
      )}

      {/* Enhanced CSS Animations and Global Styles */}
      <style jsx>{`
        * {
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f0f2f5;
          line-height: 1.5;
        }
        
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f0f2f5;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #bec3c9;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #8a8d91;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideInDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes pulseRing {
          0% {
            transform: scale(0.33);
          }
          80%,
          100% {
            opacity: 0;
          }
        }
        
        .pulse-ring {
          content: '';
          width: 60px;
          height: 60px;
          border: 3px solid #1877f2;
          border-radius: 50%;
          position: absolute;
          animation: pulseRing 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        }
        
        @media (max-width: 768px) {
          .feed-container {
            width: 100% !important;
            padding: 16px !important;
          }
          
          .chatbot-container {
            width: 100% !important;
            left: 8px !important;
            right: 8px !important;
            bottom: 8px !important;
            border-radius: 12px !important;
          }
          
          .floating-chat-button {
            bottom: 16px !important;
            right: 16px !important;
          }
        }
        
        @media (max-width: 480px) {
          .header {
            padding: 8px 12px !important;
          }
          
          .header h1 {
            fontSize: '20px' !important;
          }
        }
      `}</style>
    </div>
  );
}

export default NewsFeedContent;