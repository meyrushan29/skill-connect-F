import React, { useEffect, useState } from "react";
import { Hashicon } from "@emeraldpay/hashicon-react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import {
  RiHeartFill,
  RiHeartLine,
  RiMessage2Line,
  RiShareForwardLine,
  RiBookmarkLine,
  RiBookmarkFill,
  RiMoreFill
} from "react-icons/ri";
import { AiFillDelete } from "react-icons/ai";
import { BsFillPencilFill } from "react-icons/bs";
import { Button, Form, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  addLove,
  addComment,
} from "../../feature/followingPost/followingPostSlice";
import MultiImageUploadView from "./multiImageUploadView";
import axios from "axios";

function PostItem(props) {
  const dispatch = useDispatch();

  TimeAgo.addLocale(en);
  const timeAgo = new TimeAgo("en-US");

  const [loveStatus, setLoveStatus] = useState(false);
  const [commentStatus, setCommentStatus] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [sendButtonDisable, setSendButtonDisable] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(
    localStorage.getItem("psnUserId")
  );
  const [postId, setPostId] = useState(props.postId);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedContent, setEditedContent] = useState(props.content || "");
  const [editedHashtags, setEditedHashtags] = useState(props.hashtags || []);
  const [editedImages, setEditedImages] = useState(props.images || []);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [Cedit, setCedit] = useState(true);
  const [CurrentCommentitem, setCurrentCommentitem] = useState(null);
  const [CeditComment, setCeditComment] = useState("");

  // Extract or use provided hashtags
  const hashtags = props.hashtags || extractHashtags(props.content);

  // Function to extract hashtags from content
  function extractHashtags(content) {
    if (!content) return [];
    const hashtagRegex = /#[a-zA-Z0-9_]+/g;
    const matches = content.match(hashtagRegex);
    return matches || [];
  }

  // Format hashtags as a string for display
  function formatHashtags(tags) {
    if (!tags || tags.length === 0) return "";
    return tags.join(" ");
  }

  // Check if post is saved when component mounts
  useEffect(() => {
    checkIfPostIsSaved();
  }, []);

  // Function to check if post is saved
  const checkIfPostIsSaved = () => {
    axios({
      method: "post",
      url: "/api/v1/ispostsaved",
      headers: {
        Authorization: localStorage.getItem("psnToken"),
      },
      data: {
        userId: currentUserId,
        postId: props.postId
      }
    })
    .then((res) => {
      if (res.data.status === "success") {
        setIsSaved(res.data.payload);
      }
    })
    .catch((err) => {
      console.error("Error checking if post is saved:", err);
    });
  };

  function handleLoveClick(e) {
    if (!props.loveList.includes(currentUserId)) {
      setLoveStatus(true);
      dispatch(addLove({ postId: postId, userId: currentUserId }));
    } else {
      setLoveStatus(false);
      dispatch(addLove({ postId: postId, userId: currentUserId }));
    }
  }

  function handleCommentButtonClick(e) {
    setCommentStatus(!commentStatus);
  }
  
  function handleCommentContentChange(e) {
    e.preventDefault();
    setCommentContent(e.target.value);
    if (e.target.value.length > 0 && e.target.value.length <= 100) {
      setSendButtonDisable(false);
    } else {
      setSendButtonDisable(true);
    }
  }

  function sendComment(e) {
    dispatch(
      addComment({
        postId: postId,
        newComment: {
          userId: localStorage.getItem("psnUserId"),
          userFullname:
            localStorage.getItem("psnUserFirstName") +
            " " +
            localStorage.getItem("psnUserLastName"),
          content: commentContent,
        },
      })
    );
    setCommentContent("");
    setSendButtonDisable(true);
  }

  function handlePrevImage() {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? props.images.length - 1 : prevIndex - 1
    );
  }

  function handleNextImage() {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === props.images.length - 1 ? 0 : prevIndex + 1
    );
  }

  const handlesave = () => {
    const endpoint = isSaved ? "/api/v1/unsavepost" : "/api/v1/savepost";
    
    axios({
      method: "post",
      url: endpoint,
      headers: {
        Authorization: localStorage.getItem("psnToken"),
      },
      data: {
        userId: currentUserId,
        postId: props.postId
      }
    })
    .then((res) => {
      if (res.data.status === "success") {
        setIsSaved(!isSaved);
      }
    })
    .catch((err) => {
      console.error("Error saving/unsaving post:", err);
    });
  };

  const handleEditModalOpen = () => {
    setShowOptionsMenu(false);
    setShowEditModal(true);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
  };

  const handleEditSubmit = () => {
    const updatedPostData = {
      id: props.postId,
      content: editedContent,
      hashtags: editedHashtags,
      images: editedImages
    };

    axios({
      method: "put",
      url: "/api/v1/editpost",
      headers: {
        Authorization: localStorage.getItem("psnToken"),
      },
      data: updatedPostData,
    })
      .then((res) => {
        console.log("Post updated successfully");
        setShowEditModal(false);
        window.location.reload();
      })
      .catch((err) => {
        console.error("Error updating post:", err);
      });
  };

  const handleCommentEdit = (commentItem) => {
    setCedit(false);
    setCeditComment(commentItem.content);
    setCurrentCommentitem(commentItem);
  };

  const updateComment = () => {
    var data = {
      "commentEntity": {
        "userId": localStorage.getItem("psnUserId"),
        "userFullname": localStorage.getItem("psnUserFirstName") +
          " " +
          localStorage.getItem("psnUserLastName"),
        "content": CeditComment,
        "id": CurrentCommentitem.id ? CurrentCommentitem.id : ""
      },
      "postId": {
        "id": postId
      }
    };
    axios({
      method: "put",
      url: "/api/v1/editcomment",
      headers: {
        Authorization: localStorage.getItem("psnToken"),
      },
      data: data
    }).then((res) => {
      setCedit(true);
      window.location.reload();
    });
  };

  const deleteComment = (commentItem) => {
    setCeditComment(commentItem.content);
    setCurrentCommentitem(commentItem);
    var data = {
      "commentEntity": {
        "userId": localStorage.getItem("psnUserId"),
        "userFullname": localStorage.getItem("psnUserFirstName") +
          " " +
          localStorage.getItem("psnUserLastName"),
        "content": CeditComment,
        "id": commentItem.id ? commentItem.id : ""
      },
      "postId": {
        "id": postId
      }
    };
    axios({
      method: "put",
      url: "/api/v1/deletecomment",
      headers: {
        Authorization: localStorage.getItem("psnToken"),
      },
      data: data
    }).then((res) => {
      window.location.reload();
    });
  };

  const handleDeleteConfirmOpen = () => {
    setShowOptionsMenu(false);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirmClose = () => {
    setShowDeleteConfirm(false);
  };

  const deletePost = () => {
    axios({
      method: "delete",
      url: "/api/v1/deletepost",
      headers: {
        Authorization: localStorage.getItem("psnToken"),
      },
      data: { id: props.postId },
    })
      .then((res) => {
        console.log("Post deleted successfully");
        setShowDeleteConfirm(false);
        window.location.reload();
      })
      .catch((err) => {
        console.error("Error deleting post:", err);
      });
  };

  const isMyPost = props.userId === currentUserId;

  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      marginBottom: '16px',
      overflow: 'hidden',
      width: '100%',
    }}>
      {/* Post Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            overflow: 'hidden',
            marginRight: '12px'
          }}>
            <Hashicon value={props.userId || "default"} size={40} />
          </div>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span style={{
                margin: 0,
                fontWeight: '600',
                fontSize: '15px',
                color: '#050505'
              }}>
                {props.username || (props.firstName + " " + props.lastName)}
              </span>
              <span style={{
                color: '#65676b',
                fontSize: '15px'
              }}>
                is at {props.location || 'location'}.
              </span>
            </div>
            <div style={{
              fontSize: '12px',
              color: '#65676b',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {timeAgo.format(new Date(props.postDate).getTime())} 
              <span>·</span>
              <svg 
                width="12" 
                height="12" 
                viewBox="0 0 12 12" 
                fill="#65676b"
              >
                <path d="M12 0v12H0V0h12zM6 12H0V2h6v10zm0-12H0v2h6V0zm6 0v2H6V0h6z" fillRule="evenodd"/>
              </svg>
            </div>
          </div>
        </div>
        
        {isMyPost && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowOptionsMenu(!showOptionsMenu)}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '8px',
                cursor: 'pointer',
                borderRadius: '50%',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <RiMoreFill size={20} color="#606266" />
            </button>
            
            {showOptionsMenu && (
              <div style={{
                position: 'absolute',
                right: '0',
                top: '100%',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                zIndex: 100,
                width: '130px',
                border: '1px solid #dddfe2'
              }}>
                <button
                  onClick={handleEditModalOpen}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 16px',
                    width: '100%',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '15px',
                    color: '#050505',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <BsFillPencilFill style={{ marginRight: '12px' }} /> Edit post
                </button>
                <button
                  onClick={handleDeleteConfirmOpen}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 16px',
                    width: '100%',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '15px',
                    color: '#050505',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <AiFillDelete style={{ marginRight: '12px' }} color="#ed4956" /> Delete post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Content */}
      {props.content && (
        <div style={{
          padding: '0 16px',
          fontSize: '15px',
          lineHeight: '1.34',
          color: '#050505',
          marginBottom: '12px'
        }}>
          <p style={{ margin: '0' }}>
            {props.content}
          </p>
          
          {/* Dynamic Hashtags */}
          {hashtags && hashtags.length > 0 && (
            <p style={{ 
              margin: '4px 0 0 0',
              color: '#385898',
              fontSize: '15px'
            }}>
              {formatHashtags(hashtags)}
            </p>
          )}
        </div>
      )}

      {/* Image Carousel */}
      {props.images && props.images.length > 0 && (
        <div style={{
          position: 'relative',
          width: '100%',
        }}>
          <div style={{ 
            width: '100%',
            paddingBottom: '56.25%', // 16:9 aspect ratio
            position: 'relative',
            overflow: 'hidden'
          }}>
            <img 
              src={props.images[currentImageIndex]} 
              alt="Post content"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                top: 0,
                left: 0
              }}
            />
            
            {/* Image counter indicator */}
            {props.images.length > 1 && (
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                borderRadius: '12px',
                padding: '4px 8px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {currentImageIndex + 1}/{props.images.length}
              </div>
            )}
            
            {/* Navigation arrows for multiple images */}
            {props.images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '16px',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: '#050505',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  &#8249;
                </button>
                <button
                  onClick={handleNextImage}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '16px',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: '#050505',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  &#8250;
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Like/Reaction emoji bar */}
      {props.loveList.length > 0 && (
        <div style={{
          padding: '8px 16px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '14px',
          color: '#65676b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <div style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              backgroundColor: '#1877f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid white'
            }}>
              <span style={{ fontSize: '10px', color: 'white' }}>👍</span>
            </div>
            <span>{props.loveList.length}</span>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            {props.commentList && props.commentList.length > 0 && (
              <span>{props.commentList.length} comments</span>
            )}
            <span>{Math.floor(Math.random() * 10)} shares</span>
          </div>
        </div>
      )}

      {/* Action buttons bar */}
      <div style={{
        borderTop: '1px solid #dddfe2',
        borderBottom: '1px solid #dddfe2',
        margin: '8px 16px',
        padding: '4px 0',
        display: 'flex',
        justifyContent: 'space-around'
      }}>
        <button 
          onClick={handleLoveClick}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '8px 16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: props.loveList.includes(currentUserId) ? '#1877f2' : '#65676b',
            borderRadius: '4px',
            transition: 'background-color 0.2s',
            fontSize: '15px',
            fontWeight: '600'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          {props.loveList.includes(currentUserId) ? (
            <RiHeartFill size={20} color="#1877f2" />
          ) : (
            <RiHeartLine size={20} color="#65676b" />
          )}
          Like
        </button>
        
        <button 
          onClick={handleCommentButtonClick}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '8px 16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#65676b',
            borderRadius: '4px',
            transition: 'background-color 0.2s',
            fontSize: '15px',
            fontWeight: '600'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <RiMessage2Line size={20} />
          Comment
        </button>
        
        <button 
          style={{
            background: 'transparent',
            border: 'none',
            padding: '8px 16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#65676b',
            borderRadius: '4px',
            transition: 'background-color 0.2s',
            fontSize: '15px',
            fontWeight: '600'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <RiShareForwardLine size={20} />
          Share
        </button>
      </div>

      {/* Comments section */}
      <div style={{ padding: '0 16px' }}>
        {/* Comment input */}
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '8px 0',
          borderBottom: commentStatus ? '1px solid #dddfe2' : 'none'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            overflow: 'hidden',
            flexShrink: 0
          }}>
            <Hashicon value={currentUserId} size={32} />
          </div>
          <div style={{
            flex: 1,
            backgroundColor: '#f0f2f5',
            borderRadius: '20px',
            padding: '8px 12px',
          }}>
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentContent}
              onChange={handleCommentContentChange}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                backgroundColor: 'transparent',
                color: '#050505'
              }}
            />
          </div>
          <button
            onClick={sendComment}
            disabled={sendButtonDisable}
            style={{
              background: 'none',
              border: 'none',
              color: sendButtonDisable ? '#c7c7c7' : '#1877f2',
              fontWeight: '600',
              cursor: sendButtonDisable ? 'default' : 'pointer',
              padding: '0 4px',
              fontSize: '13px',
              alignSelf: 'center'
            }}
          >
            →
          </button>
        </div>

        {/* Comments list */}
        {commentStatus && props.commentList && props.commentList.length > 0 && (
          <div style={{
            paddingTop: '8px',
            paddingBottom: '8px'
          }}>
            {props.commentList.map((commentItem, index) => (
              <div 
                key={index}
                style={{
                  display: 'flex',
                  gap: '8px',
                  marginBottom: '8px'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  flexShrink: 0
                }}>
                  <Hashicon value={commentItem.userId} size={32} />
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{
                    backgroundColor: '#f0f2f5',
                    borderRadius: '12px',
                    padding: '8px 12px',
                    display: 'inline-block'
                  }}>
                    <div style={{
                      fontWeight: '600',
                      fontSize: '13px',
                      color: '#050505',
                      marginBottom: '2px'
                    }}>
                      {commentItem.userFullname}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#050505'
                    }}>
                      {commentItem.content}
                    </div>
                  </div>
                  
                  <div style={{ 
                    display: 'flex',
                    gap: '16px',
                    marginTop: '4px',
                    fontSize: '12px',
                    color: '#65676b',
                    paddingLeft: '12px'
                  }}>
                    <span style={{ cursor: 'pointer' }}>Like</span>
                    <span style={{ cursor: 'pointer' }}>Reply</span>
                    <span>{timeAgo.format(new Date().getTime())}</span>
                    {commentItem.userId === currentUserId && (
                      <>
                        <span 
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleCommentEdit(commentItem)}
                        >
                          Edit
                        </span>
                        <span 
                          style={{ cursor: 'pointer' }}
                          onClick={() => deleteComment(commentItem)}
                        >
                          Delete
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comment edit form */}
      {!Cedit && (
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid #dddfe2'
        }}>
          <textarea
            value={CeditComment}
            onChange={(e) => setCeditComment(e.target.value)}
            style={{
              width: '100%',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '14px',
              border: '1px solid #dddfe2',
              resize: 'none',
              marginBottom: '8px',
              minHeight: '60px',
              backgroundColor: '#f0f2f5'
            }}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px'
          }}>
            <button
              onClick={() => setCedit(true)}
              style={{
                padding: '6px 16px',
                backgroundColor: '#e4e6eb',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                color: '#050505',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dddfe2'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e4e6eb'}
            >
              Cancel
            </button>
            <button
              onClick={updateComment}
              style={{
                padding: '6px 16px',
                backgroundColor: '#1877f2',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                color: 'white',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#166fe5'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1877f2'}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={handleEditModalClose} centered>
        <Modal.Header closeButton style={{ borderBottom: '1px solid #dddfe2' }}>
          <Modal.Title style={{ fontSize: '20px', fontWeight: '700' }}>
            Edit Post
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '16px' }}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                placeholder="Say something about this..."
                style={{ 
                  minHeight: '100px',
                  border: 'none',
                  fontSize: '16px',
                  resize: 'none',
                  outline: 'none'
                }}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label style={{ fontSize: '14px', fontWeight: '600', color: '#65676b' }}>
                Add hashtags
              </Form.Label>
              <Form.Control
                type="text"
                value={editedHashtags ? editedHashtags.join(" ") : ""}
                onChange={(e) => {
                  const tags = e.target.value.split(" ")
                    .map(tag => tag.trim())
                    .filter(tag => tag.startsWith("#"));
                  setEditedHashtags(tags);
                }}
                placeholder="#hashtag1 #hashtag2 #hashtag3"
                style={{
                  backgroundColor: '#f0f2f5',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '14px'
                }}
              />
            </Form.Group>
            
            <Form.Group>
              <Form.Label style={{ fontSize: '14px', fontWeight: '600', color: '#65676b' }}>
                Images
              </Form.Label>
              <Form.Control
                type="text"
                value={editedImages ? editedImages.join(", ") : ""}
                onChange={(e) => {
                  const urls = e.target.value.split(",").map(url => url.trim()).filter(url => url);
                  setEditedImages(urls);
                }}
                placeholder="Paste image URLs separated by commas"
                style={{
                  backgroundColor: '#f0f2f5',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '14px'
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: '1px solid #dddfe2', padding: '8px 16px' }}>
          <Button 
            variant="outline-secondary" 
            onClick={handleEditModalClose}
            style={{
              backgroundColor: '#e4e6eb',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 16px',
              fontSize: '15px',
              fontWeight: '600',
              color: '#050505'
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="primary"
            onClick={handleEditSubmit}
            style={{ 
              backgroundColor: '#1877f2', 
              borderColor: '#1877f2',
              borderRadius: '6px',
              padding: '6px 16px',
              fontSize: '15px',
              fontWeight: '600'
            }}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={handleDeleteConfirmClose} centered>
        <Modal.Header closeButton style={{ borderBottom: '1px solid #dddfe2' }}>
          <Modal.Title style={{ fontSize: '20px', fontWeight: '700' }}>
            Delete Post?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '16px' }}>
          <p style={{ margin: 0, fontSize: '15px', color: '#050505' }}>
            Are you sure you want to delete this post?
          </p>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#65676b' }}>
            This action cannot be undone.
          </p>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: '1px solid #dddfe2', padding: '8px 16px' }}>
          <Button 
            variant="outline-secondary" 
            onClick={handleDeleteConfirmClose}
            style={{
              backgroundColor: '#e4e6eb',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 16px',
              fontSize: '15px',
              fontWeight: '600',
              color: '#050505'
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="danger"
            onClick={deletePost}
            style={{
              backgroundColor: '#fa3e3e',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 16px',
              fontSize: '15px',
              fontWeight: '600'
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PostItem;