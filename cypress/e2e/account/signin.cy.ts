describe("Signin test page", () => {
  before(() => {
    cy.visit("/account/signup");
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
      .type(Cypress.env("password"))
      .should("have.value", Cypress.env("password"));
    cy.get('[data-cy="submit"]').click();
  });
  it("should show error message after submitting invalid user input", () => {
    cy.visit("/account/signin");
    cy.get('[data-cy="email"]')
      .type(Cypress.env("email"))
      .should("have.value", Cypress.env("email"));
    cy.get('[data-cy="password"]').type("123ss").should("have.value", "123ss");
    cy.get('[data-cy="submit"]').click();
    cy.contains("Incorrect email or password");
  });
  it("should login after valid form submit", () => {
    cy.visit("/account/signin");
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
