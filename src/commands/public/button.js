const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("button").setDescription(`Returns a button for test`),
  async execute(interaction, client) {
    const button = new ButtonBuilder()
      .setCustomId("test")
      .setLabel("Click Here")
      .setStyle(ButtonStyle.Primary);

    await interaction.reply({
      components: [new ActionRowBuilder().addComponents(button)],
    });
  },
};
