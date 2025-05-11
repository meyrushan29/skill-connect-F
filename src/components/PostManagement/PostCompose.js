import React, { useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Hashicon } from "@emeraldpay/hashicon-react";
import { useDispatch, useSelector } from "react-redux";
import { getFollowingPosts } from "../../feature/followingPost/followingPostSlice";
import MultiImageUpload from "./multiImageUpload";
import { 
  Share2, 
  Image, 
  Send, 
  ChevronDown, 
  Lightbulb, 
  HelpCircle, 
  Briefcase, 
  Palette, 
  Compass, 
  Zap, 
  MessageCircle,
  X,
  Camera,
  Film,
  Globe,
  Users,
  CheckCircle
} from 'lucide-react';

function PostCompose({ onPostComplete }) {
  const dispatch = useDispatch();
  const userIds = localStorage.getItem("psnUserId");
  const storeFollowingPosts = useSelector((state) => state.followingPostReducer.followingPosts);

  const [userFullname, setUserFullname] = useState(
    localStorage.getItem("psnUserFirstName") +
    " " +
    localStorage.getItem("psnUserLastName")
  );
  const [userId, setUserId] = useState(localStorage.getItem("psnUserId"));
  const [postContent, setPostContent] = useState("");
  const [postContentCount, setPostContentCount] = useState(0);
  const [disablePostButton, setDisablePostButton] = useState(true);
  const [file, setFile] = useState(null);
  const [MultiImages, setMultiImages] = useState(null);
  const [MultiImagesUrl, setMultiImagesUrl] = useState(null);
  const [file64String, setFile64String] = useState(null);
  const [file64StringWithType, setFile64StringWithType] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [isPrivacyDropdownOpen, setIsPrivacyDropdownOpen] = useState(false);
  const [selectedPrivacy, setSelectedPrivacy] = useState({
    id: "public",
    name: "Public",
    icon: <Globe size={16} />,
    description: "Anyone can see this post"
  });
  
  const [selectedPostType, setSelectedPostType] = useState({
    id: "insight",
    name: "Share Insight",
    icon: <Lightbulb size={18} />,
    color: "#6366f1"
  });
  
  // Post type options
  const postTypes = [
    {
      id: "insight",
      name: "Share Insight",
      icon: <Lightbulb size={18} />,
      color: "#6366f1",
      placeholder: "Share your knowledge or insights..."
    },
    {
      id: "question",
      name: "Ask Question",
      icon: <HelpCircle size={18} />,
      color: "#10b981",
      placeholder: "What would you like to know?"
    },
    {
      id: "opportunity",
      name: "Job/Opportunity",
      icon: <Briefcase size={18} />,
      color: "#2557cd",
      placeholder: "Share a job opening or opportunity..."
    },
    {
      id: "showcase",
      name: "Portfolio Showcase",
      icon: <Palette size={18} />,
      color: "#ec4899",
      placeholder: "Show off your latest work or project..."
    },
    {
      id: "event",
      name: "Event/Meetup",
      icon: <Compass size={18} />,
      color: "#3b82f6",
      placeholder: "Share an event or gathering..."
    },
    {
      id: "resource",
      name: "Learning Resource",
      icon: <Zap size={18} />,
      color: "#8b5cf6",
      placeholder: "Share a helpful resource or tutorial..."
    },
    {
      id: "discussion",
      name: "Start Discussion",
      icon: <MessageCircle size={18} />,
      color: "#64748b",
      placeholder: "What's on your mind to discuss?"
    }
  ];

  // Privacy options
  const privacyOptions = [
    {
      id: "public",
      name: "Public",
      icon: <Globe size={16} />,
      description: "Anyone can see this post"
    },
    {
      id: "network",
      name: "Network",
      icon: <Users size={16} />,
      description: "Your connections can see this"
    },
    {
      id: "private",
      name: "Private",
      icon: <Share2 size={16} />,
      description: "Only you can see this"
    }
  ];
  
  var marray = [];

  function showSuccessMessage(inputMessage) {
    toast.success(inputMessage, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      style: {
        borderRadius: '8px',
        fontFamily: 'system-ui'
      }
    });
  }

  function showFailMessage(inputMessage) {
    toast.error(inputMessage, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      style: {
        borderRadius: '8px',
        fontFamily: 'system-ui'
      }
    });
  }

  function handleContentChange(e) {
    setPostContent(e.target.value);
    setPostContentCount(e.target.value.length);
    if (e.target.value.trim().length === 0 || e.target.value.length > 500) {
      setDisablePostButton(true);
    } else {
      setDisablePostButton(false);
    }
  }

  async function createPost(inputContent) {
    setIsPosting(true);
    try {
      const response = await axios({
        method: "post",
        url: "/api/v1/insertpost",
        headers: {
          Authorization: localStorage.getItem("psnToken"),
        },
        data: {
          id: null,
          userId: localStorage.getItem("psnUserId"),
          content: inputContent,
          image: file64StringWithType,
          createdAt: null,
          love: null,
          share: null,
          comment: null,
          images: MultiImagesUrl,
          postType: selectedPostType.id,
          privacy: selectedPrivacy.id
        },
      });
  
      if (response.data !== null && response.data.status === "success") {
        showSuccessMessage(`${selectedPostType.name} posted successfully!`);
        // Reset form
        setPostContent("");
        setPostContentCount(0);
        setDisablePostButton(true);
        setFile64String(null);
        setFile64StringWithType(null);
        setMultiImages(null);
        setMultiImagesUrl(null);
        
        // Refresh posts
        dispatch(getFollowingPosts());
        
        // Call onPostComplete if provided
        if (onPostComplete) {
          onPostComplete();
        }
      }
  
      if (response.data !== null && response.data.status === "fail") {
        showFailMessage("Failed to post. Please try again.");
      }
    } catch (error) {
      console.error("Post creation error:", error);
      showFailMessage("An error occurred. Please try again.");
    } finally {
      setIsPosting(false);
    }
  }

  function onUploadFileChange(e) {
    setFile64String(null);
    if (e.target.files < 1 || !e.target.validity.valid) {
      return;
    }
    compressImageFile(e);
  }

  function fileToBase64(file, cb) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(null, reader.result);
    };
    reader.onerror = function (error) {
      cb(error, null);
    };
  }

  async function compressImageFile(event) {
    const imageFile = event.target.files[0];
    const options = {
      maxWidthOrHeight: 1024,
      useWebWorker: true,
      maxSizeMB: 1
    };
    
    try {
      const compressedFile = await imageCompression(imageFile, options);
      fileToBase64(compressedFile, (err, result) => {
        if (result) {
          setFile(result);
          setFile64StringWithType(result);
          setFile64String(String(result.split(",")[1]));
        }
      });
    } catch (error) {
      console.error("Image compression error:", error);
      showFailMessage("Failed to process image. Please try again.");
      setFile64String(null);
    }
  }

  async function compressImageFileTest(images) {
    const imageFile = images;
    const options = {
      maxWidthOrHeight: 1000,
      useWebWorker: true,
    };
    
    try {
      const compressedFile = await imageCompression(imageFile, options);
      fileToBase64(compressedFile, (err, result) => {
        if (result) {
          let url = `${result}`;
          marray.push(url);
          setMultiImagesUrl(marray);
          return result;
        }
      });
    } catch (error) {
      console.error("Multi-image compression error:", error);
      setFile64String(null);
    }
  }

  async function handleCreatePost(e) {
    e.preventDefault();
    if (postContent.trim() || file64StringWithType || (MultiImagesUrl && MultiImagesUrl.length > 0)) {
      await createPost(postContent);
    } else {
      showFailMessage("Please add some content or media to your post.");
    }
  }

  async function multiHandle(mediaItems) {
    if (mediaItems && mediaItems.length > 0) {
      const base64Strings = mediaItems.map(item => item.base64);
      setMultiImagesUrl(base64Strings);
    }
  }

  function selectPostType(type) {
    setSelectedPostType(type);
    setIsTypeDropdownOpen(false);
  }

  function selectPrivacy(privacy) {
    setSelectedPrivacy(privacy);
    setIsPrivacyDropdownOpen(false);
  }

  const getPlaceholder = () => {
    const type = postTypes.find(type => type.id === selectedPostType.id);
    return type ? type.placeholder : "Share your skills or ask a question...";
  };

  const removeUploadedImage = () => {
    setFile64StringWithType(null);
    setFile64String(null);
    setFile(null);
  };

  return (
    <div style={{
      margin: '0 auto',
      width: '100%',
      maxWidth: '680px',
      padding: '0'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '0',
        padding: '16px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <ToastContainer />

        <Form style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 1
        }}>
          {/* User Info and Post Type Selection */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            marginBottom: '12px',
            gap: '8px'
          }}>
            {/* User Avatar */}
            <div style={{
              marginRight: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f0f2f5',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              overflow: 'hidden'
            }}>
              {userId ? (
                <Hashicon value={userId} size={32} />
              ) : (
                <Share2 size={20} style={{ color: '#65676b' }} />
              )}
            </div>

            {/* User Info and Controls */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div style={{
                  fontWeight: '600',
                  fontSize: '14px',
                  color: '#1c1e21'
                }}>
                  {userFullname || 'SKILLINK User'}
                </div>
              </div>

              {/* Privacy and Post Type Controls */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {/* Privacy Selector */}
                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => setIsPrivacyDropdownOpen(!isPrivacyDropdownOpen)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: '#e4e6eb',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#1c1e21'
                    }}
                  >
                    <span style={{ marginRight: '4px', display: 'flex', alignItems: 'center' }}>{selectedPrivacy.icon}</span>
                    <span>{selectedPrivacy.name}</span>
                    <ChevronDown size={12} style={{ marginLeft: '4px' }} />
                  </button>
                  
                  {isPrivacyDropdownOpen && (
                    <div style={{
                      position: 'absolute',
                      top: 'calc(100% + 4px)',
                      left: 0,
                      zIndex: 1000,
                      background: 'white',
                      borderRadius: '8px',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
                      width: '200px',
                      padding: '8px'
                    }}>
                      {privacyOptions.map((privacy) => (
                        <button
                          key={privacy.id}
                          type="button"
                          onClick={() => selectPrivacy(privacy)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            padding: '8px',
                            borderRadius: '4px',
                            border: 'none',
                            background: selectedPrivacy.id === privacy.id ? '#e7f3ff' : 'transparent',
                            cursor: 'pointer',
                            textAlign: 'left'
                          }}
                        >
                          <span style={{ marginRight: '8px', color: '#65676b' }}>{privacy.icon}</span>
                          <div>
                            <div style={{ fontWeight: '600', fontSize: '14px', color: '#1c1e21' }}>{privacy.name}</div>
                            <div style={{ fontSize: '12px', color: '#65676b' }}>{privacy.description}</div>
                          </div>
                          {selectedPrivacy.id === privacy.id && (
                            <CheckCircle size={16} style={{ marginLeft: 'auto', color: '#1877f2' }} />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Post Type Selector */}
                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: `${selectedPostType.color}15`,
                      border: `1px solid ${selectedPostType.color}30`,
                      borderRadius: '4px',
                      padding: '4px 8px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: selectedPostType.color
                    }}
                  >
                    <span style={{ marginRight: '4px', display: 'flex', alignItems: 'center' }}>{selectedPostType.icon}</span>
                    <span>{selectedPostType.name}</span>
                    <ChevronDown size={12} style={{ marginLeft: '4px' }} />
                  </button>
                  
                  {isTypeDropdownOpen && (
                    <div style={{
                      position: 'absolute',
                      top: 'calc(100% + 4px)',
                      left: 0,
                      zIndex: 1000,
                      background: 'white',
                      borderRadius: '8px',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
                      width: '240px',
                      padding: '8px',
                      maxHeight: '300px',
                      overflowY: 'auto'
                    }}>
                      {postTypes.map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => selectPostType(type)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            padding: '8px',
                            borderRadius: '4px',
                            border: 'none',
                            background: selectedPostType.id === type.id ? `${type.color}15` : 'transparent',
                            cursor: 'pointer',
                            textAlign: 'left'
                          }}
                          onMouseOver={(e) => {
                            if (selectedPostType.id !== type.id) {
                              e.currentTarget.style.background = '#f0f2f5';
                            }
                          }}
                          onMouseOut={(e) => {
                            if (selectedPostType.id !== type.id) {
                              e.currentTarget.style.background = 'transparent';
                            }
                          }}
                        >
                          <span style={{ marginRight: '8px', color: type.color }}>{type.icon}</span>
                          <span style={{ color: '#1c1e21', fontWeight: '600' }}>{type.name}</span>
                          {selectedPostType.id === type.id && (
                            <CheckCircle size={16} style={{ marginLeft: 'auto', color: type.color }} />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Text Area */}
          <Form.Group style={{ marginBottom: '12px' }}>
            <Form.Control
              as="textarea"
              placeholder={getPlaceholder()}
              value={postContent}
              onChange={handleContentChange}
              style={{
                resize: 'none',
                height: '90px',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #dddfe2',
                fontSize: '16px',
                boxShadow: 'none',
                background: 'white',
                fontFamily: 'system-ui',
                lineHeight: '1.34'
              }}
            />
          </Form.Group>

          {/* Character Count */}
          <div style={{
            fontSize: '12px',
            color: postContentCount > 450 ? (postContentCount > 500 ? '#e41e3f' : '#2557cd') : '#65676b',
            marginBottom: '12px',
            textAlign: 'right'
          }}>
            {postContentCount}/500
          </div>

          {/* Media Preview */}
          {file64StringWithType && (
            <div style={{
              position: 'relative',
              marginBottom: '12px',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid #dddfe2'
            }}>
              <img 
                src={file64StringWithType} 
                alt="preview" 
                style={{
                  width: '100%',
                  maxHeight: '400px',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
              <button
                type="button"
                onClick={removeUploadedImage}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: 'rgba(0, 0, 0, 0.8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <X size={18} />
              </button>
            </div>
          )}

          {/* Media Upload Section */}
          <div style={{
            background: '#f0f2f5',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '12px',
            border: '1px solid #dddfe2'
          }}>
            <MultiImageUpload multiHandle={multiHandle} />
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #dddfe2',
            paddingTop: '12px'
          }}>
            <div style={{
              display: 'flex',
              gap: '4px'
            }}>
              {/* Add to post label */}
              <span style={{
                fontSize: '15px',
                color: '#65676b',
                fontWeight: '600',
                padding: '6px 12px',
                display: 'flex',
                alignItems: 'center'
              }}>
                Add to your post
              </span>
              
              {/* Media buttons */}
              <button
                type="button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  borderRadius: '50%',
                  color: '#45bd62'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#f0f2f5'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <Camera size={20} />
              </button>
              <button
                type="button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  borderRadius: '50%',
                  color: '#f3425f'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#f0f2f5'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <Film size={20} />
              </button>
            </div>
            
            {/* Post Button */}
            <Button
              onClick={handleCreatePost}
              disabled={disablePostButton || isPosting}
              style={{
                background: disablePostButton || isPosting ? '#e4e6eb' : '#1877f2',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 16px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: disablePostButton || isPosting ? '#bec3c9' : 'white',
                cursor: disablePostButton || isPosting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '15px',
                minWidth: '80px',
                height: '36px',
                justifyContent: 'center'
              }}
            >
              {isPosting ? (
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid #bec3c9',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
              ) : (
                <span>Post</span>
              )}
            </Button>
          </div>
        </Form>
      </div>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export default PostCompose;