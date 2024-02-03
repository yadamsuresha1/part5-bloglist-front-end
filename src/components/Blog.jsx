import { useState } from "react";
import blogService from "../services/blogs";
import PropTypes from "prop-types";

const Blog = ({ currentBlog, onBlogDeleted, user }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [blog, setBlog] = useState(currentBlog);

  const handleOnLike = async () => {
    blog.likes = blog.likes + 1;
    blog.user = blog.user.id;
    try {
      const response = await blogService.update(blog);
      setBlog(response);
      console.log("likes response", response);
    } catch (error) {}
  };

  const handleOnDelete = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.user.name}`)) {
      try {
        const response = await blogService.deleteBlog(blog.id);
        if (response.status === 204) {
          onBlogDeleted(
            `${blog.title} Deleted successfully!`,
            "success",
            blog.id
          );
          console.log("response", response);
        } else {
          onBlogDeleted(`Error deleting blog ${blog.title}`, "error");
        }
      } catch (error) {}
    }
  };

  return (
    <div className="blog-container">
      <div>
        <b className="blog-container-title">{blog.title.toUpperCase()}</b> -{" "}
        <b className="blog-container-author">{blog.author.toUpperCase()}</b>
        <button
          className="beautiful-button"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? "Hide" : "View"}
        </button>
      </div>
      {showDetails && (
        <div>
          <p className="blog-container-url">{`Url: ${blog.url}`}</p>
          <p className="blog-container-likes">
            {`Likes: `}
            <b id="likesCount">{blog.likes}</b>

            <button
              id="like"
              className="beautiful-button"
              onClick={handleOnLike}
            >
              Like
            </button>
          </p>
          <p className="blog-container-username">{`User: ${blog.user.name}`}</p>
          {user.username === blog.user.username && (
            <button className="beautiful-button" onClick={handleOnDelete}>
              Remove
            </button>
          )}
        </div>
      )}
    </div>
  );
};

Blog.propTypes = {
  currentBlog: PropTypes.object.isRequired,
  onBlogDeleted: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default Blog;
