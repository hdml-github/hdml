/// <reference types="cypress" />

function testsuite() {
  it('DOM-attributes default values', () => {
    cy.get('hdml-table')
      .invoke('prop', 'nodeType')
      .should('eq', 1);

    cy.get('hdml-table')
      .invoke('prop', 'tagName')
      .should('eq', 'HDML-TABLE');

    cy.get('hdml-table')
      .invoke('prop', 'outerHTML')
      .should('eq', '<hdml-table></hdml-table>');

    cy.get('hdml-table')
      .invoke('prop', 'id')
      .should('eq', undefined);

    cy.get('hdml-table')
      .invoke('attr', 'id')
      .should('eq', undefined);

    cy.get('hdml-table')
      .invoke('prop', 'limit')
      .should('eq', undefined);

    cy.get('hdml-table')
      .invoke('attr', 'limit')
      .should('eq', undefined);

    cy.get('hdml-table')
      .shadow()
      .invoke('prop', 'innerHTML')
      .should('eq', '<!----><slot></slot>');
  });

  it("set 'id' attribute", () => {
    cy.get('hdml-table')
      .invoke('attr', 'id', 'a')
      .should('have.attr', 'id', 'a');

    cy.get('hdml-table')
      .invoke('prop', 'id')
      .should('eq', 'a');

    cy.get('hdml-table')
      .invoke('prop', 'outerHTML')
      .should('eq', '<hdml-table id="a"></hdml-table>');
  });

  it("set 'id' property", () => {
    cy.get('hdml-table')
      .invoke('prop', 'id', 'b')
      .should('have.prop', 'id', 'b');

    cy.get('hdml-table')
      .invoke('attr', 'id')
      .should('eq', 'b');

    cy.get('hdml-table')
      .invoke('prop', 'outerHTML')
      .should('eq', '<hdml-table id="b"></hdml-table>');
  });

  it("set 'limit' attribute", () => {
    cy.get('hdml-table')
      .invoke('attr', 'limit', '1000')
      .should('have.attr', 'limit', '1000');

    cy.get('hdml-table')
      .invoke('prop', 'limit')
      .should('eq', 1000);

    cy.get('hdml-table')
      .invoke('prop', 'outerHTML')
      .should('eq', '<hdml-table limit="1000"></hdml-table>');
  });

  it("set 'limit' property", () => {
    cy.get('hdml-table')
      .invoke('prop', 'limit', 2000)
      .should('have.prop', 'limit', 2000);

    cy.get('hdml-table')
      .invoke('attr', 'limit')
      .should('eq', '2000');

    cy.get('hdml-table')
      .invoke('prop', 'outerHTML')
      .should('eq', '<hdml-table limit="2000"></hdml-table>');
  });
}

describe('<hdml-table></hdml-table>', () => {
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
