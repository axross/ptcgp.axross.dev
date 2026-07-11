import { expect, test } from "@playwright/test";

test("Unknown URL shows the not-found page", {
  tag: ["@scenario:app.not-found", "@area:app", "@priority:should"],
}, async ({ page }) => {
  await test.step("Request a URL that does not exist", async () => {
    const response = await page.goto("/this-page-does-not-exist");

    expect(response?.status()).toBe(404);
  });

  const notFound = page.getByTestId("main").getByTestId("not-found");

  await test.step("Verify the not-found content", async () => {
    await expect(notFound).toBeVisible();
  });

  await test.step("Return to the home page", async () => {
    await notFound.getByTestId("home-link").click();
    await expect(page).toHaveURL("/");
  });
});
