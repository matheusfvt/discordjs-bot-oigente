const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientId, guildId } = require("../../../config.json");
const fs = require("fs");

module.exports = (client) => {
  client.handleCommands = async () => {
    await client.commands.clear();

    let commandArray = [];

    const commandFolders = fs.readdirSync(`./src/commands`);

    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`./src/commands/${folder}`)
        .filter((file) => file.endsWith(".js"));

      for (const file of commandFiles) {
        const command = require(`../../commands/${folder}/${file}`);
        client.commands.set(command.data.name, command);
        commandArray.push(command.data.toJSON());
        console.log(`✅ Command ${command.data.name} has been passed through`);
      }
    }

    const rest = new REST({ version: "9" }).setToken(process.env.token);

    try {
      console.log(`Started refreshing ${commandArray.length} application (/) commands.`);

      const data = await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: commandArray,
      });

      console.log(`Successfully reloaded ${data.length} application (/) commands.`);
      console.log("------------------------------------------------");
    } catch (error) {
      console.error(error);
    }
  };
};
