import { BasePage } from "./basePage";

export class LoginPage extends BasePage {
  private usernameInput = "#user-name";
  private passwordInput = "#password";
  private loginButton = "#login-button";
  private errorMessage = "[data-test='error']";

  async login(username: string, password: string) {
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.loginButton);
  }

  async getErrorMessage() {
    return this.page.textContent(this.errorMessage);
  }
}
