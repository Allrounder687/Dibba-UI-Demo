import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { desc, eq } from "drizzle-orm";
import { getDb } from "./index";
import {
  newsArticles,
  matches,
  players,
  enquiries,
  sponsors,
  auditLogs,
  users,
} from "./schema";
import {
  INITIAL_NEWS,
  INITIAL_MATCHES,
  INITIAL_PLAYERS,
  INITIAL_SPONSORS,
  DEMO_STANDINGS,
  type NewsArticleRecord,
  type MatchRecord,
  type PlayerRecord,
  type EnquiryRecord,
  type SponsorRecord,
  type StandingRow,
  type AuditLogRecord,
} from "./seed-data";
import { hashPassword, verifyPassword, type UserRole } from "@/lib/auth";
import { logEvent } from "@/lib/logger";

interface LocalStoreData {
  news: NewsArticleRecord[];
  matches: MatchRecord[];
  players: PlayerRecord[];
  enquiries: EnquiryRecord[];
  sponsors: SponsorRecord[];
  standings?: StandingRow[];
  auditLogs: AuditLogRecord[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "club-db.json");
const TMP_STORE_PATH = path.join(os.tmpdir(), "dibba-club-db.json");
let memoryStore: LocalStoreData | null = null;

function createSeedStore(): LocalStoreData {
  return {
    news: INITIAL_NEWS,
    matches: INITIAL_MATCHES,
    players: INITIAL_PLAYERS,
    enquiries: [
      {
        id: 1,
        type: "academy",
        fullName: "Khalid Al-Matrooshi",
        email: "khalid.parent@example.ae",
        phone: "+971 50 123 4567",
        subject: "U12 Football Academy Trial",
        program: "Football Academy U12",
        playerAge: "11",
        message:
          "Interested in registering my son for the upcoming U12 evaluation sessions at Dibba Stadium.",
        status: "new",
        createdAt: "2026-11-11T10:30:00+04:00",
      },
    ],
    sponsors: INITIAL_SPONSORS,
    standings: DEMO_STANDINGS,
    auditLogs: [
      {
        id: 1,
        actorEmail: "system@dibbaclub.ae",
        action: "SYSTEM_BOOT",
        resourceType: "platform",
        resourceId: "0",
        details: "Initial club dataset seeded",
        createdAt: new Date().toISOString(),
      },
    ],
  };
}

function ensureLocalStore(): LocalStoreData {
  if (fs.existsSync(STORE_PATH)) {
    const raw = fs.readFileSync(STORE_PATH, "utf-8");
    return JSON.parse(raw) as LocalStoreData;
  }
  if (fs.existsSync(TMP_STORE_PATH)) {
    const raw = fs.readFileSync(TMP_STORE_PATH, "utf-8");
    return JSON.parse(raw) as LocalStoreData;
  }
  if (memoryStore) {
    return memoryStore;
  }

  const initial = createSeedStore();
  memoryStore = initial;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(initial, null, 2), "utf-8");
  } catch {
    try {
      fs.writeFileSync(TMP_STORE_PATH, JSON.stringify(initial, null, 2), "utf-8");
    } catch {
      // Pure in-memory fallback on strictly read-only serverless runtimes
    }
  }
  return initial;
}

function saveLocalStore(data: LocalStoreData): void {
  memoryStore = data;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    try {
      fs.writeFileSync(TMP_STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
    } catch {
      // Keep updated in memoryStore
    }
  }
}

function nextId(items: { id: number }[]): number {
  return items.length === 0 ? 1 : Math.max(...items.map((i) => i.id)) + 1;
}

function applyMatchOutcome(
  row: StandingRow,
  goalsFor: number,
  goalsAgainst: number,
  direction: 1 | -1
) {
  row.played = Math.max(0, row.played + direction);
  row.goalDiff += direction * (goalsFor - goalsAgainst);
  if (goalsFor > goalsAgainst) {
    row.won = Math.max(0, row.won + direction);
    row.points = Math.max(0, row.points + direction * 3);
    if (direction === 1) row.form = [...row.form.slice(-4), "W"];
  } else if (goalsFor === goalsAgainst) {
    row.drawn = Math.max(0, row.drawn + direction);
    row.points = Math.max(0, row.points + direction);
    if (direction === 1) row.form = [...row.form.slice(-4), "D"];
  } else {
    row.lost = Math.max(0, row.lost + direction);
    if (direction === 1) row.form = [...row.form.slice(-4), "L"];
  }
}

