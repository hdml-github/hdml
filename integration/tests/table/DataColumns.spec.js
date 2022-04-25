/// <reference types="cypress" />

let warn;
let warnNoTable;
Cypress.on('window:before:load', (win) => {
  warn = cy.spy(win.console, "warn");
  warnNoTable = warn.withArgs(
    'No associated <hdml-table/> component found in the DOM-tree.'
  ).as('warnNoTable');
});

function testsuite() {
  context('no parent, no children', () => {
    beforeEach(() => {
      cy.document().then( document => {
        document.body.innerHTML = `
          <data-columns></data-columns>
        `;
      });
    });

    it('DOM-attributes default values', () => {
      cy.get('data-columns')
        .invoke('prop', 'nodeType')
        .should('eq', 1);

      cy.get('data-columns')
        .invoke('prop', 'tagName')
        .should('eq', 'DATA-COLUMNS');

      cy.get('data-columns')
        .invoke('prop', 'outerHTML')
        .should('eq', '<data-columns disabled=""></data-columns>');

      cy.get('data-columns')
        .shadow()
        .invoke('prop', 'innerHTML')
        .should('eq', '<!----><slot></slot>');

      cy.get('data-columns')
        .invoke('prop', 'disabled')
        .should('eq', true);

      expect(warnNoTable).to.be.called;
    });
  });
}

describe('<data-columns/>', () => {
  context('regular bundle', () => {
    beforeEach(() => {
      cy.visit(
        'integration/fixtures/table/DataColumns.html'
      );
    });
    testsuite();
  });
  context('minimized bundle', () => {
    beforeEach(() => {
      cy.visit(
        'integration/fixtures/table/DataColumns.min.html'
      );
    });
    testsuite();
  });
});
