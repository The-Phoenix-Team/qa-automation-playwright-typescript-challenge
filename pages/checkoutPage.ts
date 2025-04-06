import { BasePage } from "./basePage";

export class CheckoutPage extends BasePage {
  private firstNameInput = "[data-test='firstName']";
  private lastNameInput = "[data-test='lastName']";
  private postalCodeInput = "[data-test='postalCode']";
  private continueButton = "[data-test='continue']";
  private finishButton = "[data-test='finish']";
  private orderCompleteMessage = ".complete-header";
  private backHomeButton = "[data-test='back-to-products']"; // Back Home button on checkout-complete.html

  // All menu items should go on a separate menuPage.ts
  private checkoutComepleteText = '[data-test="secondary-header"]';
  private openMenu = "button"; // Need work TBD
  private logoutButton = '[data-test="logout-sidebar-link"]';

  async fillCheckoutDetails(
    firstName: string,
    lastName: string,
    postalCode: string
  ) {
    await this.page.fill(this.firstNameInput, firstName);
    await this.page.fill(this.lastNameInput, lastName);
    await this.page.fill(this.postalCodeInput, postalCode);
    await this.page.click(this.continueButton);
  }

  async finishCheckout() {
    await this.page.click(this.finishButton);
  }

  getOrderConfirmation() {
    return this.page.locator(this.orderCompleteMessage);
  }

  getBackHomeButton() {
    return this.page.locator(this.backHomeButton);
  }

  clickBackHome() {
    this.page.click(this.backHomeButton);
  }

  getCheckoutCompleteText() {
    return this.page.locator(this.checkoutComepleteText);
  }

  logout() {
    this.page.click(this.openMenu);
    this.page.click(this.logoutButton);
  }
}
