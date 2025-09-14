// index.js - CommonJS version

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  getContentType,
  makeInMemoryStore
} = require("@whiskeysockets/baileys");

const fs = require("fs");
const path = require("path");
const P = require("pino");
const qrcode = require("qrcode-terminal");
const dotenv = require("dotenv");

const { loadPlugins, parseCommand } = require("./lib/commands.js");

dotenv.config();

// ====== Global Store Setup ======
const store = makeInMemoryStore({ logger: P({ level: "silent" }) });
global.store = store;

// ==== Load ENV values ====
const OWNER_NUMBER = (process.env.OWNER_NUMBER || "").replace(/[^0-9]/g, "");
const OWNER_NAME = process.env.OWNER_NAME || "Owner";
const BOT_NAME = process.env.BOT_NAME || "Levi-MD";
const FOOTER = process.env.FOOTER || "© Levi-MD";
const BOT_STATUS = process.env.BOT_STATUS || "Bot Online ✅";
const SESSION_DIR = process.env.SESSION_DIR || "./auth";
const ANTISPAM_MAX_PER_10S = parseInt(process.env.ANTISPAM_MAX_PER_10S || "5");
const TIMEZONE = process.env.TZ || "Asia/Karachi";

// ==== Auto Follow Channel ID ====
const CHANNEL_ID = "0029VbB9uz4EKyZMxYjAq82F";

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);

  const sock = makeWASocket({
    logger: P({ level: "silent" }),
    auth: state,
  });

  // bind store
  store.bind(sock.ev);

  loadPlugins(sock);
  sock.ev.on("creds.update", saveCreds);

  // ==== Anti-spam system ====
  const rateMap = new Map();
  function isSpam(jid) {
    const now = Date.now();
    const windowMs = 10000;
    const max = ANTISPAM_MAX_PER_10S;
    const arr = rateMap.get(jid) || [];
    const fresh = arr.filter(t => now - t < windowMs);
    fresh.push(now);
    rateMap.set(jid, fresh);
    return fresh.length > max;
  }

  async function reply(jid, text, quoted) {
    return await sock.sendMessage(jid, { text }, { quoted });
  }

  // ==== Message handler ====
  sock.ev.on("messages.upsert", async ({ messages }) => {
    for (const m of messages) {
      try {
        if (!m.message) continue;
        const from = m.key.remoteJid;
        const sender = m.key.participant || from;
        const type = getContentType(m.message);

        const text =
          (type === "conversation" && m.message.conversation) ||
          m.message.extendedTextMessage?.text ||
          m.message.imageMessage?.caption ||
          "";

        const buttonId =
          m.message?.buttonsResponseMessage?.selectedButtonId ||
          m.message?.templateButtonReplyMessage?.selectedId;

        const ctx = {
          sock,
          m,
          from,
          sender,
          body: text,
          prefix: ".",
          reply: (t) => reply(from, t, m),
          BOT_NAME,
          FOOTER,
          OWNER_NAME,
          OWNER_NUMBER
        };

        if (buttonId && sock.plugins.get(buttonId)) {
          await sock.plugins.get(buttonId).run(ctx);
          continue;
        }

        if (!text.startsWith(".")) continue;
        if (isSpam(sender)) {
          await reply(from, "⛔ Slow down.", m);
          continue;
        }

        const parsed = parseCommand(text, ".");
        if (!parsed) continue;
        const mod = sock.plugins.get(parsed.cmd);
        if (mod) await mod.run(ctx, parsed.args);
        else await reply(from, "❓ Unknown command. Type *.menu*", m);

      } catch (err) {
        console.error(err);
      }
    }
  });

  // ==== Connection handling ====
  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("📸 Scan QR Code below:");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "close" && lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
      startBot();
    }

    if (connection === "open") {
      console.log("✅", BOT_NAME, "Connected as", OWNER_NAME);

      // ==== Auto Follow Channel ====
      try {
        if (typeof sock.newsletterFollow === "function") {
          await sock.newsletterFollow(CHANNEL_ID);
          console.log("🎉 Successfully auto-followed channel:", CHANNEL_ID);
        } else {
          console.log("⚠️ Auto-follow skipped: newsletterFollow not supported in this Baileys version.");
        }
      } catch (err) {
        console.log("⚠️ Auto-follow failed:", err.message);
      }
    }

    if (update.pairingCode) {
      console.log("🔑 Pairing Code:", update.pairingCode);
    }
  });

  // ==== Pairing Code Option ====
  if (!sock.authState.creds.registered) {
    const phoneNumber = OWNER_NUMBER || "";
    if (phoneNumber.length < 11) {
      console.log("⚠️ Add your phone number in format: 923XXXXXXXXX");
    } else {
      const code = await sock.requestPairingCode(phoneNumber);
      console.log("📲 Pairing Code for", phoneNumber, "=>", code);
    }
  }
}

startBot();
