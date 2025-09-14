const axios = require("axios");

module.exports = {
  command: ["fb", "facebook"],
  description: "Download Facebook videos/reels",
  async run(ctx, args) {
    if (!args[0] || !args[0].includes("facebook.com")) {
      return ctx.reply(
        "❌ Please provide a valid Facebook video link.\n\nExample:\n.fb https://www.facebook.com/reel/xxxxx/"
      );
    }

    const fbUrl = args[0].trim();

    // Kaiz API endpoint
    const api = `https://kaiz-apis.gleeze.com/api/fbdl-v2?url=${encodeURIComponent(
      fbUrl
    )}&apikey=17149602-15c7-4cf3-abd5-60e866eed31f`;

    let videoUrl = null;
    let title = "Facebook Video";
    let quality = "Unknown";

    try {
      const { data } = await axios.get(api, { timeout: 20000 });

      if (data?.result) {
        title = data.result.title || title;
        if (data.result.hd) {
          videoUrl = data.result.hd;
          quality = "HD";
        } else if (data.result.sd) {
          videoUrl = data.result.sd;
          quality = "SD";
        }
      }
    } catch (err) {
      console.log("⚠ FB API failed:", err.message);
    }

    if (!videoUrl) {
      return ctx.reply("❌ Could not fetch Facebook video. Please try again later.");
    }

    try {
      await ctx.sock.sendMessage(
        ctx.from,
        {
          video: { url: videoUrl },
          caption: `✅ Facebook Video Downloaded\n🎥 Title: ${title}\n📌 Quality: ${quality}\n🔗 Source: Kaiz API`,
        },
        { quoted: ctx.m }
      );
    } catch (err) {
      console.log("⚠ Send video failed:", err.message);
      await ctx.reply(`✅ Video Link (${quality}):\n${videoUrl}`);
    }
  },
};
