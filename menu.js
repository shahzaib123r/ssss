const { readFileSync } = require("fs");

module.exports = {
  name: "menu",
  description: "Show full Levi-MD menu with interface image",
  command: ["menu", "help"],
  async execute(sock, msg, args, from, sender) {
    try {
      // Interface image (replace with real interface.png)
      let menuImage = readFileSync("./assets/levi_banner");

      // Menu text
      let menuText = `
🌟 *Levi-MD Bot* 🌟
────────────────────
👤 User: @${sender.split("@")[0]}

📌 Available Commands:
────────────────────
1️⃣ Sticker Maker
2️⃣ 🎵 YouTube MP3
3️⃣ 🎥 YouTube MP4
4️⃣ 🤖 AI Chat
5️⃣ 📸 Instagram Download
6️⃣ 📘 Facebook Download
7️⃣ ✅ Alive
8️⃣ 🎭 Fun Menu
9️⃣ ℹ️ Info Menu
🔟 🔔 Welcome Message
────────────────────
💻 Powered by *Levi-MD*
      `;

      await sock.sendMessage(from, {
        image: menuImage,
        caption: menuText,
        mentions: [sender],
      }, { quoted: msg });

    } catch (e) {
      console.error("❌ Menu error:", e);
      await sock.sendMessage(from, { text: "⚠️ Menu display error!" }, { quoted: msg });
    }
  }
};
