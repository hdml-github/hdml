/// <reference types="cypress" />

function testsuite() {
  it('window properties', () => {
    cy.window().then((window) => {
      expect(window['@hdml/table']).to.exist;
      expect(window['@hdml/table'].HdmlTable).to.exist;
      expect(typeof window['@hdml/table'].HdmlTable).to.eq('function');
      expect(window['@hdml/table'].__esModule).to.eq(true);
    })
  });
}

describe('window scope', () => {
  context('regular bundle', () => {
    beforeEach(() => {
      cy.visit(
        'integration/fixtures/table/HdmlTable.html'
      );
    });
    testsuite();
  });
  context('minimized bundle', () => {
    beforeEach(() => {
      cy.visit(
        'integration/fixtures/table/HdmlTable.min.html'
      );
    });
    testsuite();
  });
});