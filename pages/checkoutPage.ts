// ✅ pages/CheckoutPage.ts
// Checkout Page Object to complete customer checkout flows
import { expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { ProductType } from "../utils/types";

export class CheckoutPage extends BasePage {
  private firstNameInput = "[data-test='firstName']";
  private lastNameInput = "[data-test='lastName']";
  private postalCodeInput = "[data-test='postalCode']";
  private continueButton = "[data-test='continue']";
  private finishButton = "[data-test='finish']";
  private orderCompleteMessage = ".complete-header";
  private backHomeButton = "[data-test='back-to-products']";
  private checkoutCompleteText = '[data-test="secondary-header"]';

  // Fill and submit checkout information form
  async fillCheckoutForm(first: string, last: string, zip: string) {
    await this.page.fill(this.firstNameInput, first);
    await this.page.fill(this.lastNameInput, last);
    await this.page.fill(this.postalCodeInput, zip);
    await this.page.click(this.continueButton);
  }

  // Finish the checkout
  async finishCheckout() {
    await this.page.click(this.finishButton);
  }

  // Get the order confirmation message after success
  async getConfirmationMessage() {
    return await this.page.locator(this.orderCompleteMessage).textContent();
  }

  // Get the error message on checkout failure
  async getErrorMessage() {
    return await this.page.locator('[data-test="error"]').textContent();
  }

  // Validate total item amount matches expected
  async verifyItemTotal(products: ProductType[]) {
    const expectedTotal = products.reduce(
      (sum, p) => sum + parseFloat(p.price.replace("$", "")),
      0
    );
    const itemTotalText = await this.page
      .locator(".summary_subtotal_label")
      .textContent();
    const actual = parseFloat(itemTotalText?.split("$")[1] || "0");
    expect(actual).toBeCloseTo(expectedTotal, 2);
  }

  // Validate calculated tax value is accurate
  async verifyTax(expectedRate = 0.08) {
    const subtotalText = await this.page
      .locator(".summary_subtotal_label")
      .textContent();
    const taxText = await this.page.locator(".summary_tax_label").textContent();
    const subtotal = parseFloat(subtotalText?.split("$")[1] || "0");
    const actualTax = parseFloat(taxText?.split("$")[1] || "0");
    const expectedTax = +(subtotal * expectedRate).toFixed(2);
    expect(actualTax).toBeCloseTo(expectedTax, 2);
  }

  // Validate final total = item total + tax
  async verifyTotalAmount() {
    const totalText = await this.page
      .locator(".summary_total_label")
      .textContent();
    const displayedTotal = parseFloat(totalText?.split("$")[1] || "0");
    const subtotalText = await this.page
      .locator(".summary_subtotal_label")
      .textContent();
    const taxText = await this.page.locator(".summary_tax_label").textContent();
    const subtotal = parseFloat(subtotalText?.split("$")[1] || "0");
    const tax = parseFloat(taxText?.split("$")[1] || "0");
    const expectedTotal = +(subtotal + tax).toFixed(2);
    expect(displayedTotal).toBeCloseTo(expectedTotal, 2);
  }
}
