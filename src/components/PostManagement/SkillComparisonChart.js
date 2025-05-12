import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { 
  Award, 
  TrendingUp, 
  ChevronUp, 
  ChevronDown,
  Zap,
  Target,
  BarChart2,
  RefreshCw
} from 'lucide-react';

// Skill categories from backend (can be extended as needed)
const SKILL_CATEGORIES = [
  'Programming',
  'Design',
  'Marketing',
  'Writing',
  'Video Production',
  'Photography'
];

// Motivational quotes
const MOTIVATIONAL_QUOTES = [
  "Progress is not achieved by luck or accident, but by working on yourself daily.",
  "Every skill you acquire doubles your odds of success.",
  "Small improvements compound into remarkable results.",
  "Your only limit is the amount of action you take.",
  "Skill is only developed by hours and hours of beating on your craft.",
  "You don't have to be great to start, but you have to start to be great.",
  "The expert in anything was once a beginner.",
  "Your skills determine your ceiling. Keep raising it."
];

function SkillComparisonChart() {
  const dispatch = useDispatch();
  const [skillData, setSkillData] = useState([]);
  const [userSkillTotal, setUserSkillTotal] = useState(0);
  const [averageSkillTotal, setAverageSkillTotal] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [quote, setQuote] = useState('');
  const [skillGrowth, setSkillGrowth] = useState([]);
  const [skillRank, setSkillRank] = useState({ rank: 0, total: 0 });
  const [loading, setLoading] = useState(false);
  const [progressData, setProgressData] = useState([]);
  const [error, setError] = useState(null);
  
  // Get user info from Redux store
  const storeFollowingPosts = useSelector((state) => state.followingPostReducer?.followingPosts || []);
  const currentUser = useSelector((state) => state.userReducer?.userInfo || { id: "current-user" });
  
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';

  useEffect(() => {
    // Select a random motivational quote
    const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    setQuote(randomQuote);
    
    // Load data from APIs
    fetchUserData();
    
  }, [currentUser?.id]);

  const fetchUserData = async () => {
    if (!currentUser?.id) {
      generateSampleData();
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch user progress from the API
      const userProgressResponse = await axios.post(`${API_BASE_URL}/progress/user`, {
        id: currentUser.id
      });
      
      // Fetch following users progress
      const followingProgressResponse = await axios.post(`${API_BASE_URL}/progress/following`, {
        id: currentUser.id
      });
      
      // Fetch user posts to analyze skills
      const userPostsResponse = await axios.post(`${API_BASE_URL}/myposts`, {
        id: currentUser.id
      });
      
      // Fetch following posts to compare with
      const followingPostsResponse = await axios.post(`${API_BASE_URL}/followingposts`, {
        id: currentUser.id
      });
      
      if (
        userProgressResponse?.data?.status === 'success' &&
        followingProgressResponse?.data?.status === 'success'
      ) {
        // Process progress data
        const userProgress = userProgressResponse.data.data || [];
        const followingProgress = followingProgressResponse.data.data || [];
        
        setProgressData([...userProgress]);
        
        // Process post data for skill analysis
        processPostData(userPostsResponse.data.data || [], followingPostsResponse.data.data || []);
        
        // Calculate skill growth from progress data
        calculateSkillGrowth(userProgress, followingProgress);
      } else {
        // If progress API fails, fall back to posts for analysis
        if (storeFollowingPosts.length > 0) {
          processPostData(userPostsResponse.data.data || [], storeFollowingPosts);
        } else {
          generateSampleData();
        }
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load skill data');
      
      // Fall back to sample data if API calls fail
      generateSampleData();
    } finally {
      setLoading(false);
    }
  };
  
  const calculateSkillGrowth = (userProgress, followingProgress) => {
    if (!userProgress || userProgress.length === 0) return;
    
    // Group progress by skill category and calculate growth
    const skillGrowthMap = {};
    
    // Process user progress entries
    userProgress.forEach(progress => {
      const { skillCategory, currentLevel, previousLevel, updatedAt, createdAt } = progress;
      
      if (!skillGrowthMap[skillCategory]) {
        skillGrowthMap[skillCategory] = {
          name: skillCategory,
          value: currentLevel || 1,
          previousValue: previousLevel || 0,
          lastUpdated: new Date(updatedAt || createdAt)
        };
      } else if (new Date(updatedAt || createdAt) > skillGrowthMap[skillCategory].lastUpdated) {
        // Update if this is a more recent entry
        skillGrowthMap[skillCategory].value = currentLevel || 1;
        skillGrowthMap[skillCategory].previousValue = previousLevel || 0;
        skillGrowthMap[skillCategory].lastUpdated = new Date(updatedAt || createdAt);
      }
    });
    
    // Calculate growth percentage for each skill
    const growthData = Object.values(skillGrowthMap).map(skill => {
      const growth = skill.previousValue > 0 
        ? ((skill.value - skill.previousValue) / skill.previousValue) * 100 
        : 100; // If previousValue is 0, consider it 100% growth
      
      return {
        name: skill.name,
        value: skill.value,
        growth: isFinite(growth) ? growth : 0
      };
    });
    
    // Sort by growth percentage (highest first)
    const sortedGrowth = growthData.sort((a, b) => b.growth - a.growth);
    
    setSkillGrowth(sortedGrowth.length > 0 ? sortedGrowth : generateSampleGrowthData());
  };

  const processPostData = (userPosts = [], followingPosts = []) => {
    // Combine all posts for analysis
    const allPosts = [...userPosts, ...followingPosts];
    
    if (allPosts.length === 0) {
      generateSampleData();
      return;
    }
    
    // Group posts by user and count by skill category
    const userSkillCounts = {};
    const allUsers = new Set();
    
    // Process each post to extract skill information
    allPosts.forEach(post => {
      const userId = post.user?.id;
      if (!userId) return;
      
      allUsers.add(userId);
      
      if (!userSkillCounts[userId]) {
        userSkillCounts[userId] = {
          userId,
          userName: `${post.user?.firstName || ''} ${post.user?.lastName || ''}`.trim(),
          isCurrentUser: userId === currentUser?.id,
          total: 0
        };
        
        // Initialize all skill categories with 0
        SKILL_CATEGORIES.forEach(category => {
          userSkillCounts[userId][category] = 0;
        });
      }
      
      // Extract skill category from post content or type
      const content = post.post?.content || '';
      const postType = post.post?.postType || '';
      let skillCategory = '';
      
      // Check if post has a skillCategory field
      if (post.post?.skillCategory) {
        skillCategory = post.post.skillCategory;
      } 
      // Check if postType is 'skill' and try to extract category
      else if (postType === 'skill') {
        // Try to detect category from content
        for (const category of SKILL_CATEGORIES) {
          if (content.toLowerCase().includes(category.toLowerCase())) {
            skillCategory = category;
            break;
          }
        }
      } 
      // For other post types, check content for skill mentions
      else {
        for (const category of SKILL_CATEGORIES) {
          if (content.toLowerCase().includes(category.toLowerCase())) {
            skillCategory = category;
            break;
          }
        }
      }
      
      // If no category detected, skip counting this post
      if (!skillCategory) return;
      
      // Increment the count for this skill category
      if (userSkillCounts[userId][skillCategory] !== undefined) {
        userSkillCounts[userId][skillCategory]++;
        userSkillCounts[userId].total++;
      }
    });
    
    // Convert to array and sort by total
    const userData = Object.values(userSkillCounts).sort((a, b) => b.total - a.total);
    
    // Find current user data or create default
    const currentUserData = userData.find(user => user.isCurrentUser) || {
      userId: currentUser?.id,
      userName: 'You',
      isCurrentUser: true,
      total: 0
    };
    
    // Calculate user's total and average total
    const userTotal = currentUserData.total || 0;
    let avgTotal = 0;
    
    if (userData.length > 0) {
      avgTotal = userData.reduce((sum, user) => sum + user.total, 0) / userData.length;
    }
    
    // Generate comparison data for each skill category
    const skillComparison = [];
    
    SKILL_CATEGORIES.forEach(category => {
      const totalPosts = userData.reduce((sum, user) => sum + (user[category] || 0), 0);
      const averageValue = userData.length > 0 ? totalPosts / userData.length : 0;
      const userValue = currentUserData[category] || 0;
      
      skillComparison.push({
        name: category,
        average: Math.round(averageValue * 10) / 10,
        you: userValue,
        fill: getColorForValue(userValue, averageValue)
      });
    });
    
    // Calculate skill rank
    const userRank = userData.findIndex(user => user.isCurrentUser) + 1;
    const totalUsers = userData.length;
    
    // Update state with real data
    setSkillData(skillComparison);
    setUserSkillTotal(userTotal);
    setAverageSkillTotal(avgTotal);
    setSkillRank({
      rank: userRank > 0 ? userRank : (totalUsers > 0 ? totalUsers + 1 : 1),
      total: Math.max(totalUsers, 1)
    });
    
    // If we couldn't find real growth data, generate sample
    if (skillGrowth.length === 0) {
      setSkillGrowth(generateSampleGrowthData());
    }
  };

  const generateSampleData = () => {
    // Create sample skill comparison data
    const sampleData = SKILL_CATEGORIES.map(category => {
      const average = Math.floor(Math.random() * 10) + 1;
      const you = Math.floor(Math.random() * 15);
      
      return {
        name: category,
        average,
        you,
        fill: getColorForValue(you, average)
      };
    });
    
    // Create sample user skill level data
    const userTotal = Math.floor(Math.random() * 30) + 5;
    const avgTotal = Math.floor(Math.random() * 20) + 5;
    
    // Create sample growth data
    const sampleGrowth = generateSampleGrowthData();
    
    // Create sample rank
    const sampleRank = {
      rank: Math.floor(Math.random() * 5) + 1,
      total: Math.floor(Math.random() * 20) + 10
    };
    
    setSkillData(sampleData);
    setUserSkillTotal(userTotal);
    setAverageSkillTotal(avgTotal);
    setSkillGrowth(sampleGrowth);
    setSkillRank(sampleRank);
  };
  
  const generateSampleGrowthData = () => {
    return SKILL_CATEGORIES.map(category => ({
      name: category,
      value: Math.floor(Math.random() * 10) + 1,
      growth: Math.floor(Math.random() * 50)
    })).sort((a, b) => b.growth - a.growth);
  };

  const getColorForValue = (value, average) => {
    if (value > average * 1.5) return '#4CAF50'; // Much higher than average
    if (value > average) return '#8BC34A';       // Higher than average
    if (value >= average * 0.8) return '#FFC107'; // Around average
    if (value >= average * 0.5) return '#FF9800'; // Below average
    return '#F44336';                           // Much below average
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };
  
  const refreshData = () => {
    fetchUserData();
  };

  // Custom progress bar component
  const ProgressBar = ({ value, max, color }) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    
    return (
      <div style={{
        width: '100%',
        height: '12px',
        backgroundColor: '#e0e0e0',
        borderRadius: '6px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          backgroundColor: color || '#1877f2',
          borderRadius: '6px',
          transition: 'width 0.5s ease-out'
        }} />
      </div>
    );
  };

  // Calculate percentage for skill level visualization
  const calculatePercentage = (value, max) => {
    return Math.min(Math.max((value / Math.max(max, 1)) * 100, 0), 100);
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      position: 'relative'
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
      {loading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          borderRadius: '12px'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '3px solid #e0e0e0',
              borderTopColor: '#1877f2',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ margin: 0, color: '#65676b', fontSize: '14px' }}>
              Loading skill data...
            </p>
          </div>
        </div>
      )}
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: '#e3f2fd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <BarChart2 size={24} color="#1877f2" />
          </div>
          <div>
            <h3 style={{ margin: '0', color: '#1c1e21', fontSize: '18px', fontWeight: '600' }}>
              Skill Comparison
            </h3>
            <p style={{ margin: '0', color: '#65676b', fontSize: '14px' }}>
              See how your skills compare to others
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={refreshData}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              color: '#1877f2',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '6px',
              fontSize: '14px',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f2f5';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            disabled={loading}
            title="Refresh data"
          >
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
          </button>
          <button
            onClick={toggleDetails}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              color: '#1877f2',
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f2f5';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {showDetails ? 'Less Details' : 'More Details'}
            {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#ffebee',
          color: '#d32f2f',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '16px',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {error}
        </div>
      )}

      {/* Main Skill Summary */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '20px'
      }}>
        {/* Overall Skill Level */}
        <div style={{
          flex: '1',
          minWidth: '180px',
          backgroundColor: '#f0f2f5',
          padding: '16px',
          borderRadius: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{
              backgroundColor: '#1877f2',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Award size={18} color="white" />
            </div>
            <h4 style={{ margin: '0', fontSize: '16px', color: '#1c1e21' }}>
              Your Skill Level
            </h4>
          </div>
          
          {/* Custom skill gauge */}
          <div style={{ height: '140px', marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '120px', height: '120px' }}>
              {/* Background circle */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                backgroundColor: '#e0e0e0',
                overflow: 'hidden'
              }} />
              
              {/* Fill circle based on percentage */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: `conic-gradient(#1877f2 0% ${calculatePercentage(userSkillTotal, Math.max(userSkillTotal * 1.5, 10))}%, transparent ${calculatePercentage(userSkillTotal, Math.max(userSkillTotal * 1.5, 10))}% 100%)`,
                transition: 'all 0.5s ease-out'
              }} />
              
              {/* Inner white circle to create gauge effect */}
              <div style={{
                position: 'absolute',
                top: '15%',
                left: '15%',
                width: '70%',
                height: '70%',
                borderRadius: '50%',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: '700',
                color: '#1877f2'
              }}>
                {userSkillTotal}
              </div>
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#65676b' }}>
              Total Skill Posts
            </p>
          </div>
        </div>
        
        {/* Skill Ranking */}
        <div style={{
          flex: '1',
          minWidth: '180px',
          backgroundColor: '#f0f2f5',
          padding: '16px',
          borderRadius: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{
              backgroundColor: '#FF9800',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Target size={18} color="white" />
            </div>
            <h4 style={{ margin: '0', fontSize: '16px', color: '#1c1e21' }}>
              Your Ranking
            </h4>
          </div>
          
          <div style={{ 
            height: '140px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column'
          }}>
            <span style={{ 
              fontSize: '48px', 
              fontWeight: '800', 
              color: skillRank.rank === 1 ? '#ffc107' : '#1877f2',
              textShadow: skillRank.rank === 1 ? '0 2px 8px rgba(255, 193, 7, 0.2)' : 'none',
            }}>
              #{skillRank.rank}
            </span>
            <span style={{ 
              fontSize: '16px', 
              color: '#65676b',
              marginTop: '8px'
            }}>
              of {skillRank.total} users
            </span>
          </div>
          
          <div style={{ 
            textAlign: 'center',
            backgroundColor: skillRank.rank <= 3 ? '#FFF8E1' : 'transparent',
            padding: skillRank.rank <= 3 ? '8px' : '0',
            borderRadius: '8px',
            marginTop: '10px',
            display: skillRank.rank <= 3 ? 'block' : 'none'
          }}>
            <p style={{ 
              margin: '0', 
              fontSize: '14px', 
              color: skillRank.rank === 1 ? '#F57C00' : '#65676b',
              fontWeight: skillRank.rank === 1 ? '600' : '400'
            }}>
              {skillRank.rank === 1 ? '🏆 Top Performer!' : 
               skillRank.rank === 2 ? '🥈 Almost there!' : 
               skillRank.rank === 3 ? '🥉 Great job!' : ''}
            </p>
          </div>
        </div>
        
        {/* Top Growing Skill */}
        <div style={{
          flex: '1',
          minWidth: '180px',
          backgroundColor: '#f0f2f5',
          padding: '16px',
          borderRadius: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{
              backgroundColor: '#4CAF50',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TrendingUp size={18} color="white" />
            </div>
            <h4 style={{ margin: '0', fontSize: '16px', color: '#1c1e21' }}>
              Fastest Growing Skill
            </h4>
          </div>
          
          {skillGrowth.length > 0 && (
            <>
              <div style={{ 
                height: '140px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexDirection: 'column'
              }}>
                <span style={{ fontSize: '24px', fontWeight: '700', color: '#1c1e21' }}>
                  {skillGrowth[0].name}
                </span>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px',
                  color: '#4CAF50',
                  margin: '8px 0'
                }}>
                  <TrendingUp size={16} />
                  <span style={{ fontSize: '18px', fontWeight: '600' }}>
                    +{Math.round(skillGrowth[0].growth)}%
                  </span>
                </div>
                <span style={{ fontSize: '14px', color: '#65676b' }}>
                  {skillGrowth[0].value} posts
                </span>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: '0', fontSize: '14px', color: '#65676b' }}>
                  Keep improving!
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Motivational Quote */}
      <div style={{
        backgroundColor: 'rgba(24, 119, 242, 0.05)',
        padding: '16px',
        borderRadius: '12px',
        marginBottom: '20px',
        borderLeft: '4px solid #1877f2'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Zap size={20} color="#1877f2" />
          <p style={{ 
            margin: '0', 
            fontSize: '15px', 
            fontStyle: 'italic', 
            color: '#1c1e21',
            fontWeight: '500'
          }}>
            "{quote}"
          </p>
        </div>
      </div>
     
      {/* Detailed Skill Breakdown (shows when expanded) */}
      {showDetails && (
        <div style={{
          marginTop: '24px',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <h4 style={{ 
            margin: '0 0 16px',
            fontSize: '16px',
            color: '#1c1e21',
            fontWeight: '600'
          }}>
            Skill Category Breakdown
          </h4>
          
          {/* Custom bar charts for skill comparison */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '16px',
            marginBottom: '24px'
          }}>
            {skillData.map((skill, index) => (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#1c1e21' }}>
                    {skill.name}
                  </span>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <span style={{ fontSize: '14px', color: '#1877f2' }}>
                      You: {skill.you}
                    </span>
                    <span style={{ fontSize: '14px', color: '#4CAF50' }}>
                      Avg: {skill.average}
                    </span>
                  </div>
                </div>
                
                {/* Your skill bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ 
                    fontSize: '12px', 
                    color: '#65676b', 
                    width: '30px', 
                    textAlign: 'right' 
                  }}>
                    You
                  </span>
                  <div style={{ flex: 1 }}>
                    <ProgressBar 
                      value={skill.you} 
                      max={Math.max(skill.you, skill.average) * 1.5} 
                      color="#1877f2" 
                    />
                  </div>
                </div>
                
                {/* Average skill bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ 
                    fontSize: '12px', 
                    color: '#65676b', 
                    width: '30px', 
                    textAlign: 'right' 
                  }}>
                    Avg
                  </span>
                  <div style={{ flex: 1 }}>
                    <ProgressBar 
                      value={skill.average} 
                      max={Math.max(skill.you, skill.average) * 1.5} 
                      color="#4CAF50" 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Growth Metrics Table */}
          <div style={{ marginTop: '24px' }}>
            <h4 style={{ 
              margin: '0 0 16px',
              fontSize: '16px',
              color: '#1c1e21',
              fontWeight: '600'
            }}>
              Skill Growth
            </h4>
            
            <div style={{
              border: '1px solid #e4e6eb',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr',
                borderBottom: '1px solid #e4e6eb',
                backgroundColor: '#f0f2f5',
              }}>
                <div style={{ padding: '10px 16px', fontWeight: '600', color: '#1c1e21' }}>Skill</div>
                <div style={{ padding: '10px 16px', fontWeight: '600', color: '#1c1e21' }}>Level</div>
                <div style={{ padding: '10px 16px', fontWeight: '600', color: '#1c1e21' }}>Growth</div>
              </div>
              
              {skillGrowth.map((skill, index) => (
                <div 
                  key={index}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr',
                    borderBottom: index < skillGrowth.length - 1 ? '1px solid #e4e6eb' : 'none',
                    backgroundColor: index % 2 === 0 ? 'white' : '#fafafa',
                  }}
                >
                  <div style={{ padding: '10px 16px', color: '#1c1e21' }}>{skill.name}</div>
                  <div style={{ padding: '10px 16px', color: '#1c1e21' }}>{skill.value}</div>
                  <div style={{ 
                    padding: '10px 16px', 
                    color: skill.growth > 0 ? '#4CAF50' : '#F44336',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {skill.growth > 0 ? (
                      <>
                        <TrendingUp size={14} />
                        +{Math.round(skill.growth)}%
                      </>
                    ) : skill.growth < 0 ? (
                      <>
                        <ChevronDown size={14} />
                        {Math.round(skill.growth)}%
                      </>
                    ) : (
                      '0%'
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Data Section */}
          {progressData.length > 0 && (
            <div style={{ marginTop: '24px' }}>
              <h4 style={{ 
                margin: '0 0 16px',
                fontSize: '16px',
                color: '#1c1e21',
                fontWeight: '600'
              }}>
                Your Progress Timeline
              </h4>
              
              <div style={{
                border: '1px solid #e4e6eb',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 2fr',
                  borderBottom: '1px solid #e4e6eb',
                  backgroundColor: '#f0f2f5',
                }}>
                  <div style={{ padding: '10px 16px', fontWeight: '600', color: '#1c1e21' }}>Skill</div>
                  <div style={{ padding: '10px 16px', fontWeight: '600', color: '#1c1e21' }}>Previous</div>
                  <div style={{ padding: '10px 16px', fontWeight: '600', color: '#1c1e21' }}>Current</div>
                  <div style={{ padding: '10px 16px', fontWeight: '600', color: '#1c1e21' }}>Last Updated</div>
                </div>
                
                {progressData.map((progress, index) => (
                  <div 
                    key={index}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr 2fr',
                      borderBottom: index < progressData.length - 1 ? '1px solid #e4e6eb' : 'none',
                      backgroundColor: index % 2 === 0 ? 'white' : '#fafafa',
                    }}
                  >
                    <div style={{ padding: '10px 16px', color: '#1c1e21' }}>{progress.skillCategory}</div>
                    <div style={{ padding: '10px 16px', color: '#1c1e21' }}>{progress.previousLevel || 0}</div>
                    <div style={{ 
                      padding: '10px 16px', 
                      color: '#1877f2',
                      fontWeight: '500'
                    }}>
                      {progress.currentLevel || 1}
                    </div>
                    <div style={{ 
                      padding: '10px 16px', 
                      color: '#65676b',
                      fontSize: '14px'
                    }}>
                      {new Date(progress.updatedAt || progress.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Skill Improvement Tips */}
          <div style={{
            marginTop: '24px',
            backgroundColor: '#f0f2f5',
            padding: '16px',
            borderRadius: '12px'
          }}>
            <h4 style={{ 
              margin: '0 0 12px',
              fontSize: '16px',
              color: '#1c1e21',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Zap size={16} color="#1877f2" />
              Tips to Improve
            </h4>
            
            <ul style={{ 
              margin: '0',
              paddingLeft: '24px',
              color: '#1c1e21'
            }}>
              <li style={{ marginBottom: '8px' }}>
                <span style={{ fontWeight: '500' }}>Post consistently</span> - Share your skills regularly to build momentum
              </li>
              <li style={{ marginBottom: '8px' }}>
                <span style={{ fontWeight: '500' }}>Diversify your skills</span> - Try to develop in multiple areas
              </li>
              <li style={{ marginBottom: '8px' }}>
                <span style={{ fontWeight: '500' }}>Engage with others</span> - Comment and interact with other skill posts
              </li>
              <li style={{ marginBottom: '8px' }}>
                <span style={{ fontWeight: '500' }}>Document your progress</span> - Show your improvement journey
              </li>
              <li>
                <span style={{ fontWeight: '500' }}>Track skill levels</span> - Update your progress using the progress feature
              </li>
            </ul>
          </div>
          
          {/* Update Progress Button */}
          <div style={{ 
            marginTop: '16px', 
            display: 'flex', 
            justifyContent: 'center' 
          }}>
            <button 
              onClick={() => window.location.href = '/settings?tab=progress'}
              style={{
                backgroundColor: '#1877f2',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
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
              <TrendingUp size={16} />
              Update Your Skill Progress
            </button>
          </div>
        </div>
      )}
      
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default SkillComparisonChart;