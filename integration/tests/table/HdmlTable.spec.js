/// <reference types="cypress" />

const { Errors } = require('../../../packages/messages');
const { elements } = require('../../../packages/table/esm/services/elementsIndex');

let table;

function testsuite() {
  context('<hdml-table></hdml-table>', () => {
    before(() => {
      cy.document().then((document) => {
        document.body.innerHTML = `
          <hdml-table></hdml-table>
        `;
      });
    });

    beforeEach(() => {
      cy.get('hdml-table').as('table');
    })

    // after(() => {
    //   table.remove();
    // });

    it('DOM-attributes default values', async () => {
      cy.get('@table').then((table) => {
        table = table[0];
        expect(table.nodeType).to.eql(1);
        expect(table.tagName).to.eql('HDML-TABLE');
        // expect(table.shadowRoot.innerHTML).to.eql('<!----><slot></slot>');
        expect(table.outerHTML).to.eql('<hdml-table name="default_table_name1" limit="0"></hdml-table>');
      });
      
      

      // cy.get('@table')
      //   .shadow()
      //   .invoke('prop', 'innerHTML')
      //   .should('eq', '<!----><slot></slot>');

      // cy.get('hdml-table')
      //   .invoke('prop', 'uid')
      //   .should('match', /^([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})|[0-9]+$/);

      // cy.get('hdml-table')
      //   .invoke('prop', 'outerHTML')
      //   .should('eq', '<hdml-table name="default_table_name" limit="0"></hdml-table>');

      // cy.get('hdml-table')
      //   .invoke('prop', 'name')
      //   .should('eq', 'default_table_name');

      // cy.get('hdml-table')
      //   .invoke('attr', 'name')
      //   .should('eq', 'default_table_name');

      // cy.get('hdml-table')
      //   .invoke('prop', 'limit')
      //   .should('eq', 0);

      // cy.get('hdml-table')
      //   .invoke('attr', 'limit')
      //   .should('eq', '0');
    });
  });

  // it("set 'id' attribute", () => {
  //   cy.get('hdml-table')
  //     .invoke('attr', 'id', 'a')
  //     .should('have.attr', 'id', 'a');

  //   cy.get('hdml-table')
  //     .invoke('prop', 'id')
  //     .should('eq', 'a');

  //   cy.get('hdml-table')
  //     .invoke('prop', 'outerHTML')
  //     .should('eq', '<hdml-table id="a"></hdml-table>');
  // });

  // it("set 'id' property", () => {
  //   cy.get('hdml-table')
  //     .invoke('prop', 'id', 'b')
  //     .should('have.prop', 'id', 'b');

  //   cy.get('hdml-table')
  //     .invoke('attr', 'id')
  //     .should('eq', 'b');

  //   cy.get('hdml-table')
  //     .invoke('prop', 'outerHTML')
  //     .should('eq', '<hdml-table id="b"></hdml-table>');
  // });

  // it("set 'limit' attribute", () => {
  //   cy.get('hdml-table')
  //     .invoke('attr', 'limit', '1000')
  //     .should('have.attr', 'limit', '1000');

  //   cy.get('hdml-table')
  //     .invoke('prop', 'limit')
  //     .should('eq', 1000);

  //   cy.get('hdml-table')
  //     .invoke('prop', 'outerHTML')
  //     .should('eq', '<hdml-table limit="1000"></hdml-table>');
  // });

  // it("set 'limit' property", () => {
  //   cy.get('hdml-table')
  //     .invoke('prop', 'limit', 2000)
  //     .should('have.prop', 'limit', 2000);

  //   cy.get('hdml-table')
  //     .invoke('attr', 'limit')
  //     .should('eq', '2000');

  //   cy.get('hdml-table')
  //     .invoke('prop', 'outerHTML')
  //     .should('eq', '<hdml-table limit="2000"></hdml-table>');
  // });
}

describe('HdmlTable component', () => {
  context('regular bundle', () => {
    beforeEach(() => {
      cy.visit(
        'integration/fixtures/table/index.html'
      );
    });
    testsuite();
  });
  // context('minimized bundle', () => {
  //   beforeEach(() => {
  //     cy.visit(
  //       'integration/fixtures/table/index.min.html'
  //     );
  //   });
  //   testsuite();
  // });
});
