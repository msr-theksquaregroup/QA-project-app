// Sample Cypress test file for testing
describe('Sample Application Tests', () => {
  beforeEach(() => {
    cy.visit('https://example.com');
  });

  it('should load the homepage', () => {
    cy.get('h1').should('be.visible');
    cy.get('h1').should('contain.text', 'Example Domain');
  });

  it('should have a working link', () => {
    cy.get('a').should('be.visible');
    cy.get('a').click();
    cy.url().should('eq', 'https://www.iana.org/domains/example');
  });

  it('should fill a form', () => {
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="email"]').should('have.value', 'test@example.com');
    cy.get('button[type="submit"]').click();
  });
});
