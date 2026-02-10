import { useState, useEffect, useRef } from "react";
import { postsAPI } from "../services/api";

function PostCard({ post, onLike, onRepost, onBookmark, onComment, onView }) {
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [reposted, setReposted] = useState(post.isReposted || false);
  const [repostCount, setRepostCount] = useState(post.reposts || 0);
  const [bookmarked, setBookmarked] = useState(post.isBookmarked || false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(post.comments || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [viewCount, setViewCount] = useState(post.views || 0);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [expandedMedia, setExpandedMedia] = useState(null);
  const hasTrackedView = useRef(false);
  const postRef = useRef(null);
  const commentInputRef = useRef(null);

  // Track view when post becomes visible
  useEffect(() => {
    if (!postRef.current || hasTrackedView.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasTrackedView.current) {
          hasTrackedView.current = true;
          if (onView) {
            onView();
            setViewCount(prev => prev + 1);
          }
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(postRef.current);
    return () => observer.disconnect();
  }, [onView]);

  // Load comments when section is opened
  useEffect(() => {
    if (showComments && comments.length === 0) {
      loadComments();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showComments]);

  const loadComments = async () => {
    setLoadingComments(true);
    try {
      const response = await postsAPI.getComments(post.id);
      if (response.success) {
        setComments(response.comments || []);
      }
    } catch (err) {
      console.error("Error loading comments:", err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleLike = () => {
    if (onLike) onLike();
    if (!liked) {
      setLikeCount(prev => prev + 1);
      setLiked(true);
    } else {
      setLikeCount(prev => prev - 1);
      setLiked(false);
    }
  };

  const handleRepost = () => {
    if (onRepost) onRepost();
    if (!reposted) {
      setRepostCount(prev => prev + 1);
      setReposted(true);
    } else {
      setRepostCount(prev => prev - 1);
      setReposted(false);
    }
  };

  const handleBookmark = () => {
    if (onBookmark) onBookmark();
    setBookmarked(!bookmarked);
  };

  const handleCommentClick = () => {
    setShowComments(!showComments);
    if (!showComments) {
      setTimeout(() => commentInputRef.current?.focus(), 100);
    }
  };

  const handleSubmitComment = async (e) => {
    e?.preventDefault();
    if (!commentText.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      // Call the API to save the comment
      const response = await postsAPI.addComment(post.id, commentText.trim());
      
      if (response.success) {
        // Also call onComment prop if it exists (for parent state update)
        if (onComment) {
          onComment(commentText.trim());
        }
        
        // Reload comments from API to get the real data with author info
        await loadComments();
        setCommentText("");
        setCommentCount(prev => prev + 1);
      }
    } catch (err) {
      console.error("Error posting comment:", err);
      alert("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplySubmit = async (commentId) => {
    if (!replyText.trim()) return;
    
    try {
      const newReply = {
        _id: Date.now().toString(),
        content: replyText.trim(),
        author: { name: "You", avatar: "👤" },
        createdAt: new Date().toISOString()
      };
      
      setComments(prev => prev.map(comment => {
        if (comment._id === commentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply]
          };
        }
        return comment;
      }));
      
      setReplyText("");
      setReplyingTo(null);
      setCommentCount(prev => prev + 1);
    } catch (err) {
      console.error("Error posting reply:", err);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num || 0;
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
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
    return date.toLocaleDateString();
  };

  const isOfficial = post.type === "official" || post.isVerified;

  return (
    <>
      <div ref={postRef} className={`post-card ${isOfficial ? "official" : ""}`}>
        {/* Post Header */}
        <div className="post-header">
          <span className="author-avatar">{post.icon}</span>
          <div className="author-details">
            <div className="author-name-row">
              <span className="author-name">{post.author}</span>
              {isOfficial && <span className="verified-badge">✓</span>}
              <span className="author-handle">{post.handle}</span>
              <span className="post-dot">·</span>
              <span className="post-time">{post.timestamp}</span>
            </div>
          </div>
          <button className="more-options">⋯</button>
        </div>

        {/* Post Content */}
        <div className="post-body">
          <p className="post-text">{post.content}</p>

          {/* Media Display - Clickable */}
          {post.media && post.media.length > 0 && (
            <div className={`post-media media-count-${post.media.length}`}>
              {post.media.map((item, index) => (
                <div 
                  key={index} 
                  className="media-wrapper clickable"
                  onClick={() => setExpandedMedia(item)}
                >
                  {item.type === "image" ? (
                    <img src={item.url} alt="Post media" className="post-image" />
                  ) : (
                    <video src={item.url} className="post-video" />
                  )}
                  <div className="media-overlay">
                    <span className="expand-icon">🔍</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Engagement Stats */}
        <div className="post-stats">
          <span className="stat-item">{formatNumber(viewCount)} views</span>
        </div>

        {/* Post Actions */}
        <div className="post-actions">
          <button 
            className={`action-btn comment-btn ${showComments ? "active" : ""}`} 
            onClick={handleCommentClick}
            title="Reply"
          >
            <span className="action-icon">💬</span>
            <span className="action-count">{formatNumber(commentCount)}</span>
          </button>

          <button
            className={`action-btn repost-btn ${reposted ? "reposted" : ""}`}
            onClick={handleRepost}
            title="Repost"
          >
            <span className="action-icon">🔄</span>
            <span className="action-count">{formatNumber(repostCount)}</span>
          </button>

          <button
            className={`action-btn like-btn ${liked ? "liked" : ""}`}
            onClick={handleLike}
            title="Like"
          >
            <span className="action-icon">{liked ? "❤️" : "🤍"}</span>
            <span className="action-count">{formatNumber(likeCount)}</span>
          </button>

          <button className="action-btn views-btn" title="Views">
            <span className="action-icon">👁️</span>
            <span className="action-count">{formatNumber(viewCount)}</span>
          </button>

          <div className="action-btn-group">
            <button
              className={`action-btn bookmark-btn ${bookmarked ? "bookmarked" : ""}`}
              onClick={handleBookmark}
              title="Bookmark"
            >
              <span className="action-icon">{bookmarked ? "🔖" : "📑"}</span>
            </button>
            <button className="action-btn share-btn" title="Share">
              <span className="action-icon">📤</span>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="comments-section">
            {/* Comment Input */}
            <form className="comment-form" onSubmit={handleSubmitComment}>
              <div className="comment-input-wrapper">
                <span className="comment-avatar">👤</span>
                <div className="comment-input-container">
                  <textarea
                    ref={commentInputRef}
                    className="comment-textarea"
                    placeholder="Write a reply..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    maxLength={280}
                    rows={1}
                    onInput={(e) => {
                      e.target.style.height = 'auto';
                      e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                  />
                  <div className="comment-form-footer">
                    <span className={`char-counter ${commentText.length > 260 ? 'warning' : ''}`}>
                      {280 - commentText.length}
                    </span>
                    <button
                      type="submit"
                      className="post-reply-btn"
                      disabled={!commentText.trim() || isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="btn-spinner"></span>
                      ) : (
                        "Reply"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {/* Comments List */}
            <div className="comments-list">
              {loadingComments ? (
                <div className="comments-loading">
                  <div className="spinner small"></div>
                  <span>Loading replies...</span>
                </div>
              ) : comments.length === 0 ? (
                <div className="no-comments">
                  <p>No replies yet. Be the first to reply!</p>
                </div>
              ) : (
                comments.map(comment => (
                  <div key={comment._id} className="comment-item">
                    <div className="comment-main">
                      <span className="comment-avatar-small">
                        {comment.author?.avatar || "👤"}
                      </span>
                      <div className="comment-content">
                        <div className="comment-header">
                          <span className="comment-author">
                            {comment.author?.name || "Anonymous"}
                          </span>
                          <span className="comment-time">
                            {formatTime(comment.createdAt)}
                          </span>
                        </div>
                        <p className="comment-text">{comment.content}</p>
                        <button 
                          className="reply-btn"
                          onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                        >
                          ↩️ Reply
                        </button>
                      </div>
                    </div>

                    {/* Reply Input */}
                    {replyingTo === comment._id && (
                      <div className="reply-form">
                        <span className="reply-avatar">👤</span>
                        <div className="reply-input-container">
                          <input
                            type="text"
                            className="reply-input"
                            placeholder={`Reply to ${comment.author?.name || 'this comment'}...`}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            maxLength={280}
                            autoFocus
                          />
                          <div className="reply-actions">
                            <button 
                              className="cancel-reply-btn"
                              onClick={() => { setReplyingTo(null); setReplyText(""); }}
                            >
                              Cancel
                            </button>
                            <button 
                              className="submit-reply-btn"
                              onClick={() => handleReplySubmit(comment._id)}
                              disabled={!replyText.trim()}
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Nested Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="nested-replies">
                        {comment.replies.map(reply => (
                          <div key={reply._id} className="reply-item">
                            <span className="comment-avatar-small">
                              {reply.author?.avatar || "👤"}
                            </span>
                            <div className="comment-content">
                              <div className="comment-header">
                                <span className="comment-author">
                                  {reply.author?.name || "Anonymous"}
                                </span>
                                <span className="comment-time">
                                  {formatTime(reply.createdAt)}
                                </span>
                              </div>
                              <p className="comment-text">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Media Lightbox Modal */}
      {expandedMedia && (
        <div className="media-lightbox" onClick={() => setExpandedMedia(null)}>
          <button className="lightbox-close" onClick={() => setExpandedMedia(null)}>
            ✕
          </button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            {expandedMedia.type === "image" ? (
              <img src={expandedMedia.url} alt="Expanded media" />
            ) : (
              <video src={expandedMedia.url} controls autoPlay />
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default PostCard;
