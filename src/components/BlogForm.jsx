import { useState } from "react";

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    createBlog({
      title,
      author,
      url,
    });
    setAuthor("");
    setTitle("");
    setUrl("");
  };
  return (
    <form onSubmit={onSubmit}>
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
export default BlogForm;
