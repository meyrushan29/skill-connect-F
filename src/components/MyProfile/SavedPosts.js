import React, { useState, useCallback, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import PostItem from "../PostManagement/PostItem";
import { ToastContainer, toast } from "react-toastify";
import { 
  Bookmark, 
  BookmarkX, 
  Loader2, 
  Search, 
  SlidersHorizontal 
} from "lucide-react";

function SavedPosts() {
  const [showModal, setShowModal] = useState(false);
  const [savedPosts, setSavedPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    dateNewest: true,
    dateOldest: false,
    mostLoved: false
  });

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  const showMessage = useCallback((message, type = "success") => {
    toast[type](message, {
      position: "bottom-center",
      autoClose: 3000,
      theme: "colored",
    });
  }, []);

  const fetchSavedPosts = async () => {
    setLoading(true);
    try {
      const response = await axios({
        method: "post",
        url: "/api/v1/savedposts",
        headers: {
          Authorization: localStorage.getItem("psnToken"),
        },
        data: {
          id: localStorage.getItem("psnUserId"),
        },
      });

      if (response.data?.status === "success") {
        const posts = response.data.payload || [];
        setSavedPosts(posts);
        setFilteredPosts(posts);
      } else {
        showMessage("Failed to fetch saved posts", "error");
      }
    } catch (error) {
      console.error("Error fetching saved posts:", error);
      showMessage("Error fetching saved posts", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
    fetchSavedPosts();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // Reset search and filters
    setSearchTerm("");
    setFilters({
      dateNewest: true,
      dateOldest: false,
      mostLoved: false
    });
  };

  const handleUnsavePost = async (postId) => {
    try {
      const response = await axios({
        method: "post",
        url: "/api/v1/unsavepost",
        headers: {
          Authorization: localStorage.getItem("psnToken"),
        },
        data: {
          userId: localStorage.getItem("psnUserId"),
          postId: postId,
        },
      });

      if (response.data?.status === "success") {
        showMessage("Post removed from saved posts");
        const updatedPosts = savedPosts.filter((post) => post.id !== postId);
        setSavedPosts(updatedPosts);
        setFilteredPosts(updatedPosts);
      } else {
        showMessage("Failed to remove post from saved posts", "error");
      }
    } catch (error) {
      console.error("Error unsaving post:", error);
      showMessage("Error removing post from saved posts", "error");
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    const filtered = savedPosts.filter(post => 
      post.content.toLowerCase().includes(term) ||
      `${post.userFirstName} ${post.userLastName}`.toLowerCase().includes(term)
    );
    
    setFilteredPosts(filtered);
  };

  const toggleFilter = (filterKey) => {
    const newFilters = { 
      dateNewest: false, 
      dateOldest: false, 
      mostLoved: false 
    };
    newFilters[filterKey] = true;
    setFilters(newFilters);

    let sortedPosts = [...filteredPosts];
    switch(filterKey) {
      case 'dateNewest':
        sortedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'dateOldest':
        sortedPosts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'mostLoved':
        sortedPosts.sort((a, b) => (b.love?.length || 0) - (a.love?.length || 0));
        break;
      default:
        break;
    }
    setFilteredPosts(sortedPosts);
  };

  return (
    <>
      <Button
        onClick={handleShowModal}
        className="w-full max-w-xs bg-blue-900 hover:bg-blue-800 text-white flex items-center justify-center gap-2 py-3 rounded-lg transition-colors"
      >
        <Bookmark size={18} />
        Bookmarked Posts
      </Button>

      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center overflow-y-auto"
          style={{ 
            // Ensure modal is above navbar
            zIndex: 9999 
          }}
        >
          <div 
            className="relative w-full max-w-4xl max-h-[90vh] mx-4 my-8"
            style={{ 
              // Prevent navbar from interfering
              position: 'relative',
              zIndex: 10000 
            }}
          >
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              {/* Modal Header */}
              <div className="bg-blue-900 text-white p-4 flex items-center justify-between relative">
                <div className="flex items-center gap-2">
                  <Bookmark size={20} />
                  <h2 className="text-lg font-bold">Bookmarked Posts</h2>
                </div>
                
                {/* Search and Filter Section */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search posts..."
                      value={searchTerm}
                      onChange={handleSearch}
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
                  
                  <button 
                    onClick={handleCloseModal}
                    className="text-white hover:bg-blue-800 p-2 rounded-full"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="max-h-[500px] overflow-y-auto p-4">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 size={36} className="animate-spin text-blue-900" />
                  </div>
                ) : filteredPosts.length > 0 ? (
                  <div className="space-y-6">
                    {filteredPosts.map((postItem) => (
                      <div 
                        key={postItem.id} 
                        className="relative group transition-all duration-300 hover:scale-[1.01]"
                      >
                        <PostItem
                          postId={postItem.id}
                          userId={postItem.userId}
                          firstName={postItem.userFirstName || ""}
                          lastName={postItem.userLastName || ""}
                          content={postItem.content}
                          image={postItem.image}
                          loveList={postItem.love}
                          shareList={postItem.share}
                          commentList={postItem.comment}
                          postDate={postItem.createdAt}
                          images={postItem.images}
                        />
                        <button
                          onClick={() => handleUnsavePost(postItem.id)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600 hover:scale-110 shadow-md"
                          aria-label="Remove from saved"
                        >
                          <BookmarkX size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-600">
                    <Bookmark size={48} className="mx-auto mb-4 text-gray-400" />
                    <p>No saved posts available</p>
                    {searchTerm && (
                      <p className="text-sm text-gray-500 mt-2">
                        No posts match your search "{searchTerm}"
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-100 p-4 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {filteredPosts.length} saved post{filteredPosts.length !== 1 ? 's' : ''}
                </div>
                <button
                  onClick={handleCloseModal}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SavedPosts;