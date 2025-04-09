import { BasePage } from "./BasePage";

export class Header extends BasePage {
  async logout() {
    await this.page.click("#react-burger-menu-btn");
    await this.page.click("#logout_sidebar_link");
  }
}
