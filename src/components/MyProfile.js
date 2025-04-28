import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProfilePosts } from "../feature/checkProfile/checkProfileSlice";
import { getProfileInfo } from "../feature/checkProfile/checkProfileSlice";
import PostItem from "./PostItem";
import SavedPosts from "./SavedPosts";
import { Button, Form, Modal } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Utensils, BookOpen, Pencil, Trash2, UserX, Camera, Image, MapPin, Briefcase, Globe, ChevronDown, MoreHorizontal } from 'lucide-react';

function MyProfile(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const postList = useSelector((state) => state.checkProfileReducer.postList);
  const userInfo = useSelector((state) => state.checkProfileReducer.profileInfo);

  // States for profile management
  const [editPostId, setEditPostId] = useState(null);
  const [editedPostContent, setEditedPostContent] = useState("");
  const [BioContent, setBioContent] = useState(localStorage.getItem("psnBio") ? localStorage.getItem("psnBio") : "");
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  // Modal handlers
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Toast message functions
  function showSuccessMessage(inputMessage) {
    toast.success(inputMessage, {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }

  function showFailMessage(inputMessage) {
    toast.error(inputMessage, {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }

  // Form validation schema
  const schema = yup.object().shape({
    bio: yup.string().required("Bio is required"),
  });

  // Handle bio form submission
  async function handleSubmit(values) {
    setSubmitting(true);

    const { bio } = values;

    let obj = {
      "firstName": localStorage.getItem("psnUserFirstName"),
      "lastName": localStorage.getItem("psnUserLastName"),
      "email": localStorage.getItem("psnUserEmail"),
      "password": "123456",
      "role": "user",
      "id": localStorage.getItem("psnUserId"),
      "nic": localStorage.getItem("nic"),
      "bio": bio
    }
    try {
      const response = await axios({
        method: "put",
        url: "/api/v1/users/update",
        headers: {
          Authorization: localStorage.getItem("psnToken"),
        },
        data: obj
      });
      localStorage.setItem("psnBio", response.data.payload.bio);
      showSuccessMessage("Profile updated successfully!");
    } catch (error) {
      showFailMessage("Update failed. Please try again.");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  }

  // Load profile data on component mount
  useEffect(() => {
    if (localStorage.getItem("psnToken") === null) {
      navigate("/unauthorized");
    }

    if (localStorage.getItem("psnUserId") !== null) {
      dispatch(getProfilePosts(localStorage.getItem("psnUserId")));
      dispatch(getProfileInfo(localStorage.getItem("psnUserId")));
    }
  }, []);

  // Post editing functions
  const handleEditPost = (postItem) => {
    setEditPostId(postItem.id);
    setEditedPostContent(postList.find(post => post.id === postItem.id).content);
  };
  
  async function createPost(obj) {
    try {
      const response = await axios({
        method: "put",
        url: "/api/v1/editpost",
        headers: {
          Authorization: localStorage.getItem("psnToken"),
        },
        data: obj
      });

      if (response.data !== null && response.data.status === "success") {
        showSuccessMessage("Post updated successfully!");
        window.location.reload();
      }

      if (response.data !== null && response.data.status === "fail") {
        showFailMessage("Update failed. Please try again.");
      }
    } catch (error) {
      showFailMessage("Update failed. Please try again.");
    }
  }
  
  const handleSavePost = (postItem) => {
    let obj = Object.assign({}, postItem);
    if (obj['content']) {
      obj.content = editedPostContent;
    }
    createPost(obj);
  };
  
  async function deletePost(obj) {
    try {
      const response = await axios({
        method: "delete",
        url: "/api/v1/deletepost",
        headers: {
          Authorization: localStorage.getItem("psnToken"),
        },
        data: obj
      });

      if (response.data !== null && response.data.status === "success") {
        showSuccessMessage("Post deleted successfully!");
        window.location.reload();
      }

      if (response.data !== null && response.data.status === "fail") {
        showFailMessage("Delete failed. Please try again.");
      }
    } catch (error) {
      showFailMessage("Delete failed. Please try again.");
    }
  }
  
  // Post deletion handler
  const handleDeletePost = (postId) => {
    let idobj = {
      "id": postId.id
    }
    deletePost(idobj);
  };

  // Account deletion handler
  const HandleDeleteUser = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      let obj = {
        id: localStorage.getItem("psnUserId"),
      }
      axios({
        method: "delete",
        url: "/api/v1/users/delete",
        headers: {
          Authorization: localStorage.getItem("psnToken"),
        },
        data: obj
      }).then((res) => {
        showSuccessMessage("Account deleted successfully!");
        localStorage.clear();
        window.location.href = '/signin';
      }).catch((err) => {
        showFailMessage("Delete failed. Please try again later!");
      });
    }
  }
  
  // Edit profile modal
  const [showEditModal, setShowEditModal] = useState(false);
  const handleShowEditModal = () => setShowEditModal(true);
  const handleCloseEditModal = () => setShowEditModal(false);
  
  return (
    <div style={{
      backgroundColor: "#f0f2f5",
      minHeight: '100vh',
    }}>
      <ToastContainer />
      
      
      {/* Cover Photo */}
      <div style={{
        height: "250px",
        backgroundColor: "#19304f",
        backgroundImage: "linear-gradient(to right, #19304f, #2c90fc)",
        position: "relative",
        borderRadius: "0 0 8px 8px",
        marginBottom: "70px"
      }}>
        
        {/* Profile Picture */}
        <div style={{
          position: "absolute",
          bottom: "-60px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "168px",
          height: "168px",
          borderRadius: "50%",
          backgroundColor: "#e4e6eb",
          border: "6px solid #fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden"
        }}>
          <div style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#19304f",
            color: "white",
            fontSize: "4rem",
            fontWeight: "bold"
          }}>
            {userInfo && userInfo.firstName && userInfo.firstName.charAt(0)}
            {userInfo && userInfo.lastName && userInfo.lastName.charAt(0)}
          </div>
          
          
        </div>
      </div>
      
      {/* Profile Info Section */}
      <div style={{
        maxWidth: "940px",
        margin: "0 auto",
        padding: "0 16px",
        textAlign: "center"
      }}>
        <h1 style={{
          fontSize: "32px",
          fontWeight: "bold",
          margin: "8px 0"
        }}>
          {userInfo && userInfo.firstName} {userInfo && userInfo.lastName}
        </h1>
        
        <p style={{
          color: "#65676b",
          margin: "8px 0 16px",
          fontSize: "15px"
        }}>
          {BioContent || "Add a bio to tell people more about yourself"}
        </p>
        
        {/* Profile Actions */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          marginBottom: "16px"
        }}>
          <Button 
            onClick={handleShowEditModal}
            style={{
              backgroundColor: "#19304f",
              border: "none",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 12px",
              fontWeight: "500"
            }}
          >
            <Pencil size={16} /> Edit Profile
          </Button>
          
          <Button
            onClick={handleShowModal}
            style={{
              backgroundColor: "#e4e6eb",
              border: "none",
              color: "#050505",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 12px",
              fontWeight: "500"
            }}
          >
            <BookOpen size={16} /> My Skills & Posts
          </Button>
        </div>
        
        {/* Divider */}
        <div style={{
          borderBottom: "1px solid #dadde1",
          marginBottom: "0"
        }}></div>
        
        {/* Navigation Tabs */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          borderBottom: "1px solid #dadde1"
        }}>
          <div 
            onClick={() => setActiveTab("posts")}
            style={{
              padding: "16px 32px",
              fontWeight: "600",
              color: activeTab === "posts" ? "#19304f" : "#65676b",
              borderBottom: activeTab === "posts" ? "3px solid #19304f" : "none",
              cursor: "pointer"
            }}
          >
            Posts
          </div>
          <div 
            onClick={() => setActiveTab("about")}
            style={{
              padding: "16px 32px",
              fontWeight: "600",
              color: activeTab === "about" ? "#19304f" : "#65676b",
              borderBottom: activeTab === "about" ? "3px solid #19304f" : "none",
              cursor: "pointer"
            }}
          >
            About
          </div>
          <div 
            onClick={() => setActiveTab("saved")}
            style={{
              padding: "16px 32px",
              fontWeight: "600",
              color: activeTab === "saved" ? "#19304f" : "#65676b",
              borderBottom: activeTab === "saved" ? "3px solid #19304f" : "none",
              cursor: "pointer"
            }}
          >
            Saved
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div style={{
        maxWidth: "940px",
        margin: "20px auto",
        padding: "0 16px",
        display: "flex",
        gap: "16px"
      }}>
        {/* Left Column - About Info */}
        <div style={{
          width: "360px",
          flexShrink: 0
        }}>
          {activeTab === "about" || activeTab === "posts" ? (
            <div style={{
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              padding: "16px",
              marginBottom: "16px"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px"
              }}>
                <h3 style={{ 
                  fontSize: "20px", 
                  fontWeight: "bold",
                  margin: 0
                }}>About</h3>
                <Button 
                  onClick={handleShowEditModal}
                  variant="link" 
                  style={{ 
                    padding: 0, 
                    color: "#19304f",
                    fontWeight: "500"
                  }}
                >
                  Edit
                </Button>
              </div>
              
              <p style={{
                margin: "12px 0",
                color: "#050505",
                fontSize: "15px"
              }}>
                {BioContent || "No bio information added yet."}
              </p>
              
              <div style={{
                margin: "16px 0"
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "12px",
                  color: "#65676b"
                }}>
                  <Briefcase size={20} />
                  <span>Skills Expert at Skill Connect</span>
                </div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "12px",
                  color: "#65676b"
                }}>
                  <MapPin size={20} />
                  <span>Lives in Your City</span>
                </div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#65676b"
                }}>
                  <Globe size={20} />
                  <span>skillconnect.com</span>
                </div>
              </div>
              
              {/* Account Management */}
              <div style={{
                marginTop: "20px",
                paddingTop: "16px",
                borderTop: "1px solid #dadde1"
              }}>
                <Button
                  onClick={HandleDeleteUser}
                  style={{
                    backgroundColor: "#fa3e3e",
                    border: "none",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    width: "100%",
                    justifyContent: "center",
                    fontWeight: "500"
                  }}
                >
                  <UserX size={16} />
                  Delete My Account
                </Button>
              </div>
            </div>
          ) : null}
          
          {activeTab === "saved" && (
            <div style={{
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              marginBottom: "16px",
              overflow: "hidden"
            }}>
              <div style={{
                padding: "16px"
              }}>
                <h3 style={{ 
                  fontSize: "20px", 
                  fontWeight: "bold",
                  margin: 0,
                  marginBottom: "16px"
                }}>Saved Items</h3>
                <SavedPosts />
              </div>
            </div>
          )}
        </div>
        
        {/* Right Column - Posts */}
        <div style={{ flex: 1 }}>
          {activeTab === "posts" && (
            <div>
              {/* Create Post Box */}
              <div style={{
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                padding: "16px",
                marginBottom: "16px"
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: "#19304f",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold"
                  }}>
                    {userInfo && userInfo.firstName && userInfo.firstName.charAt(0)}
                    {userInfo && userInfo.lastName && userInfo.lastName.charAt(0)}
                  </div>
                  <div style={{
                    flex: 1,
                    backgroundColor: "#f0f2f5",
                    borderRadius: "20px",
                    padding: "8px 16px",
                    color: "#65676b",
                    cursor: "pointer"
                  }}>
                    What skills are you learning, {userInfo && userInfo.firstName}?
                  </div>
                </div>
                
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "12px",
                  paddingTop: "8px",
                  borderTop: "1px solid #dadde1"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    flex: 1,
                    justifyContent: "center",
                    color: "#65676b",
                    fontWeight: "500"
                  }}>
                    <Image size={20} color="#45bd62" />
                    Photo
                  </div>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    flex: 1,
                    justifyContent: "center",
                    color: "#65676b",
                    fontWeight: "500"
                  }}>
                    <Utensils size={20} color="#f7b928" />
                    Skill
                  </div>
                </div>
              </div>
              
              {/* Posts List */}
              
            </div>
          )}
          
          {activeTab === "about" && (
            <div style={{
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              padding: "20px"
            }}>
              <h3 style={{ 
                fontSize: "20px", 
                fontWeight: "bold",
                marginBottom: "16px"
              }}>About</h3>
              
              <div style={{
                marginBottom: "24px"
              }}>
                <h4 style={{
                  fontSize: "17px",
                  fontWeight: "600",
                  marginBottom: "12px"
                }}>Bio</h4>
                <p>{BioContent || "No bio added yet."}</p>
              </div>
              
              <div style={{
                marginBottom: "24px"
              }}>
                <h4 style={{
                  fontSize: "17px",
                  fontWeight: "600",
                  marginBottom: "12px"
                }}>Skills</h4>
                <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px"
                }}>
                  <span style={{
                    backgroundColor: "#e4e6eb",
                    padding: "6px 12px",
                    borderRadius: "16px",
                    fontSize: "14px"
                  }}>Cooking</span>
                  <span style={{
                    backgroundColor: "#e4e6eb",
                    padding: "6px 12px",
                    borderRadius: "16px",
                    fontSize: "14px"
                  }}>Programming</span>
                  <span style={{
                    backgroundColor: "#e4e6eb",
                    padding: "6px 12px",
                    borderRadius: "16px",
                    fontSize: "14px"
                  }}>Photography</span>
                </div>
              </div>
              
              <div>
                <h4 style={{
                  fontSize: "17px",
                  fontWeight: "600",
                  marginBottom: "12px"
                }}>Contact Information</h4>
                <p style={{
                  color: "#65676b",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <span style={{ fontWeight: "500" }}>Email:</span> 
                  {userInfo && userInfo.email ? userInfo.email : "No email provided"}
                </p>
              </div>
            </div>
          )}
          
          {activeTab === "saved" && (
            <div style={{
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              padding: "20px"
            }}>
              <h3 style={{ 
                fontSize: "20px", 
                fontWeight: "bold",
                marginBottom: "16px"
              }}>Detailed Saved Items</h3>
              <p style={{
                color: "#65676b"
              }}>
                You can find all your saved skills and learning resources here.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Posts Modal (kept for compatibility) */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        size="xl"
        centered 
      >
        <Modal.Header closeButton style={{ 
          backgroundColor: "#19304f",
          color: "white",
        }}>
          <Modal.Title style={{ 
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <BookOpen size={20} /> My Skills & Posts
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body style={{ 
          maxHeight: "500px", 
          overflowY: "auto",
          padding: "16px" 
        }}>
          {postList !== null && postList.length > 0 ? (
            postList.map((postItem) => (
              <div key={postItem.id} style={{ marginBottom: "20px" }}>
                {editPostId === postItem.id ? (
                  <div style={{
                    background: "#f8fafc",
                    padding: "16px",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb"
                  }}>
                    <Form.Control
                      type="text"
                      name="content"
                      value={editedPostContent}
                      onChange={(e) => {
                        setEditedPostContent(e.target.value);
                      }}
                      as="textarea"
                      rows={3}
                      style={{ 
                        marginBottom: "12px",
                        borderRadius: "8px"
                      }}
                    />
                    <div style={{
                      display: "flex",
                      gap: "8px"
                    }}>
                      <Button
                        onClick={() => {
                          handleSavePost(postItem);
                        }}
                        style={{ 
                          backgroundColor: '#19304f',
                          borderColor: '#19304f',
                        }}
                      >
                        Update
                      </Button>
                      <Button
                        onClick={() => {
                          setEditPostId(null);
                        }}
                        variant="outline-secondary"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <PostItem
                    postId={postItem.id}
                    userId={postItem.userId}
                    firstName={
                      userInfo && userInfo.firstName ? userInfo.firstName : ""
                    }
                    lastName={
                      userInfo && userInfo.lastName ? userInfo.lastName : ""
                    }
                    content={postItem.content}
                    image={postItem.image}
                    loveList={postItem.love}
                    shareList={postItem.share}
                    commentList={postItem.comment}
                    postDate={postItem.createdAt}
                    editClick={() => handleEditPost(postItem)}
                    deleteClick={() => handleDeletePost(postItem)}
                    images={postItem.images}
                  />
                )}
              </div>
            ))
          ) : (
            <div style={{
              textAlign: "center",
              padding: "32px",
              color: "#65676b"
            }}>
              <p>You haven't shared any Skills yet. Start learning and sharing!</p>
            </div>
          )}
        </Modal.Body>
        
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={handleCloseModal}
            style={{
              borderRadius: "6px"
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Edit Profile Modal */}
      <Modal
        show={showEditModal}
        onHide={handleCloseEditModal}
        size="lg"
        centered
      >
        <Modal.Header closeButton style={{ 
          backgroundColor: "#19304f",
          color: "white"
        }}>
          <Modal.Title style={{ 
            fontWeight: "bold"
          }}>
            Edit Profile
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body style={{ padding: "20px" }}>
          <Formik
            validationSchema={schema}
            initialValues={{ bio: BioContent }}
            onSubmit={handleSubmit}
          >
            {({
              handleSubmit,
              handleChange,
              handleBlur,
              values,
              touched,
              errors,
            }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group controlId="formBio" className="mb-4">
                  <Form.Label style={{ 
                    color: "#050505",
                    fontWeight: "600",
                    marginBottom: "8px",
                    fontSize: "16px"
                  }}>
                    About Me
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="bio"
                    value={values.bio}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.bio && !!errors.bio}
                    style={{
                      borderRadius: "8px",
                      padding: "12px",
                      borderColor: "#dddfe2",
                      marginBottom: "12px"
                    }}
                    as="textarea"
                    rows={4}
                    placeholder="Tell others about yourself and your skills..."
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.bio}
                  </Form.Control.Feedback>
                  <small style={{ color: "#65676b" }}>
                    Describe your skills, expertise, and what you're learning.
                  </small>
                </Form.Group>
                
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "20px" }}>
                  <Button 
                    variant="light"
                    onClick={handleCloseEditModal}
                    style={{
                      borderRadius: "6px"
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={submitting}
                    style={{
                      backgroundColor: "#19304f",
                      borderColor: "#19304f",
                      borderRadius: "6px",
                      fontWeight: "500"
                    }}
                    
                  >
                    {submitting ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
}


export default MyProfile;