/// <reference types="cypress" />
declare namespace Cypress {
  interface Chainable {
     setLocalStorage(name: string, value: string | Record<string, string | number>): Chainable<Element>
  }
}

Cypress.Commands.add('setLocalStorage', (name, value) => {
  // This has to be stringified twice
  window.localStorage.setItem(name, JSON.stringify(JSON.stringify(value)))
});

Cypress.on('uncaught:exception', () => {
  return false
})