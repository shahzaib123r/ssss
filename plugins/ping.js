require('dotenv').config();

module.exports = {
  command: 'ping',
  async run(ctx) {
    const { sock, m, from } = ctx;
    const start = Date.now();

    // Pehla reply (loading effect)
    await sock.sendMessage(from, { text: "*_♻ Testing ping..._*" }, { quoted: m });

    const end = Date.now();
    const ping = end - start;

    // Final reply
    await sock.sendMessage(from, { 
      text: `*_🚀 PONG: ${ping}ms_*

> *By Malik & Shahzaib*
> > © Levi-MD` 
    }, { quoted: m });
  }
};
