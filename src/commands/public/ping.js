const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription(`Returns ping's bot`),
  async execute(interaction, client) {
    const sent = await interaction.reply({ content: "Pinging...", fetchReply: true });
    interaction.editReply(
      `Response ping: ${sent.createdTimestamp - interaction.createdTimestamp}ms`
    );
  },
};