export function computeStandingsFromMatches(currentMatches: MatchRecord[]): StandingRow[] {
  const rows: StandingRow[] = DEMO_STANDINGS.map((r) => ({ ...r, form: [...r.form] }));
  const seededFinished = new Map<number, MatchRecord>();
  for (const m of INITIAL_MATCHES) {
    if (m.status === "finished") seededFinished.set(m.id, m);
  }

  for (const m of currentMatches) {
    const seeded = seededFinished.get(m.id);
    const currentValid = m.status === "finished" && m.homeScore !== null && m.awayScore !== null;

    if (seeded && seeded.homeScore !== null && seeded.awayScore !== null) {
      const unchanged =
        currentValid &&
        m.homeScore === seeded.homeScore &&
        m.awayScore === seeded.awayScore &&
        m.homeTeamEn === seeded.homeTeamEn &&
        m.awayTeamEn === seeded.awayTeamEn;
      if (unchanged) continue;

      const sHome = rows.find((r) => r.teamEn === seeded.homeTeamEn);
      const sAway = rows.find((r) => r.teamEn === seeded.awayTeamEn);
      if (sHome) applyMatchOutcome(sHome, seeded.homeScore, seeded.awayScore, -1);
      if (sAway) applyMatchOutcome(sAway, seeded.awayScore, seeded.homeScore, -1);
    }

    if (currentValid && m.homeScore !== null && m.awayScore !== null) {
      const cHome = rows.find((r) => r.teamEn === m.homeTeamEn);
      const cAway = rows.find((r) => r.teamEn === m.awayTeamEn);
      if (cHome) applyMatchOutcome(cHome, m.homeScore, m.awayScore, 1);
      if (cAway) applyMatchOutcome(cAway, m.awayScore, m.homeScore, 1);
    }
  }

  rows.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
    return b.won - a.won;
  });
  return rows.map((r, idx) => ({ ...r, position: idx + 1 }));
}

