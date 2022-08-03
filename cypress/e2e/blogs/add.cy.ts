describe("Add blog page", () => {
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
    cy.get('[data-cy="add"]').click();
    cy.get('[data-cy="title"]')
      .type("Hi, this is my first cypress example")
      .should("have.value", "Hi, this is my first cypress example");
    cy.get('[data-cy="category"]')
      .type("cypress")
      .should("have.value", "cypress");
    cy.get('[data-cy="description"]')
      .type("Very well known this blog site")
      .should("have.value", "Very well known this blog site");
    cy.get('[data-cy="submit"]').click();
    cy.url().should("include", "/blogs");
    cy.contains("Hi, this is my first cypress example");
  });
});
