const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription(`Reload the bot's commands/events`)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((options) => options.setName("events").setDescription("Reload events"))
    .addSubcommand((options) => options.setName("commands").setDescription("Reload commands"))
    .addSubcommand((options) => options.setName("components").setDescription("Reload components")),

  execute(interaction, client) {
    const subCommand = interaction.options.getSubcommand();

    switch (subCommand) {
      case "events":
        {
          for (const [key, value] of client.events) client.removeListener(`${key}`, value, true);
          client.handleEvents();
          interaction.reply({ content: "Reloaded Events", ephemeral: true });
        }
        break;
      case "commands":
        {
          client.handleCommands();
          interaction.reply({ content: "Reloaded Commands", ephemeral: true });
        }
        break;
      case "components": {
        client.handleComponents();
        interaction.reply({ content: "Reloaded Components", ephemeral: true });
      }
    }
  },
};
