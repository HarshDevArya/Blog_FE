// Comments.jsx
import { useState, useEffect } from "react";

export default function Comments({ blogId }) {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [replyParentId, setReplyParentId] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    async function fetchComments() {
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${baseURL}/api/comments?blog=${blogId}`, {
          credentials: "include",
        });
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchComments();
  }, [blogId]);

  // Post a new top-level comment
  const handleNewCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${baseURL}/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: newComment, blog: blogId }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to post comment");
      }
      const comment = await response.json();
      setComments((prev) => [...prev, comment]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
      alert(error.message);
    }
  };

  // Post a reply to a specific comment
  const handleReplySubmit = async (e, parentId) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${baseURL}/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          content: replyContent,
          blog: blogId,
          parentComment: parentId,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to post reply");
      }
      const reply = await response.json();
      setComments((prev) => [...prev, reply]);
      setReplyContent("");
      setReplyParentId(null);
    } catch (error) {
      console.error("Error posting reply:", error);
      alert(error.message);
    }
  };

  // Helper function to recursively render comments and their replies
  const renderComments = (parentId = null) => {
    return comments
      .filter((comment) =>
        parentId ? comment.parentComment === parentId : !comment.parentComment
      )
      .map((comment) => (
        <div
          key={comment._id}
          style={{
            marginLeft: parentId ? "20px" : "0px",
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}>
          <p>
            <strong>{comment.author?.email}</strong>: {comment.content}
          </p>
          <button
            className="btn btn-link"
            onClick={() =>
              setReplyParentId(
                replyParentId === comment._id ? null : comment._id
              )
            }>
            Reply
          </button>
          {replyParentId === comment._id && (
            <form onSubmit={(e) => handleReplySubmit(e, comment._id)}>
              <input
                type="text"
                className="form-control"
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-sm mt-2">
                Submit Reply
              </button>
            </form>
          )}
          {renderComments(comment._id)}
        </div>
      ));
  };

  return (
    <div className="mt-4">
      <h3>Comments</h3>
      {isLoading ? <p>Loading comments...</p> : <div>{renderComments()}</div>}
      <form onSubmit={handleNewCommentSubmit} className="mt-3">
        <div className="mb-3">
          <textarea
            className="form-control"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          Post Comment
        </button>
      </form>
    </div>
  );
}
