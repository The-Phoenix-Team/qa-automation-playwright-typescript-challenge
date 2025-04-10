import { test, expect } from "@playwright/test";
import { ProductListPage } from "../../pages/ProductListPage";
//import { ShoppingCartPage } from "../../pages/ShoppingCartPage";
import { CheckoutProcessPage } from "../../pages/CheckoutProcessPage";
import { expectedProducts } from "../../utils/test-data";

const addedItems = [
  "Sauce Labs Bike Light",
  "Sauce Labs Bolt T-Shirt",
  "Sauce Labs Fleece Jacket",
];

test.use({
  storageState: "storage-state/demo/standard_user.json",
});

test("Standard User - E2E Checkout using POM and test data", async ({
  page,
}) => {
  const productList = new ProductListPage(page);
  //const cart = new ShoppingCartPage(page);
  const checkout = new CheckoutProcessPage(page);

  await page.goto("https://www.saucedemo.com/inventory.html");

  // Add/remove/add products
  await productList.addItem("Sauce Labs Backpack");
  await productList.addItem("Sauce Labs Bike Light");
  await productList.removeItem("Sauce Labs Backpack");
  await productList.addItem("Sauce Labs Bolt T-Shirt");
  await productList.addItem("Sauce Labs Fleece Jacket");

  await productList.goToCart();

  // Verify cart
  await checkout.verifyMultipleCartItems(addedItems);
  expect(await checkout.getCartItemCount()).toBe(3);

  // Checkout process
  await checkout.proceedToCheckout();
  await checkout.fillCheckoutDetails("Standard", "User", "12345");

  // Dynamically calculate totals from test data
  const itemTotal = addedItems
    .map((name) =>
      parseFloat(
        expectedProducts.find((p) => p.name === name)!.price.replace("$", "")
      )
    )
    .reduce((sum, price) => sum + price, 0);

  const tax = parseFloat((itemTotal * 0.08).toFixed(2));
  const total = parseFloat((itemTotal + tax).toFixed(2));

  await checkout.verifyItemTotal(`$${itemTotal.toFixed(2)}`);
  await checkout.verifyTaxAndTotal(
    `$${tax.toFixed(2)}`,
    `$${total.toFixed(2)}`
  );

  // Finish and confirm
  await checkout.finishCheckout();
  await checkout.expectOrderConfirmation();
});
