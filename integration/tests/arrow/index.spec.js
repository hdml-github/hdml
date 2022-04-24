/// <reference types="cypress" />

function testsuite() {
  it('window properties', () => {
    cy.window().then((window) => {
      expect(window['@hdml/arrow']).to.exist;
      expect(typeof window['@hdml/arrow']).to.eq('object');
      expect(window['@hdml/arrow'].__esModule).to.eq(true);
    })
  });
}

describe('window scope', () => {
  context('regular bundle', () => {
    beforeEach(() => {
      cy.visit(
        'integration/fixtures/arrow/index.html'
      );
    });
    testsuite();
  });
  context('minimized bundle', () => {
    beforeEach(() => {
      cy.visit(
        'integration/fixtures/arrow/index.min.html'
      );
    });
    testsuite();
  });
});