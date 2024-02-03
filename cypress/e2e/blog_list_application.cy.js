describe("Blog app", () => {
  beforeEach(() => {
    cy.request("POST", `${Cypress.env("BACKEND")}/testing/reset`);
    const user = {
      name: "Suresh Y",
      username: "sureshy",
      password: "password",
    };
    cy.request("POST", `${Cypress.env("BACKEND")}/users`, user);
    cy.visit("");
  });
  it("Login form is shown", () => {
    cy.contains("Log in to the application");
  });

  describe("Login", () => {
    it("succeeds with correct credentials", () => {
      cy.get("#username").type("sureshy");
      cy.get("#password").type("password");
      cy.contains("Login").click();
      cy.contains("User logged in successfully!");
    });

    it("fails with wrong credentials", () => {
      cy.get("#username").type("testuser");
      cy.get("#password").type("wrongpassword");
      cy.contains("Login").click();

      cy.contains("username or password is invalid");
      cy.get(".error")
        .should("contain", "username or password is invalid")
        .and("have.css", "color", "rgb(255, 0, 0)")
        .and("have.css", "border-style", "solid");
    });
  });
  describe("When logged in", function () {
    beforeEach(function () {
      // log in user here
      cy.login({ username: "sureshy", password: "password" });
    });

    it("A blog can be created", function () {
      cy.contains("Show Blog Form").click();
      cy.get("#title").type("test title");
      cy.get("#url").type("https://testtitle.com");
      cy.get("#author").type("suresh");
      cy.get("#createBlog").click();
      cy.contains("a new blog test title by Suresh Y added");
      cy.contains("TEST TITLE - SURESH");
    });
    it("User can like a blog", () => {
      cy.contains("View").click();
      let previousLikes = cy.get("#likesCount");
      console.log("previousLikes", previousLikes);
      cy.get("#like").click();
      let updatedLikes = cy.get("#likesCount");
    });
  });
});
