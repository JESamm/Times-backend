import { useState, useRef } from "react";

function ComposePost({ onPost, user }) {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const handleSubmit = async () => {
    if ((content.trim() || media.length > 0) && !isSubmitting) {
      setIsSubmitting(true);
      try {
        // Send proper format to the API
        const postData = {
          content: content.trim(),
          type: 'post',
          media: media.map(m => ({ type: m.type, url: m.url }))
        };
        await onPost(postData);
        setContent("");
        setMedia([]);
        setIsExpanded(false);
      } catch (error) {
        console.error('Error creating post:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleMediaUpload = (e, type) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setMedia((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            type: type,
            url: event.target.result,
            name: file.name,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (id) => {
    setMedia((prev) => prev.filter((m) => m.id !== id));
  };

  const characterCount = content.length;
  const maxCharacters = 280;
  const isOverLimit = characterCount > maxCharacters;

  return (
    <div className="compose-post">
      <div className="compose-header">
        <span className="compose-avatar">👤</span>
        <div className="compose-input-wrapper">
          <textarea
            className="compose-input"
            placeholder="What's happening on campus?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            rows={isExpanded ? 3 : 1}
          />
        </div>
      </div>

      {/* Media Preview */}
      {media.length > 0 && (
        <div className="media-preview">
          {media.map((item) => (
            <div key={item.id} className="media-item">
              {item.type === "image" ? (
                <img src={item.url} alt="Upload" />
              ) : (
                <video src={item.url} controls />
              )}
              <button
                className="remove-media"
                onClick={() => removeMedia(item.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Compose Actions */}
      <div className="compose-actions">
        <div className="compose-tools">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            multiple
            hidden
            onChange={(e) => handleMediaUpload(e, "image")}
          />
          <input
            type="file"
            ref={videoInputRef}
            accept="video/*"
            hidden
            onChange={(e) => handleMediaUpload(e, "video")}
          />

          <button
            className="tool-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Add Photo"
          >
            🖼️
          </button>
          <button
            className="tool-btn"
            onClick={() => videoInputRef.current?.click()}
            title="Add Video"
          >
            🎥
          </button>
          <button className="tool-btn" title="Add GIF">
            GIF
          </button>
          <button className="tool-btn" title="Add Poll">
            📊
          </button>
          <button className="tool-btn" title="Add Emoji">
            😊
          </button>
          <button className="tool-btn" title="Schedule">
            📅
          </button>
          <button className="tool-btn" title="Location">
            📍
          </button>
        </div>

        <div className="compose-submit">
          {isExpanded && (
            <span
              className={`character-count ${isOverLimit ? "over-limit" : ""}`}
            >
              {characterCount}/{maxCharacters}
            </span>
          )}
          <button
            className="post-btn"
            onClick={handleSubmit}
            disabled={isSubmitting || isOverLimit || (!content.trim() && media.length === 0)}
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ComposePost;
