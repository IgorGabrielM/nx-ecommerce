describe('Fazer login correto', () => {
  beforeEach(() => cy.visit('http://localhost:4200/'));

  const usuario = require('../../cypress.env.json')

  it('Fazer login', () => {
    cy.get('[data-testid="email"]').type(usuario.email);
    cy.get('[data-testid="password"]').type(usuario.password);

    cy.get('[data-testid="button-signin"]').click();
  });
});
