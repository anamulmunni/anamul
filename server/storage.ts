import { db } from "./db";
import { 
  permanentVerified, autoClaimSchedule, processedKeys,
  type InsertPermanentVerified, type InsertAutoClaim, type InsertProcessedKey,
  type PermanentVerified, type AutoClaimSchedule, type ProcessedKey
} from "@shared/schema";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  // Permanent Verified
  addPermanentVerified(entry: InsertPermanentVerified): Promise<PermanentVerified>;
  getPermanentVerified(): Promise<PermanentVerified[]>;
  
  // Auto Claim
  addAutoClaimSchedule(entry: InsertAutoClaim): Promise<AutoClaimSchedule>;
  getAutoClaimSchedule(address: string, network: string): Promise<AutoClaimSchedule | undefined>;
  
  // Processed Keys (Telegram Deduplication)
  getProcessedKey(keyHash: string): Promise<ProcessedKey | undefined>;
  addProcessedKey(keyHash: string): Promise<ProcessedKey>;
}

export class DatabaseStorage implements IStorage {
  // Permanent Verified
  async addPermanentVerified(entry: InsertPermanentVerified): Promise<PermanentVerified> {
    const [result] = await db.insert(permanentVerified)
      .values(entry)
      .onConflictDoUpdate({
        target: permanentVerified.address,
        set: { verifiedAt: new Date() }
      })
      .returning();
    return result;
  }

  async getPermanentVerified(): Promise<PermanentVerified[]> {
    return await db.select().from(permanentVerified).orderBy(sql`${permanentVerified.verifiedAt} DESC`);
  }

  // Auto Claim
  async addAutoClaimSchedule(entry: InsertAutoClaim): Promise<AutoClaimSchedule> {
    const [result] = await db.insert(autoClaimSchedule)
      .values(entry)
      .onConflictDoUpdate({
        target: [autoClaimSchedule.address, autoClaimSchedule.network],
        set: { 
          enabled: entry.enabled, 
          nextClaimTime: entry.nextClaimTime 
        }
      })
      .returning();
    return result;
  }

  async getAutoClaimSchedule(address: string, network: string): Promise<AutoClaimSchedule | undefined> {
    const [result] = await db.select()
      .from(autoClaimSchedule)
      .where(
        sql`${autoClaimSchedule.address} = ${address} AND ${autoClaimSchedule.network} = ${network}`
      );
    return result;
  }

  // Processed Keys
  async getProcessedKey(keyHash: string): Promise<ProcessedKey | undefined> {
    const [result] = await db.select()
      .from(processedKeys)
      .where(eq(processedKeys.keyHash, keyHash));
    return result;
  }

  async addProcessedKey(keyHash: string): Promise<ProcessedKey> {
    const [result] = await db.insert(processedKeys)
      .values({ keyHash })
      .returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
