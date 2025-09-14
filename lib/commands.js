const fs = require('fs');
const path = require('path');

function loadPlugins(sock) {
  sock.plugins = new Map();
  const pluginsPath = path.join(__dirname, '../plugins');
  const files = fs.readdirSync(pluginsPath).filter(f => f.endsWith('.js'));

  for (const file of files) {
    const plugin = require(path.join(pluginsPath, file));

    // ✅ Agar plugin ek function export kare to usko wrap kar do
    const finalPlugin = (typeof plugin === 'function')
      ? { run: plugin, command: plugin.command, help: plugin.help, tags: plugin.tags }
      : plugin;

    if (finalPlugin && finalPlugin.command) {
      // Agar command ek array ho to uske har ek ko map me add karo
      if (Array.isArray(finalPlugin.command)) {
        for (const cmd of finalPlugin.command) {
          sock.plugins.set(cmd, finalPlugin);
        }
      } else {
        sock.plugins.set(finalPlugin.command, finalPlugin);
      }

      console.log(`✅ Loaded plugin: ${file} [${finalPlugin.command}]`);
    }
  }
}

function parseCommand(text, prefix) {
  if (!text.startsWith(prefix)) return null;

  const withoutPrefix = text.slice(prefix.length).trim();
  const [cmd, ...args] = withoutPrefix.split(/\s+/);

  return { 
    cmd, 
    args, 
    text: args.join(" "),   // ✅ full text wapas
    usedPrefix: prefix,     // ✅ prefix wapas
    command: cmd            // ✅ actual command wapas
  };
}

module.exports = { loadPlugins, parseCommand };
