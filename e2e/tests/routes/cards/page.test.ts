import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/cards");
});

test("Card database browse and filter", {
  tag: ["@scenario:cards.browse", "@area:cards", "@priority:must", "@smoke"],
}, async ({ page }) => {
  const cardsPage = page.getByTestId("cards-page");
  const grid = cardsPage.getByTestId("card-grid");

  await test.step("Verify the grid renders cards", async () => {
    await expect(cardsPage.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(cardsPage.getByTestId("card-result-count")).toBeVisible();
    await expect(grid.getByTestId("card-tile").first()).toBeVisible();
  });

  await test.step("Filter the catalog by card name", async () => {
    // The grid flips data-virtualized to "true" once hydrated and measured;
    // wait for it so the client filter's URL write is wired up before typing.
    await expect(grid).toHaveAttribute("data-virtualized", "true");

    await cardsPage.getByTestId("card-filter-search").fill("Pikachu");

    await expect(page).toHaveURL(/[?&]q=Pikachu/);
    await expect(cardsPage.getByTestId("card-tile-name").first()).toContainText(
      /pikachu/i,
    );
  });
});

test("Filter the catalog by type via the pictogram dropdown", {
  tag: ["@scenario:cards.browse", "@area:cards", "@priority:must"],
}, async ({ page }) => {
  const cardsPage = page.getByTestId("cards-page");
  const grid = cardsPage.getByTestId("card-grid");

  // Wait for hydration (the grid flips data-virtualized once measured) so the
  // Base UI Select's controlled URL write is wired up before interacting.
  await expect(grid).toHaveAttribute("data-virtualized", "true");

  await test.step("Open the Type dropdown and choose a type", async () => {
    await cardsPage.getByTestId("card-filter-type").click();
    // The listbox is portaled out of the control's markup, so match the option
    // by its accessible role/name rather than a scoped test id.
    await page.getByRole("option", { name: "Grass" }).click();
  });

  await test.step("Verify the selection filters the grid", async () => {
    await expect(page).toHaveURL(/[?&]type=Grass/);
    await expect(cardsPage.getByTestId("card-filter-type")).toContainText(
      "Grass",
    );
  });
});

test("Open a card's detail page from the grid", {
  tag: ["@scenario:cards.navigate", "@area:cards", "@priority:should"],
}, async ({ page }) => {
  const cardsPage = page.getByTestId("cards-page");

  await test.step("Follow the first card tile", async () => {
    await cardsPage.getByTestId("card-tile-link").first().click();
    await expect(page).toHaveURL(/\/cards\/[A-Za-z0-9-]+$/);
  });

  await test.step("Verify the detail page rendered", async () => {
    await expect(page.getByTestId("card-detail-name")).toBeVisible();
  });
});
