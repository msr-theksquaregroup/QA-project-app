// Contact form test
describe('Contact Form Tests', () => {
  it('should submit contact form successfully', () => {
    cy.visit('https://example-contact.com');
    
    cy.get('#contact-name').type('John Doe');
    cy.get('#contact-email').type('john@example.com');
    cy.get('#contact-message').type('This is a test message');
    
    cy.get('#contact-name').should('have.value', 'John Doe');
    cy.get('#contact-email').should('have.value', 'john@example.com');
    
    cy.get('button[type="submit"]').click();
    
    cy.get('.success-message').should('be.visible');
    cy.get('.success-message').should('contain.text', 'Thank you');
    
    cy.url().should('eq', 'https://example-contact.com/success');
  });
});
