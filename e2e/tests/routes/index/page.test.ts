import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("Home page content", {
  tag: ["@scenario:home.view", "@area:home", "@priority:must", "@smoke"],
}, async ({ page }) => {
  const main = page.getByTestId("main");

  await test.step("Verify the intro heading", async () => {
    await expect(main.getByRole("heading", { level: 1 })).toBeVisible();
  });

  await test.step("Verify the guide links", async () => {
    await expect(
      main.getByRole("link", { name: "Getting started" }),
    ).toBeVisible();
  });

  await test.step("Verify the site chrome", async () => {
    const header = page.getByTestId("site-header");

    await expect(header.getByTestId("wordmark")).toBeVisible();
    await expect(page.getByTestId("footer")).toBeVisible();
  });
});

test("Navigate to a guide via the site nav", {
  tag: ["@scenario:docs.navigate", "@area:docs", "@priority:should"],
}, async ({ page }) => {
  const nav = page.getByTestId("site-header").getByTestId("nav");

  await test.step("Open the guide from the nav", async () => {
    await nav.getByTestId("guides").click();
    await expect(page).toHaveURL("/guides/getting-started");
  });

  await test.step("Verify the guide rendered", async () => {
    await expect(
      page.getByTestId("main").getByRole("heading", { level: 1 }),
    ).toBeVisible();
  });

  await test.step("Verify the nav marks the guide as current", async () => {
    await expect(nav.getByTestId("guides")).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
