import React, { useEffect, useState } from "react";
import { Hashicon } from "@emeraldpay/hashicon-react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import {
  RiHeartFill,
  RiHeartLine,
  RiMessage2Fill,
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
} from "../feature/followingPost/followingPostSlice";
import MultiImageUploadView from "../feature/multiImageUploadView";
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
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
      margin: '0 0 16px 0',
      overflow: 'hidden',
      width: '100%',
      maxWidth: '470px',
      border: '1px solid #dbdbdb'
    }}>
      {/* Post Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            overflow: 'hidden',
            marginRight: '10px'
          }}>
            <Hashicon value={props.userId || "default"} size={32} />
          </div>
          <div>
            <p style={{
              margin: 0,
              fontWeight: '600',
              fontSize: '14px'
            }}>
              {props.username || (props.firstName + props.lastName)}
            </p>
            {props.location && (
              <p style={{
                margin: 0,
                fontSize: '12px',
                color: '#262626'
              }}>
                {props.location}
              </p>
            )}
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
                cursor: 'pointer'
              }}
            >
              <RiMoreFill size={20} />
            </button>
            
            {showOptionsMenu && (
              <div style={{
                position: 'absolute',
                right: '0',
                top: '100%',
                backgroundColor: 'white',
                borderRadius: '4px',
                boxShadow: '0 0 5px rgba(0,0,0,0.2)',
                zIndex: 100,
                width: '120px'
              }}>
                <button
                  onClick={handleEditModalOpen}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 12px',
                    width: '100%',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    borderBottom: '1px solid #f0f0f0'
                  }}
                >
                  <BsFillPencilFill style={{ marginRight: '8px' }} /> Edit
                </button>
                <button
                  onClick={handleDeleteConfirmOpen}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 12px',
                    width: '100%',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: '#ed4956'
                  }}
                >
                  <AiFillDelete style={{ marginRight: '8px' }} /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image Carousel */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingBottom: '100%', // Square aspect ratio
        backgroundColor: '#f0f0f0',
        overflow: 'hidden'
      }}>
        {props.images && props.images.length > 0 ? (
          <div style={{ height: '100%', width: '100%', position: 'absolute' }}>
            <img 
              src={props.images[currentImageIndex]} 
              alt="Post content"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute'
              }}
            />
            
            {/* Image counter indicator */}
            {props.images.length > 1 && (
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                borderRadius: '12px',
                padding: '2px 8px',
                fontSize: '12px',
                fontWeight: '500'
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
                    left: '10px',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  &lt;
                </button>
                <button
                  onClick={handleNextImage}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '10px',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  &gt;
                </button>
              </>
            )}
          </div>
        ) : (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f7f7f7'
          }}>
            <span style={{ color: '#aaa', fontSize: '14px' }}>No image</span>
          </div>
        )}
      </div>

      {/* Interaction bar (likes, comments, save) */}
      <div style={{
        display: 'flex',
        padding: '8px 12px',
      }}>
        <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
          <button 
            onClick={handleLoveClick}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {props.loveList.includes(currentUserId) ? (
              <RiHeartFill size={24} color="#ed4956" />
            ) : (
              <RiHeartLine size={24} color="#262626" />
            )}
          </button>
          
          <button 
            onClick={handleCommentButtonClick}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <RiMessage2Fill size={24} color="#262626" />
          </button>
        </div>
        
        <button 
          onClick={handlesave}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '0',
            cursor: 'pointer'
          }}
        >
          {isSaved ? (
            <RiBookmarkFill size={24} color="#262626" />
          ) : (
            <RiBookmarkLine size={24} color="#262626" />
          )}
        </button>
      </div>

      {/* Like count */}
      {props.loveList.length > 0 && (
        <div style={{
          padding: '0 12px 4px',
        }}>
          <span style={{
            fontWeight: '600',
            fontSize: '14px',
            color: '#262626'
          }}>
            {props.loveList.length} {props.loveList.length === 1 ? 'like' : 'likes'}
          </span>
        </div>
      )}

      {/* Post content: username and caption */}
      <div style={{
        padding: '0 12px 8px',
        fontSize: '14px',
        lineHeight: '1.4'
      }}>
        <p style={{ margin: '0' }}>
          <span style={{ 
            fontWeight: '600', 
            marginRight: '4px',
            color: '#262626'
          }}>
            {props.username || (props.firstName + props.lastName)}
          </span>
          <span style={{ color: '#262626' }}>{props.content}</span>
        </p>
        
        {/* Dynamic Hashtags */}
        {hashtags && hashtags.length > 0 && (
          <p style={{ 
            margin: '4px 0 0 0',
            color: '#00376b',
            fontSize: '14px'
          }}>
            {formatHashtags(hashtags)}
          </p>
        )}
      </div>
      
      {/* View all comments link */}
      {props.commentList && props.commentList.length > 2 && !commentStatus && (
        <div style={{
          padding: '0 12px 4px',
          fontSize: '14px',
          color: '#8e8e8e'
        }}>
          <button 
            onClick={handleCommentButtonClick}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '0',
              fontSize: '14px',
              color: '#8e8e8e',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            View all {props.commentList.length} comments
          </button>
        </div>
      )}

      {/* Preview of comments (showing just 2) */}
      {props.commentList && props.commentList.length > 0 && !commentStatus && (
        <div style={{
          padding: '0 12px 8px',
          fontSize: '14px'
        }}>
          {props.commentList.slice(0, 2).map((comment, index) => (
            <p key={index} style={{ margin: '0 0 2px 0' }}>
              <span style={{ 
                fontWeight: '600', 
                marginRight: '4px',
                color: '#262626'
              }}>
                {comment.userFullname.split(' ')[0]}
              </span>
              <span style={{ color: '#262626' }}>{comment.content}</span>
            </p>
          ))}
        </div>
      )}

      {/* Post time */}
      <div style={{
        padding: '0 12px 12px',
        fontSize: '10px',
        color: '#8e8e8e',
        textTransform: 'uppercase',
        letterSpacing: '0.2px'
      }}>
        {timeAgo.format(new Date(props.postDate).getTime())}
      </div>

      {/* Comments section when expanded */}
      {commentStatus && (
        <div style={{
          borderTop: '1px solid #efefef',
          padding: '12px',
          backgroundColor: '#ffffff'
        }}>
          <div style={{
            maxHeight: '200px',
            overflowY: 'auto',
            marginBottom: '12px'
          }}>
            {props.commentList && props.commentList.map((commentItem, index) => (
              <div 
                key={index}
                style={{
                  display: 'flex',
                  marginBottom: '10px',
                  position: 'relative'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  marginRight: '8px'
                }}>
                  <Hashicon value={commentItem.userId} size={32} />
                </div>
                
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0', fontSize: '14px' }}>
                    <span style={{ 
                      fontWeight: '600', 
                      marginRight: '4px',
                      color: '#262626'
                    }}>
                      {commentItem.userFullname.split(' ')[0]}
                    </span>
                    <span style={{ color: '#262626' }}>{commentItem.content}</span>
                  </p>
                  <div style={{ 
                    display: 'flex',
                    gap: '16px',
                    marginTop: '4px',
                    fontSize: '12px',
                    color: '#8e8e8e'
                  }}>
                    <span>Reply</span>
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

          {/* Comment input */}
          <div style={{
            display: 'flex',
            borderTop: '1px solid #efefef',
            paddingTop: '12px'
          }}>
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentContent}
              onChange={handleCommentContentChange}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                padding: '0'
              }}
            />
            <button
              onClick={sendComment}
              disabled={sendButtonDisable}
              style={{
                background: 'none',
                border: 'none',
                color: sendButtonDisable ? '#c7c7c7' : '#0095f6',
                fontWeight: '600',
                cursor: sendButtonDisable ? 'default' : 'pointer',
                padding: '0 0 0 8px',
                fontSize: '14px'
              }}
            >
              Post
            </button>
          </div>
        </div>
      )}

      {/* Comment edit form */}
      {!Cedit && (
        <div style={{
          padding: '12px',
          borderTop: '1px solid #efefef'
        }}>
          <textarea
            value={CeditComment}
            onChange={(e) => setCeditComment(e.target.value)}
            style={{
              width: '100%',
              borderRadius: '4px',
              padding: '8px',
              fontSize: '14px',
              border: '1px solid #dbdbdb',
              resize: 'none',
              marginBottom: '8px',
              minHeight: '60px'
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
                padding: '6px 12px',
                backgroundColor: 'transparent',
                border: '1px solid #dbdbdb',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={updateComment}
              style={{
                padding: '6px 12px',
                backgroundColor: '#0095f6',
                borderColor: '#0095f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Update
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={handleEditModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '16px', fontWeight: '600' }}>
            Edit Post
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                style={{ minHeight: '100px' }}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Hashtags (separated by spaces, including #)</Form.Label>
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
              />
            </Form.Group>
            
            <Form.Group>
              <Form.Label>Images (Comma-separated URLs)</Form.Label>
              <Form.Control
                type="text"
                value={editedImages ? editedImages.join(", ") : ""}
                onChange={(e) => {
                  const urls = e.target.value.split(",").map(url => url.trim()).filter(url => url);
                  setEditedImages(urls);
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="outline-secondary" 
            onClick={handleEditModalClose}
          >
            Cancel
          </Button>
          <Button 
            variant="primary"
            onClick={handleEditSubmit}
            style={{ backgroundColor: '#0095f6', borderColor: '#0095f6' }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={handleDeleteConfirmClose} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '16px', fontWeight: '600' }}>
            Delete Post
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this post? This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="outline-secondary" 
            onClick={handleDeleteConfirmClose}
          >
            Cancel
          </Button>
          <Button 
            variant="danger"
            onClick={deletePost}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PostItem;