describe('주문 목록 페이지', () => {
  it('주문 목록이 정상적으로 렌더링된다', () => {
    cy.visit('/order');
    cy.contains('주문 목록').should('exist');
    cy.get('ul[role="list"]').should('exist');
  });
});
