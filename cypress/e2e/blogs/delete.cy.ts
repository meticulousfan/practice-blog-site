import {
  join_graphQL,
  graphqlReqConfig
} from "../../../utils/graphql-test-utils";
let currentUser = null;
context("Edit blog page", () => {
  beforeEach(() => {
    cy.visit("/account/signin");
    cy.get('[data-cy="email"]')
      .type(Cypress.env("email"))
      .should("have.value", Cypress.env("email"));
    cy.get('[data-cy="password"]')
      .type("123")
      .should("have.value", Cypress.env("password"));
    cy.get('[data-cy="submit"]').click();
  });
  it("should show blog list with user name", () => {
    cy.get(`[data-id="${Cypress.env("email")}"]`)
      .first()
      .click();
    cy.contains(Cypress.env("email"));
    cy.get('[data-cy="delete"]').click();
    cy.get("button").contains("Ok").should("exist").click();
    cy.url().should("include", "/blogs");
  });
});
