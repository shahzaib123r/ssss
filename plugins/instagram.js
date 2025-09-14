const axios = require("axios");

module.exports = {
  command: ["ig", "insta", "instagram"],
  description: "Download Instagram reels/videos",
  async run(ctx, args) {
    if (!args[0] || !args[0].includes("instagram.com")) {
      return ctx.reply(
        "❌ Please provide a valid Instagram link.\n\nExample:\n.ig https://www.instagram.com/reel/xxxxx/"
      );
    }

    const igUrl = args[0].trim();

    const apis = [
      `https://kaiz-apis.gleeze.com/api/insta-dl?url=${encodeURIComponent(
        igUrl
      )}&apikey=17149602-15c7-4cf3-abd5-60e866eed31f`,
      `https://delirius-apiofc.vercel.app/download/instagram?url=${encodeURIComponent(
        igUrl
      )}`,
    ];

    let videoUrl = null;
    let title = "Instagram Video";
    let apiUsed = null;

    for (const api of apis) {
      try {
        const { data } = await axios.get(api, { timeout: 20000 });

        // 🎥 Kaiz API
        if (data?.result?.video_url) {
          videoUrl = data.result.video_url;
          title = data.result.title || "Instagram Video";
          apiUsed = "Kaiz API";
          break;
        }

        // 🎥 Delirius API
        if (data?.data?.[0]?.url) {
          videoUrl = data.data[0].url;
          title = "Instagram Video";
          apiUsed = "Delirius API";
          break;
        }
      } catch (err) {
        console.log(`⚠ IG API failed: ${api} | ${err.message}`);
      }
    }

    if (!videoUrl) {
      return ctx.reply("❌ All Instagram APIs failed. Please try again later.");
    }

    try {
      await ctx.sock.sendMessage(
        ctx.from,
        {
          video: { url: videoUrl },
          caption: `✅ Instagram Video Downloaded\n\n🎥 Title: ${title}\n🔗 Source: ${apiUsed}`,
        },
        { quoted: ctx.m }
      );
    } catch (err) {
      console.log("⚠ Send video failed:", err.message);
      await ctx.reply(`✅ Video Link:\n${videoUrl}`);
    }
  },
};
