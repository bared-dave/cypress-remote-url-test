describe('Currency Switching', () => {
  const triggerSelector = '[data-test-id="currency-switcher-trigger"]'
  const priceNormalSelector = '[data-test-id="product-price-normal"]'
  const priceDiscountedSelector = '[data-test-id="product-price-discounted"]'
  const audSelector = '[data-test-id="currency-switcher-item-AUD"]'
  const nzdSelector = '[data-test-id="currency-switcher-item-NZD"]'
  const usdSelector = '[data-test-id="currency-switcher-item-USD"]'

  const mockShopifyAPI = (req) => {
    if (req.body.operationName == 'GET_SHOP_SETTINGS') {
      req.alias = 'GetShopSettings'
      req.reply({
        fixture: 'checkout.bared.com.au/shopSettings.json'
      })
    }
    
    if (req.body.operationName == 'CHECKOUT_CREATE') {
      req.alias = 'CheckoutCreate'
    }

    if (req.body.variables?.handle === 'aluminium-black-lace-ups') {
      req.alias = 'GetProduct'
      req.reply({
        fixture: 'checkout.bared.com.au/products/aluminium.json'
      })
    }
  }

  const mockLocationAPI = (code) => (req) => {
    req.reply({
      fixture: `ipapi.co/${code}.json`,
    })
  }

  context('Default', () => {
    beforeEach(() => {
      cy.setLocalStorage('headless:subscribe', { value: 'hidden', expiry: 0 })
      cy.intercept({ url: 'https://ipapi.co/json/?*', middleware: true }, mockLocationAPI('au')).as('LocationAU')
      cy.intercept({ url: '**/api/*/graphql.json', middleware: true }, mockShopifyAPI)
      cy.visit('/products/aluminium-black-lace-ups')
      cy.wait(['@GetShopSettings', '@CheckoutCreate', '@GetProduct', '@LocationAU'])
    })

    it('clicking trigger should display available currencies', () => {
      cy.get(priceNormalSelector).first().should('have.text', '$289')
      cy.get(priceDiscountedSelector).first().should('have.text', '$210')
      cy.get(triggerSelector).click({ force: true })
      cy.get(audSelector).should('be.visible')
      cy.get(nzdSelector).should('be.visible')
      cy.get(usdSelector).should('be.visible')
      cy.get(usdSelector).click({ force: true })
      cy.wait(['@GetShopSettings', '@CheckoutCreate'])
      cy.get(priceNormalSelector).first().should('have.text', 'USD$246')
      cy.get(priceDiscountedSelector).first().should('have.text', 'USD$179')
      cy.get(nzdSelector).click({ force: true })
      cy.wait(['@GetShopSettings', '@CheckoutCreate'])
      cy.get(priceNormalSelector).first().should('have.text', 'NZD$315')
      cy.get(priceDiscountedSelector).first().should('have.text', 'NZD$229')
      cy.get(audSelector).click({ force: true })
      cy.wait(['@GetShopSettings', '@CheckoutCreate'])
      cy.get(priceNormalSelector).first().should('have.text', '$289')
      cy.get(priceDiscountedSelector).first().should('have.text', '$210')
    })
  })

  context('AUD', () => {
    beforeEach(() => {
      cy.setLocalStorage('headless:subscribe', { value: 'hidden', expiry: 0 })
      cy.intercept({ url: 'https://ipapi.co/json/?*', middleware: true }, mockLocationAPI('au')).as('LocationAU')
      cy.intercept({ url: '**/api/*/graphql.json', middleware: true }, mockShopifyAPI)
      cy.visit('/products/aluminium-black-lace-ups')
      cy.wait(['@GetShopSettings', '@CheckoutCreate', '@GetProduct', '@LocationAU'])
    })

    it('should default to AUD when user is in AU', () => {
      cy.get(triggerSelector).should('have.text', 'AUD')
    })
  })

  context('USD', () => {
    beforeEach(() => {
      cy.setLocalStorage('headless:subscribe', { value: 'hidden', expiry: 0 })
      cy.intercept({ url: 'https://ipapi.co/json/?*', middleware: true }, mockLocationAPI('us')).as('LocationUS')
      cy.intercept({ url: '**/api/*/graphql.json', middleware: true }, mockShopifyAPI)
      cy.visit('/products/aluminium-black-lace-ups')
      cy.wait(['@GetShopSettings', '@CheckoutCreate', '@GetProduct', '@LocationAU'])
    })

    it('should default to USD when user is in US', () => {
      cy.get(triggerSelector).should('have.text', 'USD')
    })
  })

  context('NZD', () => {
    beforeEach(() => {
      cy.setLocalStorage('headless:subscribe', { value: 'hidden', expiry: 0 })
      cy.intercept({ url: 'https://ipapi.co/json/?*', middleware: true }, mockLocationAPI('nz')).as('LocationNZ')
      cy.intercept({ url: '**/api/*/graphql.json', middleware: true }, mockShopifyAPI)
      cy.visit('/products/aluminium-black-lace-ups')
      cy.wait(['@GetShopSettings', '@CheckoutCreate', '@GetProduct', '@LocationAU'])
    })

    it('should default to NZD when user is in NZ', () => {
      cy.get(triggerSelector).should('have.text', 'NZD')
    })
  })

  context('Other', () => {
    beforeEach(() => {
      cy.setLocalStorage('headless:subscribe', { value: 'hidden', expiry: 0 })
      cy.intercept({ url: 'https://ipapi.co/json/?*', middleware: true }, mockLocationAPI('zw')).as('LocationZW')
      cy.intercept({ url: '**/api/*/graphql.json', middleware: true }, mockShopifyAPI)
      cy.visit('/products/aluminium-black-lace-ups')
      cy.wait(['@GetShopSettings', '@CheckoutCreate', '@GetProduct', '@LocationAU'])
    })

    it('should default to AUD when user is in in an unsupported country', () => {
      cy.get(triggerSelector).should('have.text', 'AUD')
    })
  })
})