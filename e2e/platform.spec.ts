import { test, expect } from "@playwright/test";

test.describe("Dibba SCC 2026 Platform Verification", () => {
  test("English homepage loads with zero console errors, all images valid, no Lorem Ipsum, and zero dead links", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => consoleErrors.push(err.message));

    await page.goto("/en", { waitUntil: "networkidle" });
    await expect(page).toHaveTitle(/Dibba Sports & Cultural Club/i);

    const bodyText = await page.locator("body").innerText();
    expect(bodyText.toLowerCase()).not.toContain("lorem ipsum");

    // Verify no dead '#' links
    const hashLinks = await page.locator('a[href="#"]').count();
    expect(hashLinks).toBe(0);

    // Verify all visible images loaded cleanly
    const brokenImages = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll("img"));
      return imgs
        .filter((img) => img.complete && img.naturalWidth === 0)
        .map((img) => img.getAttribute("src"));
    });
    expect(brokenImages).toEqual([]);

    // Verify zero horizontal overflow
    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(hasOverflow).toBe(false);
    expect(consoleErrors).toEqual([]);
  });

  test("Language switch preserves current route and applies native Arabic RTL", async ({
    page,
  }) => {
    await page.goto("/en/matches");
    await page.getByTestId("lang-switch").click();
    await expect(page).toHaveURL(/\/ar\/matches/);

    const rootDir = await page.locator('div[lang="ar"]').getAttribute("dir");
    expect(rootDir).toBe("rtl");

    const htmlDir = await page.evaluate(() => document.documentElement.dir);
    expect(htmlDir).toBe("rtl");

    // Verify zero horizontal overflow in Arabic RTL
    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(hasOverflow).toBe(false);
  });

  test("All primary public routes render cleanly without HTTP 500 or 404", async ({
    page,
  }) => {
    const routes = [
      "/en",
      "/ar",
      "/en/matches",
      "/ar/matches",
      "/en/teams",
      "/en/academy",
      "/en/club",
      "/ar/club",
      "/en/news",
      "/en/shop",
      "/en/tickets",
      "/en/contact",
    ];
    for (const route of routes) {
      const res = await page.goto(route);
      expect(res?.status()).toBe(200);
    }
  });

  test("Academy enquiry form validates and persists submission via backend API", async ({
    page,
  }) => {
    await page.goto("/en/academy");

    await page.locator('input[name="fullName"]').fill("Playwright Test Applicant");
    await page.locator('input[name="email"]').fill("applicant@dibbaclub.ae");
    await page.locator('input[name="phone"]').fill("+971501234567");
    await page.locator('input[name="subject"]').fill("U14 Trial Request");
    await page
      .locator('textarea[name="message"]')
      .fill("Automated E2E verification message for academy.");
    await page.locator('input[name="consent"]').check();

    await page.locator('button[type="submit"]').click();
    await expect(page.getByText("Request Recorded")).toBeVisible();
  });

  test("Unauthenticated users cannot access /admin or protected APIs (/api/enquiries, /api/upload, /api/cron/sync-matches)", async ({
    page,
    request,
  }) => {
    const apiRes = await request.get("/api/enquiries");
    expect(apiRes.status()).toBe(401);

    const uploadRes = await request.get("/api/upload");
    expect(uploadRes.status()).toBe(401);

    const syncRes = await request.post("/api/cron/sync-matches");
    expect(syncRes.status()).toBe(401);

    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("Playable experiences work end-to-end (Tactical XI, Kit Customizer, Stadium Bowl)", async ({
    page,
  }) => {
    // 1. Tactical XI Builder on /en/teams
    await page.goto("/en/teams", { waitUntil: "networkidle" });
    await expect(page.getByText("Build Your Dibba Starting XI")).toBeVisible();
    await page.getByRole("button", { name: "4-2-3-1" }).click();
    await expect(page.getByText("Team Chemistry")).toBeVisible();

    // 2. Kit Customizer Studio on /en/shop
    await page.goto("/en/shop", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Reserve This Custom Kit" }).click();
    await expect(page.locator('input[name="subject"]')).toHaveValue(/Custom 2026 Official Home Jersey/);

    // 3. Interactive Stadium Bowl on /en/tickets
    await page.goto("/en/tickets", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Select This Stand" }).click();
    await expect(page.locator('input[name="subject"]')).toHaveValue(/Matchday Seat Reservation/);
  });

  test("Health-check endpoint returns HTTP 200 healthy status and security headers", async ({
    request,
  }) => {
    const res = await request.get("/api/health");
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.status).toBe("healthy");

    const headers = res.headers();
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["content-security-policy"]).toContain("default-src 'self'");
  });
});
