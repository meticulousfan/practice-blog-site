describe("My First Test", () => {
  it("visits the kitchen Sink", () => {
    cy.visit("https://example.cypress.io");
    cy.contains("type");
  });
});
