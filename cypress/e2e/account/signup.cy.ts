describe("Signup test page", () => {
  beforeEach(() => {
    cy.visit("/account/signup");
  });
  it("should show invalid message if password is not matched", () => {
    cy.get('[data-cy="name"]')
      .type(Cypress.env("name"))
      .should("have.value", Cypress.env("name"));
    cy.get('[data-cy="email"]')
      .type(Cypress.env("email"))
      .should("have.value", Cypress.env("email"));
    cy.get('[data-cy="password"]')
      .type(Cypress.env("password"))
      .should("have.value", Cypress.env("password"));
    cy.get('[data-cy="password_confirm"]')
      .type("123www")
      .should("have.value", "123www");
    cy.get('[data-cy="submit"]').click();
    cy.contains("Passwords does not match");
    cy.url().should("include", "signup");
  });
  it("should go to signin page after signup succeed", () => {
    cy.get('[data-cy="name"]')
      .type(Cypress.env("name"))
      .should("have.value", Cypress.env("name"));
    cy.get('[data-cy="email"]')
      .type(Cypress.env("email"))
      .should("have.value", Cypress.env("email"));
    cy.get('[data-cy="password"]')
      .type(Cypress.env("password"))
      .should("have.value", Cypress.env("password"));
    cy.get('[data-cy="submit"]').click();
    cy.url().should("include", "/blogs");
  });
});
