import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notificatoin";

const localStorageKey = "loggedBlogAppUser";
const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
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
        message: `User logged in successfully!`,
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

  const loginForm = () => (
    <form onSubmit={onLoginFormSubmit}>
      <p>Log in to the application</p>
      <div>
        Username
        <input
          type="name"
          value={username}
          name="username"
          placeholder="username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        Password
        <input
          type="password"
          placeholder="password"
          value={password}
          name="password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    try {
      const blog = { title, author, url };
      const createdBlog = await blogService.create(blog);
      setNotification({
        message: `a new blog ${createdBlog.title} by ${user.name} added`,
        status: "success",
      });
      setTimeout(() => {
        setNotification(null);
      }, 3000);
      setBlogs(blogs.concat(createdBlog));
      setAuthor("");
      setTitle("");
      setUrl("");
    } catch (error) {
      const errorMessage = error.response.data.error;
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
      <form onSubmit={handleCreateBlog}>
        <br />
        <h2>Create New</h2>
        <div>
          Title
          <input
            name="title"
            type="text"
            placeholder="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          Author
          <input
            name="author"
            type="text"
            placeholder="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          Url
          <input
            name="url"
            type="text"
            placeholder="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <br />
        <button type="submit">Create</button>
      </form>
    );
  };

  const handleLogout = () => {
    window.localStorage.removeItem(localStorageKey);
    setUser(null);
  };

  return (
    <div>
      <Notification notification={notification} />
      {user === null && loginForm()}
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
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
