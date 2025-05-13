import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import EducationalContentShare from './EducationalContentShare';
import EducationalContentFeed from './EducationalContentFeed';
import './EducationalContent.css';

function EducationalContentPage() {
  const userId = localStorage.getItem("psnUserId");
  const [animationProgress, setAnimationProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('feed'); // 'share' or 'feed'

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationProgress(100);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="app-container">
      {/* Animated background elements */}
      <div className="animated-background">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i}
            className="background-circle"
            style={{
              width: `${Math.random() * 300 + 50}px`,
              height: `${Math.random() * 300 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `scale(${animationProgress / 100})`,
              transitionDelay: `${i * 0.05}s`,
            }}
          />
        ))}
      </div>

      {/* Header and Logo */}
      <div className="edu-header">
        <div className="edu-logo">
          <BookOpen size={28} />
        </div>
        <h1>Educational Content</h1>
      </div>
      
      {/* Navigation Tabs */}
      <div className="main-tabs">
        <button 
          className={`main-tab ${activeSection === 'share' ? 'active' : ''}`}
          onClick={() => setActiveSection('share')}
        >
          <Sparkles size={18} />
          <span>Share Content</span>
        </button>
        <button 
          className={`main-tab ${activeSection === 'feed' ? 'active' : ''}`}
          onClick={() => setActiveSection('feed')}
        >
          <BookOpen size={18} />
          <span>Browse Content</span>
        </button>
      </div>
      
      <div className="content-sections">
        <div className={`section ${activeSection === 'share' ? 'active' : ''}`}>
          {activeSection === 'share' && <EducationalContentShare userId={userId} />}
        </div>
        
        <div className={`section ${activeSection === 'feed' ? 'active' : ''}`}>
          {activeSection === 'feed' && <EducationalContentFeed userId={userId} />}
        </div>
      </div>
    </div>
  );
}

export default EducationalContentPage;