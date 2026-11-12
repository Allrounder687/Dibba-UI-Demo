import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  index,
  uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    name: text("name").notNull(),
    role: text("role", { enum: ["super_admin", "editor", "academy_manager"] })
      .notNull()
      .default("editor"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("users_email_idx").on(table.email)]
);

export const newsArticles = pgTable(
  "news_articles",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    titleEn: text("title_en").notNull(),
    titleAr: text("title_ar").notNull(),
    excerptEn: text("excerpt_en").notNull(),
    excerptAr: text("excerpt_ar").notNull(),
    bodyEn: text("body_en").notNull(),
    bodyAr: text("body_ar").notNull(),
    category: text("category", {
      enum: ["first_team", "academy", "club_news", "community", "other_sports"],
    })
      .notNull()
      .default("club_news"),
    imageUrl: text("image_url").notNull(),
    published: boolean("published").notNull().default(true),
    publishedAt: timestamp("published_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("news_slug_idx").on(table.slug),
    index("news_category_idx").on(table.category),
    index("news_published_idx").on(table.published, table.publishedAt),
  ]
);

export const matches = pgTable(
  "matches",
  {
    id: serial("id").primaryKey(),
    competitionEn: text("competition_en").notNull(),
    competitionAr: text("competition_ar").notNull(),
    homeTeamEn: text("home_team_en").notNull(),
    homeTeamAr: text("home_team_ar").notNull(),
    homeLogo: text("home_logo").notNull(),
    awayTeamEn: text("away_team_en").notNull(),
    awayTeamAr: text("away_team_ar").notNull(),
    awayLogo: text("away_logo").notNull(),
    homeScore: integer("home_score"),
    awayScore: integer("away_score"),
    status: text("status", { enum: ["scheduled", "finished"] }).notNull().default("scheduled"),
    kickoffAt: timestamp("kickoff_at", { withTimezone: true }).notNull(),
    venueEn: text("venue_en").notNull(),
    venueAr: text("venue_ar").notNull(),
    isNextMatch: boolean("is_next_match").notNull().default(false),
    isDemonstration: boolean("is_demonstration").notNull().default(true),
  },
  (table) => [
    index("matches_status_kickoff_idx").on(table.status, table.kickoffAt),
    index("matches_next_idx").on(table.isNextMatch),
  ]
);

export const players = pgTable(
  "players",
  {
    id: serial("id").primaryKey(),
    nameEn: text("name_en").notNull(),
    nameAr: text("name_ar").notNull(),
    number: integer("number").notNull(),
    position: text("position", { enum: ["GK", "DEF", "MID", "FWD", "STAFF"] }).notNull(),
    squad: text("squad", { enum: ["first_team", "u23", "academy"] }).notNull().default("first_team"),
    nationalityEn: text("nationality_en").notNull(),
    nationalityAr: text("nationality_ar").notNull(),
    imageUrl: text("image_url").notNull(),
    appearances: integer("appearances").notNull().default(0),
    goals: integer("goals").notNull().default(0),
    assists: integer("assists").notNull().default(0),
    bioEn: text("bio_en").notNull().default(""),
    bioAr: text("bio_ar").notNull().default(""),
  },
  (table) => [index("players_squad_pos_idx").on(table.squad, table.position)]
);

export const enquiries = pgTable(
  "enquiries",
  {
    id: serial("id").primaryKey(),
    type: text("type", {
      enum: ["academy", "contact", "sponsorship", "ticket_interest", "merch_order"],
    }).notNull(),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    subject: text("subject").notNull(),
    program: text("program"),
    playerAge: text("player_age"),
    message: text("message").notNull(),
    status: text("status", { enum: ["new", "in_review", "resolved"] })
      .notNull()
      .default("new"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("enquiries_type_status_idx").on(table.type, table.status),
    index("enquiries_created_idx").on(table.createdAt),
  ]
);

export const sponsors = pgTable("sponsors", {
  id: serial("id").primaryKey(),
  nameEn: text("name_en").notNull(),
  nameAr: text("name_ar").notNull(),
  tier: text("tier", { enum: ["principal", "official", "partner"] }).notNull().default("official"),
  logoUrl: text("logo_url").notNull(),
  websiteUrl: text("website_url").notNull().default("https://dibbaclub.ae"),
});

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: serial("id").primaryKey(),
    actorEmail: text("actor_email").notNull(),
    action: text("action").notNull(),
    resourceType: text("resource_type").notNull(),
    resourceId: text("resource_id").notNull(),
    details: text("details").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("audit_created_idx").on(table.createdAt)]
);
