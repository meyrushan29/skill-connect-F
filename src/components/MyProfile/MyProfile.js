import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProfilePosts } from "../../feature/checkProfile/checkProfileSlice";
import { getProfileInfo } from "../../feature/checkProfile/checkProfileSlice";
import PostItem from "../PostManagement/PostItem";
import SavedPosts from "./SavedPosts";
import { Button, Form, Modal } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { 
  Utensils, BookOpen, Pencil, UserX, Camera, 
  Image, MapPin, Briefcase, Globe, 
  Search, SlidersHorizontal 
} from 'lucide-react';

function MyProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const postList = useSelector((state) => state.checkProfileReducer.postList);
  const userInfo = useSelector((state) => state.checkProfileReducer.profileInfo);

  // States for profile management
  const [editPostId, setEditPostId] = useState(null);
  const [editedPostContent, setEditedPostContent] = useState("");
  const [BioContent, setBioContent] = useState(localStorage.getItem("psnBio") || "");
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  
  // Post filtering states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    dateNewest: true,
    dateOldest: false,
    mostLoved: false
  });

  // Memoized and filtered posts
  const filteredPosts = useMemo(() => {
    if (!postList) return [];

    let result = postList.filter(post => 
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filters.dateNewest) {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filters.dateOldest) {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (filters.mostLoved) {
      result.sort((a, b) => (b.love?.length || 0) - (a.love?.length || 0));
    }

    return result;
  }, [postList, searchTerm, filters]);

  // Modal handlers
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    // Reset search and filters when closing
    setSearchTerm("");
    setFilters({
      dateNewest: true,
      dateOldest: false,
      mostLoved: false
    });
  };

  // Toast message functions
  const showMessage = useCallback((message, type = "success") => {
    toast[type](message, {
      position: "bottom-center",
      autoClose: 3000,
      theme: "colored",
    });
  }, []);

  // Form validation schema
  const schema = yup.object().shape({
    bio: yup.string().max(300, "Bio must be at most 300 characters")
  });

  // Handle bio form submission
  const handleSubmit = async (values) => {
    setSubmitting(true);

    const { bio } = values;

    const obj = {
      firstName: localStorage.getItem("psnUserFirstName"),
      lastName: localStorage.getItem("psnUserLastName"),
      email: localStorage.getItem("psnUserEmail"),
      password: "123456",
      role: "user",
      id: localStorage.getItem("psnUserId"),
      nic: localStorage.getItem("nic"),
      bio
    };

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
      showMessage("Profile updated successfully!");
      setBioContent(bio);
      handleCloseEditModal();
    } catch (error) {
      showMessage("Update failed. Please try again.", "error");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  // Load profile data on component mount
  useEffect(() => {
    if (!localStorage.getItem("psnToken")) {
      navigate("/unauthorized");
    }

    if (localStorage.getItem("psnUserId")) {
      dispatch(getProfilePosts(localStorage.getItem("psnUserId")));
      dispatch(getProfileInfo(localStorage.getItem("psnUserId")));
    }
  }, [dispatch, navigate]);

  // Post editing functions
  const handleEditPost = (postItem) => {
    setEditPostId(postItem.id);
    setEditedPostContent(postList.find(post => post.id === postItem.id).content);
  };
  
  const createPost = async (obj) => {
    try {
      const response = await axios({
        method: "put",
        url: "/api/v1/editpost",
        headers: {
          Authorization: localStorage.getItem("psnToken"),
        },
        data: obj
      });

      if (response.data?.status === "success") {
        showMessage("Post updated successfully!");
        dispatch(getProfilePosts(localStorage.getItem("psnUserId")));
        setEditPostId(null);
      } else {
        showMessage("Update failed. Please try again.", "error");
      }
    } catch (error) {
      showMessage("Update failed. Please try again.", "error");
    }
  };
  
  const handleSavePost = (postItem) => {
    let obj = { ...postItem };
    if (obj.content) {
      obj.content = editedPostContent;
    }
    createPost(obj);
  };
  
  const deletePost = async (obj) => {
    try {
      const response = await axios({
        method: "delete",
        url: "/api/v1/deletepost",
        headers: {
          Authorization: localStorage.getItem("psnToken"),
        },
        data: obj
      });

      if (response.data?.status === "success") {
        showMessage("Post deleted successfully!");
        dispatch(getProfilePosts(localStorage.getItem("psnUserId")));
      } else {
        showMessage("Delete failed. Please try again.", "error");
      }
    } catch (error) {
      showMessage("Delete failed. Please try again.", "error");
    }
  };
  
  const handleDeletePost = (postId) => {
    const idobj = { id: postId.id };
    deletePost(idobj);
  };

  // Toggle filter
  const toggleFilter = (filterKey) => {
    const newFilters = { 
      dateNewest: false, 
      dateOldest: false, 
      mostLoved: false 
    };
    newFilters[filterKey] = true;
    setFilters(newFilters);
  };

  // Edit profile modal
  const [showEditModal, setShowEditModal] = useState(false);
  const handleShowEditModal = () => setShowEditModal(true);
  const handleCloseEditModal = () => setShowEditModal(false);

  // Account deletion handler
  const HandleDeleteUser = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      const obj = {
        id: localStorage.getItem("psnUserId"),
      };
      axios({
        method: "delete",
        url: "/api/v1/users/delete",
        headers: {
          Authorization: localStorage.getItem("psnToken"),
        },
        data: obj
      }).then(() => {
        showMessage("Account deleted successfully!");
        localStorage.clear();
        window.location.href = '/signin';
      }).catch(() => {
        showMessage("Delete failed. Please try again later!", "error");
      });
    }
  };
  
  return (
    <div className="bg-gray-100 min-h-screen">
      <ToastContainer />
      
      {/* Cover Photo */}
      <div className="relative h-64 bg-gradient-to-r from-blue-900 to-blue-500 rounded-b-lg mb-16">
        {/* Profile Picture */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-42 h-42 bg-gray-200 rounded-full border-4 border-white flex items-center justify-center">
          <div className="w-full h-full bg-blue-900 text-white flex items-center justify-center text-5xl font-bold">
            {userInfo?.firstName?.[0]}{userInfo?.lastName?.[0]}
          </div>
        </div>
      </div>
      
      {/* Profile Info Section */}
      <div className="max-w-[940px] mx-auto px-4 text-center">
        <h1 className="text-3xl font-bold my-2">
          {userInfo?.firstName} {userInfo?.lastName}
        </h1>
        
        <p className="text-gray-600 text-sm mb-4">
          {BioContent || "Add a bio to tell people more about yourself"}
        </p>
        
        {/* Profile Actions */}
        <div className="flex justify-center space-x-2 mb-4">
          <Button 
            onClick={handleShowEditModal}
            className="bg-blue-900 text-white flex items-center gap-2 px-3 py-2 rounded"
          >
            <Pencil size={16} /> Edit Profile
          </Button>
          
          <Button
            onClick={handleShowModal}
            className="bg-gray-200 text-gray-800 flex items-center gap-2 px-3 py-2 rounded"
          >
            <BookOpen size={16} /> My Skills & Posts
          </Button>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex justify-center border-b border-gray-300">
          {['posts', 'about', 'saved'].map((tab) => (
            <div 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-6 py-4 font-semibold capitalize cursor-pointer
                ${activeTab === tab 
                  ? 'text-blue-900 border-b-2 border-blue-900' 
                  : 'text-gray-600 hover:bg-gray-100'}
              `}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="max-w-[940px] mx-auto px-4 py-6 grid grid-cols-3 gap-6">
        {/* Left Sidebar */}
        <div className="col-span-1">
          {(activeTab === 'about' || activeTab === 'posts') && (
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">About</h3>
                <button 
                  onClick={handleShowEditModal}
                  className="text-blue-900 hover:underline"
                >
                  Edit
                </button>
              </div>
              
              <p className="text-gray-700">
                {BioContent || "No bio information added yet."}
              </p>
              
              <div className="space-y-3 text-gray-600">
                <div className="flex items-center gap-3">
                  <Briefcase size={20} />
                  <span>Skills Expert at Skill Connect</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={20} />
                  <span>Lives in Your City</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe size={20} />
                  <span>skillconnect.com</span>
                </div>
              </div>
              
              {/* Account Management */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Button
                  onClick={HandleDeleteUser}
                  className="w-full bg-red-500 text-white flex items-center justify-center gap-2 py-2 rounded hover:bg-red-600"
                >
                  <UserX size={16} />
                  Delete My Account
                </Button>
              </div>
            </div>
          )}
          
          {activeTab === "saved" && (
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">Saved Items</h3>
                <SavedPosts />
              </div>
            </div>
          )}
        </div>
        
        {/* Right Column */}
        <div className="col-span-2">
          {activeTab === "posts" && (
            <div className="space-y-6">
              {/* Create Post Box */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold">
                    {userInfo?.firstName?.[0]}{userInfo?.lastName?.[0]}
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-gray-500 cursor-pointer">
                    What skills are you learning, {userInfo?.firstName}?
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-2 py-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                    <Image size={20} className="text-green-500" />
                    <span className="text-gray-700">Photo</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 py-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                    <Utensils size={20} className="text-yellow-500" />
                    <span className="text-gray-700">Skill</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "about" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">About</h3>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-2">Bio</h4>
                <p>{BioContent || "No bio added yet."}</p>
              </div>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {['Cooking', 'Programming', 'Photography'].map(skill => (
                    <span 
                      key={skill} 
                      className="bg-gray-200 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-2">Contact Information</h4>
                <p className="text-gray-600">
                  Email: {userInfo?.email || "No email provided"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Skills & Posts Modal */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        size="xl"
        centered 
        className="skills-posts-modal"
      >
        <Modal.Header 
          closeButton 
          className="bg-blue-900 text-white rounded-t-lg relative"
        >
          <Modal.Title className="flex items-center gap-2 font-bold">
            <BookOpen size={20} /> My Skills & Posts
          </Modal.Title>
          
          {/* Search and Filter Section */}
          <div className="absolute right-16 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-2 py-1 rounded-full text-gray-900 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search 
                size={16} 
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" 
              />
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setFilterOpen(!filterOpen)}
                className="bg-white text-blue-900 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <SlidersHorizontal size={16} />
              </button>
              
              {filterOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-lg p-4 z-10 w-48">
                  <p className="text-sm font-semibold mb-2 text-gray-700">Sort By</p>
                  {[
                    { key: 'dateNewest', label: 'Newest First' },
                    { key: 'dateOldest', label: 'Oldest First' },
                    { key: 'mostLoved', label: 'Most Loved' }
                  ].map(({ key, label }) => (
                    <label 
                      key={key} 
                      className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="filter"
                        checked={filters[key]}
                        onChange={() => toggleFilter(key)}
                        className="text-blue-900"
                      />
                      <span className="text-sm">{label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Modal.Header>
        
        <Modal.Body className="max-h-[500px] overflow-y-auto p-4">
          {filteredPosts.length > 0 ? (
            <div className="space-y-6">
              {filteredPosts.map((postItem) => (
                <div key={postItem.id} className="relative group">
                  {editPostId === postItem.id ? (
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <Form.Control
                        as="textarea"
                        name="content"
                        value={editedPostContent}
                        onChange={(e) => setEditedPostContent(e.target.value)}
                        rows={3}
                        className="mb-3 rounded-lg"
                        placeholder="Edit your post..."
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleSavePost(postItem)}
                          className="bg-blue-900 hover:bg-blue-800 text-white"
                        >
                          Update
                        </Button>
                        <Button
                          onClick={() => setEditPostId(null)}
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
                      firstName={userInfo?.firstName || ""}
                      lastName={userInfo?.lastName || ""}
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
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-600">
              <BookOpen size={48} className="mx-auto mb-4 text-gray-400" />
              <p>You haven't shared any Skills yet. Start learning and sharing!</p>
              {searchTerm && (
                <p className="text-sm text-gray-500 mt-2">
                  No posts match your search "{searchTerm}"
                </p>
              )}
            </div>
          )}
        </Modal.Body>
        
        <Modal.Footer className="bg-gray-100 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
          </div>
          <Button 
            variant="secondary" 
            onClick={handleCloseModal}
            className="rounded-lg"
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
        <Modal.Header 
          closeButton 
          className="bg-blue-900 text-white"
        >
          <Modal.Title className="font-bold">
            Edit Profile
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="p-6">
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
                  <Form.Label className="font-semibold text-gray-700 mb-2">
                    About Me
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    name="bio"
                    value={values.bio}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.bio && !!errors.bio}
                    rows={4}
                    placeholder="Tell others about yourself and your skills..."
                    className="rounded-lg"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.bio}
                  </Form.Control.Feedback>
                  <small className="text-gray-500 mt-2 block">
                    Describe your skills, expertise, and what you're learning.
                  </small>
                </Form.Group>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <Button 
                    variant="light"
                    onClick={handleCloseEditModal}
                    className="rounded-lg"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="bg-blue-900 text-white hover:bg-blue-800 rounded-lg"
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