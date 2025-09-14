const { useMultiFileAuthState, makeInMemoryStore } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');

async function setupAuth(sessionDir) {
  if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
  const store = makeInMemoryStore({ logger: pino({ level: 'silent' }) });
  return { state, saveCreds, store };
}

module.exports = { setupAuth };
