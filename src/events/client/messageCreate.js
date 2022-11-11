const { QuickDB } = require("quick.db");
const dbAntilink = new QuickDB();
const dbAntilinkSpecific = new QuickDB();

module.exports = {
  name: "messageCreate",
  async execute(message) {
    if (message.author.bot) return;
    let confirm = await dbAntilink.get(`${message.channel.id}`);
    const linksDB = await dbAntilinkSpecific.get(`links_${message.guild.id}.${message.channel.id}`);

    if (confirm === false || confirm === null) {
      return;
    } else if (confirm === true) {
      if (
        message.content.toLowerCase().includes("https://") ||
        message.content.toLowerCase().includes("http://") ||
        message.content.toLowerCase().includes("www.") ||
        message.content.toLowerCase().includes("discord.gg")
      ) {
        message.delete();
        message.channel.send(`${message.author} O sistema antilink está ativado!`);
      }
    }

    if (linksDB) {
      for (var i = 0; i < linksDB.length; i++) {
        if (message.content.toLowerCase().includes(`${linksDB[i]}`)) {
          message.delete();
          message.channel.send(
            `${message.author} O sistema antilink para o link ${linksDB[i]} está ativado!`
          );
        }
      }
    }
  },
};
