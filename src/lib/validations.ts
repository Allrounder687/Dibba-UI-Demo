import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address").trim().toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const enquirySchema = z.object({
  type: z.enum(["academy", "contact", "sponsorship", "ticket_interest", "merch_order"]),
  fullName: z.string().trim().min(2, "Full name is required").max(100),
  email: z.string().trim().email("Valid email address is required").max(120),
  phone: z
    .string()
    .trim()
    .min(7, "Valid phone number is required")
    .max(25)
    .regex(/^[+0-9\s()-]+$/, "Invalid phone number format"),
  subject: z.string().trim().min(2, "Subject is required").max(150),
  program: z.string().trim().max(100).optional(),
  playerAge: z.string().trim().max(20).optional(),
  message: z.string().trim().min(10, "Please provide at least 10 characters").max(2000),
  consent: z.boolean().refine((val) => val === true, {
    message: "You must agree to the club privacy terms",
  }),
});

export const newsArticleSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(3)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Slug must contain lowercase letters, numbers, and hyphens only"),
  titleEn: z.string().trim().min(4).max(180),
  titleAr: z.string().trim().min(4).max(180),
  excerptEn: z.string().trim().min(10).max(400),
  excerptAr: z.string().trim().min(10).max(400),
  bodyEn: z.string().trim().min(20).max(10000),
  bodyAr: z.string().trim().min(20).max(10000),
  category: z.enum(["first_team", "academy", "club_news", "community", "other_sports"]),
  imageUrl: z.string().trim().min(1),
  published: z.boolean().default(true),
});

export const newsUpdateSchema = newsArticleSchema.partial();

export const matchSchema = z.object({
  competitionEn: z.string().trim().min(2).max(120),
  competitionAr: z.string().trim().min(2).max(120),
  homeTeamEn: z.string().trim().min(2).max(100),
  homeTeamAr: z.string().trim().min(2).max(100),
  homeLogo: z.string().trim().min(1),
  awayTeamEn: z.string().trim().min(2).max(100),
  awayTeamAr: z.string().trim().min(2).max(100),
  awayLogo: z.string().trim().min(1),
  homeScore: z.number().int().min(0).max(99).nullable(),
  awayScore: z.number().int().min(0).max(99).nullable(),
  status: z.enum(["scheduled", "finished"]),
  kickoffAt: z.string().datetime({ offset: true }).or(z.string().min(8)),
  venueEn: z.string().trim().min(2).max(120),
  venueAr: z.string().trim().min(2).max(120),
  isNextMatch: z.boolean().default(false),
});

export const matchUpdateSchema = matchSchema.partial();

export const playerSchema = z.object({
  nameEn: z.string().trim().min(2).max(100),
  nameAr: z.string().trim().min(2).max(100),
  number: z.number().int().min(1).max(99),
  position: z.enum(["GK", "DEF", "MID", "FWD", "STAFF"]),
  squad: z.enum(["first_team", "u23", "academy"]),
  nationalityEn: z.string().trim().min(2).max(60),
  nationalityAr: z.string().trim().min(2).max(60),
  imageUrl: z.string().trim().min(1),
  appearances: z.number().int().min(0).max(999).default(0),
  goals: z.number().int().min(0).max(999).default(0),
  assists: z.number().int().min(0).max(999).default(0),
  bioEn: z.string().trim().max(1000).default(""),
  bioAr: z.string().trim().max(1000).default(""),
});

export const playerUpdateSchema = playerSchema.partial();

export type LoginInput = z.infer<typeof loginSchema>;
export type EnquiryInput = z.infer<typeof enquirySchema>;
export type NewsArticleInput = z.infer<typeof newsArticleSchema>;
export type NewsArticleUpdateInput = z.infer<typeof newsUpdateSchema>;
export type MatchInput = z.infer<typeof matchSchema>;
export type MatchUpdateInput = z.infer<typeof matchUpdateSchema>;
export type PlayerInput = z.infer<typeof playerSchema>;
export type PlayerUpdateInput = z.infer<typeof playerUpdateSchema>;
