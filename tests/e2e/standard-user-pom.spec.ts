import { test, expect } from "@playwright/test";
import { ProductListPage } from "../../pages/ProductListPage";
import { ShoppingCartPage } from "../../pages/ShoppingCartPage";
import { CheckoutProcessPage } from "../../pages/CheckoutProcessPage";

test.use({
  storageState: "storage-state/demo/standard_user.json",
});

test("Standard User - E2E with dynamic POM and data validation", async ({
  page,
}) => {
  const productList = new ProductListPage(page);
  const cart = new ShoppingCartPage(page);
  const checkout = new CheckoutProcessPage(page);

  await page.goto("https://www.saucedemo.com/inventory.html");

  const cartItems = [
    "Sauce Labs Bike Light",
    "Sauce Labs Bolt T-Shirt",
    "Sauce Labs Fleece Jacket",
  ];

  // Add/remove/add flow
  await productList.addItem("Sauce Labs Backpack");
  await productList.addItem("Sauce Labs Bike Light");
  await productList.removeItem("Sauce Labs Backpack");
  await productList.addItem("Sauce Labs Bolt T-Shirt");
  await productList.addItem("Sauce Labs Fleece Jacket");
  await productList.goToCart();

  await cart.verifyMultipleCartItems(cartItems);
  expect(await cart.getCartItemCount()).toBe(cartItems.length);

  await cart.proceedToCheckout();
  await checkout.fillCheckoutDetails("Standard", "User", "12345");

  // ✅ Optional: item total and tax assertions
  await checkout.verifyItemTotal("$74.97");
  await checkout.verifyTaxAndTotal("$6.00", "$80.97");

  await checkout.finishCheckout();
  await checkout.expectOrderConfirmation();
});
