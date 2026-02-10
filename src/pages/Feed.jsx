import { useState, useContext, useEffect } from "react";
import PostCard from "../components/PostCard";
import ComposePost from "../components/ComposePost";
import { AuthContext } from "../App";
import { postsAPI } from "../services/api";

function Feed() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("forYou");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  const fetchPosts = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = { page: pageNum, limit: 20 };
      
      // Filter by tab
      if (activeTab === "following") {
        params.following = true;
      } else if (activeTab === "campus") {
        params.type = "official";
      }

      const response = await postsAPI.getPosts(params);
      
      if (response.success) {
        const transformedPosts = response.posts.map(post => {
          // Handle avatar - use emoji if available, otherwise default
          let avatar = post.author?.avatar || "👤";
          if (avatar.startsWith('/') || avatar.startsWith('http')) {
            avatar = "👤"; // Use default emoji for image paths
          }
          
          return {
            id: post._id,
            author: post.author?.name || "Unknown",
            handle: post.author?.handle || "@unknown",
            type: post.type || "student",
            icon: avatar,
            content: post.content,
            media: post.media || [],
            timestamp: formatTimestamp(post.createdAt),
            likes: post.likeCount || 0,
            comments: post.commentCount || 0,
            reposts: post.repostCount || 0,
            views: post.views || 0,
            isLiked: post.isLiked || false,
            isReposted: post.isReposted || false,
            isBookmarked: post.isBookmarked || false,
            authorId: post.author?.id,
            isVerified: post.author?.isVerified || false
          };
        });

        if (pageNum === 1) {
          setPosts(transformedPosts);
        } else {
          setPosts(prev => [...prev, ...transformedPosts]);
        }
        
        setPage(pageNum);
        setHasMore(response.page < response.pages);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Could not load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const handleNewPost = async (postData) => {
    try {
      const response = await postsAPI.createPost(postData);
      if (response.success) {
        // Refresh posts to show the new one
        fetchPosts(1);
      }
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await postsAPI.likePost(postId);
      if (response.success) {
        setPosts(prev => prev.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              isLiked: response.liked,
              likes: response.liked ? post.likes + 1 : post.likes - 1
            };
          }
          return post;
        }));
      }
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleRepost = async (postId) => {
    try {
      const response = await postsAPI.repostPost(postId);
      if (response.success) {
        setPosts(prev => prev.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              isReposted: response.reposted,
              reposts: response.reposted ? post.reposts + 1 : post.reposts - 1
            };
          }
          return post;
        }));
      }
    } catch (err) {
      console.error('Error reposting:', err);
    }
  };

  const handleBookmark = async (postId) => {
    try {
      const response = await postsAPI.bookmarkPost(postId);
      if (response.success) {
        setPosts(prev => prev.map(post => {
          if (post.id === postId) {
            return { ...post, isBookmarked: response.bookmarked };
          }
          return post;
        }));
      }
    } catch (err) {
      console.error('Error bookmarking:', err);
    }
  };

  const handleComment = async (postId, content) => {
    // PostCard now handles the API call directly
    // This just updates the local post state for the comment count
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, comments: (post.comments || 0) + 1 };
      }
      return post;
    }));
  };

  const handleView = async (postId) => {
    try {
      await postsAPI.trackView(postId);
    } catch (err) {
      // Silent fail for view tracking
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchPosts(page + 1);
    }
  };

  return (
    <div className="feed">
      {/* Feed Header with Tabs */}
      <div className="feed-header">
        <div className="feed-tabs">
          <button
            className={`feed-tab ${activeTab === "forYou" ? "active" : ""}`}
            onClick={() => setActiveTab("forYou")}
          >
            For You
          </button>
          <button
            className={`feed-tab ${activeTab === "following" ? "active" : ""}`}
            onClick={() => setActiveTab("following")}
          >
            Following
          </button>
          <button
            className={`feed-tab ${activeTab === "campus" ? "active" : ""}`}
            onClick={() => setActiveTab("campus")}
          >
            Campus
          </button>
        </div>
      </div>

      {/* Compose Post Box */}
      <ComposePost onPost={handleNewPost} user={user} />

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => fetchPosts(1)}>Retry</button>
        </div>
      )}

      {/* Posts Feed */}
      <div className="feed-container">
        {loading && posts.length === 0 ? (
          <div className="loading-posts">
            <div className="spinner"></div>
            <p>Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-feed">
            <p>📭 No posts yet</p>
            <p>Be the first to post something!</p>
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post}
                onLike={() => handleLike(post.id)}
                onRepost={() => handleRepost(post.id)}
                onBookmark={() => handleBookmark(post.id)}
                onComment={(content) => handleComment(post.id, content)}
                onView={() => handleView(post.id)}
              />
            ))}
            {hasMore && (
              <button 
                className="load-more-btn"
                onClick={loadMore}
                disabled={loading}
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Feed;
