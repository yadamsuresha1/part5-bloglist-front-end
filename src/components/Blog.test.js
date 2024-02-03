import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Blog from "./Blog";
import BlogForm from "./BlogForm";

describe("<Blog/> component", () => {
  let container;
  const blog = {
    title: "test blog",
    author: "tester",
    url: "https://tester.com",
    likes: 0,
    user: {
      username: "sureshy",
      name: "suresh",
      id: "657fb7063ea1f3dbd4433529",
    },
    id: "65838be1c1a4254935430116",
  };
  const user = {
    name: "suresh",
    username: "sureshy",
  };
  const mockHandler = jest.fn();
  beforeEach(() => {
    container = render(
      <Blog currentBlog={blog} user={user} onBlogDeleted={mockHandler} />
    ).container;
  });
  test("Renders blog title and the author but does not render url or number of likes by default", () => {
    const titleElement = screen.getByText("TEST BLOG");
    expect(titleElement).toBeDefined();
    const authorElement = screen.getByText("TESTER");
    expect(authorElement).toBeDefined();
    const likesElement = container.querySelector(".blog-container-likes");
    expect(likesElement).toBeNull();
    const urlElement = container.querySelector(".blog-container-url");
    expect(urlElement).toBeNull();
  });
  test("Url and number of likes are shown on clicking view button", async () => {
    const user = userEvent.setup();
    const button = screen.getByText("View");
    await user.click(button);
    const likesElement = container.querySelector(".blog-container-likes");
    expect(likesElement).toBeDefined();
    const urlElement = container.querySelector(".blog-container-url");
    expect(urlElement).toBeDefined();
  });
  test("like button is clicked twice", async () => {
    const user = userEvent.setup();
    const button = screen.getByText("View");
    await user.click(button);

    //This needs to be updated later on
    const likesButton = container.querySelector(".beautiful-button");
    await user.click(likesButton);
    await user.click(likesButton);
    const likesIncreased = screen.getByText("Likes: 0");

    expect(likesIncreased).toBeDefined();
  });
  test("new blog is created successfully!", async () => {
    const mockHandler = jest.fn();
    container = render(<BlogForm createBlog={mockHandler} />).container;
    const titleInput = screen.getByPlaceholderText("title");
    const user = userEvent.setup();

    await user.type(titleInput, "mynewblog");
    const authorInput = screen.getByPlaceholderText("author");
    await user.type(authorInput, "new author");
    const urlInput = screen.getByPlaceholderText("url");
    await user.type(urlInput, "new url");
    const createButton = screen.getByText("Create");
    await user.click(createButton);
  });
});
