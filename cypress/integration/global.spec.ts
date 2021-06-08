describe('Global Elements', () => {
  context('Mobile', () => {
    before(() => {
      cy.setLocalStorage('headless:subscribe', { value: 'hidden', expiry: 0 })
      cy.viewport('iphone-6')
      cy.visit('/')
    })
    
    it('menu should toggle on and off', () => {
      const drawerSelector = '[data-test-id="header-navigation-mobile-drawer"]'
      const triggerSelector = '[data-test-id="header-navigation-mobile-menu-trigger"]'
      const buttonSelector = 'button[data-test-id^="header-navigation-mobile-accordion"]'

      cy.get(drawerSelector, { timeout: 10000 }).should('not.be.visible')
      cy.get(triggerSelector).click()
      cy.get(drawerSelector).should('be.visible')
      cy.get(buttonSelector).each((button, i) => {
        const shoeIconSelector = `[data-test-id^="header-navigation-mobile-accordion-shoe-icon-${i}"]`
        const linkItemSelector = `[data-test-id^="header-navigation-mobile-accordion-link-item-${i}"]`
        button.click()
        cy.get(shoeIconSelector).first().scrollIntoView()
        cy.wait(100)
        cy.get(shoeIconSelector).first().should('be.visible')
        cy.get(linkItemSelector).first().scrollIntoView()
        cy.wait(100)
        cy.get(linkItemSelector).first().should('be.visible')
      })
    })

    it('search should display', () => {
      const containerSelector = '[data-test-id="header-search-container"]'
      const searchTriggerSelector = '[data-test-id="header-navigation-mobile-search-trigger"]'
      const searchInputSelector = '[aria-label="DesktopSearchForm"]'
      const noResultsSelector = '[data-test-id="header-search-desktop-no-results"]'
      const closeTriggerSelector = '[data-test-id="header-search-close-trigger"]'
      const searchText = 'abcd1234'

      cy.get(containerSelector).should('not.be.visible')
      cy.get(searchTriggerSelector).click()
      cy.get(containerSelector).should('be.visible')
      cy.get(searchInputSelector).type(searchText)
      cy.get(noResultsSelector).should('be.visible')
      cy.get(closeTriggerSelector).click({ multiple: true, force: true })
    })

    it('mini-cart should display', () => {
      const cartTriggerSelector = '[data-test-id="cart-drawer-trigger"]'
      const cartDrawerSelector = '[data-test-id="cart-drawer"]'

      cy.get(cartDrawerSelector).should('not.be.visible')
      cy.get(cartTriggerSelector).click()
      cy.get(cartDrawerSelector).should('be.visible')
    })
  })

  context('Desktop', () => {
    beforeEach(() => {
      cy.setLocalStorage('headless:subscribe', { value: 'hidden', expiry: 0 })
      cy.viewport('macbook-15')
      cy.visit('/')
    })
    
    it('megamenu should display', () => {
      const panelSelector = '[data-test-id="header-navigation-desktop-panel-0"]'
      const itemSelector = '[data-test-id="header-navigation-desktop-item-0"]'

      cy.get(panelSelector, { timeout: 10000 }).should('not.be.visible')
      cy.get(itemSelector).trigger('mouseenter')
      cy.get(itemSelector).trigger('mouseover')
      cy.get(panelSelector).should('be.visible')
      cy.get(itemSelector).trigger('mouseout')
      cy.get(panelSelector).should('not.be.visible')
    })
  })
})