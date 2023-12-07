describe('Fazer login correto', () => {
  beforeEach(() => cy.visit('http://localhost:4200/sign-up'));

  const usuario = require('../../cypress.env.json')

  it('Fazer login', () => {
    cy.get('[data-testid="email"]').type("hacofi6760@getmola.com");
    cy.get('[data-testid="name"]').type("User Test");
    cy.get('[data-testid="password"]').type("123456");
    cy.get('[data-testid="password-confirmation').type("123456")

    cy.get('[data-testid="button-signup"]').click();
  });
});
