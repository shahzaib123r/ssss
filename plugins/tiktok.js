const axios = require("axios");

module.exports = {
  command: "tiktok",
  description: "Download TikTok video",
  async run(ctx, args) {
    if (!args[0]) {
      return ctx.reply(
        "❌ Please provide a TikTok video link.\n\nExample:\n.tiktok https://vt.tiktok.com/xxxx"
      );
    }

    const videoUrl = args[0];

    // List of TikTok APIs
    const apis = [
      process.env.TIKTOK_API, // from .env (optional)
      "https://www.tikwm.com/api/",
      "https://www.tikmate.app/api/lookup"
    ].filter(Boolean); // remove undefined/null

    let videoData = null;
    let apiUsed = null;

    for (const api of apis) {
      try {
        const { data } = await axios.get(
          `${api}?url=${encodeURIComponent(videoUrl)}`
        );

        // Normalize TikTok API responses
        if (data?.video?.noWatermark) {
          videoData = {
            url: data.video.noWatermark,
            title: data.title || "Unknown"
          };
        } else if (data?.data?.play) {
          videoData = {
            url: data.data.play,
            title: data.data.title || "Unknown"
          };
        }

        if (videoData) {
          apiUsed = api;
          break;
        }
      } catch (err) {
        console.log(`⚠ API failed: ${api} | ${err.message}`);
      }
    }

    if (!videoData) {
      return ctx.reply("❌ All TikTok APIs failed. Please try again later.");
    }

    // Send video
    await ctx.sock.sendMessage(
      ctx.from,
      {
        video: { url: videoData.url },
        caption: `✅ TikTok Video Downloaded\n\n🎥 Title: ${videoData.title}\n🔗 Source: ${apiUsed}`
      },
      { quoted: ctx.m }
    );
  }
};
