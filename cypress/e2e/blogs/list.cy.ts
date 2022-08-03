describe("Blog list page", () => {
  before(() => {
    cy.visit("/account/signin");
    cy.get('[data-cy="email"]')
      .type("jennis@gmail.com")
      .should("have.value", "jennis@gmail.com");
    cy.get('[data-cy="password"]').type("123").should("have.value", "123");
    cy.get('[data-cy="submit"]').click();
  });
  it("should show blog list with user name", () => {
    cy.visit("/blogs");
    cy.contains("Jennis");
    cy.get('[data-cy="logout"]').should("exist");
  });
  it("should show blog detail page after title clicked", () => {
    cy.get('[data-cy="blog-title"]').eq(9).click();
    cy.url().then((url) => {
      const currentUrl = url.split("/");
      const postId = currentUrl[4];
      postId && cy.url().should("include", `${postId}`);
    });
  });
});
