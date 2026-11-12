import { describe, it, expect } from "vitest";
import {
  enquirySchema,
  newsArticleSchema,
  loginSchema,
  matchUpdateSchema,
  playerUpdateSchema,
} from "@/lib/validations";
import { createSessionToken, verifySessionToken, hashPassword, verifyPassword } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { computeStandingsFromMatches } from "@/db/repository";
import { INITIAL_MATCHES } from "@/db/seed-data";

describe("Zod Validation Contracts", () => {
  it("validates a proper academy enquiry", () => {
    const result = enquirySchema.safeParse({
      type: "academy",
      fullName: "Rashid Al-Dhanhani",
      email: "rashid@example.ae",
      phone: "+971 50 111 2233",
      subject: "U14 Academy Trial",
      program: "Football Academy (U9 – U14)",
      playerAge: "13",
      message: "Looking to enroll in the upcoming training term.",
      consent: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects enquiry without privacy consent or invalid phone", () => {
    const result = enquirySchema.safeParse({
      type: "contact",
      fullName: "Test User",
      email: "bad-email",
      phone: "abc",
      subject: "Hi",
      message: "Short",
      consent: false,
    });
    expect(result.success).toBe(false);
  });

  it("enforces safe lowercase hyphenated slugs on news articles", () => {
    const badSlug = newsArticleSchema.safeParse({
      slug: "Bad Slug With Spaces!",
      titleEn: "Valid Title",
      titleAr: "عنوان صالح",
      excerptEn: "Valid excerpt content here.",
      excerptAr: "ملخص صالح للمقال هنا.",
      bodyEn: "Detailed body content exceeding twenty characters.",
      bodyAr: "محتوى تفصيلي للمقال يتجاوز عشرين حرفاً.",
      category: "club_news",
      imageUrl: "/assets/12222222.jpg",
      published: true,
    });
    expect(badSlug.success).toBe(false);
  });

  it("rejects short passwords on login schema", () => {
    const res = loginSchema.safeParse({ email: "admin@dibbaclub.ae", password: "123" });
    expect(res.success).toBe(false);
  });
});

describe("Security: Auth JWT & Password Hashing", () => {
  it("hashes and verifies passwords with bcrypt", async () => {
    const hash = await hashPassword("StrongDibbaPass2026!");
    expect(hash).not.toBe("StrongDibbaPass2026!");
    expect(await verifyPassword("StrongDibbaPass2026!", hash)).toBe(true);
    expect(await verifyPassword("WrongPassword", hash)).toBe(false);
  });

  it("issues and verifies HS256 JWT session payloads", async () => {
    const token = await createSessionToken({
      userId: "u-1",
      email: "admin@dibbaclub.ae",
      name: "Admin",
      role: "super_admin",
    });
    const decoded = await verifySessionToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.email).toBe("admin@dibbaclub.ae");
    expect(decoded?.role).toBe("super_admin");
  });

  it("rejects tampered JWT tokens", async () => {
    const decoded = await verifySessionToken("eyJhbGciOiJIUzI1NiJ9.tampered.sig");
    expect(decoded).toBeNull();
  });
});

describe("Security: Rate Limiter", () => {
  it("blocks requests exceeding the window threshold", () => {
    const key = `test-ip-${Date.now()}`;
    expect(checkRateLimit(key, 2, 10_000).allowed).toBe(true);
    expect(checkRateLimit(key, 2, 10_000).allowed).toBe(true);
    expect(checkRateLimit(key, 2, 10_000).allowed).toBe(false);
  });
});

describe("Internationalization Parity (EN / AR)", () => {
  it("provides complete non-empty English and Arabic dictionaries without Lorem Ipsum", () => {
    const enJson = JSON.stringify(dictionaries.en);
    const arJson = JSON.stringify(dictionaries.ar);
    expect(enJson.toLowerCase()).not.toContain("lorem ipsum");
    expect(arJson.toLowerCase()).not.toContain("lorem ipsum");
    expect(dictionaries.ar.hero.title.length).toBeGreaterThan(3);
    expect(dictionaries.en.hero.title.length).toBeGreaterThan(3);
    expect(dictionaries.en.interactive.tacticalTitle.length).toBeGreaterThan(3);
    expect(dictionaries.ar.interactive.tacticalTitle.length).toBeGreaterThan(3);
  });
});

describe("Self-Service CMS Contracts & Standings Sync", () => {
  it("validates partial match and player updates for /admin modals", () => {
    expect(
      matchUpdateSchema.safeParse({
        homeScore: 3,
        awayScore: 1,
        status: "finished",
        isNextMatch: false,
      }).success
    ).toBe(true);

    expect(
      playerUpdateSchema.safeParse({
        appearances: 18,
        goals: 9,
        assists: 5,
        squad: "u23",
      }).success
    ).toBe(true);
  });

  it("recalculates standings points and goal difference when a scheduled match finishes", () => {
    const updatedMatches = INITIAL_MATCHES.map((m) =>
      m.id === 1 ? { ...m, homeScore: 3, awayScore: 0, status: "finished" as const } : m
    );
    const standings = computeStandingsFromMatches(updatedMatches);
    const dibba = standings.find((r) => r.teamEn === "Dibba FC");
    const fujairah = standings.find((r) => r.teamEn === "Fujairah FC");
    expect(dibba?.points).toBe(26);
    expect(dibba?.goalDiff).toBe(17);
    expect(fujairah?.points).toBe(20);
    expect(fujairah?.goalDiff).toBe(5);
  });
});
