describe("Check Contact", () => {
    it("Check Contact", () => {
        cy.visit("https://www.udaykumar.tech/")
        cy.url().should('eq', 'https://www.udaykumar.tech/')
        cy.get('input#name').type('Uday Kumar').should('have.value', 'Uday Kumar')
        cy.get('#outlined-basic').type("7670848696").should('have.value', '7670848696')
        cy.get('#emailID').type("udaykumarvalapudasu@gmail.com").should('have.value', 'udaykumarvalapudasu@gmail.com')
})})