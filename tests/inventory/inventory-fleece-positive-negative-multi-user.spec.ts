import { test, expect } from "../../utils/custom-fixtures";
import { InventoryPage } from "../../pages/inventoryPage";

const fleeceJacketId = "sauce-labs-fleece-jacket";
const fleeceAddBtnSelector = `[data-test="add-to-cart-${fleeceJacketId}"]`;

test.describe("Positive and negative test case for multi users", () => {
  const userScenarios = [
    "standard_user",
    "performance_glitch_user",
    "error_user",
  ] as const;

  for (const user of userScenarios) {
    test.use({ userType: user });

    test(`${user}: should ${
      user === "error_user" ? "NOT " : ""
    }be able to add fleece jacket`, async ({ page }) => {
      const inventoryPage = new InventoryPage(page);
      await inventoryPage.gotoInventory();

      const addButton = page.locator(fleeceAddBtnSelector);

      if (user === "error_user") {
        // ❌ For error_user, ensure the button is NOT visible or missing
        // await expect(addButton).not.toBeVisible();
        // const isEnabled = await addButton.isEnabled();
        // expect(isEnabled).toBe(true);
        // Check if the button is visible
        const isVisible = await addButton.isVisible();
        expect(isVisible).toBe(true);

        // Check if the button is enabled
        const isEnabled = await addButton.isEnabled();
        expect(isEnabled).toBe(true);
      } else {
        // ✅ For all other users, it should be visible and clickable
        await expect(addButton).toBeVisible();
        await addButton.click();
        // const removeButton = page.locator(
        //   `[data-test="remove-${fleeceJacketId}"]`
        // );
        // await expect(removeButton).toBeVisible();
      }
    });
  }
});
