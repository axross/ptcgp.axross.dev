import { expect, test } from "@playwright/test";

// Bulbasaur — a stable Basic Pokémon in the first set, with an attack and no
// ability, so its detail page exercises the Pokémon layout end to end.
test.beforeEach(async ({ page }) => {
  await page.goto("/cards/A1-001");
});

test("Card detail content", {
  tag: [
    "@scenario:cards.detail.view",
    "@area:cards",
    "@priority:must",
    "@smoke",
  ],
}, async ({ page }) => {
  const detail = page.getByTestId("card-detail");

  await test.step("Verify the card identity", async () => {
    await expect(detail.getByTestId("card-detail-name")).toHaveText(
      "Bulbasaur",
    );
    await expect(detail.getByRole("img", { name: "Bulbasaur" })).toBeVisible();
  });

  await test.step("Verify the stats and attacks", async () => {
    await expect(detail.getByTestId("card-detail-stats")).toContainText("HP");
    await expect(detail.getByTestId("card-detail-attacks")).toBeVisible();
  });

  await test.step("Return to the database via the back link", async () => {
    await detail.getByTestId("card-detail-back").click();
    await expect(page).toHaveURL("/cards");
    await expect(page.getByTestId("cards-page")).toBeVisible();
  });
});