export const ClubRepository = {
  async checkHealth(): Promise<{ storage: "postgres" | "local_json"; ok: boolean }> {
    const db = getDb();
    if (db) {
      try {
        await db.select().from(sponsors).limit(1);
        return { storage: "postgres", ok: true };
      } catch (err) {
        logEvent("error", "db_health_check_failed", { error: String(err) });
        return { storage: "postgres", ok: false };
      }
    }
    ensureLocalStore();
    return { storage: "local_json", ok: true };
  },

  async authenticateAdmin(
    email: string,
    password: string
  ): Promise<{ id: string; email: string; name: string; role: UserRole } | null> {
    const normalizedEmail = email.trim().toLowerCase();
    const db = getDb();
    if (db) {
      const [user] = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);
      if (user && (await verifyPassword(password, user.passwordHash))) {
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as UserRole,
        };
      }
      return null;
    }

    // Environment-configured admin verification for local store mode
    const envAdminEmail = (process.env.ADMIN_INITIAL_EMAIL || "admin@dibbaclub.ae").toLowerCase();
    const envAdminPassword = process.env.ADMIN_INITIAL_PASSWORD;
    if (!envAdminPassword) {
      return null;
    }
    // Hash check simulation for timing consistency
    const expectedHash = await hashPassword(envAdminPassword);
    const valid =
      normalizedEmail === envAdminEmail && (await verifyPassword(password, expectedHash));
    if (!valid) return null;

    return {
      id: "local-super-admin-1",
      email: envAdminEmail,
      name: "Dibba SCC Administrator",
      role: "super_admin",
    };
  },

  async getNews(includeDrafts = false): Promise<NewsArticleRecord[]> {
    const db = getDb();
    if (db) {
      const rows = await db.select().from(newsArticles).orderBy(desc(newsArticles.publishedAt));
      return rows
        .filter((r) => includeDrafts || r.published)
        .map((r) => ({
          ...r,
          category: r.category as NewsArticleRecord["category"],
          publishedAt: r.publishedAt.toISOString(),
        }));
    }
    const store = ensureLocalStore();
    return [...store.news]
      .filter((a) => includeDrafts || a.published)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  },

  async getNewsBySlug(slug: string): Promise<NewsArticleRecord | null> {
    const articles = await this.getNews(false);
    return articles.find((a) => a.slug === slug) || null;
  },

  async createNews(
    input: Omit<NewsArticleRecord, "id" | "publishedAt">,
    actorEmail: string
  ): Promise<NewsArticleRecord> {
    const db = getDb();
    if (db) {
      const [created] = await db
        .insert(newsArticles)
        .values({ ...input })
        .returning();
      await this.addAuditLog(actorEmail, "CREATE_NEWS", "news", String(created.id), created.slug);
      return {
        ...created,
        category: created.category as NewsArticleRecord["category"],
        publishedAt: created.publishedAt.toISOString(),
      };
    }
    const store = ensureLocalStore();
    if (store.news.some((n) => n.slug === input.slug)) {
      throw new Error("An article with this slug already exists");
    }
    const record: NewsArticleRecord = {
      ...input,
      id: nextId(store.news),
      publishedAt: new Date().toISOString(),
    };
    store.news.unshift(record);
    saveLocalStore(store);
    await this.addAuditLog(actorEmail, "CREATE_NEWS", "news", String(record.id), record.slug);
    return record;
  },

  async toggleNewsPublish(id: number, actorEmail: string): Promise<NewsArticleRecord | null> {
    const db = getDb();
    if (db) {
      const [existing] = await db.select().from(newsArticles).where(eq(newsArticles.id, id));
      if (!existing) return null;
      const [updated] = await db
        .update(newsArticles)
        .set({ published: !existing.published })
        .where(eq(newsArticles.id, id))
        .returning();
      await this.addAuditLog(
        actorEmail,
        updated.published ? "PUBLISH_NEWS" : "UNPUBLISH_NEWS",
        "news",
        String(id),
        updated.slug
      );
      return {
        ...updated,
        category: updated.category as NewsArticleRecord["category"],
        publishedAt: updated.publishedAt.toISOString(),
      };
    }
    const store = ensureLocalStore();
    const target = store.news.find((n) => n.id === id);
    if (!target) return null;
    target.published = !target.published;
    saveLocalStore(store);
    await this.addAuditLog(
      actorEmail,
      target.published ? "PUBLISH_NEWS" : "UNPUBLISH_NEWS",
      "news",
      String(id),
      target.slug
    );
    return target;
  },

  async updateNews(
    id: number,
    patch: Partial<Omit<NewsArticleRecord, "id" | "publishedAt">>,
    actorEmail: string
  ): Promise<NewsArticleRecord | null> {
    const db = getDb();
    if (db) {
      const [updated] = await db
        .update(newsArticles)
        .set(patch)
        .where(eq(newsArticles.id, id))
        .returning();
      if (!updated) return null;
      await this.addAuditLog(actorEmail, "UPDATE_NEWS", "news", String(id), updated.slug);
      return {
        ...updated,
        category: updated.category as NewsArticleRecord["category"],
        publishedAt: updated.publishedAt.toISOString(),
      };
    }
    const store = ensureLocalStore();
    const target = store.news.find((n) => n.id === id);
    if (!target) return null;
    Object.assign(target, patch);
    saveLocalStore(store);
    await this.addAuditLog(actorEmail, "UPDATE_NEWS", "news", String(id), target.slug);
    return target;
  },

  async deleteNews(id: number, actorEmail: string): Promise<boolean> {
    const db = getDb();
    if (db) {
      const deleted = await db.delete(newsArticles).where(eq(newsArticles.id, id)).returning();
      if (deleted.length === 0) return false;
      await this.addAuditLog(actorEmail, "DELETE_NEWS", "news", String(id), deleted[0].slug);
      return true;
    }
    const store = ensureLocalStore();
    const idx = store.news.findIndex((n) => n.id === id);
    if (idx === -1) return false;
    const removed = store.news.splice(idx, 1)[0];
    saveLocalStore(store);
    await this.addAuditLog(actorEmail, "DELETE_NEWS", "news", String(id), removed.slug);
    return true;
  },

  async getMatches(): Promise<MatchRecord[]> {
    const db = getDb();
    if (db) {
      const rows = await db.select().from(matches).orderBy(desc(matches.kickoffAt));
      return rows.map((r) => ({
        ...r,
        status: r.status as MatchRecord["status"],
        kickoffAt: r.kickoffAt.toISOString(),
      }));
    }
    const store = ensureLocalStore();
    return [...store.matches].sort(
      (a, b) => new Date(b.kickoffAt).getTime() - new Date(a.kickoffAt).getTime()
    );
  },

  async getMatchById(id: number): Promise<MatchRecord | null> {
    const all = await this.getMatches();
    return all.find((m) => m.id === id) || null;
  },

  async createMatch(
    input: Omit<MatchRecord, "id" | "isDemonstration">,
    actorEmail: string
  ): Promise<MatchRecord> {
    const db = getDb();
    if (db) {
      if (input.isNextMatch) {
        await db.update(matches).set({ isNextMatch: false });
      }
      const [created] = await db
        .insert(matches)
        .values({
          ...input,
          kickoffAt: new Date(input.kickoffAt),
          isDemonstration: true,
        })
        .returning();
      await this.addAuditLog(
        actorEmail,
        "CREATE_MATCH",
        "match",
        String(created.id),
        `${created.homeTeamEn} vs ${created.awayTeamEn}`
      );
      return {
        ...created,
        status: created.status as MatchRecord["status"],
        kickoffAt: created.kickoffAt.toISOString(),
      };
    }
    const store = ensureLocalStore();
    if (input.isNextMatch) {
      store.matches.forEach((m) => {
        m.isNextMatch = false;
      });
    }
    const record: MatchRecord = {
      ...input,
      id: nextId(store.matches),
      isDemonstration: true,
    };
    store.matches.unshift(record);
    saveLocalStore(store);
    await this.addAuditLog(
      actorEmail,
      "CREATE_MATCH",
      "match",
      String(record.id),
      `${record.homeTeamEn} vs ${record.awayTeamEn}`
    );
    return record;
  },

  async updateMatchScore(
    id: number,
    homeScore: number,
    awayScore: number,
    status: "scheduled" | "finished",
    actorEmail: string
  ): Promise<MatchRecord | null> {
    return this.updateMatch(
      id,
      {
        homeScore,
        awayScore,
        status,
        ...(status === "finished" ? { isNextMatch: false } : {}),
      },
      actorEmail
    );
  },

  async updateMatch(
    id: number,
    patch: Partial<Omit<MatchRecord, "id" | "isDemonstration">>,
    actorEmail: string
  ): Promise<MatchRecord | null> {
    const db = getDb();
    if (db) {
      if (patch.isNextMatch) {
        await db.update(matches).set({ isNextMatch: false });
      }
      const dbValues: Record<string, unknown> = { ...patch };
      if (patch.kickoffAt) {
        dbValues.kickoffAt = new Date(patch.kickoffAt);
      }
      const [updated] = await db
        .update(matches)
        .set(dbValues)
        .where(eq(matches.id, id))
        .returning();
      if (!updated) return null;
      await this.addAuditLog(
        actorEmail,
        "UPDATE_MATCH",
        "match",
        String(id),
        `${updated.homeTeamEn} vs ${updated.awayTeamEn} (${updated.status})`
      );
      return {
        ...updated,
        status: updated.status as MatchRecord["status"],
        kickoffAt: updated.kickoffAt.toISOString(),
      };
    }
    const store = ensureLocalStore();
    const target = store.matches.find((m) => m.id === id);
    if (!target) return null;
    if (patch.isNextMatch) {
      store.matches.forEach((m) => {
        m.isNextMatch = false;
      });
    }
    Object.assign(target, patch);
    if (target.status === "finished") {
      target.isNextMatch = false;
    }
    store.standings = computeStandingsFromMatches(store.matches);
    saveLocalStore(store);
    await this.addAuditLog(
      actorEmail,
      "UPDATE_MATCH",
      "match",
      String(id),
      `${target.homeTeamEn} vs ${target.awayTeamEn} (${target.status})`
    );
    return target;
  },

  async deleteMatch(id: number, actorEmail: string): Promise<boolean> {
    const db = getDb();
    if (db) {
      const deleted = await db.delete(matches).where(eq(matches.id, id)).returning();
      if (deleted.length === 0) return false;
      await this.addAuditLog(
        actorEmail,
        "DELETE_MATCH",
        "match",
        String(id),
        `${deleted[0].homeTeamEn} vs ${deleted[0].awayTeamEn}`
      );
      return true;
    }
    const store = ensureLocalStore();
    const idx = store.matches.findIndex((m) => m.id === id);
    if (idx === -1) return false;
    const removed = store.matches.splice(idx, 1)[0];
    store.standings = computeStandingsFromMatches(store.matches);
    saveLocalStore(store);
    await this.addAuditLog(
      actorEmail,
      "DELETE_MATCH",
      "match",
      String(id),
      `${removed.homeTeamEn} vs ${removed.awayTeamEn}`
    );
    return true;
  },

  async getStandings(): Promise<StandingRow[]> {
    const db = getDb();
    if (db) {
      const allMatches = await this.getMatches();
      return computeStandingsFromMatches(allMatches);
    }
    const store = ensureLocalStore();
    if (store.standings && store.standings.length > 0) {
      return store.standings;
    }
    return computeStandingsFromMatches(store.matches);
  },

  async recalculateStandingsFromMatches(actorEmail: string): Promise<StandingRow[]> {
    const allMatches = await this.getMatches();
    const computed = computeStandingsFromMatches(allMatches);
    const db = getDb();
    if (!db) {
      const store = ensureLocalStore();
      store.standings = computed;
      saveLocalStore(store);
    }
    await this.addAuditLog(
      actorEmail,
      "SYNC_STANDINGS",
      "standings",
      "uae-first-div",
      `Recalculated ${computed.length} clubs from ${allMatches.length} fixtures`
    );
    return computed;
  },

  async getPlayers(): Promise<PlayerRecord[]> {
    const db = getDb();
    if (db) {
      const rows = await db.select().from(players);
      return rows.map((r) => ({
        ...r,
        position: r.position as PlayerRecord["position"],
        squad: r.squad as PlayerRecord["squad"],
      }));
    }
    const store = ensureLocalStore();
    return [...store.players].sort((a, b) => a.number - b.number);
  },

  async createPlayer(input: Omit<PlayerRecord, "id">, actorEmail: string): Promise<PlayerRecord> {
    const db = getDb();
    if (db) {
      const [created] = await db.insert(players).values(input).returning();
      await this.addAuditLog(actorEmail, "CREATE_PLAYER", "player", String(created.id), created.nameEn);
      return {
        ...created,
        position: created.position as PlayerRecord["position"],
        squad: created.squad as PlayerRecord["squad"],
      };
    }
    const store = ensureLocalStore();
    const record: PlayerRecord = { ...input, id: nextId(store.players) };
    store.players.push(record);
    saveLocalStore(store);
    await this.addAuditLog(actorEmail, "CREATE_PLAYER", "player", String(record.id), record.nameEn);
    return record;
  },

  async updatePlayer(
    id: number,
    patch: Partial<Omit<PlayerRecord, "id">>,
    actorEmail: string
  ): Promise<PlayerRecord | null> {
    const db = getDb();
    if (db) {
      const [updated] = await db
        .update(players)
        .set(patch)
        .where(eq(players.id, id))
        .returning();
      if (!updated) return null;
      await this.addAuditLog(actorEmail, "UPDATE_PLAYER", "player", String(id), updated.nameEn);
      return {
        ...updated,
        position: updated.position as PlayerRecord["position"],
        squad: updated.squad as PlayerRecord["squad"],
      };
    }
    const store = ensureLocalStore();
    const target = store.players.find((p) => p.id === id);
    if (!target) return null;
    Object.assign(target, patch);
    saveLocalStore(store);
    await this.addAuditLog(actorEmail, "UPDATE_PLAYER", "player", String(id), target.nameEn);
    return target;
  },

  async deletePlayer(id: number, actorEmail: string): Promise<boolean> {
    const db = getDb();
    if (db) {
      const deleted = await db.delete(players).where(eq(players.id, id)).returning();
      if (deleted.length === 0) return false;
      await this.addAuditLog(actorEmail, "DELETE_PLAYER", "player", String(id), deleted[0].nameEn);
      return true;
    }
    const store = ensureLocalStore();
    const idx = store.players.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    const removed = store.players.splice(idx, 1)[0];
    saveLocalStore(store);
    await this.addAuditLog(actorEmail, "DELETE_PLAYER", "player", String(id), removed.nameEn);
    return true;
  },

  async getSponsors(): Promise<SponsorRecord[]> {
    const db = getDb();
    if (db) {
      const rows = await db.select().from(sponsors);
      return rows.map((r) => ({ ...r, tier: r.tier as SponsorRecord["tier"] }));
    }
    return ensureLocalStore().sponsors;
  },

  async createEnquiry(
    input: Omit<EnquiryRecord, "id" | "status" | "createdAt">
  ): Promise<EnquiryRecord> {
    const db = getDb();
    if (db) {
      const [created] = await db
        .insert(enquiries)
        .values({
          type: input.type,
          fullName: input.fullName,
          email: input.email,
          phone: input.phone,
          subject: input.subject,
          program: input.program ?? null,
          playerAge: input.playerAge ?? null,
          message: input.message,
          status: "new",
        })
        .returning();
      logEvent("info", "enquiry_submitted", { type: created.type, id: created.id });
      return {
        ...created,
        type: created.type as EnquiryRecord["type"],
        status: created.status as EnquiryRecord["status"],
        createdAt: created.createdAt.toISOString(),
      };
    }
    const store = ensureLocalStore();
    const record: EnquiryRecord = {
      ...input,
      id: nextId(store.enquiries),
      status: "new",
      createdAt: new Date().toISOString(),
    };
    store.enquiries.unshift(record);
    saveLocalStore(store);
    logEvent("info", "enquiry_submitted", { type: record.type, id: record.id });
    return record;
  },

  async getEnquiries(): Promise<EnquiryRecord[]> {
    const db = getDb();
    if (db) {
      const rows = await db.select().from(enquiries).orderBy(desc(enquiries.createdAt));
      return rows.map((r) => ({
        ...r,
        type: r.type as EnquiryRecord["type"],
        status: r.status as EnquiryRecord["status"],
        createdAt: r.createdAt.toISOString(),
      }));
    }
    const store = ensureLocalStore();
    return [...store.enquiries].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async updateEnquiryStatus(
    id: number,
    status: "new" | "in_review" | "resolved",
    actorEmail: string
  ): Promise<EnquiryRecord | null> {
    const db = getDb();
    if (db) {
      const [updated] = await db
        .update(enquiries)
        .set({ status })
        .where(eq(enquiries.id, id))
        .returning();
      if (!updated) return null;
      await this.addAuditLog(actorEmail, "UPDATE_ENQUIRY_STATUS", "enquiry", String(id), status);
      return {
        ...updated,
        type: updated.type as EnquiryRecord["type"],
        status: updated.status as EnquiryRecord["status"],
        createdAt: updated.createdAt.toISOString(),
      };
    }
    const store = ensureLocalStore();
    const target = store.enquiries.find((e) => e.id === id);
    if (!target) return null;
    target.status = status;
    saveLocalStore(store);
    await this.addAuditLog(actorEmail, "UPDATE_ENQUIRY_STATUS", "enquiry", String(id), status);
    return target;
  },

  async addAuditLog(
    actorEmail: string,
    action: string,
    resourceType: string,
    resourceId: string,
    details: string
  ): Promise<void> {
    logEvent("audit", action, { resourceType, resourceId, details }, actorEmail);
    const db = getDb();
    if (db) {
      await db.insert(auditLogs).values({
        actorEmail,
        action,
        resourceType,
        resourceId,
        details,
      });
      return;
    }
    const store = ensureLocalStore();
    store.auditLogs.unshift({
      id: nextId(store.auditLogs),
      actorEmail,
      action,
      resourceType,
      resourceId,
      details,
      createdAt: new Date().toISOString(),
    });
    if (store.auditLogs.length > 200) {
      store.auditLogs = store.auditLogs.slice(0, 200);
    }
    saveLocalStore(store);
  },

  async getAuditLogs(): Promise<AuditLogRecord[]> {
    const db = getDb();
    if (db) {
      const rows = await db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(50);
      return rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }));
    }
    return ensureLocalStore().auditLogs.slice(0, 50);
  },
};
