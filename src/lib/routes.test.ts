import { describe, expect, it } from "vitest";
import { isActiveRoute } from "./routes";

describe("isActiveRoute", () => {
  describe("when the nav item points at the root route", () => {
    it("is active on the root route itself", () => {
      expect(isActiveRoute("/", "/")).toBe(true);
    });

    it("is not active on nested routes", () => {
      expect(isActiveRoute("/guides/getting-started", "/")).toBe(false);
    });
  });

  describe("when the nav item points at a section", () => {
    it("is active on the section route itself", () => {
      expect(isActiveRoute("/guides", "/guides")).toBe(true);
    });

    it("is active on routes nested under the section", () => {
      expect(isActiveRoute("/guides/getting-started", "/guides")).toBe(true);
    });

    it("is not active on sibling routes that share a prefix", () => {
      expect(isActiveRoute("/guidestar", "/guides")).toBe(false);
    });

    it("is not active on unrelated routes", () => {
      expect(isActiveRoute("/decks", "/guides")).toBe(false);
    });
  });
});
