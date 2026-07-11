import { expect, test } from "@playwright/test";

test("Home page metadata", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("ptcgp.axross.dev");
});

test("Guide page metadata uses the title template", async ({ page }) => {
  await page.goto("/guides/getting-started");

  await expect(page).toHaveTitle("Getting started · ptcgp.axross.dev");
});
