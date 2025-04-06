export const itemLocators: { [key: string]: string } = {
  backpack: '[data-test="add-to-cart-sauce-labs-backpack"]',
  "bike-light": '[data-test="add-to-cart-sauce-labs-bike-light"]',
  "bolt-tshirt": '[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]',
  "fleece-jacket": '[data-test="add-to-cart-sauce-labs-fleece-jacket"]',
  onesie: '[data-test="add-to-cart-sauce-labs-onesie"]',
};

/* We can also use same itemLocators and replace add-to-cart
 "remove-" for removing item from cart
 */

export const removeItemLocators: { [key: string]: string } = {
  "remove-backpack": '[data-test="remove-sauce-labs-backpack"]',
  "remove-bike-light": '[data-test="remove-sauce-labs-bike-light"]',
  "remove-bolt-tshirt": '[data-test="remove-sauce-labs-bolt-t-shirt"]',
  "remove-fleece-jacket": '[data-test="remove-sauce-labs-fleece-jacket"]',
  "remove-onesie": '[data-test="remove-sauce-labs-onesie"]',
};
