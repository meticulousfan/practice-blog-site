describe("Edit blog page", () => {
  beforeEach(() => {
    cy.visit("/account/signin");
    cy.get('[data-cy="email"]')
      .type(Cypress.env("email"))
      .should("have.value", Cypress.env("email"));
    cy.get('[data-cy="password"]')
      .type("123")
      .should("have.value", Cypress.env("password"));
    cy.get('[data-cy="submit"]')
      .click()
      .should(() => {
        expect(localStorage.getItem("token")).to.exist;
      });
  });
  it("should show blog list with user name", () => {
    cy.get(`[data-id="${Cypress.env("email")}"]`)
      .first()
      .click();
    cy.contains(Cypress.env("email"));
    cy.get('[data-cy="edit"]').click();
    cy.get('[data-cy="modal-title"]')
      .clear()
      .type("I was a student")
      .should("have.value", "I was a student");
    cy.get('[data-cy="modal-category"]')
      .clear()
      .type("npm")
      .should("have.value", "npm");
    cy.get('[data-cy="modal-description"]')
      .clear()
      .type("when I was a young meerkat")
      .should("have.value", "when I was a young meerkat");
    cy.get('[data-cy="modal-submit"]').click();
    cy.wait(3000);
    cy.contains("when I was a young meerkat");
  });
});
