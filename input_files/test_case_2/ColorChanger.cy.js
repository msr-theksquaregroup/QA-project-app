describe("Check Contact", () => {
  it("Check Color Changer", () => {
    cy.visit("https://project-x-automation-website.vercel.app/");
    cy.url().should("eq", "https://project-x-automation-website.vercel.app/");
    cy.get(".color-changer-btn").click();
    cy.url().should(
      "eq",
      "https://project-x-automation-website.vercel.app/color-changer"
    );
    cy.get(".box").should("have.css", "background-color", "rgb(255, 0, 0)");
    cy.get(".green-btn").click();
    cy.get(".box").should("have.css", "background-color", "rgb(0, 128, 0)");
    cy.get(".blue-btn").click();
    cy.get(".box").should("have.css", "background-color", "rgb(0, 0, 255)");
  });

  it("Negative Check Color Changer", () => {
    cy.visit("https://project-x-automation-website.vercel.app/");
    cy.url().should("eq", "https://project-x-automation-website.vercel.app/");
    cy.get(".color-changer-btn").click();
    cy.url().should(
      "eq",
      "https://project-x-automation-website.vercel.app/color-changer"
    );
    cy.get(".box").should("have.css", "background-color", "rgb(255, 0, 0)");
    cy.get(".blue-btn").click();
    cy.get(".box").should("not.have.css", "background-color", "rgb(0, 128, 0)");
    cy.get(".blue-btn").click();
    cy.get(".box").should("have.css", "background-color", "rgb(0, 0, 255)");
  });

  it("Heading test", () => {
    cy.visit("https://project-x-automation-website.vercel.app/");
    cy.url().should("eq", "https://project-x-automation-website.vercel.app/");
    cy.get(".color-changer-btn").click();
    cy.url().should(
      "eq",
      "https://project-x-automation-website.vercel.app/color-changer"
    );
    cy.get(".heading")
      .should("have.text", "Color Changer")
      .should("be.visible")
      .should("have.css", "color", "rgb(255, 0, 0)");
  });
});
describe('ColorChanger Component', () => {
  beforeEach(() => {
    cy.visit('https://project-x-automation-website.vercel.app'); // go to home
    cy.get('.color-changer-btn').click(); // navigate to ColorChanger
  });

  it('should load the ColorChanger page and show heading', () => {
    cy.url().should('include', '/color-changer');
    cy.get('.heading').should('contain.text', 'Color Changer');
  });

  it('should render the color box with initial red color', () => {
    cy.get('.box').should('have.css', 'background-color', 'rgb(255, 0, 0)');
  });

  it('should change to green and verify the text still exists', () => {
    cy.get('.green-btn').click();
    cy.get('.box').should('have.css', 'background-color', 'rgb(0, 128, 0)');
    cy.get('.heading').should('be.visible');
  });

  it('should change to blue and maintain box dimensions', () => {
    cy.get('.blue-btn').click();
    cy.get('.box')
      .should('have.css', 'background-color', 'rgb(0, 0, 255)')
      .and('have.css', 'width', '200px')
      .and('have.css', 'height', '200px');
  });

  it('should allow rapid color changes and always reflect the last click', () => {
    cy.get('.red-btn').click();
    cy.get('.green-btn').click();
    cy.get('.blue-btn').click();
    cy.get('.box').should('have.css', 'background-color', 'rgb(0, 0, 255)');
  });

});


