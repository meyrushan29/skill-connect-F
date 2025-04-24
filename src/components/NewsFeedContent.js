import React, { useEffect, useState } from "react";
import PostCompose from "./PostCompose";
import PostItem from "./PostItem";
import { Spinner } from "react-bootstrap";
import { getFollowingPosts } from "../feature/followingPost/followingPostSlice";
import { useDispatch, useSelector } from "react-redux";
import { Utensils, PenLine, X } from 'lucide-react';

function NewsFeedContent() {
  const dispatch = useDispatch();
  const storeFollowingPosts = useSelector((state) => state.followingPostReducer.followingPosts);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [showPostCompose, setShowPostCompose] = useState(false);

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
      overflow: 'hidden',
      border: '1.5px solid #063970',
      borderRadius:'5px'
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden'
      }}>
                
      </div>

      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '2rem',
        opacity: animationProgress / 100,
        transform: `translateY(${(1 - animationProgress / 100) * 20}px)`,
        transition: 'transform 0.8s, opacity 0.8s',
      }}>
        <div style={{
          backgroundColor: '#ffff',
          padding: '0.75rem',
          borderRadius: '0.75rem',
          marginRight: '1rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          
        </div>
        <h1 style={{
          fontSize: '2.4rem',
          fontWeight: 'bold',
          color: '#063970',
          margin: 0,
          fontFamily: '"Lily Script One", cursive',

        }}>Skill Connect</h1>
      </div>

      {/* Create Post Button */}
      <div style={{
        width: '100%',
        maxWidth: '600px',
        opacity: animationProgress / 100,
        transform: `translateY(${(1 - animationProgress / 100) * 15}px)`,
        transition: 'transform 0.8s, opacity 0.8s',
        transitionDelay: '0.1s',
        marginBottom: '2rem'
      }}>
        <button 
          onClick={togglePostCompose}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            padding: '1rem',
            backgroundColor: '#063970',
            color: 'white',
            borderRadius: '1rem',
            border: 'none',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'transform 0.2s, background-color 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#063990'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#063970'}
        >
          <PenLine size={20} style={{ marginRight: '0.5rem' }} />
          Create a New Post
        </button>
      </div>
      
      {/* Post Compose Modal */}
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
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
            width: '100%',
            maxWidth: '1200px',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative',
            animation: 'slideIn 0.3s ease-out forwards',
          }}>
            <button 
              onClick={togglePostCompose}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#19304f',
                padding: '0.5rem',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 10
              }}
            >
              <X size={24} />
            </button>
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ color: '#19304f', marginBottom: '1rem' }}>Create a New Post</h3>
              <PostCompose onPostComplete={togglePostCompose} />
            </div>
          </div>
        </div>
      )}
      
      {/* Following Posts Header */}
      <div style={{
        textAlign: 'center',
        marginTop: '1rem',
        marginBottom: '1.5rem',
        opacity: animationProgress / 100,
        transform: `translateY(${(1 - animationProgress / 100) * 10}px)`,
        transition: 'transform 0.8s, opacity 0.8s',
        transitionDelay: '0.2s'
      }}>
        <h3 style={{
          color: 'black',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          position: 'relative',
          display: 'inline-block',
          padding: '0 1rem'
        }}>
          Following Posts
          <div style={{
            position: 'absolute',
            bottom: '-8px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60px',
            height: '3px',
            backgroundColor: '#ffffff',
            borderRadius: '2px'
          }}></div>
        </h3>
      </div>
      
      {/* Posts Container */}
      <div style={{
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(500px, 1fr))", // More responsive grid
  gap: "1.5rem",
  width: "85%",
  maxWidth: "1500px",
  margin: "0 auto",
  opacity: animationProgress / 100,
  transform: `translateY(${(1 - animationProgress / 100) * 5}px)`,
  transition: "transform 0.8s, opacity 0.8s",
  transitionDelay: "0.3s"
}}
>
        {storeFollowingPosts !== null ? (
          storeFollowingPosts.length > 0 ? (
            storeFollowingPosts.map((post, index) => (
              <div 
                key={post.post.id}
                style={{
                  transform: `translateY(${(1 - animationProgress / 100) * 10}px)`,
                  opacity: animationProgress / 100,
                  transition: 'transform 0.8s, opacity 0.8s',
                  transitionDelay: `${0.3 + index * 0.05}s`
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
              padding: '3rem',
              backgroundColor: 'white',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            }}>
              <p style={{ color: '#19304f', fontSize: '1.125rem' }}>No posts from people you follow yet. Start following more chefs!</p>
            </div>
          )
        ) : (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '3rem'
          }}>
            <Spinner animation="border" style={{ color: '#063970' }} />
          </div>
        )}
      </div>
      
      {/* Decorative elements */}
      <div style={{
        position: 'fixed',
        bottom: '0',
        left: '0',
        width: '100%',
        height: '150px',
        background: 'linear-gradient(to top, rgba(180, 83, 9, 0.1), transparent)',
        zIndex: '-1'
      }}></div>
      
      {/* Floating decorative elements */}
      <div style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: '-1'
      }}>
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            style={{
              position: 'absolute',
              borderRadius: '50%',
              backgroundColor: '#2557cd',
              opacity: 0.05,
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 200 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `scale(${animationProgress / 100})`,
              transition: 'transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transitionDelay: `${i * 0.05}s`
            }}
          />
        ))}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default NewsFeedContent;