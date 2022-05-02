/// <reference types="cypress" />

function testsuite() {
  it('window properties', () => {
    cy.window().then((window) => {
      expect(window['@hdml/messages']).to.exist;
      expect(typeof window['@hdml/messages']).to.eq('object');
      expect(window['@hdml/messages'].__esModule).to.eq(true);
    })
  });
}

describe('window scope', () => {
  context('regular bundle', () => {
    beforeEach(() => {
      cy.visit(
        'integration/fixtures/messages/index.html'
      );
    });
    testsuite();
  });
  context('minimized bundle', () => {
    beforeEach(() => {
      cy.visit(
        'integration/fixtures/messages/index.min.html'
      );
    });
    testsuite();
  });
});