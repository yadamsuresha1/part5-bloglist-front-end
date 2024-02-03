import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notificatoin";
import BlogForm from "./components/BlogForm";
import Toggable from "./components/Toggable";
import LoginForm from "./components/LoginForm";

const localStorageKey = "loggedBlogAppUser";
const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const blogFormRef = useRef();

  useEffect(() => {
    const getBlogs = async () => {
      const blogs = await blogService.getAll();
      console.log("suresh", "blogs", blogs);
      const sortedBlogs = blogs.sort((b1, b2) => b2.likes - b1.likes);
      setBlogs(sortedBlogs);
    };
    getBlogs();
  }, []);

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem(localStorageKey);
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      setUser(user);
      blogService.saveToken(user.token);
    }
  }, []);

  const onLoginFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      //save the user the browser local storage.
      window.localStorage.setItem(localStorageKey, JSON.stringify(user));
      blogService.saveToken(user.token);
      setNotification({
        message: "User logged in successfully!",
        status: "success",
      });
      setTimeout(() => {
        setNotification(null);
      }, 3000);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (error) {
      const errorMessage = error.response.data.error;

      setNotification({
        message: errorMessage,
        status: "error",
      });
      setUsername("");
      setPassword("");
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  const handleCreateBlog = async (blog) => {
    try {
      const createdBlog = await blogService.create(blog);
      setNotification({
        message: `a new blog ${createdBlog.title} by ${user.name} added`,
        status: "success",
      });
      console.log("createdBlog", createdBlog);
      createdBlog.user = user;
      blogFormRef.current.toggleVisibility();
      setTimeout(() => {
        setNotification(null);
      }, 3000);
      setBlogs(blogs.concat(createdBlog));
    } catch (error) {
      const errorMessage = error.response.data.error;
      if (errorMessage.includes("login again")) {
        window.localStorage.removeItem(localStorageKey);
        setUser(null);
      }
      setNotification({
        message: errorMessage,
        status: "error",
      });
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  const createBlogForm = () => {
    return (
      <Toggable buttonLabel="Show Blog Form" ref={blogFormRef}>
        <BlogForm createBlog={handleCreateBlog} />
      </Toggable>
    );
  };

  const handleLogout = () => {
    window.localStorage.removeItem(localStorageKey);
    setUser(null);
  };

  const handleOnBlogDeleted = (message, status, blogId) => {
    setNotification({ message: message, status: status });
    setBlogs(blogs.filter((b) => b.id !== blogId));
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  return (
    <div>
      <Notification notification={notification} />
      {user === null && (
        <LoginForm
          handleFormSubmit={onLoginFormSubmit}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          username={username}
          password={password}
        />
      )}
      {user && (
        <div>
          {`${user.name} logged in`}{" "}
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
      {user && createBlogForm()}
      <br />
      {user && (
        <div>
          <h2>Blogs</h2>
          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              currentBlog={blog}
              onBlogDeleted={handleOnBlogDeleted}
              user={user}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
