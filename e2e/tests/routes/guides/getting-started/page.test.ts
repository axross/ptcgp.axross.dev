import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/guides/getting-started");
});

test("Getting started guide content", {
  tag: ["@scenario:docs.guide.view", "@area:docs", "@priority:must", "@smoke"],
}, async ({ page }) => {
  const prose = page.getByTestId("main").getByTestId("prose");

  await test.step("Verify the guide heading", async () => {
    await expect(prose.getByRole("heading", { level: 1 })).toBeVisible();
  });

  await test.step("Verify the rules comparison table", async () => {
    await expect(prose.getByRole("table")).toBeVisible();
  });

  await test.step("Verify the section headings", async () => {
    expect(
      await prose.getByRole("heading", { level: 2 }).count(),
    ).toBeGreaterThan(0);
  });
});
