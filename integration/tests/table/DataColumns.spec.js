/// <reference types="cypress" />

let warn;
let warnNoTable;
Cypress.on('window:load', (win) => {
  warn = cy.spy(win.console, "warn");
  warnNoTable = warn.withArgs(
    'Disabling. No associated <hdml-table/> component found in ' +
          'the DOM-tree.',
  ).as('warnNoTable');
});

function testsuite() {
  context('standalone', () => {
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
        .invoke('prop', 'table')
        .should('eq', null);

      cy.get('data-columns')
        .invoke('attr', 'disabled')
        .should('eq', 'disabled');

      cy.get('data-columns')
        .invoke('prop', 'disabled')
        .should('eq', true);

      expect(warnNoTable).to.be.called;
    });

    it("'disabled' attribute can not be removed", () => {
      cy.get('data-columns')
        .invoke('prop', 'disabled')
        .should('eq', true);

      cy.get('data-columns')
        .invoke('attr', 'disabled')
        .should('eq', 'disabled');

      cy.get('data-columns')
        .invoke('attr', 'disabled', null)
        .should('have.attr', 'disabled', 'disabled');

      cy.get('data-columns')
        .invoke('prop', 'disabled')
        .should('eq', true);

      expect(warnNoTable).to.be.called;
    });
  });

  context('parent exist', () => {
    beforeEach(() => {
      cy.document().then( document => {
        document.body.innerHTML = `
          <hdml-table>
            <data-columns></data-columns>
          </hdml-table>
        `;
      });
    });

    it('DOM-attributes default values', () => {
      const table = Cypress.$('hdml-table')[0];

      cy.get('data-columns')
        .invoke('prop', 'nodeType')
        .should('eq', 1);

      cy.get('data-columns')
        .invoke('prop', 'tagName')
        .should('eq', 'DATA-COLUMNS');

      cy.get('data-columns')
        .invoke('prop', 'outerHTML')
        .should('eq', '<data-columns></data-columns>');

      cy.get('data-columns')
        .shadow()
        .invoke('prop', 'innerHTML')
        .should('eq', '<!----><slot></slot>');

      cy.get('data-columns')
        .invoke('prop', 'table')
        .should('eq', table);

      cy.get('data-columns')
        .invoke('attr', 'disabled')
        .should('eq', undefined);

      cy.get('data-columns')
        .invoke('prop', 'disabled')
        .should('eq', false);
      
      expect(warnNoTable).not.to.have.been.called;
    });

    it("'disabled' attribute can be added", () => {
      cy.get('data-columns')
        .invoke('prop', 'disabled')
        .should('eq', false);

      cy.get('data-columns')
        .invoke('attr', 'disabled')
        .should('eq', undefined);

      cy.get('data-columns')
        .invoke('attr', 'disabled', '')
        .should('have.attr', 'disabled', 'disabled');

      cy.get('data-columns')
        .invoke('prop', 'disabled')
        .should('eq', true);

      expect(warnNoTable).not.to.have.been.called;
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
